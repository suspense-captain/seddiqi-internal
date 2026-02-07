import HTTP_SERVICE from "../helpers/fetchHttpService";
import logger from "../logger";

const { GOOGLE_RECAPTCHA_SECRET_KEY } = process.env;

const GOOGLE_RECAPTCHA_BASE_URL = "https://www.google.com";

const validateGoogleRecaptcha = async (token: string) => {
  const params = `?secret=${
    GOOGLE_RECAPTCHA_SECRET_KEY as string
  }&response=${token}`;
  const apiUrl = `/recaptcha/api/siteverify${params}`;

  // log entry
  // logger.info("Validating Google Recaptcha - Params ", params);

  try {
    const result = await HTTP_SERVICE.POST(GOOGLE_RECAPTCHA_BASE_URL, apiUrl);

    // log fetch response
    if (!result?.success) {
      const message = "Validation Error Google Recaptcha";
      logger.error(message, result);
      throw new Error(message);
    }
    // logger.info("Google Recaptcha Validated - Result", result);

    return result;
  } catch (err) {
    // log error
    logger.error("Failed to Validate Google Recaptcha - API threw Error", err);
    throw err;
  }
};

export const validateRecaptcha = async (
  token: string
): Promise<{ isError: boolean; resp: any }> => {
  try {
    const googleRecaptchaRes = await validateGoogleRecaptcha(token);
    return {
      isError: false,
      resp: googleRecaptchaRes,
    };
  } catch (err) {
    logger.error("Failed to Validate Recaptcha", err);
    throw err;
  }
};

export const getGoogleRecaptchaValidation = async (token: string) =>
  await (
    await fetch("/api/google/recaptcha", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  ).json();
