import logger from "../logger";

const HTTP_SERVICE = {
  GET: async (baseUrl: string, api: string, headers?: HeadersInit) => {
    try {
      const response = await fetch(baseUrl + api, {
        method: "GET",
        headers,
      });
      return await response.json();
    } catch (err) {
      logger.error("HTTP GET ERROR", err);
      throw err;
    }
  },
  POST: async (
    baseUrl: string,
    api: string,
    headers?: HeadersInit,
    payload?: any
  ) => {
    try {
      const response = await fetch(baseUrl + api, {
        method: "POST",
        headers,
        body: payload,
      });
      return await response.json();
    } catch (err) {
      logger.error("HTTP POST ERROR", err);
      throw err;
    }
  },
};

export default HTTP_SERVICE;
