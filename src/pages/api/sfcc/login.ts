import { NextApiRequest, NextApiResponse } from "next";
import { Customer, slasHelpers } from "commerce-sdk";
import initializeShopperConfig, { basicAuthorization, clientConfig, getRefereshTokenResponse } from "@utils/sfcc-connector/config";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestMethod = req.method;
  const body = req?.body !== "" ? JSON.parse(req?.body) : null;
  const query = req.query.api ?? "";
  const action = req.query.action ?? "";

  switch (query) {
    case "login":
      try {
        if (requestMethod === "POST" && action === "loginCustomer") {
          const { username, password} = body;
          const client = new Customer.ShopperLogin(clientConfig);

          const registeredUserTokenResponse = await slasHelpers.loginRegisteredUserB2Cprivate(client, 
            { clientSecret: clientConfig.parameters.clientSecret, password: password, username: username }, {redirectURI: process.env.REDIRECT_URI}
          );

          /** Things to do after getting the token
           * Save token, refresh_token, and customerID in a session
           * get the customer profile object and return to front-end (done)
           * refreshToken API implementation (done)
           * token expiry track (handled in config.ts --> getRefereshTokenResponse)
           */

          /** Get refresh token 
          const newToken = await getRefereshTokenResponse(registeredUserTokenResponse.refresh_token);
          console.log("Refresh Token: " + JSON.stringify(newToken, null, 4)); */

          return res.status(200).json({ isError: false, response: registeredUserTokenResponse });
        }
      } catch (err) {
        // return res.status(400).json({ isError: true, response: err });
        const errorData = await err.response?.text(); 
        console.error("Error response body:", JSON.parse(errorData));
        return res.status(500).json({ isError: true, response: JSON.parse(errorData) });
 
      }
      break;
    
    case "passwordlessLogin":
      try {
        if (requestMethod === "POST" && action === "passwordlessLoginCustomer") {
          const { username } = body;
          const base64data = await basicAuthorization();
          const client = new Customer.ShopperLogin(clientConfig);

          const options = {
              headers: {
                  Authorization: `Basic ${base64data}`,
              },
              parameters: {
                  organizationId: clientConfig.parameters.organizationId
              },
              body: {
                  callback_uri: 'https://093d-2001-818-e854-f900-15b6-123e-2103-5443.ngrok-free.app/api/sfcc/callback', // process.env.REDIRECT_URI, // 'https://webhook.site/51413cd1-ff8e-43a0-95cf-e92c61870d44',
                  channel_id: clientConfig.parameters.siteId,
                  mode: "callback",
                  user_id: username,
              },
          };

          const TokenResponse = await client.authorizePasswordlessCustomer(options);
          // console.log("PasswordLess Login Response: ", TokenResponse);
          
          return res.status(200).json({ isError: false, response: TokenResponse });
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ isError: true, response: err });
      }
      break;

    case "passwordlessAccessToken":
      try {
        if (requestMethod === "POST" && action === "getAccessToken") {
          const { otp } = body;
          const base64data = await basicAuthorization();
          const client = new Customer.ShopperLogin(clientConfig);

          const options = {
              headers: {
                  Authorization: `Basic ${base64data}`,
              },
              parameters: {
                  organizationId: clientConfig.parameters.organizationId
              },
              body: {
                  client_id: clientConfig.parameters.clientId,
                  grant_type: "client_credentials",
                  hint: "pwdless_login",
                  pwdless_login_token: otp,
              },
          };

          const TokenResponse = await client.getPasswordLessAccessToken(options);
          // console.log("Login Token Response: ", TokenResponse);
          return res.status(200).json({ isError: false, response: TokenResponse });
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ isError: true, response: err });
      }
      break;
    
    case "logout":
      try {
        if (requestMethod === "POST" && action === "logoutCustomer") {
          const { refreshToken } = body;
          const configWithAuth = await initializeShopperConfig();
          const accessToken = configWithAuth.access_token;
          const client = new Customer.ShopperLogin(clientConfig);

          const options = {
              headers: {
                  Authorization: `Bearer ${accessToken}`,
              },
              parameters: {
                  channel_id: clientConfig.parameters.siteId,
                  client_id: clientConfig.parameters.clientId,
                  organizationId: clientConfig.parameters.organizationId,
                  refresh_token: refreshToken
              },
          };

          const TokenResponse = await client.logoutCustomer(options);
          console.log("Logout Token Response: ", TokenResponse);
          return res.status(200).json({ isError: false, response: TokenResponse });          
        }
      } catch (err) {
        console.error(err);
        return res.status(500).json({ isError: true, response: err });
      }
      break;
    default:
      return res.status(400).json({ isError: true });
  }
};

export default handler;
