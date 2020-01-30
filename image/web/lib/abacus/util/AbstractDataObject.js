/*globals window */

window.AbstractDataObject = function(controller)
{
   this.controller = null;

   this.notEmpty = function(object)
   {
      var ret = false;
      if (object !== null && object !== undefined && object !== '')
      {
         ret = true;
      }
      return ret;
   };
   this.fromJson = function(data)
   {
      var param;
      var object = this;
      for (param in data)
      {
         if (data.hasOwnProperty(param) && typeof data[param] !== 'function' && data[param] !== null &&
             data[param] !== '' && data[param] !== undefined)
         {
            if (object.hasOwnProperty(param) && typeof object[param] !== 'function')
            {
               object[param] = data[param];
            }
         }
      }
   };
   this.toJson = function()
   {
      var param;
      var json = {};
      for (param in this)
      {
         if (this.hasOwnProperty(param) && param !== 'toJson' && typeof this[param] !== 'function' &&
             typeof this[param] !== 'object' && param !== 'controller' && param !== 'format')
         {
            json[param] = this[param];
         }
      }
      return json;
   };
   this.ctor = function(controller)
   {
      this.controller = controller;
      return this;
   };
   return this.ctor.call(this, controller);
};
