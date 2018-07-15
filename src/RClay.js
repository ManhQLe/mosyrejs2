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


        agr.sensorPoints ? 1 : agr.sensorPoints = [];

        this.__.center = new Proxy(this, {
            get(target, connectPoint) {
                return target.__.getSignalStore(connectPoint);
            },
            set(target, connectPoint, signal) {
                __process(target, connectPoint, signal);
                return true;
            }
        });

        this.onInit();
    }

    onSignal(fromClay, cp, signal) {        
        const contact = this.verifyContact(fromClay,cp);
        contact && (this.getCenter()[cp] = signal);        
    }

    connect(withClay, atConnectPoint) {
        this.addContact(withClay,atConnectPoint);
    }
    
    addContact(withClay,atConnectPoint){
        const contacts = this.contacts;
        let pair = contacts.find(x => this.isSamePoint(x[1], atConnectPoint))
        pair? pair[0] = withClay: contacts.push([withClay, atConnectPoint])
    }

    verifyContact(withClay,cp){
        return this.contacts.find(x => x[0] === withClay && this.isSamePoint(x[1], cp))
    }
    
    onResponse(cp){
        const response = this.agreement.response || (()=>{});
        response(this.getCenter(),this,cp);
    }

    getCenter(){
        return this.__.center;
    }

    onInit(){
        const {init} = this.agreement;
        init?init(this):1
    }

}

function __process(me, connectPoint, signal) {

    const {
        contacts,
        collected,        
    } = me.__;
    const {sensorPoints} = me.agreement;
    if (sensorPoints.findIndex(cp => me.isSamePoint(cp, connectPoint)) >= 0) {        
        me.__.setSignalStore(connectPoint,signal);
        collected.add(connectPoint);
        if (collected.size === sensorPoints.length) {
            me.agreement.staged && collected.clear();
            me.onResponse(connectPoint);
        }
    } else {
        let pair = contacts.find(p => me.isSamePoint(p[1], connectPoint))        
        pair && Clay.vibrate(pair[0], connectPoint, signal, me)
    }
}

module.exports = RClay;