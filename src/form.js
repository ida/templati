const Tag = require('./tag').Tag


const inputTypes = ['text', 'number']


const fieldTypes = ['textarea', 'select']



class Form extends Tag {

  
  constructor(name, action='/', fields) {

    super('form', { action: action, method: 'post' })

    this.addTag('input', {type: 'hidden', name: '_formname', value: name})
  
    this.addTag('input', {type: 'submit', value: name})

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
        if(attrs.value) {
          content = attrs.value
          delete attrs.value
        }
      }
      
    }
    

    var field = new Tag('field', { style: 'display: inline-block;'})
    
    field.addTag('label', {}, attrs.name)
    
    field.addTag(tagName, attrs, content)

    this.content.splice(this.content.length-1, 0, field) // insert at second last pos
    
  
  }



}


exports.Form = Form
