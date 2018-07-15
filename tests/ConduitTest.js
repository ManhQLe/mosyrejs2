const chalk = require('chalk')
const Clay = require('../src/Clay');
const Conduit = require('../src/Conduit');
const {
    assert,
    write,
    writeLine
} = require('./Util');

try {
    var o1 = new Clay();
    var o2 = new Clay();

    
    
} catch (ex) {
    writeLine(chalk.red("failed!\n"));
    writeLine(chalk.yellow(ex.stack + "\n"));    
}