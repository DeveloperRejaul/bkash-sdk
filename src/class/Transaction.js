class Transaction {
    constructor(parent) {
        this.parent = parent;
    }

    async search(trxID) {
        try {
            return await this.parent.req({
                url: `general/searchTransaction`,
                data: trxID,
            });
        } catch (error) {
            throw new Error(`Transaction Search failed: ${error.message} `);
        }
    }

    async refund(data) {
        try {
            return await this.parent.req({
                url: `payment/refund`,
                data,
            });
        } catch (error) {
            throw new Error(`Transaction Search failed: ${error.message} `);
        }
    }

    async refundStatus(data) {
        try {
            return await this.parent.req({
                url: `payment/refund`,
                data,
            });
        } catch (error) {
            throw new Error(`Transaction Search failed: ${error.message} `);
        }
    }
}

module.exports = Transaction;
