const RClay = require('../src/RClay')

class VClay extends RClay {
    constructor(agr) {
        super(agr);
        this.defineAgreement("actLogic", () => {})
        this.defineAgreement("verifyLogic", () => {})
        this.defineAgreement("nextTestCase", () => {})
        
        this.__.currentCase = null;

        let {sensorPoints} = this.agreement;
        if (sensorPoints.findIndex(x => this.isSamePoint(x, VClay.outSensor))>=0)
            throw "Cannot use reserve sensor point"
    }

    onResponse() {
        let {
            verifyLogic
        } = this.agreement
        try {
            verifyLogic(this.__.currentCase, this.center);
            this.test();
        } catch (ex) {
            this.finish({
                passed: false,
                error: ex
            });
        }
    }

    test() {
        let {
            nextTestCase,
            actLogic
        } = this.agreement;

        this.__.currentCase = nextTestCase(this);
        if (this.__.currentCase!==undefined)
            actLogic( this.__.currentCase, this.center);
        else
            this.finish({
                passed: true
            });
    }


    finish(r) {
        this.__.caseIdx = 0;
        this.center[VClay.outSensor] = r;
    }
}


VClay.outSensor = "__M3G1CPO47"
module.exports = VClay