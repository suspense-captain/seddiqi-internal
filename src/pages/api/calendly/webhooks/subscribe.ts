import { fetchCalendlyData } from "../api";
import { NextApiRequest, NextApiResponse } from "next";

const subscriptionPayload = {
  url: process.env.NEXT_PUBLIC_HOSTED_URL,
  events: ["invitee.created", "invitee.canceled"],
  scope: 'organization',
  organization: "https://api.calendly.com/organizations/acc7fa6b-f062-4ace-8905-a2a90d8def79" //TODO: Do not hardcore
};

/**
 * This API route will subscribe to a webhook (when an invitee being created or canceled)
 * This API can be called:
 * /api/calendly/webhooks/subscribe
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const url = 'https://api.calendly.com/webhook_subscriptions';
      const response = await fetchCalendlyData(url, res, 'POST', subscriptionPayload);

      const data = await response.json();

      if (response.ok) {
        res.status(200).json({ message: 'Webhook subscription created successfully', data });
      } else {
        res.status(response.status).json({ error: 'Error creating webhook subscription', data });
      }
    } catch (error) {
      console.error('Error creating webhook subscription:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

export default handler;