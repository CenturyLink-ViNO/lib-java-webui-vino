/*globals jQuery */
/* exported BootstrapTabPanel */

function BootstrapTabPanel(parentDiv)
{
   'use strict';
   this.addTab = function(tabId, tabTitle, tabContent)
   {
      this.tabCount = this.tabCount + 1;

      var tab = jQuery('<li/>');
      if (this.tabCount === 1)
      {
         tab.addClass('active');
      }
      var tabHref = jQuery('<a/>').prop('href', '#' + tabId).prop('role', 'tab').prop('data-toggle', 'tab');
      tabHref.append(tabTitle);
      tab.append(tabHref);
      this.tabList.append(tab);
      tabHref.click(function(e)
      {
         e.preventDefault();
         jQuery(this).tab('show');
      });

      var tabPane = jQuery('<div/>').addClass('tab-pane').prop('id', tabId);
      if (this.tabCount === 1)
      {
         tabPane.addClass('fade').addClass('in').addClass('active');
      }
      tabPane.append(tabContent);
      this.tabPanels.append(tabPane);
   };
   this.clearTabs = function()
   {
      this.tabCount = 0;
      this.tabList.empty();
      this.tabPanels.empty();
   };
   this.ctor = function(parentDiv)
   {
      this.tabCount = 0;
      this.tabList = jQuery('<ul/>').addClass('nav').addClass('nav-tabs').prop('role', 'tablist');
      this.tabPanels = jQuery('<div/>').addClass('tab-content');

      // var mainDiv = jQuery('<div/>');
      // mainDiv.append(this.tabList);
      // mainDiv.append(this.tabPanels);
      // parentDiv.append(mainDiv);
      parentDiv.append(this.tabList);
      parentDiv.append(this.tabPanels);
   };
   this.ctor(parentDiv);
}
