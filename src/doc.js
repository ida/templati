const Tag = require('./tag').Tag


function ini(doc, stylePaths, scriptPaths) {

  if( ! doc.name ) {
    let name = doc.filePath.split('/') // get everything after last slash
    name = name[name.length-1]
    name = name.split('.')[0] // remove extension
    name = name[0].toUpperCase() + name.slice(1) // uppercase name
    doc.name = name
  }

  let tag = doc.addTag('html', { lang: 'en-gb'})

  tag = tag.addTag('head')

  tag.addTag('meta', { charset: 'utf-8'})

  tag.addTag('meta', {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1.0'
  });

  tag.addTag('title', {}, doc.name)

  tag = doc.content[0]

  for(let i in stylePaths) {
    doc.content[0].content[0].addTag('link', {
      href: stylePaths[i],
      type: 'text/css',
      rel: 'stylesheet'
    });
  }

  for(let i in scriptPaths) {
    doc.content[0].content[0].addTag('script', {
      src: scriptPaths[i]
    });
  }

  return tag.addTag('body')

}



class Doc extends Tag {

  constructor(filePathOrDocName, stylePaths=[], scriptPaths=[]) {

    if( ! filePathOrDocName ) throw `
  Cannot create Doc, you need to pass a doc-name or file-path, e.g.:

    var doc = new Doc('about')

  Or:

    var doc = new Doc('path/to/about.html')
` // eo string

    super('!doctype', { html: true })

    this.filePath = null

    this.name = null

    if(filePathOrDocName.endsWith('.html')) {
      this.filePath = filePathOrDocName
    }
    else {
      this.name = filePathOrDocName
    }

    this.body = ini(this, stylePaths, scriptPaths)

  }


  writeDoc() {

    if( ! this.filePath ) throw `

    Cannot write doc because no filePath was given.

    Set it like this: docObject.filePath = 'path/to/file.html'

` // eo string

    this.writeHtml(this.filePath)

  }

}


exports.Doc = Doc
