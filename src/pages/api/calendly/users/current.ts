import { NextApiRequest, NextApiResponse } from "next";
import { fetchCalendlyData } from "../api";

/*
  This API endpoint can be called:
  /api/calendly/event/current
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const url = `https://api.calendly.com/users/me`;
  const response = await fetchCalendlyData(url, res);

  res.status(200).json(response);
}
  
export default handler;
