export const logErr = (message: string, throwEx: boolean = false) => {
  let value = '[GreenTrackR] ' + message;
  if (throwEx) {
    throw new Error(value);
  } else {
    console.error(value);
  }
};

export const logWarn = (message: string) => {
  if (import.meta.env.DEV) {
    console.warn('[GreenTrackR] ' + message);
  }
};

export const logInfo = (message: string) => {
  if (import.meta.env.DEV) {
    console.info('[GreenTrackR] ' + message);
  }
};

export const logDebug = (message: string) => {
  if (import.meta.env.DEV) {
    console.debug('[GreenTrackR] ' + message);
  }
};