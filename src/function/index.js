const axios = require("axios");
const {
	appKey,
	appSecret,
	callbackURL,
	liveUrl,
	password,
	sendBoxUlr,
	username,
} = require("../../constants");
const Agreement = require("./agreement");
const Payment = require("./payment");
const Transaction = require("./transaction");

/**
 * @param {object} config The object key is appKey, appSecret, username, password, isLive value.
 */
function Bkash(config) {
	if (Object.keys(config).length !== 6)
		throw new Error("invalid configuration ");
	const { appKey, appSecret, username, password, isLive, callbackURL } =
		config;

	const baseURL = isLive ? liveUrl : sendBoxUlr;

	const bkash = {
		id_token: null,
		refresh_token: null,
		callbackURL,
		appKey,
		appSecret,

		initBkash: async function () {
			const res = await this.reqPost({
				url: "token/grant",
				data: {
					app_key: appKey,
					app_secret: appSecret,
				},
			});
			this.id_token = res?.id_token;
			this.refresh_token = res?.refresh_token;
		},
		reqPost: async function ({ url, data }) {
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
		},

		refreshToken: async function () {
			const response = await this.reqPost({
				url: "token/refresh",
				data: {
					app_key: this.appKey,
					app_secret: this.appSecret,
					refresh_token: this.refresh_token,
				},
			});
			this.id_token = response.id_token;
			this.refresh_token = response.refresh_token;
		},

		// agreements
		Agreements: Agreement,

		// Payments
		Payments: Payment,

		// Transaction
		Transactions: Transaction,
	};

	return bkash;
}

// testing code
(async function () {
	const b = new Bkash({
		appKey,
		appSecret,
		username,
		password,
		isLive: false,
		callbackURL,
	});
	await b.initBkash();

	await b.refreshToken();
	// console.log("============= createAgreement ====================");
	// const ac = await b.Agreements().create({
	// 	mode: "0000",
	// 	payerReference: "01770618575",
	// 	intent: "sale",
	// 	currency: "BDT",
	// 	amount: "1",
	// 	merchantInvoiceNumber: "ASDDSADSASdADS",
	// });
	// console.log(ac);

	// await new Promise((resolve) => setTimeout(resolve, 30000));
	// console.log("============= executeAgreement ====================");
	// const ae = await b.Agreements().execute({ paymentID: ac.paymentID });
	// console.log(ae);

	// console.log("============= queryAgreement ====================");
	// const qa = await b.Agreements().query({ agreementID: ae.agreementID });
	// console.log(qa);

	// console.log("============= cancelAgreement ====================");
	// const ca = await b.Agreements().cancel({ agreementID: qa.agreementID });
	// console.log(ca);

	// console.log("=============Create Payment====================");
	// const cp = await b.Payments().create({
	// 	mode: "0001",
	// 	payerReference: "01770618575",
	// 	intent: "sale",
	// 	currency: "BDT",
	// 	amount: "1",
	// 	merchantInvoiceNumber: "ASDDSADSASdADS",
	// 	agreementID: ae.agreementID,
	// });
	// console.log(cp);

	// await new Promise((resolve) => setTimeout(resolve, 40000));
	// console.log("============= execute Payment====================");
	// const ep = await b.Payments().execute({ paymentID: cp.paymentID });
	// console.log(ep);

	// console.log("============= query Payment====================");
	// const qp = await b.Payments().query({ paymentID: ep.paymentID });
	// console.log(qp);

	// console.log("============= transition  Payment====================");
	// const tp = await b.Transactions().search({ trxID: ep.trxID });
	// console.log(tp);

	// console.log("============== refund transaction ==========");
	// const tr = await b.Transactions().refund({
	// 	paymentID: pe.paymentID,
	// 	amount: "1",
	// 	trxID: ep.trxID,
	// 	sku: "hasdfh",
	// 	reason: "asdfasfads",
	// });
	// console.log(tr);

	// console.log("============== refund status transaction ==========");
	// const trs = await b.Transactions().refundStatus({
	// 	paymentID: pe.paymentID,
	// 	trxID: pe.trxID,
	// });
	// console.log(trs);
})();
