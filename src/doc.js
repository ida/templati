const path = require('path')

const Tag = require('./tag').Tag

const titlelize = require('./helpers').titlelize



const addTags = (doc, stylePaths, scriptPaths) => {

  let tag = doc.addTag('html', { lang: 'en-gb'})

  tag = tag.addTag('head')

  tag.addTag('meta', { charset: 'utf-8'})

  tag.addTag('meta', {
    name: 'viewport',
    content: 'width=device-width, initial-scale=1.0'
  });

  tag.addTag('title', {}, titlelize(doc.name))

  tag = doc.content[0]

  if(doc.emergencyStyle) {

    doc.content[0].content[0].addTag('style', {},
`@media (prefers-color-scheme: dark) {

  :root {

    background: #272727;

    color: #f9ee99

  }

  input,

  textarea {

    background: inherit;

    color: inherit;

  }

}`  );

  }


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

  doc.body = tag.addTag('body')

}



const iniDoc = (doc, stylePaths, scriptPaths) => {

  setPathOfName(doc)

  setNameOfPath(doc)

  addTags(doc, stylePaths, scriptPaths)

}



const setPathOfName = doc => {

  if( ! doc.name.endsWith('.html') )  return

  doc.filePath = doc.name

}



const setNameOfPath = doc => {

  if(doc.filePath === null)  return

  let name = path.basename(doc.filePath)

  let extension = path.extname(name)

  name = name.slice(0, name.length - extension.length)

  doc.name = name

}



class Doc extends Tag {


  constructor(filePathOrDocName='', stylePaths=[], scriptPaths=[]) {

    super('!doctype', { html: true })

    this.name = filePathOrDocName

    this.filePath = null

    this.body = null

    this.emergencyStyle = true // regard system theme is dark mode

    iniDoc(this, stylePaths, scriptPaths)

  }


  writeDoc() {

    if( ! this.filePath ) throw new Error('No filePath given!')

    this.writeHtml(this.filePath)

  }

}


module.exports.Doc = Doc
