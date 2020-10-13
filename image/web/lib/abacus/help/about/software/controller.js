/*globals window, pageModule, jQuery */

var abacus = abacus || {};
abacus.Software = abacus.Software || {};

abacus.Software.Controller = function()
{
   this.showPanel = function()
   {
      var baseId = 'installedSoftware';
      pageModule.buildPage(baseId, 'Installed Software Details');
      pageModule.showLoadingModal();
      var outer = this;
      var def = new jQuery.Deferred(function(deferred)
      {
         var jsFiles = ['lib/abacus/help/about/software/model.js', 'lib/abacus/help/about/software/view.js'];
         jQuery.when(outer.loadJs(jsFiles)).done(function()
         {
            outer.model = new abacus.Software.Model(outer);
            outer.view = new abacus.Software.View(outer, baseId);
            jQuery.when(outer.model.getData()).done(function(data)
            {
               outer.view.renderUiElement(data);
               deferred.resolve();
            }).fail(function()
            {
               outer.view.showError('Failed to load data');
               deferred.resolve();
            }).always(function()
            {
               pageModule.hideLoadingModal();
            });
         }).fail(function()
         {
            outer.view.showError('Failed to load supporting JS files');
            deferred.resolve();
         });
      });
      return def.promise();
   };
   this.ctor = function()
   {
      return jQuery.extend(this, new window.AbstractController());
   };
   return this.ctor();
};
abacus.Software.controller = new abacus.Software.Controller();
