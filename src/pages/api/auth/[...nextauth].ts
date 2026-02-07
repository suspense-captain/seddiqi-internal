import { getCustomer, loginCustomer } from "@utils/sfcc-connector/dataService";
import { Customer } from "commerce-sdk";
import { TokenResponse } from "commerce-sdk/dist/helpers/slasClient";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { SessionCustomer } from "./next-auth";

const getCustomerProfile = async (customerId, accessToken) => {
  const salesforceProfile: Customer.ShopperCustomers.Customer = await getCustomer(customerId, accessToken);

  if (!salesforceProfile || salesforceProfile.isError) {
    return null;
  }

  return salesforceProfile.response;
};

const handleLogin = async (email, password) => {
  const salesforceLoginResponse: TokenResponse = await loginCustomer({
    userData: JSON.stringify({
      username: email,
      password: password,
    }),
    method: "POST",
  });

  if (!salesforceLoginResponse || salesforceLoginResponse.isError) {
    return null;
  }

  const customer = await getCustomerProfile(
    salesforceLoginResponse?.response?.customer_id,
    salesforceLoginResponse?.response?.access_token
  );

  if (!customer) {
    return null;
  }

  customer.tokenId = salesforceLoginResponse.response.id_token;
  customer.refreshToken = salesforceLoginResponse.response.refresh_token;

  return customer;
};

const handleRegistration = async (registrationPayload) => {
  const customer = await getCustomerProfile(
    registrationPayload.customer_id,
    registrationPayload.access_token
  );

  if (!customer) {
    return null;
  }

  customer.tokenId = registrationPayload.id_token;
  customer.refreshToken = registrationPayload.refresh_token;

  return customer;
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        registrationPayload: { label: "Registration Payload", type: "string" },
      },
      async authorize(credentials) {
        const registrationPayload = credentials?.registrationPayload
        ? JSON.parse(credentials.registrationPayload)
        : null;

        if (registrationPayload) {
          return await handleRegistration(registrationPayload);
        } else {
          return await handleLogin(credentials?.email, credentials?.password);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.customer = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.customer as SessionCustomer;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET
});
