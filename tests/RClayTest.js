const chalk = require('chalk')
const Clay = require('../src/Clay');
const RClay = require('../src/RClay');
const {
    assert,
    write,
    writeLine
} = require('./Util');

try {
    var o1 = new Clay();
    var o2 = new Clay();

    write("Testing RClay.js...")

    let x = 1
    let y = 0;
    var o3 = new RClay({
        sensorPoints:["X","Y"],
        init:()=>{
            x = 2;
        },
        response:(center)=>{
            x = center["X"];
            y = center["X"] + center["Y"];
        }
    })  

    assert(x,2);
    assert(o3.agreement.sensorPoints[0],"X");
    assert(o3.agreement.sensorPoints[1],"Y");

    o3.onSignal(o1,"X",3.14);
    assert(x,2);
    o3.onSignal(o1,"Y",1.618);
    assert(x,2);

    
    o3.connect(o1,"X");
    o3.connect(o1,"Y");

    o3.onSignal(o1,"X",3.14);
    assert(x,2);
    assert(y,0);
    o3.onSignal(o1,"Y",1.618);
    assert(y,3.14 + 1.618);


    o3.agreement.staged = true;
    o3.onSignal(o1,"X",0);
    assert(y,1.618);
    assert(x,0);

    o3.onSignal(o1,"X",1);
    o3.onSignal(o1,"X",5);
    assert(x,0);
    o3.onSignal(o2,"Y",8);
    assert(x,0);
    o3.onSignal(o1,"Y",6);
    assert(x,5);
    assert(y,11);

    writeLine(chalk.green("passed!\n"))


    
} catch (ex) {
    writeLine(chalk.red("failed!\n"));
    writeLine(chalk.yellow(ex.stack + "\n"));    
}