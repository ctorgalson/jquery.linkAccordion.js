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
 * @version 3.0
 * @author Christopher Torgalson <manager@bedlamhotel.com>
 *
 * @param {object} overrides
 *   Configuration options.
 * @param {string} overrides.closedClass
 *   Class for closed toggle link. Default: <code>toggled-closed</code>.
 * @param {string} overrides.closeText
 *   Text for open state of toggle link. Default: <code>Close</code>.
 * @param {int} overrides.defaultContent
 *   Zero-based index of accordion item to open by default. Uses jQuery's
 *   .eq()/:eq() so that positive integers count from the beginning of the
 *   collection and negative integers count from the end of the collection.
 *   To open NO items by default use an integer larger than the size of the
 *   jQuery collection being operated on. Default: <code>0</code>.
 * @param {string} overrides.headingElement
 *   The heading element to append toggle links to (should be acss selector;
 *   must immediately precede the element to be toggled). Default:
 *   <code>h2</code>.
 * @param {bool} overrides.linkHeadings
 *   Whether to link the headings directly or to insert a toggle link. Default:
 *   <code>false</code>.
 * @param {string} overrides.openedClass
 *   Class for open toggle link/heading. Default: <code>toggled-open</code>.
 * @param {string} overrides.openText
 *   Text for closed state of toggle link/heading. Default: <code>Open</code>.
 * @param {object} overrides.slideToggle
 *   Configuration options for jQuery .slideToggle() function. Default:
 *   <code>slow</code>.
 * @param {string} overrides.toggleLinkClass
 *   Class for toggle link. Default: <code>section-toggle</code>.
 * @param {string} overrides.toggleSectiionClass
 *   Class for div that wraps section content. Default:
 *   <code>accordion-section</code>.
 * @param {bool} overrides.toggleAll
 *   Whether or not to collapse all sections but the currently open one.
 *   Default: <code>true</code>.
 *
 * @example <caption>Sample usage of jQuery linkAccordion plugin.</caption>
 * // Given this markup:
 * //
 * // <div class="accordion">
 * //   <h2>First heading</h2>
 * //   <p>Lorem ipsum dolor sit amet.</p>
 * //   <p>Consectetuer.</p>
 * //   <h2>Second heading</h2>
 * //   <p>Adispiscing elit.</p>
 * // </div>
 * //
 * // The following markup will be created with accordion functionality:
 * //
 * // <div class="accordion">
 * //   <h2>First heading</h2>
 * //     <div class="accordion-section">
 * //     <p>Lorem ipsum dolor sit amet.</p>
 * //     <p>Consectetuer.</p>
 * //   </div>
 * //   <h2>Second heading</h2>
 * //   <div class="accordion-section">
 * //     <p>Adispiscing elit.</p>
 * //   </div>
 * // </div>
 * //
 * // By this javascript:
 * $('.accordion').linkAccordion();
 *
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
      toggleLinkClass: 'section-toggle',
      toggleSectionClass: 'accordion-section',
      toggleAll: true
    };
    var settings = $.extend({}, defaults, overrides);

    return this.each(function(i,e) {
      // Cache the current item, and set up event delegation.
      var $current = $(e);
      // Make a collection of those heading elements.
      var $headings = $current.find(settings.headingElement);
      // Set up an all-purpose click handler.
      var clickHandler = function(e) {
        // Cache the current element, figure out what kind of element this is.
        var $clicked = $(this);
        var $clickedHeading = null;
        var elementType = $clicked.prop('nodeName').toLowerCase();

        // Create a collection that always refers to the current heading (even
        //  when what's just been clicked is a link).
        if (elementType === settings.headingElement.toLowerCase()) {
          $clickedHeading = $clicked;
        }
        else if (elementType === 'a') {
          $clickedHeading = $clicked.parent();

          // Toggle the link text, and don't let the link take us anywhere.
          $clicked.text($clicked.text() === settings.openText ? settings.closeText : settings.openText);
          e.preventDefault();
        }

        // Toggle the class on the heading, slideToggle the contents below it.
        $clickedHeading
          .toggleClass(settings.openedClass + ' ' + settings.closedClass)
          .next()
          .slideToggle(settings.slideToggle);

        // If we're using the jquery ui style toggleAll setting, make sure that
        // everything but the current heading's contents gets slideUp-ed. At
        // the same time, make completely sure that everything but the current
        // heading has its class attribute reset so that it's closed.
        if (settings.toggleAll) {
          $headings.not($clickedHeading)
            .attr({class: settings.closedClass})
            .next()
            .slideUp(settings.slideToggle);
        }
      };

      // Add the click handler to the relevant elements.
      $current.delegate((settings.linkHeadings ? settings.headingElement : settings.toggleLinkClass), 'click', clickHandler);

      // Loop through the headings to set up the markup the way we want it.
      $headings.each(function(i, e) {
        // We need a variable we can refer to to find out if the current item's
        // contents should be visible, and we need to cache the current dom
        // element.
        var visible = (settings.defaultContent === i);
        var $heading = $(e);

        // Add an appropriate class, and wrap the subsequent contents in a div.
        $heading
          .addClass(visible ? settings.openedClass : settings.closedClass)
          .nextUntil(settings.headingElement).wrapAll('<div class="' + settings.toggleSectionClass + '"' + (!visible ? ' style="display: none"' : '') + '/>');

        // If we're using toggle links in the headings, create them and place
        // them.
        if (!settings.linkHeadings) {
          var toggleLink = '<a href="#" class="' + settings.toggleLinkClass + '">' + (visible ? settings.closeText : settings.openText) + '</a>';
          $heading.append(toggleLink);
        }
      });
    });
  };
})(jQuery);
