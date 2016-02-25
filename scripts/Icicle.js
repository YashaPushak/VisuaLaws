function onClick(d) {
	
	click = 1;

	setTimeout(function() {
		
		if(click == 1){

			if(d.key != 'innerObj')
				var newScroll = $("div#" + d.key).position().top;
			else
				var newScroll =  $("div#main-diff").position().top;
			var oldScroll = $('.main-diff-div').scrollTop();
			
			$('.main-diff-div').animate({scrollTop:(oldScroll+newScroll)}, 500);
		}
		
		//location.hash = "#" + d.key;
	
	}, 250)
	
	
}


function onDblClick(d) {
	
	click = click + 1;
	
  //x.domain([d.y, d.y + d.dy]);
  //y.domain([d.x, 1]).range([d.x ? 20 : 0, height]);
  icicle.x.domain([d.y, 1]).range([d.y ? 20: 0, icicle.width]);
  icicle.y.domain([d.x, d.x + d.dx]);
  
  icicle.d = {};
  
  icicle.d.x = d.x;
  icicle.d.y = d.y;
  icicle.d.dx = d.dx;
  icicle.d.dy = d.dy;

  icicle.rect.transition()
	  .duration(750)
	  .attr("x", function(d) { return icicle.x(d.y); })
	  .attr("y", function(d) { return icicle.y(d.x); })
	  .attr("width", function(d) { return icicle.x(d.y + d.dy) - icicle.x(d.y) - 1; })
	  .attr("height", function(d) { return icicle.y(d.x + d.dx) - icicle.y(d.x); });
	  
	  
  //We need to set the text label twice so that on the second pass we remove labels that don't fit in their boxes.
  icicle.text.text(icicleLabel);
  icicle.text.text(icicleLabel);
	  
  icicle.text.transition()
	  .duration(750)
	  .attr("x", function(d) { return icicle.x(d.y) + (icicle.x(d.y + d.dy) - icicle.x(d.y))/2 - this.getBBox().width/2; })
	  .attr("y", function(d) { return icicle.y(d.x) + (icicle.y(d.x + d.dx) - icicle.y(d.x))/2 + this.getBBox().height/4; })
	  .attr("width", function(d) { return icicle.x(d.y + d.dy) - icicle.x(d.y) - 1; })
	  .attr("height", function(d) { return icicle.y(d.x + d.dx) - icicle.y(d.x); });
	 
  setTimeout(function() {onChangeFrame();},750);
	
}

function onHoverIcicleTitle() {
	var d = this.__data__
	//console.log(this);
	if(d.key != "innerObj")
	{
		var dat = d3.select("#main-diff").select("#" + d.key).data()[0];
		if(typeof dat != 'undefined')
		{
			if(dat.type == "section")
				return "(" + dat.num + ") " + dat.marginalnote;
			else if(dat.type == "definition")
				return dat.num;
			else if(dat.type == "part")
				return "Part " + dat.num;
			else
				return "(" + dat.num + ") " + dat.text;
		}
		else
		{
			console.log("Undefined thing happened.");
		}
	}
	else 
		return act.name;
}

function icicleLabel() {
	var d = this.__data__;
	//console.log(d.first);
	if(typeof d.first == 'undefined' || d.first == false)
	{
		d.first = true;
		if(d.key != "innerObj")
		{
			var dat = d3.select("#main-diff").select("#" + d.key).data()[0];
			if(typeof dat != 'undefined')
			{
				
				//console.log(dat.num);
				if(dat.type == "section")
					return dat.num;
				else if(dat.type == "definition")
					return dat.num;
				else if(dat.type == "part")
					return "P" + dat.num;
				else
					return  "(" + dat.num + ")";
			}
			else
			{
				console.log("Undefined thing happened.");
			}
		}
		else 
			return "Act";
	}
	else{
		d.first = false;
		//console.log(this.textContent);
		if((icicle.y(d.x + d.dx) - icicle.y(d.x)) > this.getBBox().height && ((icicle.x(d.y + d.dy) - icicle.x(d.y)) > this.getBBox().width))
		{
			return this.textContent;
		}
		else
		{
			return "";
		}
	}
}

