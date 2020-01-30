/*globals jQuery */
//function($, window, undefined) but lint does not allow
(function()
{
   jQuery.fn.collapsableFieldset = function(settings)
   {
      this.initialize = function(settings)
      {
         var defaultSettings =
         {
            symbol: 'plus',
            initialState: 'open'
         };
         this.settings = jQuery.extend(defaultSettings, settings);
         this.initializeSymbols();
         jQuery('legend', this).css('cursor', 'pointer');
         jQuery('legend', this).prepend(jQuery('<span/>').prop('id', 'monikor'));
         var outer = this;
         jQuery('legend', this).click(function()
         {
            jQuery(this).toggleClass('collapsed');
            jQuery('div:first', jQuery(this).parent('fieldset:first')).slideToggle('slow');
            if (jQuery(this).hasClass('collapsed'))
            {
               jQuery('#monikor', this).html(outer.openMoniker);
            }
            else
            {
               jQuery('#monikor', this).html(outer.closedMoniker);
            }
         });
         if (this.settings.initialState === 'closed')
         {
            jQuery('legend', this).addClass('collapsed');
            jQuery('div:first', jQuery(this)).hide();
            jQuery('#monikor', this).html(this.openMoniker);
         }
         else
         {
            jQuery('#monikor', this).html(this.closedMoniker);
         }
      };
      this.open = function()
      {
         if (jQuery('legend', this).hasClass('collapsed'))
         {
            jQuery('legend', this).click();
         }
      };
      this.close = function()
      {
         if (!jQuery('legend', this).hasClass('collapsed'))
         {
            jQuery('legend', this).click();
         }
      };
      this.toggle = function()
      {
         jQuery('legend', this).click();
      };
      this.initializeSymbols = function()
      {
         // http://www.alanwood.net/unicode/mathematical_operators.html
         var rightPointingTriangle = '&#x25B7;';
         var downPointingTriangle = '&#x25BD;';
         var openDiamond = '&#x25C7;';
         var closedDiamond = '&#x25C8;';
         var squarePlus = '&#x229E;';
         var squareDash = '&#x229F;';

         if (this.settings.symbol === 'triangle')
         {
            this.openMoniker = rightPointingTriangle;
            this.closedMoniker = downPointingTriangle;
         }
         else
         {
            if (this.settings.symbol === 'diamond')
            {
               this.openMoniker = openDiamond;
               this.closedMoniker = closedDiamond;
            }
            else
            {
               this.openMoniker = squarePlus;
               this.closedMoniker = squareDash;
            }
         }
      };

      this.initialize(settings);
      return this;
   };  // $.fn.collapsableFieldset = function()
// }) (jQuery);
}(jQuery));//jQuery($, window, undefined) but lint does not allow
