import { NextApiRequest, NextApiResponse } from "next";
import { fetchUserDetails, fetchCalendlyData } from "../api";

/*
  This API endpoint can be called in several ways:
  /api/calendly/event/types?uuid=<EVENT_TYPE_UUID>
  /api/calendly/event/types
*/
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { query } = req;
    const count = query.count || 100;
    const paginationUrl = query.pagination;
  
    if (paginationUrl) {
      const response = await fetchCalendlyData(paginationUrl.toString(), res);
      res.status(200).json(response);
    } else {
      const user = await fetchUserDetails();
      const userURI = user.resource.uri;
  
      const baseUrl = "https://api.calendly.com/event_types";
      const eventTypesUrl = query.uuid ? `${baseUrl}/${query.uuid}?user=${userURI}` : `${baseUrl}?user=${userURI}&count=${count}`;
      const eventTypesData = await fetchCalendlyData(eventTypesUrl, res);
  
      res.status(200).json(eventTypesData);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
