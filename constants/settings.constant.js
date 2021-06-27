const APP_NOT_YET_OPEN = {
    openTime: new Date(Date.now() + 100000000000),
    closeTime: new Date(Date.now() + 10000000000000000),
    confirmTime: new Date(Date.now() + 100000000000000000)
};

const APP_OPEN = {
    openTime: new Date(Date.now() - 100),
    closeTime: new Date(Date.now() + 10000000000),
    confirmTime: new Date(Date.now() + 100000000000000)
};

const APP_CLOSED = {
    openTime: new Date(Date.now() - 100),
    closeTime: new Date(Date.now() - 1000),
    confirmTime: new Date(Date.now() + 100000000000000)
};

const CONFIRM_CLOSED = {
    openTime: new Date(Date.now() - 10000),
    closeTime: new Date(Date.now() - 1000),
    confirmTime: new Date(Date.now() - 100)
};

const REMOTE_HACKATHON = {
    openTime: new Date(Date.now() - 100),
    closeTime: new Date(Date.now() + 10000000000),
    confirmTime: new Date(Date.now() + 100000000000000),
    isRemote: true
};

// Some utility dates that are used in tests and seed script
module.exports = {
    APP_NOT_YET_OPEN: APP_NOT_YET_OPEN,
    APP_OPEN: APP_OPEN,
    APP_CLOSED: APP_CLOSED,
    CONFIRM_CLOSED: CONFIRM_CLOSED,
    REMOTE_HACKATHON: REMOTE_HACKATHON
};
