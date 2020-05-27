export class speechToText {
  constructor(obj, callback) {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    var recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    console.log("recognition obj", recognition);
    let transcript = "";
    recognition.start();
    recognition.onresult = function(event) {
      transcript = event.results[0][0].transcript;
      console.log("Temp transcript:", transcript);
      // Looking for answers
      if (transcript.indexOf(obj.answer1) !== -1) {
        console.log("Transcript answer 1: ", transcript);
        clearTimeout(timer);
        let reply = obj.answerTextid + " " + obj.answer1;
        callback(reply);
        recognition.stop();
      }
      if (transcript.indexOf(obj.answer2) !== -1) {
        console.log("Transcript answer 2: ", transcript);
        clearTimeout(timer);
        let reply = obj.answerTextid + obj.answer2;
        callback(reply);
        recognition.stop();
      }
    };

    let timer = setTimeout(function() {
      console.log("Transcript: ", transcript);
      callback(transcript);
      recognition.stop();
    }, obj.waitingTime * 1000);
  }
}
