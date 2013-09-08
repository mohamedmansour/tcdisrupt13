/*
 * Code-samples JavaScript
 */

var ttsInput, txtPhone, textMsgNum, textMsg, txtFilename, txtContents, txtRead, txtDelete;

function init() {

	// Create Expandable regions
	x$(".group").addClass("closed");
	x$(".group .title").on("click", function() {
		var el = x$(this.parentNode);
		if (el.hasClass("closed"))
			el.removeClass("closed");
		else
			el.addClass("closed");
	});
	
	// BUTTON AND INPUT WIDGETS
	
	// Text to Speech
	ttsInput = new gm.widgets.TextField({
				value:"something to say",
				parentElement: document.getElementById('speech-input')
			});
	ttsInput.render(); // associated html element id=speech-input
	var ttsBtn = new gm.widgets.Button({
				callBack: startTTS,
				label:"Say it",
		        parentElement: document.getElementById('speech-button')
			});
	ttsBtn.render(); //associated html element id=speech-button
	
	// Dial Phone Number
	txtPhone = new gm.widgets.TextField({
			value:"1234567890",
			parentElement: document.getElementById('phone-input')
		});
	txtPhone.render(); // associated html element id=phone-input
	var phoneBtn = new gm.widgets.Button({
			callBack: callPhone,
			label:"Dial Number",
	        parentElement: document.getElementById('phone-button')
		});
	phoneBtn.render(); // associated html element id=phone-button
	
	// Get Radio Info
	var radioBtn = new gm.widgets.Button({
		callBack: getRadio,
		label:"Get Radio Info",
        parentElement: document.getElementById('radio-btn')
	});
	radioBtn.render(); //associated html element
	
	// GPS
	var gpsBtn = new gm.widgets.Button({
		callBack: getPosition,
		label:"Get location",
        parentElement: document.getElementById('gps-button')
	});
	gpsBtn.render();

	var watchGPS = new gm.widgets.Button({
		callBack: watchPosition,
		label:"Watch GPS location",
        parentElement: document.getElementById('watch-gps-button')
	});
	watchGPS.render();
	
	//NAV
	
	var watchDestBtn = new gm.widgets.Button({
		callBack: watchDest,
		label:"Watch Destination",
        parentElement: document.getElementById('watchDest-button')
	});
	watchDestBtn.render();
	
	var clearDestBtn = new gm.widgets.Button({
		callBack: clearDest,
		label:"Clear Destination",
        parentElement: document.getElementById('clearDest-button')
	});
	clearDestBtn.render();
	
	// Send Text Message
	textMsgNum = new gm.widgets.TextField({
			value:"1234567890",
			parentElement: document.getElementById('txt-number')
		});
	textMsgNum.render(); // associated html element id=phone-input
	textMsg = new gm.widgets.TextField({
			value:"Text message contents",
			parentElement: document.getElementById('txt-value')
		});
	textMsg.render(); // associated html element id=phone-input
	var txtMsgBtn = new gm.widgets.Button({
			callBack: sendText,
			label:"Send Text",
	        parentElement: document.getElementById('txt-button')
		});
	txtMsgBtn.render(); // associated html element id=phone-button
	
	// Write to file
	txtFilename = new gm.widgets.TextField({
		value:"dir/subdir/myfile.txt",
		parentElement: document.getElementById('file-name-input')
	});
	txtFilename.render();
	
	txtContents = new gm.widgets.TextField({
		value:"file contents",
		parentElement: document.getElementById('contents-input')
	});
	txtContents.render();

	var fileWriteBtn = new gm.widgets.Button({
				callBack: writeFile,
				label:"Write file",
		        parentElement: document.getElementById('file-write-btn')
			});
	fileWriteBtn.render();
	
	// Read from file
	txtRead = new gm.widgets.TextField({
		value:"dir/subdir/myfile.txt",
		parentElement: document.getElementById('file-read-input')
	});
	txtRead.render();

	var fileReadBtn = new gm.widgets.Button({
				callBack: readFile,
				label:"Read file",
		        parentElement: document.getElementById('file-read-btn')
			});
	fileReadBtn.render();
	
	// Delete file
	txtDelete = new gm.widgets.TextField({
		value:"dir/subdir/myfile.txt",
		parentElement: document.getElementById('file-del-input')
	});
	txtDelete.render();

	var fileDelBtn = new gm.widgets.Button({
				callBack: deleteFile,
				label:"Delete file",
		        parentElement: document.getElementById('file-del-btn')
			});
	fileDelBtn.render('#file-del-btn');
	
	
	// Audio Control
	var playBtn = new gm.widgets.Button({ callBack: play, label: "Play",
        parentElement: document.getElementById('audio-play') });
	playBtn.render();

	var pauseBtn = new gm.widgets.Button({ callBack: pause, label: "Pause",
        parentElement: document.getElementById('audio-pause') });
	pauseBtn.render();
	
	var seekBtn = new gm.widgets.Button({ callBack: seek, label: "Seek to 30 sec",
        parentElement: document.getElementById('audio-seek') });
	seekBtn.render();
	
	var stopBtn = new gm.widgets.Button({ callBack: stop, label: "Stop",
        parentElement: document.getElementById('audio-stop') });
	stopBtn.render();
	
	var playVideo = new gm.widgets.Button({ callBack: playVid, label: "Play video",
        parentElement: document.getElementById('video-play') });
	playVideo.render();
	
	// Create menu
	var menuButton = new gm.widgets.Button({ callBack: setMenu, label: "Create Interaction Selector",
        parentElement: document.getElementById('menu-btn')});
	menuButton.render();
	
	// Watch proximity
	var proximityButton = new gm.widgets.Button({ label: "Start monitoring", 
		callBack: watchProx,
        parentElement: document.getElementById('prox-button')
	});
	proximityButton.render();
	
	// Watch vehicle speed (Park, LowSpeed or HighSpeed)
	var speedButton = new gm.widgets.Button({ label: "Start monitoring vehicle speed", 
		callBack: watchSpeed,
        parentElement: document.getElementById('watch-speed-button')
	});
	speedButton.render();
	
	// Get Vehicle configuration information
	var configButton = new gm.widgets.Button({ label: "Get Vehicle Configuration Information", 
		callBack: getConfig,
        parentElement: document.getElementById('vehicle-config-button')
	});
	configButton.render();
	
	// Get Vehicle data
	var vehicleDataBtn = new gm.widgets.Button({ label: "Get Vehicle Data", 
		callBack: getVehicleData,
        parentElement: document.getElementById('vehicle-data-button')
	});
	vehicleDataBtn.render();
	
	// Set a favorite
	var faveBtn = new gm.widgets.Button({ label: "Set Favorite", 
		callBack: setFave,
        parentElement: document.getElementById('fave-button')
	});
	faveBtn.render();
	
	// Show alert
	var alertBtn = new gm.widgets.Button({ label: "Show alert", 
		callBack: showAlert,
        parentElement: document.getElementById('show-alert-button')
	});
	alertBtn.render();

    var keyboardBtn = new gm.widgets.Button({ label: "Show keyboard",
        callBack: showKeyboard,
        parentElement: document.getElementById('keyboard')
    });
    keyboardBtn.render();

    var keyboardBtn = new gm.widgets.Button({ label: "Show keyboard",
    	callBack: showKeyboardEmail,
        parentElement: document.getElementById('keyboardEmail')
    });
    keyboardBtn.render();

    var numpadBtn = new gm.widgets.Button({ label: "Show numpad",
        callBack: showNumpad,
        parentElement: document.getElementById('numpadS')
    });
    numpadBtn.render();

    var numpadMultBtn = new gm.widgets.Button({ label: "Init numpad",
        callBack: showNumpadMult,
        parentElement: document.getElementById('numpadMult')
    });
    numpadMultBtn.render();

    var keyboardMultBtn = new gm.widgets.Button({ label: "Init keyboard",
        callBack: showKeyboardMult,
        parentElement: document.getElementById('keyboardMult')
    });
    keyboardMultBtn.render();
    
    // other widget rewrites
    var new_cb01 = new gm.widgets.Checkbox({"label":"Checkbox","parentElement":document.getElementById("checkboxDiv")});
	var new_cb02 = new gm.widgets.Checkbox({"label":"Checkbox - checked","checked":"checked","parentElement":document.getElementById("checkboxDiv")});
	var new_cb03 = new gm.widgets.Checkbox({"label":"Checkbox checked & disabled","disabled":"true","checked":"checked","parentElement":document.getElementById("checkboxDiv")});
	new_cb01.render();
	new_cb02.render();
	new_cb03.render();
	
	var rbCallBack = function(){
		console.log("The radio button selection is now " + String(new_rb01.getValue()));
	}
	
	var new_rb01 = new gm.widgets.RadioButton({
		"label":"Test Radio Button Group",
		"groupName":"TestRadioButtonGroup",
		"callBack":rbCallBack,
		"parentElement":document.getElementById("radiobuttonDiv"),
		"choices":[
			{"label":"Option 01", "value":"option 01","checked":"checked"},
			{"label":"Option 02", "value":"option 02"},
			{"label":"Option 03","value":"option 03"},
			{"label":"Disabled Option 04","value":"option 04"},
			{"label":"Option 05","value":"option 05"},
			{"label":"Disabled Option 06","value":"option 06","disabled":"disabled"}
		]
	});
	new_rb01.render();

	var new_tf = new gm.widgets.TextField({"label":"Text Field","parentElement":document.getElementById("textfieldDiv")});
	new_tf.render();

	var new_pwf = new gm.widgets.PasswordField({"label":"Password Field","parentElement":document.getElementById("passwordDiv"),"inputType":"password"});
	new_pwf.render();

	var new_nf = new gm.widgets.NumberField({"label":"Numberfield","min":"0","max":"100","parentElement":document.getElementById("numberfieldDiv")});
	new_nf.render();
    
    // more new widget examples
    var new_about = new gm.widgets.About({"parentElement":document.getElementById('new-about-widget')});
   	new_about.render();
    
    var new_closeapp = new gm.widgets.CloseApp({"parentElement":document.getElementById('new-closeapp-widget')});
    new_closeapp.render();
    
    var new_fav = new gm.widgets.SetFavorite({"parentElement":document.getElementById('new-setfav-widget')});
	new_fav.render();
    
    var new_ts_selections = ["A","BB","CCC","DDDD","EEEEE","FFFFFF","GGGGGGG","HHHHHHHH","IIIIIIIII","J","K2","LLLL","MMMMMMMMM","NN","OO"];
	var new_ts = new gm.widgets.TextSpinner({"label":"Text Spinner","parentElement":document.getElementById('new-ts-widget'),"selections":new_ts_selections});
	new_ts.render();
	
	var datePicker = new gm.widgets.DatePicker({"label":"Pick a date", "parentElement":document.getElementById('new-datepicker-widget'),"language":"en_US"});
    datePicker.render();
    
    var timePicker = new gm.widgets.TimePicker({"parentElement":document.getElementById('new-timepicker-widget')});
    timePicker.render();
    
}

