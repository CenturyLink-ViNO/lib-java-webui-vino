/*globals window*/
/*globals jQuery*/
window.AbacusWhitelistedAddress = function(inData, controller)
{
   this.address = '';

   this.format = {
      address:
      {
         label: 'Address',
         id: 'address'
      },
      showCancel: true
   };
   var notEmpty = function(object)
   {
      var ret = false;
      if (object !== null || object !== undefined || object !== '')
      {
         ret = true;
      }
      return ret;
   };
   var fromJson = function(data)
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
   this.ctor = function(inData, controller)
   {
      var update = false;
      if (inData.hasOwnProperty('updating') && inData.updating === true)
      {
         update = true;
      }
      if (notEmpty(inData))
      {
         fromJson.call(this, inData);
      }
      var object = this;
      object.controller = controller;
      object.format.submitFunction = function(dataObject, table)
      {
         var obj = dataObject;
         return function(btn)
         {
            var updated;
            btn.button('loading');
            updated = object.controller.updateFromForm(obj);
            if (update)
            {
               jQuery.when(object.controller.updateAddress(updated)).
                  done(function(data)
                  {
                     object.controller.view.showSuccess(
                        object.controller.baseId,
                        'Successfully updated address'
                     );
                     var row = jQuery('#' + object.controller.view.tableId + ' .selected')[0];
                     if (table !== undefined)
                     {
                        table.fnUpdate(data, row);
                     }
                  }).
                  fail(function()
                  {
                     object.controller.view.showError(object.controller.baseId, 'Unknown Error');
                  }).
                  always(function()
                  {
                     jQuery('.modal').
                        remove();
                     btn.button('reset');
                  });
            }
            else
            {
               jQuery.when(object.controller.addAddress(updated)).
                  done(function(data)
                  {
                     object.controller.view.showSuccess(
                        object.controller.baseId,
                        'Successfully added new Address'
                     );
                     table.fnAddData(data);
                  }).
                  fail(function()
                  {
                     object.controller.view.showError(object.controller.baseId, 'Unknown Error');
                  }).
                  always(function()
                  {
                     jQuery('.modal').
                        remove();
                     btn.button('reset');
                  });
            }
            return;
         };
      };
      return object;
   };
   this.toJson = function()
   {
      var param;
      var json = {};
      for (param in this)
      {
         if (this.hasOwnProperty(param) && param !== 'toJson' && typeof this[param] !== 'function' &&
                 typeof this[param] !== 'object' && param !== 'controller')
         {
            json[param] = this[param];
         }
      }
      return json;
   };
   return this.ctor.call(this, inData, controller);
};
