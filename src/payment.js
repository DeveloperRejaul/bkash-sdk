class Payment {
    constructor(parent) {
        this.parent = parent;
    }

    async create(data) {
        data = { ...data, callbackURL: this.parent.callbackURL };

        return await this.parent.req({
            url: "create",
            data,
        });
    }

    async execute(paymentID) {
        return await this.parent.req({
            url: "execute",
            data: paymentID,
        });
    }

    /**
     * @param {object} paymentID  query payment
     * @returns
     */
    async query(paymentID) {
        return await this.parent.req({
            url: "payment/status",
            data: paymentID,
        });
    }
}

module.exports = Payment;
