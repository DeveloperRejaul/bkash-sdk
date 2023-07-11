require("dotenv").config();

const username = process.env.BKASH_USERNAME;
const password = process.env.BKASH_PASSWORD;
const appKey = process.env.BKASH_APP_KEY;
const appSecret = process.env.BKASH_APP_SECREET;
const sendBoxUlr = process.env.BKASH_SEND_BOX_URL;
const liveUrl = process.env.BKASH_LIVE_URL;
const callbackURL = process.env.BKASH_CALL_BACK_URL;

module.exports = {
    username,
    password,
    appKey,
    appSecret,
    liveUrl,
    sendBoxUlr,
    callbackURL,
};
