import { NextApiRequest, NextApiResponse } from "next";
import { fetchUserDetails, fetchCalendlyData } from "../api";

/*
  This API endpoint can be called:
  /api/calendly/availability/userAvailableSlots
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = await fetchUserDetails();
    const userURI = user.resource.uri;
    const availabilityUrl = `https://api.calendly.com/user_availability_schedules?user=${userURI}`;
    const availabilityData = await fetchCalendlyData(availabilityUrl, res);

    const { timezone, rules } = availabilityData.collection[0];
    const availableWeeklySlots = rules.filter((rule: any) => rule.type === "wday" && rule.intervals.length > 0);
    const availableDateSlots = rules.filter((rule: any) => rule.type === "date");

    res.status(200).json({ timezone, availableWeeklySlots, availableDateSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;

