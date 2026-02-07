import { NextApiRequest, NextApiResponse } from "next";
import { middlewareConfig } from "@utils/sfcc-connector/config";
import { sendEmail } from "@utils/helpers/emailHelper";
const newsletterAPI = middlewareConfig.parameters.api + '/newsletter';
const mailchimp = require("@mailchimp/mailchimp_marketing");

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method;
    const body = req?.body !== "" ? JSON.parse(req?.body) : null;
    const query = req.query.api ?? "";
    const action = req.query.action ?? "";
    const locale = req.query.locale === "undefined" ? "en-AE": req.query.locale as string;
    const isKSALocale = locale?.toString().toLowerCase().includes("-sa");
    const mailchimpApiKey = isKSALocale ? process.env.MC_API_KEY_KSA : process.env.MC_API_KEY;
    const mailchimpServer = isKSALocale ? process.env.MC_SERVER_PREFIX_KSA : process.env.MC_SERVER_PREFIX;
    const mailchimpListId = isKSALocale ? process.env.MC_LIST_ID_KSA : process.env.MC_LIST_ID;

    switch (query) {
        case "newsletter":
            try {
                if (requestMethod === "POST" && action === "subscription") {
                    const { email, isSubscribed } = body;

                    const apiKey = mailchimpApiKey?.toString() ?? "";
                    const server = mailchimpServer?.toString() ?? "";

                    if (!apiKey || !server) {
                        console.error(`Missing required environment variables for Mailchimp (${isKSALocale ? 'KSA' : 'UAE'})`);
                        return res.status(500).json({ error: 'Configuration error' });
                    }

                    mailchimp.setConfig({
                        apiKey: apiKey,
                        server: server
                    });

                    const listId = mailchimpListId?.toString() ?? "";
                    
                    if (!listId) {
                        console.error(`Missing MC_LIST_ID environment variable for ${isKSALocale ? 'KSA' : 'UAE'}`);
                        return res.status(500).json({ error: 'Configuration error' });
                    }

                    const subscribingUser = {
                        firstName: "",
                        lastName: "",
                        email: email
                    };



                    let emailInfo : any;

                    async function run() {
                        try {
                            const response = await mailchimp.lists.addListMember(listId, {
                                email_address: subscribingUser.email,
                                status: "subscribed",
                                merge_fields: {
                                FNAME: subscribingUser.firstName,
                                LNAME: subscribingUser.lastName
                                }
                            });
                            console.log(response);
                            //TODO: Update based on new sendEmail refactored code
                            emailInfo = await sendEmail({email: email}, "newsletter", locale);

                            return res.status(200).json({ isError: false, status:200, response: emailInfo  });

                        } catch (e) {

                            if (e.status === 400) {
                                console.error(e);
                                return res.status(200).json({ isError: false, status:400, response: emailInfo  });
                               
                            }

                            if (e.status === 404) {
                                console.error(e);
                                return {
                                    statusCode: 500,
                                    body: JSON.stringify({ msg: e.body }),
                                };
                            }
                           
                        }
                    }

                    run();

                    /* TODO: The below code is for mulesoft API integration - upsert API
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
                            email: email,
                            isSubscribed: isSubscribed,
                            source: middlewareConfig.parameters.source,
                        }),
                    };

                    const response = await fetch(newsletterAPI, options);
                    const result = await response.json();

                    if (!response.ok) {
                        console.log("Newsletter request submission failed.");
                        return res.status(400).json({ isError: true, response: result });
                    }
                    
                    if (result.message === "success" && result.code === 200) {
                        // console.log("newsletter : " + JSON.stringify(result, null, 4));

                        // send email - nodemailer
                        var emailInfo : any;
                        if (isSubscribed) { // subscribed email
                            const subject = "Seddiqi Newsletter Communication";
                            const htmlContent = "You have been successfully subscribed to Seddiqi newsletter.";
                            emailInfo = await sendEmail(email, subject, htmlContent);
                        } else { // unsubscribed email
                            const subject = "Seddiqi Newsletter Communication";
                            const htmlContent = "You have been successfully unsubscribed to our newsletter on Seddiqi.";
                            emailInfo = await sendEmail(email, subject, htmlContent);
                        }
                        if (emailInfo.success) {
                            console.log("Email sent successfully");
                        } else {
                            console.log("Email failed");
                        }
                        return res.status(200).json({ isError: false, response: result, email: emailInfo });
                    } else {
                        console.log("Subscription Failed.");
                        return res.status(400).json({ isError: true, response: "Subscription Failed." });
                    }*/

                    // send email - nodemailer
                    /*
                    var emailInfo : any;
                    if (isSubscribed) { // subscribed email
                        const subject = "Seddiqi Newsletter Communication";
                        const htmlContent = "You have been successfully subscribed to Seddiqi newsletter.";
                        emailInfo = await sendEmail(email, subject, htmlContent);
                    } else { // unsubscribed email
                        const subject = "Seddiqi Newsletter Communication";
                        const htmlContent = "You have been successfully unsubscribed to our newsletter on Seddiqi.";
                        emailInfo = await sendEmail(email, subject, htmlContent);
                    }
                    if (emailInfo.success) {
                        console.log("Email sent successfully");
                    } else {
                        console.log("Email failed");
                    }

                    return res.status(200).json({ isError: false, status:200, response: emailInfo  });
                    */
                    
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
