const RClay = require('../src/RClay')

class VClay extends RClay {
    constructor(agr) {
        super(agr);
        this.defineAgreement("actLogic", () => {})
        this.defineAgreement("verifyLogic", () => {})
        this.defineAgreement("nextTestCase", () => {})
        this.defineAgreement("timeOut", Infinity);

        this.__.currentCase = null;
        this.__.dead = false;
        this.__.timeOut = null;
        let {
            sensorPoints
        } = this.agreement;
        if (sensorPoints.findIndex(x => this.isSamePoint(x, VClay.outSensor)) >= 0)
            throw "Cannot use reserve sensor point"
    }

    onResponse() {
        let {
            verifyLogic
        } = this.agreement
        try {
            if (this.__.dead)
                return;
            verifyLogic(this.__.currentCase, this.center);
            clearTimeout();
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
        if (this.__.currentCase !== undefined) {
            this.checkTimeOut();
            actLogic(this.__.currentCase, this.center);
        } else
            this.finish({
                passed: true
            });
    }

    checkTimeOut() {
        if (this.agreement.timeOut !== Infinity)
            setTimeout(() => {
                this.__.dead = true;
                this.finish({
                    passed:false,
                    ex:"component did not response in specified time frame"
                })
            }, this.agreement.timeOut)
    }

    clearTimeOut(){
        clearTimeout(this.__.timeOut);
        this.__.timeOut = null;
    }

    finish(r) {
        this.__.dead = false;
        if (++this.__._count !== 0)
            this.center[VClay.outSensor] = r;
    }
}


VClay.outSensor = "__M3G1CPO47"
module.exports = VClay