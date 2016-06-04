
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
      question: 'What color is the sky?',
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

  // The user started the game, display the first question and set our timer and interval.
  start: function() {

    // Hide the start button
    $("#start-button").hide();

    // Display the first question
    this.showQuestion();

    // The global timer functions take time in milliseconds.
    // Since we are using seconds for our game, mult. by 1000.
    setTimeout(gameOver, this.gameTime * 1000);

    //  Use setInterval to call the timeLeft() method to update the timeLeft element
    this.intervalId = setInterval(setTimeLeft, this.interval * 1000);
  },

  // This will build the HTML nodes needed to toggle
  // between the answer-section and stats-section
  showAnswerSection: function() {
    // The answer section will have the button group in place with id='answer-choices'
    // Add 4 buttons for possible answer choices
    // Build the html for the answer checkox
   // Hide the stats-section
    $('#stats-section').hide();

     for (i=0; i < this.questions[this.currentQ].choices.length; i++) {
      var choice = "#choice" + (i+1);
      $(choice).html(this.questions[this.currentQ].choices[i]);
    }

    // Set the answer html to the checkbox
    $('#answer-section').show();
  },

  showStatsSection: function() {
    $('#answer-section').hide();

    $('#correct-count').html("Correct Answers: " + this.correctAnswers);
    $('#incorrect-count').html("Incorrect Answers: " + this.incorrectAnswers);
    $('#unanswered-count').html("Unanswered: " + 
        (this.questions.length - (this.correctAnswers + this.incorrectAnswers)));

    $('#stats-section').show();  // For now, just show it.  Later update w/ stats before showing
  },

  showQuestion: function() {
    // Check if the user has completed all the questions
    if (this.currentQ >= this.questions.length) {
      this.gameOver();
      return;
    }

    // Set the question html to the current question
    $('#question').html("<div>" + this.questions[this.currentQ].question + "</div>");

    this.showAnswerSection();

    this.currentQ++;
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

  gameOver: function() {
    // For now, display stats in an alert window
    $('#question').html("Times Up!!! Here's How You Did:");

    this.showStatsSection();
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

    // When the user clicks on the start button, initialize the game
    // and start play.
    $("#start-button").on("click", function() {
      trivia.initGame();
      trivia.start();
    });

    //
});