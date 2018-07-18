const chalk = require('chalk')
const RClay = require('../../src/RClay');
const Conduit = require('../../src/Conduit');
const VClay = require('../VClay')
const BlockClay = require("../BlockClay")

const {
    assert,
    write,
    writeLine
} = require('../Util');

const testPrinter = new RClay({
    sensorPoints:["TESTRESULT"],
    response(center){
        let R = center.TESTRESULT;

        writeLine(R.passed? chalk.green("passed"): chalk.red("failed"));
        if(!R.passed)
        {
            writeLine(chalk.yellow(R.ex.stack))
        }
        center.ENDTEST = 1;
    }
})

class Mult extends RClay{
    constructor(agr){
        super(agr);
        this.agreement.sensorPoints.push("A","B");
    }

    onResponse(){
        let center = this.center;
        center.C = center.A * center.B;
    }
}

class Add extends RClay{
    constructor(agr){
        super(agr)
        this.agreement.sensorPoints.push("A","B");
    }

    onResponse(){
        let center = this.center;
        center.C = center.A + center.B;
    }
}

class CExp extends RClay {
    constructor(agr){
        super(agr);
        this.agreement.sensorPoints.push("X");
        
    }

    onResponse(){
        let center = this.center
        center.Y = Math.exp(center.X);
    }
}



const e1 = new CExp();
const e2 = new CExp();
const e3 = new CExp();

const m1 = new Mult({staged:true});
const a1 = new Add({staged:true});

let count = 0;

const v = new VClay({
    sensorPoints:["R"],
    timeOut:100,
    nextTestCase(){
        if(count++<1000){
            let x = Math.round(Math.random())
            let y = Math.round(Math.random())
            let z = Math.round(Math.random())
            return [x,y,z,(Math.exp(x)+Math.exp(y)) *Math.exp(z)];
        }        
    },    
    actLogic(testCase,center){
        center.A = testCase[0];
        center.B = testCase[1];
        center.C = testCase[2];
    },
    verifyLogic(testCase,center){      
        assert(testCase[3],center.R);
    }
})

Conduit.createLink([v,"A",e1,"X"])
Conduit.createLink([v,"B",e2,"X"])
Conduit.createLink([v,"C",e3,"X"])

Conduit.createLink([e1,"Y",a1,"A"])
Conduit.createLink([e2,"Y",a1,"B"])
Conduit.createLink([e3,"Y",m1,"A"])

Conduit.createLink([a1,"C",m1,"B"])

Conduit.createLink([m1,"C",v,"R"])

const B = new BlockClay();

Conduit.createLink([v,VClay.OUTCOME,testPrinter,"TESTRESULT"])
Conduit.createLink([testPrinter,"ENDTEST",B,BlockClay.EXIT])
write("Testing Path1Test.js...");


v.test();


