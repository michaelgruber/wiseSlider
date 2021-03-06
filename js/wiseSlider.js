(function($) {

  var WiseSlider = function(set, options){

    var slider      = $(this); // The entire wiseSlider object

    var view        = set.children("div#view"); // The visible area
    var slide       = view.children("ul"); // The list of elements
    var leftArrow   = set.children("a.arrow.left"); // Slide left arrow
    var rightArrow  = set.children("a.arrow.right"); // Slide right arrow
    var elem        = slide.children("li:first"); // A single element
    var last        = slide.children("li:last"); // Another (non-first) element
    var count       = slide.children("li").length; // The number of elements
    var elementSize = parseInt(elem.width()); // The width of the first element
    var lastSize    = parseInt(last.width()); // The width of the first element
    var inProgress  = false; // Semaphore for slide animation
    var width; // Width of the entire set of elements.
    var margin; // Difference in size between first and last element. Should be padding/margin/border width

    /* Ensures that a slide is not attempted during animation */
    this.shouldMove = function(arrow) {

      if (!inProgress)
        move(arrow);
    }

    /* Moves the slider */
    var move = function(arrow) {
      inProgress = true; // Lock
      var left   = options.distance * elementSize; // The new location of the sliders left edge.

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
        arrowView();
      });
    }

    /* Checks whether arrows should be displayed or hidden */
    var arrowView = function() {
      var left = parseInt(slide.css("left")); // Gets current left location of slider

      (left < 0) ? leftArrow.show() : leftArrow.hide();
      (-left + (elem.width() * (options.columns + 1)) < width) ? rightArrow.show() : rightArrow.hide();
    }


    // ON INSTANTIATION
    elementSize += parseInt(elem.css("margin-left"))
                 + parseInt(elem.css("margin-right"))
                 + parseInt(elem.css("padding-left"))
                 + parseInt(elem.css("padding-right"))
                 + parseInt(elem.css("border-left-width"))
                 + parseInt(elem.css("border-right-width"));

    lastSize    += parseInt(last.css("margin-left"))
                 + parseInt(last.css("margin-right"))
                 + parseInt(last.css("padding-left"))
                 + parseInt(last.css("padding-right"))
                 + parseInt(last.css("border-left-width"))
                 + parseInt(last.css("border-right-width"));

    // Check if the two selected elements differ in size
    if ((margin = lastSize - elementSize) != 0) {
      elementSize = lastSize;
    }

    // Resize the view
    view.width((options.columns * elementSize) - margin);

    // Resize the slider
    if (count > (options.columns * options.rows)) {

      width = ((Math.ceil(count / options.rows)) * elementSize) - margin;
      slide.width(width);

      // Show the right arrow
      rightArrow.show();
    }
  };

  $.fn.wiseSlider = function(options) {

    var defaults = {
      columns: 4, // Number of topic columns
      rows: 2, // Number of topic rows
      distance: 1 // The distance in elements the slider should slide
    }

    var options = $.extend(defaults, options);

    var wiseSlider = new WiseSlider(this, options);

    /* On arrow click check to see if shouldSlide */
    this.children("a.arrow").bind('click', function(e){
      e.preventDefault();
      wiseSlider.shouldMove($(this));
    });

    return wiseSlider;
  };
})(jQuery);
