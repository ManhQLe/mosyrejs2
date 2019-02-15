/* 
    Copyright (c) 2017 Manh Le
    MIT License
*/

'use strict'

const Clay = require('./Clay');
const Conduit = require('./Conduit');
const RClay = require('./RClay');
const SClay = require('./SClay');
const VClay = require('./Util/VClay')

window.mosyrejs2 = {
    Clay,
    Conduit,
    RClay,
    SClay,
    Util:{
        VClay
    }
}