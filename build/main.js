// Create a static frontend script from sources in './../src'.

const filePath = 'dist/templati.js'

const fs = require('fs')

const app = require('./../package.json')

const tagExports = require('./../src/tag')

const docExports = require('./../src/doc')

const exporteds = [tagExports, docExports]

let string = '//\n// ' + app.name + '-' + app.version + '\n//\n\n'

for(let exported of exporteds) {

  for(let key in exported) {

    string += exported[key].toString() + '\n\n'

  }

}

fs.writeFileSync(filePath, string)

console.log('Wrote', filePath)
