'use strict'

const TClay = require('./TClay')

class RClay extends TClay {
    constructor(agr) {
        super(agr);
    }

    onSignal(fromClay, cp, signal) { 
        const contact = this.verifyContact(fromClay,cp);        
        if(contact && 
        this._isValidSensorPoint(cp))
        {
            const{collected}= this.__;
            this.setSensorPoint(cp,signal)
            if (this._allSignalsReady()) {
                this.agreement.staged && collected.clear();
                this.onResponse(cp);
            }
        }
    }

    disconnect(withClay,connectPoint){
        let idx = this._getContactIndex(withClay,connectPoint);
        idx>=0 && this.contacts.splice(idx,1);
    }

    connect(withClay, atConnectPoint) {
        this.addContact(withClay,atConnectPoint);
    }
    
    addContact(withClay,atConnectPoint){
        const contacts = this.contacts;
        let pair = contacts.find(x => this.isSamePoint(x[1], atConnectPoint))
        pair? pair[0] = withClay: contacts.push([withClay, atConnectPoint])
    }
    
    onResponse(cp){
        const response = this.agreement.response
        response(this.center,this,cp);
    }

    onInit(){
        const {init} = this.agreement;
        init?init(this):1
    }

}

module.exports = RClay;