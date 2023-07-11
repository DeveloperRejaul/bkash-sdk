require("dotenv").config();

class Bkash {
    /**
     * @param {Object} config- The object key is appKey, appSecret, username, password, isLive value.
     */
    constructor(config) {
        const { sendBoxUlr, liveUrl } = this;
        if (Object.keys(config).length !== 5)
            throw new Error("Invalite configaration");

        const { appKey, appSecret, username, password, isLive } = config;
        this.baseURL = isLive ? liveUrl : sendBoxUlr;
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.headers = {
            username,
            password,
        };
    }

    async init() {
        const { headers } = this;
        const data = {
            app_key: this.appKey,
            app_secret: this.appSecret,
        };

        try {
            const response = await axios.post(this.baseUrl, data, { headers });

            this.tocken = response.data.id_token;
            return response.data;
        } catch (error) {
            throw new Error("Server error");
        }
    }
}

new Bkash({
    appKey: "",
    appSecret: "",
    username: "",
    password: "",
    isLive: false,
});
