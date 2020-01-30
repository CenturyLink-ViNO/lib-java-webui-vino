/*global abacusAsmUserLogin */
/*global abacusAsmUserIpAddr */
/*global window */
/*global navigator */
/*globals jQuery */
/*globals document */

function AbacusUtils()
{
   /* nothing -- this class is all 'static' members */
}

AbacusUtils.areCookiesEnabled = function()
{
   var cookieEnabled = navigator.cookieEnabled ? true : false;
   if (typeof navigator.cookieEnabled === 'undefined' && !cookieEnabled)
   {
      document.cookie = 'testcookie';
      cookieEnabled = document.cookie.indexOf('testcookie') !== -1 ? true : false;
   }
   return cookieEnabled;
};

AbacusUtils.int_KBytes = 1000;
AbacusUtils.int_MBytes = 1000 * 1000;
AbacusUtils.int_GBytes = 1000 * 1000 * 1000;
AbacusUtils.enableDebug = false;

AbacusUtils.byteUnits = [{ 'label': 'KB', 'value': AbacusUtils.int_KBytes }, { 'label': 'MB', 'value': AbacusUtils.int_MBytes }, { 'label': 'GB', 'value': AbacusUtils.int_GBytes }];

AbacusUtils.s4 = function()
{
   return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
};

AbacusUtils.guid = function()
{
   return AbacusUtils.s4() + AbacusUtils.s4() + '-' +
          AbacusUtils.s4() + '-' +
          AbacusUtils.s4() + '-' +
          AbacusUtils.s4() + '-' +
          AbacusUtils.s4() + AbacusUtils.s4() + AbacusUtils.s4();
};

AbacusUtils.convertBytesToGigabytes = function(input)
{
   return (input / AbacusUtils.int_GBytes).toFixed(2);
};

AbacusUtils.formatByteCount = function(input)
{
   return AbacusUtils.addCommas(input);
};

AbacusUtils.addCommas = function(nStr)
{
   nStr += '';
   var x = nStr.split('.');
   var x1 = x[0];
   var x2 = x.length > 1 ? '.' + x[1] : '';
   var rgx = /(\d+)(\d{3})/;
   while (rgx.test(x1))
   {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
   }
   return x1 + x2;
};

AbacusUtils.digits2 = function(input)
{
   var tmp = parseInt(input, 10);
   var ret = '';
   ret += tmp;
   if (tmp < 10)
   {
      ret = '0' + ret;
   }
   return ret;
};

AbacusUtils.formatShortDate = function(input)
{
   var d = new Date(parseInt(input, 10));
   var month = AbacusUtils.digits2(d.getMonth() + 1);
   var date = AbacusUtils.digits2(d.getDate());
   // var hours = AbacusUtils.digits2(d.getHours());
   // var minutes = AbacusUtils.digits2(d.getMinutes());
   // var seconds = AbacusUtils.digits2(d.getSeconds());
   var tmp = '';
   tmp += d.getFullYear() + '-' + month + '-' + date;
   return tmp;
};

AbacusUtils.formatShortDateTime = function(input)
{
   var d = new Date(parseInt(input, 10));
   var month = AbacusUtils.digits2(d.getMonth() + 1);
   var date = AbacusUtils.digits2(d.getDate());
   var hours = AbacusUtils.digits2(d.getHours());
   var minutes = AbacusUtils.digits2(d.getMinutes());
   var seconds = AbacusUtils.digits2(d.getSeconds());
   var tmp = '';
   tmp += d.getFullYear() + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
   return tmp;
   // return d.toString('yyyy-MM-dd HH:MM:SS');
};

AbacusUtils.formatShortUTCDateTime = function(input)
{
   var d = new Date(parseInt(input, 10));
   var month = AbacusUtils.digits2(d.getUTCMonth() + 1);
   var date = AbacusUtils.digits2(d.getUTCDate());
   var hours = AbacusUtils.digits2(d.getUTCHours());
   var minutes = AbacusUtils.digits2(d.getUTCMinutes());
   var seconds = AbacusUtils.digits2(d.getUTCSeconds());
   var tmp = '';
   tmp += d.getFullYear() + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
   return tmp;
   // return d.toString('yyyy-MM-dd HH:MM:SS');
};

