const WORDS = ["afraid", "apparition", "bat", "bloody", "bones", "broomstick", "cackle", "cadaver", "candy", "carve", "casket", "cauldron", "cemetery", "cobweb", "coffin", "costume", "creepy", "eerie", "fangs", "frightening", "ghost", "ghoul", "goblin", "gory", "grave", "Grim Reaper", "haunted", "howl", "Jack-O-Lantern", "leaves", "magic", "mausoleum", "monster", "morbid", "mummy", "owl", "phantom", "potion", "pumpkin", "RIP", "scary", "scream", "shadow", "skeleton", "skull", "specter", "spell", "spider", "spirits", "spooky", "superstition", "tombstone", "treat", "trick", "unearthly", "unnerving", "vampire", "warlock", "werewolf", "witch", "wizard", "wraith", "zombie"];

function Card() {
  let el = document.createElement('div');
  el.classList.add('card');
  el.deselect = function() {
    el.classList.remove('selected');
    el.gameProps.selected = false;
    el.innerHTML = '';
  }
  el.select = function() {
    el.classList.add('selected');
    el.gameProps.selected = true;
    setTimeout(()=> {
      el.innerHTML = el.gameProps.value;
    }, 250);
  }

  el.matched = function() {
    el.classList.add('matched');
    el.gameProps.matched = true;
    el.innerHTML = el.gameProps.value;
  }
  
  el.gameProps = {
    value: '',
    selected: false,
    matched: false
  };
  return el;
}

function Game() {
  this.cards = [];
  this.matches = 0;
  this.selectedPair = [];
  this.inCooldown = false;
  this.cooldownTime = 1000;
  this.difficulties = {
    easy: {
      name: 'easy',
      display: '4x4',
      gridSize: 4
    },
    medium: {
      name: 'medium',
      display: '6x6',
      gridSize: 6
    },
    hard: {
      name: 'hard',
      display: '8x8',
      gridSize: 8
    },
    insane: {
      name: 'insane',
      display: '10x10',
      gridSize: 10
    }
  };
  this.difficulty = this.difficulties.easy;
  
  this.gameControls = document.querySelector('#gameControls');
  this.board = document.querySelector('#gameBoard');
  this.endGameOverlay;

  this.start = function() {
    this.setupGameControls();
    this.generate();
  }

  this.generate = function() {
    this.board.className = '';
    this.board.classList.add(this.difficulty.name);
    let newcards = [];
    let totalCards = this.difficulty.gridSize * this.difficulty.gridSize;
    for(let i = 0; i < totalCards; i++) {
      const card = new Card();
      card.addEventListener('click', () => {
        this.selectCard(card);
      });
      newcards.push(card);
    }
    const words = this.pickWords(totalCards/2);
    for(i = 0; i < totalCards; i+=2) {
      const word = words[Math.floor(i/2)];
      newcards[i].gameProps.value = word;
      newcards[i+1].gameProps.value = word;
    }
    newcards = this.shuffle(newcards);
    for(let card of newcards) {
      this.addCard(card);
    }
  }

  this.setupGameControls = function() {
    const btnRestart = document.createElement('button');
    btnRestart.innerText = 'New Game';
    btnRestart.addEventListener('click', () => {
      this.reset();
    });
    this.gameControls.appendChild(btnRestart);

    const gameModeText = document.createElement('span');
    gameModeText.innerText = 'Board Size: ';
    this.gameControls.appendChild(gameModeText);

    const difficultySelection = document.createElement('select');
    for(let key of Object.keys(this.difficulties)) {
      const opt = document.createElement('option');
      const difficulty = this.difficulties[key];
      opt.innerText = difficulty.display;
      opt.value = difficulty.name;
      difficultySelection.appendChild(opt);
    }
    difficultySelection.addEventListener('change', (e) => {
      this.difficulty = this.difficulties[e.target.value];
    });
    this.gameControls.appendChild(difficultySelection);

  }

  this.addCard = function(card) {
    this.cards.push(card);
    this.board.appendChild(card);
  }
  this.selectCard = function(card) {
    if(this.inCooldown || card.gameProps.selected || card.gameProps.matched) return;

    if(this.selectedPair.length === 0) {
      card.select();
      this.selectedPair.push(card);
    }
    else if(this.selectedPair.length === 1) {
      this.selectedPair.push(card);
      card.select();
      setTimeout( () => {
        this.compareCards();
        this.resetSelections();
      }, this.cooldownTime);
      this.inCooldown = true;
    }
  }

  this.compareCards = function() {
    if(this.selectedPair[0].gameProps.value === this.selectedPair[1].gameProps.value) {
      this.selectedPair[0].deselect();
      this.selectedPair[1].deselect();
      this.selectedPair[0].matched();
      this.selectedPair[1].matched();
      this.matches++;
      if(this.matches == Math.floor(this.cards.length/2)) {
        this.endGame();
      }
    }
  }

  this.resetSelections = function() {
    if(!this.selectedPair[0].gameProps.matched) {
      this.selectedPair[0].deselect();
    }
    if(!this.selectedPair[1].gameProps.matched) {
      this.selectedPair[1].deselect();
    }
    this.selectedPair = [];
    this.inCooldown = false;
  }

  this.shuffle = function(array) {
    let counter = array.length;
    let shuffled = [];
    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
        shuffled[counter] = array[counter];
        shuffled[index] = array[index];
    }
    return shuffled;
}

  this.pickWords = function(numwords) {
    return this.shuffle(WORDS).splice(0,numwords);
  }

  this.endGame = function() {
    this.endGameOverlay = document.createElement('div');
    this.endGameOverlay.setAttribute('id', 'endGameOverlay');
    this.endGameOverlay.innerHTML = "<div class='txt-outline'>Winner!</div>";
    const newGameBtn = document.createElement('button');
    newGameBtn.classList.add('btn-large');
    newGameBtn.innerText = "Play Again";
    newGameBtn.addEventListener('click', () => {
      this.reset();
    });
    this.endGameOverlay.appendChild(newGameBtn);
    this.board.appendChild(this.endGameOverlay);
  }

  this.reset = function() {
    this.board.innerHTML = '';
    this.cards = [];
    this.matches = 0;
    this.selectedPair = [];
    this.inCooldown = false;
    this.generate();
  }

}

function Main() {
  const game = new Game();
  game.start();
}

new Main();