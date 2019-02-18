'use strict'

const Clay = require('./Clay')

class MClay extends Clay {
    constructor(agr){
        super(agr)
        this.defineAgreement("sensorPoints",[]);

    }
    
    onSignal(fromClay, atConnectPoint, signal) {}

    connect(withClay, atConnectPoint) {}

    disconnect(withClay,atConnectPoint){}
}

module.exports = MClay;