/*
 * Script for index.html
 */

let show;
let data;
let question = 0;
let results = [];

const getTrivia = () => {
  // Pull the correct trivia object based on the show chosen
  return show.trivia;
};

const showQuestion = () => {
  // Show the trivia div on the page
  $('.jumbotron').addClass('hidden');
  $('.trivia').removeClass('hidden');
  updateProgressBar();
  // Add a question to the div - var question will increase when an
  // answer is submitted in order to then display the next question
  $('.question').text(data[question].question);
  showChoices(data);
};

const updateProgressBar = () => {
  // Update the progress bar to show progress in relation to 10 quiz questions
  $('.progress-bar').attr({
    'aria-valuenow': `${question}0`,
    style: `width: ${question}0%;`
  });
  $('.sr-only').text(`${question}0% Complete`);
};

const showChoices = () => {
  // Pull the answer set based on the question
  let choice = data[question].answers;
  // Assign a single answer choice per input
  $.each(choice, (i, val) => {
    $('.answer-field' + i).text(val);
  });
};

const checkUserAnswer = answer => {
  // Pull the correct answer for the question
  let correct = data[question].correctAnswer;
  /* Compare the users answer to the correct answer and push the 
  resulting info to an array */
  answer === correct
    ? results.push({ question, response: answer, correct: true })
    : results.push({ question, response: answer, correct: false });
  showNextQuestion();
};

const showNextQuestion = () => {
  /* Checks to see what question was displayed; 
  If any remaining questions, will start loop of show question,
  populate answers, etc. again */
  if (question < 9) {
    question++;
    showQuestion();
  } else {
    // If no remaining questions, will move on to scoring
    calculateScore();
  }
};

const calculateScore = () => {
  let numberCorrect = 0;
  // Loop through the results and tally the number of correct answers
  for (i = 0; i < results.length; i++) {
    results[i].correct && numberCorrect++;
  }
  showScore(numberCorrect);
};

const showScore = number => {
  // Hide trivia div
  $('.trivia').addClass('hidden');
  // Show show-score div
  $('.show-score').removeClass('hidden');
  // Update span to show number correct
  $('.number').text(number);
  // Move on to showResults function
  showResults();
};
const showResults = () => {
  // Show results div
  $('.results').removeClass('hidden');
  // Loop through results and fill in the DOM
  for (i = 0; i < results.length; i++) {
    $(`.user-answer${i}`).text(data[i].answers[parseInt(results[i].response)]);
    $(`.correct-answer${i}`).text(
      data[i].answers[parseInt(data[i].correctAnswer)]
    );
    results[i].correct
      ? $(`.q${i}`).addClass('alert-success')
      : $(`.q${i}`).addClass('alert-danger');
  }
};

/*
 * Supernatural Trivia Data
 */

const supernatural = {
  trivia: [
    {
      question: 'What woman did Dean go live with when Sam went to hell?',
      answers: {
        2: 'Lisa',
        3: 'Cassie',
        4: 'Ruby',
        1: 'Bella'
      },
      correctAnswer: '2'
    },
    {
      question: 'What was the first creature you see the Colt kill?',
      answers: {
        1: 'Vampire',
        2: 'Werewolf',
        3: 'Demon',
        4: 'Ghoul'
      },
      correctAnswer: '1'
    },
    {
      question:
        'Which supernatural being can be identified easiest through a CCTV camera?',
      answers: {
        4: 'Shapeshifter',
        2: 'Vampire',
        3: 'Ghost',
        1: 'Wendigo'
      },
      correctAnswer: '4'
    },
    {
      question: 'How many years older than Sam is Dean?',
      answers: {
        1: 'Four',
        2: 'Three',
        3: 'Five',
        4: 'Two'
      },
      correctAnswer: '1'
    },
    {
      question: 'Who was the demon that killed Mary and Jess?',
      answers: {
        3: 'Azazel',
        2: 'Crowley',
        1: 'Alistair',
        4: 'Meg'
      },
      correctAnswer: '3'
    },
    {
      question:
        'The Archangel Gabriel was originally introduced under a different persona, but by what name was the trickster officially known?',
      answers: {
        3: 'Loki',
        2: 'Lilith',
        1: 'Papa Legba',
        4: 'Coyote'
      },
      correctAnswer: '3'
    },
    {
      question: 'Who brought Castiel back from Purgatory?',
      answers: {
        4: 'Naomi',
        2: 'Zachariah',
        3: 'God',
        1: 'Michael'
      },
      correctAnswer: '4'
    },
    {
      question: 'In the episode "The Benders", what was killing people?',
      answers: {
        4: 'Humans',
        2: 'Vampires',
        3: 'Rawheads',
        1: 'Reapers'
      },
      correctAnswer: '4'
    },
    {
      question: 'Who says this in "Yellow Fever"? "I\'ll man the flashlight!"',
      answers: {
        2: 'Dean',
        1: 'Sam',
        3: 'Cas',
        4: 'Bobby'
      },
      correctAnswer: '2'
    },
    {
      question:
        'What was the name of Sam\'s girlfriend that died in the "Pilot" episode?',
      answers: {
        4: 'Jess',
        2: 'Ruby',
        3: 'Meg',
        1: 'Cassie'
      },
      correctAnswer: '4'
    }
  ]
};

