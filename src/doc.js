const Tag = require('./tag').Tag


function ini(doc, stylePaths, scriptPaths) {

  let name = doc.filePath.split('/') // get everything after last slash
  name = name[name.length-1]
  name = name.split('.')[0] // remove extension
  name = name[0].toUpperCase() + name.slice(1) // uppercase name


  let tag = doc.addTag('html', { lang: 'en-gb'})

  tag = tag.addTag('head')

  tag.addTag('title', {}, name)

  tag.addTag('meta', { charset: 'utf-8'})

  tag = doc.content[0]

  for(let i in stylePaths) {
    doc.content[0].content[0].addTag('link', {
      href: stylePaths[i],
      type: 'text/css',
      rel: 'stylesheet'
    });
  }

  for(let i in scriptPaths) {
    doc.content[0].content[0].addTag('script', { src: scriptPaths[i] } )
  }

  return tag.addTag('body')

}



class Doc extends Tag {

  constructor(filePath, stylePaths=[], scriptPaths=[]) {

    super('!doctype', { html: true })

    this.filePath = filePath
    this.body = ini(this, stylePaths, scriptPaths)

  }


  writeDoc() {
    this.writeHtml(this.filePath)
  }

}


exports.Doc = Doc
