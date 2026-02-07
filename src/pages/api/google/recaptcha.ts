import { NextApiRequest, NextApiResponse } from "next";

import logger from "@utils/logger";
import { validateRecaptcha } from "@utils/recaptcha";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const requestMethod = req.method;
  const body = JSON.parse(req.body);

  // logger.info("Validating Google Recaptcha", body);

  switch (requestMethod) {
    case "POST":
      try {
        const { isError, resp } = await validateRecaptcha(body.token);
        if (!isError) {
          logger.info(
            "Validating Google Recaptcha Handler API - SUCCESS",
            resp
          );
          return res.status(200).json({ isError: false, resp });
        } else {
          return res.status(500).json({ isError: true, resp });
        }
      } catch (err) {
        return res.status(500).json({ isError: true, resp: err });
      }
      break;

    default:
      return res.status(400).json({ isError: true });
  }
};

export default handler;
