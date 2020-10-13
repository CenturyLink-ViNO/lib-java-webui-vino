/*globals AbstractModel */
/*globals jQuery */

var abacus = abacus || {};
abacus.WebServiceDocumentation = abacus.WebServiceDocumentation || {};

abacus.WebServiceDocumentation.Model = function()
{
   var outer = this;
   this.getData = function()
   {
      var def = jQuery.Deferred(function(deferred)
      {
         var url = 'ui/webServiceDocumentation/list';
         var success = function(json)
         {
            if (json.hasOwnProperty('error'))
            {
               deferred.reject(json.error);
            }
            else
            {
               deferred.resolve(json);
            }
         };
         var fail = function()
         {
            deferred.reject('An error prevented the Web Service Documentation from being loaded');
         };
         outer.callWebservice(url, 'GET', 'json', null, success, fail);
      });
      return def.promise();
   };
   this.ctor = function()
   {
      jQuery.extend(this, new AbstractModel());
      return this;
   };
   return this.ctor();
};
