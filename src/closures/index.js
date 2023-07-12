const {
	appKey,
	appSecret,
	username,
	password,
	callbackURL,
	liveUrl,
	sendBoxUlr,
} = require("../../constants");

const axios = require("axios");
const Agreement = require("./Agreements");
const Payment = require("./payment");
const Transaction = require("./transaction");

/**
 * @param {object} config
 * @returns
 */
const Bkash = (config) => {
	let { appKey, appSecret, username, password, isLive, callbackURL } = config;
	const baseURL = isLive ? liveUrl : sendBoxUlr;
	let idToken = "";
	let refToken = "";

	const postReq = async ({ url, data }) => {
		let headers = {};
		url.endsWith("grant") || url.endsWith("refresh")
			? (headers = { username, password })
			: (headers = {
					authorization: this.id_token,
					"x-app-key": appKey,
			  });

		try {
			const response = await axios({
				method: "POST",
				url: `${baseURL}/${url}`,
				headers: headers,
				data,
			});
			return response.data;
		} catch (error) {
			throw new Error("your request failed ");
		}
	};

	return function () {
		const bkash = {
			bkashInit: async function () {
				const res = await postReq({
					url: "token/grant",
					data: {
						app_key: appKey,
						app_secret: appSecret,
					},
				});

				idToken = res.id_token;
				refToken = res.refresh_token;
			},
			refreshToken: async function () {
				const res = await this.postReq({
					url: "token/refresh",
					data: {
						app_key: appKey,
						app_secret: appSecret,
						refresh_token: refToken,
					},
				});
				idToken = res.id_token;
				refToken = res.refresh_token;
			},

			agreements: async () => await Agreement({ callbackURL, postReq }),
			payments: async () => await Payment({ callbackURL, postReq }),
			transactions: async () => await Transaction({ postReq }),
		};
		return bkash;
	};
};

// testing code
(async function () {
	const b = Bkash({
		appKey,
		appSecret,
		username,
		password,
		isLive: false,
		callbackURL,
	});

	await b().bkashInit();
	console.log("============= createAgreement ====================");
	const ac = await b().agreements().create({
		mode: "0000",
		payerReference: "01770618575",
		intent: "sale",
		currency: "BDT",
		amount: "1",
		merchantInvoiceNumber: "ASDDSADSASdADS",
	});

	console.log(ac);
})();
