var HORIZONTAL = 'horizontal';
var VERTICAL   = 'vertical';
var BOTH       = 'both';
var YES_BUTTON = '1000';
var dir;
var padding;

//var baseLayer;
var layers = [];


function resize(direction, difference) {
	dir = direction;
	padding = difference || 0;
	var base;

	if( selection.count() > 0 ) {
		if( selection.count() == 1) {
			base = doc.currentPage().artboards().firstObject();
		} 

		// Is there any layers with constrained proportions and want the user continue if it does?
		if( checkForConstrainProportions() ) {
			switch(dir){
				case HORIZONTAL:
					resizeHorizontal(base);
					notify('The content have been resized horizontally');
					break;

				case VERTICAL:
					resizeVertical(base);
					notify('The content have been resized vertically');
					break;

				case BOTH:
					reziseBoth(base);
					notify('The content have been resized');
					break;
			}
		}
	}
	else if( selection.count() == 0 ) {
		alert('Not enough selected','You need to select at least one layer.');
	}	
}


function resizeHorizontal(base) {
	var baseLayer = base || getWidest();	
	layers = getResizebleLayers(baseLayer);

	var baseW = baseLayer.frame().width();
	
	for( var i=0; i<layers.length; i++ ) {
		layers[i].frame().width = baseW + padding;
	}
}

function resizeVertical(base) {
	var baseLayer = base || getTallest();		
	layers = getResizebleLayers(baseLayer);

	var baseH = baseLayer.frame().height();
	
	for( var i=0; i<layers.length; i++ ) {
		layers[i].frame().height = baseH + padding;
	}
}

function reziseBoth(base) {
	var baseLayer = base || getLargest();		
	layers = getResizebleLayers(baseLayer);

	resizeHorizontal(baseLayer);
	resizeVertical(baseLayer);
}


function getWidest() {

	var maxWidth = 0;
	var widestLayer;
	
	for(var i=0; i<selection.count(); i++) {
		var w = selection[i].frame().width();
		
		if( w > maxWidth){
			maxWidth = w;
			widestLayer = selection[i];
		}
	}

	return widestLayer;
}

function getTallest() {
	
	var maxHeight = 0;
	var tallestLayer;	

	for(var i=0; i<selection.count(); i++) {
		var h = selection[i].frame().height();
		
		if( h > maxHeight ){
			maxHeight = h;
			tallestLayer = selection[i];
		}
	}

	return tallestLayer;
}

function getLargest(){
	
	var maxWidth = 0;
	var maxHeight = 0;
	var largestLayer;

	for( var i=0; i<selection.count(); i++) {
		var w = selection[i].frame().width();
		var h = selection[i].frame().height();
		
		if( w > maxWidth && h > maxHeight ){
			maxWidth = w;
			maxHeight = h;
			largestLayer = selection[i];
		}
	}
	
	return largestLayer;
}


function getResizebleLayers(largest) {
	var resizeLayers = [];
	for( var i=0; i<selection.count(); i++) {

		if(selection[i] != largest){
			resizeLayers.push(selection[i]);
		}
	}
	return resizeLayers;
}


function checkForConstrainProportions() {
	var numConstrain = 0;
	var continueScript = true;

	for (var i = selection.count() - 1; i >= 0; i--) {
		if(selection[i].constrainProportions()){
			numConstrain++;
		}
	}

	if( numConstrain >0 ) {
		var numerus = (numConstrain == 1) ? 'layer has' : 'layers have';
		var result = alert('Constrained Propotions', numConstrain + ' ' + numerus + ' constrained propotions. Do you want to continue anyway?',['Yes','No','Remove constraint']);
		
		log(result);

		continueScript = (result == YES_BUTTON);

		// The user clicked "Remove constraints"
		if(result == '1002') {
			removeConstrainProporions();
			continueScript = true;
		}
	}

	return continueScript;
}

function removeConstrainProporions() {
	for (var i = selection.count() - 1; i >= 0; i--) {
		if(selection[i].constrainProportions()){
			selection[i].constrainProportions = false;
		}
	}
}


// Alert
function alert(title, msg, buttons) {
	var alert = COSAlertWindow.new();
	alert.setMessageText(title);
	alert.setInformativeText(msg);
	if (buttons instanceof Array) {
		var t;
		for( t in buttons ){
			alert.addButtonWithTitle( buttons[t] );
		}
	}
    else alert.addButtonWithTitle(buttons || 'OK');
	return alert.runModal();
}

function alertForFeedback(title, msg, label, defaultValue) {
	var alert = COSAlertWindow.new();
	alert.setMessageText(title);
	alert.setInformativeText(msg);
	alert.addTextLabelWithValue(label);
    alert.addTextFieldWithValue(defaultValue);
    alert.addButtonWithTitle('OK');
    alert.addButtonWithTitle('Cancel');
	var responseCode = alert.runModal();
	var difference = Number(alert.viewAtIndex(1).stringValue());
	return [responseCode, difference];
}

function notify(msg) {
	doc.displayMessage(msg);
}