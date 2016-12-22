function MyPrologConnector(port) {
    this.port = port;
};

MyPrologConnector.prototype = Object.create(MyPrologConnector.prototype);
MyPrologConnector.prototype.constructor = MyPrologConnector;

MyPrologConnector.getPrologRequest = function(requestString, onSuccess, onError) {
    var requestPort = this.port;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

    request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}
