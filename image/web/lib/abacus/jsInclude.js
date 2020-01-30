/*global XMLHttpRequest */
/*global ActiveXObject */
/*global window */
/*global document */
/*global location */
/*global alert */

function jsInclude(scriptFilename)
{
   jsInclude.includeOnce(scriptFilename);
}

jsInclude.includedFiles = [];

jsInclude.includeOnce = function(scriptFilename)
{
   if (!this.inArray(scriptFilename, this.includedFiles))
   {
      this.includedFiles[this.includedFiles.length] = scriptFilename;
      this.includeAjax(scriptFilename);
   }
};

jsInclude.inArray = function(scriptFilename)
{
   var ret = false;
   var i;
   for (i = 0; i < this.includedFiles.length; i = i + 1)
   {
      if (this.includedFiles[i] === scriptFilename)
      {
         ret = true;
         break;
      }
   }
   return ret;
};

// The following was initially posted at http://www.exit12.org/archives/12
jsInclude.includeAjax = function(scriptFilename)
{
   var req;
   if (location.protocol === 'file:')
   {
      var fileref = document.createElement('script');
      fileref.setAttribute('type', 'text/javascript');
      fileref.setAttribute('src', scriptFilename);
   }
   else
   {
      if (window.XMLHttpRequest)
      {
         req = new XMLHttpRequest();
      }
      else
      {
         req = new ActiveXObject('Microsoft.XMLHTTP');
      }
      if (req !== undefined)
      {
         try
         {
            req.open('GET', scriptFilename, false);
            req.send();
            if (req.responseText.indexOf('<html>') === 0 &&
                req.responseText.indexOf('HTTP Status 404') !== -1)
            {
               alert('Unable to find requested file on server: ' + scriptFilename);
            }
            else
            {
               try
               {
                  if (window.execScript) // IE doesn't have eval
                  {
                     window.execScript(req.responseText);
                  }
                  else
                  {
                     window.eval(req.responseText);
                  }
               }
               catch (err)
               {
                  alert('Error while including ' + scriptFilename +
                        '\nName: [' + err.name + '\nMessage:' + err.message);
               }
            }
         }
         catch (err2)
         {
            alert('Error while sending reqest to include ' + scriptFilename +
                  '\nName: [' + err2.name + '\nMessage:' + err2.message);
         }
      }
   }
};
