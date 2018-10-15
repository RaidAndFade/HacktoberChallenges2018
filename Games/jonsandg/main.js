window.onload = function() {
  const h = React.createElement;

  const initialState = {
    playerTurn: 1,
    playerToStart: 1,
    status: "Player 1's turn to play",
    score: {
      playerOne: 0,
      playerTwo: 0
    },
    cells: ['', '', '', '', '', '', '', '', '']
  };
  
  class Game extends React.Component {
  
    constructor (props) {
      super(props);
      this.state = initialState;
    }
  
    onResetClick () {
      this.setState(initialState)
    }

    onNewGame () {
      if (this.state.playerTurn !== -1) return;
      const playerToStart = this.state.playerToStart === 1 ? 2 : 1;
      this.setState({
        playerTurn: playerToStart,
        playerToStart,
        status: `Player ${playerToStart}'s turn to play`,
        cells: ['', '', '', '', '', '', '', '', '']
      })
    }
  
    onCellClick (id) {
      const cells = [...this.state.cells];

      if (cells[id] || this.state.playerTurn === -1) return;
      
      const symbol = this.state.playerTurn === 1 ? 'X' : 'O';

      cells[id] = symbol;

      const solutionsToCheck = []

      const rowStart = Math.floor(id / 3) * 3;
      const rowEnd = rowStart + 3;
      const row = cells.slice(rowStart, rowEnd);
      solutionsToCheck.push(row.join(''));

      const colStart = id % 3;
      const col = cells.filter((val, idx) => idx % 3 === colStart);
      solutionsToCheck.push(col.join(''));

      if (id % 2 === 0) {
        const diag = cells[0] + cells[4] + cells[8];
        solutionsToCheck.push(diag);
        
        const antiDiag = cells[2] + cells[4] + cells[6];
        solutionsToCheck.push(antiDiag);
      }

      let win = false;
      solutionsToCheck.forEach(sol => {
        if (sol === symbol.repeat(3)) {
          win = true;
        }
      })

      const playerTurn = this.state.playerTurn === 1 ? 2 : 1
      let newState = {
        cells,
        playerTurn,
        status: `Player ${playerTurn}'s turn to play`,
      };

      if (win) {
        newState = {
          cells,
          status: `Player ${this.state.playerTurn} wins!`,
          playerTurn: -1,
          score: {
            ...this.state.playerTurn === 1 && Object.assign({}, this.state.score, { playerOne: this.state.score.playerOne + 1 }),
            ...this.state.playerTurn === 2 && Object.assign({}, this.state.score, { playerTwo: this.state.score.playerTwo + 1 }),
          }
        };
      } else {
        const amountOfCellsChecked = cells.join('').length;
        if (amountOfCellsChecked === 9) {
          newState = {
            cells,
            status: 'Draw!',
            playerTurn: -1
          }
        }
      }

      this.setState(newState);
    }
  
    render () {

      const status = h('h2', null, this.state.status);
      const resetBtn = h(
        'button', 
        {
          className: 'reset_game btn btn-dark',
          onClick: () => this.onResetClick()
        }, 
        'Reset Game');
      const newGameBtn = h(
        'button', 
        {
          className: `new_game btn btn-primary btn-dark`,
          ...this.state.playerTurn !== -1 && { disabled: true },
          onClick: () => this.onNewGame()
        }, 
        'Next Game');

      const buttons = h('div', { className: 'button-container'}, [
        resetBtn,
        newGameBtn
      ]);
        
      const score = h('div', null, [
        h('div', { className: 'score-container player1'}, [
          h('span', { className: 'player' }, 'Player 1 '),
          h('span', { className: 'score' }, this.state.score.playerOne),
        ]),
        h('div', { className: 'score-container player2'}, [
          h('span', { className: 'player' }, 'Player 2 '),
          h('span', { className: 'score' }, this.state.score.playerTwo),
        ]),
      ]);
  
      const board = h(
        'div', 
        { id: 'board' },
        this.state.cells.map((cell, id) => h(Cell, { key: id, value: cell, onClick: () => this.onCellClick(id) }))
      )

      const author = h('a', { className: 'author', href: 'https://github.com/jonsandg' }, [
        h('i', { className: 'fa fa-2x fa-github-square' }),
        'Jonathan Sandgren'
      ]);
  
      return h('div', null, [
        status,
        buttons,
        score,
        board,
        author
      ]);
    }
  }
  
  const Cell = props => h(
    'div', 
    { 
      className: `cell ${props.value ? 'checked ' + props.value : ''}`, 
      onClick: props.onClick },
  );

  ReactDOM.render(
    h(Game, null),
    document.getElementById('app')
);
}
