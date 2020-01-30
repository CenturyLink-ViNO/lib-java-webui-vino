/*globals AbacusUtils */
/*globals jQuery */
/* exported AbacusBootstrapWizardSimpleChoicePanel */
/* exported AbacusBootstrapWizardCardStatusPanel */

function AbacusBootstrapWizardSimpleChoicePanel(optArray)
{
   this.create = function(optArray)
   {
      this.div = jQuery('<div/>');
      this.buttons = [];
      var name = AbacusUtils.guid();
      var index;
      for (index = 0; index < optArray.length; index = index + 1)
      {
         var data = optArray[index];
         var span = jQuery('<span/>');
         var radioButton = jQuery('<input/>').attr('type', 'radio').attr('name', name).attr('id', name + '_' + index);
         if (data.selected === true)
         {
            radioButton.prop('checked', true);
         }
         var label = jQuery('<label/>').attr('for', name + '_' + index).append(data.label);
         label.css('margin-left', '5px');
         span.append(radioButton).append(label).append('<br/>');
         var tmp =
         {
            span: span,
            button: radioButton,
            next: data.next
         };
         this.buttons.push(tmp);
         this.div.append(span);
      }
   };
   this.panel = function()
   {
      return this.div;
   };
   this.next = function()
   {
      var ret;
      var i;
      for (i = 0; i < this.buttons.length; i = i + 1)
      {
         if (this.buttons[i].button.is(':checked'))
         {
            ret = this.buttons[i].next;
            break;
         }
      }
      return ret;
   };
   this.create(optArray);
}

function AbacusBootstrapWizardCardStatusPanel()
{
   this.create = function()
   {
      var statusPanel = jQuery('<div/>');

      var progressPanel = jQuery('<div/>').addClass('progress');
      var progressBar = jQuery('<div/>').addClass('progress-bar').addClass('progress-bar-striped active');
      progressBar.attr('role', 'progressbar').attr('aria-valuenow', '100');
      progressBar.attr('aria-valuemin', '0').attr('aria-valuemax', '100');
      progressBar.css('width', '100%');
      progressBar.append(jQuery('<span/>').addClass('sr-only').append('Indefinite'));
      progressPanel.append(progressBar);

      var busy = this.messagePanel();
      busy.panel.append(progressPanel);
      statusPanel.append(busy.panel);

      var error = this.messagePanel('alert-danger');
      statusPanel.append(error.panel);

      var warning = this.messagePanel('alert-warning');
      statusPanel.append(warning.panel);

      var success = this.messagePanel('alert-success');
      statusPanel.append(success.panel);

      this.data =
      {
         panel: statusPanel,
         busy: busy,
         error: error,
         warning: warning,
         success: success
      };
      this.hideAll();
   };
   this.messagePanel = function(className)
   {
      var panel = jQuery('<div/>');
      if (className !== undefined)
      {
         panel.addClass('alert').addClass(className).attr('role', 'alert');
      }
      var message = jQuery('<div/>');
      panel.append(message);
      panel.hide();
      var ret =
      {
         panel: panel,
         message: message
      };
      return ret;
   };
   this.hideAll = function()
   {
      this.data.busy.panel.hide();
      this.data.error.panel.hide();
      this.data.warning.panel.hide();
      this.data.success.panel.hide();
   };
   this.message = function(which, msg)
   {
      this.hideAll();
      which.message.empty();
      which.message.append(msg);
      which.panel.show();
   };
   this.busy = function(msg)
   {
      this.message(this.data.busy, msg);
   };
   this.success = function(msg)
   {
      this.message(this.data.success, msg);
   };
   this.warning = function(msg)
   {
      this.message(this.data.warning, msg);
   };
   this.error = function(msg)
   {
      this.message(this.data.error, msg);
   };
   this.hide = function()
   {
      this.div().hide();
   };
   this.show = function()
   {
      this.div().show();
   };
   this.div = function()
   {
      return this.data.panel;
   };
   this.create();
}

