var firebase = require('firebase');

// Initialize Firebase with our Spartan Superway database information
var config = {
    apiKey: "AIzaSyA4tiWKhfsGzygbRWgwfRb76LN4fg7gA5Q",
    authDomain: "spartan-superway.firebaseapp.com",
    databaseURL: "https://spartan-superway.firebaseio.com",
    storageBucket: "spartan-superway.appspot.com",
};
firebase.initializeApp(config);

// Sign into account
var email = "test@email.com";
var password = "TestEmail12345";
firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("Error code " + errorCode);
    console.log("Error message " + errorMessage);
});

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
//var etaRef = database.ref("users").child(userId).child("currentTicket").child("eta"); 
//etaRef.on("value", function(snapshot) {
//    console.log("Snapshot value = " + snapshot.val());
//}, function (errorObject) {
//    console.log("The read failed: " + errorObject.code);
//});

var usersRef = database.ref("users")
usersRef.on("value", function(userSnapshot) {

    userSnapshot.forEach(function (snapshot) {
        var snapshotVal = snapshot.val();
        var obj = snapshot.child("eta").val();
        console.log("snapshotVal = " + snapshotVal);
        console.log("eta = " + obj);

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
