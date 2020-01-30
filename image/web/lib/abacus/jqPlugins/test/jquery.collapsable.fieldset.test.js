/*globals jQuery */
/*globals document */

function assignStyles(flag)
{
   var i;
   var id;
   var style;
   var styleList = ['border10', 'border7', 'shadowBox', 'clsGradient', 'shadowText', '', 'padding35'];
   if (flag)
   {
      for (i = 1; i <= 6; i = i + 1)
      {
         for (id = 0; id < styleList.length; id = id + 1)
         {
            style = styleList[id];
            jQuery('#fieldset' + i).addClass(style);
            jQuery('#fieldset' + i + ' legend').addClass(style);
         }
      }
   }
}

jQuery(document).ready(function()
{
   assignStyles(true);
   jQuery('#fieldset2').collapsableFieldset({ });
   jQuery('#fieldset3').collapsableFieldset({ symbol: 'plus' });
   jQuery('#fieldset4').collapsableFieldset({ symbol: 'triangle' });
   jQuery('#fieldset5').collapsableFieldset({ symbol: 'diamond' });
   jQuery('#fieldset6').collapsableFieldset({ symbol: 'diamond', initialState: 'closed' });
});

