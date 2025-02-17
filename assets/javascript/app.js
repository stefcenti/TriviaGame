
var trivia = {
  gameTimeMinutes: 0.25, // start with 1 minute to answer questions
  gameTime: 0,   // amount of time in seconds
  timeLeft: 0,   // amount of time left in seconds
  interval: 1,   // interval for updating the time on the screen in seconds
  intervalId: -1, // 
  timerId: -1,
  
  currentQ: 0, // index into the list of questions

  incorrectAnswers: 0,
  correctAnswers: 0,

  oneMinute: 60, // number of seconds in a minute

  // jQuery references
  $question: $('#question'),
  $answerSection: $('#answer-section'),
  $statsSection: $('#stats-section'),
  $pictureSection: $('#picture-section'),
  $correctCount: $('#correct-count'),
  $incorrectCount: $('#incorrect-count'),
  $unansweredCount: $('#unanswered-count'),
  $startButton: $('#start-button'),
  $timeLeft: $('#time-left'),
  $choices: [ $('#choice1'), $('#choice2'), $('#choice3'), $('#choice4') ],

  questions: [
    {
      question: "What date was the last time the Beatles recorded together?",
      choices: ['Aug 1, 1968', 'Sept 15, 1970', 'Sept 13, 1970', 'Aug 20, 1969'],
      answer: 3,
      image: "beatles2.png",
      answerText: "Aug 20, 1969, they finished 'I Want You (She's So Heavy)'"
    },
    {
      question: "Where the Beatles get the name for the song 'Strawberry Fields'",
      choices: ["From a farm near where Paul grew up.", 
                "It was the name of a Salvation Army home near where John lived.",
                "It was the name of the school that Ringo attended.",
                "From the name of a street where George lived."],
      answer: 1,
      image: "beatles3.png",
      answerText: "Strawberry Field was the name of a Salvation Army home near Woolton Liverpool."
    },
    {
      question: "What letters are the Beatles spelling out with their arms on the 'Help!' album?",
      choices: ["J P R G", "H E L P", "N U J V", "P L E H"],
      answer: 2,
      image: "beatles.h.jpeg",
      answerText: "The Beatles are spelling out N U J V using semaphore letters."
    },
    {
      question: "Who was the lead singer when 'The Silver Beatles' did a seven-day tour of Scotland?",
      choices: ["Paul McCartney", "Stuart Sutcliffe", "Johnny Gentle", "John Lennon"],
      answer: 2,
      image: "beatles1.jpeg",
      answerText: "The Silver Beatles backed up Johnny Gentle."
    },
    {
      question: "What was the first album entirely written by the Beatles?",
      choices: ["Rubber Soul", "With the Beatles", "Help!", "A Hard Day's Night"],
      answer: 3,
      image: "beatles.hdn.jpeg",
      answerText: "'A Hard Day's Night' was the first album written entirely by the Beatles."
    },
    {
      question: "How many studio hours did it take for the Beatles to record 'Sgt Pepper's Lonely Hearts Club Band'?",
      choices: ["400", "1000", "100", "250"],
      answer: 0,
      image: "beatles7.png",
      answerText: "It took 129 days or 400 studio hours to record the Sgt Pepper album."
    },
    {
      question: "Which one of the following people are NOT on the Sgt Pepper album cover?",
      choices: ["Edgar Allen Poe", "Marilyn Monroe", "Marlene Dietrich", "Elvis Presley"],
      answer: 3,
      image: "beatles4.png",
      answerText: "Elvis Presley was not on the cover."
    },
    {
      question: "Which song on 'With the Beatles' was by George Harrison?",
      choices: ["I Wanna Be Your Man",  "Don't Bother Me", "All I've Got to Do", "You Really Got a Hold on Me"],
      answer: 1,
      image: "beatles.wtb.jpeg",
      answerText: "Only 7 songs were written by McCartney/Lennon. 'Don't Bother Me' was written by George."
    },
  ],

  // Reset the game to go back to the beginning.
  initGame: function() {
    // Initialize variables to the start of a new game.
    this.currentQ = 0;
    this.incorrectAnswers = 0;
    this.correctAnswers = 0;
    this.gameTime = 0;
    this.timeLeft = 0; 

    // Reset and Redisplay the timer.
    this.showTimer();
  },

  showTimer: function() {

    if (this.intervalId != -1) {
        clearInterval(this.intervalId);
        this.intervalId = -1;
    }

    if (this.timerId != -1) {
      clearTimeout(this.timerId);
      this.timerId = -1;
    }

    this.gameTime = this.gameTimeMinutes * this.oneMinute;
    this.timeLeft = this.gameTime; // This may not be needed

    this.$timeLeft.text(this.timeConverter(this.gameTime));
  },

  // The user either just started the game or answered a question.
  // Display the current question and set our timer and interval.
  start: function() {

    this.showTimer();

    // Hide the start button
    this.$startButton.hide();

    // Display the current question
    this.showQuestion();

    // The global timer functions take time in milliseconds.
    // Since we are using seconds for our game, mult. by 1000.
    this.timerId = setTimeout(timeIsUp, this.gameTime * 1000);

    //  Use setInterval to call the timeLeft() method to update the timeLeft element
    this.intervalId = setInterval(setTimeLeft, this.interval * 1000);
  },

  showQuestion: function() {
    // Check if the user has completed all the questions
    if (this.currentQ >= this.questions.length) {
      this.gameOver();
      return;
    }

    // Set the question html to the current question
    this.$question.html("<div>" + this.questions[this.currentQ].question + "</div>");

    this.showAnswerSection();
  },

  // This will build the HTML nodes needed to toggle
  // between the answer-section and stats-section
  showAnswerSection: function() {
    // The answer section will have the button group in place with id='answer-choices'
    // Add 4 buttons for possible answer choices
    // Build the html for the answer checkox
    // Hide the other sections
    this.$statsSection.hide();
    this.$pictureSection.hide();

    for (i=0; i < this.questions[this.currentQ].choices.length; i++) {
      this.$choices[i].text(this.questions[this.currentQ].choices[i]);
    }

    // Set the answer html to the checkbox
    this.$answerSection.show();
  },

  showStatsSection: function() {
    this.$answerSection.hide();
    this.$pictureSection.hide();

    this.$correctCount.html("Correct Answers: " + this.correctAnswers);
    this.$incorrectCount.html("Incorrect Answers: " + this.incorrectAnswers);
    this.$unansweredCount.html("Unanswered: " + 
        (this.questions.length - (this.correctAnswers + this.incorrectAnswers)));

    this.$statsSection.show();  // For now, just show it.
  },

  // This method will either take a string to indicate
  //    time is up or it will take the choice entered by the user.
  // Stop the timer.
  // Check the answer choice.
  // If time is up, 
  //    replace question with timeout message
  // If correct, 
  //    increase correctAnswers,
  //    replace question with correct answer message
  // If incorrect, 
  //    increase incorrectAnswers,
  //    replace question with incorrect answer message
  // Show a picture or play a song
  // Wait a few seconds
  // Reset question and answer choice
  // Restart timer
  checkAnswer: function(choice) {
    this.showTimer();
    this.$answerSection.hide();

    var q = this.questions[this.currentQ];
    var a = "<br>" + q.answerText + "</p>";

    if (choice == "TimedOut") {
      this.$question.html("<p>Timed Out!!<br>" + a);
    }
    else if ($(choice).val() == q.answer) {
      this.correctAnswers++;
      this.$question.html("<p>That is Correct!!<br>" + a);
    } 
    else {
      this.incorrectAnswers++;
      this.$question.html("<p>Sorry!! Wrong Answer!<br>" + a);
    }

    this.$pictureSection.attr("src", "assets/images/" + q.image);
    this.$pictureSection.show(); // Need to show correct answer!

    var self = this;
    setTimeout(function(){    
      self.$pictureSection.hide();
      self.currentQ++;
      if (self.currentQ < self.questions.length) {
          self.start(); // start with the next question
      } else {
        self.gameOver();
      }
    }, 5000); // pause 5 seconds
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
    this.$timeLeft.text(this.timeConverter(this.timeLeft));

    if (this.timeLeft <= 0 && this.intervalId != -1) {
      clearInterval(this.intervalId);
    }
  },

  
  timeIsUp: function() {
    // Call checkAnswer with "TimedOut" to merely let the
    // user know time is up and to display the correct
    // answer as it would have if the user had selected one. 
    this.checkAnswer("TimedOut");
  },

  gameOver: function() {
    // The game is over. Clear the timer and interval and
    // update that stats.  Show the Start button so the
    // game can be played again.
    if (this.intervalId != -1) {
      clearInterval(this.intervalId);
      this.intervalId = -1;
    }

    if (this.timerId != -1) {
      clearTimeout(this.timerId);
      this.intervalId = -1;
    }

    this.$question.html("Game Over!!! Here's How You Did:");

    this.showStatsSection();

    this.$startButton.show();

  }
}

/****
 * FUNCTIONS
 ****/

// Handler for setInterval()
function setTimeLeft(){
  trivia.setTimeLeft();
}

// Handler for setTimeout()
function timeIsUp() {
  trivia.timeIsUp();
}

// Hander for setTimeout() in the basic trivia game
// In that game, when the time ran out, the game was over.
function gameOver(){
  trivia.gameOver();
}

$(document).ready(function() {
    // When the user clicks on the start button, initialize the game
    // and start play.
    $("#start-button").on("click", function() {
      trivia.initGame();
      trivia.start();
    });

    // When the user clicks on an answer, check the answer
    $(".choice-btn").on("click", function() {
      trivia.checkAnswer(this);
    })
});