function onSlide( event, ui ) {
	if(ui.values[0] < ui.values[1])
	{
		var first = 0;
		var second = 1;
	}
	else
	{
		var first = 1;
		var second = 0;
	}
	
	$( "#title" ).html(act.name + ": Dates " + formatDate(ui.labels[first]) +  " vs " + formatDate(ui.labels[second]) );
	update([ui.labels[first], ui.labels[second]]);
	
	onChangeFrame();
}

function formatDate(d)
{
	if($.datepicker.formatDate("M d, yy", d) == $.datepicker.formatDate("M d, yy", new Date()))
		return "Today";
	else
		return $.datepicker.formatDate("M d, yy", d);
}

function makeTicks(dates)
{
	var labelHeight = 12;
	
	$("#slider-container").height("100%");
	
	if((dates.length-1)*labelHeight > $("#slider-container").height()-80)
	{
		$("#slider-container").height($("#slider-div").height()-80);
		$("#slider-container").css("overflow-y", "scroll");
		$("#slider").height((dates.length-1)*labelHeight);
	}
	else
	{
		$("#slider-container").css("overflow-y", "initial");
		$("#slider").height($("#slider-container").height()-80);
	}
	
	
	
	var maxTick = Math.floor($("#slider").height()/labelHeight);
	if(maxTick < dates.length)
		maxTick = dates.length-1;
	

	oldSliderDivHeight = $("#slider-div").height();
	
	var minD = dates[0].getTime();
	var maxD = dates[dates.length-1].getTime();
	var length = maxD-minD;
	var tickArray = [];
	var tickLabels = [];
	var newTick = -1;
	var oldTick = -1;
	
	for(var i = 0; i < dates.length; i++)
	{
		newTick = Math.round(((dates[i].getTime()-minD)/length)*maxTick);
		if(newTick <= oldTick)
		{
			newTick = oldTick + 1;
			if(newTick > maxTick)
			{
				tickArray[i] = maxTick;
				
				//We've hit the maximum number of ticks so we need to shift all of of them down one to make room.
				for(var j = i-1; tickArray[j+1] == tickArray[j]; j--)
					tickArray[j] = tickArray[j] - 1;
				newTick = maxTick;
			}
		}
		
		tickArray[i] = newTick;
		oldTick = newTick;
	}	
		
	for(var i = 0; i < dates.length; i++)
	{
		tickLabels[tickArray[i]] = dates[i];
	}
	
	return [tickArray, tickLabels, maxTick];
}

function onMouseOverSlider(){
	hoverElem = this;
	
	var child = $($(this)[0].children[1]).context.children;
	for(var i = 0; i < child.length; i++)
	{
		var id = child[i].id;
		if(id.length > 0 && !(id == "sub-bar-wrapper-added" || id == "sub-bar-wrapper-changed" || id == "sub-bar-wrapper-removed" || id == "bar-axis-outer"))
			highlight(id.substring(3));
	}
}

function onMouseOutSlider(){
	if(hoverElem === this)
		hoverElem = null;
	
	var child = $($(this)[0].children[1]).context.children;
	for(var i = 0; i < child.length; i++)
	{
		var id = child[i].id;
		if(id.length > 0 && !(id == "sub-bar-wrapper-added" || id == "sub-bar-wrapper-changed" || id == "sub-bar-wrapper-removed" || id == "bar-axis-outer"))
			unHighlight(id.substring(3));
	}
}

function onSliderClick(){
	var child = $($(this)[0].children[1]).context.children;
	
	if(typeof this._counter_ == "undefined")
		this._counter_ = 0;
	else //Increment the counter if it exists
		this._counter_ = (this._counter_ + 1) % child.length;
	
	var id = child[this._counter_].id;
	//Skip the dividers.
	while((id == "sub-bar-wrapper-added" || id == "sub-bar-wrapper-changed" || id == "sub-bar-wrapper-removed"))
	{
		this._counter_ = (this._counter_ + 1) % child.length;
		id = child[this._counter_].id;
	}
	
	//Scroll to the div with this id.
	onBarClick(id.substring(3));
	
}

function onBarClick(id){
	console.log("in onBarClick");
	console.log(id);
	
	var newScroll = $("div#" + id).position().top;

	var oldScroll = $('.main-diff-div').scrollTop();
	
	$('.main-diff-div').animate({scrollTop:(oldScroll+newScroll)}, 500);
}

function resizeSlider(){
	if(oldSliderDivHeight != $("#slider-div").height())
	{
		var output = makeTicks(dates);

		var tickArray = output[0];
		var tickLabels = output[1];
		var maxTick = output[2];
		
		console.log("beforeDestroy");
		$( "#slider" ).labeledslider("destroy");
		
		$(function() {$( "#slider" ).labeledslider({
		  orientation: "vertical",
		  tickArray: tickArray,
		  tickLabels: tickLabels,
		  values: [0,  maxTick ],
		  min: 0,
		  max: maxTick,
		  slide: onSlide
		});
		$( "#title" ).html(act.name + ": Dates " + formatDate($( "#slider" ).labeledslider( "labels", 0 )) +
		  " vs " + formatDate($( "#slider" ).labeledslider( "labels", 1 )) );
		});
						
	}
}
