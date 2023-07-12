const Transaction = async ({ postReq }) => {
	return {
		search: async function (data) {
			return await postReq({
				url: `general/searchTransaction`,
				data,
			});
		},

		refund: async function (data) {
			return await postReq({ url: `payment/refund`, data });
		},

		refundStatus: async function (data) {
			return await postReq({ url: `payment/refund`, data });
		},
	};
};

module.exports = Transaction;
