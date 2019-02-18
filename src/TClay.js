'use strict'

const Clay = require('./Clay')

/*
    Temporal Clay
    Has ability to retain information
*/

class TClay extends Clay {
    constructor(agr){
        super(agr);
        this.__.signalStore = [];
        this.__.collected = new Set();        

        this.__.center = new Proxy(this, {
            get(target, connectPoint) {
                return target._getSignalStore(connectPoint);
            },
            set(target, connectPoint, signal) {
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

    _getSignalStore(cp){  
        let signalStore = this.__.signalStore;      
        const k = signalStore.find(x => this.isSamePoint(cp, x[0]));
        return k ? k[1] : undefined;
    }        
   
    _setSignalStore(cp, signal){
        const signalStore = this.__.signalStore;
        const k = signalStore.find(x => this.isSamePoint(cp, x[0]));
        k ? k[1] = signal : signalStore.push([cp, signal]);
    }

    setSensorPoint(sp,val){
        if(this.agreement.sensorPoints.findIndex(x=>this.isSamePoint(sp,x))>=0)
        {    
            this._setSignalStore(sp,val);
            this.__.collected.add(sp);
        }
    }

    _allSignalsReady(){
        let collected = this.__.collected;
        let sensorPoints = this.agreement.sensorPoints;
        return collected.size === sensorPoints.length
    }

    onInit(){}
}

module.exports = TClay;