/*globals jQuery*/
/*globals window*/
/*globals storageModule*/
/*globals ace*/
/*globals Option*/
/* exported FormBuilder */
function FormBuilder(dataObject, dataTable)
{
   this.dataObject = null;
   this.dataTable = null;
   this.selPrms = [];
   this.hasSelects = false;
   this.hasValidators = false;
   this.ctor = function(dataObject, dataTable)
   {
      this.dataObject = dataObject;
      this.dataTable = dataTable;
      return this;
   };
   this.buildForm = function(idString)
   {
      return this.buildFormInObj(jQuery(idString));
   };
   this.buildFormInObj = function(panel, horiz)
   {
      var outer = this;
      var def = jQuery.Deferred(function(deferred)
      {
         var dataObject = outer.dataObject;
         var dataTable = outer.dataTable;
         var fmt;
         var form;
         var item;
         var formGroup;
         if (dataObject.hasOwnProperty('format'))
         {
            form = jQuery('<form>').attr('role', 'form');
            if (horiz)
            {
               form.addClass('form-horizontal');
            }
            fmt = dataObject.format;
            for (item in fmt)
            {
               if (fmt.hasOwnProperty(item) && item !== 'submitFunction' && item !== 'showCancel' &&
                   item !== 'popoverStringsFile' && item !== 'popoverPlacement' && item !== 'additionalButtons')
               {
                  if (fmt[item].type === 'radio')
                  {
                     formGroup = outer.makeRadio(fmt[item], panel);
                     form.append(formGroup);
                  }
                  else if (fmt[item].type === 'select')
                  {
                     outer.hasSelects = true;
                     formGroup = outer.makeSelect(fmt[item]);
                     form.append(formGroup);
                  }
                  else if (fmt[item].type === 'section')
                  {
                     formGroup = outer.makeSection(fmt[item], form, panel);
                  }
                  else if (fmt[item].type === 'cron')
                  {
                     formGroup = outer.makeCron(fmt[item], form);
                     form.append(formGroup);
                  }
                  else if (fmt[item].type === 'dynamicSection')
                  {
                     formGroup = outer.makeDynamicSection(fmt[item], form);
                     form.append(formGroup);
                  }
                  else if (fmt[item].type === 'info')
                  {
                     formGroup = outer.makeInfoItem(fmt[item]);
                     form.append(formGroup);
                  }
                  else if (fmt[item].type === 'code')
                  {
                     formGroup = outer.makeCodeEditor(fmt[item], this.promise());
                     form.append(formGroup);
                  }
                  else if (fmt[item].type === 'textarea')
                  {
                     formGroup = outer.makeTextarea(fmt[item]);
                     form.append(formGroup);
                  }
                  else
                  {
                     formGroup = outer.makeGenericInput(fmt[item]);
                     form.append(formGroup);
                  }
               }
            }
            var addedButtons = false;
            formGroup = jQuery('<div>').
               addClass('form-group').
               css('text-align', 'right');
            if (dataObject.format.hasOwnProperty('additionalButtons'))
            {
               var oneButton;
               for (oneButton in dataObject.format.additionalButtons)
               {
                  if (dataObject.format.additionalButtons.hasOwnProperty(oneButton))
                  {
                     if (dataObject.format.additionalButtons[oneButton].hasOwnProperty('label') &&
                         dataObject.format.additionalButtons[oneButton].hasOwnProperty('extraClasses') &&
                         dataObject.format.additionalButtons[oneButton].hasOwnProperty('id'))
                     {
                        var thisButton = dataObject.format.additionalButtons[oneButton];
                        formGroup.append(jQuery('<button>').
                           text(thisButton.label).
                           addClass('btn').addClass(thisButton.extraClasses).
                           css('margin-right', '5px').
                           attr('id', thisButton.id).
                           attr('data-dismiss', 'modal'));
                        addedButtons = true;
                     }
                  }
               }
            }
            if (dataObject.format.hasOwnProperty('showCancel') && dataObject.format.showCancel === true)
            {
               formGroup.append(jQuery('<button>').
                  text('Cancel').
                  addClass('btn btn-primary').
                  css('margin-right', '5px').
                  attr('data-dismiss', 'modal'));
               addedButtons = true;
            }
            if (dataObject.format.hasOwnProperty('submitFunction'))
            {
               formGroup.append(jQuery('<button>').
                  attr('data-loading-text', 'Applying Configuration...').
                  css('margin-right', '5px').
                  addClass('btn btn-success').
                  attr('type', 'submit').
                  text('Apply').
                  on('click', function(e)
                  {
                     var btn = jQuery(this);
                     e.preventDefault();
                     jQuery('body').removeClass('modal-open');
                     var fn = dataObject.format.submitFunction(dataObject, dataTable);
                     fn(btn);
                  }));
               addedButtons = true;
            }
            if (addedButtons === true)
            {
               form.append(formGroup);
            }
         }
         panel.append(form);
         jQuery('form:last', panel).
            bootstrapValidator({
               feedbackIcons:
                {
                   required: 'glyphicon glyphicon-asterisk',
                   valid: 'glyphicon glyphicon-ok',
                   invalid: 'glyphicon glyphicon-remove',
                   validating: 'glyphicon glyphicon-refresh'
                },
               submitButtons: 'button.btn-success',
               container: 'tooltip',
               threshold: 0,
               excluded: [':disabled',
                  ':hidden',
                  ':not(:visible)',
                  function($field)
                  {
                     var ret = false;
                     if (!$field.is(':visible') || !$field.parent().is(':visible'))
                     {
                        ret = true;
                     }
                     return ret;
                  }],
               live: 'enabled'
            });
         if (outer.hasValidators)
         {
            window.setTimeout(function()
            {
               var validator = jQuery('form:last', panel).
                  data('bootstrapValidator');
               if (validator !== null && validator !== undefined)
               {
                  validator.validate();
               }
            }, 2500);
         }
         form.on('status.field.bv', function()
         {
            var formIsValid = true;
            jQuery('.form-group', jQuery(this)).each(function()
            {
               formIsValid = formIsValid && !jQuery(this).hasClass('has-error');
            });
            if (formIsValid)
            {
               jQuery('button.btn-success', jQuery(this)).attr('disabled', false);
            }
            else
            {
               jQuery('button.btn-success', jQuery(this)).attr('disabled', true);
            }
         });
         if (fmt.hasOwnProperty('popoverStringsFile'))
         {
            var def2 = jQuery.Deferred(function(deferred)
            {
               var session = storageModule.getItem('abacus.session');
               var remoteHost = window.location.protocol + '//' + window.location.host;
               var url = remoteHost + fmt.popoverStringsFile;
               jQuery.ajax({
                  type: 'GET',
                  url: url,
                  data: { token: session.token },
                  dataType: 'json',
                  success: function(json)
                  {
                     var placement = 'right';
                     if (fmt.hasOwnProperty('popoverPlacement'))
                     {
                        placement = fmt.popoverPlacement;
                     }
                     outer.addPopoverFromJson(json, form, placement);
                     deferred.resolve();
                  },
                  error: function()
                  {
                     /// do something on error
                     deferred.resolve();
                  }
               });
            });
            outer.selPrms.push(def2.promise());
         }
         if (outer.hasSelects)
         {
            jQuery.when.apply(jQuery, outer.selPrms).then(function()
            {
               deferred.resolve();
            });
         }
         else
         {
            deferred.resolve();
         }
      });
      return def.promise();
   };
   this.makeInfoItem = function(item)
   {
      var formGroup = jQuery('<div>').
         addClass('form-group').
         addClass(item.id).
         css('clear', 'both');
      var value = dataObject[item.id];
      if (item.hasOwnProperty('formatter'))
      {
         value = item.formatter(value);
      }
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }

      var clsLabel = jQuery('<label>').addClass('control-label').attr('for', item.id).text(item.label);
      if (item.isInline === true)
      {
         if (item.hasOwnProperty('labelColumns'))
         {
            clsLabel.addClass(item.labelColumns);
         }
         else
         {
            clsLabel.addClass('col-md-4');
         }
         formGroup.append(clsLabel);
         var clsInput;
         if (item.useTextArea === true)
         {
            clsInput = jQuery('<textarea>').
               attr('id', item.id).
               attr('name', item.id).
               addClass('form-control').
               attr('disabled', true).
               val(value);
         }
         else
         {
            clsInput = jQuery('<span>').
               attr('id', item.id).
               attr('name', item.id).
               addClass('form-control').
               css('overflow-x', 'hidden');
            if (item.hasOwnProperty('render'))
            {
               var val = item.render(value);
               clsInput.html(val);
            }
            else
            {
               clsInput.html('&nbsp;' + value);
            }
         }

         var clsDiv = jQuery('<div>');
         if (item.hasOwnProperty('valueColumns'))
         {
            clsDiv.addClass(item.valueColumns);
         }
         else
         {
            clsDiv.addClass('col-md-8');
         }
         clsDiv.append(clsInput);
         formGroup.append(clsDiv);
      }
      else
      {
         formGroup.append(clsLabel);

         if (item.useTextArea === true)
         {
            formGroup.append(jQuery('<textarea>').
               attr('id', item.id).
               addClass('form-control').
               attr('disabled', true).
               val(value));
         }
         else
         {
            formGroup.append(jQuery('<span>').
               attr('id', item.id).
               addClass('form-control').
               css('overflow-x', 'hidden').
               html('&nbsp;' + value));
         }
      }
      var input = jQuery('#' + item.id, formGroup);
      if (item.hasOwnProperty('popover'))
      {
         input.popover(item.popover);
      }
      if (item.hasOwnProperty('handlers'))
      {
         var handler;
         for (handler in item.handlers)
         {
            if (item.handlers.hasOwnProperty(handler))
            {
               input.on(handler, item.handlers[handler]);
            }
         }
      }
      return formGroup;
   };
   this.makeCodeEditor = function(item, deferredObject)
   {
      var formGroup = jQuery('<div>').
         addClass('form-group').
         addClass(item.id).
         css('clear', 'both');
      var value = dataObject[item.id];
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }
      formGroup.append(jQuery('<label>').
         attr('for', item.id).
         text(item.label));
      formGroup.append(jQuery('<div>').
         attr('id', item.id).
         addClass('form-control').
         css('height', '275px').
         text(value));
      jQuery.when(deferredObject.done(function()
      {
         // Need to set up the editor after the container is on the dom
         ace.config.set('basePath', 'lib/abacus-ots/ace/src-min');
         var editor = ace.edit(item.id);
         editor.$blockScrolling = 'Infinity';
         if (item.hasOwnProperty('theme'))
         {
            editor.setTheme(item.theme);
         }
         if (item.hasOwnProperty('mode'))
         {
            editor.getSession().setMode(item.mode);
         }
         if (item.hasOwnProperty('options'))
         {
            ace.config.loadModule('ace/ext/language_tools', function()
            {
               item.options.fontSize = '1.2em';
               editor.setOptions(item.options);
            });
         }
      }));
      return formGroup;
   };
   this.makeTextarea = function(item)
   {
      var formGroup = jQuery('<div>').
         addClass('form-group').
         addClass(item.id).
         css('clear', 'both');
      var value = dataObject[item.id];
      if (value === null)
      {
         value = '';
      }
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }
      var clsLabel = jQuery('<label>').addClass('control-label').attr('for', item.id).text(item.label);
      if (item.isInline === true)
      {
         if (item.hasOwnProperty('labelColumns'))
         {
            clsLabel.addClass(item.labelColumns);
         }
         else
         {
            clsLabel.addClass('col-md-4');
         }
      }
      formGroup.append(clsLabel);
      var clsInput = jQuery('<textarea>').
         attr('id', item.id).
         attr('name', item.id).
         attr('type', item.type).
         addClass('form-control').
         css('height', '175px').
         css('width', '100%').
         text(value);
      if (item.isInline)
      {
         var clsDiv = jQuery('<div>');
         if (item.hasOwnProperty('valueColumns'))
         {
            clsDiv.addClass(item.valueColumns);
         }
         else
         {
            clsDiv.addClass('col-md-8');
         }
         clsDiv.append(clsInput);
         formGroup.append(clsDiv);
      }
      else
      {
         formGroup.append(clsInput);
      }
      if (item.type === 'hidden')
      {
         formGroup.hide();
      }
      var input = jQuery('#' + item.id, formGroup);
      if (item.hasOwnProperty('popover'))
      {
         input.popover(item.popover);
      }
      return formGroup;
   };
   this.makeSection = function(item, form, panel)
   {
      var formGroup = jQuery('<div>').
         addClass('form-group').
         addClass(item.id).
         css('clear', 'both');
      var outer = this;
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }
      if (item.hasOwnProperty('collapsible') && item.collapsible === true)
      {
         formGroup.append(jQuery('<label>').
            append(jQuery('<a/>').
               on('click', function()
               {
                  var hidden = jQuery('.' + item.id + '-input:hidden');
                  var visible = jQuery('.' + item.id + '-input:visible');
                  hidden.show(1000);
                  visible.hide(1000);
                  window.setTimeout(function()
                  {
                     var validator = form.data('bootstrapValidator');
                     validator.resetForm();
                     validator.validate();
                  }, 2050);
               }).
               text(item.label)));
      }
      else
      {
         formGroup.append(jQuery('<legend>').text(item.label));
      }
      form.append(formGroup);
      if (item.hasOwnProperty('alert'))
      {
         var alrt = jQuery('<div/>').
            addClass('alert').
            addClass('alert-info').
            addClass('fade').
            addClass('in').
            append(jQuery('<button/>').
               attr('type', 'button').
               addClass('close').
               attr('data-dismiss', 'alert').
               append(jQuery('<span/>').
                  attr('aria-hidden', 'true').
                  html('&times;')).
               append(jQuery('<span/>').
                  addClass('sr-only').
                  text('Close'))).
            append(jQuery('<div/>').
               append(jQuery('<span/>').
                  addClass('glyphicon').
                  addClass('glyphicon-info-sign')).
               append(jQuery('<strong/>').
                  html('&nbsp;Note!'))).
            append(jQuery('<span/>').
               text(item.alert));
         form.append(alrt);
      }
      if (item.hasOwnProperty('inputs'))
      {
         var entry;
         var input;
         for (entry in item.inputs)
         {
            if (item.inputs.hasOwnProperty(entry))
            {
               entry = item.inputs[entry];

               if (entry.type === 'radio')
               {
                  input = outer.makeRadio(entry, panel);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else if (entry.type === 'select')
               {
                  outer.hasSelects = true;
                  input = outer.makeSelect(entry);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else if (entry.type === 'section')
               {
                  input = outer.makeSection(entry, form);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else if (entry.type === 'cron')
               {
                  input = outer.makeCron(entry, form);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else if (entry.type === 'dynamicSection')
               {
                  input = outer.makeDynamicSection(entry, form);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else if (entry.type === 'info')
               {
                  input = outer.makeInfoItem(entry);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else if (entry.type === 'code')
               {
                  input = outer.makeCodeEditor(entry, outer.promise());
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else if (entry.type === 'textarea')
               {
                  input = outer.makeTextarea(entry);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }
               else
               {
                  input = outer.makeGenericInput(entry);
                  input.addClass(item.id + '-input');
                  form.append(input);
               }

               if (item.hasOwnProperty('collapsible') && item.collapsible === true)
               {
                  input.hide();
               }
            }
         }
      }
      return formGroup;
   };
   this.makeDynamicSection = function(item, form)
   {
      var formGroup = jQuery('<div>').addClass(item.id).css('clear', 'both');
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }
      form.append(formGroup);
      return formGroup;
   };
   this.makeRadio = function(item, panel)
   {
      var outer = this;
      var formGroup = jQuery('<div>').
         addClass('form-group').
         addClass(item.id).
         css('clear', 'both');
      // formGroup.append(jQuery('<label>').html(item.label + ':&nbsp;'));
      var clsLabel = jQuery('<label>').html(item.label + ':&nbsp;');
      if (item.isInline === true)
      {
         clsLabel.addClass('inline');
         clsLabel.addClass('control-label');
         if (item.hasOwnProperty('labelColumns'))
         {
            clsLabel.addClass(item.labelColumns);
         }
         else
         {
            clsLabel.addClass('col-md-4');
         }
      }
      formGroup.append(clsLabel);

      var buttonGroup = jQuery('<div>').
         addClass('btn-group').
         attr('data-toggle', 'buttons').
         css('float', 'left');
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }
      if (item.hasOwnProperty('isInline') && item.isInline)
      {
         jQuery('label', formGroup).addClass('control-label').addClass('col-md-4');
      }
      var i;
      var button;
      for (i = 0; i < item.options.length; i = i + 1)
      {
         if (item.options[i].value === dataObject[item.id])
         {
            button = jQuery('<label>').
               addClass('btn btn-default active').
               html('<input type="radio" name="' + item.id + '" value="' + item.options[i].value +
                  '" name="' + item.id + '" checked> ' + item.options[i].label);
            if (item.hasOwnProperty('isInline') && item.isInline)
            {
               button.css('margin', 0);
               if (i === 0)
               {
                  button.css('margin-left', '15px');
               }
            }
            buttonGroup.append(button);
         }
         else
         {
            button = jQuery('<label>').
               addClass('btn btn-default').
               html('<input type="radio" name="' + item.id + '" value="' + item.options[i].value +
                  '" name="' + item.id + '"> ' + item.options[i].label);
            if (item.hasOwnProperty('isInline') && item.isInline)
            {
               button.css('margin', 0);
               if (i === 0)
               {
                  button.css('margin-left', '15px');
               }
            }
            buttonGroup.append(button);
         }
      }
      if (item.hasOwnProperty('handlers'))
      {
         jQuery('input', buttonGroup).each(function()
         {
            var handler;
            for (handler in item.handlers)
            {
               if (item.handlers.hasOwnProperty(handler))
               {
                  jQuery(this).parent().on(handler, outer.getHandlerForRadio(panel, item, handler));
               }
            }
         });
      }
      if (item.isInline)
      {
         buttonGroup.addClass('inline');
         if (item.hasOwnProperty('valueColumns'))
         {
            buttonGroup.addClass(item.valueColumns);
         }
         else
         {
            buttonGroup.addClass('col-md-8');
         }
      }
      formGroup.append(buttonGroup);
      return formGroup;
   };
   this.getHandlerForRadio = function(panel, item, handler)
   {
      return function()
      {
         item.handlers[handler].call(this, jQuery('form:last', panel));
      };
   };
   this.makeSelect = function(item)
   {
      var formGroup = jQuery('<div>').
         addClass('form-group').
         addClass(item.id).
         css('clear', 'both');
      var value = dataObject[item.id];
      var maxItems;
      var i;

      //
      var clsLabel = jQuery('<label>').addClass('control-label').attr('for', item.id).text(item.label);
      if (item.isInline === true)
      {
         clsLabel.addClass('col-md-4');
      }
      formGroup.append(clsLabel);
      // formGroup.append(jQuery('<label>').attr('for', item.id).text(item.label));
      //

      formGroup.append(jQuery('<select>').
         attr('id', item.id));
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }
      for (i = 0; i < item.options.length; i = i + 1)
      {
         jQuery('#' + item.id, formGroup).
            append(jQuery('<option>').
               attr('value', item.options[i].value).
               text(item.options[i].label));
      }
      if (item.hasOwnProperty('handlers'))
      {
         var select = jQuery('#' + item.id, formGroup);
         var handler;
         for (handler in item.handlers)
         {
            if (item.handlers.hasOwnProperty(handler))
            {
               select.on(handler, item.handlers[handler]);
            }
         }
      }
      jQuery('#' + item.id, formGroup).
         val(value);
      if (Array.isArray(value))
      {
         jQuery('#' + item.id, formGroup).
            attr('multiple', true);
         //If its an array value, go through and add each one as an option and select it
         for (i = 0; i < value.length; i = i + 1)
         {
            jQuery('#' + item.id, formGroup).append(new Option(value[i], value[i], false, true));
         }
      }
      jQuery('#' + item.id, formGroup).
         val(value);
      if (item.hasOwnProperty('maxItems'))
      {
         maxItems = item.maxItems;
      }
      if (item.type === 'hidden')
      {
         formGroup.hide();
      }
      var validator;
      var val;
      if (item.hasOwnProperty('validators'))
      {
         for (i = 0; i < item.validators.length; i = i + 1)
         {
            this.hasValidators = true;
            validator = item.validators[i];
            jQuery('input', formGroup).
               attr(validator.attribute, true);
            if (validator.hasOwnProperty('message'))
            {
               jQuery('input', formGroup).
                  attr(validator.attribute + '-message', validator.message);
            }
            for (val in validator)
            {
               if (validator.hasOwnProperty(val) && val !== 'message' && val !==
                   'attribute')
               {
                  jQuery('input', formGroup).
                     attr(validator.attribute + '-' + val, validator[val]);
               }
            }
         }
      }
      this.selPrms.push(this.makePromise(item, formGroup, maxItems));
      return formGroup;
   };
   //
   this.makeCron = function(item)
   {
      // onChange: function() { scheduledItem.schedule = outer.cronToQuartz(jQuery(this).cron('value')); },
      var value = dataObject[item.id];
      var formGroup = jQuery('<div>').addClass('form-group').addClass(item.id).css('clear', 'both');
      formGroup.append(jQuery('<label>').attr('for', item.id).text(item.label));
      var div = jQuery('<div/>');
      div.attr('id', item.id).attr('name', item.id).addClass('form-control');
      formGroup.append(div);
      try
      {
         div.cron({
            initial: value,
            useGentleSelect: true,
            customValues:
                {
                   '5 minutes': '0/5 * * * ?',
                   '15 minutes': '0/15 * * * ?',
                   '30 minutes': '0/30 * * * ?'
                }
         });
      }
      catch (err)
      {
         div.cron({
            initial: '0/15 * * * ?',
            useGentleSelect: true,
            customValues:
                {
                   '5 minutes': '0/5 * * * ?',
                   '15 minutes': '0/15 * * * ?',
                   '30 minutes': '0/30 * * * ?'
                }
         });
      }
      if (item.type === 'hidden')
      {
         formGroup.hide();
      }
      if (item.hasOwnProperty('popover'))
      {
         div.popover(item.popover);
      }
      return formGroup;
   };
   //
   this.makeGenericInput = function(item)
   {
      var formGroup = jQuery('<div>').
         addClass('form-group').
         addClass(item.id).
         css('clear', 'both');
      var value = dataObject[item.id];
      var validator;
      var val;
      var j;
      if (item.hasOwnProperty('formatter'))
      {
         value = item.formatter(value);
      }
      if (item.hasOwnProperty('extraClasses'))
      {
         formGroup.addClass(item.extraClasses);
      }
      var clsLabel = jQuery('<label>').addClass('control-label').attr('for', item.id).text(item.label);
      if (item.isInline === true)
      {
         if (item.hasOwnProperty('labelColumns'))
         {
            clsLabel.addClass(item.labelColumns);
         }
         else
         {
            clsLabel.addClass('col-md-4');
         }
      }
      formGroup.append(clsLabel);
      var clsInput = jQuery('<input>').
         attr('id', item.id).
         attr('name', item.id).
         attr('type', item.type).
         addClass('form-control').
         attr('value', value);

      if (item.isInline)
      {
         var clsDiv = jQuery('<div>');
         if (item.hasOwnProperty('valueColumns'))
         {
            clsDiv.addClass(item.valueColumns);
         }
         else
         {
            clsDiv.addClass('col-md-8');
         }
         clsDiv.append(clsInput);
         formGroup.append(clsDiv);
      }
      else
      {
         formGroup.append(clsInput);
      }
      if (item.type === 'hidden')
      {
         formGroup.hide();
      }
      var input = jQuery('#' + item.id, formGroup);
      if (item.hasOwnProperty('popover'))
      {
         input.popover(item.popover);
      }
      if (item.hasOwnProperty('handlers'))
      {
         var handler;
         for (handler in item.handlers)
         {
            if (item.handlers.hasOwnProperty(handler))
            {
               input.on(handler, item.handlers[handler]);
            }
         }
      }
      if (item.hasOwnProperty('validators'))
      {
         for (j = 0; j < item.validators.length; j = j + 1)
         {
            this.hasValidators = true;
            validator = item.validators[j];
            jQuery('input', formGroup).
               attr(validator.attribute, true);
            if (validator.hasOwnProperty('message'))
            {
               jQuery('input', formGroup).
                  attr(validator.attribute + '-message', validator.message);
            }
            for (val in validator)
            {
               if (validator.hasOwnProperty(val) && val !== 'message' && val !==
                   'attribute')
               {
                  jQuery('input', formGroup).
                     attr(validator.attribute + '-' + val, validator[val]);
               }
            }
         }
      }
      return formGroup;
   };
   this.makePromise = function(item, formGroup, maxItems)
   {
      return jQuery.Deferred(function(deferred)
      {
         var input = jQuery('#' + item.id, formGroup);
         var value = input.val();
         input.selectize({
            maxItems: maxItems,
            create: item.allowCreate ? true : false,
            duplicates: true,
            items: Array.isArray(value) ? value : [value],
            onInitialize: function()
            {
               if (item.hasOwnProperty('popover'))
               {
                  jQuery('.selectize-input', formGroup).
                     popover(item.popover);
               }
               if (item.hasOwnProperty('isInline'))
               {
                  jQuery('.selectize-control', formGroup).addClass('col-md-8');
               }
               deferred.resolve();
            }
         });
      }).promise();
   };
   this.addPopoverFromJson = function(json, form, placement)
   {
      var item;
      for (item in json)
      {
         if (json.hasOwnProperty(item))
         {
            jQuery('#' + item, form).popover({
               trigger: 'focus', toggle: 'popover', container: false, placement: placement,
               title: jQuery('#' + item, form).closest('.form-group').find('label:first').text(),
               content: json[item]
            });
         }
      }
   };
   return this.ctor(dataObject, dataTable);
}
