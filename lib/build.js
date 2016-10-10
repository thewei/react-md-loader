'use strict';

var cheerio = require('cheerio')

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 */

/**
 * Builds the React Component from markdown content
 * with its dependencies
 * @param   {HTMLObject} markdown - HTML and imports
 * @returns {String}              - React Component
 */
module.exports = function build(markdown) {

  let doImports = 'import React from \'react\';\n';

  var $ = cheerio.load(markdown.html, { decodeEntities: false, lowerCaseTags: false });
  // const
  //   imports = markdown.imports || {},
  //   jsx = markdown.html.replace(/class=/g, 'className=');

  var output = {
    style: $.html('style'),
    script: $.html('script').replace('<script>', '').replace('</script>', '')
  };
  var html;

  $('style').remove()
  $('script').remove()

  $('pre code').map(function(index) {
    var h = $(this).html();
    if (h) {
      $(this).html(h.replace(/(\n)/g, '{"\\n"}'));
    }
  })

  html = $.html().replace(/class=/g, 'className=');

  var result =  `
${doImports}
${output.script}
module.exports = function() {
  return (
    <section className="markdown">
      ${html}
    </section>
  );
};`;

  return result;
};
