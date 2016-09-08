/*
 * Generates Kendo-UI proxies for all Kendo Classes, so that they can simply
 * be require()d and you don't have to bother finding the correct source
 * file where a particular class is defined.
 *
 * This allows for a fine-grained dependency-injected build in CommonJS Style.
 *
 * Primarily targeted at Webpack "builds".
 */

var fs = require("fs");
var path = require("path");
var wrench = require("wrench");


/**
 * The main mapping which contains all necessary information where to find
 * any public Kendo identifier.
 *
 * The list has been hand-crafted and thus may contains errors. Please bear
 * with me..
 *
 * Note: In Kendo source files, some classes are exposed directly using
 * "kendo.xxx" or "window.kendo.xxx" and some are exposed via the "ui.plugin()"
 * function. The latter also exposes the class as a jQuery plugin, but that
 * is irrelevant to this module.
 *
 */
var mapping = {

  "kendo.angular.js" : [
    /* no exports, just sideeffects */
  ],
  "kendo.autocomplete.js" : [
    "kendo.ui.AutoComplete"
  ],
  "kendo.binder.js" : [
    "kendo.unbind",
    "kendo.bind",
    "kendo.data.binders",
    "kendo.data.Binder",
    "kendo.notify"
  ],
  "kendo.button.js" : [
    "kendo.ui.Button"
  ],
  "kendo.calendar.js" : [
    "kendo.ui.Calendar"
  ],
  "kendo.color.js" : [
    "kendo.Color",
    "kendo.parseColor"
  ],
  "kendo.colorpicker.js" : [
    "kendo.ui.ColorPalette",
    "kendo.ui.FlatColorPicker",
    "kendo.ui.ColorPicker"
  ],
  "kendo.combobox.js" : [
    "kendo.ui.ComboBox"
  ],
  "kendo.core.js" : [
    "kendo", // the base namespace
    "kendo.ui",
    "kendo.version"
  ],
  "kendo.data.js" : [
    "kendo.data.DataSource"
  ],
  "kendo.data.odata.js" : [
    "kendo.data.schemas.odata",
    "kendo.data.transports.odata"
  ],
  "kendo.data.signalr.js" : [
    "kendo.data.transports.signalr"
  ],
  "kendo.data.xml.js" : [
    "kendo.data.readers.xml"
  ],
  
  "kendo.grid.js" : [
    "kendo.ui.Grid"
  ],
  
  "kendo.datepicker.js" : [
    "kendo.ui.DatePicker"
  ],
  "kendo.datetimepicker.js" : [
    "kendo.ui.DateTimePicker"
  ],
  "kendo.draganddrop.js" : [
    "kendo.ui.DropTarget",
    "kendo.ui.DropTargetArea",
    "kendo.ui.Draggable",
    "kendo.TapCapture",
    "kendo.ui.Pane",
    "kendo.ui.PaneDimensions",
    "kendo.ui.Movable"
  ],
  "kendo.dropdownlist.js" : [
    "kendo.ui.DropDownList"
  ],
  "kendo.editable.js" : [
    "kendo.ui.Editable"
  ],
  "kendo.fx.js" : [
    "kendo.fx"  // placeholder
  ],
  "kendo.list.js" : [
    "kendo.ui.List",
    "kendo.ui.Select"
  ],
  "kendo.listview.js" : [
    "kendo.ui.ListView"
  ],
  "kendo.maskedtextbox.js" : [
    "kendo.ui.MaskedTextBox"
  ],
  "kendo.menu.js" : [
    "kendo.ui.Menu",
    "kendo.ui.ContextMenu"
  ],
  "kendo.mobile.actionsheet.js" : [
    "kendo.mobile.ui.ActionSheet"
  ],
  "kendo.mobile.application.js" : [
    "kendo.mobile.Application"
  ],
  "kendo.mobile.button.js" : [
    "kendo.mobile.ui.Button",
    "kendo.mobile.ui.BackButton",
    "kendo.mobile.ui.DetailButton"
  ],
  "kendo.mobile.buttongroup.js" : [
    "kendo.mobile.ui.ButtonGroup"
  ],
  "kendo.mobile.drawer.js" : [
    "kendo.mobile.ui.Drawer"
  ],
  "kendo.mobile.listview.js" : [
    "kendo.mobile.ui.ListView"
  ],
  "kendo.mobile.loader.js" : [
    "kendo.mobile.ui.Loader"
  ],
  "kendo.mobile.modalview.js" : [
    "kendo.mobile.ui.ModalView"
  ],
  "kendo.mobile.navbar.js" : [
    "kendo.mobile.ui.NavBar"
  ],
  "kendo.mobile.pane.js" : [
    "kendo.mobile.ui.Pane"
  ],
  "kendo.mobile.popover.js" : [
    "kendo.mobile.ui.Popup",
    "kendo.mobile.ui.PopOver"
  ],
  "kendo.mobile.scroller.js" : [
    "kendo.mobile.ui.Scroller"
  ],
  "kendo.mobile.scrollview.js" : [
    "kendo.mobile.ui.ScrollView"
  ],
  "kendo.mobile.shim.js" : [
    "kendo.mobile.ui.Shim"
  ],
  "kendo.mobile.splitview.js" : [
    "kendo.mobile.ui.SplitView"
  ],
  "kendo.mobile.switch.js" : [
    "kendo.mobile.ui.Switch"
  ],
  "kendo.mobile.tabstrip.js" : [
    "kendo.mobile.ui.TabStrip"
  ],
  "kendo.mobile.view.js" : [
    "kendo.mobile.ui.View",
    "kendo.mobile.ui.Layout"
  ],
  "kendo.multiselect.js" : [
    "kendo.ui.MultiSelect"
  ],
  "kendo.notification.js" : [
    "kendo.ui.Notification"
  ],
  "kendo.numerictextbox.js" : [
    "kendo.ui.NumericTextBox"
  ],
  "kendo.pager.js" : [
    "kendo.ui.Pager"
  ],
  "kendo.panelbar.js" : [
    "kendo.ui.PanelBar"
  ],
  "kendo.popup.js" : [
    "kendo.ui.Popup"
  ],
  "kendo.progressbar.js" : [
    "kendo.ui.ProgressBar"
  ],
  "kendo.resizable.js" : [
    "kendo.ui.Resizable"
  ],
  "kendo.router.js" : [
    "kendo.History",
    "kendo.Router"
  ],
  "kendo.selectable.js" : [
    "kendo.ui.Selectable"
  ],
  "kendo.slider.js" : [
    "kendo.ui.Slider",
    "kendo.ui.RangeSlider"
  ],
  "kendo.sortable.js" : [
    "kendo.ui.Sortable"
  ],
  "kendo.splitter.js" : [
    "kendo.ui.Splitter"
  ],
  "kendo.tabstrip.js" : [
    "kendo.ui.TabStrip"
  ],
  "kendo.timepicker.js" : [
    "kendo.ui.TimePicker"
  ],
  "kendo.toolbar.js" : [
    "kendo.ui.ToolBar"
  ],
  "kendo.tooltip.js" : [
    "kendo.ui.Tooltip"
  ],
  "kendo.touch.js" : [
    "kendo.ui.Touch"
  ],
  "kendo.ui.core.js" : [
    /* This file is just a require-all AMD module. We don't want/need that. */
  ],
  "kendo.userevents.js" : [
    "kendo.UserEvents"
  ],
  "kendo.validator.js" : [
    "kendo.ui.Validator"
  ],
  "kendo.view.js" : [
    "kendo.ViewContainer",
    "kendo.Fragment",
    "kendo.Layout",
    "kendo.View",
    "kendo.ViewClone"
  ],
  "kendo.window.js" : [
    "kendo.ui.Window"
  ]
};



// auto-generate .js files according to mapping
console.log("Writing proxy files...");
var count = 0;

for (var fn in mapping)
  if (mapping.hasOwnProperty(fn)) {

    var objs = mapping[fn];

    objs.forEach(function(obj) {
      var req = JSON.stringify('kendo-ui-core/src/' + fn);

      var oi = obj.split(".");
      if (oi.shift() != "kendo")
        throw new Exception("All exported object must begin with kendo.");

      var code = 'module.exports = require(' + req + ').' + oi.join(".") + ";";

      var out_fn = path.join(__dirname, '..', obj + '.js');

      fs.writeFileSync(out_fn, code, "utf8");

      count++;
    });

  }

console.log("done (" + count + " files written).");

//--

console.log("Copying styles...");

var base_from = path.join(
  path.dirname(require.resolve("kendo-ui-core/package.json")),
  "dist/styles");
var base_to = path.join(__dirname, "../styles");

wrench.copyDirSyncRecursive(base_from, base_to, {
  excludeHiddenUnix : false,
  preserveFiles : false,
  preserveTimestamps : true,
  inflateSymlinks : false
});
