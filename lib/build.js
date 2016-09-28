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
  const
    imports = markdown.imports || {},
    jsx = markdown.html.replace(/class=/g, 'className=');
  
  var $ = cheerio.load(jsx, {decodeEntities: false})
  var output = {
    style: $.html('style'),
    script: $.html('script').replace('<script>', '').replace('</script>', '')
  }
  var result

  $('style').remove()
  $('script').remove()

  // console.log(output.script);

  return `
${doImports}
${output.script}
module.exports = function() {
  return (
    <div>
      ${jsx}
    </div>
  );
};`;
};