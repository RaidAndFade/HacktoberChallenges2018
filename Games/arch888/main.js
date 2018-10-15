const Result = (props) => {
  return(
    <div id="result">
      {props.result === 'win' ? (
        <p className="badge badge-pill badge-success">You Won!</p>
      ): (
        <p className="badge badge-pill badge-danger">You Lost!</p>
      )}
    </div>
  );
};

const Button = (props) => {
  return(
    <div className="d-flex justify-content-center">
      <button id="new_game" className="btn btn-primary btn-sm" onClick={props.click}>New Game</button>
    </div>
  );
};

const Spaces = (props) => {
  let status = (x) => props.visible.includes(x) ? 'col-sm-1 char-space' : 'col-sm-1 char-space hide-char';
  return(
    <div id="word-letters" className="row justify-content-center">
      {props.word === '' ? (props.initial) : props.word.map((el, i) => 
        /[A-Z]/.test(el) ? (
          <div key={i} className={status(el)}>{el}</div>
        ) : (
          <div key={i} className="mx-2">{el}</div>
        ))}
    </div>
  );
};

const Category = (props) => {
  return(
    <div id="category">
      {props.category === '' ? (
        <p id="cat-lbl" className="badge badge-pill badge-danger">Click New Game</p>
      ): (
        <p id="cat-lbl" className="badge badge-pill badge-secondary">{props.category}</p>
      )}
    </div>
  );
};

const Letters = (props) => {
  let event = (props.started) ? (!props.result.length) ? props.guess : false : false;
  return(
    <div id="alphabet" onClick={event}>
      {props.keys && props.keys.map(el => 
        <button id={el.id} className={el.class}>{el.id}</button>
      )}
        <button id="hint" className="btn btn-info m-1">?</button>
    </div>
  );
};

const Gallow = () => {
  return(
    <div id="gallow">
      <div id="pole">
        <div id="noose"></div>
        <div id="diagonal"></div>
        <div id="base"></div>
      </div>
    </div>
  );
};

const Stickman = (props) => {
  let status = (x) => props.started ? props.parts.includes(x) ? 'showing' : 'hidden' : 'showing';
  return(
    <div id="stick-figure">
      <svg height="150" width="150">
        <circle id="head"  className={status('head')}  cx="25" cy="25" r="10" />
        <line   id="torso" className={status('torso')} x1="25" y1="34" x2="25" y2="85" />
        <line   id="Larm"  className={status('Larm')}  x1="0"  y1="70" x2="25" y2="40" />
        <line   id="Rarm"  className={status('Rarm')}  x1="25" y1="40" x2="55" y2="70" />
        <line   id="Lleg"  className={status('Lleg')}  x1="25" y1="85" x2="0"  y2="120" />
        <line   id="Rleg"  className={status('Rleg')}  x1="25" y1="85" x2="55" y2="120" />
      </svg>
    </div>
  );
};

const Hangman = (props) => {
  return(
    <div id="hangman-figure">
      <Gallow />
      <Stickman started={props.started} parts={props.stickman}/>
    </div>
  );
};

