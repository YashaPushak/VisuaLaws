function colourScroll(d){
	
	var scent = $("div#sc" + d.id);
	if(!scent.length)
	{
			var mainDiv = $("div#main-diff");
			var mainDivContainer = $("div#main-diff-container");
			var thisDiv = $("div#" + d.id);
		
		if((typeof window.chrome === "object"))
		{
			var scentHeight = (thisDiv.height()/mainDiv.height())*mainDivContainer.height();
			//console.log(scentHeight);
			scentHeight = Math.min(scentHeight,5);
			scentHeight = Math.max(scentHeight,1);
			$("div#scented-scroll").append("<div class='scent-chrome' id='sc" + d.id + "' style='height: " + scentHeight + "px'></div>");
			var browserShift = -1;
			var arrowSize = 20;
		}
		else 
		{
			$("div#scented-scroll").append("<div class='scent-firefox' id='sc" + d.id + "'></div>");
			var browserShift = 1;
			var arrowSize = 20;
		}
			
	
		scent = $("div#sc" + d.id);
		
		var down = arrowSize+((thisDiv.offset().top + thisDiv.height()/2) - mainDiv.offset().top)/mainDiv.height()*(mainDivContainer.height()-arrowSize*3)

		var offset = {	left: browserShift+mainDiv.offset().left + mainDiv.width(),
						top: mainDivContainer.offset().top + down
		};

		scent.offset(offset);
		scent.click(onScentClick);
		scent.mouseover(onMouseOverScent);
		scent.mouseout(onMouseOutScent);
	}
	

	
	if(d.change == -1)
		d3.select("div#sc" + d.id).classed({'scent-removed': true, 'scent-added': false, 'scent-changed': false, 'invisible': false})
	else if(d.change == 1)
		d3.select("div#sc" + d.id).classed({'scent-removed': false, 'scent-added': true, 'scent-changed': false, 'invisible': false})
	else if(!(d.text === $(this).find('span').html()))
		d3.select("div#sc" + d.id).classed({'scent-removed': false, 'scent-added': false, 'scent-changed': true, 'invisible': false})
	else
		d3.select("div#sc" + d.id).classed({'scent-removed': false, 'scent-added': false, 'scent-changed': false, 'invisible': true})
		//scent.remove();
	
	
}

function onScentClick() {
	
	//console.log(this.id.substring(2));
	
	var newScroll = $("div#" + this.id.substring(2)).position().top;

	var oldScroll = $('.main-diff-div').scrollTop();
	
	$('.main-diff-div').animate({scrollTop:(oldScroll+newScroll)}, 500);

}

function onMouseOverScent(){
	hoverElem = this;
	
	highlight(this.id.substring(2));
}

function onMouseOutScent(){
	if(hoverElem === this)
		hoverElem = null;
	
	unHighlight(this.id.substring(2));
}

function resizeScent() {
	
	d3.select("#scented-scroll").selectAll("div").each(function (d) {
		var mainDiv = $("div#main-diff");
		var mainDivContainer = $("div#main-diff-container");
		var thisDiv = $("div#" + this.id.substring(2));
		
		var scent = $("div#" + this.id);
		
		if((typeof window.chrome === "object"))
		{
			var browserShift = -1;
			var arrowSize = 20;
		}
		else 
		{
			var browserShift = 1;
			var arrowSize = 20;
		}
			
		
		var down = arrowSize+((thisDiv.offset().top + thisDiv.height()/2) - mainDiv.offset().top)/mainDiv.height()*(mainDivContainer.height()-arrowSize*3)

		var offset = {	left: browserShift+mainDiv.offset().left + mainDiv.width(),
						top: mainDivContainer.offset().top + down
		};

		scent.offset(offset);
	})
}