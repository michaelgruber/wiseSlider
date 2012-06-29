(function($) {

	var WiseSlider = function(options){

		var slider      = $(this); // The entire wiseSlider object
		var view		= $("div#wiseSlider div#view"); // The visible area
		var slide 		= $("div#wiseSlider div#view ul"); // The list of elements
		var leftArrow   = $("div#wiseSlider a.arrow.left"); // Slide left arrow
		var rightArrow  = $("div#wiseSlider a.arrow.right"); // Slide right arrow
		var elem        = $("div#wiseSlider div#view ul li:first"); // A single element
		var count       = $("div#wiseSlider div#view ul li").length; // The number of elements
		var elementSize = parseInt(elem.width()); // The width of a single element
		var inProgress  = false; // Semaphore for slide animation
		var width;

		elementSize += parseInt(elem.css("margin-left")) + parseInt(elem.css("margin-right"));

		// Resize the view
		view.width(options.columns * elementSize);

		// Resize the slider
		if (count > (options.columns * options.rows)) {
			width = (Math.ceil(count / options.rows)) * elementSize;
			$("div#wiseSlider div#view ul").width(width);

			// Show the right arrow
			$("div#wiseSlider a.arrow.right").show();
		}

		/* Ensures that a slide is not attempted during animation */
		this.shouldMove = function(arrow) {

			if (!inProgress)
				move(arrow);
		}

		/* Moves the slider */
		var move = function(arrow) {
			inProgress     = true; // Lock
			var left       = options.distance * elementSize; // The new location of the sliders left edge.

			// Determines whether to slide left or right
			if (arrow.hasClass("right"))
				left = -left;

			// Get the new left position
			left = parseInt(slide.css("left")) + left;

			// Animate to new position
			slide.animate({
				"left": left 
			}, function() { // Callback
				inProgress = false; // Animation over. Unlock
			});

			// Checks whether arrows should be displayed or hidden
			(left < 0) ? leftArrow.show() : leftArrow.hide();
			(-left + (elementSize * (options.columns + 1)) <= width) ? rightArrow.show() : rightArrow.hide();
		}
	};

	$.fn.wiseSlider = function(options) {

		var defaults = {
			columns : 4, // Number of topic columns
			rows : 2, // Number of topic rows
			distance: 1 // The distance in elements the slider should slide
		}
		
		var options = $.extend(defaults, options);

		var wiseSlider = new WiseSlider(options);

		/* On arrow click check to see if shouldSlide */
		$("div#wiseSlider a.arrow").bind('click', function(e){
			e.preventDefault();
			wiseSlider.shouldMove($(this));
		});

		return wiseSlider;
	};
})(jQuery);