/*globals jQuery */

var abacus = abacus || {};

abacus.About.DOM = {};

abacus.About.DOM.getModal = function(version)
{
   if (abacus.About.DOM.Modal === undefined)
   {
      var main = jQuery('<div>').addClass('modal fade');
      var d1 = jQuery('<div>').addClass('modal-dialog');
      main.append(d1);
      var content = jQuery('<div>').addClass('modal-content');
      d1.append(content);
      var body = jQuery('<div>').addClass('modal-body');
      content.append(body);
      var relaxed = jQuery('<div>').addClass('ui very relaxed items');
      body.append(relaxed);
      var item = jQuery('<div>').addClass('item');
      relaxed.append(item);
      var image = jQuery('<div>').addClass('image').
         append(jQuery('<img>').attr('src', '/lib/abacus/img/CenturyLink_logo.png'));
      item.append(image);

      var innerContent = jQuery('<div>').addClass('content');
      var prodName = jQuery('<h3>').addClass('ui header').attr('id', 'productName').css('margin-top', '0px');
      innerContent.append(prodName);
      item.append(innerContent);

      var idSpan = jQuery('<span>').attr('id', 'version');
      var para = jQuery('<span>').text('Version: ').append(idSpan);
      var desc = jQuery('<div>').addClass('description').append(para);
      innerContent.append(desc);

      var copy = jQuery('<span/>').html('Copyright &copy; CenturyLink 2016 - ');
      var copy1 = jQuery('<span/>').attr('id', 'copyEnd');
      copy.append(copy1);
      innerContent.append(copy);
      var footer = jQuery('<div>').addClass('modal-footer');
      var button = jQuery('<button>').addClass('btn btn-primary').attr('type', 'button').attr('data-dismiss', 'modal');
      button.text('Close');
      footer.append(button);
      content.append(footer);

      abacus.About.DOM.Modal = main;
   }
   var ret = abacus.About.DOM.Modal.clone();
   jQuery('#productName', ret).text(version.productName);
   jQuery('#version', ret).text(version.versionString);
   jQuery('#copyEnd', ret).text(version.copyrightEnd);
   return ret;
};
