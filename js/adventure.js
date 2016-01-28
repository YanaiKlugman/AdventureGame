var Adventures = {};

//The server path will be used when sending the chat message to the server.
//replace with your server path if needed
Adventures.SERVER_PATH = "http://localhost:7000";
//currentAdventure is used for the adventure we're currently on (id). This should be determined at the beginning of the program
Adventures.currentAdventure = 0 //todo keep track from db
//currentStep is used for the step we're currently on (id). This should be determined at every crossroad, depending on what the user chose
Adventures.currentStep = 0 //todo keep track from db
Adventures.currentUser = 0 //todo keep track from db


//TODO: remove for production
Adventures.debugMode = true;
Adventures.DEFAULT_IMG = "./images/choice.jpg";


//Handle Ajax Error, animation error and speech support
Adventures.bindErrorHandlers = function () {
    //Handle ajax error, if the server is not found or experienced an error
    $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
        Adventures.handleServerError(thrownError);
    });

    //Making sure that we don't receive an animation that does not exist
    $("#situation-image").error(function () {
        Adventures.debugPrint("Failed to load img: " + $("#situation-image").attr("src"));
        Adventures.setImage(Adventures.DEFAULT_IMG);
    });


};


//The core function of the app, sends the user's choice and then parses the results to the server and handling the response
Adventures.chooseOption = function(id){
    $.ajax("/story",{
        type: "POST",
        data: {"user": Adventures.currentUser, "adventure": Adventures.currentAdventure, "next": id.value},
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            $(".greeting-text").hide();
            Adventures.write(data);
        }
    });
};

Adventures.write = function (message) {
    //Writing new choices and image to screen

    $(".situation-text").text(message["text"]).show();
    var opt1 = $("#option_1");
    opt1.html(message["option_1"][0]);
    opt1.prop("value", message["option_1"][1]);

   var opt2 = $("#option_2");
    opt2.html(message["option_2"][0]);
    opt2.prop("value", message["option_2"][1]);
    var opt3 = $("#option_3");
    opt3.html(message["option_3"][0]);
    opt3.prop("value", message["option_3"][1]);
    var opt4 = $("#option_4");
    opt4.html(message["option_4"][0]);
    opt4.prop("value", message["option_4"][1]);
    Adventures.setImage(message["image"]);

};
Adventures.start = function(){
    $(document).ready(function () {
        $(".adventure").hide();
        $(".welcome-screen").show();
    });
}
//Setting the relevant image according to the server response
Adventures.setImage = function (img_name) {
    $("#situation-image").attr("src", "./images/" + img_name);
    };

Adventures.checkName = function(){
    var name = $("#nameField").val();
    if(name !== undefined && name !== null && name !== ""){
        $(".adventure-button").prop("disabled", false);
        }
    else{
        $(".adventure-button").prop("disabled", true);
    }


}
Adventures.initAdventure = function(id){
    var name = $("#nameField").val();

    $.ajax("/start",{
        type: "POST",
        data: {"user": name, "adventure_id": id.value},
        dataType: "json",
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            Adventures.write(data);
             $(".adventure").show();
            $(".welcome-screen").hide();
        }
    });
}

Adventures.handleServerError = function (errorThrown) {
    Adventures.debugPrint("Server Error: " + errorThrown)
    var actualError = "";
    if (Adventures.debugMode) {
        actualError = " ( " + errorThrown + " ) ";
    }
    Adventures.write("Sorry, there seems to be an error on the server. Let's talk later. " + actualError);

};

Adventures.debugPrint = function (msg) {
    if (Adventures.debugMode) {
        console.log("Adventures DEBUG: " + msg)
    }
};
Adventures.start();

