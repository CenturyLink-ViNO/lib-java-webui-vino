/*globals window */
/*globals setTimeout */
/*globals clearTimeout */
/*globals jQuery */
/*globals homePageUrl */
/*globals HomePageView */
/*globals homePageTitle */
/*globals homePageAuxIcon */
/*globals jsInclude */
/*globals document */
/* exported productHomePage */


// if (!window.console)
// {
//    window.console = {};
//    window.console.log = function() {};
// }

jQuery.ajax({
   url: '/lib/abacus/skeleton.head.html',
   success: function(data)
   {
      jQuery('head').append(data);
   },
   dataType: 'html',
   async: false
});

function ProductHomePage()
{
   this.showHomePage = function()
   {
      jQuery.when(jsInclude(homePageUrl)).done(function()
      {
         var homePageView = new HomePageView();
         homePageView.showView();
      });
   };
}
var productHomePage = new ProductHomePage();

jQuery.when(jQuery('#bodySkeleton').load('/lib/abacus/skeleton.body.html')).then(function()
{
   jQuery.when(
      jsInclude('/lib/abacus-ots/dataTables/DataTables-1.10.18/js/jquery.dataTables.min.js'),
      jsInclude('/lib/abacus/util/util.forms.js')
   ).then(function()
   {
      jQuery.when(
         jsInclude('/lib/abacus-ots/jquery-graceful-websocket/jquery.gracefulWebSocket.js'),
         jsInclude('/lib/abacus-ots/dataTables/Buttons-1.5.2/js/dataTables.buttons.min.js'),
         jsInclude('/lib/abacus-ots/dataTables/Select-1.2.6/js/dataTables.select.min.js'),
         jsInclude('/lib/abacus-ots/dataTables/DataTables-1.10.18/js/dataTables.bootstrap.js'),
         jsInclude('/lib/abacus-ots/dataTables/Responsive-2.2.2/js/dataTables.responsive.js'),
         jsInclude('/lib/abacus-ots/jsTree/jstree.min.js'),
         jsInclude('/lib/abacus-ots/selectize/selectize.min.js'),
         jsInclude('/lib/abacus-ots/base64/jquery.base64.js'),
         jsInclude('/lib/abacus-ots/crypto-js/rollups/sha256.js'),
         jsInclude('/lib/abacus-ots/smartMenus/jquery.smartmenus.js'),
         jsInclude('/lib/abacus/abacusUtils.js'),
         jsInclude('/lib/abacus/util/util.localStorage.js'),
         jsInclude('/lib/abacus-ots/bootstrapValidator/bootstrapValidator.min.js'),
         jsInclude('/lib/abacus/util/jquery.abacusDataTablesWrapper.js'),
         jsInclude('/lib/abacus/util/AbstractController.js'),
         jsInclude('/lib/abacus/util/AbstractDataObject.js'),
         jsInclude('/lib/abacus/abacusBootstrapUtils.js'),
         jsInclude('/lib/abacus/abacusDragAndDropUtils.js'),
         jsInclude('/lib/abacus/jqPlugins/jquery.utils.js'),
         jsInclude('/lib/abacus/util/AbacusBootstrapWizard.js'),
         jsInclude('/lib/abacus/util/AbstractModel.js'),
         jsInclude('/auth/js/keycloak.js')
      ).then(function()
      {
         jQuery.when(jsInclude('/lib/abacus/util/util.menuBuilder.js')).then(function()
         {
            jsInclude('/lib/abacus-ots/moment-develop/moment.js');
            jsInclude('/lib/abacus-ots/jQuery.plugins/cron/jquery-cron.js');
            jsInclude('/lib/abacus-ots/jQuery.plugins/gentleSelect/jquery-gentleSelect.js');
            jsInclude('/lib/abacus/user/user.authentication.js');
            jsInclude('/lib/abacus/util/abacus.json.js');
            jsInclude('/lib/abacus-ots/ace/src-min/ace.js');
         });
      });
   });
   // Attach the navbar to the top of the screen when scrolling would move it off the screen
   // var navOffset = jQuery('#site-nav')[0].offsetTop;
   var navOffset = jQuery('#site-nav').offsetTop;
   jQuery(document).on('ready scroll', function()
   {
      var scroll = jQuery(document).scrollTop();
      if (scroll >= navOffset)
      {
         jQuery('#site-nav').addClass('navbar-fixed-top').removeAttr('style');
      }
      else
      {
         jQuery('#site-nav').removeClass('navbar-fixed-top').css('position', 'relative');
      }
   });
   // function to do height tweeking
   function fixHeight()
   {
      var vph = jQuery(window).height() - jQuery('.navbar').height() - jQuery('.abacus-header').height();
      jQuery('.page-item-class .page-container').css({ 'min-height': vph + 'px' });
   }
   /* Fix stacking modal issues*/
   jQuery(document).on('show.bs.modal', '.modal', function()
   {
      var zIndex = 1040 + 10 * jQuery('.modal:visible').length;
      jQuery(this).css('z-index', zIndex);
      setTimeout(function()
      {
         jQuery('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
      }, 0);
   });
   jQuery(document).on('hidden.bs.modal', '.modal', function()
   {
      jQuery(this).remove();
      if (jQuery('.modal:visible').length)
      {
         jQuery(document.body).addClass('modal-open');
      }
   });
   // Now monitor the resize events and make the tweaks
   var resizeTimer;
   jQuery(window).resize(function()
   {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(fixHeight, 200);
   });
   jQuery.when( // jsInclude('/lib/abacus-ots/semantic-ui/dist/semantic.min.js'), // Don't mix semantic JS with
      // boostrap JS
      jsInclude('/lib/bootstrap/js/bootstrap.js'),
      jsInclude('/lib/abacus-ots/bootstrap.bootbox/bootbox.js'),
      jsInclude('/lib/abacus/util/util.pageManipulation.js')
   );
   // Control script to attach event listeners and such to make the page work
   jQuery(document).ready(function()
   {
      // debugger;
      fixHeight();
      jQuery('#main-nav a').click(function()
      {
         //event.preventDefault();
         jQuery('.active').removeClass('active');
         jQuery(this).addClass('active');
      });
      jQuery('#copyrightFooter').html('Copyright &copy; 2016 - ' +
                                      new Date().getFullYear() +
                                      '[CenturyLink]. All rights reserved.');
      // var productHomePage = new ProductHomePage();
      // setupSkeleton(homePageTitle, homePageUrl);
      setTimeout(function()
      {
         if (homePageAuxIcon !== undefined && homePageAuxIcon !== null && homePageAuxIcon !== '')
         {
            var otherIcon = jQuery('<img/>').attr('src', homePageAuxIcon);
            otherIcon.attr('alt', homePageTitle);
            otherIcon.css('height', '44px');
            jQuery('#mainPageAuxIcon').append(otherIcon);
         }
         var mainIcon = jQuery('<img/>').attr('src', '/lib/abacus/img/logo-small.png');
         mainIcon.attr('alt', 'CenturyLink logo');
         mainIcon.css('height', '44px');
         mainIcon.css('width', '240px');
         jQuery('#mainPageAuxIcon').append(mainIcon);
         jQuery('#pageTitle').html(homePageTitle);
         jQuery('title').html(homePageTitle);
      }, 250);
   });
});