// GM API CALLS

var audioHandle;

var play = function() {
	audioHandle = gm.media.play('test.mp3', 'mixedAudio');
	console.log('clicked');
};

var pause = function(e) {
	gm.media.pause(audioHandle);
};

var stop = function() {
	gm.media.stop(audioHandle);
};

var seek = function() {
	gm.media.seek(audioHandle, 30000);
};

var startTTS = function(args) {
	gm.voice.startTTS(function(){}, function(){}, ttsInput.getValue());
};

var callPhone = function(args) {
	gm.phone.dialPhoneNumber(function(){}, function(){}, { 
		phone: txtPhone.getValue(),  
		callParameters: { 
			"noiseSuppression": "Standard", 
			"phoneSource": "OnStar", 
			"deviceHandle": 123455
		} 
	});
};

var getRadio = function(args) {
	gm.info.getRadioInfo(function(data) {
		x$("#radio-output").inner(JSON.stringify(data));
	});
};

var getPosition = function() {
	gm.info.getCurrentPosition(function(pos){
		console.log('success');
		x$("#gps-output").html(pos.coords.latitude + "'" + pos.coords.longitude + "\"");
	}, function(args) {
		console.log('fail');
		x$("#gps-output").html("no gps data - load a route");
	}, {});
};

var watchPosition = function() {
	gm.info.watchPosition(function(pos){
		console.log('success');
		x$("#watch-gps-output").html(pos.coords.latitude + "'" + pos.coords.longitude + "\"");
	}, function(args) {
		console.log('fail');
		x$("#watch-gps-output").html("no gps data - load a route");
	}, {});
};

