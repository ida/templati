Templata
========


What
----

Create tags programatically and write an HTML-file of them.
Ment for server-side pre-rendering, could also be used for client-
side rendering.


Why
---

Existing templating-solutions often come with an own syntax
and restrictions in applying logic or using substitutes which
hide the logic entirely.

The author wanted to have a lightweight solution which gives full
control, leaving the reponsibility to not overload templates with
logical operations to the developers and their conventions, and
use native ECMA (a.k.a. JavaScript) instead of introducing more syntax.


How
---


A class Tag represents a template-element and has the properties
"tagName", "attr" and "content", we can create a tag like this:

    const Tag = require('templata').Tag

    let tag = new Tag('div', { class: 'taggy', 'id': 'root-tag' })

And add child-tags in it, like this:

    let child = tag.addTag('div', {}, 'Some text for the child')

At any point Tags can be rendered:

    let html = tag.toHtml()

Printing the result with `console.log(html)`, should now give:

    <div class="taggy" id="root-tag">
       <div>
         Some text for the child
       </div>
     </div>

Now we have a snippet for re-use, but what about templates?

A class Doc is an extension of Tag and is initialized with a
template-path, and optionally CSS- and JS-paths:

    const Doc = require('templata').Doc
 
    let doc = new Doc(
      'frontend/templates/main.html',
	  ['frontend/styles/main.css'],
      ['frontend/scripts/main.js', frontend/scripts/fancy.js']
	);


It has the properties 'head' and 'body' for quick-access, both are
of class Tag, let's add some content:

	doc.body.addTag('h1', {}, 'Hello screen!')

At any point Docs can be written like this:

	doc.writeHtml()

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
to change these or access any Tag-object from a Tag-object,
one can walk the tree like this:

	tag = tag.goUp() // tag is now parent

	tag = tag.goNext() // tag is now next sibling

	tag = tag.goPrev(2) // tag is now second-previous sibling

	tag = tag.goDown() // tag is now first-child

	tag = tag.goDown(-1) // tag is now last-child

	tag = tag.goDown(3) // tag is now third child


Back to our example, if we'd want to change the lang-attr
in html-tag, we can do:

	let htmlTag = doc.goDown()
	htmlTag.attr.lang = 'es'


Finally let's do an example with some logical-operations,
let's say you have some data of known structure, e.g. an
array of items and you want to apply some conditions, it
would look something like:

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

For questions, bug-reports and towel-returns, please open an issue
on https://github.com/ida/templata/issues/new


Author
------

Ida Ebkes, 2018


License
-------

MIT, a copy is attached.
