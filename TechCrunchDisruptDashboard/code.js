function init() {
  	 getAPI();   	    
 }

function getAPI() {
    var $label = x$("#response");
	gm.comm.webServiceRequest(
	    function(responseObj) {
	        console.log('Success: webServiceRequest.  Response: ' + responseObj);
	        $label.html(JSON.stringify(responseObj));
	    },
	    function(responseObj) {
	        console.log('Failure: webServiceRequest.  Response: ' + responseObj);
	    },
	    {
	      url: "http://tcdisrupt13.azurewebsites.net/api",
	      method: "GET"
	    }
	);
}

function onDoneCallBack(data) {
	  console.log('onDone called with -> ' + data.value);
}

function onCancelCallBack() {
	console.log('Canceled!');
}

function showKeyboardEmail() {
	var keyboard = new gm.widgets.Keyboard({sender: null, language: "en-US", kbType: 1, feedbackMode: 0, Theme:'gmc', placeholder:'Placeholder', onDone: onDoneCallBack, onCancel:onCancelCallBack});
}
