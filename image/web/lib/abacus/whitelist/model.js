/*globals window */
/*globals jQuery */
/*globals AbstractModel */

window.AbacusWhitelistedAddressModel = function(controller)
{
   var outer = this;
   this.ctor = function(controller)
   {
      this.controller = controller;
      jQuery.extend(this, new AbstractModel());
      return this;
   };
   this.getWhitelistedAddress = function()
   {
      var def = jQuery.Deferred(function(deferred)
      {
         var url = 'ui/auth/networkaccess';
         var success = function(json)
         {
            if (json.hasOwnProperty('accessList'))
            {
               deferred.resolve({ data: json.accessList });
            }
            else
            {
               deferred.resolve({ data: [] });
            }
         };
         var fail = function()
         {
            deferred.reject();
         };
         outer.callWebservice(url, 'GET', 'json', null, success, fail);
      });
      return def.promise();
   };
   this.updateAddress = function(data)
   {
      data = data.toJson();
      delete data.format;
      var def = jQuery.Deferred(function(deferred)
      {
         var url = 'ui/auth/networkaccess';
         var success = function(json)
         {
            deferred.resolve(json.row);
         };
         var fail = function()
         {
            deferred.reject();
         };
         outer.callWebservice(url, 'PUT', 'json', data, success, fail);
      });
      return def.promise();
   };
   this.removeAddress = function(data)
   {
      data = data.toJson();
      delete data.format;
      var def = jQuery.Deferred(function(deferred)
      {
         var url = 'ui/auth/networkaccess?address=' + data.address;
         var success = function(json)
         {
            if (json.hasOwnProperty('error'))
            {
               deferred.reject(json.error);
            }
            else
            {
               deferred.resolve('Successfully removed address.');
            }
         };
         var fail = function()
         {
            deferred.reject();
         };
         outer.callWebservice(url, 'DELETE', 'json', null, success, fail);
      });
      return def.promise();
   };
   this.createAddress = function(data)
   {
      data = data.toJson();
      delete data.format;
      var def = jQuery.Deferred(function(deferred)
      {
         var url = 'ui/auth/networkaccess';
         var success = function(json)
         {
            if (json.hasOwnProperty('error'))
            {
               deferred.reject();
            }
            else
            {
               deferred.resolve(json);
            }
         };
         var fail = function()
         {
            deferred.reject();
         };
         outer.callWebservice(url, 'POST', 'json', data, success, fail);
      });
      return def.promise();
   };
   return this.ctor(controller);
};
if (!Date.now)
{
   Date.now = function now()
   {
      return new Date().
         getTime();
   };
}
