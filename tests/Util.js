
function assert(actual,expect){
    if(actual !== expect) 
        throw new Error(`Actual: ${actual} is not the same as expected: ${expect}`)
}

function write(x){
    process.stdout.write(x);
}

function writeLine(x){
    process.stdout.write(x + "\n");
}

module.exports = {
    assert,
    write,
    writeLine
}