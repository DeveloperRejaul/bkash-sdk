const Payment = async ({ postReq, callbackURL }) => {
	return {
		create: async function (data) {
			data = { ...data, callbackURL };
			return await postReq({ url: "create", data });
		},

		execute: async function (data) {
			return await postReq({ url: "execute", data });
		},

		query: async function (data) {
			return await postReq({ url: "payment/status", data });
		},
	};
};

module.exports = Payment;
