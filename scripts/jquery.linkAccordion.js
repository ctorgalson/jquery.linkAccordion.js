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
 * @version 1.2
 * @author Christopher Torgalson <manager@bedlamhotel.com>
 * @param object overrides Configuration options:
 *
 * -- closedClass: (string) Class for closed toggle link
 * -- closeText: (string) Text for open state of toggle link
 * -- headingElement: (string [css selector]) The heading element to append
 *    toggle links to (must
 *    immediately precede the element to be toggled
 * -- linkHeadings: (bool) Whether to link the headings directly or to insert a
 *    toggle link
 * -- openedClass: (string) Class for open toggle link/heading
 * -- openText: (string) Text for closed state of toggle link/heading
 * -- slideToggle: (object) configuration options for jQuery .slideToggle()
 *    function
 * -- toggleLinkClass: (string) Class for toggle link
 *
 * @see http://api.jquery.com/slideToggle/
 */
(function($) {
  $.fn.linkAccordion = function(overrides) {
    var $current = $(this),
        defaults = {  // Set default values...
          closedClass: 'toggled-closed',
          closeText: 'Close',
          headingElement: 'h2',
          linkHeadings: false,
          openedClass: 'toggled-open',
          openText: 'Open',
          slideToggle: 'slow',
          toggleLinkClass: 'section-toggle'
        },
        // Apply overrides to options array, store them:
        settings = $.extend({}, defaults, overrides),
        // Store the heading collection, give it closed class by default:
        $headings = $current.find(settings.headingElement).addClass(settings.closedClass),
        // Store the content collection, close them all by default:
        $contents = $current.find(settings.headingElement).next().not(settings.headingElement).hide();
    // Loop through the headings:
    return $headings.each(function callback(i,e) {
      var $heading = $(e),
          $content = $heading.next();
      // We needn't do anything unless there's content associated with this
      // heading (i.e. if the next element is not the same kind as this one, and
      // if there IS a next element)...
      if (!$heading.next().is(settings.headingElement) && $heading.next().length > 0) {
        // If we're setting up to make the whole heading clickable:
        if (settings.linkHeadings === true) {
          // Build the onclick behaviour on the current heading:
          $heading.click(function(e){
            // If the current content is hidden:
            if ($content.is(':hidden')) {
              // Set the heading's status to show it's open:
              $heading.removeClass(settings.closedClass).addClass(settings.openedClass);
              // Hide all the other contents:
              $contents.not($content).slideUp(settings.slideToggle);
              // Change the class attribute on the other headings:
              $headings.not($heading)
                .removeClass(settings.openedClass)
                .addClass(settings.closedClass);
            }
            else {
              // Set the heading's status to show it's closed:
              $heading.removeClass(settings.openedClass).addClass(settings.closedClass);
            }
            // The current content always needs toggling:
            $content.slideToggle(settings.slideToggle);
            // Don't follow the link:
            e.preventDefault();
          });
        }
        // But if we plan to use a toggle link inside, but not surrounding the
        // content of the heading:
        else {
          // Build the toggle link, define text, default attributes:
          var $toggleLink = $('<a href="#" />')
            .text(settings.openText)
            .addClass(settings.toggleLinkClass + ' ' + settings.closedClass)
            // Build the onclick behaviour of the toggle link:
            .click(function(e){
              var $link = $(this);
              // If the current toggle link is closed and gets clicked:
              if ($content.is(':hidden')) {
                // We need to switch the text and relevant classes because the
                // following 'slideToggle()' will expand it:
                $link
                  .text(settings.closeText)
                  .removeClass(settings.closedClass)
                  .addClass(settings.openedClass);
                // We also need to close any other content elements already
                // open:
                $contents.not($content)
                .hide(settings.speed);
                // Finally, we need to alter the class and text on any other
                // already open toggle links:
                $headings.not($heading)
                  .find('.' + settings.toggleLinkClass)
                  .text(settings.openText)
                  .removeClass(settings.openedClass)
                  .addClass(settings.closedClass);
              }
              // But if the link just clicked was already open:
              else {
                // We just need to change the text and classes:
                $link
                  .text(settings.openText)
                  .removeClass(settings.openedClass)
                  .addClass(settings.closedClass);
              }
              // We ALWAYS need to toggle the content that goes with this
              // heading:
              $content.slideToggle(settings.slideToggle);
              // Don't follow the link:
              e.preventDefault();
            });
          // Finally, append the toggle link to the current heading...
          $heading.append($toggleLink);
        }
      }
    });
  };
})(jQuery); /* jquery.linkAccordion.js */