AbacusUtils.toMonetaryUnit = function(numIn)
{
   var i;
   var numStr = numIn.toString().replace(/\$|,/g, '');
   if (isNaN(numStr))
   {
      numStr = '0';
   }
   var num = Number(numStr);
   var sign = num === (num = Math.abs(num));
   num = Math.floor(num * 100 + 0.50000000001);
   var cents = num % 100;
   num = Math.floor(num / 100).toString();
   if (cents < 10)
   {
      cents = '0' + cents;
   }
   for (i = 0; i < Math.floor((num.length - (1 + i)) / 3); i = i + 1)
   {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
   }
   return (sign ? '' : '-') + '$' + num + '.' + cents;
};

AbacusUtils.seconds = 1;
AbacusUtils.minutes = 60 * AbacusUtils.seconds;
AbacusUtils.hours = 60 * AbacusUtils.minutes;
AbacusUtils.days = 24 * AbacusUtils.hours;
AbacusUtils.weeks = 7 * AbacusUtils.days;

AbacusUtils.timeUnits = [{ 'label': 'Seconds', 'value': AbacusUtils.seconds }, { 'label': 'Minutes', 'value': AbacusUtils.minutes }, { 'label': 'Hours', 'value': AbacusUtils.hours }, { 'label': 'Days', 'value': AbacusUtils.days }, { 'label': 'Weeks', 'value': AbacusUtils.weeks }];

AbacusUtils.toNaturalUnitTimeStruct = function(input) // starts in seconds
{
   var ret = {};

   if (input !== undefined)
   {
      ret.value = input;
      ret.scale = 1;
      ret.unit = 'Seconds';
      if (ret.value >= AbacusUtils.weeks)
      {
         ret.scale = AbacusUtils.weeks;
         ret.value = ret.value / AbacusUtils.weeks;
         ret.unit = 'Weeks';
      }
      else
      {
         if (ret.value >= AbacusUtils.days)
         {
            ret.scale = AbacusUtils.days;
            ret.value = ret.value / AbacusUtils.days;
            ret.unit = 'Days';
         }
         else
         {
            if (ret.value >= AbacusUtils.hours)
            {
               ret.scale = AbacusUtils.hours;
               ret.value = ret.value / AbacusUtils.hours;
               ret.unit = 'Hours';
            }
            else
            {
               if (ret.value >= AbacusUtils.minutes)
               {
                  ret.scale = AbacusUtils.minutes;
                  ret.value = ret.value / AbacusUtils.minutes;
                  ret.unit = 'Minutes';
               }
            }
         }
      }
   }
   ret.value = ret.value.toFixed(2);
   return ret;
};

AbacusUtils.toNaturalUnitStruct = function(input)
{
   var ret = {};
   ret.initial = input;
   if (input >= AbacusUtils.int_GBytes)
   {
      ret.value = (input / AbacusUtils.int_GBytes).toFixed(2);
      ret.unit = 'GB';
      ret.scale = AbacusUtils.int_GBytes;
   }
   else
   {
      if (input >= AbacusUtils.int_MBytes)
      {
         ret.value = (input / AbacusUtils.int_MBytes).toFixed(2);
         ret.unit = 'MB';
         ret.scale = AbacusUtils.int_MBytes;
      }
      else
      {
         if (input >= AbacusUtils.int_KBytes)
         {
            ret.value = (input / AbacusUtils.int_KBytes).toFixed(2);
            ret.unit = 'KB';
            ret.scale = AbacusUtils.int_KBytes;
         }
         else
         {
            ret.value = input;
            ret.unit = 'B';
            ret.scale = 1;
         }
      }
   }
   return ret;
};

AbacusUtils.toNaturalUnit = function(input)
{
   var ret = '';
   var temp;
   if (input >= AbacusUtils.int_GBytes)
   {
      temp = (input / AbacusUtils.int_GBytes).toFixed(2);
      ret = String(temp) + ' GB';
   }
   else
   {
      if (input >= AbacusUtils.int_MBytes)
      {
         temp = (input / AbacusUtils.int_MBytes).toFixed(2);
         ret = String(temp) + ' MB';
      }
      else
      {
         if (input >= AbacusUtils.int_KBytes)
         {
            temp = (input / AbacusUtils.int_KBytes).toFixed(2);
            ret = String(temp) + ' KB';
         }
         else
         {
            temp = input;
            ret = String(temp) + ' B';
         }
      }
   }
   return ret;
};

