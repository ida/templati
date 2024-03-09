const { Doc, Form } = require('./..')
const { Field } = require('./../src/field')



let doc, field, form = new Form('person', '/')
form.addField('name', ['ada','ida'], 'select')
form.addField('age', true, 'radio')
console.debug(form.toHtml())


doc = new Doc('tests/test_form.html')
doc.body.addTag(form)
doc.writeDoc()
