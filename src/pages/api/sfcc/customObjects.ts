import { NextApiRequest, NextApiResponse } from "next";
import { getAccessTokenFromAccountManagerOCAPI } from "@utils/sfcc-connector/config";
import logger from "@utils/logger";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method;
    const action = req.query.action ?? "";
    const objectType = req.query.objectType ?? "";
    const objectKey = req.query.objectKey ?? "";
    const locale = req.query.locale ?? "";
    const body = req.body;
    const baseUrl = `https://${process.env.SFCC_HOST}/s/-/dw/data/v23_2/sites/${locale?.includes('-sa') ? process.env.SFDC_SITEIDKSA: process.env.SFDC_SITEID}/custom_objects`;

    switch (action) {
        case "getCustomObject":
            try {
                if (requestMethod === "GET") {
                    const accessToken = await getAccessTokenFromAccountManagerOCAPI();

                    const options = {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        }
                    };
                    const url = `${baseUrl}/${objectType}/${objectKey}`;
                    const response = await fetch(url, options);
                    const responseData = await response.json();
                    
                    if (!response.ok) {
                        return res.status(response.status).json({ 
                            isError: true, 
                            error: responseData,
                            status: response.status,
                            statusText: response.statusText
                        });
                    }
                    
                    return res.status(200).json({ 
                        isError: false, 
                        data: responseData 
                    });
                }
            } catch(err) {
                logger.error('Error fetching custom object:', err);
                return res.status(500).json({ 
                    isError: true, 
                    error: err.message
                });
            }
            break;
        case "createCustomObject":
            try {
                if (requestMethod === "PUT") {
                    const accessToken = await getAccessTokenFromAccountManagerOCAPI();

                    const options = {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            c_formData: {
                                "ar_AE": "",
                                "default": JSON.stringify(body)
                            },
                        })
                    };

                    const url = `${baseUrl}/${objectType}/${body[0].email}`;
                    const response = await fetch(url, options);
                    const responseData = await response.json();

                    if (!response.ok) {
                        return res.status(response.status).json({ 
                            isError: true, 
                            error: responseData,
                            status: response.status,
                            statusText: response.statusText
                        });
                    }
                    
                    return res.status(200).json({ 
                        isError: false, 
                        data: responseData 
                    });
                }
            } catch(err) {
                logger.error('Error creating custom object:', err);
                return res.status(500).json({ 
                    isError: true, 
                    error: err.message
                });
            }
            break;
        case "updateCustomObject":
            try {
                if (requestMethod === "PATCH") {
                    const accessToken = await getAccessTokenFromAccountManagerOCAPI();

                    const options = {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${accessToken}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            c_formData: {
                                "ar_AE": "",
                                "default": JSON.stringify(body)
                            },
                        })
                    };

                    const url = `${baseUrl}/${objectType}/${body[0].email}`;
                    const response = await fetch(url, options);
                    const responseData = await response.json();
                    
                    if (!response.ok) {
                        return res.status(response.status).json({ 
                            isError: true, 
                            error: responseData,
                            status: response.status,
                            statusText: response.statusText
                        });
                    }
                    
                    return res.status(200).json({ 
                        isError: false, 
                        data: responseData 
                    });
                }
            } catch(err) {
                logger.error('Error updating custom object:', err);
                return res.status(500).json({ 
                    isError: true, 
                    error: err.message
                });
            }
            break;
        default:
            return res.status(400).json({ isError: true, error: 'Invalid query parameter' });
    }
}

export default handler;
