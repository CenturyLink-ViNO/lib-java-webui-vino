/*globals window */
/*globals pageModule */
/*globals jQuery */

var abacus = abacus || {};
abacus.WebServiceDocumentation = abacus.WebServiceDocumentation || {};

abacus.WebServiceDocumentation.Controller = function()
{
   this.showPanel = function()
   {
      var baseId = 'WebServicesHelp';
      pageModule.buildPage(baseId, 'Web Services Documentation');
      pageModule.showLoadingModal();
      var outer = this;
      var def = new jQuery.Deferred(function(deferred)
      {
         var jsFiles = ['/lib/abacus/help/wsDocumentation/model.js', '/lib/abacus/help/wsDocumentation/view.js'];
         jQuery.when(outer.loadJs(jsFiles)).done(function()
         {
            outer.model = new abacus.WebServiceDocumentation.Model(outer);
            outer.view = new abacus.WebServiceDocumentation.View(outer, baseId);
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

abacus.WebServiceDocumentation.controller = new abacus.WebServiceDocumentation.Controller();