var sendText = function(args) {
	gm.phone.sendTextMessage(
			function(){console.log('text success');}, 
			function(){console.log('text error');}, 
			{ 
				phone : textMsgNum.getValue(),
				message : textMsg.getValue()
			});
};

var writeFile = function(args) {
	var result = gm.io.writeFile(txtFilename.getValue(), txtContents.getValue());
	if (result == 11) {
		console.log('Successfully wrote to file');
	}
	else {
		console.log('Failed to write to file');
	}
};

var readFile = function(args) {
	var result = gm.io.readFile(txtRead.getValue());
	if(typeof result === 'number') {
		console.log('Failed to read file');
	} else {
		alert('File contents: ' + result);
	}

};

var deleteFile = function(args) {
	var result = gm.io.deleteFile(txtDelete.getValue());
	if (result == 11) {
		console.log('Successfully deleted file');
	}
	else {
		console.log('Failed to delete file');
	}
};

var watchProx = function() {
	gm.info.watchProximity(function(isOn) {
		x$("#prox-output").inner(isOn == true ? 
				"Proximity triggered (user's hand is near)" :
				"Proximity off (user's hand not detected)"
		);
	});
};

var playVid = function() {
	gm.media.play("http://static.clipcanvas.com/sample/clipcanvas_14348_H264_640x360.mp4", "video");
};

