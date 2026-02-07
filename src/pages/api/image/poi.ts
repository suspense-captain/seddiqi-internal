import HTTP_SERVICE from '@utils/helpers/fetchHttpService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  try {

    // const result = await HTTP_SERVICE.GET(GOOGLE_RECAPTCHA_BASE_URL, apiUrl);

    //   return res.status(200).json({ message: "OTP received", otp: token, customer_id, email_id });
    //  else {
    //   // Handle unsupported methods
    //   return res.status(405).json({ message: "Method not allowed" });
    // }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}