Templati
========


A template-engine for nodejs-based apps.


What
----

Create tag-objects programatically and render them at any time.



Why
---

Existing templating-solutions often come with an own syntax
and restrictions in applying logic, or using substitutes which
hide the logic entirely.

The author wanted to have a lightweight solution which gives full
control, leaving the reponsibility to not overload templates with
logical operations to the developers and their conventions, and
use ECMA (a.k.a. JavaScript) instead of introducing more syntax.



How
---

The class "Tag" represents an HTML-element and has the properties
"tagName", "attr" and "content", we can create a tag like this:

    const Tag = require('templati').Tag

    let tag = new Tag('div', { class: 'taggy', 'id': 'root-tag' })


And add child-tags in it with the "addTag"-function:

    let child = tag.addTag('div', {},)

    let grandchild = child.addTag('span', {}, 'Some text')


At any point Tags can be rendered:

    let html = tag.toHtml()


Printing the result with `console.log(html)`, should now give:

    <div class="taggy" id="root-tag">
       <div>
        <span>
            Some text
        </span>
       </div>
     </div>



Now we have a snippet for re-use, but what about templates?


First, we make our tag snippet-tag exportable, adding this line
at the bottom of our example-script:


    module.exports = tag


Let's assume the example-script-file is named 'snippet.js', then
we can import the snippet-tag in any other script-file:

    const snippet = require('./snippet')


Let's create a tag in the other script-file:

    const template = new Tag('div')


Adding a tag into another is also done with the addTag-function:

    template.addTag(snippet)


A class Doc is an extension of Tag and is initialized with a
template-path and optionally CSS- and JS-paths:

    const Doc = require('templati').Doc
 
    let doc = new Doc(
      'frontend/templates/main.html',
	  ['frontend/styles/main.css'],
      ['frontend/scripts/main.js', frontend/scripts/fancy.js']
	);


It has the property 'body' for quick-access of the body-tag,
let's add some content:

	doc.body.addTag('h1', {}, 'Hello screen!')

At any point Docs can be written like this:

	doc.writeDoc()

That'll create or overwrite a file in the given path 'frontend/templates/main.html'
with the following content:

    <!doctype html>
    <html lang="en-gb">
      <head>
        <title>
          Main
        </title>
        <meta charset="utf-8">
        <link rel="stylesheet" href="frontend/styles/main.css">
        <script src="frontend/scripts/main.js" defer></script>
        <script src="frontend/scripts/fancy.js" defer></script>
      </head>
      <body>
        <h1>
          Hello screen!
        </h1>
      </body>
    </html>

As you may have noticed, some sensible defaults are set, e.g.
the language, title and character-decoding. In case you want
to change these, use the tag's content-property for accessing
its children:


    let htmlTag = doc.content[0]

    let headTag = htmlTag.content[0]

    let bodyTag = htmlTag.content[1]


The content-property is also chainable:

    let titleTag = doc.content[0].content[0].content[0]




Back to our example, if we'd want to change the lang-attr
of the html-tag, we can do:

	let headTag = doc.content[0].content[0]
	headTag.attr.lang = 'es'


Finally let's do some logical-operations, let's say you
have some data of known structure, e.g. an array of items,
and you want to apply some conditions, it could look like:

	const data = hereComesTheDataFromSomewhereOutOfTheBlue()

	const isLoggedIn = getLoginStateAsBoolean()


	if(isLoggedIn) {
	  const list = doc.body.addTag('ul')
	  for(let i in data) {
	    list.addTag('li', {}, data[i])
	  }
	}
    else {
	  doc.body.addTag('a', { href: 'login'}, 'Please log in for reading data.')
    }



Issue tracker
-------------

For questions, bug-reports and towel-returns, feel free to open an issue
on https://github.com/ida/templati/issues/new


Author
------

Ida Ebkes, 2018


License
-------

MIT, a copy is attached.
