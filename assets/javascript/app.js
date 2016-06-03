
var trivia = {
  gameTimeMinutes: 0.25, // start with 1 minute to answer questions
  gameTime: 0,   // amount of time in seconds
  timeLeft: 0,   // amount of time left in seconds
  interval: 1,   // interval for updating the time on the screen in seconds
  intervalId: -1, //
  
  currentQ: 0, // index into the list of questions

  incorrectAnswers: 0,
  correctAnswers: 0,

  oneMinute: 60, // number of seconds in a minute

  questions: [
    {
      question: 'What color is the sky',
      choices: ['blue', 'red', 'green'],
      answer: 'blue'
    },
    {
      question: 'How many months are in a year',
      choices: [11, 12, 13],
      answer: 12
    }
  ],

  initGame: function() {
    // Initialize variables and set up a timer to start the game
    this.gameTime = this.gameTimeMinutes * this.oneMinute;
    this.timeLeft = this.gameTime; // This may not be needed

    $("#time-left").text(this.timeConverter(this.gameTime));

  },

  showQuestion: function() {
    $('#question').html("<td class='#data'>" + this.questions[this.currentQ].question + "</td>");
  },

  // The user started the game, display the first question and set our timer and interval.
  start: function() {
    // Display the first question
    this.showQuestion();

    // The global timer functions take time in milliseconds.
    // Since we are using seconds for our game, mult. by 1000.
    setTimeout(gameOver, this.gameTime * 1000);

    //  Use setInterval to call the timeLeft() method to update the timeLeft element
    this.intervalId = setInterval(setTimeLeft, this.interval * 1000);
  },

  // Takes in time (t) in seconds and converts to
  // a string minutes:seconds like so 00:00
  timeConverter: function(t){
    //This function is done. You do not need to touch it. It takes the current time in seconds and converts it to minutes and seconds (mm:ss).
    var minutes = Math.floor(t/this.oneMinute);
    var seconds = t - (minutes * this.oneMinute);
    if (seconds < 10){
      seconds = "0" + seconds;
    }
    if (minutes === 0){
      minutes = "00";
    } else if (minutes < 10){
      minutes = "0" + minutes;
    }
    return minutes + ":" + seconds;
  },

  setTimeLeft: function() {
    // Update time-left element
    this.timeLeft -= this.interval;
    $("#time-left").text(this.timeConverter(this.timeLeft));

    if (this.timeLeft <= 0) {
      clearInterval(this.intervalId);
    }

    // Set the number of valid and invalid counts in the html
  },

  diplayData: function() {
    $('#question').innerHTML = "<td>" + this.question[this.currentQ].question + "</td>";
  },

  gameOver: function() {
    alert("Game Over!! Correct Answers: " + this.correctAnswers + 
          ", Wrong Anwsers: " + this.incorrectAnswers);
  }
}


/*
        //The following line will play that audio file that you linked to above.
        audio.play();
      }
*/

/****
 * FUNCTIONS
 ****/

function setTimeLeft(){
  trivia.setTimeLeft();
}

function gameOver(){
  trivia.gameOver();
}

$(document).ready(function() {
  console.log("Basic Trivia Game");

    $("#start-button").on("click", function() {
      trivia.initGame();
      trivia.start();
    });
});