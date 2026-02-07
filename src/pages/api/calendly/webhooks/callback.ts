import { NextApiRequest, NextApiResponse } from 'next';

/**
 * This API route will receive webhook notifications from Calendly
 * 
 * Calendly will POST data here whenever an event occurs (like an invitee being created, canceled, or rescheduled)'
 * 
 * This API endpoint can be called:
 * /api/calendly/webhooks/callback
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const eventPayload = req.body;

    switch (eventPayload.event) {
      case 'invitee.created':
        console.log('New invitee created:', eventPayload.payload);
        // Handle the creation here
        break;
      case 'invitee.canceled':
        console.log('Invitee canceled:', eventPayload.payload);
        // Handle the cancellation here
        break;
      default:
        console.log('Unhandled event:', eventPayload.event);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;
