const { log, onError } = require('./helpers');LOG=
0;log(


  'Test class Tag'


); const { Tag } = require('./..')

log('Create Tag')
let tag = new Tag()

log('Test Tag.addTag')
tag.addTag('div', {}, 1)
log('childs:', tag.content)

log('Test Tag.addTag again')
tag.addTag('div', {}, 2, 0)
log('childs:', tag.content)

console.log('html:\n',tag.toHtml())





