const fs = require('fs')


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
const flagOnlyAttributeNames = ['html', 'checked', 'defer']

let listTagName = 'dl'
let keyTagName  = 'dt'
let itemTagName = 'dd'



function addTag(parentTag, tagName, attr={}, content=[]) {
// Append new tag to 'parentTag.content'.
// If 'parentTag.content' already contains text, create a wrapper-tag
// around the text before appending the new tag, so you can address
// the text as an own element specifically in the frontend (CSS/JS).

    if( ! isList(parentTag.content) ) { // is not default-value-type

      let text = parentTag.content

      parentTag.content = []

      if(text) parentTag.addTag('span', {}, text) // is not empty string

    }

    let tag = new Tag(tagName, attr, content)

    parentTag.content.push(tag)

    return tag
}


function setArrayParams() {
  listTagName = 'ul'
  keyTagName  = 'span'
  itemTagName = 'li'
}


function setObjectParams() {
  listTagName = 'dl'
  keyTagName  = 'dt'
  itemTagName = 'dd'
}

function convertEmptyValue(value) {
  if(value==null) value='null'
  else if(isList(value) == true && value.length < 1) {
    value='[]'
  }
  else if(isDict(value) == true && Object.keys(value).length < 1) {
    value='{}'
  }
  return value
}
function isList(value) {
  return Array.isArray(value)
}
function isDict(value) {
  return typeof(value) == 'object' && isList(value) == false
}

function addTags(parentTag, content) {
// content is expected to be a list or a dict
  parentTag = parentTag.addTag(listTagName)

  for(let key in content) {

    let value = content[key]

    value = convertEmptyValue(value)

    if(isDict(content)) parentTag.addTag(keyTagName, {}, key)

    if(isDict(value) || isList(value)) {
      parentTag = parentTag.addTag(itemTagName)
      parentTag = addTags(parentTag, value)
    }
    else {
      parentTag.addTag(itemTagName, {}, value)
    }
  }
  return parentTag
}


function tagToHtmlFile(tag, filePath) {
  fs.writeFileSync(filePath, tagToHtml(tag))
  console.log('Wrote', filePath)
}


function tagToHtml(tag, currentIndent='', indent='  ') {

    let tagName = tag.tagName
    let attr    = tag.attr
    let content = tag.content


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

    // Increase indent for all tags but doc:
    if(tagName != '!doctype') {
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
      if(tagName == 'textarea') html += String(content)
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


  addTags(contentObject) {
    addTags(this, contentObject)
  }


  toHtml(currentIndent='', indent='  ') {
    return tagToHtml(this, currentIndent, indent)
  }


  writeHtml(filePath) {
    tagToHtmlFile(this, filePath)
  }


}


exports.Tag = Tag
