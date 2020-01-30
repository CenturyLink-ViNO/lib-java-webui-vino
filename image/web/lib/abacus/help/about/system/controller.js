/*globals window, pageModule, jQuery */

var abacus = abacus || {};
abacus.About = abacus.About || {};
abacus.About.Controller = function()
{
   this.showModal = function()
   {
      pageModule.showLoadingModal();
      var outer = this;
      var def = new jQuery.Deferred(function(deferred)
      {
         var jsFiles = ['/lib/abacus/help/about/system/model.js', '/lib/abacus/help/about/system/dom.js'];
         jQuery.when(outer.loadJs(jsFiles)).done(function()
         {
            outer.model = new abacus.About.Model(outer);
            jQuery.when(outer.model.getData()).done(function(data)
            {
               abacus.About.DOM.getModal(data).modal('show');
            }).fail(function()
            {
               abacus.About.DOM.getModal({ version: 'unknown' }).modal('show');
            }).always(function()
            {
               pageModule.hideLoadingModal();
               deferred.resolve();
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
abacus.About.controller = new abacus.About.Controller();
