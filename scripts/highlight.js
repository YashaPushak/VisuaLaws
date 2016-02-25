function highlight(id) {
	try
	{
		if(typeof scrollHighlight != 'undefined' && scrollHighlight)
		{
			scrollHighlight = false;
			
			d3.select("#main-diff").selectAll("div")
				.each(function(d) {
					unHighlight(d.id);
					d.highlight = false;
				});
		}
		
		//console.log(id);
		d3.select(d3.select("rect#" + id).node().parentNode).classed({"highlight": true})
			.moveToFront();
		d3.select("div#" + id).classed({"highlight": true});
		d3.select("div#sc" + id).classed({"highlight": true});
		
		d3.selectAll("span#bar" + id).each(function(d) {
			var type;
			if(d3.select(this).classed("bar-changed"))
				type = "changed";
			else if(d3.select(this).classed("bar-added"))
				type = "added";
			else
				type = "removed";
			
			var highlight = d3.select(this.parentNode).select("#sub-bar-wrapper-" + type).select("#highlight-" + type + "-bar");
			highlight.classed({"invisible": false});
			
			//console.log(highlight.node()._width_);
			
			if(typeof highlight.node()._width_ == "undefined")
				highlight.node()._width_ = 0;
			highlight.node()._width_ += barWidth;
			
			//console.log(highlight.node()._width_);
			highlight.style("width", Math.max(highlight.node()._width_ - 2,1) + "px");
			d3.select(this.parentNode.parentNode.childNodes[0]).classed({"highlight": true});
		});
	}catch(err)
	{
		console.log(err);
		console.log("And the id was: " + id);
	}
}

function unHighlight(id){
	try
	{
	d3.select(d3.select("rect#" + id).node().parentNode).classed({"highlight": false});
	d3.select("div#" + id).classed({"highlight": false});
	d3.select("div#sc" + id).classed({"highlight": false});
	d3.selectAll("span#bar" + id).classed({"highlight": false});
	d3.selectAll("span#bar" + id).each(function(d) {
		var type;
		if(d3.select(this).classed("bar-changed"))
			type = "changed";
		else if(d3.select(this).classed("bar-added"))
			type = "added";
		else
			type = "removed";
		
		var highlight = d3.select(this.parentNode).select("#sub-bar-wrapper-" + type).select("#highlight-" + type + "-bar").classed({"invisible": true});
		highlight.style("width", "0px");
		highlight.node()._width_ = 0;
		
		firstAdded = true;
		firstChanged = true;
		firstRemoved = true;
		d3.select($(this).context.parentNode.parentNode.childNodes[0]).classed({"highlight": false});
	});
	}catch(err)
	{
		console.log(err);
		console.log("And the id was: " + id);
	}
}

function onScroll() {
	//console.log("Start Scroll");
	
	d3.selectAll("#highlight-added-bar").style("width", "0px")
		.each(function () {
			this._width_ = 0;
		})
		.classed({"invisible": true});
	d3.selectAll("#highlight-changed-bar").style("width", "0px")
		.each(function () {
			this._width_ = 0;
		})
		.classed({"invisible": true});
	d3.selectAll("#highlight-removed-bar").style("width", "0px")
		.each(function () {
			this._width_ = 0;
		})
		.classed({"invisible": true});
	
	scrollHighlight = false;
	
	d3.select("#main-diff").selectAll("div")
		.each(function(d) {
			if((d.change == -1 || d.change == 0 || d.change == 1) && d.bindWithDiff)
			{
				if(isScrolledIntoView("div#" + d.id))
				{
					highlight(d.id);
					d.highlight = true;
				}
				else if(d.highlight)
				{
					unHighlight(d.id);
					d.highlight = false;
				}
			}
		});
		
	scrollHighlight = true;
}

function isScrolledIntoView(elem)
{	
	var elem = $(elem);
	var window = $("#main-diff-container");

	var docViewTop = window.position().top;
	var docViewBottom = docViewTop + window.height();
	
	var elemTop = elem.offset().top;
	var elemBottom = elemTop + elem.height();

	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}