import { NextApiRequest, NextApiResponse } from "next";
import { fetchUserDetails, fetchCalendlyData } from "../api";

/*
  This API endpoint can be called:
  /api/calendly/availability/busySlots?startDate=<START_DATE>&endDate=<END_DATE>
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req;
    const { startDate, endDate } = query;

    const user = await fetchUserDetails();
    const userURI = user.resource.uri;
    const queryString = `?user=${userURI}&start_time=${startDate}&end_time=${endDate}`;
    const availabilityUrl = `https://api.calendly.com/user_busy_times${queryString}`;
    const availabilityData = await fetchCalendlyData(availabilityUrl, res);

    res.status(200).json(availabilityData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
