import { DefaultSession } from "next-auth";
import { Customer } from "commerce-sdk";

export type SessionCustomer = Customer.ShopperCustomers.Customer & {
  tokenId: string;
  refreshToken: string;
};

declare module "next-auth" {
  interface Session {
    user: SessionCustomer;
  }
}
