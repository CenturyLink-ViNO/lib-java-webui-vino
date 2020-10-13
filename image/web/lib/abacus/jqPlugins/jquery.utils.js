/*globals jQuery */
/*globals jsInclude */

// jsInclude('/lib/abacus/jqPlugins/jquery.forceNumeric.js');


if (typeof jQuery.fn.forceNumeric === 'undefined')
{
   jsInclude('lib/abacus/jqPlugins/jquery.forceNumeric.js');
}

function jqUtils()
{
   /* nothing -- this class is all 'static' members */
}

jqUtils.lineBreak = function()
{
   return jQuery('<br/>');
};

jqUtils.enableControl = function(control)
{
   control.removeAttr('disabled');
};

jqUtils.disableControl = function(control)
{
   control.prop('disabled', 'disabled');
};

jqUtils.textEdit = function()
{
   return jQuery('<input/>').prop('type', 'text');
};

jqUtils.numericEdit = function()
{
   var ret = jQuery('<input/>').prop('type', 'text');
   ret.forceNumeric();
   return ret;
};

jqUtils.button = function(label, id)
{
   var theButton = jQuery('<button/>');
   if (label !== undefined && label !== '')
   {
      theButton.text(label);
   }
   if (id !== undefined && id !== '')
   {
      theButton.prop('id', id);
   }
   theButton.button();
   return theButton;
};

jqUtils.checkbox = function()
{
   return jQuery('<input/>').prop('type', 'checkbox');
};

jqUtils.colorInput = function()
{
   return jQuery('<input/>').prop('size', '6').prop('maxlength', '6');
};

jqUtils.div = function(id, parent)
{
   var div = jQuery('<div/>');
   if (id !== undefined && id !== '')
   {
      div.prop('id', id);
   }
   if (parent !== undefined)
   {
      parent.append(div);
   }
   return div;
};

jqUtils.fieldset = function(settings)
{
   var defaultSettings =
   {
      legend: '',
      legendStyle: '',
      style: ''
   };
   var mySettings = jQuery.extend(defaultSettings, settings);

   var fieldset = jQuery('<fieldset/>');
   var legend = jQuery('<legend/>').text(mySettings.legend);
   fieldset.append(legend);
   legend.addClass(mySettings.legendStyle);
   fieldset.addClass(mySettings.style);
   if (settings.content !== undefined)
   {
      fieldset.append(settings.content);
   }
   return fieldset;
};

jqUtils.span = function(className)
{
   var span = jQuery('<span/>');
   if (className !== undefined)
   {
      span.addClass(className);
   }
   return span;
};

jqUtils.table = function(className)
{
   var element = jQuery('<table/>');
   if (className !== undefined)
   {
      element.addClass(className);
   }
   return element;
};

jqUtils.tableBody = function(className)
{
   var element = jQuery('<tbody/>');
   if (className !== undefined)
   {
      element.addClass(className);
   }
   return element;
};
jqUtils.tableHeader = function(className)
{
   var element = jQuery('<thead/>');
   if (className !== undefined)
   {
      element.addClass(className);
   }
   return element;
};

jqUtils.tableRow = function(className)
{
   var element = jQuery('<tr/>');
   if (className !== undefined)
   {
      element.addClass(className);
   }
   return element;
};

jqUtils.tableCell = function(className)
{
   var element = jQuery('<td/>');
   if (className !== undefined)
   {
      element.addClass(className);
   }
   return element;
};

jqUtils.styledTextDiv = function(text, style)
{
   var span = jQuery('<span/>').append(text);
   return jqUtils.div().addClass(style).append(span);
};

jqUtils.message = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg');
};

jqUtils.infoMessage = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg-info');
};

jqUtils.helpMessage = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg-help');
};

jqUtils.progressMessage = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg-progress');
};

jqUtils.errorMessage = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg-error');
};

jqUtils.alertMessage = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg-alert');
};

jqUtils.successMessage = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg-success');
};

jqUtils.statusMessage = function(text)
{
   return jqUtils.styledTextDiv(text, 'portlet-msg-status');
};

jqUtils.addStyleSheet = function(href)
{
   jQuery('head').append(jQuery('<link/>').attr('rel', 'stylesheet').attr('type', 'text/css').attr('href', href));
};

jqUtils.loadCachedScript = function(url, options)
{
   options = jQuery.extend(options || {}, { dataType: 'script', cache: true, url: url, async: false });
   return jQuery.ajax(options);
};
