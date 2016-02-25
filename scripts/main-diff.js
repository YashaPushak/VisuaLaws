function update(years)
{
	//Clear the current data
	d3.select("#main-diff")
		.selectAll("div")
		.remove();
		
	bindNoDiff(years[1]);
	bindWithDiff(years);

}
	
function bindNoDiff(year)
{	
	//Reset the document to be the most up-to-date copy
	d3.select("#main-diff")
		.selectAll("div")
		.data(data[data.length-1].data)	
		.enter().append("div")
		.attr("id", function(d) {
			return d.id;
		})
		.html(function(d) { return formatSection(d.id,d.num,d.text,d.marginalnote,d.type,d.text); })
		.each(function(d) {
			d.bindWithDiff = false;
		})
		.on("mouseover", onMouseOverDiff)
		.on("mouseout", onMouseOutDiff);
		
	var newSection = false;
	
	d3.select("svg").selectAll("rect").classed({'rect-removed': false, 'rect-added': false, 'rect-changed': false});
	d3.select("div#scented-scroll").selectAll("div").classed({'scent-removed': false, 'scent-added': false, 'scent-changed': false, 'invisible': true})
	//$("div#scented-scroll").empty();
		
	//Add all changes to find the document at the year specified
	for(k = data.length-2; k >= 0 && data[k].date > year; k--)
	{
		if(k>=0)
		{		
			d3.select("#main-diff")
				.selectAll("div")
				.data(data[k].data, function(d) { return d.id; })
				.attr("id", function(d) {
					return d.id;
				})
				.html(function(d) { return formatSection(d.id,d.num,d.text,d.marginalnote,d.type,d.text); })
				.each(function(d) {
					d.bindWithDiff = false;
					
					if(d.change == 1 && d.text == "")
						d3.select(this).classed({"invisible": true});
					else
						d3.select(this).classed({"invisible": false});
				});
				
		}
	} 
}

function bindWithDiff(years)
{
	var i;//Find the index i that corresponds to the current year. 
	
	totalChanged = 0;
	totalAdded = 0;
	totalRemoved = 0;

	for(i = 0; i < data.length && years[1].getTime() != data[i].date.getTime(); i++);
	
	
	for(k = i; k > 0 && k < data.length && data[k].date > years[0]; k--)
	{
		if(k>=0)
		{
			//console.log(k);

			mainSelection = d3.select("#main-diff")
				.selectAll("div")
				.data(data[k].data, function(d) { return d.id; });
			
			//Update the HTML to include the diff
			mainSelection.html(formatChangedSection);	
				
			mainSelection.classed({'added': function(d) { return d.change == 1; }, 'removed': function(d) { return d.change == -1; }, 'changed': function(d) { return d.change == 0;}});
			
			mainSelection.each(colourIcicle);
			mainSelection.each(colourScroll);
			
			mainSelection.each(function(d) {
				d.bindWithDiff = true;
				if(d.change == 0)
					totalChanged++;
				else if(d.change == 1)
					totalAdded++;
				else if(d.change == -1)
					totalRemoved++;
				
				//TODO Yasha fix
				if(d.change == 1 && $(this).find('span').html().toLowerCase().indexOf("repealed") > -1)
					d3.select(this).classed({"invisible": true});
				else
					d3.select(this).classed({"invisible": false});
			});
				
			mainSelection.exit().property('background-color', 'none');
		}
	}
}

function formatSection(id,num,text,marginalNote,type,hiddenText)
{
	switch(type) {
		case 'section':
			return "<a name='" + id + "'\><h4><strong class='secno'>" + num + "</strong>&nbsp;&nbsp;" + marginalNote + "</h4><p class='sec1'>" + text + "</p><span class='invisible'>" + hiddenText + "</span>";
		case 'subsection':
			return "<a name='" + id + "'\><p class='sec1'>(" + num + ") " + text + "</p><span class='invisible'>" + hiddenText + "</span>";
		case 'paragraph':
			return "<a name='" + id + "'\><p class='para'>(" + num + ") " + text + " </p><span class='invisible'>" + hiddenText + "</span>";
		case 'subparagraph':
			return "<a name='" + id + "'\><p class='subpara'>(" + num + ") " + text + "</p><span class='invisible'>" + hiddenText + "</span>";
		case 'definition':
				//text = text.replace(num,"<strong>\"" + num + "\"</strong>");
				
				//console.log(num);
				num.sort(function(a,b) {
					return b.length - a.length;
				});
				//console.log(num);
				for(var i = 0; i < num.length; i++)
					text = text.replace(num[i],"~$!" + i + "!$~");
				for(var i = 0; i < num.length; i++)
					text = text.replace("~$!" + i + "!$~","<strong>\"" + num[i] + "\"</strong>");
				
		
			return "<a name='" + id + "'\><p class='def'>" + text + "</p><span class='invisible'>" + hiddenText + "</span>";
		case 'part':
			return "<a name='" + id + "'\><p class='part'>Part " + num + " - " + text + "</p><span class='invisible'>" + hiddenText + "</span>";
		default:
			return num + " " + text + " " + marginalNote + " "  + type;
	}
}

function formatChangedSection(d) {
	if(d.change == -1)
	{
		return formatSection(d.id,d.num,d.text,d.marginalnote,d.type,$(this).find('span').html());
	}
	else if(d.change == 1)
	{
		return formatSection(d.id,d.num,$(this).find('span').html(),d.marginalnote,d.type,$(this).find('span').html());
	}
	else if(d.change == 0)
	//else if(!(d.text === $(this).find('span').html()))
	{						
		var ds = dmp.diff_main(d.text,$(this).find('span').html());							
		dmp.diff_cleanupSemantic(ds);
		ds = dmp.diff_prettyHtml(ds);
		return formatSection(d.id,d.num,ds,d.marginalnote,d.type,$(this).find('span').html());
	}
	else
	{
		return formatSection(d.id,d.num,d.text,d.marginalnote,d.type,$(this).find('span').html());
	}
}

function onMouseOverDiff(d) {
	hoverElem = this;
	highlight(d.id);
}

function onMouseOutDiff(d) {
	if(hoverElem === this)
		hoverElem = null;
	
	unHighlight(d.id);
}

function resizeMainDiff() {
	var newWidth = $("body").width() - $("#slider-div").width() - $("#icicle-div").width();
	$("#main-diff-container").width(newWidth);
	$("#title-div").width(newWidth);
	
	
}