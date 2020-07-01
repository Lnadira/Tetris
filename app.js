document.addEventListener('DOMContentLoaded', () => {
  //make the actual game grid
  for (x=0; x<200; x++) {
        var grid = document.createElement('div');
        grid.className = "game-grid";
        document.getElementById('grid').appendChild(grid);
  };

  //extension of game grid to indicate bottom of grid
  for (x=0; x<10; x++) {
    var grid = document.createElement('div');
    grid.className = "taken";
    document.getElementById('grid').appendChild(grid);
  };

    //side parameter is to tell which display box to use
  //0 is for the hold display and 1 is for the next display
  function showFourGrids(side) {
    document.getElementsByClassName("two-grid")[side].style.display = "none";
    document.getElementsByClassName("three-grid")[side].style.display = "none";
    document.getElementsByClassName("four-grid")[side].style.display = "grid";
  }

  function showThreeGrids(side) {
    document.getElementsByClassName("two-grid")[side].style.display = "none";
    document.getElementsByClassName("four-grid")[side].style.display = "none";
    document.getElementsByClassName("three-grid")[side].style.display = "grid";
  }

  function showTwoGrids(side) {
    document.getElementsByClassName("four-grid")[side].style.display = "none";
    document.getElementsByClassName("three-grid")[side].style.display = "none";
    document.getElementsByClassName("two-grid")[side].style.display = "grid";
  }


  const tetrisGrid = document.querySelector('#grid');
  let squares = Array.from(document.querySelectorAll('#grid div'));
  const scoreDisplay = document.querySelector('#score');
  const linesDisplay = document.querySelector('#lines');
  const startBtn = document.querySelector('#start-button');
  const resetBtn = document.querySelector('#reset-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
  let lines = 0;
  const colors = [
    '#EFBDEB',
    '#84BC9C',
    '#6461A0',
    '#314CB6',
    '#2CA58D',
    '#B68CB8',
    '#0A81D1'
  ];

  //The Tetrominoes
  const iTetromino = [
    [0, 1, 2, 3],
    [0, width, width*2, width*3],
    [0, 1, 2, 3],
    [0, width, width*2, width*3]
  ];

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
  ];

  const tTetromino = [
    [0, 1, 2, width+1],
    [1, width, width+1, width*2+1],
    [width+1, width*2, width*2+1, width*2+2],
    [0, width, width+1, width*2]
  ];

  const lTetromino = [
    [0, 1, 2, width],
    [0, 1, width+1, width*2+1],
    [width+2, width*2, width*2+1, width*2+2],
    [0, width, width*2, width*2+1]
  ];

  const jTetromino = [
    [0, 1, 2, width+2],
    [2, width+2, width*2+1, width*2+2],
    [width, width*2, width*2+1, width*2+2],
    [0, 1, width, width*2]
  ];

  const zTetromino = [
    [0, 1, width+1, width+2],
    [1, width, width+1, width*2],
    [0, 1, width+1, width+2],
    [1, width, width+1, width*2]
  ];

  const sTetromino = [
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1],
    [1, 2, width, width+1],
    [0, width, width+1, width*2+1]
  ];

  const theTetrominoes = [iTetromino, oTetromino, tTetromino, lTetromino, jTetromino, zTetromino, sTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  //randomly select Tetromino and its first rotation
  let random = Math.floor(Math.random()*theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  //variables for the holdShape function
  let holdRandom;
  let onHold;

  //draw the Tetromino
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    })
  };

  //undraw the Tetromino
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    })
  };

  //assign functions to keyCodes
  function control(event) {
    if (event.keyCode == 37) {
      moveLeft()
    } else if (event.keyCode == 38) {
      rotate()
    } else if (event.keyCode == 39) {
      moveRight()
    } else if (event.keyCode == 40) {
      moveDown()
    } else if (event.keyCode == 16) {
      holdShape()
    }
  }
  document.addEventListener('keydown', control);

  //move down function
  function moveDown() {
    undraw()
    currentPosition += width
    draw()
    freeze()
  }

  //freeze function
  function freeze() {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new Tetromino falling
      generateNext();
      newTetromino();
      if (onHold != undefined) {
        onHold = false;
      }

    }
  }

  //start a new Tetromino falling
  function newTetromino(shape = random) {
    current = theTetrominoes[shape][currentRotation]
    currentPosition = 4
    draw()
    displayShape(1, nextRandom)
    addScore()
    gameOver()
  }

  //generate the next Tetromino
  function generateNext() {
    random = nextRandom
    nextRandom = Math.floor(Math.random()*theTetrominoes.length)
  }

  //move Tetromino left unless there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width == 0)

    if(!isAtLeftEdge) currentPosition -= 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  //move Tetromino right unless there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width == width -1)

    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    draw()
  }

  //rotate the Tetrominoes
  function rotate() {
    undraw()
    currentRotation ++

    //if the current rotation gets to 4, make it go back to 0
    if(currentRotation == current.length) {
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
  }

  let temp;

  function holdShape() {
    if (onHold != true) {
      if(onHold === undefined) {
        holdRandom = random;
        displayShape(0, random);
        undraw();
        generateNext();
        newTetromino();
        onHold = true;
      } else {
        displayShape(0, random);
        undraw();
        [holdRandom, random] = [random, holdRandom];
        newTetromino();

        onHold = true;
      }
    }


  }

  //show up-next Tetromino in mini-grid ScoreDisplay
  //const displaySquare = document.querySelectorAll('.mini-grid div')
  //const displayWidth = 3;
  const displayIndex = 0;

  //the Tetrominoes without rotations
  const upNextTetrominoes = [
    [0, 1, 2, 3], //iTetromino
    [0, 1, 2, 3], //oTetromino
    [0, 1, 2, 4], //tTetromino
    [0, 1, 2, 3], //lTetromino
    [0, 1, 2, 5], //jTetromino
    [0, 1, 4, 5], //zTetromino
    [1, 2, 3, 4] //sTetromino
  ]

  //display the shape in the mini-grid display
  function displayShape(side, shape) {
    switch(shape) {
      case 0:
        showFourGrids(side);
        var displaySquare = document.getElementsByClassName('four-grid')[side].querySelectorAll('div');
        break;
      case 1:
        showTwoGrids(side)
        var displaySquare = document.getElementsByClassName('two-grid')[side].querySelectorAll('div');
        break;
      default:
        showThreeGrids(side);
        var displaySquare = document.getElementsByClassName('three-grid')[side].querySelectorAll('div');
    }

    //remove any trace of a tetromino from the entire grid
    displaySquare.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })

    upNextTetrominoes[shape].forEach(index => {
      displaySquare[displayIndex + index].classList.add('tetromino')
      displaySquare[displayIndex + index].style.backgroundColor = colors[shape]
    })
  }

  //add functionality to the start button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      displayShape(1, nextRandom)
    }
  })

  //add functionalit to the reset button
  resetBtn.addEventListener('click', () => {
    location.reload();
  });

  //add score
  function addScore(){
    for (let i = 0; i < 199; i += width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        lines += 1
        scoreDisplay.innerHTML = score
        linesDisplay.innerHTML = lines
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => tetrisGrid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver() {
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerId)
      document.removeEventListener('keydown', control)
    }
  }

})
