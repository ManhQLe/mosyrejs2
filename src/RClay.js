'use strict'

const TClay = require('./TClay')

class RClay extends TClay {
    constructor(agr) {
        super(agr);
    }

    onSignal(fromClay, cp, signal) { 
        const contact = this.verifyContact(fromClay,cp);        
        if(contact && 
        this.agreement.sensorPoints.findIndex(p=>this.isSamePoint(cp,p))>=0)
        {
            const me = this;
            const{collected}= me.__;
            const {sensorPoints} = me.agreement;
            me._setSignalStore(cp,signal);
            collected.add(cp);        
            if (collected.size === sensorPoints.length) {
                me.agreement.staged && collected.clear();
                me.onResponse(cp);
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

// RClay.__process= function(me, connectPoint, signal) {

//     const {
//         contacts,
//         collected
//     } = me.__;
//     const {sensorPoints} = me.agreement;
//     if (sensorPoints.findIndex(cp => me.isSamePoint(cp, connectPoint)) >= 0) {        
//         me.__.setSignalStore(connectPoint,signal);
//         collected.add(connectPoint);        
//         if (collected.size === sensorPoints.length) {
//             me.agreement.staged && collected.clear();
//             me.onResponse(connectPoint);
//         }
//     } else {
//         let pair = contacts.find(p => me.isSamePoint(p[1], connectPoint))  
//         pair && Clay.vibrate(pair[0], connectPoint, signal, me)
//     }
// }

module.exports = RClay;