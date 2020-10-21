// How often one can send an open request to the server (in seconds)
export const OPEN_DELAY = 30

// Threshold for notification
export const LONG_OPEN_DURATION = 900000

// How many entries to load per page of history
export const HISTORY_PAGE_SIZE = 100

// Errors
export const ERR_UNAUTHORIZED = "401 Unauthorized"
export const ERR_EXCESSIVE_REQUESTS = "Too many requests at one time"
export const ERR_BAD_SENSOR = "Cannot read sensor"
export const ERR_INVALID_MODE = "Invalid mode given"
