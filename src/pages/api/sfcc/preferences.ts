import { NextApiRequest, NextApiResponse } from "next";
import { OAuthTokenFromAM } from "@utils/sfcc-connector/config";
var preferenceAPI = process.env.SFCC_OCAPI_PREFERENCES_URL;
const siteId = process.env.SFDC_SITEID;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const requestMethod = req.method;
    const query = req.query.api ?? "";
    const action = req.query.action ?? "";  

    switch (query) {
        case "getPreference":
            try {
                if (requestMethod === "GET" && action === "getCustomPreferenceValue") {
                    const siteId = process.env.SFDC_SITEID as string;
                    const preferenceId = (req.query.preferenceId as string) ?? "";  
                    const accessToken = await OAuthTokenFromAM();

                    const options = {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    };
                    const url = preferenceAPI + preferenceId;
                    const response = await fetch(url, options);
                    const result = await response.json();
                    // console.log("Preference value(s) : " + JSON.stringify(result.site_values[siteId], null, 4));
                    
                    
                    if (!response.ok) {
                        console.log("Failed to get preference value.");
                        return res.status(400).json({ isError: true, response: result });
                    }

                    if (result) {
                        if (result.site_values) {
                            const preferenceValue = result.site_values[siteId];
                            // console.log("Custom Pref Value : " + JSON.stringify(result, null, 4));
                            return res.status(200).json({ isError: false, response: preferenceValue });
                        } else {
                            return res.status(400).json({ isError: true, error: 'Site preference is not configured in Business Manager' });
                        }
                    } else {
                        console.log("Failed to get preference value.");
                        return res.status(400).json({ isError: true, response: result });
                    }
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
