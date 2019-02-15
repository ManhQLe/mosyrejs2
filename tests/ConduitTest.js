const chalk = require('chalk')
const RClay = require('../src/RClay');
const Conduit = require('../src/Conduit');
const {
    assert,
    write,
    writeLine
} = require('./Util');

try {
    var result, result2;
    var o1 = new RClay({
        sensorPoints: ["X"],
        response:function(center){
            
        }        
    });
    o1.Test = function(x){
        this.center.X = x;
    }

    var o2 = new RClay({
        sensorPoints:["R"],
        response:(center)=>{
            result = center.R;
        }
    });

    var o3 = new RClay({
        sensorPoints:["R"],
        response:(center)=>{
            result2 = center.R + 3;
        }
    })



    write("Testing Conduit.js...")

    var con1 = new Conduit({
        parallelTrx: false
    });

    
    con1.connect(o1, "X");
    con1.connect(o2, "Y");
    assert(con1.contacts.length, 2)

    con1.disconnect(o1,"X");
    assert(con1.contacts.length,1)

    con1.connect(o1, "X")
    assert(con1.contacts.length, 2)

    con1.connect(o2, "R");    
    assert(con1.contacts.length, 3);

    con1.connect(o3,"R");
    assert(con1.contacts.length,4);

    con1.disconnect(o2,"D");
    assert(con1.contacts.length,4);

    con1.disconnect(o2,"Y");
    assert(con1.contacts.length,3);

    con1.connect(o2,"Y")
    assert(con1.contacts.length,4);

    assert(con1.agreement.parallelTrx, false);

    con1.agreement.parallelTrx = true;

    assert(con1.agreement.parallelTrx, true);

    con1.agreement.parallelTrx = false;

    o2.connect(con1,"R");
    o1.connect(con1,"X");
    o3.connect(con1,"R");

    o1.Test(2);
    assert(result,2)

    o1.Test(4);
    assert(result,4);
    assert(result2,7);
    
    let c1 = new RClay();
    let c2 = new RClay();

    let con2 = Conduit.createLink([c1,"1",c2,"1",c2,"X"])
    assert(con2.contacts.length,3);

    con2.link([c1,"2",c1,"1",c2,"Y"])
    assert(con2.contacts.length,5);

    writeLine(chalk.green("passed!"))

} catch (ex) {
    writeLine(chalk.red("failed!"));
    writeLine(chalk.yellow(ex.stack));
}