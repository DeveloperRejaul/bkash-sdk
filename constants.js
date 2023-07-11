require("dotenv").config();

// const username = process.env.USERNAME;
// const password = process.env.PASSWORD;
// const appKey = process.env.APP_KEY;
// const appSecret = process.env.APP_SECREET;
// const sendBoxUlr = process.env.SEND_BOX_URL;
// const liveUrl = process.env.LIVE_URL;

const username = "sandboxTokenizedUser02";
const password = "sandboxTokenizedUser02@12345";
const appKey = "4f6o0cjiki2rfm34kfdadl1eqq";
const appSecret = "2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b";
const sendBoxUlr =
    "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout";
const liveUrl = "https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout";
const callbackURL = "https://github.com/";

module.exports = {
    username,
    password,
    appKey,
    appSecret,
    liveUrl,
    sendBoxUlr,
    callbackURL,
};
