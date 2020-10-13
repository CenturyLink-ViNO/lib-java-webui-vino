/*globals jQuery */
/*globals jsInclude */
jsInclude('lib/abacus/jqPlugins/jquery.utils.js'); /*global jqUtils */
jsInclude('lib/abacus/abacusUtils.js');               /*global AbacusUtils */

(function()
{
   jQuery.fn.abacusWebServiceSourceConfiguration = function(data, strings, settings, typeSettings)
   {
      this.initialize = function(data, strings, settings, typeSettings)
      {
         var defaultSettings =
         {
            leftColumnStyle: 'tdLeftLabel',
            rightColumnStyle: 'tdRightInput',
            showUrl: false,
            showType: false
         };
         var defaultStrings =
         {
            server: 'Hostname or IP:',
            url: 'URL:',
            username: 'Username:',
            password: 'Password:',
            protocol: 'Protocol:',
            http: 'http',
            https: 'https',
            port: 'Port:',
            type: 'Server Type:'
         };
         var defaultData =
         {
            serverIp: '',
            url: '/',
            username: '',
            password: '',
            protocol: 'http',
            port: '80'
         };
         var defaultTypeSettings = { };
         this.settings = jQuery.extend(defaultSettings, settings);
         this.strings = jQuery.extend(defaultStrings, strings);
         this.typeSettings = jQuery.extend(defaultTypeSettings, typeSettings);
         var theData = jQuery.extend(defaultData, data);

         this.privateContent = this.buildContent();
         jQuery(this).append(this.privateContent);
         this.jsonData(theData);
      };
      this.jsonData = function(data, typeOptions)
      {
         if (typeOptions !== undefined)
         {
            this.updateTypeOptions(typeOptions);
         }
         if (data !== undefined)
         {
            this.serverIpControl.val(data.serverIp);
            this.urlControl.val(data.url);
            this.usernameControl.val(data.username);
            this.passwordControl.val(data.password);
            this.portControl.val(data.port);
            this.typeControl.val(data.type);
            if (data.protocol === 'http')
            {
               this.httpControl.attr('checked', 'checked');
            }
            else
            {
               this.httpsControl.attr('checked', 'checked');
            }
         }
         if (data === undefined && typeOptions === undefined)
         {
            var ret = {};
            ret.serverIp = this.serverIpControl.val();
            ret.url = this.urlControl.val();
            ret.username = this.usernameControl.val();
            ret.password = this.passwordControl.val();
            ret.protocol = this.httpControl.prop('checked') ? 'http' : 'https';
            ret.port = this.portControl.val();
            ret.type = this.typeControl.val();
            return ret;
         }
      };
      this.allowEdit = function(editable)
      {
         if (editable === true)
         {
            jqUtils.enableControl(this.serverIpControl);
            jqUtils.enableControl(this.urlControl);
            jqUtils.enableControl(this.usernameControl);
            jqUtils.enableControl(this.passwordControl);
            jqUtils.enableControl(this.portControl);
            jqUtils.enableControl(this.httpControl);
            jqUtils.enableControl(this.httpsControl);
            jqUtils.enableControl(this.typeControl);
         }
         else
         {
            jqUtils.disableControl(this.serverIpControl);
            jqUtils.disableControl(this.urlControl);
            jqUtils.disableControl(this.usernameControl);
            jqUtils.disableControl(this.passwordControl);
            jqUtils.disableControl(this.portControl);
            jqUtils.disableControl(this.httpControl);
            jqUtils.disableControl(this.httpsControl);
            jqUtils.disableControl(this.typeControl);
         }
      };
      this.buildContent = function()
      {
         var table = jQuery('<table/>');
         this.createControls();
         this.addInputRow(table, this.strings.server, this.serverIpControl);
         this.addInputRow(table, this.strings.protocol, this.protocolControl);
         this.addInputRow(table, this.strings.port, this.portControl);
         if (this.settings.showUrl === true)
         {
            this.addInputRow(table, this.strings.url, this.urlControl);
         }
         this.addInputRow(table, this.strings.username, this.usernameControl);
         this.addInputRow(table, this.strings.password, this.passwordControl);
         if (this.settings.showType === true)
         {
            this.addInputRow(table, this.strings.type, this.typeControl);
         }
         return table;
      };
      this.protocolChange = function()
      {
         var selectedProtocol = this.httpControl.prop('checked') ? 'http' : 'https';
         if (selectedProtocol === 'http')
         {
            this.portControl.val('80');
         }
         else
         {
            this.portControl.val('443');
         }
      };
      this.createControls = function()
      {
         this.serverIpControl = jqUtils.textEdit();
         this.urlControl = jqUtils.textEdit();
         this.usernameControl = jqUtils.textEdit();
         this.passwordControl = jqUtils.textEdit();
         this.portControl = jqUtils.numericEdit();
         this.createProtocolControls();
         this.createTypeControl();
      };
      this.createTypeControl = function()
      {
         this.typeControl = jQuery('<select/>');
         if (this.typeSettings.types !== undefined)
         {
            var index;
            for (index = 0; index < this.typeSettings.types.length; index = index + 1)
            {
               var thisType = this.typeSettings.types[index];
               var display = thisType.display;
               var value = thisType.value;
               this.addOption(this.typeControl, display, value);
            }
         }
      };
      this.updateTypeOptions = function(typeOptions)
      {
         this.typeControl.empty();
         var index;
         for (index = 0; index < typeOptions.length; index = index + 1)
         {
            var display = typeOptions[index].display;
            var value = typeOptions[index].value;
            this.addOption(this.typeControl, display, value);
         }
      };
      this.addOption = function(control, display, value)
      {
         var option = jQuery('<option/>');
         option.attr('value', value);
         option.append(display);
         control.append(option);
      };
      this.createProtocolControls = function()
      {
         var thisWssEditor = this;
         var radioName = 'protocolSelect_' + AbacusUtils.s4();

         this.httpControl = jQuery('<input/>');
         this.httpControl.attr('type', 'radio').attr('name', radioName).val('http');
         this.httpControl.click(function()
         {
            thisWssEditor.protocolChange();
         });
         var httpLabel = jQuery('<label/>').attr('for', 'http').text(this.strings.http);
         httpLabel.click(function()
         {
            thisWssEditor.protocolChange();
         });

         this.httpsControl = jQuery('<input/>');
         this.httpsControl.attr('type', 'radio').attr('name', radioName).val('https');
         this.httpsControl.click(function()
         {
            thisWssEditor.protocolChange();
         });
         var httpsLabel = jQuery('<label/>').attr('for', 'https').text(this.strings.https);
         httpsLabel.click(function()
         {
            thisWssEditor.protocolChange();
         });

         var protocolControl = jqUtils.div();
         protocolControl.append(this.httpControl);
         protocolControl.append(httpLabel);
         protocolControl.append(jQuery('<br/>'));
         protocolControl.append(this.httpsControl);
         protocolControl.append(httpsLabel);
         this.protocolControl = protocolControl;
      };
      this.addInputRow = function(table, label, control)
      {
         var row = jQuery('<tr/>');
         var cellLeft = jQuery('<td/>').addClass(this.settings.leftColumnStyle);
         var cellRight = jQuery('<td/>').addClass(this.settings.rightColumnStyle);
         row.append(cellLeft).append(cellRight);
         table.append(row);
         cellLeft.text(label);
         cellRight.append(control);
      };
      this.initialize(data, strings, settings, typeSettings);
      return this;
   };
}(jQuery));
