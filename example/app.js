var express = require('express'),
	Mustache = require('mustache'),
	fs = require('fs'),
	_ = require('underscore'),
	Jss = require('../lib/jss.js'),
	trim = require('../lib/helpers/trim.js'),
	app = express.createServer(),
	fileCache = {},
	styleguide = new Jss.Parser("./public/css"); // TODO: possible race condition, styleguide won't technically be usable until it's done parsing.
	
var templateRoot = './views';

app.get('/',function(req,res){
	getPage("index.html",function(content){
		res.send(content);
	});
});

app.get('/styleguide',function(req,res){
	getContent("_styleguide_block.html",function(block){
		var _styleguide_block = block.toString();
		getPage("styleguide.html",{
			"styleguide_block" : function(){
				return function(text){
					var lines = text.split("\n"),
						sectionNum = trim(lines.splice(0,1)),
						example_html = lines.join("\n"),
						section = styleguide.section(sectionNum),
						modifiers = section.modifiers(),
						obj = {
							"filename" : section.filename,
							"description" : section.description(),
							"modifiers" : modifiers,
							"section" : section.section(),
							"example_html" : example_html,
							"generate_modifiers" : function(){
								return function(text){
									var lines = text.split("\n"),
										args = lines.splice(0,1).toString().split(",").map(trim),
										body = lines.join("\n"),
										out = "";
									for(var m in modifiers){
										var modifier = modifiers[m],
											example = example_html.replace(args[0],modifier[args[1]]());
										out += Mustache.to_html(body,{
											"example_html" : example,
											"name" : modifier.name
										});
									}
									return out; 
								}
							}
						};
					return Mustache.to_html(_styleguide_block,obj);
				}
			}
		}, function(content){
			res.send(content);
		})
	});
});

app.use('/css',express.static('./public/css'));
app.use('/js',express.static('./public/js'));

app.listen(3000);

/******* render methods *****/

var getPage = function(page,object,callback){
	var callback = callback || object;
	var pageArgs = [page];
	if(object && callback) pageArgs.push(object);
	pageArgs.push(function(body){
		getContent("layout.html",function(content){
			var layout = Mustache.to_html(content,{},{"content" : body});
			callback(layout);
		});
	});
	getContent.apply(this,pageArgs);
}
var getContent = function(file,object,callback){
	var callback = callback || object,
		done = function(content){
			fileCache[file] = content;
			callback(content);
		}
	if(typeof callback != "function") throw new Error("please provide a valid callback to getContent");
	if(fileCache[file]) return fileCache[file];
	fs.readFile(templateRoot + "/" + file,function(err,body){
		if(err) throw err;
		if(typeof object != "function"){
			done(Mustache.to_html(body.toString(),object));
		} else {
			done(body.toString());
		}
	});
}