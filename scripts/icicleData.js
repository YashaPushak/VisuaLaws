function icicleData(act){
	var icicleObj = {};
	icicleObj["innerObj"]={};
	sections = act.content.section;
	if( sections != null){
		for( var i = 0; i< sections.length; i++){
			var section = sections[i];
			var sectionName = section.id;
			//console.log(sectionName);
			//store num and id
			var subsections = section.subsection;
			if(subsections != null){
				icicleObj["innerObj"][sectionName] = {};
				for( var j = 0; j< subsections.length; j++){
					var subsection = subsections[j];
					var subsecName = subsection.id;
					//console.log(subsection.id);
					var paragraphs = subsection.paragraph;
					if(paragraphs != null){
						icicleObj["innerObj"][sectionName][subsecName] = {};
						for ( var k =0; k< paragraphs.length; k++ ){
							var paragraph = paragraphs[k];
							var paraName = paragraph.id;
							//console.log(paraName);
							var subparagraphs = paragraph.subparagraph;
							if(subparagraphs != null){
							icicleObj["innerObj"][sectionName][subsecName][paraName] = {};
								for(var l = 0; l< subparagraphs.length; l++){
									var subpara = subparagraphs[l];
									var subparaName = subpara.id;
									//console.log(subparaName);
									icicleObj["innerObj"][sectionName][subsecName][paraName][subparaName] = 1;
														
								}
							
							}else{
								
								icicleObj["innerObj"][sectionName][subsecName][paraName] = 1;
								//console.log(icicleObj);
							}
					
						}
					}else{
						icicleObj["innerObj"][sectionName][subsecName] = 1;
						}
					
				}
			}else{
				icicleObj["innerObj"][sectionName] = 1;
			
			}
		}
	}
	
	return icicleObj;
}