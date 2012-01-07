/* dependencies */
var trim = require('../helpers/trim.js');
/*
* Modifier class - represents a style modifier. Usually a class name or a pseudo-class such as :hover. See the spec on the Modifiers Section for more information.
* Almost a complete bite of kss's modifier.rb
*
* @class Modifier
* @param {String} name
* @param {String} description
* @public
*/
var Modifier = function(name,description){
	this.name = name;
	this.description = description || "";
}
/*
* getClassName - returns the modifier name as a css class. for pseudo-classes, a generated class name is returned.
* Useful for generating styleguides.
*
* Examples:
* 	:hover => "pseudo-class-hover"
* 	ugly-button => "ugly-button"
*
* @return {String}
* @public
*/
Modifier.prototype.getClassName = function(){
	return trim(this.name.replace('.'," ").replace(":"," pseudo-class-"));
}
/* export this module */
module.exports = Modifier;