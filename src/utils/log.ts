export const logErr = (message: string) => {
  console.error("[GreenTrackR] " + message);
};

export const logWarn = (message: string) => {
  if (import.meta.env.DEV) {
    console.warn("[GreenTrackR] " + message);
  }
};

export const logInfo = (message: string) => {
  if (import.meta.env.DEV) {
    console.info("[GreenTrackR] " + message);
  }
};

export const logDebug = (message: string) => {
  if (import.meta.env.DEV) {
    console.debug("[GreenTrackR] " + message);
  }
};