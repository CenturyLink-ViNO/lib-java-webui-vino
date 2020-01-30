/*global console */
/*globals jQuery */

var abacus = abacus || {};
abacus.common = abacus.common || {};
abacus.common.dragAndDropForm = abacus.common.dragAndDropForm || function(dom)
{
   this.frame = null;
   this.elements = [];
   this.elementValues = [];
   var outer = this;
   var dragSrcEl = null;

   /*
      Moves the array element at startIndex and moves it to endIndex,
       adjusting the indicies of other elements as necessary
    */
   function moveElement(array, startIndex, endIndex, before)
   {
      var toMove = array.splice(startIndex, 1)[0];
      if (startIndex > endIndex)
      {
         if (before)
         {
            array.splice(endIndex, 0, toMove);
         }
         else
         {
            array.splice(endIndex + 1, 0, toMove);
         }
      }
      else if (startIndex < endIndex)
      {
         if (before)
         {
            array.splice(endIndex - 1, 0, toMove);
         }
         else
         {
            array.splice(endIndex, 0, toMove);
         }
      }
      return array;
   }

   this.addDragAndDropFrameById = function(id)
   {
      var container = jQuery('#' + id);
      if (container !== null && container !== undefined)
      {
         this.addDragAndDropFrame(container);
      }
      else
      {
         console.error('Was unable to find container with ID [' + id + '] in the DOM');
      }
   };

   this.addDragAndDropFrame = function(container)
   {
      this.frame = this.dom.getDragAndDropFrame();
      container.append(this.frame);
   };

   this.getDragAndDropFrame = function()
   {
      return this.dom.getDragAndDropFrame();
   };

   this.addNewItemToFrame = function(value)
   {
      var pos = this.elements.length; // The index that the new element will have in the data arrays
      value.position = pos;
      this.elements.push(this.dom.getDragAndDropElement(pos, value));
      this.elementValues.push(value);
      this.frame.append(this.elements[pos]);
      return pos;
   };

   this.removeItemFromFrame = function(index)
   {
      // decrement the positions and update the dom elements
      var i;
      for (i = index + 1; i < this.elements.length; i = i + 1)
      {
         this.elementValues[i].position = this.elementValues[i].position - 1;
         this.elements[i].attr('data-index', Number(this.elements[i].attr('data-index') - 1));
      }

      this.elements[index].remove();
      this.elements.splice(index, 1);
      this.elementValues.splice(index, 1);
   };

   this.getOrderedValues = function()
   {
      var ret = new Array(this.elementValues.length);
      var i;
      for (i = 0; i < this.elementValues.length; i = i + 1)
      {
         ret[this.elementValues[i].position] = this.elementValues[i];
      }
      // clean up the return array
      for (i = 0; i < ret.length; i = i + 1)
      {
         if (ret[i] === null || ret[i] === undefined)
         {
            ret.splice(i, 1);
         }
      }
      return ret;
   };

   this.updateValue = function(index, valueObject)
   {
      var existingValue = this.elementValues[index];
      var key;
      for (key in valueObject)
      {
         if (valueObject.hasOwnProperty(key))
         {
            existingValue[key] = valueObject[key];
         }
      }
      this.elementValues[index] = existingValue;
   };

   this.handleDragStart = function()
   {
      return function(e)
      {
         e.target.style.opacity = '0.4';
         dragSrcEl = e.target;
         e.originalEvent.dataTransfer.effectAllowed = 'move';
         e.originalEvent.dataTransfer.setData('text/html', e.target.innerHTML);
      };
   };

   this.handleDragOver = function()
   {
      return function(e)
      {
         if (e.originalEvent.stopPropagation)
         {
            e.originalEvent.stopPropagation();
         }
         if (e.originalEvent.preventDefault)
         {
            e.originalEvent.preventDefault();
         }
         e.originalEvent.dataTransfer.dropEffect = 'move';
         return false;
      };
   };

   this.handleDragEnter = function()
   {
      return function(e)
      {
         if (e.originalEvent.stopPropagation)
         {
            e.originalEvent.stopPropagation();
         }
         if (e.originalEvent.preventDefault)
         {
            e.originalEvent.preventDefault();
         }
         var domElement = jQuery(this);
         outer.dom.hoverElement(domElement);
      };
   };

   this.handleDragLeave = function()
   {
      return function(e)
      {
         if (e.originalEvent.stopPropagation)
         {
            e.originalEvent.stopPropagation();
         }
         if (e.originalEvent.preventDefault)
         {
            e.originalEvent.preventDefault();
         }
         var domElement = jQuery(this);
         outer.dom.unHoverElement(domElement);
      };
   };

   this.handleDropFirst = function()
   {
      return function(e)
      {
         if (e.originalEvent.stopPropagation)
         {
            e.originalEvent.stopPropagation();
         }
         if (e.originalEvent.preventDefault)
         {
            e.originalEvent.preventDefault();
         }
         var draggedElement = jQuery(dragSrcEl);
         var targetElement = jQuery(e.target);
         /* Sometimes the handleDrop event is fired by a child element (le sigh) -- catch this case where we can
          and attempt to recover as often as possible.
          */
         if (!draggedElement.attr('draggable'))
         {
            draggedElement = draggedElement.closest('[draggable=true]');
         }
         if (draggedElement !== targetElement)
         {
            var draggedIndex = Number(draggedElement.attr('data-index'));

            outer.elements = moveElement(outer.elements, draggedIndex, 0, true);
            outer.elementValues = moveElement(outer.elementValues, draggedIndex, 0, true);

            var i;
            for (i = 0; i < outer.elements.length; i = i + 1)
            {
               outer.elementValues[i].position = i;
               outer.elements[i].attr('data-index', i);
            }

            draggedElement.insertAfter(targetElement);
         }
      };
   };

   this.handleDropBefore = function()
   {
      return function(e)
      {
         if (e.originalEvent.stopPropagation)
         {
            e.originalEvent.stopPropagation();
         }
         if (e.originalEvent.preventDefault)
         {
            e.originalEvent.preventDefault();
         }
         var draggedElement = jQuery(dragSrcEl);
         var targetElement = jQuery(e.target);
         /* Sometimes the handleDrop event is fired by a child element (le sigh) -- catch this case where we can
          and attempt to recover as often as possible.
          */
         if (!targetElement.attr('draggable'))
         {
            targetElement = targetElement.closest('[draggable=true]');
         }
         if (!draggedElement.attr('draggable'))
         {
            draggedElement = draggedElement.closest('[draggable=true]');
         }
         if (draggedElement !== targetElement)
         {
            var draggedIndex = Number(draggedElement.attr('data-index'));
            var targetIndex = Number(targetElement.attr('data-index'));

            outer.elements = moveElement(outer.elements, draggedIndex, targetIndex, true);
            outer.elementValues = moveElement(outer.elementValues, draggedIndex, targetIndex, true);

            var i;
            for (i = 0; i < outer.elements.length; i = i + 1)
            {
               outer.elementValues[i].position = i;
               outer.elements[i].attr('data-index', i);
            }

            draggedElement.insertBefore(targetElement);
         }
      };
   };

   this.handleDropAfter = function()
   {
      return function(e)
      {
         if (e.originalEvent.stopPropagation)
         {
            e.originalEvent.stopPropagation();
         }
         if (e.originalEvent.preventDefault)
         {
            e.originalEvent.preventDefault();
         }
         var draggedElement = jQuery(dragSrcEl);
         var targetElement = jQuery(e.target);
         /* Sometimes the handleDrop event is fired by a child element (le sigh) -- catch this case where we can
          and attempt to recover as often as possible.
          */
         if (!targetElement.attr('draggable'))
         {
            targetElement = targetElement.closest('[draggable=true]');
         }
         if (!draggedElement.attr('draggable'))
         {
            draggedElement = draggedElement.closest('[draggable=true]');
         }
         if (draggedElement !== targetElement)
         {
            var draggedIndex = Number(draggedElement.attr('data-index'));
            var targetIndex = Number(targetElement.attr('data-index'));

            outer.elements = moveElement(outer.elements, draggedIndex, targetIndex, false);
            outer.elementValues = moveElement(outer.elementValues, draggedIndex, targetIndex, false);

            var i;
            for (i = 0; i < outer.elements.length; i = i + 1)
            {
               outer.elementValues[i].position = i;
               outer.elements[i].attr('data-index', i);
            }

            draggedElement.insertAfter(targetElement);
         }
      };
   };

   this.handleDropSwap = function()
   {
      return function(e)
      {
         if (e.originalEvent.stopPropagation)
         {
            e.originalEvent.stopPropagation();
         }
         if (e.originalEvent.preventDefault)
         {
            e.originalEvent.preventDefault();
         }
         var draggedElement = jQuery(dragSrcEl);
         var targetElement = jQuery(e.target);
         /* Sometimes the handleDrop event is fired by a child element (le sigh) -- catch this case where we can
          and attempt to recover as often as possible.
          */
         if (!targetElement.attr('draggable'))
         {
            targetElement = targetElement.parents().find('[draggable=true]').first();
         }
         if (draggedElement !== targetElement)
         {
            var draggedIndex = Number(draggedElement.attr('data-index'));
            var targetIndex = Number(targetElement.attr('data-index'));

            var tmp = outer.elementValues[targetIndex];

            tmp.position = draggedIndex;
            outer.elementValues[draggedIndex].position = targetIndex;

            outer.elementValues[targetIndex] = outer.elementValues[draggedIndex];
            outer.elementValues[draggedIndex] = tmp;

            tmp = outer.elements[targetIndex];
            outer.elements[targetIndex] = outer.elements[draggedIndex];
            outer.elements[draggedIndex] = tmp;

            draggedElement.attr('data-index', targetIndex);
            targetElement.attr('data-index', draggedIndex);

            var tmp2 = jQuery('<span>').insertAfter(draggedElement);
            var tmp3 = jQuery('<span>').insertAfter(targetElement);

            draggedElement.insertBefore(tmp3);
            targetElement.insertBefore(tmp2);

            tmp2.remove();
            tmp3.remove();
         }
         return false;
      };
   };

   this.handleDragEnd = function()
   {
      return function()
      {
         [].forEach.call(outer.elements, function(element)
         {
            outer.dom.unHoverElement(element);
            element.find('.hovered').each(function()
            {
               outer.dom.unHoverElement(jQuery(this));
            });
         });
         outer.dom.unHoverElement(outer.frame.find('.hovered'));
      };
   };

   this.ctor = function(dom)
   {
      this.dom = dom;
      if (this.dom.setDragAndDrop)
      {
         this.dom.setDragAndDrop(this);
      }
      if (this.dom === null || this.dom === undefined)
      {
         console.error('The DOM code for the calling module was not loaded');
      }
      return this;
   };

   return this.ctor(dom);
};

