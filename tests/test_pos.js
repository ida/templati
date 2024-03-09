const { log } = require('./helpers')
const { Doc, Form, Tag } = require('./..')
const { Field } = require('./../src/field')


function testPos(pos) {

let tag = new Tag()


let args = [ 'div', {}];args.push(
'ett'); tag.addTag(...args)

args = [ 'div', {}];args.push(
'two'); tag.addTag(...args)

args = [ 'div', {}];args.push(
'tre'); tag.addTag(...args)

args = [ 'div', {}];args.push(
'fyr'); args.push(pos);tag.addTag(...args)

log(tag.toHtml())

}
testPos(2)
testPos(-2)



