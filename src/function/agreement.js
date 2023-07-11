function Agreement() {
	let parentData = this;
	const agreement = {
		create: async function (data) {
			data = { ...data, callbackURL: parentData.callbackURL };
			return await parentData.reqPost({ url: "create", data });
		},
		execute: async function (data) {
			return await parentData.reqPost({ url: "execute", data });
		},
		query: async function (data) {
			return await parentData.reqPost({ url: "agreement/status", data });
		},
		cancel: async function (data) {
			return await parentData.reqPost({ url: "agreement/cancel", data });
		},
	};

	return agreement;
}

module.exports = Agreement;
