const { ENABLE_LOGS } = process.env;

export const ERROR_MESSAGES = {
  AUTHENTICATION: {
    LOGOUT: "Error during sign out"
  }
};

const logger = (() => {
  const print = (
    type: "info" | "warn" | "error" | "trace" | "log",
    ...messages: any[]
  ) => {
    const isLogEnabled = ENABLE_LOGS?.toLowerCase() === "true";
    const logIdentifier = "Custom Logs: ";
    switch (type) {
      case "info":
        isLogEnabled && console.info(logIdentifier, ...messages);
        break;
      case "warn":
        isLogEnabled && console.warn(logIdentifier, ...messages);
        break;
      case "error":
        isLogEnabled && console.error(logIdentifier, ...messages);
        break;
      case "trace":
        isLogEnabled && console.trace(logIdentifier, ...messages);
        break;
      case "log":
      default:
        isLogEnabled && console.log(logIdentifier, ...messages);
    }
  };

  return {
    log: print.bind(null, "log"),
    info: print.bind(null, "info"),
    warn: print.bind(null, "warn"),
    error: print.bind(null, "error"),
    trace: print.bind(null, "trace"),
  };
})();

export default logger;
