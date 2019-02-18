'use strict'

const TClay = require('./TClay')

class MClay extends TClay {
    constructor(agr){
        super(agr)
        this.defineAgreement("sensorPoints",[]);

    }
    
    onSignal(fromClay, cp, signal) { 
        const contact = this.verifyContact(fromClay,cp);        
        if(contact && 
        this.agreement.sensorPoints.findIndex(p=>this.isSamePoint(cp,p))>=0)
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
}

module.exports = MClay;