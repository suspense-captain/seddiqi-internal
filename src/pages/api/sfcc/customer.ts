import { NextApiRequest, NextApiResponse } from 'next'
import { Customer, slasHelpers } from "commerce-sdk";
import initializeShopperConfig,  { clientConfig, OAuthTokenFromAM, basicAuthorization } from "@utils/sfcc-connector/config";
import { middlewareConfig, getGuestTokenResponse, getShopperTokenResponse } from "@utils/sfcc-connector/config";
import { sendEmail } from "@utils/helpers/emailHelper";
import saveGoldenIDToCustomerProfile, { generateRandomString, generateCodeChallenge }from "@utils/sfcc-connector/customerUtils";
const customerAPI = middlewareConfig.parameters.api + '/customer';
 
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method;
    const body = req?.body !== "" ? JSON.parse(req?.body) : null;
    const query = req.query.api ?? "";
    const action = req.query.action ?? "";
    const locale = Array.isArray(req.query.locale) ? req.query.locale[0] : req.query.locale ?? "";

    switch (query) {
        case "register":
            try {
                if (requestMethod === "POST" && action === "registerCustomer") {
                    const { salutation, fname, lname, phone, email, password, marketingCommunication, privacyPolicy } = body;
                    const configWithAuth = await initializeShopperConfig();
                    const access_token = configWithAuth.access_token;
                    const usid = configWithAuth.usid;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                        Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId
                        },
                        body: {
                            password: password,
                            customer: {
                                salutation: salutation,
                                login: email,
                                email: email,
                                firstName: fname,
                                lastName: lname,
                                phoneMobile: phone,
                                "c_as&sCommunication": marketingCommunication,
                                "c_terms&Conditions": privacyPolicy,
                            },
                        },
                    };

                    var shopperResponse = await client.registerCustomer(options);
                    console.log("SFCC Customer: " + JSON.stringify(shopperResponse));

                    // send email - nodemailer
                    //TODO: Update based on new sendEmail refactored code
                    const emailInfo = await sendEmail({email: email, firstName: fname}, "customer", locale);
                    if (emailInfo.success) {
                        console.log("Email sent successfully");
                    } else {
                        console.log("Email failed");
                    }
                    
                    if (shopperResponse.customerNo) {
                        /** TODO: call to upsert API to get Golden ID 
                        const upsertOptions = {
                            method: requestMethod,
                            headers: {
                                'Content-Type': 'application/json',
                                'client_id': middlewareConfig.parameters.client_id,
                                'client_secret': middlewareConfig.parameters.client_secret,
                                'storeCode': middlewareConfig.parameters.storeCode,
                                'x-correlation-id': middlewareConfig.parameters.x_correlation_id,
                            },
                            body: JSON.stringify({
                                customerId: shopperResponse.customerId,
                                firstName: shopperResponse.firstName,
                                lastName: shopperResponse.lastName,
                                email: shopperResponse.email,
                                source: middlewareConfig.parameters.source,
                                registrationDate: new Date(shopperResponse.creationDate).toISOString().split('T')[0],
                                lastModifiedTimestamp: shopperResponse.lastModified,
                                preferredLanguage: shopperResponse.preferredLocale,
                                phoneNumber: shopperResponse.phoneMobile,
                                emailOptIn: marketingCommunication,
                                smsOptIn: false,
                                whatsappOptIn: false,
                                isGuestCustomer: false
                            }),
                        };

                        const response = await fetch(customerAPI, upsertOptions);
                        const result = await response.json();

                        if (!response.ok) {
                            console.log("ERROR: Unable to get customer Golden ID.");
                            return res.status(400).json({ isError: true, response: result });
                        }
                        
                        if (result.action === "insert" && result.sfCustomerId) {
                            // console.log("customer : " + JSON.stringify(result, null, 4));
                            /* save the golden ID in SFCC customer profile 
                                1. update the customer profile with golden ID
                            shopperResponse = {...shopperResponse}
                            shopperResponse.currentPassword = password;
                            shopperResponse.usid = usid;
                            
                            // Get the shopper token and customer ID
                            const response = await saveGoldenIDToCustomerProfile(shopperResponse, result.sfCustomerId);
                            return res.status(200).json({ isError: false, response: { response, result} });
                        } else {
                            console.log("Failed to get Golden ID.");
                            return res.status(400).json({ isError: true, response: "Failed to get Golden ID." });
                        } */

                        shopperResponse = {...shopperResponse}
                        shopperResponse.currentPassword = password;
                        shopperResponse.usid = usid;

                        // Get the shopper token and customer ID
                        const response = await saveGoldenIDToCustomerProfile(shopperResponse, null);
                        if (response.access_token) {
                            return res.status(200).json({ isError: false, response: { response } });
                        } else {
                            return res.status(400).json({ isError: true, response: { response } });
                        }
                    } else {
                        console.log("Registration Failed.");
                        return res.status(400).json({ isError: true, response: shopperResponse });
                    }
                }
            } catch (error) {
                // read the response body for more details
                const errorData = await error.response?.text(); 
                console.error("Error response body:", JSON.parse(errorData));
                return res.status(500).json({ isError: true, response: JSON.parse(errorData) });
            }
            break;

        case "customer":
                try {
                    if (requestMethod === "GET" && action === "getCustomer") {
                        const customerId = req.query.customerId as string;
                        const access_token = req.query.accessToken as string;
    
                        clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                        const client = new Customer.ShopperCustomers(clientConfig);

                        const options = {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                            },
                            parameters: {
                                siteId: clientConfig.parameters.siteId,
                                organizationId: clientConfig.parameters.organizationId,
                                customerId: customerId,
                            },
                        };

                        const profile = await client.getCustomer(options);
                        // console.log("Customer Info: ", profile);
                        return res.status(200).json({ isError: false, response: profile });
                    }
                } catch (err) {
                    console.error(err);
          
                    return res.status(500).json({ error: 'Internal server error' });
                }
            break;
        case "updateProfile":
            try {
                if (requestMethod === "PATCH" && action === "updateCustomer") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const { salutation, login, email, firstName,lastName, phone, gender } = body;

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                        },
                        body: {
                            salutation: salutation,
                            login: email,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            phoneMobile: phone,
                            gender: gender,
                        }
                    };

                    const profile = await client.updateCustomer(options);
                    console.log("Customer updated: ", profile);
                    return res.status(200).json({ isError: false, response: profile });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "newAddress":
            try {
                if (requestMethod === "POST" && action === "createAddress") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const { addressId, address1, address2, city,countryCode,
                        preferred, title, firstName, lastName, phone } = body;
                    console.log("address1: "+ address1);

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                        },
                        body: {
                            addressId: addressId,
                            address1: address1,
                            address2: address2,
                            city: city,
                            countryCode: countryCode,
                            preferred: preferred,
                            title: title,
                            firstName: firstName,
                            lastName: lastName,
                            phone: phone,
                        }
                    };

                    const profile = await client.createCustomerAddress(options);
                    console.log("Customer Address: ", profile);
                    return res.status(200).json({ isError: false, response: profile });
                }
            } catch (err) {
                console.error(err);
      
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "updateAddress":
            try {
                if (requestMethod === "PATCH" && action === "updateCustomerAddress") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const addressName = req.query.addressName as string;
                    const { addressId, address1, address2, city,countryCode,
                        preferred, title, firstName, lastName, phone } = body;

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                            addressName: addressName
                        },
                        body: {
                            addressId: addressId,
                            address1: address1,
                            address2: address2,
                            city: city,
                            countryCode: countryCode,
                            preferred: preferred,
                            title: title,
                            firstName: firstName,
                            lastName: lastName,
                            phone: phone,
                        }
                    };

                    const profile = await client.updateCustomerAddress(options);
                    console.log("Updated Address: ", profile);
                    return res.status(200).json({ isError: false, response: profile });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "address":
            try {
                if (requestMethod === "GET" && action === "getAddress") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const addressName = req.query.addressName as string;

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                            addressName: addressName,
                        },
                    };

                    const response = await client.getCustomerAddress(options);
                    console.log("Address: ", response);
                    return res.status(200).json({ isError: false, response: response });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "removeAddress":
            try {
                if (requestMethod === "DELETE" && action === "removeAddress") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const addressName = req.query.addressName as string;

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                            addressName: addressName,
                        },
                    };

                    const response = await client.removeCustomerAddress(options);
                    console.log("Delete Address: ", response);
                    return res.status(200).json({ isError: false, response: response });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "password":
            try {
                if (requestMethod === "PUT" && action === "updatePassword") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const { currentPassword, password } = body;
                    console.log("Current password: " + currentPassword);
                    console.log("New Password: " + password);


                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const client = new Customer.ShopperCustomers(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${access_token}`,
                        },
                        parameters: {
                            siteId: clientConfig.parameters.siteId,
                            organizationId: clientConfig.parameters.organizationId,
                            customerId: customerId,
                        },
                        body: {
                            currentPassword: currentPassword,
                            password: password,
                        }
                    };

                    const response = await client.updateCustomerPassword(options);
                    console.log("Password: ", response);
                    return res.status(200).json({ isError: false, response: response });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "account":
            try {
                if (requestMethod === "DELETE" && action === "deleteShopper") {
                    const customerId = req.query.customerId as string;
                    const access_token = req.query.accessToken as string;
                    const emailAddress = req.query.emailAddress as string;
                    const token = "eyJ0eXAiOiJKV1QiLCJraWQiOiJEMWhPUDdEODN4TjBqZWlqaTI3WWFvZFRjL0E9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJhYnV6ZXIuYUBsaWtlLmRpZ2l0YWwiLCJjdHMiOiJPQVVUSDJfU1RBVEVMRVNTX0dSQU5UIiwiYXV0aF9sZXZlbCI6MCwiYXVkaXRUcmFja2luZ0lkIjoiMmFlNTg1MjYtNzU0Zi00OTFiLTk0ZGMtNDQyZjE1ZWI2ZWU3LTIxMTg3ODc1OCIsInN1Ym5hbWUiOiJhYnV6ZXIuYUBsaWtlLmRpZ2l0YWwiLCJpc3MiOiJodHRwczovL2FjY291bnQuZGVtYW5kd2FyZS5jb206NDQzL2R3c3NvL29hdXRoMiIsInRva2VuTmFtZSI6ImFjY2Vzc190b2tlbiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJhdXRoR3JhbnRJZCI6Ink4b3VRVDNORlNCZnZzdHJfMllOWkw1Qmw1USIsImF1ZCI6IjE5ZTU2Nzk1LWQ3ZWYtNDViMS04MWYyLWIwYTQ1OTM4MDk0ZiIsIm5iZiI6MTcyNzk3OTk3MywiZ3JhbnRfdHlwZSI6ImF1dGhvcml6YXRpb25fY29kZSIsInNjb3BlIjpbInRlbmFudEZpbHRlciIsIm9wZW5JZCIsInJvbGVzIl0sImF1dGhfdGltZSI6MTcyNzk3MzM5MCwicmVhbG0iOiIvIiwiZXhwIjoxNzI3OTgxNzczLCJpYXQiOjE3Mjc5Nzk5NzMsImV4cGlyZXNfaW4iOjE4MDAsImp0aSI6IlZmcFl0SldSbThPMlVKclhSeDRfM0VSX1pWZyIsImNsaWVudF9pZCI6IjE5ZTU2Nzk1LWQ3ZWYtNDViMS04MWYyLWIwYTQ1OTM4MDk0ZiIsInRlbmFudEZpbHRlciI6IkNDRFhfU0JYX1VTRVI6YmxkYl9kZXYsYmxkYl9wcmQsYmxkYl9zYngsYmxkYl9zdGc7Q1FVT1RJRU5UX0NPTkZJR1VSQVRPUl9BRE1JTjpibGRiX2RldixibGRiX3ByZCxibGRiX3NieCxibGRiX3N0ZztDUk1fT1JHX0FETUlOOmJsZGJfZGV2LGJsZGJfcHJkLGJsZGJfc2J4LGJsZGJfc3RnO0VDT01fQURNSU46YmxkYl9kZXYsYmxkYl9wcmQsYmxkYl9zYngsYmxkYl9zdGc7TE9HQ0VOVEVSX1VTRVI6YmxkYl9kZXYsYmxkYl9wcmQsYmxkYl9zYngsYmxkYl9zdGc7T0NBUElfRVhQTE9SRVJfREVCVUdfVVNFUjpibGRiX2RldixibGRiX3ByZCxibGRiX3NieCxibGRiX3N0ZztPTV9BRE1JTjpibGRiX2RldixibGRiX3ByZCxibGRiX3NieCxibGRiX3N0ZztSTkRfQ1VTVE9NRVJfQURNSU46YmxkYl9kZXYsYmxkYl9wcmQsYmxkYl9zYngsYmxkYl9zdGc7U0xBU19PUkdBTklaQVRJT05fQURNSU46YmxkYl8wMDEsYmxkYl9kZXYsYmxkYl9wcmQsYmxkYl9zYngsYmxkYl9zdGciLCJyb2xlcyI6WyJET0NfVVNFUiIsIk9NX0FETUlOIiwiQU1fQUNDT1VOVF9BRE1JTiIsIkNRVU9USUVOVF9DT05GSUdVUkFUT1JfQURNSU4iLCJTVEFUVVNfUEFHRV9JT19VU0VSIiwiWENIQU5HRV9VU0VSIiwiQU1fQVBJX0FETUlOIiwiRUNPTV9BRE1JTiIsIkNDX0FETUlOIiwiUk5EX0NVU1RPTUVSX0FETUlOIiwiQ1JNX09SR19BRE1JTiIsIk9DQVBJX0VYUExPUkVSX0RFQlVHX1VTRVIiLCJTTEFTX09SR0FOSVpBVElPTl9BRE1JTiIsIkNDRFhfU0JYX1VTRVIiLCJMT0dDRU5URVJfVVNFUiJdfQ.iC8v9TMxPhzx3W0cTyiT-7WpsCFmRwXxkrvgWq9lntaRjnOuw7bO3jub4w-tHSTDg7lotNGWKn2BmMx-U8_mtkyCay6VZa4xg7PbCd4mFL3qCx8HiOCB48zDDQFgzC0u_l3jrsqOGTE_pwIsO-ydEA_2LRvskbzTr-ya4kPIql7FVlRynSDNYeGf6XWLbLPbrJzoo8JoGa7UGc-rCvKDOe-kCHVEM5sZgE1hi5Tyzd34E2McHBUZcL3QzVg2MlkKW1TzYe43Vzc9rWIlgXcytMH2QHvobC71hyP4v_qQTRzzQ2mlQlYZJ7qcp0ZIrdYdhu3iJNHp7He1agNLC1SUng";

                    clientConfig.headers['authorization'] = `Bearer ${access_token}`;
                    const slasAdminClient = new Customer.SlasAdmin(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        parameters: {
                            customerId: customerId,
                            emailAddress: emailAddress,
                            tenantId: process.env.SFCC_TENANT_ID,
                        },
                    };
                    const response = await slasAdminClient.deleteShopper(options);
                    console.log("Shopper deleted successfully!");
                    return res.status(200).json({ isError: false, response: response });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "resetPassword":
            try {
                if (requestMethod === "POST" && action === "resetToken") {
                    const userId = req.query.userId as string;
                    const code_verifier = await generateRandomString(128);
                    const code_challenge = await generateCodeChallenge(code_verifier);
                    // console.log("Code Verifier: " + code_verifier);

                    const client = new Customer.ShopperLogin(clientConfig);

                    const options = {
                        parameters: {
                            organizationId: clientConfig.parameters.organizationId,
                        },
                        body: {
                            callback_uri: "https://093d-2001-818-e854-f900-15b6-123e-2103-5443.ngrok-free.app/api/sfcc/callback", // "https://webhook.site/51413cd1-ff8e-43a0-95cf-e92c61870d44", // process.env.REDIRECT_URI,
                            channel_id: clientConfig.parameters.siteId,
                            client_id: clientConfig.parameters.clientId,
                            code_challenge: code_challenge,
                            mode: "callback",
                            user_id: userId,
                        }
                    };
                    const response = await client.getPasswordResetToken(options);
                    // console.log("Password reset token gererated" + JSON.stringify(response, null, 4));
                    return res.status(200).json({ isError: false, response: response, code_verifier: code_verifier });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        case "setPassword":
            try {
                if (requestMethod === "POST" && action === "resetPassword") {
                    const userId = req.query.userId as string;
                    const codeVerifier = req.query.codeVerifier as string;
                    const { newPassword, token } = body;

                    const client = new Customer.ShopperLogin(clientConfig);

                    const options = {
                        headers: {
                            Authorization: `Basic ${await basicAuthorization()}`,
                        },
                        parameters: {
                            organizationId: clientConfig.parameters.organizationId,
                        },
                        body: {
                            channel_id: clientConfig.parameters.siteId,
                            client_id: clientConfig.parameters.clientId,
                            code_verifier: codeVerifier,
                            new_password: newPassword,
                            pwd_action_token: token,
                            user_id: userId,
                        }
                    };
                    const response = await client.resetPassword(options);
                    console.log("Password has been reset" + JSON.stringify(response, null, 4));
                    return res.status(200).json({ isError: false, response: response });
                }
            } catch (err) {
                console.error(err);
        
                return res.status(500).json({ error: 'Internal server error' });
            }
            break;
        default:
            res.status(405).json({ message: 'Method not allowed' });
            // return res.status(400).json({ isError: true });
    }

}

export default handler;