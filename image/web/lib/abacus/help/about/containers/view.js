/*globals jQuery, abacus, pageModule */

var abacus = abacus || {};

abacus.Containers.View = function(controller, baseId)
{
   this.controller = controller;
   this.baseId = baseId;

   this.renderUiElement = function(wsResponseData)
   {
      this.tableId = 'installedContainersDetailsTable';
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
               append(jQuery('<th>').text('Major')).
               append(jQuery('<th>').text('Minor')).
               append(jQuery('<th>').text('Revision')).
               append(jQuery('<th>').text('Fix')).
               append(jQuery('<th>').text('Build ID')));
         domTable.append(thead);
         panel.append(domTable);
         jQuery('#' + outer.tableId).dataTable({
            responsive: true,
            dom: 'Bfrtip',
            ajax: function(data, callback)
            {
               var tableData = { data: wsResponseData.containers.containers };
               callback(tableData);
            },
            columns:
            [
               { data: 'name' }, { data: 'major' }, { data: 'minor' }, { data: 'revision' }, { data: 'fix' }, { data: 'buildid' }
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
