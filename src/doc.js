const Tag = require('./tag').Tag


function ini(doc) {

  if(doc.filePath.endsWith('.html')) { // remove extension
    doc.filePath = doc.filePath.slice(0, 5)
  }

  let name = doc.filePath.split('/') // get everything after last slash
  name = name[name.length-1]
  name = name.split('.')[0]
  name = name[0].toUpperCase() + name.slice(1) // uppercase name


  let tag = doc.addTag('html', { lang: 'en-gb'})

  tag = tag.addTag('head')

  tag.addTag('title', {}, name)

  tag.addTag('meta', { charset: 'utf-8'})

  tag = doc.content[0]

  for(let i in doc.stylePaths) {
    doc.addStyleSheet(doc.scriptPaths[i])
  }

  for(let i in doc.scriptPaths) {
    doc.addScriptFile( doc.scriptPaths[i])
  }

  return tag.addTag('body')

}



class Doc extends Tag {

  constructor(filePath='untitled', stylePaths=[], scriptPaths=[]) {

    super('!doctype', { html: true })

    this.filePath = filePath
    this.stylePaths = stylePaths
    this.scriptPaths = scriptPaths
    this.body = ini(this)

  }


  addScriptFile(path) {
    this.content[0].content[0].addTag('script', { src: path })
  }


  addStyleSheet(path) {
    this.content[0].content[0].addTag(
      'link',
      { href: path, type: 'text/css', rel: 'stylesheet'}
    );
  }

  writeConfig() {
    this.writeJson(this.filePath + '.json')
  }

  writeDoc() {
    this.writeHtml(this.filePath + '.html')
  }

}


exports.Doc = Doc
