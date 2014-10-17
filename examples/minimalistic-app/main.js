// =============================================================================
// Global configuration.
// This section is generic for the (single page) whole application. You have
// to do this only once.

// Load Kendo CSS styles. These are automatically loaded into the HTML page
// by Webpack.
require("kendo/styles/web/kendo.common.core.css");
require("kendo/styles/web/kendo.default.css");

// Enable Kendo transition effects.
require("kendo/kendo.fx"); // optional



// =============================================================================
// Kendo widget demo

// Kendo is based on jQuery, so requie()ing it here doesn't increase code
// size and we can use jQuery for our stuff as well.
$ = require("jquery");

$(function() {

  // Initialize a calendar using jQuery plugin-style:
  require("kendo/kendo.ui.Calendar");
  $("#calendar1").kendoCalendar();


  // Alternatively, this is the "markup" method:
  var kendoCalendar = require("kendo/kendo.ui.Calendar");
  var cal = new kendoCalendar($("#calendar2"));

});
