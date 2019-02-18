'use strict'

const TClay = require('./TClay')

class MClay extends TClay {
    constructor(agr){
        super(agr)

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
}

module.exports = MClay;