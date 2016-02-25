(function(parsexml) {

var lookUpTable = {};
var flattenedAct = [];
//var icicleData = {};
// Process a bclaws act.
parsexml.processAct = function processAct(xml) {
	flattenedAct = [];
	var icicleData = {};
	icicleData["innerObj"] = {};
	var icyObj = icicleData["innerObj"];
    var
    // $xml = $('<div>').html(xmlString), // Hack to prevent innerHTML failure on Safari/Firefox when prossesing xml.
    $xml = $(xml), // Words with Chrome, may fail on Safari/Firefox.
    $act = $xml.find('act\\:act, reg\\:regulation'),
    $content = $xml.find('act\\:content, reg\\:content'),
    actName = 'Chapter ' + $act.children('act\\:chapter').text(),
    actTitle = $act.children('act\\:title, reg\\:title').text(),
    root = getNewNode(actName, actTitle, 'act');
	root.icyData= icyObj;
	
	//root.lookUpTable = {};
    // Traverse the document structure.
    function recurse($obj, parent) {
		
       $obj.children('bcl\\:part, bcl\\:division, bcl\\:section')

		.each(function(index) {
			
            var $child = $(this),
            type = getNodeType(this);

			var node = configureByType(type, this, parent.icyData);
		
			parent.children.push(node);
            recurse($child, node);
        });
    }

    recurse($content, root);
	
	
	console.log(icicleData);
	
	root.icyData= icicleData;
	root.data =flattenedAct;
	root.lookUpTable = lookUpTable;
    return root;

};

// ***************************************************************
// Helpers
// ***************************************************************

// Returns true if a document's id is marked with 'rep'.
var isRepealed = (function() {
    var reRep = /^\d+rep(?:$|_)/;

    return function isRepealed(docId) {
        return reRep.test(docId);
    };
})();

// Returns the nodeName of an element without the namespace reference.
var getNodeType = (function() {
    var regex = /(?:\w+\:)?(.+)/;

    return function getNodeType(element) {
        return regex.exec(element.nodeName)[1].toLowerCase();
    };
})();

// Returns a vis-compatible node with name and title set.
function getNewNode(name, title, type) {
    return {
        chapter: name,
        name: title,
        type: type,
        children: []
    };
}

// Returns a string with each word capitalized.
function titleCase(title) {
    return title.split(/\s+/).map(function(word) {
        return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
    }).join(' ');
}

// Returns the capitalized node name of an element.
function getHeading(element) {
    return titleCase(getNodeType(element));
}

// Returns either note or text depending on given criteria.
function getTitle(el, note, text) {
    return note ? note : text;
}

function parseSubsection(subsection, prevNums, icyObj) {
    var $sub = $(subsection), sub = {},
    num = $sub.children('bcl\\:num').text(),
    xml = $sub.children('bcl\\:text').text().replace(/\n/g,'').replace(/\u00A0/g,' ');
	
	sub.type = "subsection";
    sub.num = num;
    sub.name = 'Subsection ' + num;
	id = $sub.attr('id');
	sub.id = id;
	lookUpTable[prevNums+','+num] = sub.id;
    xml && (sub.xml = xml);
	
	subObj = {type: 'subsection', id:id , num: num, text: xml };
	
	flattenedAct.push(subObj);
	var children = false;
	

	if ( $sub.children('bcl\\:paragraph').length> 0){
		
		sub.paragraphs = [];
		children = true;
	}
	if ( $sub.children('bcl\\:definition').length >0){
		
		sub.definitions = [];
		children = true;
	}
	
	if(children){
		icyObj[id] = {};
	}else{
		
		icyObj[id] = 1;
	}
	var icyObjSub = icyObj[id];
	
    $sub.children('bcl\\:paragraph').each(function(index) {
        sub.paragraphs.push(parseParagraph(this, prevNums+','+num, icyObjSub));
		
    });

    $sub.children('bcl\\:definition').each(function(index) {
        sub.definitions.push(parseDefinition(this, prevNums+','+num, icyObjSub));
		
    });

    return sub;
}

function parseDefinition(definition, prevNums, icyObj) {
    var $def = $(definition), def = {},
    num = $def.children('bcl\\:num').text(),
    xml = $def.children('bcl\\:text').text().replace(/\n/g,'').replace(/\u00A0/g,' ');
    def.type = 'definition';
	id = $def.attr('id');
	def.id = id;
	
	var terms = [];
	$def.children('bcl\\:text').each(function(index) {
		var $text = $(this); 
		
		$text.children('in\\:term').each(function(index){
			
			var $term = $(this);
			terms.push($term.text());
		});
		
		
	});
	

	lookUpTable[prevNums+','+terms[0]] = def.id;
    xml && (def.xml = xml);
	defObj = {type: 'definition', id:id , num: terms, text: xml };
	flattenedAct.push(defObj);
	
	var children = false;
	
	if ( $def.children('bcl\\:paragraph').length> 0){
		
		def.paragraphs = [];
		children = true;
	}
	
	if(children){
		icyObj[id] ={}
	}else{
		icyObj[id] = 1;
	}
	var icyDef = icyObj[id];
    $def.children('bcl\\:paragraph').each(function(index) {
        def.paragraphs.push(parseParagraph(this, prevNums+','+terms[0], icyDef));
		
    });

    return def;
}

function parseParagraph(paragraph, prevNums, icyObj) {
    var $para = $(paragraph), para = {},
    num = $para.children('bcl\\:num').text(),
    xml = $para.children('bcl\\:text').text().replace(/\n/g,'').replace(/\u00A0/g,' ');
    para.type = 'paragraph';
    para.num = num;
    para.name = 'Paragraph ' + num;
	
	id = $para.attr('id');
	para.id = id;
	lookUpTable[prevNums+','+num] = para.id;
    xml && (para.xml = xml);
	
	paraObj = {type: 'paragraph', id:id , num: num, text: xml };
	flattenedAct.push(paraObj);

	
	
	var children = false;
	if ( $para.children('bcl\\:subparagraph').length> 0){
		
		para.subparas = [];
		children = true;
	}
	
	if(children){
		icyObj[id] ={}
	}else{
		icyObj[id] = 1;
	}
	var icyPara = icyObj[id];
    $para.children('bcl\\:subparagraph').each(function(index) {
        para.subparas.push(parseSubParagraph(this, prevNums+','+num, icyPara));
		
		
    });

    return para;
}

function parseSubParagraph(paragraph, prevNums, icyObj) {
    var $para = $(paragraph), para =  {},
    num = $para.children('bcl\\:num').text(),
    xml = $para.children('bcl\\:text').text().replace(/\n/g,'').replace(/\u00A0/g,' ');
	id = $para.attr('id');
	para.id = id;
    para.type = 'subparagraph';
    para.num = num;
	icyObj[id]= 1;
	
    para.name = 'Subparagraph ' + num;
	lookUpTable[prevNums+','+num] = para.id;
    xml && (para.xml = xml);
	
	subparaObj = {type: 'subparagraph', id:id , num: num, text: xml };
	flattenedAct.push(subparaObj);

    return para;
}

// Configure a vis node by its dom node type.
var configureByType = (function() {

    var types = {

        part: function(el, node, icicleData) {
			$part = $(el); part ={};
			var id =$part.attr('id'),
			name = $part.children('bcl\\:text').text(),
			num = $part.children('bcl\\:num').text();
			part.id = id;
			part.num = num;
			part.name = name;
			part.type = 'part';
			part.text = name;
			
			flattenedAct.push(part);
			
			var children = false;

			if ( $part.children('bcl\\:section, bcl\\:division').length> 0){
				children = true;
			}
			if(children){

				icicleData[id]={};
				
			}else{

				icicleData[id] =1;
			}
			var icyObj = icicleData[id];
			
			
			
            node.title = name;
			node.icyData = icyObj;
        },

        division: function(el, node, icicleData) {
            node.title = $part.children('bcl\\:text').text();
			node.icyData = icicleData;
        },

        section: function(el, node, icicleData) {
			
            var $section = $(el), section ={},xml;

            marginalnote = $section.children('bcl\\:marginalnote').text();
            xml = $section.children('bcl\\:text').text().replace(/\n/g,'').replace(/\u00A0/g,' ');
			num = $section.children('bcl\\:num').text();
			id = $section.attr('id');
			lookUpTable[num] = $section.attr('id');
            xml && (section.xml = xml);
		
			node.text = $section.text().replace(/\s+/g, ' ');
			
			
			sectionObj = {type: getNodeType(el), id:id, marginalnote: marginalnote, num: num, text: xml };
			flattenedAct.push(sectionObj);
			
			
			var children = false;

			if ( $section.children('bcl\\:subsection').length> 0){
				node.subsections  = [];
				children = true;
			}
			if ( $section.children('bcl\\:paragraph').length> 0){
				node.paragraphs  = [];
				children = true;
			}
			if ( $section.children('bcl\\:definition').length> 0){
				node.definitions  = [];
				children = true;
			}
            if (node.title === 'Repealed')
                node.repealed = true;
			
			
			
			if(children){

				icicleData[id]={};
				
			}else{
				icicleData[id] =1;
			}
			var icyObj = icicleData[id];

            $section.children('bcl\\:subsection').each(function(index) {
                node.subsections.push(parseSubsection(this, num, icyObj));

            });

            $section.children('bcl\\:paragraph').each(function(index) {
                node.paragraphs.push(parseParagraph(this, num, icyObj));
				
            });

            $section.children('bcl\\:definition').each(function(index) {
                node.definitions.push(parseDefinition(this, num, icyObj));
				
            });

            //node.sections = section;
            
        }
    };

    function configure(el) {
        var $el = $(el),
        num = $el.children('bcl\\:num').text(),
        name = titleCase(getHeading(el) + ' ' + num),
		
        node = getNewNode(name, '', getNodeType(el));
		node.id = $el.attr('id'); 
		node.num = num;
        return node;
    }

    return function configureByType(type, el, icicleData) {
        var node = configure(el);
		
        types[type](el, node, icicleData);
		
		
        return node;
    }
})();

})(window.parsexml = Object.create(null));
