// MultiStep Validation AJAX Form v1.0.0 for jQuery
// Under Apache License 2014
// =============
// Author: Karl VAILLANT
// Created: 01/15/2014
// Website: http://www.karlvaillant.fr
// Description: Enable step by step validation AJAX Form 
;(function( $ ) {
	var VERSION = '1.0.0';
	
	/**
	 * Main Object Constructor
	 * @param opts liste des paramètres
	 */
	function StepValidation(opts) {
		var allSteps = [];
		this._options = opts;
		this._currentStep = 0;
		if (this._options.ajaxParams && $.isArray(this._options.ajaxParams)) {
			this._numberSteps = this._options.ajaxParams.length;
			for (var i = 0; i < this._numberSteps; i++) {
				// Set the param for each step
				 var currentItem = { params : this._options.ajaxParams[i]};
		        //set the step num
		        currentItem.step = i;
		        allSteps.push(currentItem);
			}
		}
		this._allSteps = allSteps;
	}
	
	// plugin method for enable multi form
	$.stepValidation = function(opts) {
		var fullOpts = $.extend({}, $.stepValidation.defaults, opts || {});
		
		var stepV = new StepValidation(fullOpts);
		return stepV;
	};
	
	// override these in your code to change the default behavior and style
	$.stepValidation.defaults = {
		
			ajaxParams: [], // List ajax param for each ajax request
			timeout: 0, // timeout in ms between each ajax call
			breakOnFail: true, // Arret des etapes lors d'une erreur Ajax, Stop next ajax request on failure
			onBeforeNextStep:  function() {}, // handler before next ajax request call
			onNextStep :  function() {}, // Parameters = Current ajax param, current step number
	        onComplete :  function() {} // handler for the end of process
	}
	
	function _start(el){
		var self = el;
		if(self._currentStep < self._numberSteps) {
			var step = self._allSteps[self._currentStep];
			_ajaxCall(self,step);
		} else {
			complete(self);
		}
	    return self;
	}
	// Recursive chained method
	function _ajaxCall(el,step){
		var self = el;
		nextStep(self,step);
		var ajaxRequest = $.ajax(step.params).done(function( data, textStatus, jqXHR) {
			 self._previousAjaxResult = data;
			 continueTrt(self);
		  }).fail(function(jqXHR, textStatus, errorThrown) {
		    if(self._options.breakOnFail){
		    	self._currentStep = self._numberSteps;
		    	complete(self);
		    } else {
		    	continueTrt(self);
		    }
		  });
		
	}
	
	function continueTrt(self){
		// incrementation to next step
		self._currentStep++;
		if(self._currentStep<self._numberSteps){ // If there is a next ste
			// Call before next step
			beforeNextStep(self);
			var step = self._allSteps[self._currentStep];
			// Set timeout
			if($.isNumeric(self._options.timeout) && self._options.timeout > 0){
				setTimeout(function(){_ajaxCall(self,step)},self._options.timeout);
			} else {
				_ajaxCall(self,step);
			}			
		} else { // Otherwise, we are done
			complete(self);
		}
	}
	// Set new params for the next step
	function _changeNextFormParam(el,opts){
		self = el;
		var newOpts = $.extend({}, self._allSteps[self._currentStep].params, opts || {});
		self._allSteps[self._currentStep].params = newOpts;
	}
	
	//Prototype
	StepValidation.prototype = {
		start: function () {
		      _start(this);
		      return this;
	    },
	    changeNextFormParam: function (opts) {
	    	_changeNextFormParam(this,opts);
	    	return this;
	    }
	};

	$.stepValidation.version = VERSION;
  
	// List des callbacks
	
	// Callback on before next step form call
	function beforeNextStep($this){
		console.log('beforeNextStep');
		if (typeof ($this._options.onBeforeNextStep) !== 'undefined') {
			$this._options.onBeforeNextStep.call($this,$this._previousAjaxResult);
	    }
	}

	// Callback on next step form call
	function nextStep($this,nextStep){
		console.log('nextStep');
		if (typeof ($this._options.onNextStep) !== 'undefined') {
			$this._options.onNextStep.call($this,nextStep.params,nextStep.step);
	    }
	}
	
	function complete($this){
		console.log('complete');
		if (typeof ($this._options.onComplete) !== 'undefined') {
			$this._options.onComplete.call($this);
	    }
	}

})(jQuery);