var contents = [
	{
		"slug": "classes",
		"title": "Classes",
		"subarticles": [
			{
				"slug": "namespacing",
				"title": "Namespacing"
			},
			{
				"slug": "constructors",
				"title": "Constructors"
			},
			{
				"slug": "inheritance",
				"title": "Inheritance"
			},
			{
				"slug": "abstract-classes",
				"title": "Abstract classes"
			}
		]
	},
	{
		"slug": "interfaces",
		"title": "Interfaces"
	},
	{
		"slug": "properties",
		"title": "Properties",
	},
	{
		"slug": "methods",
		"title": "Methods",
		"subarticles": [
			{
				"slug": "overloading",
				"title": "Overloading"
			},
			{
				"slug": "optional-arguments",
				"title": "Optional arguments"
			},
			{
				"slug": "static-methods",
				"title": "Static methods"
			},
			{
				"slug": "method-proxying",
				"title": "Method proxying"
			}
		]
	},
	{
		"slug": "events",
		"title": "Events"
	},
	{
		"slug": "constants",
		"title": "Constants"
	},
	{
		"slug": "type-hinting",
		"title": "Type hinting"
	},
	{
		"slug": "auto-loading",
		"title": "Auto-loading"
	}
];

// Get the page name from the URL
var pageName = window.location.pathname.match(/([^\/]+)\.html$/)[1];

if (pageName != 'documentation') {
	
	// Load the relevant markdown file...
	$.get('/wiki/' + pageName + '.md', function(content){
		
		// Parse the markdown
		var markdown = marked(content);
		
		// Replace GitHub formatted urls
		markdown = markdown.replace(/\[\[([^\[\]]+)\]\]/g, function(){
			var slug = arguments[1].replace(/\s+/g, '-').toLowerCase();
			return '<a href="/documentation/' + slug + '.html">' + arguments[1] + '</a>';
		});
		
		// Append the altered markdown to the page
		$('.page-bodyWrapper').append(markdown);
		
	});
	
}

// Get the contents holder
var $contents = $('.page-contents');

// Define a quick way to render contents links
var renderLink = function($target, data){
	if (data.slug == pageName) {
		$('.page-bodyWrapper > header > h1').text(data.title);
		$target.append(
			'<a href="/documentation/' + data.slug +
			'.html"><li class="page-contentsActive">' + data.title + '</li></a>'
		);
	} else {
		$target.append(
			'<a href="/documentation/' + data.slug +
			'.html"><li>' + data.title + '</li></a>'
		);
	}
};

// Loop through each link...
for (var i = 0; i < contents.length; i++) {
	
	// ...placing into the page
	renderLink($contents, contents[i]);
	
	// If this page has subpages, draw those too
	if (typeof contents[i].subarticles == 'object') {
		var list = $('<ul />');
		for (var j = 0; j < contents[i].subarticles.length; j++) {
			renderLink(list, contents[i].subarticles[j]);
		}
		$contents.append(list);
	}
	
}
