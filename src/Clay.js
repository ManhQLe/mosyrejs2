'use strict'

class Clay {

    constructor(agr) {
        this.__ = {
            agreement: agr || {},
            contacts: []
        }

        Object.defineProperty(this, "agreement", {
            get() {
                return this.__.agreement;
            }
        })

        Object.defineProperty(this, "contacts", {
            get() {
                return this.__.contacts
            }
        })        
    }

    verifyContact(withClay,cp){
        let idx = this._getContactIndex(withClay,cp);
        return idx>=0?this.contacts[idx]:null;
    }

    _getContactIndex(withClay,cp){
        return this.contacts.findIndex(x => x[0] === withClay && this.isSamePoint(x[1], cp));        
    }

    onSignal(fromClay, atConnectPoint, signal) {}

    connect(withClay, atConnectPoint) {}

    disconnect(withClay,atConnectPoint){}

    addContact(withClay, atConnectPoint) {
        const contacts = this.contacts;
        let idx = contacts.findIndex(x => x[0] === withClay && this.isSamePoint(x[1], atConnectPoint))        
        idx < 0 && contacts.push([withClay, atConnectPoint])
    }

    isSamePoint(a, b) {
        return a === b;
    }

    defineAgreement(name,defValue){
        this.agreement.hasOwnProperty(name)?0:this.agreement[name] = defValue;
    }

    static connect(clay1, clay2, atConnectPoint, atConnectPoint2) {
        clay1.connect(clay2, atConnectPoint);
        clay2.connect(clay1, atConnectPoint2 ? atConnectPoint2 : atConnectPoint);
    }

    static vibrate(clay, atConnectPoint, signal, sourceClay) {
        clay.onSignal(sourceClay, atConnectPoint, signal);
    }
}

module.exports = Clay;