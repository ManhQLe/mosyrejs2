const chalk = require('chalk')
const BlockClay = require('../src/Util/BlockClay');
const Conduit = require('../src/Conduit')
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
    let con = new Conduit()
    
    con.link([c1,"EXIT",c1,"OUT"])

    c1.center["OUT"] = 1;

} catch (ex) {
    writeLine(chalk.red("failed!"));
    writeLine(chalk.yellow(ex.stack));    
}