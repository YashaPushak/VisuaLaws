(function(parsePITxml) {
var addobjcounter ;
var changes;
// Process a bclaws act.
//1659 lines with console
parsePITxml.processPIT = function processPIT(xml, act) {
    lookUpTable = act.lookUpTable;
	flattenedAct = act.data;
	icyData = act.icyData;
	numberOfSections = Object.keys(icyData['innerObj']).length;

	addobjcounter =0;
		changes = {};
	var
    // $xml = $('<div>').html(xmlString), // Hack to prevent innerHTML failure on Safari/Firefox when prossesing xml.
    $xml = $(xml), // Works with Chrome, may fail or Safari/Firefox.
	
    $pit = $xml.find('act_pit'),
	added = 1, amended = 0, repealed = -1,
    actName = 'Chapter ' + $pit.children('chapter').text(),
    actTitle = $pit.children('actname').text(),
	yearEnacted = $pit.children('yearenacted'),

    root = getNewNode(actName, actTitle, 'PIT');
	root.yearEnacted = yearEnacted;
	var addcounter = 0;
	
	
	
	
	$pit.children('change').each(function(index) {
		var $change = $(this);
		$changenote = $change.children('changenote').first(); //if time process all changenotes
		var 
		sectionNum = $change.attr('section');
		
		changeNoteText = $changenote.text();
		console.log('change');
		
		var changeDate = $changenote.attr('eff');
		change = getChangeType(changeNoteText);
		
	
		
		if( !(changeDate in changes)){
				changes[changeDate]= [];
				changes[changeDate].date= changeDate;
			}
		
		if(change == added){
		
			addAddedChangeObj($changenote, sectionNum);
		
			
		}else{
				
			addOtherChangeObjs($change, sectionNum, typeOfchange);
		}
		
		
	});
	
	
	var allChanges = [];
	var keys = Object.keys(changes);

	for(var i=0; i< keys.length; i++){
		var changeObject={},
		cDate = keys[i];
		if(changes[cDate].length >0 && cDate !="November 29, 20021"){
		changeObject.date = new Date(keys[i]);
		changeObject.data= changes[cDate];
		allChanges.push(changeObject);
		}
		
	}
	
	allChanges.sort(function sortByDate(a,b){
		var a = a.date.getTime();
		var b = b.date.getTime();
		return ((a <b) ? -1 : ((a>b) ? 1 :0));
		
	});

	root.changes = allChanges;
	
	return allChanges;

};

// ***************************************************************
// Helpers
// ***************************************************************

function addOtherChangeObjs(changeEl, sectionNum, change){
	var subNum, paraNum, id,
		$changenote = changeEl.children('changenote');
	var index = $changenote.text().indexOf('BEFORE');
	if( index == -1){
		index = $changenote.text().indexOf('B ');
	}
	var date = $changenote.attr('eff'),
	nums = parseChangenoteText($changenote.text().substring(0,index));

	nums.unshift(sectionNum);
	date = $changenote.attr('eff');
	
	var prevNums = [sectionNum];
	var subNum, paraNum,defNum, prevType, prevNum;
	var changeData ={change: change, nums: nums, date: date};
	changeEl.children('section, bcl\\:section, paragraph, bcl\\:paragraph, subsection, bcl\\:subsection, subparagraph, bcl\\:subparagraph, definition, bcl\\:definition')
	.each( function(index){

		type = this.nodeName;

		prevNums = [sectionNum];
	
		if(type =='definition'){
			var changeObj = configureByType(type,this, changeData);
			defNum = changeObj.num;
	
		}else
		if( type =='subsection'){
			var changeObj = configureByType(type,this, changeData);
			subNum = changeObj.num;
			
						
		}else if ( type == 'paragraph'){
			
			if( subNum!=null){
				prevNums = [sectionNum];
				prevNums.push(subNum);
				changeData.nums = prevNums;
				var changeObj = configureByType(type,this, changeData);
				paraNum = changeObj.num;
				prevNums.push(paraNum);
				
			}else if(defNum!=null){
				prevNums = [sectionNum];
				if(!(isNaN(nums[1]))){
					prevNums.push(nums[1]);
				}
				if(subNum !=null){
					prevNums.push(subNum);
				}
				prevNums.push(defNum);
				
				changeData.nums = prevNums;
				var changeObj = configureByType(type,this, changeData);
				paraNum = changeObj.num;
				prevNums.push(paraNum);

			}else{
				
				var changeObj = configureByType(type,this, changeData);
				paraNum = changeObj.num;
				
			}
					
			
		}else if(type == 'subparagraph'){
			
			
			
			if(subNum == null && defNum == null){
				if(paraNum != null ){
					
					//if second is a subsection or definition
					if(!(isNaN(nums[1])) || nums[1].length>3 ){
						prevNums = [nums[0], nums[1]];
					}else{
						prevNums=[nums[0]];
					}
					prevNums.push(paraNum);
					
				
						
				}else{
				
					prevNums = [nums[0], nums[1], nums[2]];
				}
				changeData.nums= prevNums;
			}
				
			var changeObj = configureByType(type,this, changeData);

		}else {
			
			var changeObj = configureByType(type,this, changeData);

		}

		
	});
		
}

function parseParagraph(paragraph, changeData) {
    var $para = $(paragraph), para = {},
	nums = changeData.nums,
	date= changeData.date,
	change = changeData.change,
    num = $para.children('paragraphnumber').text(),
    xml = $para.children('paragraphtext').text().replace(/\n/g,'').replace(/\u00A0/g,' ');
	
    para.type = 'paragraph';
    para.num = num;
	para.change = change;
    xml && (para.text = xml);
	var lookUpKey;
	

	
	if(isNaN(nums[1])&& nums[1]!= null){
		
		if(nums[1] instanceof Array){
			lookUpKey = nums[0]+','+nums[1][0];
	
		}else{
		lookUpKey = nums[0];
		}

	}else if(nums[2] != null && (nums[2] instanceof Array || nums[2].length>3)){
		lookUpKey = nums[0]+','+nums[1]+','+nums[2];
		//id = lookUpTable[nums[0]+nums[1]+nums[2]+num];
		
		
	} else if(nums[1]!=null){
		lookUpKey = nums[0]+','+nums[1];
		
		//id = lookUpTable[nums[0]+nums[1]+num];
	}else{
		lookUpKey = nums[0];
	
	}
		id = lookUpTable[lookUpKey+','+num];	
		para.id = id;
	
	paraNums = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

	if(id == null){

		var prevPara, paraIndex;
		
		for( var i = 0; i< paraNums.length; i++){
			
			if( num == paraNums[i]){
				paraIndex = i;
			}
			
		}
		
		var key;
		
		var prevParaNum, prevParaId= null, i= paraIndex-1;
		
		while(i >=0 && prevParaId==null){
			prevParaNum = paraNums[i];
			prevParaId = lookUpTable[lookUpKey+','+prevParaNum];
			i = i - 1;
						
		}
		prevId = prevParaId;

	
		if( prevId == null){
			//paragraph id not found 
			prevId = lookUpTable[lookUpKey];
			
			if(prevId == null){
				// subsection id not found :(
				//id = lookUpTable[nums[0]];
				if( id== null){
					//section doesnt even exist
									
					//make section
					//make subsection
				
				}else{
					//section id exists
					//make subsections
				
				}
								
				//make a subsection
				//take into consideration definitions
			}
			
			
		}
		
		if(prevId != null){
			/*var newId = findNextId(prevId, 1);
				if(newId==null){
					newId= prevId+num;
				}
				*/
				
				var newId = (prevId+num).replace(/ /g,'-').replace(/\,/g,'-').replace(/\'/g,'-').replace(/\./g,'-').replace(/\)/g,'-').replace(/\(/g,'-');
				
			//var newId = 'd'+nums[0]+num;
			var idIndex = findIdIndex(prevId);
			
			if(idIndex != null && newId != null){
				
				var paraObj = { id: newId, num: num, type: "paragraph", text: "[Paragraph repealed "+ date + "]"};
				
				para.change = -1;
				para.id = newId;
				flattenedAct.splice(idIndex+1,0,paraObj);
				lookUpTable[lookUpKey+','+num]= newId;

				
				var parentId = lookUpTable[lookUpKey];
					var icy = icyData['innerObj'];
					
					var icyObj = findIdinIcicleData(icy, parentId);
					////console.log(icyObj);
					if(icyObj!=null){
						icyObj[newId] = 1;
						changes[date].push(para);
						
					}else{
						//console.log('ICYOBJ IS NULL SO DID NOT ADD');
						//console.log(lookUpKey+num);
					}
	
				
				
			}else{
				////console.log("NO PARA INDEX FOUND");
				////console.log(para);
				////console.log(nums);
				
			}
		}else{
			
			////console.log('PREVIOUS ID FOR PARAGRAPH NOT FOUND');
			//////console.log(lookUpKey);
			////console.log(para);
		}
			
		
	}else{
		
		changes[date].push(para);
	}


    return para;
}

function valueExistsinLookUpTable(value){

	var keys = Object.keys(lookUpTable);
	for(var k = 0; k< keys.length; k++){
		if(lookUpTable[keys[k]]==value){
			return true;
			
		}
		
	}
	
	return false;
	
}


function parseBCL(el, changeData) {
    var $bclEl = $(el), bclEl = {},
	type = getNodeType(el),
	date = changeData.date,
	nums = changeData.nums,
	change = changeData.change,
    num = $bclEl.children('bcl\\:num').text(),
    xml = $bclEl.children('bcl\\:text').text().replace(/\n/g,'').replace(/\u00A0/g,' '),
	id = $bclEl.attr('id');
	bclEl.change = change;
	bclEl.id =id;
	
	if(type == 'section'){
		
		title =$bclEl.children('bcl\\:marginalnote').text();
		bclEl.marginalnote = title;
	}
	
	if(type == 'definition'){

		var $text = $bclEl.children('bcl\\:text').first(),
		term = $text.children('in\\:term').first().text();
		num = [term];
		
		
	}
	
	if(!valueExistsinLookUpTable(id)){
		
		var prevNum = nums[0];
		for(var n=1; n < nums.length; n++){
			prevNum = prevNum + ','+nums[n];
			
		}
		 var idInTable= lookUpTable[prevNum+','+num];
		 
		if(idInTable!= null){
			bclEl.id = idInTable;
			var index = findIdIndex(idInTable);
			flattenedAct[index].text = "[ "+type+" repealed "+ date + "]";
		}else{
			prevId = lookUpTable[prevNum];
			
			var idIndex = findIdIndex(prevId);

					
			if(idIndex != null && id != null){
				var bclObj = { id: id, num: num, type: type, text: "[ "+type+" repealed "+ date + "]"};
				bclEl.change = -1;
				
				flattenedAct.splice(idIndex+1,0,bclObj);
				
				lookUpTable[prevNum+','+num]= id;
				var parentId = lookUpTable[nums[0]];
				var icy = icyData['innerObj'];
				
				var icyObj = findIdinIcicleData(icy, parentId);

				if(icyObj!=null){
					icyObj[id] = 1;
				}else{
					//console.log('ICYOBJ IS NULL SO DID NOT ADD');
						//console.log(prevNum+','+num);
				}

			}
		}
	}
	nums.push(num);
	
    bclEl.type = type;
	
    bclEl.num = num;
	if(xml == null)
		bclEl.text = "";
	else
		bclEl.text = xml
	
	
	
	changes[date].push(bclEl);

	$bclEl.children('bcl\\:subsection, bcl\\:paragraph, bcl\\:subparagraph, bcl\\:definition')
	.each( function(index){
		type = this.nodeName;
		parseBCL(this, changeData);
		
	});
    return bclEl;
}

function parseSubsection(subsection, changeData) {
    var $sub = $(subsection), sub = {},
	nums = changeData.nums,
	date = changeData.date,
	change = changeData.change,
    num = $sub.children('subsectionnumber').text(),
    xml = $sub.children('subsectiontext').text().replace(/\n/g,'').replace(/\u00A0/g,' ');

    sub.num = num;
	sub.change = change;
    //sub.type = 'subsection';
	sub.type = getNodeType(subsection);
    xml && (sub.text = xml);
	var lookUpKey = nums[0]+','+num;
	id = lookUpTable[lookUpKey];
		sub.id = id;	
			
	if(id == null){
	
		var subDouble = parseFloat(num);
		var prevSub;
		var key;
		var prevId;
		var nextSectionNum, nextSectionId= null, i= 0.1;
					
		while(i<subDouble && nextSectionId==null){
			nextSection = parseFloat((subDouble - i).toFixed(1));
					
			nextSectionNum = nextSection.toString();
			nextSectionId = lookUpTable[nums[0]+','+nextSectionNum];
			i = i + 0.1;
										
		}

		prevId = nextSectionId;
		
		if(prevId == null){
			 prevId = lookUpTable[nums[0]];
			
			if(prevId != null){
					//////console.log("but section Id was found yay!");
					}
			if(prevId == null){ 
				var sectionObj = createNewSectionObject(nums[0], date);
				if(sectionObj !=null){
				prevId = sectionObj.id;
				}
			
			}
			
			
		}
			
		if(prevId != null){
			//var newId = findNextId(prevId, 1);
			var newId = (prevId+num).replace(/ /g,'-').replace(/\,/g,'-').replace(/\'/g,'-').replace(/\./g,'-').replace(/\)/g,'-').replace(/\(/g,'-');
			
			
			var idIndex = findIdIndex(prevId);

				if(newId==null){
					newId= prevId+num;
				}
			if(idIndex !=null && newId != null){
				sub.id = newId;
				var subObj = { id: newId, num: num, type: "subsection", text: "[Subsection repealed "+date +"]"};
				sub.change = -1;
				flattenedAct.splice(idIndex+1,0,subObj);
				
				var parentId = lookUpTable[nums[0]];
				var icy = icyData['innerObj'];
				
				var icyObj = findIdinIcicleData(icy, parentId);
				if(icyObj!=null){
				icyObj[newId] = 1;
				
		
				
				changes[date].push(sub);
				}else{
						//console.log('ICYOBJ IS NULL SO DID NOT ADD');
						//console.log(lookUpKey+num);
					}
				
				lookUpTable[lookUpKey]= newId;

			}else{
				////console.log("NO SUB INDEX FOUND");

			}
		}else{
				
				////console.log('PREVIOUS ID FOR SUBSECTION NOT FOUND');

			}
				
	
	}else{
			
		changes[date].push(sub);
	}
	
	//subObj = {type: getNodeType(subsection), id:id , num: num, text: xml };
	//changes[date].push(sub);
    return sub;
}

function createNewSectionObject(sectionNum, date){

	var sectionDouble = parseFloat(sectionNum);
	if(!isNaN(sectionDouble)){

		var nextSectionNum, nextSectionId= null, i= 0.1;
		
		while(i<numberOfSections && nextSectionId==null){
			nextSection = parseFloat((sectionDouble + i).toFixed(1));
			
			nextSectionNum = nextSection.toString();
			nextSectionId = lookUpTable[nextSectionNum];
			i = i + 0.1;
				
		}
		
		nextSectionIndex = findIdIndex(nextSectionId);
		//sectionId = findNextId(nextSectionId, -10);
		sectionId = ('d'+sectionNum).replace(/ /g,'-').replace(/\,/g,'-').replace(/\'/g,'-').replace(/\./g,'-').replace(/\)/g,'-').replace(/\(/g,'-');
		
		
		var sectionObj = { id: sectionId, num: sectionNum, type: "section", text: "[Section repealed "+date +"]"};
		
		flattenedAct.splice(nextSectionIndex,0,sectionObj);
		
		

		lookUpTable[sectionNum] = sectionId;
		
	
		
		return sectionObj;
		
	}	
	
}


function findNextId(prevId, i){
	var id, index,
	
	numbers = parseFloat(prevId.substring(3));
	if(isNaN(numbers)){
		return null;
	}
	id = prevId.substring(0,3) + (numbers+i).toString();
	
	
	
	
	return id;
	
}

function findIdIndex(id){
	var index;
	for( var i = 0; i< flattenedAct.length; i++){
		
		if( flattenedAct[i].id == id){
			
			return index = i;
		}
	}
	
	return null;
	
}


function parseSection(sectionEl, changeData) {
    var $section = $(sectionEl), section = {},
	nums = changeData.nums,
	date = changeData.date,
	change = changeData.change,
    num = $section.children('sectionnumber').text(),
	title = $section.children('marginalnote').text(),
    xml = $section.children('sectiontext').text().replace(/\n/g,'').replace(/\u00A0/g,' ');
	id = lookUpTable[num];
	if(xml == null)
		xml = "";
		
	if(id == null){
			
		var sectionObj = createNewSectionObject(num, date);
		if(sectionObj != null){
		id = sectionObj.id;
		}
	}
	
	section.id = id;
	section.change = change
	section.marginalnote = title;
    section.num = num;
	section.text = xml;
    section.type = getNodeType(sectionEl);
    //xml && (section.text = xml);
	
	if(id != null){
		

		
		
	changes[date].push(section);
	}
    return section;
}


function parseSubParagraph(subparagraph, changeData) {
    var $para = $(subparagraph), para = {},
	nums = changeData.nums,
	date = changeData.date,
	change = changeData.change,
    num = $para.children('subparagraphnumber').text(),
    xml = $para.children('subparagraphtext').html();
	
	
	
    para.type = 'subparagraph';
	para.change = change;
    para.num = num;
    xml && (para.text = xml);
	var lookUpKey=nums[0];
	
	for( var i = 1; i< nums.length; i++){
		if(nums[i]!=num){
			lookUpKey=lookUpKey+','+nums[i];
		}
		
	}
	//lookUpKey= lookUpKey+num;
	id = lookUpTable[lookUpKey+','+num];
	
	para.id = id;

	paraNums = ['i','ii','iii','iv','v','vi','vii','viii'];
	
	if(id == null){

		var prevPara, paraIndex;
		
		for( var i = 0; i< paraNums.length; i++){
			
			if( num == paraNums[i]){
				paraIndex = i;
			
			}
			
		}
		var key;
		if(paraIndex>0){
			//prevPara = paraNums[paraIndex-1];
			key = lookUpKey+','+paraNums[paraIndex-1];
	
		}else{
			key = lookUpKey;
			//prevPara = "";
		}	
			//var prevId = lookUpTable[lookUpKey+prevPara];
			var prevId = lookUpTable[key];
			if(prevId != null){
				/*
				var newId = findNextId(prevId, 1);
				if(newId==null){
					newId= prevId+num;
				}
				*/
				
				var newId = (prevId+num).replace(/ /g,'-').replace(/\,/g,'-').replace(/\'/g,'-').replace(/\./g,'-').replace(/\)/g,'-').replace(/\(/g,'-');
				var idIndex = findIdIndex(prevId);
				
				if(idIndex != null && newId != null){
					var paraObj = { id: newId, num: num, type: "subparagraph", text: "[Subparagraph repealed "+ date + "]"};

					para.id = newId;
					para.change= -1;
					flattenedAct.splice(idIndex+1,0,paraObj);
					
					var parentId = lookUpTable[lookUpKey];
					var icy = icyData['innerObj'];
					
					var icyObj = findIdinIcicleData(icy, parentId);
					if(icyObj!=null){
					icyObj[newId] = 1;
						changes[date].push(para);
						
					}else{
						//console.log('ICYOBJ IS NULL SO DID NOT ADD');
						//console.log(lookUpKey+num);
					}

					lookUpTable[lookUpKey+','+num]= newId;
				}else{
					////console.log("NO SUBPARA INDEX FOUND");

				}
			}else{
				
				////console.log('PREVIOUS ID FOR SUBPARAGRAPH NOT FOUND');
				////console.log(key);
			}
			
			//id = lookUpKey;
			//lookUpTable[lookUpKey]= lookUpKey;
				
	
		
	}else{
			changes[date].push(para);
			
	}


    return para;
}




function parseDefinition(definition, changeData) {
    var $def = $(definition), def = {},
	nums = changeData.nums,
	date= changeData.date,
	change = changeData.change,
    //term = $def.children('term').text(),
	xml = $def.text().replace(/\n/g,'').replace(/\u00A0/g,' ');
	//xml = $def.html();
	var terms=[];
	$def.children('term').each(function(index){
		var $term = $(this);
		terms.push($term.text());
		
	});
	

	
    def.type = 'definition';
    def.num = terms;
	def.change = change;
    xml && (def.text = xml);
	var lookUpKey;
	if(isNaN(nums[1])){
				
		lookUpKey = nums[0];
				//////console.log(id);
	}else{
		lookUpKey= nums[0]+','+nums[1];
	}
	
	id = lookUpTable[lookUpKey+','+terms[0]];
			
		def.id = id;
	if(id == null){
		
		var prevId = lookUpTable[lookUpKey];
		if(prevId != null){
				//var newId = findNextId(prevId, term.length);
				var newId = ("d" + nums[0]+terms[0]).replace(/ /g,'-').replace(/\,/g,'-').replace(/\'/g,'-').replace(/\./g,'-').replace(/\)/g,'-').replace(/\(/g,'-');
				var idIndex = findIdIndex(prevId);
				
				if(idIndex != null && newId != null){
					var defObj = { id: newId, num: terms, type: "definition", text: "[Definition repealed "+ date + "]"};
					
					def.change = -1;
					def.id = newId;
					flattenedAct.splice(idIndex+1,0,defObj);

					lookUpTable[lookUpKey+','+terms[0]]= newId;
					var parentId = lookUpTable[lookUpKey];
					////console.log(parentId);
					var icy = icyData['innerObj'];
					
					var icyObj = findIdinIcicleData(icy, parentId);
					////console.log(icyObj);
					if(icyObj!=null){
						icyObj[newId] = 1;
						changes[date].push(def);
							
					}else{
						//console.log('ICYOBJ IS NULL SO DID NOT ADD');
						//console.log(lookUpKey+num);
					}
				
				}else{
					////console.log("NO defintion INDEX FOUND");
		
				}
		}
		
		
		
	}else{
		changes[date].push(def);
	
	}
	
	//paraObj = {type: 'para', id:id , num: num, text: xml };
    return def;
}

function findIdinIcicleData(icyObj, id){
	var finalObj = null;
	if(icyObj instanceof Object){
		var keys = Object.keys(icyObj);
		for (var k=0; k < keys.length; k++){
			var currentId = keys[k];
			currentIcyObj = icyObj[currentId];
			if(currentId == id){
				if(!(icyObj[currentId] instanceof Object)){
					
					icyObj[currentId] ={};
				}
				return icyObj[currentId];
				
			}else{
				
				finalObj = findIdinIcicleData(icyObj[currentId], id);
				if(finalObj != null){
					break;
				}
			}
			
		}
	}else{
		return null;
		
		
	}
	
	return finalObj;
	
	
}


// Configure a vis node by its dom node type.
var configureByType = (function() {

    var types = {
		
		
		definition: function(el, changeData) {
		
			var node = parseDefinition(el, changeData);
			
			return node;
        },
		
		subsection: function(el, changeData) {
			
            var node = parseSubsection(el, changeData);
			
			
			
			return node;
			
        },
		
        paragraph: function(el, changeData) {
		
			var node = parseParagraph(el, changeData);
			
			return node;
        },
	
      
		
	
		
		subparagraph: function(el, changeData) {
			//var nums = changeData.nums;
            var node = parseSubParagraph(el, changeData);
		
			
			
			return node;
        },
		'bcl:section': function(el, changeData ) {
			changeData.nums.pop();
			var node = parseBCL(el, changeData);
			
	
			return node;
			
        },
		
		'bcl:subsection': function(el, changeData ) {
			changeData.nums.pop();
			var node = parseBCL(el, changeData);
			
			return node;
			
        },
		
			
		'bcl:paragraph': function(el, changeData) {
            changeData.nums.pop();
			var node = parseBCL(el, changeData);
			
			return node;
        },
		
		'bcl:subparagraph': function(el, changeData) {
			
			changeData.nums.pop();
			var node = parseBCL(el, changeData);
			
			return node;
        },
		
		'bcl:definition': function(el, changeData) {
            changeData.nums.pop();
			var node = parseBCL(el, changeData);
			
			return node;
        },

        section: function(el, changeData) {
			
			var $section = $(el),
			nums = changeData.nums,
		
			date = changeData.date;
			var section = parseSection(el, changeData);
			var sectionNum = section.num;
			
			
			var prevNums =[], subNum;
			$section.children('subsection, paragraph')
			.each( function(index){
				var $child = $(this);
				type = this.nodeName;
				
				
				if(type =='subsection'){
					prevNums = [];
					prevNums.push(sectionNum);
					changeData.nums = prevNums;
					var changeObj = configureByType(type,this, changeData);
					subNum = changeObj.num;
					prevNums.push(subNum);
				}else{

					var changeObj = configureByType(type,this, changeData);
				}
				
								
			});
			return section;
		
		}

    };
	

    return function configureByType(type, el, changeData) {
		nums = changeData.nums;
        var node= types[type](el, changeData);
		
		
        return node;
    }
})();

function addAddedChangeObj(changenoteEl, sectionNum){
	var subNum, paraNum, id;
	var index = changenoteEl.text().indexOf('added'),
	nums = parseChangenoteText(changenoteEl.text().substring(0,index)),
	date = changenoteEl.attr('eff');
	var isDefintion = false;
	if( changenoteEl.text().indexOf('definition')>-1){
		isDefinition = true;
		
	}
	if(nums[0] != null){
		//if its a subsection
		if(!isNaN(nums[0])){
			
			subNum = nums[0];
			
			if(nums[1]!=null){
				//if 2nd is not a number
				if(isNaN(nums[1])){
					
					//if second is a definition
					if((nums[1].length>3)){
						
						//if third is a paragraph, add paragraphs to definition
						if(nums[2]!=null && nums[2].length<3){
							for(var i=2; i<nums.length; i++){
								var num = sectionNum+','+subNum +','+ nums[1]+','+nums[i];
								id=lookUpTable[num];
								if(id!=null){
									
									changeObj = { id: id, num: nums[i], type: 'paragraph', change: 1, text: "[Paragraph was added "+ date + "]"};
									
									changes[date].push(changeObj);
									addSubparagraphChanges(num, date);
								}else{
									//console.log('ADD ID IS NULL');
									//console.log(num);
								}					
								
							}
							
						}else{// add definitions
							for(var i=1; i<nums.length; i++){
								var num = sectionNum+','+subNum+','+nums[i];
								
								id=lookUpTable[num];
								if(id!=null){
									
									changeObj = { id: id, num: [nums[i]], type: 'definition', change: 1, text: "[Definition was added "+ date + "]"};
									
									changes[date].push(changeObj);
									addParagraphChanges(num, date);
								}else{
									//console.log('ADD ID IS NULL');
									//console.log(num);
								}					
								
							}
						}
						
					}else{//add paragraph changes
						for(var i=1; i<nums.length; i++){
								var num = sectionNum+','+subNum+','+nums[i];
								id=lookUpTable[num];
								if(id!=null){
									
									if(nums[i].length>3){
										
										changeObj = { id: id, num: [nums[i]], type: 'definition', change: 1, text: "[Definition was added "+ date + "]"};
								
										changes[date].push(changeObj);
										addParagraphChanges(num, date);
										
									}else{
										
										changeObj = { id: id, num: nums[i], type: 'paragraph', change: 1, text: "[Paragraph was added "+ date + "]"};
								
									changes[date].push(changeObj);
									addSubparagraphChanges(num, date);
										
									}
									
													
								}else{
									//console.log('ADD ID IS NULL');
									//console.log(num);
								}
							}
						
					}
				
					
				
				}else{
					for(var sub = 0; sub < nums.length; sub++){
						if(!isNaN(nums[sub])){
							
							var num= sectionNum+','+nums[sub];
							id = lookUpTable[num];
							if(id!=null){
								
								changeObj = { id: id, num: nums[sub], type: 'subsection', change: 1, text: "[Subsection was added "+ date + "]"};
								changes[date].push(changeObj);
								
								addParagraphChanges(num, date);
							}else{
								//console.log('ADD ID IS NULL');
								//console.log(num);
							}
						}
						
					}
					
					
				}
				
				
			}else{
				var num = sectionNum+','+nums[0];
				id = lookUpTable[num];
				if(id!=null){
							
					changeObj = { id: id, num: nums[0], type: 'subsection', change: 1, text: "[Subsection was added "+ date + "]"};
					changes[date].push(changeObj);
					
					addParagraphChanges(num, date);
				}else{
					//console.log('ADD ID IS NULL');
					//console.log(num);
				}
				
			}
		}else{

			for(var i = 0; i < nums.length;i++){
				
				var	num = sectionNum+','+nums[i];
				id = lookUpTable[num];
				if(nums[i].length>3){
					
					if(id == null){
						/* adding sections that don't exist
						////console.log(nums[i]);
						var prevId = lookUpTable[sectionNum];
						var newId = "d" + sectionNum+nums[i].replace(/ /g,'').replace(/\'/g,'');
						////console.log(newId);
						var idIndex = findIdIndex(prevId);
					
						if(idIndex != null && newId != null){
							var defObj = { id: newId, num: [nums[i]], type: "definition", text: ""};
							
							flattenedAct.splice(idIndex+1,0,defObj);
		
							lookUpTable[sectionNum+','+nums[i]]= newId;
							var parentId = prevId;
							////console.log(parentId);
							var icy = icyData['innerObj'];
							
							var icyObj = findIdinIcicleData(icy, parentId);
							////console.log(icyObj);
							if(icyObj!=null){
								icyObj[newId] = 1;
							
								changeObj = { id: newId, num: [nums[i]], type: 'definition', change: 1, text: "[Definition was added "+ date + "]"};
								changes[date].push(changeObj);
				
							}else{
							//console.log('ICYOBJ IS NULL SO DID NOT ADD');
							//console.log(lookUpKey+num);
							}
							
							
						}
						*/
					}else{
						
						
						changeObj = { id: id, num: [nums[i]], type: 'definition', change: 1, text: "[Definition was added "+ date + "]"};
						changes[date].push(changeObj);
						addParagraphChanges(num, date);
					}
					
				
				}else{
					changeObj = { id: id, num: nums[i], type: 'paragraph', change: 1, text: "[Paragraph was added "+ date + "]"};
					changes[date].push(changeObj);
					addSubparagraphChanges(num, date);
				}
				
				
				
			}
			
		}
		
		
	}else{
		id = lookUpTable[sectionNum];
		if(id!=null){

			var index = findIdIndex(id);
			
			var marginalnote = flattenedAct[index].marginalnote;
			changeObj = { id: id, num: sectionNum, type: 'section', marginalnote: marginalnote, change: 1, text: "[Section was added "+ date + "]"};
			changes[date].push(changeObj);
			addSubsectionChanges(sectionNum, date);
		}
		
	}
	
	//ignoring section examples like " 5 to 6.7" 
	
}



function addSubsectionChanges(num, date){
	var sectionId = lookUpTable[num];
	var index = findIdIndex(sectionId);
	var sectionDouble = parseFloat(num);
	if(!(isNaN(sectionDouble))&& index!=null){
	//find next available section
		var nextSectionNum, nextSectionId= null, s= 0.1;
	
		while(s < numberOfSections && nextSectionId==null){
			nextSection = parseFloat((sectionDouble + s).toFixed(1));
			
			nextSectionNum = nextSection.toString();
			nextSectionId = lookUpTable[nextSectionNum];
			s = s + 0.1;
		}
		if(nextSectionId !=null){
			var ind = index+1;
			var next = flattenedAct[ind];
			
			//add all sections until next section 
			while(next.id != nextSectionId && next.type != 'part'){
				
				changeObj = { id: next.id, num: next.num, type: next.type,  change: 1, text: "addedsubsection"};
				changes[date].push(changeObj);
				var nums = num +','+next.num;
			
				
				ind = ind + 1;
				next = flattenedAct[ind];
				
			}
		}
	}

}


function addParagraphChanges(num, date){
	var paraNums = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	
	for(var p = 0; p < paraNums.length; p++){
		var currentPara = paraNums[p];
		var paraId = lookUpTable[num+','+currentPara];
		if( paraId!= null){
			changeObj = { id: paraId, num: currentPara, type:'paragraph',change: 1, text: ""};
			
			changes[date].push(changeObj);
			addSubparagraphChanges(num+','+currentPara, date);
			
			
		}
		
	}

	
}

function addSubparagraphChanges(num, date){
	
	var subparaNums = ['i','ii','iii','iv','v','vi','vii','viii'];
	
	for(var sp = 0; sp < subparaNums.length; sp++){
		var currentSubpara = subparaNums[sp];
		var subparaId = lookUpTable[num+','+currentSubpara];
		if(subparaId != null){
			changeObj = { id: subparaId, num: currentSubpara, type:'subparagraph',change: 1, text: ""};
			changes[date].push(changeObj);
		}
	}
}

function getChangeType(text){
	typeOfchange = -2;
	if(text.indexOf("added")> -1 ){
		typeOfchange = 1;
	} else 
					//if(text.indexOf("amended")> -1 || text.indexOf("re-enacted")){
	if(text.indexOf("amended")> -1){
		typeOfchange = 0;
	}else
	if(text.indexOf("repealed")> -1){
		typeOfchange = -1;
	}else if(text.indexOf("re-enacted")>-1){
		typeOfchange = 0;
	}else if(text.indexOf("replaced")>-1){
		typeOfchange = 0;
	}else if(text.indexOf("enacted")>-1){
		typeOfchange = 1;
	}else if(text.indexOf("self-repeal")>-1){
		typeOfchange = -1;
	}else if(text.indexOf("changes")>-1){
		typeOfchange = 0;
	}else{
		//console.log('type of change not found');
		//console.log(text);
	}
	
	return typeOfchange;
	
}


function parseChangenoteText(text){
	
	var index;
	var matches = [];
	var re = /\(([0-9a-z]*|([0-9a-z]\.[0-9]))\)/g;
	var m;
	
	if( text.indexOf('definition')>-1){
		var index = text.indexOf('definition');

		while (m = re.exec(text.substring(0,index))) {
			matches.push(m[1]);
		};
		
			
		var re2=  /"([^"]*)"/g,
		n, matches2=[];
	
		//var n;
		while (n = re2.exec(text)) {
			//matches2.push(n[1]);
			matches.push(n[1]);
		};
		
		while (m = re.exec(text.substring(index))) {
			matches.push(m[1]);
		};

	}else{
		while (m = re.exec(text)) {
			matches.push(m[1]);
		};
		
		
	}
	
	

	return matches;
}



// Returns the nodeName of an element without the namespace reference.
var getNodeType = (function() {
    var regex = /(?:\w+\:)?(.+)/;

    return function getNodeType(element) {
        return regex.exec(element.nodeName)[1].toLowerCase();
    };
})();

// Returns true if a document's id is marked with 'rep'.

var isRepealed = (function() {
    var reRep = /^\d+rep(?:$|_)/;

    return function isRepealed(docId) {
        return reRep.test(docId);
    };
})();


// Returns a vis-compatible node with name and title set.
function getNewNode(name, title, type) {
    return {
        name: name,
        title: title,
        type: type,
        children: [],
        _children: []
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

})(window.parsePITxml = Object.create(null));
