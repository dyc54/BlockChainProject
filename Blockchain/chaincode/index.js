'use strict';

const chaincode = require('./lib/chaincode');

module.exports.chaincode = chaincode;
module.exports.contracts = [chaincode];