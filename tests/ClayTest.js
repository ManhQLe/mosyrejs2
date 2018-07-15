const chalk = require('chalk')
const Clay = require('../src/Clay');
const {
    assert,
    write,
    writeLine
} = require('./Util');

try {
    var o1 = new Clay();
    var o2 = new Clay();


    write("Testing Clay.js...");

    let c1 = new Clay({
        Name: "Manh",
        Age: 8
    })

    assert(c1.agreement.Name, "Manh")
    assert(c1.agreement.Age, 8)

    c1.addContact(o1, "A");
    c1.addContact(o1, "B");

    assert(c1.contacts.length,2);
    c1.addContact(o1,"A");
    
    assert(c1.contacts.length,2);

    c1.addContact(o2,"A");
    assert(c1.contacts.length,3);
    
    c1.addContact(o2,"B");
    assert(c1.contacts.length,4);

    writeLine(chalk.green("passed!\n"))

} catch (ex) {
    writeLine(chalk.red("failed!\n"));
    writeLine(chalk.yellow(ex.stack + "\n"));    
}