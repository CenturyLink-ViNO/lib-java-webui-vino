/*globals pageModule */
/*globals jQuery */
/*globals window */
/*globals jsInclude */
/* exported whitelistAddressManagementModule */

function WhitelistAddressManagementModule()
{
   this.showWhitelistAddressManagement = function()
   {
      pageModule.buildPage('addressMgtPanel', 'Address Management', 'lib/abacus/whitelist/Help.html');
      jQuery.when(jsInclude('lib/abacus/whitelist/controller.js')).done(function()
      {
         var AddressController = window.AbacusWhitelistedAddressController('addressMgtPanel-bdy');
         AddressController.renderPanel();
         // pageModule.doneLoading();
      });
   };
   this.showBasicSettingsForm = function()
   {
      pageModule.buildPage('AddressMgtPanel', 'Address Management', 'lib/abacus/whitelist/Help.html');
      jQuery.when(jsInclude('lib/abacus/whitelist/controller.js')).done(function()
      {
         var AddressController = window.AbacusWhitelistedAddressController('AddressMgtPanel-bdy');
         AddressController.renderBasicSettings();
         // pageModule.doneLoading();
      });
   };
}

var whitelistAddressManagementModule = new WhitelistAddressManagementModule();
