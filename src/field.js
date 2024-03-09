const { Tag } = require('./tag')

const { titlelize } = require('./helpers')



const typeArgs = { // { typeName: TagArgs=[tagName, attr, content] , }

  select:      ['select',   {                  }, [] ],

  radio:       ['input',    { type: 'radio'    }, '' ],

  checkbox:    ['input',    { type: 'checkbox' }, '' ],

  text:        ['input',    { type: 'text'     }, '' ],

  textarea:    ['textarea', {                  }, '' ],

}



function genTagArgs(name, value, type) {

  let args = typeArgs[type]

  if(name) args[1].name = name

  if( ! value ) return args

  if(type == 'textarea' || type == 'select') args[2] = value

  else args[1].value = value

  return args

}



class Field extends Tag {

  constructor(name='', value='', type='text') {

    const args = genTagArgs(name, value, type)

    super(...args)

    this.type = type

  }

}



exports.Field = Field
