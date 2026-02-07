import { NextApiRequest, NextApiResponse } from "next";
import formidable from 'formidable';
import { middlewareConfig } from "@utils/sfcc-connector/config";
import { sendEmail, sendEmailWithAttachment } from "@utils/helpers/emailHelper";
import { sanitizeInput } from "@utils/helpers";
const contactAPI = middlewareConfig.parameters.api + '/contact';
const getFieldValue = (field) => Array.isArray(field) ? field[0] : field;

export const config = {
    api: {
      bodyParser: false, // Disable body parsing to handle file uploads
      externalResolver: true,
    },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method;
    const query = req.query.api ?? "";
    const action = req.query.action ?? "";
    const locale = Array.isArray(req.query.locale) ? req.query.locale[0] : req.query.locale ?? "";


    switch (query) {
        case "contact":
            try {
                if (requestMethod === "POST" && action === "contactUsSubmission") {
                    const form = formidable({
                        multiple: false,
                        encoding: 'utf-8',
                        maxFieldsSize: 10 * 1024 * 1024,
                        keepExtensions: true,
                    });
                    form.parse(req, async (err, fields, files) => {
                        
                        /* TODO: The below code is for Mulesoft API integration
                        if (err) {
                            console.error("Error parsing form:", err);
                            return res.status(500).json({ isError: true, message: "Form parsing error" });
                        }

                        const options = {
                            method: requestMethod,
                            headers: {
                                'Content-Type': 'application/json',
                                'client_id': middlewareConfig.parameters.client_id,
                                'client_secret': middlewareConfig.parameters.client_secret,
                                'storeCode': middlewareConfig.parameters.storeCode,
                                'x-correlation-id': middlewareConfig.parameters.x_correlation_id,
                            },
                            body: JSON.stringify({
                                email: getFieldValue(fields.email),
                                firstName: getFieldValue(fields.firstName),
                                lastName: getFieldValue(fields.lastName),
                                orderReferenceNumber: getFieldValue(fields.orderReferenceNumber),
                                type: getFieldValue(fields.type),
                                message: getFieldValue(fields.message),
                                phoneNumber: getFieldValue(fields.phoneNumber),
                                source: middlewareConfig.parameters.source,
                            }),
                        };

                        const response = await fetch(contactAPI, options);
                        const result = await response.json();
                        
                        if (!response.ok) {
                            console.log("Contact us form submission failed.");
                            return res.status(400).json({ isError: true, response: result });
                        }

                        if (result.message === "success" && result.code === 200) {
                            // console.log("contact us : " + JSON.stringify(result, null, 4));
                            
                            // send email to customer - nodemailer
                            const subject = "Seddiqi - Support Team";
                            const htmlContent = "Hi " + getFieldValue(fields.firstName)+ "," + "\n We have received your query and will get back to you shortly.";
                            const emailInfo = await sendEmail(getFieldValue(fields.email), subject, htmlContent);
                            if (emailInfo.success) {
                                console.log("Email sent successfully");
                            } else {
                                console.log("Email failed");
                            }

                            // check attachment in the form, if available then send to customer support
                            if (files.attachment) {
                                const file = files.attachment[0];
                                
                                // send email with attachment to customer support
                                const emailAttachment = await sendEmailWithAttachment(file);
                                if (emailAttachment.success) {
                                    console.log("Attachment sent successfully");
                                } else {
                                    console.log("Attachment Email failed");
                                }
                            }
                            return res.status(200).json({ isError: false, response: result });
                        } else {
                            console.log("Request submission failed.");
                            return res.status(400).json({ isError: true, response: result });
                        }*/

                        // send email to customer - nodemailer
                        //TODO: Update based on new sendEmail refactored code
                        const emailInfo = await sendEmail(fields, "contact", locale);
                        
                        if (emailInfo.success) {
                            console.log("Contact -- Email sent successfully");
                        } else {
                            console.log("Contact -- Email failed");
                            return res.status(400).json({ isError: true, emailInfo });
                        }

                        // send email to support (with attachment if any) - nodemailer
                        const file = files.attachment ? files.attachment[0] : null;
                        const emailAttachment = await sendEmailWithAttachment(fields, file, locale);
                        if (emailAttachment.success) {
                            console.log("Contact -- Attachment sent successfully");
                            return res.status(200).json({ isError: false, emailAttachment });
                        } else {
                            console.log("Contact -- Attachment Email failed");
                            return res.status(400).json({ isError: true, emailAttachment });
                        }
                    });
                }
            } catch(err) {
                console.error(err);
      
                return res.status(500).json({ error: 'Internal server error' });
            }
        break;
        default:
            return res.status(400).json({ isError: true });
    }
}

export default handler;
