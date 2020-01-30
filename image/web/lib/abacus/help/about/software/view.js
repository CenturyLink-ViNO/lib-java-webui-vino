/*globals jQuery, abacus, pageModule */

var abacus = abacus || {};

abacus.Software.View = function(controller, baseId)
{
   this.controller = controller;
   this.baseId = baseId;

   this.renderUiElement = function(wsResponseData)
   {
      this.tableId = 'installedSoftwareDetailsTable';
      var panel = jQuery('#' + this.baseId + '-bdy');
      jQuery('#' + this.baseId + '-ftr').remove();
      var outer = this;
      var def = jQuery.Deferred(function(deferred)
      {
         var domTable = jQuery('<table>').attr('id', outer.tableId).addClass('display').
            css('border-top', '1px solid #111111').
            css('border-left', '1px solid #111111').
            css('border-right', '1px solid #111111');

         var thead = jQuery('<thead>').
            append(jQuery('<tr>').
               append(jQuery('<th>').text('Name')).
            // append(jQuery('<th>').text('Architecture')).
               append(jQuery('<th>').text('Version')).
               append(jQuery('<th>').text('Release')).
               append(jQuery('<th>').text('Size')).
            // append(jQuery('<th>').text('Repository')).
               append(jQuery('<th>').text('Installed From')).
               append(jQuery('<th>').text('Summary')).
               append(jQuery('<th>').text('URL')).
               append(jQuery('<th>').text('License')).
               append(jQuery('<th>').text('Description')));
         domTable.append(thead);
         panel.append(domTable);
         jQuery('#' + outer.tableId).dataTable({
            responsive: true,
            dom: 'Bfrtip',
            ajax: function(data, callback)
            {
               var tableData = { data: wsResponseData.packages.packages };
               callback(tableData);
            },
            columns:
            [
               { data: 'name' },
               //               { data: 'arch' },
               { data: 'version' },
               { data: 'release' },
               { data: 'size' },
               //               { data: 'repo' },
               { data: 'fromRepo' },
               { data: 'summary' },
               {
                  data: 'url',
                  render: function(data)
                  {
                     return '<a target="external" href="' + data + '">' + data + '</a>';
                  }
               },
               { data: 'license' },
               { data: 'description' }
            ],
            buttons: [],
            initComplete: function()
            {
               deferred.resolve();
            }
         });
         jQuery('#' + outer.tableId).css('width', '95%').css('max-width', '95%');
      });
      return def.promise();
   };
   this.showError = function(msg)
   {
      if (this.baseId !== null && this.baseId !== undefined)
      {
         pageModule.showError(this.baseId, msg);
      }
   };
   this.showSuccess = function(msg)
   {
      if (this.baseId !== null && this.baseId !== undefined)
      {
         pageModule.showSuccess(this.baseId, msg);
      }
   };
};
