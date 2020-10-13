/*globals window, pageModule, jQuery */

var abacus = abacus || {};
abacus.Containers = abacus.Containers || {};

abacus.Containers.Controller = function()
{
   this.showPanel = function()
   {
      var baseId = 'InstalledDockerContainers';
      pageModule.buildPage(baseId, 'Installed Docker Containers Details');
      pageModule.showLoadingModal();
      var outer = this;
      var def = new jQuery.Deferred(function(deferred)
      {
         var jsFiles = ['lib/abacus/help/about/containers/model.js', 'lib/abacus/help/about/containers/view.js'];
         jQuery.when(outer.loadJs(jsFiles)).done(function()
         {
            outer.model = new abacus.Containers.Model(outer);
            outer.view = new abacus.Containers.View(outer, baseId);
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
abacus.Containers.controller = new abacus.Containers.Controller();
