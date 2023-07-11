const axios = require("axios");
const {
	appKey,
	appSecret,
	password,
	sendBoxUlr,
	liveUrl,
	username,
	callbackURL,
} = require("../../constants");
const Agreements = require("./Agreement");
const Payment = require("./payment");
const Transaction = require("./Transaction");

class Base {
	/**
	 * @param {Object} config- The object key is appKey, appSecret, username, password, isLive value.
	 */

	constructor(config) {
		if (Object.keys(config).length !== 6)
			throw new Error("Invalid configuration");
		const { appKey, appSecret, username, password, isLive, callbackURL } =
			config;

		this.baseURL = isLive ? liveUrl : sendBoxUlr;
		this.appKey = appKey;
		this.appSecret = appSecret;
		this.username = username;
		this.password = password;
		this.callbackURL = callbackURL;
	}

	async init() {
		try {
			const data = await this.req({
				url: "token/grant",
				data: {
					app_key: this.appKey,
					app_secret: this.appSecret,
				},
			});
			this.reToken = data.refresh_token;
			this.idToken = data.id_token;
			this.agreements = new Agreements(this);
			this.payment = new Payment(this);
			this.transition = new Transaction(this);
			return this;
		} catch (error) {
			console.log(error);
		}
	}

	async req({ url, data }) {
		const { username, password } = this;

		let headers = {};
		if (url.endsWith("grant") || url.endsWith("refresh"))
			headers = { username, password };
		else
			headers = {
				authorization: this.idToken,
				"x-app-key": this.appKey,
			};

		try {
			const { baseURL } = this;
			const response = await axios.post(`${baseURL}/${url}`, data, {
				headers,
			});

			return response.data;
		} catch (error) {
			throw new Error("request failed");
		}
	}

	async refreshToken() {
		const response = await this.req({
			url: "token/refresh",
			data: {
				app_key: this.appKey,
				app_secret: this.appSecret,
				refresh_token: this.refresh_token,
			},
		});
		this.idToken = response.id_token;
		this.reToken = response.refresh_token;
	}
}

// testing code
(async function () {
	const b = await new Base({
		appKey,
		appSecret,
		username,
		password,
		isLive: false,
		callbackURL,
	}).init();

	console.log("============== create agreement ==========");
	const ac = await b.agreements.create({
		mode: "0000",
		payerReference: "01770618575",
		intent: "sale",
		currency: "BDT",
		amount: "12",
		merchantInvoiceNumber: "ASDDSADSASdADS",
	});

	console.log(ac);
	await new Promise((resolve) => setTimeout(resolve, 30000));

	console.log("============== execute agreement ==========");
	console.log(ac.paymentID);
	const ae = await b.agreements.execute({ paymentID: ac.paymentID });
	console.log(ae);

	console.log("============== query agreement ==========");
	const aq = await b.agreements.query({ agreementID: ae.agreementID });
	console.log(aq);
	// console.log("==============cancel agreement ==========");
	// const acc = await b.agreements.cancel({ agreementID: aq.agreementID });
	// console.log(acc);
	console.log("============== create payment ==========");

	const pc = await b.payment.create({
		mode: "0001",
		payerReference: "01770618575",
		intent: "sale",
		currency: "BDT",
		amount: "1000",
		merchantInvoiceNumber: "ASDDSADSASdADS",
		agreementID: aq.agreementID,
	});
	console.log(pc);
	await new Promise((resolve) => setTimeout(resolve, 40000));
	console.log("============== execute payment ==========");
	const pe = await b.payment.execute({ paymentID: pc.paymentID });
	console.log(pe);

	// console.log("============== query payment ==========");
	// const pq = await b.payment.query({ paymentID: pe.paymentID });
	// console.log(pq);
	// console.log("============== search transaction ==========");
	// const st = await b.transition.search({ trxID: pe.trxID });
	// console.log(st);

	console.log("============== refund transaction ==========");
	const tr = await b.transition.refund({
		paymentID: pe.paymentID,
		amount: "10",
		trxID: pe.trxID,
		sku: "hasdfh",
		reason: "asdfasfads",
	});
	console.log(tr);

	console.log("============== refund status transaction ==========");
	const trs = await b.transition.refundStatus({
		paymentID: pe.paymentID,
		trxID: pe.trxID,
	});
	console.log(trs);
})();
