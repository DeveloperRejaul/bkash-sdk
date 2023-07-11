const axios = require("axios");
const {appKey,appSecret,password,username} = require('./constents')

class Bkash{

sendBox  = `https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant`
live = `https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant`

 constructor(userName, password, appKey, appSecret, isLive){
    this.userName = userName,
    this.password = password,
    this.appKey = appKey,
    this.appSecret = appSecret,
    this.baseUrl = isLive?this.live:this.sendBox
    this.initTocken()
    this.tocken = null
    this.paymentId = null
}

    async initTocken(){

        const headers= {
            'username':this.userName,
            'password':this.password
        }
        const data = {
            'app_key' :this.appKey,
            'app_secret' :this.appSecret,
        }

        try {
            const response = await axios.post(this.baseUrl,data,  {headers})
        
            this.tocken = response.data.id_token
            return response.data
        } catch (error) {
            throw new Error("Server error")
        }
    }

    async getToken (){
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.tocken;
    }

    async refreshTocken (){

    const initPayment =   await this.initTocken()

    const refreshTockenurl = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/refresh';
        const data = {
            app_key:this.appKey,
            app_secret:this.appSecret,
            refresh_token:initPayment.refresh_token

        }
        const headers = {
            'username':username,
            'password':password
        }

        try {
            const response = await axios.post(refreshTockenurl, data, {headers})
            //console.log(response.data);
            return response.data
        } catch (error) {
            throw new Error("Server error")
        }
    }

    async getHeaderArgomentForAgeemrnt (){

        return{
            'accept': 'application/json',
            'content-type': 'application/json',
            'Authorization': await this.getToken(),
            'X-APP-Key': this.appKey,
        }
    }

    async  agreement (payerReference, callbackURL, amount ){

        const createPaymentUrl = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create';
        const data = {
            'mode': '0000',
            'intent': 'sale',
            'currency': 'BDT',
            'amount': amount,
            'callbackURL': callbackURL,
            'payerReference': payerReference
        }

        const headers = await this.getHeaderArgomentForAgeemrnt()
        
        try {
            const response = await axios.post(createPaymentUrl,data,{headers});
            this.paymentId = response.data.paymentID
            //console.log(response.data);
            return response?.data
        } catch (error) {
            throw new Error('agreement create error')
        }

    }

    async executePayment(){
        const exicutePayentUrl =  'https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute';

        const data = {
            'paymentID': this.paymentId
        }
        const headers = {
                'Authorization': await this.getToken(),
                'X-APP-Key': this.appKey,
                'accept': 'application/json',
                'content-type': 'application/json'
            }

        try {
            const response = await axios.post(exicutePayentUrl,data,{headers});
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }

    }

}


const b = new Bkash(username, password, appKey, appSecret, false)
b.agreement('01857735471', 'https://github.com/','1').then(res=>{
    b.executePayment()
})