AbacusUtils.determinePercent = function(one, two)
{
   return (one / two * 100).toFixed(0);
};

AbacusUtils.appendSubscriberDataToUrl = function(url)
{
   var sep;
   var subscriberId = jQuery.cookie('abacus_username');
   var requestIp = jQuery.cookie('abacus_requestIp');

   if ((subscriberId === '' || subscriberId === null) &&
       (requestIp === '' || requestIp === null))
   {
      // no cookies set, use real values
      if (typeof abacusAsmUserLogin !== 'undefined')
      {
         if (abacusAsmUserLogin !== null &&
           abacusAsmUserLogin !== '' &&
           abacusAsmUserLogin !== 'unknown')
         {
            subscriberId = abacusAsmUserLogin;
         }
      }
      if (typeof abacusAsmUserIpAddr !== 'undefined')
      {
         if (abacusAsmUserIpAddr !== null && abacusAsmUserIpAddr !== '')
         {
            requestIp = abacusAsmUserIpAddr;
         }
         else
         {
            requestIp = jQuery.cookie('cachedip');
         }
      }
      else
      {
         requestIp = jQuery.cookie('cachedip');
      }
   }
   if (subscriberId !== null &&
       subscriberId !== '' &&
       subscriberId !== 'unknown')
   {
      sep = url.indexOf('?') >= 0 ? '&' : '?';
      url = url + sep + 'subscriberId=' + subscriberId;
   }
   else
   {
      if (requestIp !== null && requestIp !== '')
      {
         sep = url.indexOf('?') >= 0 ? '&' : '?';
         url = url + sep + 'requestIp=' + requestIp;
      }
   }

   var a = jQuery('#a').val();
   if (a !== null && a !== '')
   {
      sep = url.indexOf('?') >= 0 ? '&' : '?';
      url = url + sep + 'a=' + a;
   }

   return url;
};

AbacusUtils.addParamsToUrl = function(url, params)
{
   var index = 0;
   for (index = 0; index < params.length; index = index + 1)
   {
      url = url + '&' + params[index].key + '=' + params[index].value;
   }
   return url;
};

AbacusUtils.appendSubscriberDataToUrlWithParams = function(url, params)
{
   url = AbacusUtils.appendSubscriberDataToUrl(url);
   url = AbacusUtils.addParamsToUrl(url, params);
   return url;
};

AbacusUtils.appendParamsToUrl = function(url, params)
{
   AbacusUtils.consoleLog('appendParamsToUrl');
   AbacusUtils.consoleDir(params);
   url = url + '?' + params[0].key + '=' + params[0].value;
   var index = 1;
   for (index = 1; index < params.length; index = index + 1)
   {
      url = url + '&' + params[index].key + '=' + params[index].value;
   }
   return url;
};

AbacusUtils.getRequestIp = function()
{
   var requestIp = jQuery.cookie('abacus_requestIp');

   if (requestIp === '' || requestIp === null)
   {
      // no cookies set, use real values
      if (typeof abacusAsmUserIpAddr !== 'undefined')
      {
         if (abacusAsmUserIpAddr !== null && abacusAsmUserIpAddr !== '')
         {
            requestIp = abacusAsmUserIpAddr;
         }
         else
         {
            requestIp = jQuery.cookie('cachedip');
         }
      }
      else
      {
         requestIp = jQuery.cookie('cachedip');
      }
   }
   return requestIp;
};

/* Helper function
 * set the checkbox element based on the data value, using jquery */
AbacusUtils.updCheckboxWithData = function(dataVal, dataField)
{
   if (dataVal === true || dataVal === 'true')
   {
      jQuery(dataField).prop('checked', 'checked');
   }
   else
   {
      jQuery(dataField).removeAttr('checked');
   }
};

/* convert a request value, either boolean or boolean string, to boolean */
AbacusUtils.rqst2Bool = function(flag)
{
   if (!flag)
   {
      flag = false;
   }
   else
   {
      if (flag === 'true')
      {
         flag = true;
      }
      else
      {
         if (flag === 'false')
         {
            flag = false;
         }
      }
   }
   return flag;
};

