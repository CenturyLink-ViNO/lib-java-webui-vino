/*globals storageModule*/
/*globals jQuery*/

(function()
{
   'use strict';

   jQuery.fn.abacusDataTablesWrapper = function(settings)
   {
      this.refreshTable = function()
      {
         // debugger;

         if (this.hasOwnProperty('dataTable'))
         {
            this.dataTable.api().ajax.reload(); // call ajax method to refresh table
         }
      };

      this.initialize = function(settings)
      {
         var defaultSettings =
         {
            url: '',
            type: 'table',
            title: '',
            tableName: '#dataTable',
            includeTableHeader: true,
            includeTableFooter: false,
            tableClasses: ['display', 'responsive', 'nowrap'],
            dom: 'Bfrtip',
            parent: '',
            format: { },
            select: true,
            fsWrap: true
         };

         this.settings = jQuery.extend(defaultSettings, settings);

         if (this.settings.type === 'table')
         {
            this.buildTable();
         }
         else if (this.settings.type === 'standalone')
         {
            this.buildStandalone();
         }
         else if (this.settings.type === 'standalone-rdonly')
         {
            this.buildStandaloneRdOnly();
         }
      };

      this.buildTable = function()
      {
         var newFmt;
         var editor;
         var newSettings;
         var tbl;

         var fieldSet = this.buildFieldSet(this.settings.title);
         var table = this.buildDomTable();
         var parentNode = jQuery(this.settings.parent);

         if (this.settings.fsWrap)
         {
            // Add the new table to the parent node
            fieldSet.append(table);
            parentNode.append(fieldSet);
         }
         else
         {
            parentNode.append(table);
         }

         // Initialize Editor
         newFmt = this.settings.format;
         newFmt.dom = this.settings.dom;
         newFmt.ajax = this.settings.url;
         newFmt.table = '#' + this.settings.tableName;
         newSettings = this.getTableSettings(newFmt, null, false);
         editor = new jQuery.fn.dataTable.Editor(newSettings);

         // Initialize DataTables
         newSettings = this.getTableSettings(newFmt, editor, true);
         tbl = jQuery('#' + this.settings.tableName).dataTable(newSettings);
         this.dataTable = tbl;
      };

      this.buildDomTable = function()
      {
         var idx;
         var fields;
         var tHead;
         var row;
         var fieldId;
         var tFoot;
         var table = jQuery('<table/>').attr('id', this.settings.tableName);

         for (idx in this.settings.tableClasses)
         {
            if (this.settings.tableClasses.hasOwnProperty(idx))
            {
               table.addClass(this.settings.tableClasses[idx]);
            }
         }
         if (this.settings.includeTableHeader)
         {
            fields = this.settings.format.fields;
            tHead = jQuery('<thead/>');
            row = jQuery('<tr/>');
            tHead.append(row);

            for (fieldId in fields)
            {
               if (fields.hasOwnProperty(fieldId))
               {
                  row.append(jQuery('<th/>').html(fields[fieldId].label));
               }
            }
            table.append(tHead);
         }
         if (this.settings.includeTableFooter)
         {
            fields = this.settings.format.fields;
            tFoot = jQuery('<tfoot/>');
            row = jQuery('<tr/>');
            tFoot.append(row);

            for (fieldId in fields)
            {
               if (fields.hasOwnProperty(fieldId))
               {
                  row.append(jQuery('<th/>').html(fields[fieldId].label));
               }
            }
            table.append(tFoot);
         }
         return table;
      };

      this.getTableSettings = function(format, editor, forTable)
      {
         var idx;
         var field;
         var aButtons;
         var settings = format;
         var ajax = this.settings.url;

         if (forTable !== true)
         {
            if (this.settings.hasOwnProperty('edAjax'))
            {
               settings.ajax = this.settings.edAjax;
            }
            if (this.settings.hasOwnProperty('idSrc'))
            {
               settings.idSrc = this.settings.idSrc;
            }
         }
         else
         {
            if (this.settings.hasOwnProperty('ajax'))
            {
               ajax = this.settings.ajax;
            }
            settings =
            {
               dom: this.settings.dom,
               ajax: ajax
            };
            settings.columns = [];

            for (idx in format.fields)
            {
               if (format.fields.hasOwnProperty(idx))
               {
                  field = format.fields[idx];
                  settings.columns.push({ 'data': field.name });
               }
            }
            aButtons = [];

            if (this.settings.hasOwnProperty('buttons'))
            {
               for (idx in this.settings.buttons)
               {
                  if (this.settings.buttons.hasOwnProperty(idx))
                  {
                     field = this.settings.buttons[idx];
                     if (field === 'create')
                     {
                        aButtons.push({ sExtends: 'editor_create', editor: editor });
                     }
                     else if (field === 'edit')
                     {
                        aButtons.push({ sExtends: 'editor_edit', editor: editor });
                     }
                     else if (field === 'remove')
                     {
                        aButtons.push({ sExtends: 'editor_remove', editor: editor });
                     }
                     else
                     {
                        // Regular string button
                        // e.g. 'print', etc.
                        aButtons.push(field);
                     }
                  }
               }
            }
            if (aButtons.length > 0)
            {
               settings.tableTools =
               { aButtons: aButtons };
            }
            else
            {
               settings.tableTools =
               { aButtons: [] };
            }
            if (this.settings.hasOwnProperty('idSrc'))
            {
               settings.idSrc = this.settings.idSrc;
            }
            settings.tableTools.sSelectedClass = 'selected';
            settings.tableTools.sRowSelect = 'single';
         }
         settings.responsive = true;
         settings.autoWidth = false;
         return settings;
      };

      this.buildStandalone = function()
      {
         var editor;
         var data;
         var parentNode;
         var fieldSet;
         var root;
         var id;
         var newFmt = this.settings.format;
         newFmt.ajax = this.settings.url;

         if (this.settings.hasOwnProperty('edAjax'))
         {
            newFmt.ajax = this.settings.edAjax;
         }
         editor = new jQuery.fn.dataTable.Editor(newFmt);
         data = this.getData();
         parentNode = jQuery(this.settings.parent);
         fieldSet = this.buildFieldSet(this.settings.title);
         root = this.buildForm();

         if (this.settings.format.hasOwnProperty('fields'))
         {
            for (id in this.settings.format.fields)
            {
               if (this.settings.format.fields.hasOwnProperty(id))
               {
                  root.append(this.buildFormGroup(this.settings.format.fields[id], data[0], editor));
               }
            }
            if (this.settings.fsWrap)
            {
               fieldSet.append(root);
               parentNode.append(fieldSet);
            }
            else
            {
               parentNode.append(root);
            }
         }
         this.enableInline(editor);
      };

      this.buildStandaloneRdOnly = function()
      {
         var root = this.buildForm();
         var fieldSet = this.buildFieldSet(this.settings.title);
         var parentNode = jQuery(this.settings.parent);
         var id;

         for (id in this.settings.format.fields)
         {
            if (this.settings.format.fields.hasOwnProperty(id))
            {
               root.append(this.buildFormGroup(this.settings.format.fields[id], this.settings.data, null));
            }
         }
         fieldSet.append(root);
         parentNode.append(fieldSet);
      };

      this.enableInline = function(editor)
      {
         jQuery('[data-editor-field]').off('click');
         jQuery('[data-editor-field]').on('click', function()
         {
            editor.inline(this, { buttons: '_basic' });
         });
      };

      this.buildForm = function()
      {
         // Singular place for building a form, in case we wish to change how the form
         // is generated at a later time.
         return jQuery('<form/>').addClass('form-horizontal').attr('role', 'form');
      };

      this.buildFieldSet = function(title)
      {
         return jQuery('<fieldset/>').append(jQuery('<legend/>').html(title));
      };

      this.buildFormGroup = function(field, data, editor)
      {
         // Singular place for creating a label/input pair -- Note that both elements will
         // be text, datatables editor will take care of converting the value to an input
         //.addClass('control-label')
         //.addClass('form-control')
         var conDiv = jQuery('<div/>').addClass('form-group');
         var value = '';
         var opts;
         var opt;

         if (field.type === 'select' || field.type === 'radio')
         {
            opts = field.ipOpts;
            value = opts[0].label; // Default to the first in the list

            if (data.hasOwnProperty(field.data))
            {
               for (opt in opts)
               {
                  if (opts.hasOwnProperty(opt))
                  {
                     opt = opts[opt];
                     if (opt.value === data[field.data])
                     {
                        value = opt.label;
                        break;
                     }
                  }
               }
            }
         }
         else
         {
            if (data !== null && data !== 'undefined' && data !== undefined && data.hasOwnProperty(field.data))
            {
               value = data[field.data];
            }
         }
         conDiv.append(jQuery('<label/>').attr('for', field.data).addClass('col-sm-3').html(field.label));

         if (field.type === 'link')
         {
            conDiv.append(jQuery('<div/>').addClass('col-sm-9').
               append(jQuery('<a/>').on('click', field.action).text(field.label)));
         }
         else
         {
            if (editor !== null)
            {
               conDiv.append(jQuery('<div/>').addClass('col-sm-9').
                  append(jQuery('<span/>').attr('id', field.data).attr('data-editor-field', field.data).
                     on('click', function()
                     {
                        editor.inline(
                           this,
                           {
                           //submitOnBlur: true
                              buttons: '_basic'
                           }
                        );
                     }).html(value)));
            }
            else
            {
               conDiv.append(jQuery('<div/>').addClass('col-sm-9').
                  append(jQuery('<span/>').attr('id', field.data).html(value)));
            }
         }
         if (field.type === 'hidden')
         {
            conDiv.hide();
         }
         return conDiv;
      };
      this.getData = function()
      {
         var result = null;
         var session = storageModule.getItem('abacus.session');
         var ajax;

         if (this.settings.hasOwnProperty('ajax'))
         {
            ajax = this.settings.ajax;
            jQuery.ajax({
               url: ajax.url,
               type: ajax.type,
               dataType: ajax.dataType,
               data: ajax.data,
               async: ajax.async
            }).
               success(function(data)
               {
                  result = ajax.success(data);
               }).
               error(function()
               {
                  result = ajax.error();
               });
         }
         else
         {
            jQuery.ajax({
               url: this.settings.url,
               type: 'get',
               dataType: 'json',
               data:
               { token: session.token },
               async: false,
               success: function(data)
               {
                  if (data === null || data === 'undefined' || data === undefined)
                  {
                     result = { data: {} };
                  }
                  else
                  {
                     result = data;
                  }
               },
               error: function()
               {
                  result = { data: { error: 'Failed to get data from the server' } };
               }
            });
         }
         return result.data;
      };
      this.initialize(settings);
      return this;
   };
}(jQuery()));
