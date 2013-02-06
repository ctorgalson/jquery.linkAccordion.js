/**
 * jQuery Link Accordion Plugin
 *
 * A jQuery plugin similar to the jQuery UI accordion plugin but which works
 * even when the heading element is a link. The plugin appends a new 'toggle
 * link' to the heading element. That link, when clicked, toggles the element
 * immediately  the heading. Any already-opened toggle section is closed when
 * this current one opens, and open/close text in the toggle links is adjusted
 * accordingly.
 *
 * @version 2.0
 * @author Christopher Torgalson <manager@bedlamhotel.com>
 * @param object overrides Configuration options:
 *
 * -- closedClass: (string) Class for closed toggle link
 * -- closeText: (string) Text for open state of toggle link
 * -- defaultContent: (int) [zero-based] index of accordion item to open
 *    by default. Uses jQuery's .eq()/:eq() so that positive integers count from
 *    the beginning of the collection and negative integers count from the end
 *    of the collection. To open NO items by default use an integer larger than
 *    the size of the jQuery collection being operated on.
 * -- headingElement: (string [css selector]) The heading element to append
 *    toggle links to (must immediately precede the element to be toggled
 * -- linkHeadings: (bool) Whether to link the headings directly or to insert a
 *    toggle link
 * -- openedClass: (string) Class for open toggle link/heading
 * -- openText: (string) Text for closed state of toggle link/heading
 * -- slideToggle: (object) configuration options for jQuery .slideToggle()
 *    function
 * -- toggleLinkClass: (string) Class for toggle link
 *
 * @see http://api.jquery.com/slideToggle/
 * @see http://api.jquery.com/eq/
 */
(function($) {
  $.fn.linkAccordion = function(overrides) {
    var defaults = {
        closedClass: 'toggled-closed',
        closeText: 'Close',
        defaultContent: 0,
        headingElement: 'h2',
        linkHeadings: false,
        openedClass: 'toggled-open',
        openText: 'Open',
        slideToggle: 'slow',
        toggleLinkClass: 'section-toggle'
      },
      settings = $.extend({}, defaults, overrides);
    return this.each(function(i,e) {
      var $current = $(e),
          $headings = $current
            .find(settings.headingElement) // Get the headings...
            .eq(settings.defaultContent) // Reduce collection to default...
            .addClass(settings.openedClass) // Add opened class...
            .end(), // Return to full collection...
          // Get the corresponding contents:
          $contents = $headings.next().not(':eq(' + settings.defaultContent + ')').hide().end(),
          clickHandler = function(e) { // Add click handler...
            // We don't know, in this context, what element the click handler
            // will be attached to. This means to that to determin the heading,
            // we need to test the kind of element that's just been clicked each
            // time the click event occurs:
            var $heading = $(this).is(settings.headingElement) ? $(this) : $(this).parent(),
                $otherHeadings = $headings.not($heading),
                $content = $heading.next(),
                $otherContents = $contents.not($content);
            // If content corresponding to current heading is hidden:
            if ($content.is(':hidden')) {
              $heading.removeClass(settings.closedClass).addClass(settings.openedClass);
              $otherHeadings.removeClass(settings.openedClass).addClass(settings.closedClass);
              $content.slideDown(settings.slideToggle);
              $otherContents.slideUp(settings.slideToggle);
            }
            // Otherwise, it must be visible:
            else {
              $heading.removeClass(settings.openedClass).addClass(settings.closedClass);
              $otherHeadings.removeClass(settings.closedClass).addClass(settings.openedClass);
              $content.slideUp(settings.slideToggle);
            }
            e.preventDefault();
          };
          //
          if (settings.linkHeadings) {
            $headings.click(clickHandler);
          }
          else {
            var $toggleLink = $('<a href="#"/>').addClass(settings.toggleLinkClass).text(settings.openText);
            $headings.each(function(i,e) {
              $(e).append($toggleLink.clone().click(clickHandler));
            });
          }
    });
  };
})(jQuery);