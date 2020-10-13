/*globals storageModule*/
/*globals window*/
/*globals pageModule*/
/*globals AbacusUtils*/
/*globals AbstractModel*/
/*globals jQuery*/
/* exported menuBuilderModule */
function MenuBuilderModule()
{
   'use strict';
   this.menuUpdaterInverval = null;

   this.tlms =
   {
      'abacus-main-menu': true,
      'ui-ctrl-menu': true
   };
   this.enableMenu = function()
   {
      var module = this;
      storageModule.removeItem('abacus.menu.items');
      this.updateMenu();
      this.menuUpdaterInverval = window.setInterval(function()
      {
         module.updateMenu();
      }, 120000);
   };
   this.disableMenu = function()
   {
      var module = this;
      window.clearInterval(module.menuUpdaterInverval);
      pageModule.clearMenu();
   };
   this.buildMenu = function()
   {
      var module = this;
      var prevMenu = storageModule.getItem('abacus.menu.items');
      var response = false;
      var control_menu;
      var main_menu;
      var url = 'ui/web-ui/menus';
      var success = function(data)
      {
         response = data;
         if (typeof data === 'string' || data instanceof String)
         {
            response = JSON.parse(data);
         }
         if (!response.hasOwnProperty('error'))
         {
            var needUpdate = false;
            if (prevMenu !== null && prevMenu !== 'undefined')
            {
               if (JSON.stringify(prevMenu) !== JSON.stringify(response))
               {
                  needUpdate = true;
               }
            }
            else
            {
               needUpdate = true;
            }
            if (needUpdate)
            {
               storageModule.setItem('abacus.menu.items', JSON.stringify(response));
               pageModule.clearMenu();
               if (response.hasOwnProperty('control_menu') && response.control_menu !== null)
               {
                  control_menu = response.control_menu.children;
                  module.menuJsonToList(control_menu, jQuery('#ui-ctrl-menu'));
               }
               if (response.hasOwnProperty('main_menu') && response.main_menu !== null)
               {
                  main_menu = response.main_menu.children;
                  module.menuJsonToList(main_menu, jQuery('#abacus-main-menu'));
               }
               jQuery.getScript('lib/abacus-ots/smartMenus/jquery.smartmenus.bootstrap.js');
            }
         }
      };
      var fail = function()
      {
         return;
      };
      this.callWebservice(url, 'GET', null, null, success, fail);
   };
   this.updateMenu = function()
   {
      var items = jQuery('.navbar-nav .highlighted').length;
      if (items === 0)
      {
         this.buildMenu();
      }
   };
   this.insertGeneratorScript = function(script, fn, id, parent, module)
   {
      var mod =
      {
         'pageFunction': fn,
         'script': script,
         'scriptId': id,
         'unregisterFunction': null
      };
      pageModule.generateMenuItem(module, mod, parent);
   };
   this.clickHandlerFactory = function(item)
   {
      if (item.script !== 'undefined' && item.script_id !== 'undefined')
      {
         return function()
         {
            var mod =
            {
               'pageFunction': item.command,
               'script': item.script,
               'scriptId': item.script_id,
               'unregisterFunction': item.menu_item_unregister_command
            };
            pageModule.loadModule(item.module, mod);
         };
      }
      else
      {
         return function()
         {
            item.command();
         };
      }
   };
   this.menuJsonToList = function(object, parent)
   {
      var outer = this;
      var item;
      var node;
      var anchor;
      var menu;
      var i;
      var fn;
      for (i = 0; i < object.length; i = i + 1)
      {
         anchor = jQuery('<a/>');
         item = object[i];
         if (item.hasOwnProperty('glyphicon') && item.glyphicon !== null)
         {
            anchor.append(jQuery('<span/>').addClass('glyphicon').addClass('glyphicon-' + item.glyphicon));
         }
         anchor.append(jQuery('<span/>').html(item.title));
         anchor.attr('href', '#');
         if (item.target !== 'undefined' && item.target !== null)
         {
            anchor.attr('target', item.target);
         }
         if (item.hasOwnProperty('generator') &&
             item.generator !== null &&
             item.generator !== undefined &&
             item.generator !== '')
         {
            if (!item.hasOwnProperty('script_id') ||
               (item.script_id === null ||
                item.script_id === undefined ||
                item.script_id === ''))
            {
               item.script_id = AbacusUtils.guid();
            }
            if (item.hasOwnProperty('script') &&
                item.script !== null &&
                item.hasOwnProperty('script_id') &&
                item.script_id !== null)
            {
               // The menu item script id is generated by the web service, and is not in the database
               outer.insertGeneratorScript(item.script, item.generator, item.script_id, parent, item.module);
            }
            else
            {
               /*jslint evil: true */
               fn = new Function(item.generator);
               /*jslint evil: false */
               fn(parent);
            }
         }
         else
         {
            if (item.hasOwnProperty('command') && item.command !== null)
            {
               anchor.on('click', outer.clickHandlerFactory(item));
            }
            else if (item.hasOwnProperty('url') && item.url !== null)
            {
               anchor.attr('href', item.url);
               if (item.target !== 'undefined' && item.target !== null)
               {
                  anchor.attr('target', item.target);
               }
               if (item.menu_item_target !== 'undefined' && item.menu_item_target !== null)
               {
                  anchor.attr('target', item.menu_item_target);
               }
            }
            if (item.hasOwnProperty('children'))
            {
               menu = jQuery('<li/>');
               if (outer.tlms.hasOwnProperty(parent.attr('id')))
               {
                  anchor.addClass('top-level');
                  menu.addClass('top-level');
               }
               menu.append(anchor);
               node = jQuery('<ul/>');
               node.addClass('dropdown-menu');
               menu.append(node);
               parent.append(menu);
               outer.menuJsonToList(item.children, node);
            }
            else
            {
               node = jQuery('<li/>');
               if (outer.tlms.hasOwnProperty(parent.attr('id')))
               {
                  anchor.addClass('top-level');
                  node.addClass('top-level');
               }
               node.append(anchor);
               // Ensure that the 'Home' link is always first in the menu.
               if (item.title === ' Main')
               {
                  parent.prepend(node);
               }
               else
               {
                  parent.append(node);
               }
            }
         }
      }
   };
   this.ctor = function()
   {
      jQuery.extend(this, new AbstractModel());
      return this;
   };
   return this.ctor();
}

var menuBuilderModule = new MenuBuilderModule();
