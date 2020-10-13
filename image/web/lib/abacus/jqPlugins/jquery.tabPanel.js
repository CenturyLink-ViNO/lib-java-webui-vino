/*globals jQuery */
/*globals jsInclude */
jsInclude('lib/abacus/jqPlugins/jquery.utils.js'); /*global jqUtils */
jsInclude('lib/abacus/abacusUtils.js'); /*global AbacusUtils */

(function()
{
   jQuery.fn.tabPanel = function(settings)
   {
      var defaultSettings = { };
      var theSettings = jQuery.extend(defaultSettings, settings);

      var tabsDiv = jqUtils.div('tabs');
      tabsDiv.addClass('ui-tabs ui-widget ui-widget-content ui-corner-all');
      var tabList = jQuery('<ul/>');
      tabList.addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
      tabsDiv.append(tabList);

      var index;
      for (index = 0; index < theSettings.tabs.length; index = index + 1)
      {
         var thisTab = theSettings.tabs[index];
         var tabTitle = thisTab.title;
         var tabContent = thisTab.content;
         var isActive = thisTab.isActive !== undefined && thisTab.isActive === true;
         var id = 'tab_' + index + '_' + AbacusUtils.s4();
         var tabItem = jQuery('<li/>').prop('id', id).addClass('ui-state-default ui-corner-top');

         var href = jQuery('<a/>').prop('href', '#tabContent' + id);
         var span = jQuery('<span/>').prop('id', 'tabTitle' + id).text(tabTitle);
         href.append(span);
         tabItem.append(href);
         tabList.append(tabItem);

         var tabDiv = jqUtils.div('tabContent' + id).addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');
         tabDiv.append(tabContent);
         if (isActive)
         {
            tabDiv.addClass('ui-tabs-selected ui-state-active');
         }
         tabsDiv.append(tabDiv);
      }
      tabsDiv.tabs();
      jQuery(this).append(tabsDiv);
      // var tabs = jqUtils.div().addClass('ui-tabs ui-widget ui-widget-content ui-corner-all');
      // var tabList = jQuery('<ul/>');
      // tabList.addClass('ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all');
      // tabs.append(tabList);
      // var provisioningTab = jQuery('<li/>').addClass('ui-state-default ui-corner-top');
      // var provisioningHref = jQuery('<a/>').prop('href', '#hostConfigProvisioning');
      // provisioningTab.append(provisioningHref);
      // provisioningTab.append(this.stringTable.hostConfig.tab0);
      // tabList.append(provisioningTab);
      // var provisioningHolder = jqUtils.div('hostConfigProvisioning');
      // provisioningHolder.addClass('ui-tabs-panel ui-widget-content ui-corner-bottom');
      // provisioningHolder.append(this.provisioningServerDiv);
      // tabs.append(provisioningHolder);
      return this;
   };
}(jQuery));
