const fs = require('fs')



function addTag(parentTag, tagName, attr={}, content=[]) {
// Append new tag to 'parentTag.content'.
// If 'parentTag.content' already contains text, create a wrapper-tag
// around the text before appending the new tag, so you can address
// the text as an own element specifically in the frontend (CSS/JS).

  if( ! Array.isArray(parentTag.content) ) { // is not default-value-type

    let text = parentTag.content

    parentTag.content = []

    if(text) parentTag.addTag('span', {}, text)

  }

  let tag = new Tag(tagName, attr, content)

  parentTag.content.push(tag)

  return tag

}


function tagToHtmlFile(tag, filePath) {
  fs.writeFileSync(filePath, tagToHtml(tag))
  console.log('Wrote', filePath)
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

  if(tagName == 'textarea' || (tagName == 'script' && content == '') ) {
    html += '>'
  }
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
    else {
      let lines = content.split('\n')
      for(let line of lines) {
        html += currentIndent + String(line) + '\n'
      }
    }
  }

  // Decrease indent, if any left:
  if(currentIndent.length > 0) {
    currentIndent = currentIndent.slice(indent.length)
  }


  // Tag END (closing-tag):

  if(selfClosingTagNames.indexOf(tagName) == -1) {
    if(tagName != 'textarea' && tagName != 'pre') {
      html += currentIndent
    }
    html += '</' + tagName + '>\n'
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



module.exports = {

  addTag: addTag,

  tagToHtml: tagToHtml,

  Tag: Tag

}