//This function gets called from inside the main-diff's update method.
function colourIcicle(d) {
	if(d.change == -1)
		d3.select("svg").select("#" + d.id).classed({'rect-removed': true, 'rect-added': false, 'rect-changed': false});
	else if(d.change == 1)
		d3.select("svg").select("#" + d.id).classed({'rect-removed': false, 'rect-added': true, 'rect-changed': false})
			.attr("height", function(d) { return Math.max(icicle.y(d.x + d.dx) - icicle.y(d.x),1); });
	else if(d.change == 0)//!(d.text === $(this).find('span').html()))
		d3.select("svg").select("#" + d.id).classed({'rect-removed': false, 'rect-added': false, 'rect-changed': true});
	else
		d3.select("svg").select("#" + d.id).classed({'rect-removed': false, 'rect-added': false, 'rect-changed': false});
	
	
}

function onMouseOverIcicle(d) {
	hoverElem = this;
	highlight(d.key);
	/*d3.select(d3.select("rect#" + d.key).node().parentNode).classed({"highlight": true});
	d3.select("div#" + d.key).classed({"highlight": true});
	d3.select("div#sc" + d.key).classed({"highlight": true});
	d3.select("span#bar" + d.key).classed({"highlight": true});*/
}

function onMouseOutIcicle(d) {
	if(hoverElem === this)
		hoverElem = null;
	
	unHighlight(d.key);
	/*d3.select(d3.select("rect#" + d.key).node().parentNode).classed({"highlight": false});
	d3.select("div#" + d.key).classed({"highlight": false});
	d3.select("div#sc" + d.key).classed({"highlight": false});
	d3.select("span#bar" + d.key).classed({"highlight": false});*/
}

function resizeIcicle() {
	
  var d = icicle.d;
	
  icicle.width = $("#icicle-scroll").width() - 20;
  if(icyLayoutData[0].value > ($("#icicle-div").height() - $("#icicle-title").height()) - 20)
  {
	  icicle.height = icyLayoutData[0].value;
	  $("#icicle-scroll").css("overflow-y", "scroll");
  }
  else
  {
	  icicle.height = ($("#icicle-div").height() - $("#icicle-title").height()) - 20;
	  $("#icicle-scroll").css("overflow-y", "hidden");
  }

  $("#icicle-scroll").height($("#icicle-div").height() - $("#icicle-title").height()-20);
  
  //console.log(icicle.width);
  //console.log(icicle.height);
  
  icicle.svg
	.attr("width", icicle.width)
	.attr("height", icicle.height);
	
  icicle.x = d3.scale.linear()
	.range([0, icicle.width]);

  icicle.y = d3.scale.linear()
	.range([0, icicle.height]);
	
  icicle.x.domain([d.y, 1]).range([d.y ? 20: 0, icicle.width]);
  icicle.y.domain([d.x, d.x + d.dx]);
	
  icicle.rect.transition()
	  .duration(0)
	  .attr("x", function(d) { return icicle.x(d.y); })
	  .attr("y", function(d) { return icicle.y(d.x); })
	  .attr("width", function(d) { return icicle.x(d.y + d.dy) - icicle.x(d.y) - 1; })
	  .attr("height", function(d) { 
			var sel = d3.select("rect#" + this.id);
			if(sel.classed('rect-changed') || sel.classed('rect-added') || sel.classed('rect-removed'))
			{				
				return Math.max(icicle.y(d.x + d.dx) - icicle.y(d.x),3);
			}
			else
			{
				return icicle.y(d.x + d.dx) - icicle.y(d.x);
			}
	 });
	  
	  
	 

	  
	  
  //We need to set the text label twice so that on the second pass we remove labels that don't fit in their boxes.
  icicle.text.text(icicleLabel);
  icicle.text.text(icicleLabel);
	  
  icicle.text.transition()
	  .duration(0)
	  .attr("x", function(d) { return icicle.x(d.y) + (icicle.x(d.y + d.dy) - icicle.x(d.y))/2 - this.getBBox().width/2; })
	  .attr("y", function(d) { return icicle.y(d.x) + (icicle.y(d.x + d.dx) - icicle.y(d.x))/2 + this.getBBox().height/4; })
	  .attr("width", function(d) { return icicle.x(d.y + d.dy) - icicle.x(d.y) - 1; })
	  .attr("height", function(d) { return icicle.y(d.x + d.dx) - icicle.y(d.x); });
	  
	  
	 icicle.rect.each(function () {
		 var sel = d3.select("rect#" + this.id);
		 if(sel.classed('rect-changed') || sel.classed('rect-added') || sel.classed('rect-removed'))
		 {
		 	d3.select(sel.node().parentNode).moveToFront();
		 }
	 });
}

