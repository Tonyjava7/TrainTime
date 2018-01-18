// Initialize Firebase
var config = {
    apiKey: "AIzaSyD_7Wg45B52ObBgEemV4cF5_ikfQxzCvRE",
    authDomain: "traintime-8c069.firebaseapp.com",
    databaseURL: "https://traintime-8c069.firebaseio.com",
    projectId: "traintime-8c069",
    storageBucket: "traintime-8c069.appspot.com",
    messagingSenderId: "1051000597889"
};
firebase.initializeApp(config);

var database = firebase.database();

//Button for adding train times
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    //Grab user input
    var trnName = $("#train-name-input").val().trim();
    var trnDestination = $("#destination-input").val().trim();
    var frstTrain = moment($("#start-input").val().trim(), "HH:mm").format("X");
    var frequency = $("#frequency-input").val().trim();

    //"Temporary" object for holding train data
    var newTrain = {
        name: trnName,
        destination: trnDestination,
        firstTrain: frstTrain,
        tfrequency: frequency
    }

    //Uploads train data to the database
    database.ref().push(newTrain);

    //Log to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.tfrequency);

    alert("Train time successfully loaded");

    //Clear all of the text-boxes
    $("#train-name.input").val("");
    $("#destination-input").val("");
    $("#start-input").val("");
    $("#frequency-input").val("");

    return false;
});


database.ref().on("child_added", function(childSnapshot, preChildKey) {
    console.log(childSnapshot.val());

    //Firebase variables to snapshots.
    var fbTrnName = childSnapshot.val().name;
    var fbTrnDestination = childSnapshot.val().destination;
    var fbFrstTrain = childSnapshot.val().firstTrain;
    var fbFrequency = childSnapshot.val().tfrequency;

    console.log(fbTrnName);
    console.log(fbTrnDestination);
    console.log(fbFrstTrain);
    console.log(fbFrequency);

    //First time converted and pushed back 1 year
    var frstTrnConverted = moment(fbFrstTrain, "HH:mm").subtract(1, "years");

    var trnStartPretty = moment.unix(fbFrstTrain).format("HH:mm");

    //Calculation of next train arrival
    var timeDiff = moment().diff(moment.unix(frstTrnConverted), "minutes");

    var tRemainder = timeDiff % fbFrequency;

    var minsAway = fbFrequency - tRemainder;

    var nextTrain = moment().add(minsAway, "minutes");
    var nextTrainConverted = moment(nextTrain).format("HH:mm a");

    $("#train-table > tbody").append("<tr><td>" + fbTrnName + "</td><td>" + fbTrnDestination + "</td><td>" + fbFrequency + "</td><td>" + nextTrainConverted + "</td><td>" + minsAway + "</td><td>");

});