// emailHelper.ts
import nodemailer from "nodemailer";
import { sanitizeHtmlInput, sanitizeInput } from ".";


const getFieldValue = (field) => (Array.isArray(field) ? field[0] : field);

const emailText = (emailType: "contact" | "otp" | "customer" | "newsletter", emailTextDynamicValue?: string) => {
  switch (emailType) {
    case "contact":
      return {subject: "Seddiqi - Support Team", bodyText: `Hi ${emailTextDynamicValue},<br/><br/>We have received your query and will get back to you shortly.`};
    case "otp":
      return {subject: "Seddiqi OTP", bodyText: `Your one time password (OTP) is: ${emailTextDynamicValue}.`};
    case "customer": 
      return { subject:"Account Registration Completed", bodyText: `Hey ${emailTextDynamicValue},<br/><br/>You have successfully registered on Seddiqi.com`}
    case "newsletter":
      return { subject: "Seddiqi Newsletter Communication", bodyText: "You have been successfully subscribed to Seddiqi newsletter."}
  }
};

export const sendEmail = async (
  fields: any,
  emailType: "contact" | "otp" | "customer" | "newsletter",
  locale?: string,
) => {
  
  const emailTextDynamicValue = sanitizeInput(
    getFieldValue(fields.firstName ?? fields.token ?? "")
  );
  const email = sanitizeInput(getFieldValue(fields.email));



  const isKsa = locale?.toLowerCase().includes("-sa");
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: isKsa ? process.env.KSA_SMTP_USER : process.env.SMTP_USER,
      pass: isKsa ? process.env.KSA_SMTP_PASSWORD : process.env.SMTP_PASSWORD,
    },
  });

  // Email options
  const mailOptions = {
    from: isKsa ? process.env.KSA_SMTP_USER : process.env.SMTP_USER, // Sender address `"Seddiqi Contact Us Form" <noreply@seddiqi.com>`,
    to: email,
    subject: emailText(emailType, emailTextDynamicValue).subject,
    html:  emailText(emailType, emailTextDynamicValue).bodyText,
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return {
      success: true,
      message: "EmailHelper sendEmail: Email sent successfully",
    };
  } catch (error) {
    console.error("EmailHelper sendEmail -- Error sending email:", error);
    return {
      success: false,
      message: "EmailHelper sendEmail -- Failed to send email",
    };
  }
};

export const sendEmailWithAttachment = async (
  fields: any,
  file: any,
  locale?: string
) => {
  const isKsa = locale?.toLowerCase().includes("-sa");
  // Configure the transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: isKsa ? process.env.KSA_SMTP_USER : process.env.SMTP_USER,
      pass: isKsa ? process.env.KSA_SMTP_PASSWORD : process.env.SMTP_PASSWORD,
    },
  });

  const emailBody = `
    <p>Please find the details provided by the customer below:</p>
    <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
      <tr>
        <th>Email</th>
        <td>${sanitizeHtmlInput(getFieldValue(fields.email))}</td>
      </tr>
      <tr>
        <th>First Name</th>
        <td>${sanitizeHtmlInput(getFieldValue(fields.firstName))}</td>
      </tr>
      <tr>
        <th>Last Name</th>
        <td>${sanitizeHtmlInput(getFieldValue(fields.lastName))}</td>
      </tr>
      <tr>
        <th>Type</th>
        <td>${sanitizeHtmlInput(getFieldValue(fields.type))}</td>
      </tr>
      <tr>
        <th>Message</th>
        <td>${sanitizeHtmlInput(getFieldValue(fields.message))}</td>
      </tr>
      <tr>
        <th>Phone Number</th>
        <td>${sanitizeHtmlInput(getFieldValue(fields.phoneNumber))}</td>
      </tr>
      <tr>
        <th>Email Marketing Opt-In</th>
        <td>${
          sanitizeHtmlInput(getFieldValue(fields.emailMarketing)) === "true"
            ? "Yes"
            : "No"
        }</td>
      </tr>
      <tr>
        <th>Privacy Policy</th>
        <td>${
          getFieldValue(fields.privacyPolicy) === "true" ? "Yes" : "No"
        }</td>
      </tr>
    </table>
  `;

  // Email options
  const mailOptions = {
    from: isKsa ? process.env.KSA_SMTP_USER : process.env.SMTP_USER, // Sender address `"Seddiqi Contact Us Query" <noreply@seddiqi.com>`,
    to: isKsa
      ? process.env.KSA_SEDDIQI_SUPPORT_EMAIL
      : process.env.SEDDIQI_SUPPORT_EMAIL,
    subject: "Ahmed Seddiqi - Contact Us Query",
    html: emailBody,
    ...(file &&
      file.originalFilename && {
        attachments: [
          {
            filename: file.originalFilename,
            path: file.filepath,
          },
        ],
      }),
  };

  // Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return {
      success: true,
      message: "EmailHelper sendEmailwithAttachment: Email sent successfully",
    };
  } catch (error) {
    console.error(
      "EmailHelper sendEmailwithAttachment -- Error sending email:",
      error
    );
    return {
      success: false,
      message: "EmailHelper sendEmail -- Failed to send email",
    };
  }
};