abacus.common.dragAndDropFormBaseDom = abacus.common.dragAndDropFormBaseDom || function()
{
   this.hoverElement = function(element)
   {
      // Sample -- implement in individual module
      // this function should change the style of whatever element is being hovered over
      // with a dragged element
      console.warn('Function hoverElement was called on ' + element + ', and is not implemented by calling module');
   };

   this.unHoverElement = function(element)
   {
      // Sample -- implement in individual module
      // this function should revert and style changes made by hoverElement
      console.warn('Function unHoverElement was called on ' + element + ', and is not implemented by calling module');
   };

   this.getDragAndDropElement = function(index, data)
   {
      // Sample -- implement in individual module
      // this function should generate a new dom element which represents whatever form element should be
      // drag and droppable
      console.warn('Function getDragAndDropElement is not implemented by calling module');
      console.warn('Unimplemented method called on index ' + index + ', and data: ' + data);

      // the following code is an example of the minimum set of calls needed to make the drag and drop ordering work
      var domElem = jQuery('<div>').
         css('cursor', 'move').
         attr('draggable', true);
      domElem.on('dragstart', abacus.common.dragAndDropForm.handleDragStart());
      domElem.on('dragenter', abacus.common.dragAndDropForm.handleDragEnter());
      domElem.on('dragover', abacus.common.dragAndDropForm.handleDragOver());
      domElem.on('dragleave', abacus.common.dragAndDropForm.handleDragLeave());
      domElem.on('drop', abacus.common.dragAndDropForm.handleDrop());
      domElem.on('dragend', abacus.common.dragAndDropForm.handleDragEnd());
   };

   this.getDragAndDropFrame = function()
   {
      // Sample -- implement in individual module
      // this function should generate the container that any draggable content will be put in
      console.warn('Function getDragAndDropFrame is not implemented by calling module');
   };
};
