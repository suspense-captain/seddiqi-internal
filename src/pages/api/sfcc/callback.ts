import { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from "@utils/helpers/emailHelper";

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  const locale = Array.isArray(req.query.locale) ? req.query.locale[0] : req.query.locale ?? "";
  try {
    console.log("Callback hit!!!");
    if (req.method === 'POST') {
      // Extract necessary data from request body
      const { email_id, customer_id, token } = req.body;

      // Log the received data (for debugging purposes)
      console.log("Received request:", req.body);

      // Process the OTP - Email or SMS
      // send email - nodemailer
      //TODO: Update based on new sendEmail refactored code
      const emailInfo = await sendEmail({email: email_id, token: token}, "otp", locale);
      if (emailInfo.success) {
          console.log("Email sent successfully");
      } else {
          console.log("Email failed");
      }

      return res.status(200).json({ message: "OTP received", otp: token, customer_id, email_id });
    } else {
      // Handle unsupported methods
      return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}