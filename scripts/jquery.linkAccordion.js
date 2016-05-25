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
 * @version 2.2
 * @author Christopher Torgalson <manager@bedlamhotel.com>
 *
 * @param {object} overrides
 *   Configuration options.
 * @param {string} overrides.closedClass
 *   Class for closed toggle link.
 * @param {string} overrides.closeText
 *   Text for open state of toggle link.
 * @param {int} overrides.defaultContent
 *   Zero-based index of accordion item to open by default. Uses jQuery's
 *   .eq()/:eq() so that positive integers count from the beginning of the
 *   collection and negative integers count from the end of the collection.
 *   To open NO items by default use an integer larger than the size of the
 *   jQuery collection being operated on.
 * @param {string} overrides.headingElement
 *   The heading element to append toggle links to (should be acss selector;
 *   must immediately precede the element to be toggled).
 * @param {bool} overrides.linkHeadings
 *   Whether to link the headings directly or to insert a toggle link.
 * @param {string} overrides.openedClass
 *   Class for open toggle link/heading.
 * @param {string} overrides.openText
 *   Text for closed state of toggle link/heading.
 * @param {object} overrides.slideToggle
 *   Configuration options for jQuery .slideToggle() function.
 * @param {string} overrides.toggleLinkClass
 *   Class for toggle link.
 *
 * @see http://api.jquery.com/slideToggle/
 * @see http://api.jquery.com/eq/
 */
(function($) {
  "use strict";

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
          // Get the headings...
          $headings = $current
            // Get the headings.
            .find(settings.headingElement)
            // Give them all the closed class.
            .addClass(settings.closedClass)
            // Reduce collection to default.
            .eq(settings.defaultContent)
            // Add opened class to this item.
            .addClass(settings.openedClass)
            // Return to full collection.
            .end(),
          // Get the corresponding contents:
          $contents = $headings.next().not(':eq(' + settings.defaultContent + ')').hide().end(),
          // Add click handler.
          clickHandler = function(e) {
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
              if (!settings.linkHeadings) {
                $(this).text(settings.closeText);
              }
            }
            // Otherwise, it must be visible:
            else {
              // This means we can restrict our attention ONLY to the heading
              // and content clicked:
              $heading.removeClass(settings.openedClass).addClass(settings.closedClass);
              $content.slideUp(settings.slideToggle);
              if (!settings.linkHeadings) {
                $(this).text(settings.openText);
              }
            }
            e.preventDefault();
          };
          if (settings.linkHeadings) {
            $headings.click(clickHandler);
          }
          else {
            var $toggleLink = $('<a href="#"/>').addClass(settings.toggleLinkClass);
            $headings.each(function(i,e) {
              var linkText = (i === settings.defaultContent ? settings.closeText : settings.openText);
              $(e).append($toggleLink.clone().click(clickHandler).text(linkText));
            });
          }
    });
  };
})(jQuery);
