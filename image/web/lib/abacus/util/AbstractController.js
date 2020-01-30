/*globals window*/
/*globals jQuery*/
/*globals jsInclude*/
window.AbstractController = function()
{
   this.loadJs = function(files)
   {
      var def = new jQuery.Deferred(function(deferred)
      {
         if (Array.isArray(files))
         {
            var i;
            var prms = [];
            for (i = 0; i < files.length; i = i + 1)
            {
               prms.push(jsInclude(files[i]));
            }
            jQuery.when.apply(jQuery, prms).done(function()
            {
               deferred.resolve();
            }).fail(function()
            {
               deferred.reject();
            });
         }
         else
         {
            jQuery.when(jsInclude(files)).done(function()
            {
               deferred.resolve();
            }).fail(function()
            {
               deferred.reject();
            });
         }
      });
      return def.promise();
   };
};
