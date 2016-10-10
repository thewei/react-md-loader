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

  var markdownHTML = markdown.html;
  var scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/
  var codeRe = /<pre[^>]*>([\s\S]*?)<\/pre>/g
  var scriptsMatch = markdownHTML.match(scriptRe);
  var scripts = scriptsMatch && scriptsMatch[1] || '';
  var codeMatchs = markdownHTML.match(codeRe);

  // 恢复代码块的换行
  if (codeMatchs) {
    codeMatchs.map(function (codeMatch) {
      var newCode = codeMatch.replace(/(\n)/g, '{"\\n"}');
      markdownHTML = markdownHTML.replace(codeMatch, newCode);
    })
  }
  var jsx = markdownHTML.replace(scriptRe, '').replace(/class=/g, 'className=');

  var result =  `
${doImports}
${scripts}
module.exports = function() {
  return (
    <section className="markdown">
      ${jsx}
    </section>
  );
};`;

  return result;
};
