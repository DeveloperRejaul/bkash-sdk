const Agreement = async ({ postReq, callbackURL }) => {
	return {
		create: async function (data) {
			data = { ...data, callbackURL };
			return await postReq({ url: "create", data });
		},
		execute: async function (data) {
			return await postReq({ url: "execute", data });
		},
		query: async function (data) {
			return await postReq({ url: "agreement/status", data });
		},
		cancel: async function (data) {
			return await postReq({ url: "agreement/cancel", data });
		},
	};
};

module.exports = Agreement;
