/*globals pageModule  */
/*globals AbacusUtils */
/*globals jQuery */

var abacus = abacus || {};
abacus.WebServiceDocumentation = abacus.WebServiceDocumentation || {};

abacus.WebServiceDocumentation.View = function(controller, baseId)
{
   this.baseId = baseId;
   this.renderUiElement = function(data)
   {
      jQuery('#' + baseId + '-ftr').remove();
      var panel = jQuery('#' + baseId + '-bdy');
      this.addWebServiceInfo(data, panel);
   };
   this.showError = function(msg)
   {
      if (this.baseId !== null && this.baseId !== undefined)
      {
         pageModule.showError(this.baseId, msg);
      }
   };
   this.showSuccess = function(msg)
   {
      if (this.baseId !== null && this.baseId !== undefined)
      {
         pageModule.showSuccess(this.baseId, msg);
      }
   };
   this.addWebServiceInfo = function(data, panel)
   {
      var id = 'webServiceInfoPanelId';
      var i;
      if (data !== undefined &&
          data.WebServices !== undefined &&
          data.WebServices.webService !== undefined &&
          data.WebServices.webService.length !== undefined)
      {
         var main = jQuery('<div/>').addClass('panel-group').attr('id', id);
         main.attr('role', 'tablist').attr('aria-multiselectable', 'true');
         for (i = 0; i < data.WebServices.webService.length; i = i + 1)
         {
            var tmp = data.WebServices.webService[i];
            if (this.isValidAttr(tmp))
            {
               this.addWebService(tmp, main, id, i === 0);
            }
         }
         panel.append(main);
      }
      else
      {
         panel.append(jQuery('<div/>').append('No Web Service Documentation Found.'));
      }
   };
   this.isValidAttr = function(attr)
   {
      return attr !== undefined && attr !== null && attr !== 'null' && attr !== '';
   };
   this.addWebService = function(data, panel, parentId, open)
   {
      var uuid = AbacusUtils.guid();
      var headingId = 'heading_' + uuid;
      var id = 'collapse_' + uuid;
      var div = jQuery('<div/>').addClass('panel').addClass('panel-default');
      var heading = jQuery('<div/>').addClass('panel-heading').attr('role', 'tab').attr('id', headingId);
      var title = jQuery('<h4/>').addClass('panel-title');
      var anchor = jQuery('<a/>').attr('href', '#' + id);
      anchor.attr('data-toggle', 'collapse');
      anchor.attr('data-parent', parentId);
      anchor.attr('aria-controls', id);
      anchor.css('color', 'black');
      if (this.isValidAttr(data.displayName))
      {
         anchor.append(data.displayName);
      }
      else
      {
         anchor.append('Web Service Documentation');
      }
      if (open !== true)
      {
         anchor.addClass('collapsed');
         anchor.attr('aria-expanded', 'false');
      }
      else
      {
         anchor.attr('aria-expanded', 'true');
      }

      if (this.isValidAttr(data.publiclyAccessible))
      {
         if (data.publiclyAccessible !== 'true' && data.publiclyAccessible !== true)
         {
            anchor.append(' (Internal use only)');
         }
      }
      title.append(anchor);
      heading.append(title);
      div.append(heading);
      var body = jQuery('<div/>').addClass('panel-body').attr('id', id);
      body.addClass('panel-collapse').addClass('collapse');
      if (open === true)
      {
         body.addClass('in');
      }
      body.attr('role', 'tabpanel').attr('aria-labelledby', headingId);
      div.append(body);
      var bodyContent = jQuery('<div/>');
      body.append(bodyContent);
      var additional = jQuery('<div/>').append('Details');
      body.append(additional);
      var row;
      var container = jQuery('<div/>').addClass('container-fluid');
      additional.append(container);

      if (this.isValidAttr(data.docUrl))
      {
         anchor = jQuery('<a/>').attr('href', data.docUrl).attr('target', 'wsdocs').append(data.docUrl);
         row = jQuery('<div/>').addClass('row');
         row.append(jQuery('<div/>').addClass('col-md-2').append('Documentation:'));
         row.append(jQuery('<div/>').addClass('col-md-10').append(anchor));
         container.append(row);
      }
      if (this.isValidAttr(data.wadlUri))
      {
         anchor = jQuery('<a/>').attr('href', data.wadlUri).attr('target', 'wsdocs');
         anchor.append(data.wadlUri);
         row = jQuery('<div/>').addClass('row');
         row.append(jQuery('<div/>').addClass('col-md-2').append('WADL URI:'));
         row.append(jQuery('<div/>').addClass('col-md-10').append(anchor));
         container.append(row);
      }
      if (this.isValidAttr(data.detailedWadlUri))
      {
         anchor = jQuery('<a/>').attr('href', data.detailedWadlUri).attr('target', 'wsdocs');
         anchor.append(data.detailedWadlUri);
         row = jQuery('<div/>').addClass('row');
         row.append(jQuery('<div/>').addClass('col-md-2').append('Detailed WADL URI:'));
         row.append(jQuery('<div/>').addClass('col-md-10').append(anchor));
         container.append(row);
      }
      panel.append(div);

      if (this.isValidAttr(data.introUrl))
      {
         bodyContent.load(data.introUrl);
      }
   };
};
