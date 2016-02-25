<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">

  <title>VisuaLaws</title>
  <script src="scripts/jquery-2.1.4.min.js"></script>
<script src="scripts/d3-master/d3.min.js" charset="utf-8"></script>
<script src="scripts/jquery-ui-1.11.4.custom/jquery-ui.js" charset="utf-8"></script>
<script src="scripts/jquery-ui-extensions/ext-jquery-ui.js" charset="utf-8"></script>
<script src="scripts/Diff.js" charset="utf-8"></script>
<script src="ExampleChanges.js" charset="utf-8"></script>
<script src="scripts/icicleData.js" charset="utf-8"></script>
<script src="scripts/BCLawsActParser.js" charset="utf-8"></script>
<script src="scripts/PITParser.js" charset="utf-8"></script>
<script src="scripts/xml2json.js" type="text/javascript" language="javascript"></script>
<script src="scripts/tipsy.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/main-diff.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/Icicle.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/Slider.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/loadData.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/scentedScroll.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/highlight.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/spin.min.js" type="text/javascript" language="javascrippt"></script>
<script src="scripts/window.js" type="text/javascript" language="javascrippt"></script>


<link rel="stylesheet" href="scripts/jquery-ui-1.11.4.custom/jquery-ui.theme.min.css" />
<link rel="stylesheet" href="scripts/jquery-ui-1.11.4.custom/jquery-ui.structure.min.css" />
<link rel="stylesheet" href="scripts/jquery-ui-extensions/ext-jquery-ui.css" />  
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.tipsy/1.0.2/jquery.tipsy.css" /> 
<link rel="stylesheet" href="style.css" /> 

<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<link rel="icon" href="favicon.ico" type="image/x-icon">
</head>

<body>

<div id="spinner" class="centerText">
<img class="spinner-title" src="LogoText.png?v=1.3">

</div>
<div id="select" class="centerText">
	<h3>Please select a law to view</h3>
	<select id="law-select" onchange="loadLaw(this.value);">
		<option value="-1" selected disabled>Select a law...</option>
		<option value="06019">Apology Act</option>
		<option value="96007">Age of Majority Act</option>
		<option value="96466">Tug Boat Worker Lien Act</option>
		<option value="96080">Court Rules Act</option>
		<option value="96443">Supreme Court Act</option>
		<option value="96282">Marriage Act</option>
		<option value="96204">Hospital Insurance Act</option>
		<option value="96359">Personal Property Act</option>
		<option value="96113">Employment Standards Act</option>
	</select>
	<div id="error-message" style="display: none">
		<h3>Error, failed to load law.</h3>
	</div>
</div>

<div id="body" style="display: none">
	<div id="logo-div" class="logo-div view">
		<table>
			<tr>
				<td>
					<img src="logo.png" class="logo" />
				</td>
			</tr>
		</table>
	</div>
	<div id="title-div" class="title-div view">
		<table>
			<tr>
				<td>
					<h2 class="title" id="title"></h2>
				</td>
			</tr>
		</table>
	</div>
	<div class="select-div view">

	</div>


	<div id="icicle-div" class="icicle-div view">
		<!--<b class="view-title" id="icicle-title" >Document Structure</b>-->
		<!--<div class="icicle-bar-label">
			Changes above view
		</div>-->
		<div id="above-icicle" class="outside-icicle above-icicle">
			<div id="added-above-icicle" class="bar-added"></div>
			<div id="changed-above-icicle" class="bar-changed"></div>
			<div id="removed-above-icicle" class="bar-removed"></div>
		</div>
			<div id="icicle-scroll" class="icicle-scroll">
				<div id="icicle" class="icicle">
			</div>
		</div>
		<div id="below-icicle" class="outside-icicle below-icicle">
			<div id="added-below-icicle" class="bar-added"></div>
			<div id="changed-below-icicle" class="bar-changed"></div>
			<div id="removed-below-icicle" class="bar-removed"></div>
		</div>
		<!--<div class="icicle-bar-label">
			Changes below view
		</div>-->
	</div>

	<div id="main-diff-container" class="main-diff-div view" >
		<div id="main-diff">
		</div>
	</div>
	<div class="added"></div>
	
	<div id="legend-div" class="legend-div centerText">
			<table>
				<tr>
					<td>
						<div class="bar-added legend-bar"></div> <div class="legend-label"> Enacted</div></br>
						<div class="bar-changed legend-bar"></div> <div class="legend-label"> Amended</div></br>
						<div class="bar-removed legend-bar"></div> <div class="legend-label"> Repealed</div></br>
					</td>
				</tr>
			</table>
	</div>
	<div id="scented-scroll"></div>


	<div id="slider-div" class="slider-div view">
	<!--<b class="view-title">Date Selection</b>-->
		<div id="slider-container" class="slider-container">
			<div id="slider" class="slider"></div>
		</div>
		<span id='enacted' class='enacted'>Changes unavailable before 2000.</span>
	</div>
