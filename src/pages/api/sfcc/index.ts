import isServer from "@utils/helpers/isServer";
import logger from "@utils/logger";


let apiConfig: any;

const cacheApiConfig = () => {
  if (!isServer()) {
      return "";
  }

  if (!apiConfig) {
      apiConfig = process.env.NEXT_PUBLIC_HOSTED_URL || "http://localhost:3000";
  }

  logger.log("apiConfig ===> ", apiConfig)

  return apiConfig;
};


/** This is the fetch call to the pages > api */
const serverApiCallSfccTest = async (query: string, config: any, type: string) => await fetch(`${cacheApiConfig()}/api/sfcc/${type}${query}`, config);


export { serverApiCallSfccTest }