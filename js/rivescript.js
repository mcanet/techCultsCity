export class setupRiveScript {
  constructor() {
    this.bot = new RiveScript();

    const botReady = () => {
      console.log("botReady");
      this.bot.sortReplies();
    };

    const botNotReady = () => {
      console.log("botNotReady");
    };

    // ==============================
    this.bot.setSubroutine("tmaudio", function(rs, args) {
      //console.log(rs, args);
      var obj = {
        type: "tmaudio",
        text: args[0],
        model: args[1],
        reply: args[2],
        waitingTime: args[3]
      };

      return new rs.Promise(function(resolve, reject) {
        console.log(resolve, reject);
        resolve(JSON.stringify(obj));
      });
    });

    this.bot.setSubroutine("tmimage", function(rs, args) {
      console.log(rs, args);
      var obj = {
        type: "tmimage",
        text: args[0],
        model: args[1],
        reply: args[2],
        waitingTime: args[3]
      };
      return new rs.Promise(function(resolve, reject) {
        console.log(resolve, reject);
        resolve(JSON.stringify(obj));
      });
    });

    this.bot.setSubroutine("tmpose", function(rs, args) {
      //console.log(rs, args);
      var obj = {
        type: "tmpose",
        text: args[0],
        model: args[1],
        answerID: args[2],
        waitingTime: args[3]
      };
      return new rs.Promise(function(resolve, reject) {
        console.log(resolve, reject);
        resolve(JSON.stringify(obj));
      });
    });

    this.bot.setSubroutine("speechToText", function(rs, args) {
      //console.log(rs, args);
      var obj = {
        type: "speechToText",
        text: args[0],
        answerID: args[1] !== undefined ? args[1] : "",
        waitingTime: args[2] !== undefined ? args[2] : 10,
        answer1: args[3] !== undefined ? args[3] : "",
        answer2: args[4] !== undefined ? args[4] : ""
      };
      return new rs.Promise(function(resolve, reject) {
        console.log(resolve, reject);
        resolve(JSON.stringify(obj));
      });
    });

    this.bot.setSubroutine("video", function(rs, args) {
      //console.log(rs, args);
      var obj = {
        type: "video",
        text: args[0],
        id: args[1],
        reply: args[2],
        waitingTime: args[3]
      };
      return new rs.Promise(function(resolve, reject) {
        console.log(resolve, reject);
        resolve(JSON.stringify(obj));
      });
    });

    this.bot.setSubroutine("image", function(rs, args) {
      //console.log(rs, args);
      var obj = {
        type: "image",
        text: args[0],
        url: args[1],
        reply: args[2],
        waitingTime: args[3]
      };
      return new rs.Promise(function(resolve, reject) {
        console.log(resolve, reject);
        resolve(JSON.stringify(obj));
      });
    });

    this.bot.setSubroutine("newrive", function(rs, args) {
      //console.log(rs, args);
      var obj = {
        type: "newrive",
        text: args[0],
        url: args[1],
        reply: args[2],
        waitingTime: args[3]
      };
      return new rs.Promise(function(resolve, reject) {
        console.log(resolve, reject);
        resolve(JSON.stringify(obj));
      });
    });

    this.bot
      .loadFile(["./brain/brain.rive"])
      .then(botReady)
      .catch(botNotReady);
  }

  addReplyToTextField(userText, text) {
    console.log(userText, text);
    var msg = userText + ": " + text;
    var div = document.createElement("DIV");
    div.className = userText === "Bot" ? "left" : "right";
    div.innerHTML = msg;
    document.getElementById("messages").append(div);
    var element = document.getElementsByClassName("messages")[0];
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }

  routerReply(userText, reply, callback) {
    var obj = null;
    try {
      obj = JSON.parse(reply);
    } catch (err) {}
    console.log("receive ===", reply);

    if (obj !== null) {
      console.log("found is a object ===", obj);
      callback(obj);
      this.addReplyToTextField(userText, obj.text);
    } else {
      console.log("found is a NOT object ===", reply);
      callback({ text: reply, waitingTime: 2, type: "text" });
      this.addReplyToTextField(userText, reply);
    }
  }

  loadNewRive(file) {
    this.bot
      .loadFile(["./brain/" + file])
      .then(botReady)
      .catch(botNotReady);
  }

  reply(obj, callback) {
    console.log("text in reply rivescript: ", obj.reply);
    let username = "local-user";
    if (obj.answerID == null) this.addReplyToTextField("User", obj.reply);
    var self = this;
    this.bot.reply(username, obj.reply).then(function(reply) {
      console.log("The bot says: " + reply);
      self.routerReply("Bot", reply, callback);
    });
  }
}
