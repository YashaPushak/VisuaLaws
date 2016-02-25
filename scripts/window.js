function resizeWindow() {
	
	
	//spinner.spin();
	
	var windowHeight = $("html").height();
	var titleHeight = $("#title-div").height();
	
	var mainHeight = windowHeight - titleHeight;
	
	$("#main-diff-container").height(mainHeight);
	$("#main-diff-container").css("top", titleHeight);	
	$("#slider-div").height(mainHeight);
	$("#slider-div").css("top", titleHeight);	
	$("#icicle-div").height(mainHeight);
	$("#icicle-div").css("top", titleHeight);
	
	
	resizeSlider();
	resizeIcicle();
	
	var windowWidth = $("body").width();
	
	var sliderWidth = $("#legend-div").width();
	var icicleWidth = $("#logo-div").width();
	var mainWidth = windowWidth - sliderWidth - icicleWidth;

	$("#main-diff-container").width(mainWidth);
	$("#title-div").width(mainWidth);
	
	resizeScent();
	
	
	//$("#spinner").css("display", "none");
	//$("#spinner").css("z-index", 0);
	//spinner.stop();
}