/*globals jQuery */
/*globals abacus */
/*globals AbstractModel */

var abacus = abacus || {};

abacus.About.Model = function()
{
   var outer = this;
   this.getData = function()
   {
      var def = jQuery.Deferred(function(deferred)
      {
         var url = '/ui/help/about/summary';
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
            deferred.reject('An unknown error prevented the System Version Information from being loaded');
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