(function(jQuery)
{
   jQuery.fn.abacusBootstrapWizard = function(options)
   {
      this.ctor = function(options)
      {
         var defaults =
         {
            forceHeight: false,
            allowTabNavigation: false,
            useFieldset: true,
            allowClose: false,
            uniqueId: '',
            title: 'Pass title attribute',
            maximumVisibleTabs: 5,
            cards: [],
            isModal: false
         };
         this.settings = jQuery.extend(defaults, options);
         this.pageIndexesById = [];

         this.layout();
         this.addPages();
         this.cardContainer.css('min-height', this.pageListDiv.height());
      };
      this.addPages = function()
      {
         var cardIndex;

         var upIcon = jQuery('<span/>').addClass('glyphicon').addClass('glyphicon-chevron-up');
         this.moreBefore = jQuery('<li/>').addClass('tabPageItem').append(upIcon).css('text-align', 'center');
         this.pageList.append(this.moreBefore);

         for (cardIndex = 0; cardIndex < this.settings.cards.length; cardIndex = cardIndex + 1)
         {
            this.addPage(this.settings.cards[cardIndex], cardIndex);
         }

         var downIcon = jQuery('<span/>').addClass('glyphicon').addClass('glyphicon-chevron-down');
         this.moreAfter = jQuery('<li/>').addClass('tabPageItem').append(downIcon).css('text-align', 'center');
         this.pageList.append(this.moreAfter);

         if (this.settings.allowTabNavigation !== true)
         {
            upIcon.css('color', 'gray');
            downIcon.css('color', 'gray');
         }
         this.currentPage(0);
         this.pageList.show();
      };
      this.layout = function()
      {
         var panel;
         var panelBody;
         var row = jQuery('<div/>').addClass('row').css('display', 'inherit');
         if (this.settings.isModal)
         {
            panel = jQuery('<div/>').addClass('panel').addClass('panel-primary').
               css('margin-top', '15px').css('display', 'block');
            panel.append(jQuery('<div/>').addClass('panel-heading').
               append(jQuery('<h3/>').addClass('panel-title').append(this.settings.title)));
            panelBody = jQuery('<div/>').addClass('panel-body');
            panel.append(panelBody);
         }
         var container = jQuery('<div/>').addClass('container').css('width', 'auto');

         var mainContent = jQuery('<div/>').addClass('row').css('display', 'inherit');

         this.pageListDiv = jQuery('<div/>').addClass('col-md-2');
         this.pageList = jQuery('<ul/>').addClass('nav').addClass('nav-pills').addClass('nav-stacked');
         this.pageListDiv.append(this.pageList);
         this.pageList.hide();

         var cardCell = jQuery('<div/>').addClass('col-md-10');
         if (this.settings.useFieldset === false)
         {
            var hr = jQuery('<hr/>').css('margin-top', '0px').css('margin-bottom', '4px');
            hr.css('border-top-style', 'solid').css('border-top-width', '1px').css('border-top-color', 'blue');
            this.cardTitle = jQuery('<h4/>').css('margin-bottom', '0px');
            var cardTitleDiv = jQuery('<div/>').append(this.cardTitle).append(hr);
            cardCell.append(cardTitleDiv);
            this.cardContent = jQuery('<div/>').addClass('tab-content');
            row.append(this.cardContent);
            cardCell.append(row);
            this.cardContainer = cardCell;
         }
         else
         {
            var fieldset = jQuery('<fieldset/>');
            this.cardContainer = fieldset;
            var legend = jQuery('<legend/>').css('margin-bottom', '5px');
            this.cardTitle = jQuery('<span/>');
            legend.append(this.cardTitle);
            fieldset.append(legend);
            this.cardContent = jQuery('<div/>').addClass('tab-content');
            fieldset.append(this.cardContent);

            row.append(fieldset);
            cardCell.append(row);

            if (this.settings.forceHeight !== undefined)
            {
               fieldset.css('min-height', this.settings.forceHeight);
               fieldset.css('max-height', this.settings.forceHeight);
            }
         }

         var buttonRow = this.createButtonRow();

         mainContent.append(this.pageListDiv);
         mainContent.append(cardCell);
         container.append(mainContent);
         container.append(buttonRow);
         if (this.settings.isModal)
         {
            panelBody.append(container);
         }
         else
         {
            this.append(container);
         }
      };
      this.createButtonRow = function()
      {
         var outer = this;

         var buttonRowA = jQuery('<div/>').addClass('btn-toolbar').attr('role', 'toolbar').css('float', 'right').
            css('padding-top', '15px');
         var group1 = jQuery('<div/>').addClass('btn-group');
         var group2 = jQuery('<div/>').addClass('btn-group');
         buttonRowA.append(group1).append(group2);

         this.backButton = jQuery('<button/>').addClass('btn').attr('type', 'button');
         var backIcon = jQuery('<span/>').addClass('glyphicon').addClass('glyphicon-chevron-left');
         backIcon.css('margin-right', '4px;');
         this.backButton.append(backIcon).append('Back');
         group1.append(this.backButton);

         this.nextButton = jQuery('<button/>').addClass('btn').attr('type', 'button');
         var nextIcon = jQuery('<span/>').addClass('glyphicon').addClass('glyphicon-chevron-right');
         nextIcon.css('margin-left', '4px;');
         this.nextButton.append('Next').append(nextIcon);
         group2.append(this.nextButton);

         this.closeButton = jQuery('<button/>').addClass('btn').attr('type', 'button');
         var closeIcon = jQuery('<span/>').addClass('glyphicon').addClass('glyphicon-remove');
         closeIcon.css('margin-right', '4px;');
         this.closeButton.append(closeIcon).append('Close');
         group2.append(this.closeButton);

         var buttonRow = jQuery('<div/>').addClass('row').css('display', 'inherit');
         var buttonCell = jQuery('<div/>').addClass('col-md-3').addClass('col-md-offset-9').
            css('padding-right', '0px');
         buttonCell.append(buttonRowA);
         buttonRow.append(buttonCell);

         this.closeButton.css('border-radius', '8px');
         this.backButton.css('border-radius', '8px');
         this.nextButton.css('border-radius', '8px');

         this.backButton.click(function()
         {
            outer.backClicked();
         });
         this.nextButton.click(function()
         {
            outer.nextClicked();
         });
         this.closeButton.click(function()
         {
            outer.closeClicked();
         });

         return buttonRow;
      };
      this.nextPage = function()
      {
         this.currentPage(this.currentCardIndex + 1);
      };
      this.previousPage = function(shouldPush)
      {
         if (this.history !== undefined)
         {
            var prev = this.history.pop();
            this.currentPage(prev, shouldPush);
         }
      };
      this.currentPage = function(index, shouldPush)
      {
         if (this.currentIndex !== undefined)
         {
            if (this.history === undefined)
            {
               this.history = [];
            }
            var currentCard = this.settings.cards[this.currentIndex];
            if (currentCard.canComeBack === undefined || currentCard.canComeBack === true)
            {
               if (shouldPush === undefined || shouldPush === true)
               {
                  this.history.push(this.currentIndex);
               }
            }
         }
         if (isNaN(index))
         {
            index = this.pageIndexesById[index];
         }
         this.adjustButtons(index);
         this.adjustPills(index);
         this.adjustContent(index);
         this.currentIndex = index;
      };
      this.adjustContent = function(index)
      {
         if (this.settings.cards[index] !== undefined)
         {
            var currentCard = this.settings.cards[index];
            this.currentCardIndex = index;
            this.cardTitle.empty();
            this.cardTitle.append(currentCard.title);
            this.cardContent.empty();
            var content = jQuery('<div/>').addClass('tab-pane').addClass('active');
            content.attr('id', 'wCard' + this.settings.uniqueId + index);
            if (currentCard.header !== undefined)
            {
               content.append(this.buildCardHeader(currentCard.header));
            }
            if (currentCard.content === undefined)
            {
               currentCard.content = jQuery('<div/>');
            }
            content.append(currentCard.content);
            this.cardContent.append(content);
            if (currentCard.enterPage !== undefined && typeof currentCard.enterPage === 'function')
            {
               currentCard.enterPage(this);
            }
         }
      };
      this.buildCardHeader = function(textArray)
      {
         var para;
         var div = jQuery('<div/>');
         if (typeof textArray === 'string')
         {
            div.append(jQuery('<p/>').append(textArray));
         }
         else
         {
            for (para = 0; para < textArray.length; para = para + 1)
            {
               div.append(jQuery('<p/>').append(textArray[para]));
            }
         }
         return div;
      };
      this.closeClicked = function()
      {
         var currentCard = this.settings.cards[this.currentCardIndex];
         if (currentCard !== undefined)
         {
            if (currentCard.onClose !== undefined && typeof currentCard.onClose === 'function')
            {
               if (currentCard.onClose(this))
               {
                  this.close();
               }
            }
            else
            {
               this.close();
            }
         }
      };
      this.backClicked = function()
      {
         if (!this.backButton.hasClass('disabled'))
         {
            var currentCard = this.settings.cards[this.currentCardIndex];
            if (currentCard !== undefined)
            {
               if (currentCard.onBack !== undefined && typeof currentCard.onBack === 'function')
               {
                  if (currentCard.onBack(this))
                  {
                     this.previousPage(false);
                  }
               }
               else
               {
                  this.previousPage(false);
               }
            }
         }
      };
      this.nextClicked = function()
      {
         if (!this.nextButton.hasClass('disabled'))
         {
            var currentCard = this.settings.cards[this.currentCardIndex];
            if (currentCard !== undefined)
            {
               if (currentCard.onNext !== undefined && typeof currentCard.onNext === 'function')
               {
                  if (currentCard.onNext(this))
                  {
                     this.nextPage();
                  }
               }
               else
               {
                  this.nextPage();
               }
            }
         }
      };
      this.tabClicked = function(which)
      {
         if (!jQuery('li:nth-child(' + (which + 1) + ')', this.pageList).hasClass('disabled'))
         {
            var currentCard = this.settings.cards[this.currentCardIndex];
            if (currentCard !== undefined)
            {
               if (currentCard.canExitPage !== undefined && typeof currentCard.canExitPage === 'function')
               {
                  if (currentCard.canExitPage(this))
                  {
                     this.currentPage(which);
                  }
               }
               else
               {
                  this.currentPage(which);
               }
            }
         }
      };
      this.addPage = function(card, index)
      {
         var outer = this;
         var tmp = jQuery('<li/>').addClass('tabPageItem');
         var anchor = jQuery('<a/>').append(card.title);
         if (this.settings.allowTabNavigation === true)
         {
            anchor.attr('href', '#');
            anchor.click(function()
            {
               outer.tabClicked(index);
            });
         }
         tmp.append(anchor);
         this.pageList.append(tmp);
         this.pageIndexesById[card.id] = index;
      };
      this.disableTab = function(index)
      {
         if (index >= 0 && index <= this.settings.cards.length)
         {
            jQuery('li:nth-child(' + (index + 1) + ')', this.pageList).addClass('disabled');
         }
      };
      this.enableTab = function(index)
      {
         if (index >= 0 && index <= this.settings.cards.length)
         {
            jQuery('li:nth-child(' + (index + 1) + ')', this.pageList).removeClass('disabled');
         }
      };
      this.adjustPills = function(which)
      {
         var index = which + 1;
         if (index >= 0 && index <= this.settings.cards.length)
         {
            jQuery('li', this.pageList).removeClass('active');
            jQuery('li:nth-child(' + (index + 1) + ')', this.pageList).addClass('active');
            this.adjustVisibleTabs(which);
         }
      };
      this.makeTabVisible = function(which)
      {
         jQuery('li:nth-child(' + (which + 2) + ')', this.pageList).show();
      };
      this.adjustVisibleTabs = function(index)
      {
         jQuery('li', this.pageList).hide();
         this.makeTabVisible(index);

         var totalTabCount = jQuery('li', this.pageList).length - 2;
         if (totalTabCount <= this.settings.maximumVisibleTabs)   // show all
         {
            jQuery('li', this.pageList).show();
            this.moreBefore.hide();
            this.moreAfter.hide();
         }
         else  // show some
         {
            var i;
            var visibleSlotsAvailableAbove = (this.settings.maximumVisibleTabs - 1) / 2 - 1;
            var visibleSlotsAvailableBelow = (this.settings.maximumVisibleTabs - 1) / 2 - 1;
            if (index <= visibleSlotsAvailableAbove + 1) // near the top
            {
               for (i = 0; i < this.settings.maximumVisibleTabs - 1; i = i + 1)
               {
                  this.makeTabVisible(i);
               }
               if (i < totalTabCount)
               {
                  this.moreAfter.show();
               }
            }
            else // not near the top
            {
               this.moreBefore.show();
               if (totalTabCount - index <= visibleSlotsAvailableBelow + 1) // near the bottom
               {
                  for (i = totalTabCount - this.settings.maximumVisibleTabs + 1; i <= totalTabCount; i = i + 1)
                  {
                     this.makeTabVisible(i);
                  }
                  this.moreAfter.hide();
               }
               else // in the middle
               {
                  for (i = index - visibleSlotsAvailableAbove; i < index; i = i + 1)
                  {
                     this.makeTabVisible(i);
                  }
                  for (i = index; i <= Math.min(index + visibleSlotsAvailableBelow, totalTabCount); i = i + 1)
                  {
                     this.makeTabVisible(i);
                  }
                  if (i + 1 === totalTabCount)
                  {
                     this.makeTabVisible(i);
                  }
                  else
                  {
                     if (i < totalTabCount)
                     {
                        this.moreAfter.show();
                     }
                  }
               }
            }
         }
      };
      this.adjustButtons = function(index)
      {
         if (index === 0)
         {
            this.disableBack();
            this.enableNext();
            this.showNext();
         }
         else
         {
            if (index >= this.settings.cards.length - 1)
            {
               this.enableBack();
               if (this.settings.allowClose)
               {
                  this.showClose();
               }
               else
               {
                  this.disableNext();
               }
            }
            else
            {
               this.enableBack();
               this.enableNext();
               this.showNext();
            }
         }
      };
      this.disableBack = function()
      {
         this.backButton.addClass('disabled');
         this.moreBefore.addClass('disabled');
      };
      this.enableBack = function()
      {
         this.backButton.removeClass('disabled');
         this.moreBefore.removeClass('disabled');
      };
      this.disableNext = function()
      {
         this.nextButton.addClass('disabled');
         this.moreAfter.addClass('disabled');
      };
      this.enableNext = function()
      {
         this.nextButton.removeClass('disabled');
         this.moreAfter.removeClass('disabled');
      };
      this.showNext = function()
      {
         this.nextButton.show();
         this.closeButton.hide();
      };
      this.showClose = function()
      {
         this.nextButton.hide();
         this.closeButton.show();
      };
      this.close = function()
      {
      };
      this.ctor(options);
      return this;
   };
}(jQuery));

//this.showLoading = function(message)
//{
// if (this.loadingMessage === undefined)
// {
//    var loadingIcon = jQuery('<p/>').addClass('loadingIcon').css('text-align', 'center');
//    loadingIcon.append(jQuery('<img>').attr('src', '/lib/abacus/img/loading.gif'));
//    this.loadingMessage = jQuery('<span/>');
//    this.loadingPanel = jQuery('<div/>');
//    var col = jQuery('<div/>');
//    col.append(this.loadingMessage).append('<br/>').append(loadingIcon);
//    this.loadingPanel.append(col);
// }
// this.loadingMessage.empty();
// this.loadingMessage.append(message);
// if (this.loadingDialog === undefined)
// {
//    this.loadingDialog = bootbox.dialog(
//    {
//       title: 'One moment ...',
//       message: this.loadingPanel.html(),
//       closeButton: false,
//       show: false,
//       buttons: {}
//    });
// }
// this.loadingDialog.modal('show');
//};
//this.hideLoading = function()
//{
// if (this.loadingDialog !== undefined)
// {
//    this.loadingDialog.modal('hide');
// }
//};
