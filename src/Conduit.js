const Clay = require('./Clay')

class Conduit extends Clay {
    constructor(agr) {
        super(agr)
        this.agreement.hasOwnProperty("parallelTrx")?0:this.agreement.parallelTrx = true;
    }

    onSignal(fromClay, atConnectPoint, signal) {
        const pair = this.verifyContact(fromClay, atConnectPoint);
        
        if(!pair)
            return;

        const contacts = this.contacts;
        const {parallelTrx} = this.agreement;
        contacts.forEach(p => {
            if (p[0] !== pair[0] || !this.isSamePoint(p[1], pair[1])) {
                parallelTrx?
                setTimeout(Clay.vibrate,0,p[0],p[1],signal,this) 
                :Clay.vibrate(p[0],p[1],signal,this);
            }
        });
    }

    connect(withClay, atConnectPoint) {
        this.addContact(withClay, atConnectPoint);
    }

    addContact(withClay, atConnectPoint) {
        const contacts = this.contacts;

        if (contacts.findIndex(x => x[0] === contacts) >= 0 && (withClay instanceof Conduit))
            return;

        let idx = contacts.findIndex(x => x[0] === withClay && this.isSamePoint(x[1], atConnectPoint))
        idx < 0 && contacts.push([withClay, atConnectPoint])
    }
}

module.exports = Conduit;