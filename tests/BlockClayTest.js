const chalk = require('chalk')
const BlockClay = require('./BlockClay');

const {
    assert,
    write,
    writeLine
} = require('./Util');

try {
    
    write("Testing BlockClay.js...");
    var c1 = new BlockClay();                 
    writeLine(chalk.green("passed!"))
    c1.center["EXIT"] = 1

} catch (ex) {
    writeLine(chalk.red("failed!"));
    writeLine(chalk.yellow(ex.stack));    
}