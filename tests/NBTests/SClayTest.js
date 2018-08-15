const chalk = require('chalk')
const SClay = require('../../src/SClay');
const RClay = require('../../src/RClay');
const Conduit = require('../../src/Conduit');
const VClay = require('../../src/Util/VClay')
const BlockClay = require("../../src/Util/BlockClay")

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

const add = new RClay({
    sensorPoints:["X","Y"],
    response:(center)=>{
        center.Z = center.X + center.Y;
    },
    staged:true
})

const mult = new RClay({
    sensorPoints:["X","Y"],
    response:(center)=>{
        center.Z = center.X * center.Y;
    },
    staged:true
})

const div = new RClay({
    sensorPoints:["X","Y"],
    response:(center)=>{
        center.Z = center.X / center.Y;
    },
    staged:true
})

let count = 0;

const v = new VClay({
    sensorPoints:["R"],
    timeOut:5000,
    nextTestCase(){
        if(count++<1000){
            let x = Math.round(999*Math.random())
            let y = Math.round(999*Math.random())
            return [x,y,(x*y) + (x/y)];
            //return [x,y,x+y];
        }        
    },    
    actLogic(testCase,center){
        center.A = testCase[0];
        center.B = testCase[1];
    },
    verifyLogic(testCase,center){           
        assert(testCase[2],center.R);
    }
})

const s = new SClay({
    layoutMap:[
        {sp:"SA",conns:[mult,"X",div,"X"]},
        {sp:"SB",conns:[mult,"Y",div,"Y"]},
        {conns:[mult,"Z",add,"X"]},
        {conns:[div,"Z",add,"Y"]},
        {sp:"SR",conns:[add,"Z"]}
    
    // {sp:"SA",conns:[add,"X"]},
    // {sp:"SB",conns:[add,"Y"]},
    // {sp:"SR",conns:[add,"Z"]}
]
})


const B = new BlockClay();
Conduit.createLink([v,"A",s,"SA"])
Conduit.createLink([v,"B",s,"SB"])
Conduit.createLink([v,"R",s,"SR"])


Conduit.createLink([v,VClay.OUTCOME,testPrinter,"TESTRESULT"])
Conduit.createLink([testPrinter,"ENDTEST",B,BlockClay.EXIT])
write("Testing non-blocking SClay.js...");


v.test();