/*
 * Game of Thrones Trivia Data
 */

const gameOfThrones = {
  trivia: [
    {
      question: "What is the name of Jon's direwolf?",
      answers: {
        1: 'Lady',
        2: 'Summer',
        3: 'Grey Wind',
        4: 'Ghost'
      },
      correctAnswer: '4'
    },
    {
      question:
        "How many fingertips did Stannis Baratheon chop off of Davos' hand(s)?",
      answers: {
        1: 'Four',
        2: 'Three',
        3: 'Five',
        4: 'Two'
      },
      correctAnswer: '1'
    },
    {
      question: 'Who is king of Westeros when the the series begins?',
      answers: {
        2: 'Robert Baratheon',
        1: 'Eddard Stark',
        3: 'Tywin Lannister',
        4: 'Aerys Targaryan'
      },
      correctAnswer: '2'
    },
    {
      question:
        'What is the name of the continent on which most of the action of "Game of Thrones" takes place?',
      answers: {
        3: 'Westeros',
        2: 'Essos',
        1: 'Iseros',
        4: 'The Shadow Lands'
      },
      correctAnswer: '3'
    },
    {
      question:
        'At the end of season 2, Joffrey Baratheon sits on the Iron Throne, but which Baratheon is actually the rightful king?',
      answers: {
        4: 'Stannis Baratheon',
        2: 'Renly Baratheon',
        3: 'Tommen Baratheon',
        1: 'Myrcella Baratheon'
      },
      correctAnswer: '4'
    },
    {
      question:
        "Why could Jon leave the Night's Watch, even though his vows were for life?",
      answers: {
        2: 'He died',
        1: 'He became King',
        3: 'He knew nothing',
        4: 'He wanted to'
      },
      correctAnswer: '2'
    },
    {
      question: 'Who was the Lightning Lord?',
      answers: {
        3: 'Beric Dondarrion',
        2: 'Thoros of Myr',
        1: 'Meryn Trant',
        4: 'Randyll Tarly'
      },
      correctAnswer: '3'
    },
    {
      question:
        'In 2011, which actor who plays Tyrion Lannister, won the Golden Globe award for Best Performance by an Actor in a Supporting Role in a Series?',
      answers: {
        1: 'Peter Dinklage',
        2: 'Lena Headey',
        3: 'Nikolaj Coster-Waldau',
        4: 'Charles Dance'
      },
      correctAnswer: '1'
    },
    {
      question:
        "Who did Jon execute after his first general meeting as Lord Commander with the men of the Night's Watch?",
      answers: {
        2: 'Janos Slynt',
        1: 'Bowen Marsh',
        3: 'Alliser Thorne',
        4: 'Samwell Tarly'
      },
      correctAnswer: '2'
    },
    {
      question:
        'Which of the following types of wine does the wine merchant attempt to poison Daenerys with?',
      answers: {
        4: 'Arbor Red',
        2: 'Stormland Red',
        3: 'Vale White',
        1: 'Dornish Red'
      },
      correctAnswer: '4'
    }
  ]
};

/*
 * Doctor Who Trivia Data
 */

