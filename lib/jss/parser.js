/* dependencies */
var fs = require('fs'),
	path = require('path'),
	Section = require('./section.js'),
	_ = require('../helpers/underscore.js'),
	trim = require('../helpers/trim.js');
/*
* Parser class - the main jss parser. Takes a directory of CSS files and parses the jss within them.
* 
* @class Parser
* @param {String} basePath - path to the styles.
* @public
*/
var Parser = function(basePath,callback){
	this.sections = {};
	var that = this;
	path.exists(basePath,function(exists){
		if(!exists) throw new Error ("Invalid basePath passed to Parser.");
		readFiles(basePath,jssFromFile,function(results){
			for(var r in results){
				var result = results[r],
					baseName = result.file.replace(/.+?\/([^\/]+$)/,'$1'); // same as File.basename in ruby
					section = new Section(result.content,baseName);
				that.sections[section.section()] = section;
			}
      callback()
		});
	});
}
/********* PUBLIC METHODS **************/
Parser.prototype.section = function(ref){
	return this.sections[ref] || new Section();
}

/********** PRIVATE METHODS ************/

/* readFiles - recursive method for reading all files in a folder.
*
* @param {String} folder
* @param {Function} process <optional> - processes each file, and calls the callback passed. expects arguments [filename,callback], where callback is the filename and the parsed results or false.
* @param {Function} callback - a callback expecting an array of results.
* @private
*/
var readFiles = function(folder,process,callback){
	if(!callback){
		callback = process;
		process = false;
	}
	var results = [];
	fs.readdir(folder,function(err,files){
		var pending = files.length - 1;
		if(!pending) callback([]);
		if(err) throw new Error("Error reading folder " + folder + " while trying to parse jss.");
		for(var f in files){
			file = folder + "/" + files[f];
			fs.stat(file,_.bind(function(file,err,stat){
				if(err) throw err;
				if(stat.isDirectory()){
					readFiles(file,function(res){
						results = results.concat(res);
						if(!--pending) callback(results);
					});
				} else {
					if(process){
						process(file,function(filename,contents){
							if(filename && contents){
								results.push(
									{
										file : filename,
										content : contents
									}
								);
								if(!--pending) callback(results);
							}
						});
					} else {
						results.push(
							{
								file : file,
								content : file
							}
						);
						if(!--pending) callback(results);
					}
				}
			},this,file));
		}	
	});
}
/* jssFromFile - grabs jss comment blocks from a file.
*
* @param {String} filename
* @param {Function} callback - expects 2 params, the filename and the contents.
* @private
*/
var jssFromFile = function(filename,callback){
	fs.readFile(filename,"utf8",function(err,content){
		if(err) throw err;
		var comments = parseComments(content),
			block = comments[0] || "";
		if(isJss(block)){
			callback(filename,block);
		} else {
			callback(false);
		}
		});
}
/* isJss - tests if comment block is a jss documentation block
*
* @param {String} content
* @return {Boolean}
*/
var isJss = function(content){
	var ca = content.split("\n\n"),
		lastLine = ca[ca.length-1] || "";
	return !!lastLine.match(/Styleguide \d/);
}
/* parseComments - returns comment blocks from a string.
*
* @param {String} content
* @return {Array} - array of comment blocks
* @private
*/
var parseComments = function(content){
	content = trim(content);
	var results = [],
		regexes = {
			"blockPattern" : ["\\/\\*([\\s\\S]+?)\\*\\/","g"],
			"linePattern" : ["\\/{1,}(.+)$","gm"]
		};
	for(var r in regexes){
		var args = regexes[r];
		args.unshift(content);
		results = results.concat(getMatches.apply(this,args));
	}
	return results;
}
/* getMatches - execs regex passed on content, and returns values.
*
* @param {String} content
* @param {String} regex
* @param {String} flags
* @return {Array} matches
* @private
*/
var getMatches = function(content,regex,flags){
	var pattern = new RegExp(regex,flags),
		r = false,
		result = [];
	while(r=pattern.exec(content)){
		if(r[1]) result.push(r[1]);
	}
	return result;
}
/* export this module */
module.exports = Parser;