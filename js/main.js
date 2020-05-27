import { setupTMAudioModel } from "./TMAudioModel.js";
import { setupTMImageModel } from "./TMImageModel.js";
import { setupTMPoseModel } from "./TMPoseModel.js";
import { setupRiveScript } from "./rivescript.js";
import { textToSpeech } from "./textToSpeech.js";
import { speechToText } from "./speechToText.js";
import { setupBarGraph, updateBarGraph } from "./bar-graph.js";

function useModel(setupModel, urlModel, waitingTime, callback) {
  let model = null;
  let timeOutTimer = null;
  setupModel(urlModel, (modelRef, data) => {
    console.log(data);
    callback(modelRef, data);
    model = model;
  });
  timeOutTimer = setTimeout(function() {
    if(setupModel===setupTMAudioModel) model.stopListening();
    
  }, waitingTime);
}

function typeInteraction(obj) {
  //
  if (obj.type === "speechToText") {
    console.log("typeInteraction: speechToText");
    let recognition = new speechToText(obj, function(reply) {
      obj.reply = reply;
      console.log("typeInteraction: speechToText reply:", reply);
      riverBrain.reply(obj, talk);
    });
  }

  // FACE-API

  // Teachable Machine
  if (obj.type === "tmaudio") {
    console.log("typeInteraction: TMaudio");
    var timer = null;
    useModel(setupTMAudioModel, obj.model, obj.waitingTime, function(data) {
      if (data[0] > 0.85) {
        //callback()
        obj.reply = obj.answerTextid + " yes";
        console.log("tmaudio answer:", obj.reply);
        riverBrain.reply(obj, talk);
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        obj.reply = obj.answerTextid + " no";
        console.log("tmaudio answer:", obj.reply);
        riverBrain.reply(obj, talk);
      }, obj.waitingTime);
      console.log(data);
      //updateBarGraph(data);
    });
  }

  if (obj.type === "tmpose") {
    console.log("typeInteraction: TMpose");
    var timer = null;
    useModel(setupTMPoseModel, obj.model, 5, function(data) {
      //updateBarGraph(data);
      if (data[0] > 0.85) {
        //callback()
        let reply = obj.answerTextid + " yes";
        console.log("tmpose answer:", reply);
        riverBrain.reply(obj, talk);
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        let reply = obj.answerTextid + " no";
        console.log("tmpose answer:", reply);
        riverBrain.reply(obj, talk);
      }, obj.waitingTime);
      console.log(data);
    });
  }

  if (obj.type === "tmimage") {
    console.log("typeInteraction: TMimage");
    var timer = null;
    useModel(setupTMImageModel, obj.model, 5, function(data) {
      //updateBarGraph(data);
      if (data[0] > 0.85) {
        let reply = obj.answerTextid + " yes";
        console.log("tmimage answer:", reply);
        riverBrain.reply(obj, talk);
        clearTimeout(timer);
      }
      timer = setTimeout(function() {
        let reply = obj.answerTextid + " no";
        console.log("tmimage answer:", reply);
        riverBrain.reply(obj, talk);
      }, obj.waitingTime);
      console.log(data);
    });
  }

  if (obj.type === "video") {

    var video = document.createElement("video");
    video.setAttribute("id", "videoRiveScript"); // assign an id
    video.setAttribute("controls", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("class", "myVideo");
    var source = document.createElement("source");
    source.setAttribute("src", obj.id);
    source.setAttribute("type", "video/mp4");
    video.appendChild(source);
    console.log(video);
    document.body.appendChild(video); // to place at end of document
    document.getElementById("videoRiveScript").style.display = "none";
    
    document.getElementById("videoRiveScript").oncanplay = function() {
      document.getElementById("videoRiveScript").style.display = "block";

      document.getElementById("youtubeRiveScript")
      console.log('get iframe object:',document.getElementById("videoRiveScript"));
      setTimeout(function() {
        var myobj = document.getElementById("videoRiveScript");
        myobj.remove();
        riverBrain.reply(obj, talk);
      }, obj.waitingTime * 1000);
    };
    
  }

  if (obj.type === "image") {
    console.log("add image");
    var img = document.createElement("img");
    img.src = obj.url;
    img.id = "imageRivescript";
    console.log(img);
    document.getElementById("App").append(img);
    console.log(document.getElementById("App"));

    setTimeout(function() {
      var myobj = document.getElementById("imageRivescript");
      myobj.remove();
      riverBrain.reply(obj, talk);
    }, obj.waitingTime * 1000);
  }

  if (obj.type === "newriver") {
    console.log("load new river");

    setTimeout(function() {
      riverBrain.reply(obj, talk);
    }, obj.waitingTime * 1000);
  }
}

let riverBrain = new setupRiveScript(function(data) {
  console.log(data);
});

function talk(obj, callback) {
  if (Object.model !== "") {
    //setupBarGraph(Object.model);
  }
  if (Object.textToSpeech !== "") {
    let talk = new textToSpeech(obj, function(obj) {
      typeInteraction(obj);
    });
  } else {
    typeInteraction(obj);
  }
}

var start = function() {
  var welcome =
    "Welcome to confesionari Rivescript test. Are you in front of the computer?";
  var obj = {
    text: welcome,
    waitingTime: 10,
    type: "speechToText",
    answer1: "yes",
    answer2: "no",
    answerTextid: "frontcomputer"
  };
  talk(obj);
};

// HTML
document.addEventListener("DOMContentLoaded", async function() {
  console.log("Page Load!");
  //start();
  // Start
  document.getElementById("startBt").addEventListener("click", function() {
    console.log("click start");
    start();
  });
  // Stop
  document.getElementById("stopBt").addEventListener("click", function() {
    console.log("click stop");
  });

  // Submit
  document.getElementById("submitBt").addEventListener("click", function() {
    console.log("click submit");
    var obj = { reply: document.getElementById("inputMessage").value };
    console.log(obj.reply);
    riverBrain.reply(obj, talk);
    document.getElementById("inputMessage").value = "";
  });

  document
    .getElementById("inputMessage")
    .addEventListener("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      //console.log(event.keyCode);
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("submitBt").click();
      }
      event.preventDefault();
    });
});
