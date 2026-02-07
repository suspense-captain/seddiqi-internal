import { NextApiRequest, NextApiResponse } from "next";
import { fetchCalendlyData } from "../api";

/*
  This API endpoint can be called:
  /api/calendly/event/types?eventURI=<EVENT_TYPE_UUID>&startDate=<START_DATE>&endDate=<END_DATE>
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req;
    const { startDate, endDate, eventURI } = query;

    const baseUrl = "https://api.calendly.com/event_type_available_times";
    const queryString = `?event_type=${eventURI}&start_time=${startDate}&end_time=${endDate}`;
    const eventTypeUrl = `${baseUrl}${queryString}`
    const eventTypesData = await fetchCalendlyData(eventTypeUrl, res);

    res.status(200).json(eventTypesData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
