/*globals pageModule*/
/*globals storageModule*/
/*globals menuBuilderModule*/
/*globals window*/
/*globals document*/
/*globals Keycloak */
/*globals jQuery*/
function UserModule()
{
   'use strict';
   this.user = '';
   this.email = '';
   this.token = '';

   this.keycloak = Keycloak('lib/abacus/user/keycloak.json');

   String.prototype.capitalize = function()
   {
      return this.charAt(0).toUpperCase() + this.slice(1);
   };

   this.postLogin = function()
   {
      if (menuBuilderModule !== undefined)
      {
         menuBuilderModule.enableMenu();
      }
      pageModule.showHomePage();
   };

   this.addUserPanel = function()
   {
      var module = this,
         menuItem = null,
         subMenu = null,
         acctSettings = null,
         logOutLi = null;
      menuItem = jQuery('<li/>').
         addClass('top-level').
         append(jQuery('<a/>').
            attr('href', '#').
            addClass('top-level').
            html('<span class="glyphicon glyphicon-user"></span>&nbsp;' + module.user.capitalize()));
      subMenu = jQuery('<ul/>').addClass('dropdown-menu');

      acctSettings = jQuery('<li/>').
         append(jQuery('<a/>').
            attr('href', '#').
            on('click', function(event)
            {
               event.preventDefault();
               module.keycloak.accountManagement();
            }).
            text('Account Settings'));
      logOutLi = jQuery('<li/>').
         append(jQuery('<a/>').
            attr('href', '#').
            on('click', function(event)
            {
               event.preventDefault();
               module.keycloak.logout({ redirectUri: window.location.href });
            }).
            html('<span class="glyphicon glyphicon-off"></span>&nbsp;Log Out'));
      menuItem.append(subMenu.append(acctSettings).append(logOutLi));
      jQuery('#ui-ctrl-menu').append(menuItem);
   };

   this.checkLogin = function()
   {
      var module = this;
      module.keycloak.init({ onLoad: 'check-sso', responseMode: 'query' }).success(function(authenticated)
      {
         if (authenticated)
         {
            module.token = module.keycloak.token;
            module.user = module.keycloak.idTokenParsed.preferred_username;
            module.email = module.keycloak.idTokenParsed.email;
            module.postLogin();
         }
         else
         {
            storageModule.removeItem('auth-tokens');
            module.token = null;
            module.user = null;
            module.email = null;
            module.showLogin();
         }
      });
   };

   this.showLogin = function()
   {
      var module = this,
         id, modal, modalHeader, modalBody;
      if (module.loginUp !== true)
      {
         module.loginUp = true;
         id = 'auth-modal'; // This should be a unique name
         modal = jQuery('<div/>').
            addClass('modal').
            addClass('fade').
            css('top', '200px').
            attr('id', id).
            append(jQuery('<div/>').
               addClass('modal-dialog').
               append(jQuery('<div/>').
                  addClass('modal-content')));
         modalHeader = jQuery('<div/>').
            addClass('modal-header').
            append(jQuery('<h4/>').
               addClass('modal-title').
               html('<span class="glyphicon glyphicon-lock"></span>&nbsp;Authentication Required'));

         modalBody = jQuery('<div/>').
            addClass('modal-body').
            append(jQuery('<form/>').
               attr('role', 'form').
               append(jQuery('<div/>').
                  addClass('form-group').
                  append(jQuery('<label/>').
                     text('You must be authenticated to access this application. ' +
                                'Clicking the authenticate button below will redirect you to the' +
                                ' authentication server.'))).
               append(jQuery('<div/>').
                  addClass('form-group').
                  css('text-align', 'right').
                  append(jQuery('<button/>').
                     attr('type', 'submit').
                     addClass('btn btn-default').
                     text('Authenticate').
                     on('click', function(event)
                     {
                        event.preventDefault();
                        module.keycloak.init({ onLoad: 'login-required', responseMode: 'query' }).
                           success(function(authenticated)
                           {
                              if (authenticated)
                              {
                                 module.token = module.keycloak.token;
                                 module.user = module.keycloak.idTokenParsed.preferred_username;
                                 module.email = module.keycloak.idTokenParsed.email;
                                 module.postLogin();
                              }
                              else
                              {
                                 storageModule.removeItem('auth-tokens');
                                 module.token = null;
                                 module.user = null;
                                 module.email = null;
                                 module.showLogin();
                              }
                           });
                     }))));

         /*modalFooter = jQuery('<div/>')
             .addClass('modal-footer');*/

         jQuery('.page-item-class .page-container').prepend(modal);
         jQuery('#' + id + ' .modal-content').append(modalHeader);
         jQuery('#' + id + ' .modal-content').append(modalBody);
         //jQuery('#' + id + ' .modal-content').append(modalFooter);
         jQuery('#' + id).modal({
            backdrop: false,
            keyboard: false
         });
         jQuery('#' + id).modal('show');
      }
   };
}

var userModule = new UserModule();

jQuery(document).ready(function()
{
   'use strict';
   pageModule.clearPage();
   userModule.checkLogin();
});
