/*globals window*/
/*globals pageModule*/
/*globals jQuery*/
/*globals FormBuilder*/
/*globals storageModule*/

window.AbacusWhitelistedAddressView = function(ctrlr)
{
   this.ctor = function(controller)
   {
      this.controller = controller;
      this.tableId = this.guid();
   };
   this.renderUiElement = function(baseId, addressData)
   {
      var outer = this;
      this.cos = addressData.cos;
      var panel = pageModule.getNewPanel('Address', '');
      jQuery('#' + baseId).
         append(panel);
      panel = jQuery('#' + baseId + ' #Address > .panel-body');
      panel.attr('id', 'address-bdy');
      var def = jQuery.Deferred(function(deferred)
      {
         var domTable = jQuery('<table>').
            attr('id', outer.tableId).
            addClass('display').
            append(jQuery('<thead>').
               append(jQuery('<tr>').
                  append(jQuery('<th>').
                     text('Address'))));
         panel.append(domTable);
         var tbl = jQuery('#' + outer.tableId).dataTable({
            dom: 'Bfrtip',
            select: true,
            ajax: function(data, callback)
            {
               callback(addressData);
            },
            columns: [
               { data: 'address' }
            ],
            buttons: [
               {
                  text: 'Create',
                  action: function()
                  {
                     outer.newAddress(baseId, tbl);
                  }
               },
               {
                  text: 'Edit',
                  action: function()
                  {
                     outer.editAddress(baseId, tbl);
                  }
               },
               {
                  text: 'Remove',
                  action: function()
                  {
                     var data = tbl.fnGetData(jQuery('#' + outer.tableId + ' .selected'));
                     if (!data)
                     {
                        return;
                     }
                     pageModule.showLoadingModal();
                     var usr = new window.
                        AbacusWhitelistedAddress(data, outer.controller);
                     var resp = outer.controller.removeAddress(usr);
                     resp.done(function(msg)
                     {
                        outer.showSuccess(baseId, msg);
                        tbl.fnDeleteRow(
                           jQuery('#' + outer.tableId + ' .selected')[0],
                           null, true
                        );
                        pageModule.hideLoadingModal();
                     }).fail(function(msg)
                     {
                        outer.showError(baseId, msg);
                        pageModule.hideLoadingModal();
                     });
                  }
               }
            ],
            initComplete: function()
            {
               deferred.resolve();
            }
         });
      });
      return def.promise();
   };
   this.newAddress = function(baseId, dataTable)
   {
      var outer = this;
      var modal = jQuery('<div/>').
         addClass('modal fade').
         attr('id', 'newAddressModal').
         append(jQuery('<div/>').
            addClass('modal-dialog').
            css('background-color', '#fff').
            css('border', '1px solid #8e8e8e').
            css('border-radius', '5px').
            append(jQuery('<div/>').
               addClass('modal-header').
               append(jQuery('<h2>').
                  text('New Address'))).
            append(jQuery('<div/>').
               addClass('modal-body')));
      var formBuilder;
      pageModule.hideLoadingModal();
      jQuery('body').
         append(modal.hide());
      formBuilder = new FormBuilder(new window.AbacusWhitelistedAddress({}, outer.controller), dataTable);
      formBuilder.buildForm('.modal-body');
      jQuery('.modal').
         modal({
            backdrop: false,
            keyboard: false
         });
   };
   this.editAddress = function(baseId, dataTable)
   {
      var outer = this;
      var modal = jQuery('<div/>').
         addClass('modal fade').
         attr('id', 'editAddressModal').
         append(jQuery('<div/>').
            addClass('modal-dialog').
            css('background-color', '#fff').
            css('border', '1px solid #8e8e8e').
            css('border-radius', '5px').
            append(jQuery('<div/>').
               addClass('modal-header').
               append(jQuery('<h2>').
                  text('Edit Address'))).
            append(jQuery('<div/>').
               addClass('modal-body')));
      var formBuilder;
      jQuery('body').
         append(modal.hide());
      var existingData = dataTable.fnGetData(jQuery('#' + outer.tableId + ' .selected'));
      existingData.updating = true;
      formBuilder = new FormBuilder(new window.AbacusWhitelistedAddress(existingData, outer.controller), dataTable);
      formBuilder.buildForm('.modal-body');
      jQuery('.modal').
         modal({
            backdrop: false,
            keyboard: false
         });
      jQuery('input#address').attr('disabled', true);
   };
   //Displays a menu of settings which any user can update for themselves (just password right now)
   this.basicWhitelistSettings = function()
   {
      var outer = this;
      var modal = jQuery('<div/>').
         addClass('modal fade').
         attr('id', 'editAddressModal').
         append(jQuery('<div/>').
            addClass('modal-dialog').
            css('background-color', '#fff').
            css('border', '1px solid #8e8e8e').
            css('border-radius', '5px').
            append(jQuery('<div/>').
               addClass('modal-header').
               append(jQuery('<h2>').
                  text('Address Settings'))).
            append(jQuery('<div/>').
               addClass('modal-body')));
      var formBuilder;
      jQuery('body').
         append(modal.hide());
      var existingData = { address: storageModule.getItem('abacus.session').address };
      existingData.updating = true;
      formBuilder = new FormBuilder(new window.AbacusWhitelistedAddress(existingData, outer.controller, []));
      formBuilder.buildForm('.modal-body');
      jQuery('.modal').
         modal({
            backdrop: false,
            keyboard: false
         });
      jQuery('input#address').attr('disabled', true);
   };
   this.showError = function(baseId, msg)
   {
      pageModule.showError(baseId, msg);
   };
   this.showSuccess = function(baseId, msg)
   {
      pageModule.showSuccess(baseId, msg);
   };
   this.s4 = function()
   {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
   };
   this.guid = function()
   {
      return this.s4() + this.s4() + '-' +
         this.s4() + '-' +
         this.s4() + '-' +
         this.s4() + '-' +
         this.s4() + this.s4() + this.s4();
   };
   return this.ctor(ctrlr);
};
