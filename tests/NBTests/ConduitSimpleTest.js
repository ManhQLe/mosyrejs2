const chalk = require('chalk')
const RClay = require('../../src/RClay');
const Conduit = require('../../src/Conduit');
const {
    assert,
    write,
    writeLine
} = require('../Util');

const a = new RClay({

})
a.test= function(){
    this.center.Z = "Manh"
}

const b = new RClay({
    sensorPoints:["IN"],
    response(center){
        assert(center.IN,"Manh")
        writeLine(chalk.green("passed"))
    }
})

Conduit.createLink([a,"Z",b,"IN"])

write("Testing non block Conduit...")
a.test();






