const RClay = require("../src/RClay")
const readline = require('readline');

class BlockClay extends RClay{
    constructor(agr){
        super(agr)
        this.agreement.sensorPoints.push(BlockClay.EXIT)

        readline.emitKeypressEvents(process.stdin);
        process.stdin.on('keypress', () => {
        })
    }

    onResponse(){
        process.exit();
    }    
}
BlockClay.EXIT = "EXIT"
module.exports = BlockClay