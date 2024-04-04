// board
var rows = 15
var cols = 15
var board

// score
var currScoreElement
var highestScoreElement

// pop up
var popUp
var replayButton

var currScore = 0
var highestScore = 0

var boardArray = []

// snake
var snakeX = 3
var snakeY = 3

var velocityX = 0
var velocityY = 0

var snakeBody = []

// food
var foodX = 5
var foodY = 6

// game over
var gameOver = false

// sound
var openSound = true
var switchSoundButton

window.onload = () => {
    // get element
    board = document.getElementById('board')
    currScoreElement = document.querySelectorAll('#curr-score')
    highestScoreElement = document.querySelectorAll('#highest-score')
    popUp = document.getElementById('pop-up')
    replayButton = document.getElementById('replay-bt')
    switchSoundButton = document.getElementById('switch-sound')

    // create board
    createBoard()
    // add event
    addEventOfPlayer()
    setPopUp()

    setInterval(update, 100);
}

function createBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < rows; c++) {
            var square = document.createElement('div')
            square.classList.add('square')
            square.id = `${r}-${c}`

            // fill background of square
            if (r % 2 == 0 && c % 2 == 0 || r % 2 != 0 && c % 2 != 0) square.classList.add('odd')
            else square.classList.add('even')

            boardArray.push(square)
        }
    }
}

function addEventOfPlayer() {
    document.addEventListener('keydown', (e) => {

        // create new audio
        var soundMove = new Audio('./Assets/sounds/move.wav')
        if (!openSound) soundMove.volume = 0

        if (e.code == 'ArrowUp' && velocityY != 1 && velocityY != -1) {
            velocityX = 0
            velocityY = -1
            soundMove.play()
        } else if (e.code == 'ArrowDown' && velocityY != -1 && velocityY != 1) {
            velocityX = 0
            velocityY = 1
            soundMove.play()
        } else if (e.code == 'ArrowLeft' && velocityX != 1 && velocityX != -1) {
            velocityX = -1
            velocityY = 0
            soundMove.play()
        } else if (e.code == 'ArrowRight' && velocityX != -1 && velocityX != 1) {
            velocityX = 1
            velocityY = 0
            soundMove.play()
        }
    })

    switchSoundButton.addEventListener('click', () => {
        if (switchSoundButton.classList.contains('open')) {
            switchSoundButton.classList.add('close')
            switchSoundButton.classList.remove('open')
            openSound = false
        }
        else {
            switchSoundButton.classList.add('open')
            switchSoundButton.classList.remove('close')
            openSound = true
        }
    })
}

function update() {
    if (gameOver) return

    if (snakeX == foodX && snakeY == foodY) {
        // update score
        currScore += 1
        currScoreElement[0].innerText = currScore

        snakeBody.push([foodX, foodY])
        randomFood()
    }
    
    for (let i = snakeBody.length-1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1]
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY]
    }

    snakeX += velocityY
    snakeY += velocityX

    // write object on the board
    for (let i = 0; i < boardArray.length; i++) {
        boardArray[i].classList.remove('snake', 'apple');
        // create snake
        if (boardArray[i].id.split('-')[0] == snakeX && boardArray[i].id.split('-')[1] == snakeY) boardArray[i].classList.add('snake')
        // create apple
        if (boardArray[i].id.split('-')[0] == foodX && boardArray[i].id.split('-')[1] == foodY) boardArray[i].classList.add('apple')

        for (let ibody = 0; ibody < snakeBody.length; ibody++) {
            var bodyX = snakeBody[ibody][0] 
            var bodyY = snakeBody[ibody][1]
            var currSquareX = parseInt(boardArray[i].id.split('-')[0])
            var currSquareY = parseInt(boardArray[i].id.split('-')[1])

            if (bodyX == currSquareX && bodyY == currSquareY) boardArray[i].classList.add('snake')

            if (bodyX == snakeX && bodyY == snakeY) {
                setGameOver()
                return
            }
        }

        board.append(boardArray[i])
    }

    if (snakeX < 0 || snakeX > rows || snakeY < 0 || snakeY > cols) {
        setGameOver()
        return
    }
}

function randomFood() {
    foodX = Math.floor(Math.random() * rows)
    foodY = Math.floor(Math.random() * cols)
}

function setGameOver() {
    gameOver = true
    popUp.classList.add('show')
    currScoreElement[1].innerText = currScore

    if (currScore > highestScore) highestScore = currScore
    highestScoreElement.forEach(element => {
        element.innerText = highestScore
    });

    // get sound effect
    var soundGameOver = new Audio('./Assets/sounds/gameOver.wav')
    if (!openSound) soundGameOver.volume = 0
    soundGameOver.play()
}

function setPopUp () {
    replayButton.addEventListener('click', () => {
        gameOver = false

        currScore = 0
        currScoreElement[0].innerText = currScore
        popUp.classList.remove('show')

        snakeX = 3
        snakeY = 3

        snakeBody = []

        foodX = 5
        foodY = 6

        velocityX = 0
        velocityY = 0
    })
}