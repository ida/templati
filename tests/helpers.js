LOG = 1
bef = '\n'
aft = bef
errBef = ''
errAft = errBef
module.exports.log = (...args) => { if(LOG) console.log(bef, ...args, aft) }
module.exports.onError = (...args) => { throw new Error(errBef + args + errAft ) }
