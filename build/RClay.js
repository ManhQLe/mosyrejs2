'use strict'

const Clay = require('./Clay')

class RClay extends Clay {
    constructor(agr) {
        super(agr);
        this.__.signalStore = [];
        this.__.collected = new Set();        
        var me = this;

        this.__.setSignalStore = function (cp, signal) {
            const signalStore = this.signalStore;
            const k = signalStore.find(x => me.isSamePoint(cp, x[0]));
            k ? k[1] = signal : signalStore.push([cp, signal]);
        }
        this.__.getSignalStore = function (cp) {
            const k = this.signalStore.find(x => me.isSamePoint(cp, x[0]));
            return k ? k[1] : undefined;
        }

        this.__.center = new Proxy(this, {
            get(target, connectPoint) {
                return target.__.getSignalStore(connectPoint);
            },
            set(target, connectPoint, signal) {
                //RClay.__process(target, connectPoint, signal);
                const me = target;
                let pair = me.__.contacts.find(p => me.isSamePoint(p[1], connectPoint))  
                pair && Clay.vibrate(pair[0], connectPoint, signal, me)
                return true;
            }
        });

        Object.defineProperty(this, "center", {
            get() {
                return this.__.center;
            }
        })

        this.defineAgreement("sensorPoints",[]);
        this.onInit();
    }

    onSignal(fromClay, cp, signal) { 
        const contact = this.verifyContact(fromClay,cp);        
        if(contact && 
        this.agreement.sensorPoints.findIndex(p=>this.isSamePoint(cp,p))>=0)
        {
            const me = this;
            const{collected}= me.__;
            const {sensorPoints} = me.agreement;
            me.__.setSignalStore(cp,signal);
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
    
    setSensorPoint(sp,val){
        this.agreement.sensorPoints.findIndex(x=>this.isSamePoint(sp,x))>=0
        &&this.__.setSignalStore(sp,val);
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