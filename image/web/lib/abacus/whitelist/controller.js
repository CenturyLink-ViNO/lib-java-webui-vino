/*globals window*/
/*globals jQuery*/
/*globals pageModule*/

window.AbacusWhitelistedAddressController = function(baseId)
{
   var jsFiles = [
      'lib/abacus/whitelist/model.js', 'lib/abacus/whitelist/view.js', 'lib/abacus/whitelist/dataobject.js'
   ];
   this.renderPanel = function()
   {
      var uiBase = this.baseId;
      var outer = this;
      var def = new jQuery.Deferred(function(deferred)
      {
         jQuery.when(outer.loadJs(jsFiles)).
            done(function()
            {
               pageModule.hideLoadingModal();
               outer.model = new window.AbacusWhitelistedAddressModel(outer);
               outer.view = new window.AbacusWhitelistedAddressView(outer);
               jQuery.when(outer.model.getWhitelistedAddress()).done(function(data)
               {
                  jQuery.when(outer.view.renderUiElement(uiBase, data)).done(function()
                  {
                     deferred.resolve();
                  });
               });
            }).
            fail(function()
            {
               outer.view.showError(
                  uiBase,
                  'Failed to load JavaScript files for displaying the Whitelist Address Management UI.'
               );
               deferred.resolve();
            });
      });
      return def.promise();
   };
   this.renderBasicSettings = function()
   {
      var uiBase = this.baseId;
      var outer = this;
      var def = new jQuery.Deferred(function(deferred)
      {
         jQuery.when(outer.loadJs(jsFiles)).
            done(function()
            {
               pageModule.hideLoadingModal();
               outer.model = new window.AbacusWhitelistedAddressModel(outer);
               outer.view = new window.AbacusWhitelistedAddressView(outer);
               jQuery.when(outer.view.basicWhitelistSettings(uiBase)).done(function()
               {
                  deferred.resolve();
               });
            }).
            fail(function()
            {
               outer.view.showError(
                  uiBase,
                  'Failed to load JavaScript files for displaying the Whitelist Address Settings.'
               );
               deferred.resolve();
            });
      });
      return def.promise();
   };
   this.ctor = function(baseId)
   {
      this.baseId = baseId;
      return jQuery.extend(this, new window.AbstractController());
   };
   this.updateFromForm = function(whitelistedAddress)
   {
      whitelistedAddress.address = jQuery('#address').val();
      return whitelistedAddress;
   };
   this.addAddress = function(dataObj)
   {
      return this.model.createAddress(dataObj);
   };
   this.updateAddress = function(dataObj)
   {
      return this.model.updateAddress(dataObj);
   };
   this.removeAddress = function(dataObj)
   {
      return this.model.removeAddress(dataObj, this.switchId);
   };
   this.showError = function(msg)
   {
      this.view.showError(baseId, msg);
   };
   this.showSuccess = function(msg)
   {
      this.view.showSuccess(baseId, msg);
   };
   return this.ctor(baseId);
};
