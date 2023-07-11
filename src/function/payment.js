function Payment() {
	let parentData = this;

	const payment = {
		create: async function (data) {
			data = { ...data, callbackURL: parentData.callbackURL };
			return await parentData.reqPost({ url: "create", data });
		},

		execute: async function (data) {
			return await parentData.reqPost({ url: "execute", data });
		},

		query: async function (data) {
			return await parentData.reqPost({ url: "payment/status", data });
		},
	};

	return payment;
}

module.exports = Payment;
