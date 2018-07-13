const Clay = require('./Clay')

class RClay extends Clay {
    constructor(agr) {
        super(arg);
        this.__.signalStore = [];
        this.__.collected = new Set();
        this.__.sensorPoints = [];
        var me = this;

        this.__.setSignalStore = function (cp, signal) {
            const signalStore = this.signalStore;
            const k = signalStore.find(x => me.isSamePoint(cp, x[0]));
            k ? k[1] = signal : signalStore.push([cp, signal]);
        }
        this.__.getSignalStore = function (cp) {
            const k = signalStore.find(x => me.isSamePoint(cp, x[0]));
            return k ? k[1] : undefined;
        }


        arg.connectPoints ? 1 : arg.connectPoints = [];

        this.__.center = new Proxy(this, {
            get(target, connectPoint) {
                return target.__.signalStore[connectPoint];
            },
            set(target, connectPoint, signal) {
                __process(target, connectPoint, signal);
                return true;
            }
        });

        this.onInit();
    }

    onSignal(fromClay, cp, signal) {
        const {sensorPoints} = this.__;
        const contact = this.getContact(fromClay,cp);
        contact && (this.getCenter()[cp] = signal);        
    }

    connect(withClay, cp) {
        this.addContact(withClay,cp);
    }

    getCenter(){
        return this.__.center;
    }

    onInit(){
        const {onInit} = this.agreement;
        onInit?onInit():1
    }

}

function __process(me, connectPoint, signal) {

    const {
        contacts,
        collected,
        sensorPoints
    } = me.__;
    const onResponse = me.agreement.onReponse || (()=>{});

    if (sensorPoints.findIndex(cp => me.isSamePoint(cp, connectPoint)) >= 0) {        
        me.__.setSignalStore(connectPoint,signal);

        collected.add(connectPoint);
        if (collected.size === sensorPoints.length) {
            me.staged && collected.clear();
            onResponse(connectPoint);
        }
    } else {
        let pair = contacts.find(p => me.isSameConnectionPoint(p[1], connectPoint))
        pair && Clay.vibrate(pair[0], connectPoint, signal, me)
    }
}