class Agreements {
    constructor(parent) {
        this.parent = parent;
    }

    async create(data) {
        data = { ...data, callbackURL: this.parent.callbackURL };
        return await this.parent.req({ url: "create", data });
    }

    async execute(agreementID) {
        return await this.parent.req({
            url: "execute",
            data: agreementID,
        });
    }

    async query(agreementID) {
        return await this.parent.req({
            url: "agreement/status",
            data: agreementID,
        });
    }

    async cancel(agreementID) {
        return await this.parent.req({
            url: "agreement/cancel",
            data: agreementID,
        });
    }
}

module.exports = Agreements;
