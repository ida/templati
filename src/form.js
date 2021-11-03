const Tag = require('./tag').Tag

const inputTypes = ['text', 'number']

const fieldTypes = ['textarea', 'select']


function titlelize(string) {
  // 'add-item' -> 'Add item'
  string = string[0].toUpperCase() + string.slice(1)
  string = string.replace(/-/g, ' ')
	return string
}



class Form extends Tag {


  constructor(name, action, fields, LABELS=true) {

    if( ! name || ! action ) throw 'Creating a Form requires to pass name and an action!'

    super('form', { name: name, action: action, method: 'post' })

    this.LABELS = LABELS

    if(LABELS) this.addTag('label', {}, titlelize(name) )

    this.addTag('input', {type: 'hidden', name: '_formname', value: name})

    this.submit = this.addTag('input', {type: 'submit', value: titlelize(name) } )

    if(fields) for(let field of fields) this.addField(field)

  }


  addField(attrs, content='') {

    if( ! attrs.name ) throw 'Form.addField needs a "name" in passed attrs.'

    if( ! attrs.type ) attrs.type = 'text'

    var tagName = 'input'

    if(fieldTypes.includes(attrs.type)) {

      tagName = attrs.type

      delete attrs.type

      if(attrs.value) {
        content = attrs.value
        delete attrs.value
      }

    }

    var field = new Tag('field')

    if(this.LABELS && attrs.type != 'hidden') field.addTag('label', {}, attrs.name)

    field.addTag(tagName, attrs, content)

    this.content.splice(this.content.length-1, 0, field) // insert before submit

    return field

  }


  getField(fieldName) {

    for(var field of this.content) {

      // Childless field:

      if(field.attr.name == fieldName) return field

      // Parental field:

      if(Array.isArray(field.content) && field.content.length > 0 ) {

        for(var child of field.content) {

          if(child.attr.name == fieldName) return child

        }
      }
    }
  }


  function removeLabel(form, label) {
    for(var child of form.content) {
      if(child.tagName == 'field') {
        for(var i in child.content) {
          if(child.content[i].tagName == 'label' && child.content[i].content == label) {
            child.content.splice(i, 1)
          }
        }
      }
    }
  }


  function renameLabel(form, oldName, newName) {
    for(var child of form.content) {
      if(child.tagName == 'field') {
        for(var grandchild of child.content) {
          if(grandchild.tagName == 'label' && grandchild.content == oldName) {
            grandchild.content = newName
          }
        }
      }
    }
  }


}


exports.Form = Form
