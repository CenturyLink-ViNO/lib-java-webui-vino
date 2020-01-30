/*globals jQuery */
/*globals storageModule */
/*globals window */
/*globals productHomePage */
/*globals jsInclude */
/* exported pageModule */

function PageModule()
{
   this.loadingIcon = jQuery('<p/>').
      addClass('loadingIcon').
      css('text-align', 'center').
      append(jQuery('<img>').
         attr('src', '/lib/abacus/img/loading.gif'));
   this.addLoadingIcon = function(baseId, jqObj)
   {
      // Add a loading icon to the passed in element or id in the dom
      if (baseId !== null && baseId !== undefined)
      {
         jQuery('#' + baseId).append(this.loadingIcon.clone());
         return true;
      }
      else
      {
         return jqObj.append(this.loadingIcon.clone());
      }
   };
   this.getLoadingIcon = function()
   {
      var ico = this.loadingIcon.clone();
      ico.css('margin', '10px 0px 0px 0px');
      return ico;
   };
   this.removeLoadingIcon = function(baseId)
   {
      // Find the loading icon in the scope provided by baseId
      jQuery('.loadingIcon', jQuery('#' + baseId)).slideUp(1000, function()
      {
         jQuery(this).remove();
      });
   };
   this.loadingPanel = jQuery('<div/>').
      addClass('panel').
      addClass('panel-default').
      addClass('loadingIcon').
      append(jQuery('<div/>').
         addClass('panel-heading').
         append(jQuery('<h4/>').
            text('Loading...'))).
      append(jQuery('<div/>').
         addClass('panel-collapse').
         addClass('collapse').
         addClass('in').
         append(jQuery('<div/>').
            addClass('panel-body').
            append(this.loadingIcon)));
   this.loadingModalHeader = jQuery('<h4/>').
      addClass('modal-title').
      text('Loading...');
   this.loadingModal = jQuery('<div/>').
      addClass('modal fade').
      attr('id', 'loadingModal').
      append(jQuery('<div/>').
         addClass('modal-dialog').
         css('background-color', '#fff').
         css('border', '1px solid #8e8e8e').
         css('border-radius', '5px').
         append(jQuery('<div/>').
            addClass('modal-header').
            append(this.loadingModalHeader)).
         append(jQuery('<div/>').
            addClass('modal-body').
            append(jQuery('<p/>').
               addClass('loadingIcon').
               css('text-align', 'center').
               append(jQuery('<img>').
                  attr('src', '/lib/abacus/img/loading.gif')))));
   this.showLoadingModal = function(text)
   {
      if (text === undefined)
      {
         this.loadingModalHeader.text('Loading...');
      }
      else
      {
         this.loadingModalHeader.html(text);
      }
      jQuery('body').
         append(this.loadingModal);
      jQuery('#loadingModal').
         modal({
            backdrop: false,
            keyboard: false
         });
   };
   this.hideLoadingModal = function()
   {
      jQuery('#loadingModal').
         modal('hide').
         remove();
   };
   this.showSuccess = function(appendTo, message)
   {
      var alrt = jQuery('<div/>').
         addClass('alert').
         addClass('alert-success').
         addClass('fade').
         addClass('in').
         append(jQuery('<button/>').
            attr('type', 'button').
            addClass('close').
            attr('data-dismiss', 'alert').
            append(jQuery('<span/>').
               attr('aria-hidden', 'true').
               html('&times;')).
            append(jQuery('<span/>').
               addClass('sr-only').
               text('Close'))).
         append(jQuery('<div/>').
            append(jQuery('<span/>').
               addClass('glyphicon').
               addClass('glyphicon-ok')).
            append(jQuery('<strong/>').
               html('&nbsp;Success!'))).
         append(jQuery('<span/>').
            html(message));
      appendTo = '#' + appendTo;
      message = '&nbsp;' + message;
      jQuery(appendTo).
         prepend(alrt);
      jQuery('.alert').
         alert();
      window.setTimeout(function()
      {
         alrt.fadeTo(500, 0).
            slideUp(500, function()
            {
               jQuery(this).
                  remove();
            });
      }, 3000);
   };
   this.showError = function(appendTo, message)
   {
      var alrt = jQuery('<div/>').
         addClass('alert').
         addClass('alert-danger').
         addClass('fade').
         addClass('in').
         append(jQuery('<button/>').
            attr('type', 'button').
            addClass('close').
            attr('data-dismiss', 'alert').
            append(jQuery('<span/>').
               attr('aria-hidden', 'true').
               html('&times;')).
            append(jQuery('<span/>').
               addClass('sr-only').
               text('Close'))).
         append(jQuery('<div/>').
            append(jQuery('<span/>').
               addClass('glyphicon').
               addClass('glyphicon-fire')).
            append(jQuery('<strong/>').
               html('&nbsp;Error!'))).
         append(jQuery('<span/>').
            html(message));
      appendTo = '#' + appendTo;
      message = '&nbsp;' + message;
      jQuery(appendTo).
         prepend(alrt);
      jQuery('.alert').
         alert();
      window.setTimeout(function()
      {
         alrt.fadeTo(500, 0).
            slideUp(500, function()
            {
               jQuery(this).
                  remove();
            });
      }, 3000);
   };
   this.addHelpLink = function(panelH3, panel, helpUrl, baseId)
   {
      var helpIcon = jQuery('<span/>').
         addClass('glyphicon').
         addClass('glyphicon-question-sign');
      helpIcon.css('color', 'yellow');
      var anc = jQuery('<a/>').
         css('float', 'right').
         append(helpIcon);
      panelH3.append(anc);
      var helpModal = jQuery('<div/>').
         addClass('modal').
         addClass('fade');
      helpModal.attr('tabindex', '-1').
         attr('role', 'dialog');
      helpModal.attr('aria-labelledby', 'helpModalFor_' + baseId).
         attr('aria-hidden', 'true');
      helpModal.attr('id', 'pageHelp' + baseId);
      var modalDialog = jQuery('<div/>').
         addClass('modal-dialog');
      var modalContent = jQuery('<div/>').
         addClass('modal-content');
      modalDialog.append(modalContent);
      helpModal.append(modalDialog);
      //      if (accordian === undefined || accordian === false)
      //      {
      //         anc.attr('href', helpUrl)
      //            .attr('data-toggle', 'modal');
      //         anc.attr('data-target', '#pageHelp' + baseId);
      //         panel.append(helpModal);
      //      }
      //      else
      //      {
      anc.click(function()
      {
         modalContent.load(helpUrl);
         helpModal.on('hidden.bs.modal', function()
         {
            helpModal.remove();
         });
         helpModal.modal();
      });
      //      }
   };
   this.buildPage = function(baseId, pageTitle, helpUrl)
   {
      var root = jQuery('.page-item-class .page-container');
      var panel;
      var panelBody;
      var panelFooter;
      var ldg = this.loadingIcon;
      this.clearPage();
      panel = jQuery('<div/>').
         css('margin-top', '15px').
         addClass('panel').
         addClass('panel-primary');
      var panelHeading = jQuery('<div/>').
         addClass('panel-heading').
         attr('id', baseId + '-hdr');
      var panelH3 = jQuery('<h3/>').
         addClass('panel-title').
         html(pageTitle);
      panelHeading.append(panelH3);
      panel.append(panelHeading);
      panelBody = jQuery('<div/>').
         addClass('panel-body').
         attr('id', baseId + '-bdy');
      if (helpUrl !== undefined)
      {
         this.addHelpLink(panelH3, panel, helpUrl, baseId);
      }
      panelBody.append(ldg);
      panelFooter = jQuery('<div/>').
         addClass('panel-footer').
         attr('id', baseId + '-ftr');
      panel.append(panelBody);
      panel.append(panelFooter);
      root.prepend(panel);
      panel.hide();
      panel.fadeIn(1000);
   };
   this.buildAccordianPage = function(baseId)
   {
      var root = jQuery('.page-item-class .page-container'),
         panel,
         ldg = this.loadingPanel;
      this.clearPage();
      panel = jQuery('<div/>').
         css('margin-top', '15px').
         addClass('panel-group panel-primary').
         attr('id', baseId);
      panel.hide();
      panel.append(ldg);
      root.prepend(panel);
      panel.fadeIn(1000);
   };
   this.showLoadingPanel = function()
   {
      var root = jQuery('.page-item-class .page-container'),
         panel,
         ldg = this.loadingPanel;
      this.clearPage();
      panel = jQuery('<div/>').
         css('margin-top', '15px').
         addClass('panel-group panel-primary');
      panel.append(ldg);
      root.prepend(panel);
   };
   this.showLoadingPanelNoClear = function()
   {
      var root = jQuery('.page-item-class .page-container'),
         panel,
         ldg = this.loadingPanel;
      panel = jQuery('<div/>').
         css('margin-top', '15px').
         addClass('panel-group panel-primary');
      panel.append(ldg);
      root.prepend(panel);
   };
   this.buildAccordianPanel = function(baseId, title, defaultOpen, helpUrl)
   {
      var panelId = baseId + '-panel' + (jQuery('#' + baseId).
         children().
         length + 1);
      var panel;
      var extraClass = '';
      if (defaultOpen)
      {
         extraClass = 'in';
      }
      panel = jQuery('<div/>').
         addClass('panel').
         addClass('panel-primary');
      var heading = jQuery('<div/>').
         addClass('panel-heading');
      var h4 = jQuery('<h4/>').
         append(jQuery('<a/>').
            addClass('abacusCollapsable').
            attr('data-toggle', 'collapse').
            attr('data-parent', '#' + baseId).
            attr('href', '#' + panelId).
            html(title));
      heading.append(h4);
      panel.append(heading);
      panel.append(jQuery('<div/>').
         attr('id', panelId).
         addClass('panel-collapse').
         addClass('collapse').
         addClass(extraClass).
         append(jQuery('<div/>').
            attr('id', panelId + '-bdy').
            addClass('panel-body')));
      panel.insertBefore('#' + baseId);
      jQuery('#' + baseId).
         remove();
      if (helpUrl !== undefined)
      {
         this.addHelpLink(h4, panel, helpUrl, baseId, true);
      }
      return panelId;
   };
   this.doneLoading = function()
   {
      jQuery('.loadingIcon').
         fadeOut(1000, function()
         {
            jQuery(this).remove();
         });
      jQuery('.loadingIcon').
         slideUp(1000, function()
         {
            jQuery(this).remove();
         });
   };
   this.clearPage = function()
   {
      jQuery('.page-item-class .page-container').
         children().
         not('.push').
         remove();
      //jQuery('iframe').remove();
   };
   this.clearMenu = function()
   {
      jQuery('#site-nav ul').
         children().
         remove();
   };
   this.buildMenu = function()
   {
      return; // TODO: create the menu builder
   };
   this.showHomePage = function()
   {
      productHomePage.showHomePage();
   };
   this.loadAccordianPanel = function(script, title, baseId, open, fn)
   {
      var i;
      var args = [].slice.call(arguments).
         splice(1);
      args.pop();
      var namespaces = fn.split('.');
      var func = namespaces.pop();
      var context = window;
      var newBaseId = baseId + '-' + title.replace(/ /g, '_');
      jQuery('#' + baseId).
         append(jQuery('<div/>').
            attr('id', newBaseId).
            hide());
      baseId = newBaseId;
      args[1] = baseId;
      jQuery.getScript(script, function()
      {
         for (i = 0; i < namespaces.length; i = i + 1)
         {
            context = context[namespaces[i]];
         }
         context[func].apply(this, args);
      });
   };
   this.getCommandByName = function(commandName)
   {
      var i;
      var namespaces = commandName.split('.');
      var func = namespaces.pop();
      var context = window;
      for (i = 0; i < namespaces.length; i = i + 1)
      {
         context = context[namespaces[i]];
      }
      return context[func];
   };
   /**
    * Unloads a given module from the browser. If no module is specified then all modules loaded
    * after the initial page load
    */
   this.unloadModules = function(module)
   {
      var modules = storageModule.getItem('abacus.loadedModules'),
         i, fn, mod;
      if (module === 'undefined' || module === null)
      {
         for (i = 0; i < modules.length; i = i + 1)
         {
            mod = modules[i];
            /*jslint evil: true*/
            fn = new Function(mod.unregisterFunction);
            /*jslint evil: false*/
            fn();
            jQuery(mod.scriptId).
               remove();
         }
      }
      else
      {
         mod = modules[module];
         if (mod !== null && mod !== 'undefined' && mod !== undefined)
         {
            /*jslint evil: true*/
            fn = new Function(mod.unregisterFunction);
            /*jslint evil: false*/
            fn();
            jQuery(mod.scriptId).
               remove();
         }
      }
   };
   this.loadModule = function(modName, mod)
   {
      var modules = storageModule.getItem('abacus.loadedModules'),
         fn;
      if (modules === null || modules === 'undefined' || !modules.hasOwnProperty(modName))
      {
         if (modules === null || modules === 'undefined')
         {
            modules = [];
         }
         modules[modName] = mod;
         storageModule.setItem('abacus.loadedModules', JSON.stringify(modules));
         /*jslint evil: true*/
         fn = new Function(mod.pageFunction);
         /*jslint evil: false*/
         this.insertModuleScriptAndLoadPage(mod.script, mod.scriptId, fn);
         return true;
      }
      else if (modules.hasOwnProperty(modName))
      {
         modules[modName] = mod;
         storageModule.setItem('abacus.loadedModules', JSON.stringify(modules));
         /*jslint evil: true*/
         fn = new Function(mod.pageFunction);
         /*jslint evil: false*/
         this.insertModuleScriptAndLoadPage(mod.script, mod.scriptId, fn);
         return true;
      }
      else
      {
         return false;
      }
   };
   this.generateMenuItem = function(module, mod, parent)
   {
      jQuery.when(jsInclude(mod.script)).done(function()
      {
         /*jslint evil: true*/
         var fn = new Function(mod.pageFunction);
         /*jslint evil: false*/
         fn(parent);
      });
   };
   this.insertModuleScriptAndLoadPage = function(script, id, fn)
   {
      jQuery.getScript(script, function()
      {
         fn();
      });
   };
   this.getNewPanel = function(title)
   {
      // TODO: should the min-width, width, and float css settings be set on this element or set by the caller?
      var panel = jQuery('<div/>').
         attr('id', title.replace(/ /g, '_')).
         addClass('panel panel-default').
         css('min-width', '520px').
         css('width', 'calc(50% - 10px)').
         css('float', 'left').
         css('margin', '5px').
         append(jQuery('<div/>').
            addClass('panel-heading').
            append(jQuery('<h3/>').
               addClass('panel-title').
               html(title)));
      var body = jQuery('<div/>').
         addClass('panel-body');
      panel.append(body);
      return panel;
   };
   this.buildSelect = function(lab, items, selected)
   {
      var id = lab.replace(/\s/g, '_');
      lab = lab + '&nbsp';
      var root = jQuery('<div/>').
         addClass('form-group');
      var label = jQuery('<label/>').
         addClass('col-sm-4 control-label').
         css('padding-top', '0px').
         attr('for', id).
         html(lab);
      root.append(label);
      var select;
      var i;
      if (jQuery.isArray(selected))
      {
         select = jQuery('<select/>').
            attr('multiple', true).
            attr('size', 5).
            attr('name', id).
            attr('id', id);
      }
      else
      {
         select = jQuery('<select/>').
            attr('name', id).
            attr('id', id);
      }
      for (i = 0; i < items.length; i = i + 1)
      {
         select.append(jQuery('<option/>').
            attr('value', items[i].value).
            text(items[i].label));
      }
      select.val(selected);
      root.append(jQuery('<div/>').
         addClass('col-sm-8').
         append(select));
      return root;
   };
}
var pageModule = new PageModule();