AbacusUtils.getPortRule = function()
{
   var portRule = {
      required: true,
      digits: true,
      minlength: 2
   };
   return portRule;
};

AbacusUtils.getPortValidationMessages = function(requiredMsg, theStringTable)
{
   var portMessages = {
      required: requiredMsg,
      digits: theStringTable.validPortTypeErr,
      minlength: theStringTable.validPortLenErr
   };
   return portMessages;
};

AbacusUtils.getEmailValidationMessages = function(theStringTable)
{
   var errMessages = {
      required: theStringTable.validEmailErr,
      email: theStringTable.validEmailEntryErr
   };
   return errMessages;
};

AbacusUtils.getMinLengthMessage = function(theStringTable)
{
   var minLengthMessage = jQuery.format(theStringTable.validLenErrA +
          ' {0} ' + theStringTable.validLenErrB);
   return minLengthMessage;
};

AbacusUtils.getMaxLengthMessage = function(theStringTable)
{
   var maxLengthMessage = jQuery.format(theStringTable.validLenErrC +
          ' {0} ' + theStringTable.validLenErrD);
   return maxLengthMessage;
};

AbacusUtils.showWaitContainer = function(waitContainerId, innerContainerId)
{
   jQuery(innerContainerId).prop('disabled', 'true');
   jQuery(waitContainerId).show();
   jQuery(innerContainerId).fadeOut(1000);
};

/* show()
 * show the fields */
AbacusUtils.hideWaitContainer = function(waitContainerId, innerContainerId)
{
   jQuery(innerContainerId).removeAttr('disabled');
   jQuery(waitContainerId).fadeOut(1000);
   jQuery(innerContainerId).fadeIn();
};

AbacusUtils.switchElementToViewMode = function(widgetId)
{
   var selector = jQuery(widgetId);
   selector.prop('readonly', 'readonly');
   selector.prop('disabled', 'disabled');
};

AbacusUtils.switchElementsToViewMode = function(widgetArray)
{
   var index = 0;
   for (index = 0; index < widgetArray.length; index = index + 1)
   {
      AbacusUtils.switchElementToViewMode(widgetArray[index]);
   }
};

AbacusUtils.switchElementToEditMode = function(widgetId)
{
   var selector = jQuery(widgetId);
   selector.removeAttr('disabled');
   selector.removeAttr('readonly');
};

AbacusUtils.switchElementsToEditMode = function(widgetArray)
{
   var index = 0;
   for (index = 0; index < widgetArray.length; index = index + 1)
   {
      AbacusUtils.switchElementToEditMode(widgetArray[index]);
   }
};

AbacusUtils.sanitizeJsonText = function(input, alt)
{
   var validDataString;
   if (input === null || input === undefined)
   {
      validDataString = alt;
   }
   else
   {
      validDataString = input;
   }
   return validDataString;
};

AbacusUtils.sanitizeJsonId = function(input, alt)
{
   var validId;
   if (input === null || input === undefined)
   {
      validId = alt;
   }
   else
   {
      validId = input;
   }
   return validId;
};

AbacusUtils.sanitizeAndSplitJson = function(input, alt, splitChar)
{
   var splitStrings = [];
   if (input === null || input === undefined)
   {
      splitStrings[0] = alt;
   }
   else
   {
      splitStrings = input.split(splitChar);
   }
   return splitStrings;
};

AbacusUtils.appendLog = function(debugText)
{
   jQuery('#debugLog').append('<span>Log: ' + debugText + '</span><br>');
};

AbacusUtils.initDebug = function()
{
   if (!window.console)
   {
      window.console =
      { 'log': AbacusUtils.appendLog() };
   }
   AbacusUtils.debugInitialized = true;
};

AbacusUtils.consoleLog = function(debugText)
{
   if (!AbacusUtils.debugInitialized)
   {
      AbacusUtils.initDebug();
   }
   window.console.log(debugText);
};

AbacusUtils.consoleDir = function(objectToInspect)
{
   if (!AbacusUtils.debugInitialized)
   {
      AbacusUtils.initDebug();
   }
   window.console.dir(objectToInspect);
};