var watchSpeed = function() {
	gm.system.watchSpeed(function(spd) {
		switch (spd) {
			case 0:
				x$("#watch-speed-output").inner("PARK"); break;
			case 1:
				x$("#watch-speed-output").inner("LOWSPEED"); break;
			case 2: 
				x$("#watch-speed-output").inner("HIGHSPEED"); break;
		}
	});
};

var getConfig = function() {
	gm.info.getVehicleConfiguration(function(args) {
		x$("#vehicle-config-output").inner(JSON.stringify(args));
	});
};

var getVehicleData = function() {
	gm.info.getVehicleData(function(args) {
		x$("#vehicle-data-output").inner(JSON.stringify(args));
	});
};

var setFave = function() {
	gm.ui.setFavorite(function(faveId) {
		x$("#fave-output").inner("success, favorite Id: " + faveId);
	}, function() {
		x$("#fave-output").inner("failed");
	}, {
		title: "Nitobi Software",
		URL: "http://www.nitobi.com"
	});
};

var showAlert = function() {
	var alertOptions = {
			alertTitle : 'The Alert Title', 
			alertDetail : 'Some details about the alert.',
			primaryAction : function(){
				x$("#show-alert-output").inner("primary action clicked");
			},
			secondaryAction : function() {
				x$("#show-alert-output").inner("secondary action clicked");
			},
			primaryButtonText : 'OK',
			secondaryButtonText : 'Cancel' 
	};

	gm.ui.showAlert(function(){}, function(){}, alertOptions);
};

var setMenu = function() {
	gm.ui.setInteractionSelector(function() {
		console.log('error');
	}, menuOpts);
};

var menuOpts = {
	button1_type:"text",
	button1_text:"BUTTON ONE",
	button1_action: function(arg) { ok(true, "button 1 should get clicked once"); },
	button2_type:"icon",
	button2_text:"Icon.png",
	button2_action: function(arg) { console.log('button 2!' + arg);},
	button3_type:"text",
	button3_text:"BUTTON THREE",
	button3_action: function(arg) { console.log('button 3!' + arg);},
	button4_type:"text",
	button4_text:"BUTTON FOUR",
	button4_action: function(arg) { console.log('button 4!' + arg);},
	button5_type:"text",
	button5_text:"BUTTON FIVE",
	button5_action: function(arg) { console.log('button 5!' + arg);},
	button6_type:"text",
	button6_text:"BUTTON SIX",
	button6_action: function(arg) { console.log('button 6!' + arg);},
	button7_type:"text",
	button7_text:"BUTTON SEVEN",
	button7_action: function(arg) { console.log('button 7!' + arg);}
};

var showKeyboard = function() {
	var onDoneCallBack = function (data) {
		console.log('onDone called with -> ' + data.value);
	};

	var onCancelCallBack = function () {
		console.log('Canceled!');
	};

	var keyboard = new gm.widgets.Keyboard({sender: null, language: "en-US", kbType: 1, feedbackMode: 0, Theme:'gmc', placeholder:'Placeholder', onDone: onDoneCallBack, onCancel:onCancelCallBack});
};

var showKeyboardEmail = function() {
	var onDoneCallBack = function (data) {
		console.log('onDone called with -> ' + data.value);
	};

	var onCancelCallBack = function () {
		console.log('Canceled!');
	};
	var keyboardEmail = new gm.widgets.Keyboard({sender: null, language: "en-US", kbType: 2, feedbackMode: 0, Theme:'gmc', placeholder:'Placeholder', onDone: onDoneCallBack, onCancel:onCancelCallBack});
};

var showNumpad = function() {
	var onDoneCallBack = function (data) {
		console.log('onDone called with -> ' + data);
	};

	var onCancelCallBack = function () {
		console.log('Canceled!');
	};
	var numberpad = new gm.widgets.Numberpad({sender: null, language: "en-US",placeholder: "Placeholder", onDone: onDoneCallBack, onCancel:onCancelCallBack});
};

var showNumpadMult = function() {
	var numberpadMult = new gm.widgets.Numberpad({sender: 'numpadDiv', language: "en-US"});
};

var showKeyboardMult = function() {
	var keyboardMult = new gm.widgets.Keyboard({sender: 'keyboardDiv', language: "en-US", kbType:1, feedbackMode: 0, Theme: 'gmc'});
};

var watchDest = function () {
	gm.nav.watchDestination(function (dest) {
		console.log("Watch Destination Success -> "+ dest);
	}, function () {
		console.log("Watch Destination Failed");
	});
};

var clearDest = function () {
	gm.nav.clearDestination();
};

