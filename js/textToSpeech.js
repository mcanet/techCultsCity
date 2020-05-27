export class textToSpeech {
  constructor(obj, callback) {
    var self = this;

    console.log("SpeechSynthesisUtterance:", obj.text);
    var utterance = new SpeechSynthesisUtterance(obj.text);
    //speechSynthesis.getVoices().forEach(voice => {
    //  console.log(voice.name, voice.lang)
    //})

    // Setup which voice to talk
    /*
        try{
            if(obj.voice){

            }
        }catch(err){}
        */
    utterance.lang = "en-EN";
    speechSynthesis.speak(utterance);
    console.log(utterance);
    utterance.onend = function() {
      console.log("Finish");
      callback(obj);
    };
  }
}
