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


  constructor(name, action='/', fields, LABELS=true) {

    super('form', { name: name, action: action, method: 'post' })

    this.LABELS = LABELS

    if(LABELS) this.addTag('label', {}, name)

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

    this.content.splice(this.content.length-1, 0, field) // insert at second last pos

    return field

  }

}


exports.Form = Form
