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

  //function makeFourGrid() {
    for (x=0; x<4; x++) {
          var grid = document.createElement('div');
          //grid.className = "game-grid";
          document.getElementsByClassName('four-grid')[1].appendChild(grid);
    };
  //}

  //function makeThreeGrid() {
    for (x=0; x<6; x++) {
          var grid = document.createElement('div');
          //grid.className = "game-grid";
          document.getElementsByClassName('three-grid')[1].appendChild(grid);
    };
  //}

  //make two grid
    for (x=0; x<4; x++) {
      var grid = document.createElement('div');
      //grid.className = 'game-grid';
      document.getElementsByClassName('two-grid')[1].appendChild(grid);
    }

  function showFourGrids() {
    document.getElementsByClassName("two-grid")[1].style.display = "none";
    document.getElementsByClassName("three-grid")[1].style.display = "none";
    document.getElementsByClassName("four-grid")[1].style.display = "grid";
  }

  function showThreeGrids() {
    document.getElementsByClassName("two-grid")[1].style.display = "none";
    document.getElementsByClassName("four-grid")[1].style.display = "none";
    document.getElementsByClassName("three-grid")[1].style.display = "grid";
  }

  function showTwoGrids() {
    document.getElementsByClassName("four-grid")[1].style.display = "none";
    document.getElementsByClassName("three-grid")[1].style.display = "none";
    document.getElementsByClassName("two-grid")[1].style.display = "grid";
  }


  const tetrisGrid = document.querySelector('#grid');
  let squares = Array.from(document.querySelectorAll('#grid div'));
  const scoreDisplay = document.querySelector('#score');
  const startBtn = document.querySelector('#start-button');
  const resetBtn = document.querySelector('#reset-button');
  const width = 10;
  let nextRandom = 0;
  let timerId;
  let score = 0;
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
      random = nextRandom
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
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
  function displayShape() {
    /*if (nextRandom == 0) {
      showFourGrids();
      var displaySquare = document.getElementsByClassName('four-grid')[1].querySelectorAll('div');
    } else {
      showThreeGrids();
      var displaySquare = document.getElementsByClassName('three-grid')[1].querySelectorAll('div');
    }*/
    switch(nextRandom) {
      case 0:
        showFourGrids();
        var displaySquare = document.getElementsByClassName('four-grid')[1].querySelectorAll('div');
        break;
      case 1:
        showTwoGrids()
        var displaySquare = document.getElementsByClassName('two-grid')[1].querySelectorAll('div');
        break;
      default:
        showThreeGrids();
        var displaySquare = document.getElementsByClassName('three-grid')[1].querySelectorAll('div');
    }

    //remove any trace of a tetromino from the entire grid
    displaySquare.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })

    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquare[displayIndex + index].classList.add('tetromino')
      displaySquare[displayIndex + index].style.backgroundColor = colors[nextRandom]
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
      displayShape()
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
        scoreDisplay.innerHTML = score
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