const Hint = (props) => {
  return(
    <div id="hint-div">
      <p id="hintText" class="badge badge-pill badge-warning">{props.hint}</p>
    </div>
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      category: '',
      word: '',
      pool: '',
      guessRight: [],
      defSpaces: [],
      guessWrong: -1,
      stickman: [],
      result: '',
      hintsUsed: -1,
      hint: ''
    };
    this.handleReset = this.handleReset.bind(this);
    this.handleFetchWord = this.handleFetchWord.bind(this);
    this.handleFetchHint = this.handleFetchHint.bind(this);
    this.handleGuessRight = this.handleGuessRight.bind(this);
    this.handleGuessWrong = this.handleGuessWrong.bind(this);
    this.handleSpaces = this.handleSpaces.bind(this);
    this.handleGuess = this.handleGuess.bind(this);
    this.handleKeyPool = this.handleKeyPool.bind(this);
    this.handleGameOver = this.handleGameOver.bind(this);
    this.handleHint = this.handleHint.bind(this);
  }
  
  componentDidMount() {
    let defSpaces = ['H','A','N','G','M','A','N'].map((el,i) => {
      return <div key={el+i} className="col-sm-1 char-space">{el}</div>
    });
    
    let pool = this.handleKeyPool();
    
    this.setState({defSpaces, pool});
  }
  
  handleKeyPool() {
    let pool = [];
    let val = 65;
    
    for (let i = 0; i < 26; i++) {
      pool.push({
        id: String.fromCharCode(val), 
        class: 'btn btn-primary letter m-1 '
      });
      val++;
    }
    
    return pool;
  }
  
  handleFetchWord() {
    fetch("https://spotless-fridge.glitch.me/word")
      .then(res =>  res.json())
      .then(data => this.handleSpaces(data))
  }
  
  handleSpaces(obj) {
    this.setState({
      word:     obj.word.toUpperCase().split(''),
      category: obj.category,
    });
  }
  
  handleFetchHint() {
    let word = this.state.word.join('');
    let num = this.state.hintsUsed + 1;
    if (num > 2) {
      this.handleHint('All hints used...');
    } else {
      fetch(`https://spotless-fridge.glitch.me/hint/${word}/${num}`)
        .then(res => res.json())
        .then(data => this.handleHint(data, num))
    }
  }
  
  handleHint(hint, num) {
    if (num === undefined) {
      this.setState({hint: hint})
    } else {
      this.setState({
        hint: `${num+1}/3 Hint: ${hint}`,
        hintsUsed: num
      });
    }
  }
  
  handleGuess(e) {
    const { pool, word } = this.state;
    let guess = e.target.id;
    let index = guess.charCodeAt() - 65;
    
    if (guess.length === 1) {
      pool[index].class = "btn btn-primary letter m-1 no-click disabled";
      (word.includes(guess)) ? this.handleGuessRight(guess) : this.handleGuessWrong();
      this.setState({ pool });
    } else if (e.target.id === 'hint') {
      this.handleFetchHint();
    }
  }
  
  handleGuessRight(char) {
    const { word } = this.state;
    
    let guessRight = [...this.state.guessRight, char];
    let finished = () => {
      let lettersOnly = word.filter(char => /[A-Z]/.test(char));
      return lettersOnly.map(el => guessRight.includes(el)).every(x => x === true);
    }
    
    if (finished()) {
      this.handleGameOver(true);
    }
    
    this.setState({ guessRight });
  }
  
  handleGuessWrong() {
    let index = this.state.guessWrong + 1;
    let parts = ['head', 'torso', 'Larm', 'Rarm', 'Lleg', 'Rleg'];
    let stickman = [...this.state.stickman, parts[index]];
    
    this.setState({
      guessWrong: index, 
      stickman: stickman
    });
    
    if (index === parts.length) {
      this.handleGameOver(false);
    }
  }
  
  handleGameOver(win) {
    if (win) {
      this.setState({result: 'win'});
    } else {
      this.setState({result: 'lose'});
    }
  }
  
  handleReset() {
    this.setState({
      started: true,
      pool: this.handleKeyPool(),
      guessRight: [],
      guessWrong: -1,
      stickman: [],
      result: '',
      hintsUsed: -1,
      hint: ''
    });
    
    this.handleFetchWord();
  }
  
  render() {
    return(
      <main className="container-fluid small-wrap">
        <Button click={this.handleReset} />
        <Hangman started={this.state.started} stickman={this.state.stickman} />
        {this.state.result.length < 1 ? (
          <Category category={this.state.category} />
        ) : (
          <Result result={this.state.result} />
        )}
        <Spaces 
          initial={this.state.defSpaces} 
          word={this.state.word} 
          visible={this.state.guessRight} 
        />
        <Letters 
          result={this.state.result} 
          keys={this.state.pool} 
          guess={this.handleGuess}
          started={this.state.started}
        />
        <Hint hint={this.state.hint} />
      </main>
    );
  }
};

ReactDOM.render(<App />, document.getElementById('app'));