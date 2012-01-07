/* Jss - provides access to the parser, modifier, and section.
*
* @public
*/
var Jss = {
	Modifier : require('./jss/modifier.js'),
	Parser : require('./jss/parser.js'),
	Section : require('./jss/section.js')
};
/* export this module */
module.exports = Jss;