const doctorWho = {
  trivia: [
    {
      question:
        'When the Doctor meets Amelia Pond, what is it that he eats and actually likes?',
      answers: {
        2: 'Fish fingers and custard',
        1: 'An apple',
        3: 'A banana',
        4: 'Pie'
      },
      correctAnswer: '2'
    },
    {
      question:
        'Which one of the following is given the nickname "Potato Heads"?',
      answers: {
        1: 'Sontarans',
        2: 'Cyber men',
        3: 'Daleks',
        4: 'Ood'
      },
      correctAnswer: '1'
    },
    {
      question: 'What was Mickey called in the parallel universe?',
      answers: {
        4: 'Ricky ',
        2: 'Craig',
        3: 'Rory',
        1: 'Adam'
      },
      correctAnswer: '4'
    },
    {
      question:
        'In "The Christmas Invasion," The Doctor and Rose return to London. Who is the prime minister at the time?',
      answers: {
        1: 'Harriet Jones ',
        2: 'Winston Churchill',
        3: 'Craig Owens',
        4: 'Donna Noble'
      },
      correctAnswer: '1'
    },
    {
      question: 'Where did The Doctor and Rose first meet Captain Jack?',
      answers: {
        2: 'World War II',
        1: 'Gallifrey',
        3: 'Skaro',
        4: 'Mars'
      },
      correctAnswer: '2'
    },
    {
      question: 'Who was the 9th Doctor played by?',
      answers: {
        4: 'Christopher Eccleston ',
        2: 'David Tennant',
        3: 'Matt Smith',
        1: 'Paul McGann'
      },
      correctAnswer: '4'
    },
    {
      question:
        'Which one of the following villains is also a timelord like the Doctor?',
      answers: {
        4: 'The Master',
        2: 'Cyber Men',
        3: 'Ood',
        1: 'Abzorbalof'
      },
      correctAnswer: '4'
    },
    {
      question: 'Where is "Doctor Who" mainly filmed?',
      answers: {
        1: 'Cardiff, Wales',
        2: 'London, England',
        3: 'Edinburgh, Scotland',
        4: 'Cambridge, England'
      },
      correctAnswer: '1'
    },
    {
      question: 'What was the name of "the last human"?',
      answers: {
        2: 'Cassandra ',
        1: 'Rose',
        3: 'Jack',
        4: 'Sarah'
      },
      correctAnswer: '2'
    },
    {
      question:
        'Prime Minister of the United Kingdom during the 20th Century. This skilled veteran helped the Doctor defeat the Daleks, and even encountered the Silence in an altered timeline!',
      answers: {
        1: 'Neville Chamberlain',
        2: 'Clement Attlee',
        4: 'Harold Macmillan',
        3: 'Winston Churchill'
      },
      correctAnswer: '3'
    }
  ]
};

$(document).ready(() => {
  // When button for "Supernatural" Quiz is clicked
  $('.supernatural').click(e => {
    // Prevent Default Behavior
    e.preventDefault();
    // Set show to equal the button clicked
    show = supernatural;
    // Get Correct Trivia Object
    data = getTrivia(show);
    // Send the trivia data to the showQuestion function to start the game
    showQuestion();
  });

  // When button for "Game of Thrones" Quiz is clicked
  $('.game-of-thrones').click(e => {
    // Prevent Default Behavior
    e.preventDefault();
    // Set show to equal the button clicked
    show = gameOfThrones;
    // Get Correct Trivia Object
    data = getTrivia(show);
    // Send the trivia data to the showQuestion function to start the game
    showQuestion(data);
  });

  // When button for "Doctor Who" Quiz is clicked
  $('.doctor-who').click(e => {
    // Prevent Default Behavior
    e.preventDefault();
    // Set show to equal the button clicked
    show = doctorWho;
    // Get Correct Trivia Object
    data = getTrivia(show);
    // Send the trivia data to the showQuestion function to start the game
    showQuestion(data);
  });

  // When "Submit" button on a question is clicked
  $('.submit').click(e => {
    // Prevent Defualt Form Submit Behavior
    e.preventDefault();
    // Send the users answer to the checkUserAnswer function to be checked and stored
    checkUserAnswer($('input[name=answer-field]:checked').val());
  });

  // When button with "refresh" class is clicked
  $('.refresh').click(e => {
    // Reload the page
    location.reload();
  });
});
