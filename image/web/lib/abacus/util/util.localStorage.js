/*globals window */
/*globals localStorage */
/*globals jQuery */
/* exported storageModule */
/* exported unregisterStorageModule */

function StorageModule()
{
   'use strict';
   this.supports_html5_storage = function()
   {
      try
      {
         return window.localStorage !== null && window.localStorage !== 'undefined';
      }
      catch (e)
      {
         return false;
      }
   };

   this.getItem = function(key)
   {
      var itm = null, supported = this.supports_html5_storage();
      if (supported)
      {
         itm = localStorage.getItem(key);
         if (itm !== null)
         {
            itm = JSON.parse(itm);
         }
         return itm;
      }
      else
      {
         return null;
      }
   };

   this.setItem = function(key, value)
   {
      var stored = false;
      if (this.supports_html5_storage())
      {
         localStorage.removeItem(key);
         localStorage.setItem(key, value);
         stored = true;
      }
      return stored;
   };

   this.removeItem = function(key)
   {
      var removed = false;
      if (this.supports_html5_storage())
      {
         localStorage.removeItem(key);
         removed = true;
      }
      return removed;
   };
}

var storageModule = new StorageModule();

function unregisterStorageModule()
{
   'use strict';
   storageModule = null;
   jQuery('#storageModuleScript').remove();
}
