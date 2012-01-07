/* dependencies */
var Modifier = require('./modifier.js'),
	trim = require('../helpers/trim.js');
/* Section class - represents a styleguide section. Each section describes one UI element.
* A Section can be thought of as the collection of the description, modifiers, and styleguide reference.
*
* @class Section
* @param {String} commentText
* @param {String} filename
* @public
*/
var Section = function(commentText,filename){
	this.raw = commentText;
	this.filename = filename;
}
/* description - fetches the first description.
*
* @return {String}
* @public
*/
Section.prototype.description = function(){
	return this.comment_sections[0];
}
/* commentSections - splits up the raw comment text into comment sections that represent description, modifiers, etc.
*
* @return {Array} - comment sections
* @public
*/
Section.prototype.commentSections = function(){
	if(!this.comment_sections) this.comment_sections = this.raw ? this.raw.split("\n\n") : [];
	return this.comment_sections;
}
/* section - the styleguide section for which this comment block references.
* 
* @return {String}
* @public
*/
Section.prototype.section = function(){
	if(this.currentSection) return this.currentSection;
	var cs = this.commentSections(), len = cs.length;
	for(var s=0;s<len;s++){
		var text = cs[s];
		if(text.match(/Styleguide \d/i)){
			this.currentSection = trim(text).replace(/\.$/,'').match(/Styleguide (.+)/)[1];
		}
	};
	return this.currentSection;
}
/* modifiers - the modifiers section of a comment block.
*
* @return {Array}
* @public
*/
Section.prototype.modifiers = function(){
	var last_indent = null,
		commentSections = this.commentSections()[1],
		modifiers = [];
	if(!commentSections) return modifiers;
	commentSections.split("\n").forEach(function(value){
		if(trim(value).length){
			var indent = value.match(/^\s*/).length;
		
			if(last_indent && indent > last_indent){
				/// if this line is indented, append the text to the last modifier's description
				modifiers[modifiers.length - 1].description += value.replace(/\s{1,}/g," ");
			} else {
				var info = value.split(" - "),
					modifier = info[0],
					desc = info[1];
				if(modifier && desc) modifiers.push(new Modifier(trim(modifier),trim(desc)));
			}
			last_indent = indent;
		}
	});
	return modifiers;
}
/* export this module */
module.exports = Section;