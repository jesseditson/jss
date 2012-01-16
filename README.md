# JSS
_javascript styleguides_, _jesse's style sheets_, whatever...

Inspired by [KSS](http://github.com/kneath/kss), which was in turn inspired by [TomDoc](http://tomdoc.org), JSS attempts to provide a javascript version of KSS & TomDoc's methodology for writing maintainable, documented CSS within a team. Like KSS, JSS is a documentation specification and styleguide format. It is **not** a preprocessor, CSS framework, naming convention, or specificity guideline.

JSS currently conforms exactly to the KSS spec - found here: 
* **[The Spec (What KSS is)](https://github.com/kneath/kss/blob/master/SPEC.md)**

You can get started quickly by copying the example:
* **[Example living styleguide](https://github.com/jesseditson/jss/tree/master/example)**

## JSS/KSS in a nutshell

The methodology and ideas behind Knyle Style Sheets are contained in [SPEC.md](https://github.com/kneath/kss/blob/master/SPEC.md). At it's core, KSS is a documenting syntax for CSS. JSS conforms exactly to those ideas. Here's an example:

```css
/*
A button suitable for giving stars to someone.

:hover             - Subtle hover highlight.
.stars-given       - A highlight indicating you've already given a star.
.stars-given:hover - Subtle hover highlight on top of stars-given styling.
.disabled          - Dims the button to indicate it cannot be used.

Styleguide 2.1.3.
*/
a.button.star{
  ...
}
a.button.star.stars-given{
  ...
}
a.button.star.disabled{
  ...
}
```

## NPM package

This repository is also the npm package, and __should not be used as a substitute for it__.
Someone already had "jss" on npm (disputing, we'll see.), so as of speaking, you can install jss by doing a simple:

`npm install jss-styles`, or add it to your package.json file and do an `npm install .`

Once you have jss as a dependency, you can use the example folder either found here in this repo or at `node_modules/jss-style/example` once you've installed jss as a starting point.

Currently I wouldn't recommend playing with the logic in app.js, but I'm not making any rules. The quickest way to get started is to copy the example folder, edit the stylesheets, index.html, styleguide.html, and layout.html files.

## Generating styleguides

The documenting syntax and ruby library are intended to generate styleguides automatically. To do this, you'll need to leverage a small javascript library that generates class styles for pseudo-class styles (`:hover`, `:disabled`, etc).

* [kss.js](https://github.com/jesseditson/jss/blob/master/lib/kss.js) (compiled js, directly pulled from kss)

For an example of how to generate a styleguide, check out the [`example`](https://github.com/jesseditson/jss/tree/master/example) express application.

## Development

To hack on JSS - fork away, go crazy. JSS has no dependencies except underscore, which is currently packaged with it. (Probably will change that in the future.)

Unfortunately no unit tests are in yet - this is the next step, so expect them in soon.