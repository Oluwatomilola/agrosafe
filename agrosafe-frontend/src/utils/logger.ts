const isDev = import.meta.env.DEV;

type AnyArgs = Array<unknown>;

export const logger = {
    info: (...args: AnyArgs) => {
        if (isDev) console.log(...args);
    },
    warn: (...args: AnyArgs) => {
        if (isDev) console.warn(...args);
    },
    error: (...args: AnyArgs) => {
        if (isDev) console.error(...args);
    }
};

export default logger;
