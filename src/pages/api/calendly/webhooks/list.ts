import { fetchCalendlyData } from "../api";
import { NextApiRequest, NextApiResponse } from "next";

const query = {
  scope: 'organization',
  organization: "https://api.calendly.com/organizations/acc7fa6b-f062-4ace-8905-a2a90d8def79" //TODO: Do not hardcore
};

/**
 * This API route will get a list of all subscribed webhooks
 * This API can be called:
 * /api/calendly/webhooks/list
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const url = `https://api.calendly.com/webhook_subscriptions?organization=${query.organization}&scope=${query.scope}`;
    const response = await fetchCalendlyData(url, res);

    if (response) {
      res.status(200).json({ message: 'Webhook list retrieved successfully', response });
    } else {
      res.status(response.status).json({ error: 'Error listing webhook subscription', response });
    }
  } catch (error) {
    console.error('Error listing webhook subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;