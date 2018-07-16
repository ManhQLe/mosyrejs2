const chalk = require('chalk')
const VClay = require('./VClay');
const {
    assert,
    write,
    writeLine
} = require('./Util');

try {
    write("Testing VClay.js...");

    let actCalled = 0;
    let veriCalled = 0;
    let caseIdx = 0;
    var o1 = new VClay({
        nextTestCase(c) {

            if(caseIdx<10)
                return caseIdx++;            
        },
        verifyLogic(testCase,center){
            veriCalled++;
            assert(testCase,caseIdx-1);
            assert(center.IN,testCase*2)            
        },
        actLogic(testCase,center) {
            actCalled++;
            assert(testCase,caseIdx-1);
            center["IN"] = testCase * 2;
        },
        sensorPoints:["IN"]
    });

    o1.test();

    assert(actCalled,10);
    assert(caseIdx,10);
    assert(veriCalled,10)

    writeLine(chalk.green("passed!\n"))

} catch (ex) {
    writeLine(chalk.red("failed!\n"));
    writeLine(ex)
    writeLine(chalk.yellow(ex.stack + "\n"));    
}
