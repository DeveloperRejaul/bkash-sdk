function Transaction() {
	let parentData = this;

	const transaction = {
		search: async function (data) {
			return await parentData.reqPost({
				url: `general/searchTransaction`,
				data,
			});
		},

		refund: async function (data) {
			return await parentData.reqPost({ url: `payment/refund`, data });
		},

		refundStatus: async function (data) {
			return await parentData.reqPost({ url: `payment/refund`, data });
		},
	};

	return transaction;
}

module.exports = Transaction;
