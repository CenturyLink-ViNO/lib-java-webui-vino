/*global jscolor*/
/*global Highcharts */
/*global sprintf */
/*globals jQuery */
/*globals jsInclude */

if (typeof jQuery === 'undefined') // should we also check versions?
{
   jsInclude('lib/abacus-ots/jQuery/jquery-1.9.1.js');
   jsInclude('lib/abacus-ots/jQuery/jquery-migrate-1.1.1.js');
}

if (typeof jQuery.alerts === 'undefined')
{
   jsInclude('lib/abacus-ots/jquery.alerts-1.1/jquery.alerts.js');
}

if (typeof jQuery.blockUI === 'undefined')
{
   jsInclude('lib/abacus-ots/jQuery/jquery.blockUI.js');
}

if (typeof jQuery.base64 === 'undefined')
{
   jsInclude('lib/abacus-ots/jQuery/jquery.base64.js');
}

if (typeof jQuery.ui === 'undefined') // should we also check versions?
{
   jsInclude('lib/abacus-ots/jQuery/jquery-ui-1.9.2.custom.js');
}

if (typeof jQuery.cookie === 'undefined')
{
   jsInclude('lib/abacus-ots/jQuery/jcookie.js');
}

if (typeof jQuery.timer === 'undefined')
{
   jsInclude('lib/abacus-ots/jQuery/jquery.timer.js');
}

if (typeof jscolor === 'undefined')
{
   jsInclude('lib/abacus-ots/JScolor/jscolor.js');
}

// if ( $.browser.msie )
// {
//    jsInclude('lib/abacus-ots/excanvas.compiled.js');
// }

if (typeof Highcharts === 'undefined')
{
   jsInclude('lib/abacus-ots/highCharts/highcharts.js');
}

if (typeof sprintf === 'undefined')
{
   //http://www.diveintojavascript.com/projects/javascript-sprintf
   jsInclude('lib/abacus-ots/sprintf/sprintf-0.7-beta1.js');
}

if (typeof jQuery.DataTable === 'undefined')
{
   // http://datatables.net/
   jsInclude('lib/abacus-ots/dataTables/1.9.0/media/js/jquery.dataTables.js');
}

if (typeof jQuery.htmlbox === 'undefined')
{
   jsInclude('lib/abacus-ots/HtmlBox_4.0.3/htmlbox.min.js');
}

// if (typeof(jQuery.QUnit) === 'undefined')
// {
//    jsInclude('lib/abacus-ots/qunit/qunit-1.13.0.js');
// }

if (typeof jQuery.validate === 'undefined')
{
   jsInclude('lib/abacus-ots/jquery-validation-1.9.0/jquery.validate.js');
   // jsInclude('lib/abacus-ots/jquery-validation-1.9.0/additional-methods.js');
}

if (typeof jQuery.editable === 'undefined')
{
   // http://www.appelsiini.net/projects/jeditable
   jsInclude('lib/abacus-ots/jQuery/jquery.jeditable.js');
}

if (typeof jQuery.h5 === 'undefined')
{
   // http://ericleads.com/h5validate/
   jsInclude('lib/abacus-ots/h5Validate-master/jquery.h5validate.js');
}

if (typeof jQuery.ui.progressbarVertical === 'undefined')
{
   jsInclude('lib/abacus-ots/jQuery/ui.progressbarVertical_1.0.0.js');
}
