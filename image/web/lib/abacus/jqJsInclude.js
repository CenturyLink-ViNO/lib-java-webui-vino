/*global jQuery         */
/*global console        */

function jsInclude(scriptFilename)
{
   return jsInclude.includeOnce(scriptFilename);
}

jsInclude.includedFiles = {};

jsInclude.includeOnce = function(scriptFilename)
{
   var ret = false; // already loaded the script
   if (!this.inArray(scriptFilename))
   {
      this.includedFiles[scriptFilename] = scriptFilename;
      ret = this.includeAjax(scriptFilename);
   }
   else
   {
      ret = jQuery.Deferred(function(def)
      {
         def.resolve();
      });
   }
   return ret;
};

jsInclude.inArray = function(scriptFilename)
{
   return this.includedFiles.hasOwnProperty(scriptFilename);
};

// The following was initially posted at http://www.exit12.org/archives/12
jsInclude.includeAjax = function(scriptFilename)
{
   var deffered = jQuery.getScript(scriptFilename, function(data, textStatus, jqxhr)
   {
      if (jqxhr.status !== 200)
      {
         console.log('Failed to find script with url ' + scriptFilename);
      }
   });
   return deffered;
};
