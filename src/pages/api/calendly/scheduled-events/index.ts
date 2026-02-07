import { NextApiRequest, NextApiResponse } from "next";
import { fetchCalendlyData, fetchUserDetails } from "../api";
import {
  ScheduledEventsResponse
} from "../types";

/*
  This API endpoint fetches scheduled meetings for a specific client (invitee) based on their email.
  It can be called in several ways:
  /api/calendly/scheduled-events?email=<CLIENT_EMAIL>
  /api/calendly/scheduled-events?email=<CLIENT_EMAIL>&count=<COUNT>
  /api/calendly/scheduled-events?email=<CLIENT_EMAIL>&status=<STATUS>
  /api/calendly/scheduled-events?email=<CLIENT_EMAIL>&minStartTime=<MIN_START_TIME>
  /api/calendly/scheduled-events?email=<CLIENT_EMAIL>&maxStartTime=<MAX_START_TIME>
*/
const handler = async (req: NextApiRequest, res: NextApiResponse<ScheduledEventsResponse | { error: string }>) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req;
    const email = query.email as string;
    const count = query.count as string || '10';
    const status = query.status as string;
    const minStartTime = query.minStartTime as string;
    const maxStartTime = query.maxStartTime as string;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }

    const user = await fetchUserDetails();
    const userURI = user.resource.uri;
    const baseUrl = "https://api.calendly.com/scheduled_events";
    let eventsUrl = `${baseUrl}?user=${userURI}&invitee_email=${email}&count=${count}&sort=start_time:desc`;

    if (status) {
      eventsUrl += `&status=${status}`;
    }
    if (minStartTime) {
      eventsUrl += `&min_start_time=${minStartTime}`;
    }
    if (maxStartTime) {
      eventsUrl += `&max_start_time=${maxStartTime}`;
    }

    const eventsData = await fetchCalendlyData(eventsUrl, res) as ScheduledEventsResponse;
    res.status(200).json(eventsData);
  } catch (error) {
    console.error('Error fetching scheduled events:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

export default handler; 