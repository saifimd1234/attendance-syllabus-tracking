// Basic logger implementation
const LOG_LEVELS = {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    DEBUG: 'DEBUG',
};

const formatMessage = (level: string, message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message} ${data ? JSON.stringify(data) : ''}`;
};

export const logger = {
    info: (message: string, data?: any) => {
        console.log(formatMessage(LOG_LEVELS.INFO, message, data));
    },
    warn: (message: string, data?: any) => {
        console.warn(formatMessage(LOG_LEVELS.WARN, message, data));
    },
    error: (message: string, error?: any) => {
        console.error(formatMessage(LOG_LEVELS.ERROR, message, error));
    },
    debug: (message: string, data?: any) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(formatMessage(LOG_LEVELS.DEBUG, message, data));
        }
    },
};
