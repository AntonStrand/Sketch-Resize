var HORIZONTAL = 'horizontal';
var VERTICAL  = 'vertical';
var BOTH      = 'both';
var dir;
var padding;

//var baseLayer;
var layers = [];


function resize(direction, difference) {
	dir = direction;
	padding = difference || 0;
	var base;

	if( selection.count() == 1) {
		base = doc.currentPage().artboards().firstObject();
	} else if( selection.count() == 0 ) {
		alert('Not enough selected','You need to select at least one layer.');
	}

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



// Alert
function alert(title, msg) {
	var alert = COSAlertWindow.new();
	alert.setMessageText(title);
	alert.setInformativeText(msg);
	alert.runModal();
}

function alertForFeedback(title, msg, label, defaultValue) {
	var alert = COSAlertWindow.new();
	alert.setMessageText(title);
	alert.setInformativeText(msg);
	alert.addTextLabelWithValue(label);
    alert.addTextFieldWithValue(defaultValue);
    alert.addButtonWithTitle('OK');
    alert.addButtonWithTitle('Cancel');
	alert.runModal();
	return alert.viewAtIndex(1).stringValue();
}

function notify(msg) {
	doc.displayMessage(msg);
}