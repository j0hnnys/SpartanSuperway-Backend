var firebase = require('firebase');

// Initialize Firebase with our Spartan Superway database information
var config = {
    apiKey: "AIzaSyA4tiWKhfsGzygbRWgwfRb76LN4fg7gA5Q",
    authDomain: "spartan-superway.firebaseapp.com",
    databaseURL: "https://spartan-superway.firebaseio.com",
    storageBucket: "spartan-superway.appspot.com",
};
firebase.initializeApp(config);

// Get currently logged in user from signed in account
var user = firebase.auth().currentUser;
// If we want to access the user's profile information, we do so here.
if (user != null) {
    console.log('user != null');
    user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: "+profile.providerId);
        console.log("  Provider-specific UID: "+profile.uid);
        console.log("  Name: "+profile.displayName);
        console.log("  Email: "+profile.email);
        console.log("  Photo URL: "+profile.photoURL);
    });
}

// UID for test account
var userId = "Qvn71YOfXzMdmASoievQBboMEvI3";
var database = firebase.database();

function handleStatusCode(statusRef, currentTicketRef) {
    
    var statusCode = statusRef.val();
    var etaValue = 10;    
    var etaRef = currentTicketRef.child("eta");
    var timer = setInterval(function() {
        etaRef.set(etaValue);
        if (etaValue == 0) {
            
            if (statusCode == 100) {
                currentTicketRef.child("status").set(300);
            } else if (statusCode = 300) {
                currentTicketRef.child("status").set(400);
            }
            
        }
        etaValue = etaValue - 1;
    }, 1000);
    
}

// statusCode 100 set from app. 100 -> user needs pickup
var usersRef = database.ref("users")
usersRef.on("value", function(userSnapshot) {
    userSnapshot.forEach(function (snapshot) {
        
        // mutable ref for setting data
        // snapshot for reading data
        var mutableTicketRef = database.ref("users").child(snapshot.key).child("currentTicket");
        var mutableEtaRef = mutableTicketRef.child("eta");   
        var mutableStatusRef = mutableTicketRef.child("status");
        
        // Read statusCode from snapshot
        var statusCode = snapshot.child("currentTicket").child("status").val();
        if (statusCode === 100 || statusCode === 300) {
            // If timer is already on, forget it

            var timerOn = snapshot.child("currentTicket").child("timerOn").val();
            console.log("timerOn = " + timerOn);
            if (timerOn === "true") {
                console.log("timer is already on");
            } else {
                mutableTicketRef.child("timerOn").set("true");
                var etaValue = 15;
                var timer = setInterval(function() {
                    console.log("starting timer");
                    // Set eta from mutable ref
                    if (etaValue == 0) {
                        
                        clearInterval(timer);
                        if (statusCode == 100) {
                            // Set status from mutable ref
                            mutableStatusRef.set(200);
                        } else {
                            mutableStatusRef.set(400);
                        }
                        mutableTicketRef.child("timerOn").set("false");
                        return;
                    }
                    console.log("setting eta value");
                    mutableEtaRef.set(etaValue);
                    etaValue = etaValue - 1;
                }, 1000);
            }
        }
        
    });
}, function (errorObject) {
    console.log("usersRef snapshot read failed");
});


//var statusRef = database.ref("users").child(userId).child("currentTicket").child("status");
//var etaValue = 10
//var timer = setInterval(function() {
//    etaRef.set(etaValue);
//    if (etaValue == 0) {
//        clearInterval(timer);
//        console.log("Clearing timer");
//        // For demonstration:
//        // Set 200 for first countdown
//        // Set 400 for second countdown
//        statusRef.set(400)
//        return;
//    }
//    etaValue = etaValue - 1;
//}, 1000); // 1000 ms = 1 second
