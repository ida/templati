const { log, onError } = require('./helpers');LOG=
10; const { Field } = require('./../src/field')
const { Tag } = require('./../src/tag')


log('Create an instance of Field')

let field = new Field()

log(field)


log('Create a named field')

field = new Field('vatnr')

log(field)


log('Create checkbox field')

field = new Field('', [2, 7, 7], 'checkbox')

log(field)

