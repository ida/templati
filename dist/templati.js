//
// templati-1.0.9
//

function addTag(parentTag, tagName, attr={}, content=[]) {
// Append new tag to 'parentTag.content'.
// If 'parentTag.content' already contains text, create a wrapper-tag
// around the text before appending the new tag, so you can address
// the text as an own element specifically in the frontend (CSS/JS).

    if( ! Array.isArray(parentTag.content) ) { // is not default-value-type

      let text = parentTag.content

      parentTag.content = []

      if(text) parentTag.addTag('span', {}, text) // is not empty string

    }

    let tag = new Tag(tagName, attr, content)

    parentTag.content.push(tag)

    return tag
}

function tagToHtml(tag, currentIndent='', indent='  ') {

    let tagName = tag.tagName
    let attr    = tag.attr
    let content = tag.content


    // Tag-types which don't need a closing-tag:
    const selfClosingTagNames = [
    '!doctype',
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
    'command',
    'keygen',
    'menuitem'
    ]


    // Valueless attributes which either exist, or not:
    const flagOnlyAttributeNames = ['html', 'checked', 'defer', 'selected', 'autofocus']


    // Tag BEGIN (opening-tag):

    var html = currentIndent + '<' + tagName
    for(let propName in attr) {
      let value = attr[propName]
      if(flagOnlyAttributeNames.indexOf(propName) == -1) {
        html += ' ' + propName + '="' + value + '"'
      }
      else if(value !== false && value !== true) {
        throw 'Error: Flag-only property expected to be either true or false!'
            + 'Got property " ' + propName + '" with value ' + value
      }
      else if(value === true) {
        html += ' ' + propName
      }
    }

    if(tagName == 'textarea') html += '>'
    else html += '>\n'

    // Increase indent for all tags but doc and html:
    if(tagName != '!doctype' && tagName != 'html') {
      currentIndent += indent
    }


    // Tag CONTENT:

    // Content is a function which returns content:
    if(typeof(content) == 'function') {
      content = content()
    }

    // Content is an array (of tag-objects):
    if(Array.isArray(content)) {
      for(let i in content) {
        // Call this function on each item (tag-object) of array:
        html += tagToHtml(content[i], currentIndent)
      }
    }

    else {
      // TODO  replace < with &lt;
      if(tagName == 'textarea' || tagName == 'pre') html += String(content)
      else html += currentIndent + String(content) + '\n'
    }


    // Decrease indent, if any left:
    if(currentIndent.length > 0) {
      currentIndent = currentIndent.slice(indent.length)
    }


    // Tag END (closing-tag):

    if(selfClosingTagNames.indexOf(tagName) == -1) {
      if(tagName == 'textarea') html += '</' + tagName + '>\n'
      else html += currentIndent + '</' + tagName + '>\n'
    }

    return html

}

class Tag {


  constructor(tagName='div', attr={}, content=[]) {

    this.tagName = tagName, // E.g. 'body', 'div', etc.
    this.attr = attr,      //  Key-value-pairs of tag-attributes.
    this.content = content//   A string for text, or an array of child-tag(s),
                         //    or a function which returns a string or array.
  }


  addTag(tagName, attr={}, content=[]) {
    if(tagName instanceof Tag) this.content.push(tagName)
    else return addTag(this, tagName, attr, content)
  }


  toHtml(currentIndent='', indent='  ') {
    return tagToHtml(this, currentIndent, indent)
  }


  toJson() {
    return JSON.stringify(this)
  }


  writeHtml(filePath) {
    tagToHtmlFile(this, filePath)
  }


  writeJSON(filePath) {
    fs.writeFileSync(filePath, this.toJson())
  }


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

    this.body = iniDoc(this, stylePaths, scriptPaths)

  }


  writeDoc() {

    if( ! this.filePath ) throw `

    Cannot write doc because no filePath was given.

    Set it like this: docObject.filePath = 'path/to/file.html'

` // eo string

    this.writeHtml(this.filePath)

  }

}

function iniDoc(doc, stylePaths, scriptPaths) {

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