</div>
<script>






function loadLaw(id) {
		var opts = {
	  lines: 11 // The number of lines to draw
	, length: 35 // The length of each line
	, width: 41 // The line thickness
	, radius: 0 // The radius of the inner circle
	, scale: 1.25 // Scales overall size of the spinner
	, corners: 1 // Corner roundness (0..1)
	, color: '#000' // #rgb or #rrggbb or array of colors
	, opacity: 0.2 // Opacity of the lines
	, rotate: 90 // The rotation offset
	, direction: 1 // 1: clockwise, -1: counterclockwise
	, speed: 1 // Rounds per second
	, trail: 48 // Afterglow percentage
	, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
	, zIndex: 2e9 // The z-index (defaults to 2000000000)
	, className: 'spinner' // The CSS class to assign to the spinner
	, top: '50%' // Top position relative to parent
	, left: '50%' // Left position relative to parent
	, shadow: true // Whether to render a shadow
	, hwaccel: false // Whether to use hardware acceleration
	, position: 'absolute' // Element positioning
	}
	
	var target = document.getElementById('spinner')
	spinner = new Spinner(opts).spin(target);
	
	try {
	
		$.ajax
		  ({
			type: "GET",
			url: "http://app.knomos.ca/api/bcl_proxy",
			data: {url:"/civix/document/id/complete/statreg/" + id + "_01/xml"}, //Court Rules Act
			beforeSend: function (xhr) {
			  xhr.setRequestHeader ("Authorization", "Basic " + btoa("kimdr" + ":" + "zIMSNyE5iRDDsX00vDLCNFSHTAKr0odF"));
			},
			success: function (xml){
			
				xml1 = xml;
				  
				$.ajax
				  ({
					type: "GET",
					url: "http://app.knomos.ca/api/bcl_proxy",
					data: {url:"/civix/document/id/complete/statreg/" + id + "_pit/xml"}, 
					beforeSend: function (xhr) {
					  xhr.setRequestHeader ("Authorization", "Basic " + btoa("kimdr" + ":" + "zIMSNyE5iRDDsX00vDLCNFSHTAKr0odF"));
					},
					success: function (xml2){
					
						//---------------------------------------------------------------------------------------
						//Loading all the data and objects needed.
						
						//Get the hard-coded Court Rules Act Data
						wrapper = loadData(xml1,xml2);
						data = wrapper.data;
						dates = wrapper.dates;
						//Get the non-hard-coded Court Rules Act Data
						//act = $.xml2json(xml);
						
						//Formart the Court Rules Act Data for the Icicle plot.
						icyAct = wrapper.icyData;
						//var icyAct = icicleData(act);
						console.log(icyAct);

						//Create the diff tool.
						dmp = new diff_match_patch();
					
						$("#body").css("display", "inline");
						$("#spinner").css("display", "none");
						spinner.stop();
					
						//Add the first date to the dates array.
						dates = [new Date("January 1, 2000")];
						//Add all the changed dates to the dates array.
						for(var i = 0; i < changeData.length; i++)
							dates.push(new Date(changeData[i].date));
						//Add today's date to the date array.
						dates.push(today);
						

						//------------------------------------------------------------------------
						//Slider stuff

						var output = makeTicks(dates);

						var tickArray = output[0];
						var tickLabels = output[1];
						var maxTick = output[2];


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
						

						//---------------------------------------------------------------------------------------
						//Icicle plot
						
						d3.selection.prototype.moveToFront = function() { /*return this.each(function() { this.parentNode.appendChild(this); }); */};
						
						icicle = {};
						
						icicle.d = {};
						icicle.d.x = 0;
						icicle.d.y = 0;
						icicle.d.dx = 1;
						icicle.d.dy = 0.2;
						
						icicle.partition = d3.layout.partition()
							.children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
							.value(function(d) { return d.value; })
							.sort(null);
							
						icyLayoutData = icicle.partition(d3.entries(icyAct)[0]);
						
						console.log(icyLayoutData[0].value);
						
						icicle.width = $("#icicle").width() - 20;
						icicle.height = Math.max(icyLayoutData[0].value,($("#icicle-div").height() - $("#icicle-title").height()) - 20);
						
						$("#icicle-scroll").height($("#icicle-div").height() - $("#icicle-title").height()-20);
						//icicle.height = ;

						icicle.x = d3.scale.linear()
							.range([0, icicle.width]);

						icicle.y = d3.scale.linear()
							.range([0, icicle.height]);




						icicle.svg = d3.select("#icicle").append("svg")
							.attr("width", icicle.width)
							.attr("height", icicle.height);

						icicle.g = icicle.svg.selectAll("g");
						


						icicle.g = icicle.g
						  .data(icyLayoutData)
						.enter().append("g")
						  .attr("x", function(d) { return icicle.x(d.y); })
						  .attr("y", function(d) { return icicle.y(d.x); })
						  .sort(function(d1,d2){
							  less = -1;
							  more = 1;
							  if(d1.y < d2.y)
								  return less;
							  else if(d1.y > d2.y)
								  return more;
							  else if(d1.x < d2.x)
								  return less;
							  else if(d1.x > d2.x)
								  return more;
							  else
								  return 0;				
						  });
						  
						icicle.rect = icicle.g.append("rect")
						  .attr("x", function(d) { return icicle.x(d.y); })
						  .attr("y", function(d) { return icicle.y(d.x); })
						  .attr("width", function(d) { return icicle.x(d.dy)-1; })
						  .attr("height", function(d) { return icicle.y(d.dx); })
						  .attr("id", function(d) { return d.key; })
						  .on("click", onClick)
						  .on("dblclick", onDblClick)
						  .on("mouseover", onMouseOverIcicle)
						  .on("mouseout", onMouseOutIcicle);
						  
						$('svg rect').tipsy({ 
							gravity: 'sw', 
							html: true, 
							title: onHoverIcicleTitle
						});
						
						/*
						icicle = {};
						
						icicle.width = 150;
						icicle.height = 550;

						icicle.x = d3.scale.linear()
							.range([0, icicle.width]);

						icicle.y = d3.scale.linear()
							.range([0, icicle.height]);


						icicle.partition = d3.layout.partition()
							.children(function(d) { return isNaN(d.value) ? d3.entries(d.value) : null; })
							.value(function(d) { return d.value; })
							.sort(null);

						icicle.svg = d3.select("#icicle").append("svg")
							.attr("width", icicle.width)
							.attr("height", icicle.height);

						icicle.rect = icicle.svg.selectAll("rect");

						icicle.rect = icicle.rect
						  .data(icicle.partition(d3.entries(icyAct)[0]))
						.enter().append("rect")
						  .attr("x", function(d) { return icicle.x(d.y); })
						  .attr("y", function(d) { return icicle.y(d.x); })
						  .attr("width", function(d) { return icicle.x(d.dy); })
						  .attr("height", function(d) { return icicle.y(d.dx); })
						  .attr("id", function(d) { return d.key; })
						  .on("click", onClick)
						  .on("dblclick", onDblClick);
						  
						$('svg rect').tipsy({ 
							gravity: 'w', 
							html: true, 
							title: onHover
						});
						
						*/
						
						
						//--------------------------------------------------------------------
						//Main Diff View Stuff


						//Create the main diff view
						update([dates[0], dates[dates.length-1]]);
						
						//--------------------------------------------------------------------
						//Putting text labels on the icicle plot.
						
						icicle.text = icicle.g.append("text")
						  .text(icicleLabel);
						//We need to set the text label twice so that on the second pass we remove labels that don't fit in their boxes.
						//icicle.text.text(icicleLabel);
						icicle.text.text(icicleLabel);
						  
						icicle.text
						  .attr("x", function(d) { return icicle.x(d.y) + (icicle.x(d.y + d.dy) - icicle.x(d.y))/2 - this.getBBox().width/2; })
						  .attr("y", function(d) { return icicle.y(d.x) + (icicle.y(d.x + d.dx) - icicle.y(d.x))/2 + this.getBBox().height/4; })
						  .attr("width", function(d) { return icicle.x(d.y + d.dy) - icicle.x(d.y); })
						  .attr("height", function(d) { return icicle.y(d.x + d.dx) - icicle.y(d.x); })
						  .on("click", onClick)
						  .on("dblclick", onDblClick)
						  .on("mouseover", onMouseOverIcicle)
						  .on("mouseout", onMouseOutIcicle);
						  
						$('svg text').tipsy({ 
							gravity: 'swr', 
							html: true, 
							title: onHoverIcicleTitle
						});
						
						//--------------------------------------------------------------------
						//Handle window resizing
						
						resizeWindow();
						resizeScent();
						$(window).resize(resizeWindow);

						
						

						
						
						//--------------------------------------------------------------------
						//Setting up onScrolling events
						
						$("#main-diff-container").scroll(onScroll);
						$("#icicle-scroll").scroll(onChangeFrame);
						onChangeFrame();
					}
				
				});
			
			}
			
			
		});
	
	}catch(err)
	{
		$("#error-message").css("display","inline");
		$("#spinner").css("display", "none");
		spinner.stop();
	}

}
</script>

</body>
</html>