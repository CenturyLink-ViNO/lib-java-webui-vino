/*globals jQuery */
/*globals bootbox */

function AbacusBootstrapUtils()
{
   /* nothing -- this class is all 'static' members */
}

AbacusBootstrapUtils.alert = function(msg)
{
   bootbox.alert(msg);
};

AbacusBootstrapUtils.iconAlert = function(color, glyph, msg)
{
   var iconDiv = jQuery('<span/>').css('font-size', 'xx-large'); // .css('color', 'red');
   iconDiv.css('color', 'black');
   iconDiv.css('-webkit-text-fill-color', color);
   iconDiv.css('-webkit-text-stroke-width', '1px');
   iconDiv.css('-webkit-text-stroke-color', 'black');
   var icon = jQuery('<span/>').addClass('glyphicon').addClass(glyph);
   iconDiv.append(icon);
   var msgSpan = jQuery('<span/>').css('vertical-align', 'top').append('&nbsp;&nbsp;').append(msg);
   var div = jQuery('<div/>');
   div.append(iconDiv);
   div.append(msgSpan);
   bootbox.alert(div.html());
};

AbacusBootstrapUtils.infoAlert = function(msg)
{
   AbacusBootstrapUtils.iconAlert('blue', 'glyphicon-info-sign', msg);
};

AbacusBootstrapUtils.warningAlert = function(msg)
{
   AbacusBootstrapUtils.iconAlert('yellow', 'glyphicon-warning-sign', msg);
};

AbacusBootstrapUtils.errorAlert = function(msg)
{
   AbacusBootstrapUtils.iconAlert('red', 'glyphicon-exclamation-sign', msg);
};

// -----------------------------------------------------------------------------------------------------------------
function AbacusBootstrapWizardUtils()
{
   /* nothing -- this class is all 'static' members */
}

AbacusBootstrapWizardUtils.createTextOnlyPage = function(textArray)
{
   var div = jQuery('<div/>');
   var index;
   for (index = 0; index < textArray.length; index = index + 1)
   {
      div.append(jQuery('<p/>').append(textArray[index]));
   }
   return div;
};

AbacusBootstrapWizardUtils.loremEnglish = function()
{
   return 'But I must explain to you how all this mistaken idea of denouncing pleasure and ' +
          'praising pain was born and I will give you a complete account of the system, and expound ' +
          'the actual teachings of the great explorer of the truth, the master-builder of human ' +
          'happiness. No one rejects, dislikes, or avoids pleasure itself, because it is ' +
          'pleasure, but because those who do not know how to pursue pleasure rationally encounter ' +
          'consequences that are extremely painful. Nor again is there anyone who loves or ' +
          'pursues or desires to obtain pain of itself, because it is pain, but because ' +
          'occasionally circumstances occur in which toil and pain can procure him some great ' +
          'pleasure. To take a trivial example, which of us ever undertakes laborious ' +
          'physical exercise, except to obtain some advantage from it? But who has any right ' +
          'to find fault with a man who chooses to enjoy a pleasure that has no annoying  ' +
          'consequences, or one who avoids a pain that produces no resultant pleasure?';
};
AbacusBootstrapWizardUtils.loremLatin = function()
{
   return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
          'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
          'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ' +
          'dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla ' +
          'pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia ' +
          'deserunt mollit anim id est laborum';
};
AbacusBootstrapWizardUtils.createRow = function(column1, offset1, control1, column2, offset2, control2)
{
   var row = jQuery('<div/>').addClass('row').css('display', 'inherit').css('margin-bottom', '4px');
   var cellA = jQuery('<div/>').addClass('col-md-' + column1).css('text-align', 'right');
   if (offset1 !== 0)
   {
      cellA.addClass('col-md-offset-' + offset1);
   }
   cellA.append(control1);
   row.append(cellA);

   if (control2 !== undefined)
   {
      var cellB = jQuery('<div/>').addClass('col-md-' + column2);
      if (offset2 !== 0)
      {
         cellB.addClass('col-md-offset-' + offset2);
      }
      cellB.append(control2);
      row.append(cellB);
   }
   return row;
};
AbacusBootstrapWizardUtils.buildImagePage = function(img, title, id)
{
   var div = jQuery('<div/>').append(jQuery('<img/>').attr('src', img));
   var wizardCard =
   {
      title: title,
      canComeBack: true,
      content: div,
      id: id
   };
   return wizardCard;
};

AbacusBootstrapWizardUtils.createRadioButtonPanel = function(defArray)
{
   var ret = [];
   var index;
   for (index = 0; index < defArray.length; index = index + 1)
   {
      var data = defArray[index];
      var span = jQuery('<span/>');
      var radioButton = jQuery('<input/>').attr('type', 'radio').attr('name', data.name).attr('value', data.value);
      radioButton.attr('id', data.name + '_' + index);
      if (data.selected === true)
      {
         radioButton.prop('checked', true);
      }
      var label = jQuery('<label/>').attr('for', data.name + '_' + index).append(data.label);
      label.css('margin-left', '5px');
      span.append(radioButton).append(label);
      var tmp =
      {
         span: span,
         button: radioButton
      };
      ret.push(tmp);
   }
   return ret;
};

