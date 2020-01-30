/*globals jQuery */

(function()
{
   jQuery.fn.forceNumeric = function()
   {
      return this.each(function()
      {
         jQuery(this).keydown(function(e)
         {
            var ret = false;
            var key = e.which || e.keyCode;
            if (
               !e.shiftKey && !e.altKey && !e.ctrlKey &&
                (key >= 48 && key <= 57 ||                                // numbers
                 key >= 96 && key <= 105 ||                               // Numeric keypad
                key === 190 || key === 188 || key === 109 || key === 110 || // comma, period and minus, . on keypad
                key === 8 || key === 9 || key === 13 ||                     // Backspace and Tab and Enter
                key === 35 || key === 36 ||                                 // Home and End
                key === 37 || key === 39 ||                                 // left and right arrows
                key === 46 || key === 45))                                  // Del and Ins
            {
               ret = true;
            }
            return ret;
         });
      });
   };
}(jQuery));
