var abacus = abacus || {};

abacus.Json = function()
{
   // do nothing -- this class is all 'static' members
};

abacus.Json.objectToJson = function(object)
{
   var prop;
   var json = {};
   for (prop in object)
   {
      if (object.hasOwnProperty(prop) && typeof object[prop] !== 'function')
      {
         if (object[prop] !== null && object[prop] !== '' && typeof object[prop] !== 'undefined')
         {
            json[prop] = object[prop];
         }
      }
   }
   return json;
};
abacus.Json.toJsonString = function(object)
{
   return JSON.stringify(abacus.Json.objectToJson(object));
};
abacus.Json.updateObjectFromJson = function(json, object)
{
   var prop;
   if (typeof json === 'string' || json instanceof String)
   {
      json = JSON.parse(json);
   }
   if (json !== undefined && json !== null)
   {
      for (prop in json) // object)
      {
         if (typeof json[prop] !== 'function' && abacus.Json.checkValueExists(object, prop))
         {
            object[prop] = json[prop];
         }
      }
   }
};
abacus.Json.checkValueExists = function(object, prop)
{
   return object.hasOwnProperty(prop);
};
