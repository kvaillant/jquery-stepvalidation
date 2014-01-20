jquery-stepvalidation
=====================

Simplifying developers' life

This project was born to propose a step by step Ajax form validation. The execution of each ajax request depends on the success/ outcome data/ failure of the previous request.

Configuration:
-------

Include the jQuery library and this plugin:

	<script src="js/jquery.min.js"></script> <!-- jquery-1.10.1 -->
	<script src="js/jquery.stepsformvalidation.js"></script>

Inicialize-it with the default parameters:

	$(function(){
   		var stepV = $.stepValidation({}).start();
	});

Or configure it as preferred:

	$(function(){
		$.stepValidation({
		
		ajaxParams: [], // List ajax param for each ajax request
		timeout: 0, // timeout in ms between each ajax call
		breakOnFail: true, // Arret des etapes lors d'une erreur Ajax, Stop next ajax request on failure
		onBeforeNextStep:  function() {}, // handler before next ajax request call
		onNextStep :  function() {}, // Parameters = Current ajax param, current step number
        onComplete :  function() {} // handler for the end of process
        });