function onChangeFrame(){
	
	changedAbove = 0;
	addedAbove = 0;
	removedAbove = 0;
	changedBelow = 0;
	addedBelow = 0;
	removedBelow = 0;
	
	icicle.rect
		.each(function(d) {
			var changed;
			var added;
			var removed;
			if((changed = d3.select(this).classed('rect-changed')) || 
			   (added = d3.select(this).classed('rect-added')) || 
			   (removed = d3.select(this).classed('rect-removed')))
			{
				
				var d = this.__data__;
				switch(isNotInView("rect#" + d.key))
				{
					case 1:
						if(changed)
							changedAbove++;
						else if(added)
							addedAbove++;
						else if(removed)
							removedAbove++;
					break;
					case -1:
						if(changed)
							changedBelow++;
						else if(added)
							addedBelow++;
						else if(removed)
							removedBelow++;
					break;
					case 0:
						//Do nothing, the element is in the view.
					break;
				}
			}
		});
		
		var width = $("#icicle-div").width()-2;
		var padding = 0;
		var totalEdited = totalAdded + totalChanged + totalRemoved;
		
		var addedWidth = (addedAbove/totalEdited)*width;
		if(addedWidth > 0)
			addedWidth = Math.max(addedWidth,1);
		
		if(totalEdited == 0)
			addedWidth = 0;
		
		$("#added-above-icicle").css({"left": "0px", "width": addedWidth + "px"});
		
		if(addedWidth > 0)
			padding++;
		
		var changedWidth = (changedAbove/totalEdited)*width;
		if(changedWidth > 0)
			changedWidth = Math.max(changedWidth,1);
		
		if(totalEdited == 0)
			changedWidth = 0;
		
		$("#changed-above-icicle").css({"left": (addedWidth + padding) + "px", "width": changedWidth + "px"});
		
		if(changedWidth > 0)
			padding++;
		
		var removedWidth = (removedAbove/totalEdited)*width;
		if(removedWidth > 0)
			removedWidth = Math.max(removedWidth,1);
		
		if(totalEdited == 0)
			removedWidth = 0;
		
		$("#removed-above-icicle").css({"left": (addedWidth + changedWidth + padding) + "px", "width": removedWidth + "px"});
		
		
		var width = $("#below-icicle").width();
		var padding = 0;
		
		var addedWidth = (addedBelow/totalEdited)*width;
		if(addedWidth > 0)
			addedWidth = Math.max(addedWidth,1);
		
		if(totalEdited == 0)
			addedWidth = 0;
		
		$("#added-below-icicle").css({"left": "0px", "width": addedWidth + "px"});
		
		if(addedWidth > 0)
			padding++;
		
		var changedWidth = (changedBelow/totalEdited)*width;
		if(changedWidth > 0)
			changedWidth = Math.max(changedWidth,1);
		
		if(totalEdited == 0)
			changedWidth = 0;
		
		$("#changed-below-icicle").css({"left": (addedWidth + padding) + "px", "width": changedWidth + "px"});
		
		if(changedWidth > 0)
			padding++;
		
		var removedWidth = (removedBelow/totalEdited)*width;
		if(removedWidth > 0)
			removedWidth = Math.max(removedWidth,1);
		
		if(totalEdited == 0)
			removedWidth = 0;
		
		$("#removed-below-icicle").css({"left": (addedWidth + changedWidth + padding) + "px", "width": removedWidth + "px"});

		/*
		console.log("Fraction added above: " + (addedAbove));
		console.log("Fraction changed above: " + (changedAbove));
		console.log("Fraction removed above: " + (removedAbove));
		console.log("Fraction added below: " + (addedBelow));
		console.log("Fraction changed below: " + (changedBelow));
		console.log("Fraction removed below: " + (removedBelow));
		*/
	
}

function isNotInView(elem)
{	
	var found = "rect#d2e112" == elem;
	var elem = $(elem);
	var window = $("#icicle-scroll");

	var docViewTop = window.position().top;
	var docViewBottom = docViewTop + window.height();
	
	var elemTop = elem.position().top;
	var elemBottom = elemTop + elem[0].getBBox().height;
	
	/*if(found)
	{
		console.log("docViewTop: " + docViewTop);
		console.log("docViewBottom: " + docViewBottom);
		console.log("elemTop: " + elemTop);
		console.log("elemBottom: " + elemBottom);
	}*/

	if(elemTop >= docViewBottom - 3)
	{
		//console.log("Below");
		return -1;
	}
	else if(elemBottom <= docViewTop)
	{
		//console.log("Above");
		return 1;
	}
	else
	{
		//console.log("Inside");
		return 0;
	}
}