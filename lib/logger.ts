import { logger, consoleTransport } from "react-native-logs";

const envLogLevel = process.env.EXPO_PUBLIC_LOG_LEVEL;
const LOG_LEVEL = (typeof envLogLevel === "string" && ["trace", "debug", "info", "warn", "error", "fatal"].includes(envLogLevel)) ?
    envLogLevel :
    (__DEV__ ? "debug" : "warn");

export const log = logger.createLogger({
    levels: {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5,
    },
    severity: LOG_LEVEL, // set to "trace" in dev if trace logs should appear
    transport: consoleTransport,
    transportOptions: {
        colors: {
            trace: "grey",
            debug: "cyanBright",
            info: "blueBright",
            warn: "yellowBright",
            error: "redBright",
            fatal: "magentaBright",
        },
    },
    async: true,
    printLevel: true,
    printDate: true,
    fixedExtLvlLength: true,
    enabled: true,
    enabledExtensions: ["AUTH", "DB", "UI"], // must match the namespaces below
});

// Namespaced loggers
export const authLog = log.extend("AUTH");
export const dbLog = log.extend("DB");
export const uiLog = log.extend("UI");


