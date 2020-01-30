/*globals window*/
/*globals jQuery*/
/*globals userModule*/
window.AbstractModel = function()
{
   this.callWebservice = function(url, method, dataType, data, success, failure)
   {
      if (typeof data !== 'string' && data !== null && data !== undefined)
      {
         data = JSON.stringify(data);
      }
      if (!method)
      {
         method = 'GET';
      }
      if (!dataType)
      {
         dataType = 'json';
      }
      var username = userModule.keycloak.tokenParsed.preferred_username;
      userModule.keycloak.updateToken(30).success(function()
      {
         jQuery.ajax({
            url: url,
            type: method,
            dataType: dataType,
            data: data,
            success: success,
            contentType: 'application/' + dataType,
            error: failure,
            beforeSend: function(xhr)
            {
               xhr.setRequestHeader('Authorization', 'Bearer ' + userModule.keycloak.token);
            }
         });
      }).error(function()
      {
         userModule.keycloak.login({
            redirectUri: '/',
            loginHint: username
         });
      });
   };

   this.ctor = function()
   {
      return this;
   };
   return this.ctor.call(this);
};
