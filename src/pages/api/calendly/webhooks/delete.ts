import { fetchCalendlyData } from "../api";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * This API route will delete a webhook subscription
 * This API endpoint can be called:
 * /api/calendly/webhooks/delete?uuid=<UUID>
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const url = `https://api.calendly.com/webhook_subscriptions/${req.query.uuid}`;
    const response = await fetchCalendlyData(url, res, "DELETE");

    res.status(200).json({ response });
  } catch (error) {
    console.error('Error while deleting webhook subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;