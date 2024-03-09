const Field = require('./field').Field

const Tag = require('./tag').Tag

const titlelize = require('./helpers').titlelize



const addFormTags = tag => {

  // Generate and add form label, if wanted:

  if(tag.LABELS) {

    tag.addTag(

      tagName = 'label',

      attr = { style: 'display: block;' },

      content = titlelize(tag.attr.name)

    )

  }

  // Add hidden field '_formname':

  tag.addTag(

    tagName = 'input',

    attr = {

      type: 'hidden',

      name: '_formname',

      value: tag.attr.name

    },

  );


  // Add submit button:

  tag.addTag('input', { type: 'submit', value: 'Save' })


}





class Form extends Tag {


  constructor(name, action, LABELS=true) {

    if( ! name || ! action ) {

      throw new Error('Creating a Form requires to pass a name and an action!')

    }

    super('form', { name: name, action: action, method: 'post' })

    this.LABELS = LABELS

    addFormTags(this)

  }


  addField(name='', value='', type='text') {

    this.addTag(new Field(name, value, type))

  }

}



exports.Form = Form
