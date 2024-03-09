let LOG =
false//true
;
// Test initializing a Doc with different params.

const log = (...args) => { if(LOG) console.log(...args) }

const { Doc } = require('./../src/doc')

let name;

log('Test Doc with no params:')
doc = new Doc()


//doc.writeDoc() // break test intentionally


log('Test Doc with native absolute path:')
name = __filename
name += '.html'
doc = new Doc(name)

log('Test writeDoc:')
doc.writeDoc()

log('Test write Doc with relative path:')
name = 'page.html'
doc = new Doc(name)
doc.writeDoc()

/*
log('Test write Doc with non native relative path:')
name = 'relative/path/to/page.html'
doc = new Doc(name)
doc.writeDoc()

log('Test write Doc with non native absolute path:')
name = '/cygwin64/home/ellis/page.html'
doc = new Doc(name)
doc.writeDoc()
doc.writeDoc('../aha.html')
*/
