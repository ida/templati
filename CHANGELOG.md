# templati changelog


## 1.0.7 (unreleased)


## 1.0.6 (2021-06-25)

* Accidental npm-publish, nothing changed.

## 1.0.5 (2021-06-25)

* Add property 'submit' to Form, to have instant access to it.

* Make Doc.filePath optional, but require at least a doc-name.

## 1.0.4 (2021-06-14)

* Add meta-tag viewport to head-tag of a Doc.

* If a parent tag already contains text, create a wrapper-tag
  around the text before adding a new child tag, so you can
  address the text as an own element specifically in frontend.

## 1.0.3 (2021-06-08)

* Change hidden field 'form' to `_formname`, so it won't be
  accidentally overriden.

## 1.0.2 (2021-06-08)

* Add class Form.

