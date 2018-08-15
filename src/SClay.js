'use strict'

const Clay = require('./Clay')
const Conduit = require('./Conduit')

//Layout Map
/* 
    [
        {sp:"",conns:[Clay, sp1, Clay2, sp2...]},
        {sp:"",conns:[Clay, sp1, Clay2, sp2...]},
    ]
*/

class SClay extends Clay {
    constructor(agr) {
        super(agr)

        this.defineAgreement("layoutMap", [])
        this.defineAgreement("build", (clay) => {
            return clay.agreement.layoutMap
        })

        this.__.links = [];

        var map = this.onBuild();
        map.forEach(m => {
            let {
                sp,
                conns
            } = m;
            let links = this.__.links;

            if (sp) {
                let pair = links.find(pair => {
                    return this.isSamePoint(pair.sp, sp)
                })

                if (pair) {
                    pair.link.link(conns);
                } else {
                    pair = {
                        sp,
                        link: Conduit.createLink(conns)
                    }
                    links.push(pair);
                }
            }
            else
                Conduit.createLink(conns)
        })

    }

    onSignal(fromClay, cp, signal) {

    }

    addContact(withClay, atConnectPoint) {
        const contacts = this.contacts;
        let pair = contacts.find(x => this.isSamePoint(x[1], atConnectPoint))
        pair ? pair[0] = withClay : contacts.push([withClay, atConnectPoint])
    }

    connect(withClay, atConnectPoint) {
        let links = this.__.links;
        let pair = links.find(c => this.isSamePoint(atConnectPoint, c.sp))
        if (pair) {
            pair.link.link([withClay, atConnectPoint])
        }
    }

    onBuild() {
        return this.agreement.build(this);
    }
}

module.exports = SClay;