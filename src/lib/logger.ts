const dev = process.env.NODE_ENV !== "production";

export const devLog = (...args: unknown[]) => { if (dev) console.log(...args); };
export const devWarn = (...args: unknown[]) => { if (dev) console.warn(...args); };
// console.error always logs — errors are always relevant in production
export const logError = console.error;
