const canvas = document.getElementById("tetrisCanvas")
const ctx = canvas.getContext("2d")

const ROWS = 20
const COLS = 10
const BLOCK_SIZE = 30
canvas.width = COLS * BLOCK_SIZE
canvas.height = ROWS * BLOCK_SIZE   

const TETROMINOS = [
    {color:'cyan', shape: [[1,1,1,1]]},
    {color:'blue', shape: [[1,1],[1,1]]},
    {color:'orange', shape: [[1,1,1], [1,0,0]] },
    {color:'yellow', shape: [[1,1,1], [0,0,1]] },
    {color:'green', shape: [[1,1,0], [0,1,1]] },
    {color:'red', shape: [[0,1,1], [1,1,0]] },
    {color:'purple', shape: [[0,1,0], [1,1,1]] }
]

let board = Array.from({length:ROWS}, () =>Array(COLS).fill(null));
let currentTetromino = getRandomTetromino();// current tetromino being cotrolled by player
let currentPos = {x: 3,y: 0 };//initial tetromino position on the board
let score = 0;
let interval = 400;
let gameOver = false;
let speedIncreaseInterval = 10000;
let lastSpeedIncrease = Date.now();
// getting random tetromino
function getRandomTetromino(){
    return TETROMINOS[Math.floor(Math.random()* TETROMINOS.length)]
}
// drawing blocks for tetromino at specified x and y position and color
function drawBlock(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    ctx.strokeStyle = "white";
    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);   
}
// clears and redraws entire board
function drawBoard(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let y = 0; y< ROWS; y++){
        for (let x = 0; x < COLS; x++){
            if(board[y][x]){
                drawBlock(x,y,board[y][x]);
            }
        }
    }
}
// drawing the tetromino at its current position
function drawTetromino(){
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;
    for(let y = 0; y < shape.length;y++){
        for(let x = 0; x< shape[y].length;x++){
            if(shape[y][x]){
                drawBlock(currentPos.x + x, currentPos.y + y, color);
            }
        }
    }
}
// checking collision of tetrominos with walls, other blocks or board
function hasCollision(xOffset, yOffset){
    const shape = currentTetromino.shape;
    for (let y = 0; y < shape.length; y++){
        for (let x = 0; x < shape[y].length;x++){
            if(shape[y][x] &&(currentPos.x + x + xOffset < 0 || 
                currentPos.x + x + xOffset >= COLS ||
                currentPos.y + y + yOffset >=ROWS||
                board[currentPos.y + y + yOffset][currentPos.x + x + xOffset])){
                    return true
                }
        }
    }
    return false;
}
// merging tetrominos onto the board
function mergeTetromino(){
    const shape = currentTetromino.shape;
    const color = currentTetromino.color;
    for (let y = 0; y < shape.length;y++){
        for (let x = 0; x < shape[y].length;x++){
            if(shape[y][x]){
                board[currentPos.y+y][currentPos.x + x] = color;
            }
        }
    }
}
// updates score and removes a completed row
function removeRows(){
    let linesRemoved = 0;
    for(let y = ROWS-1; y >= 0; y--){
        if(board[y].every(cell =>cell)){
            board.splice(y,1);
            board.unshift(Array(COLS).fill(null));
            linesRemoved++;
            y++;
        }
    }
    score += linesRemoved * linesRemoved * 100;
    document.getElementById('score').textContent=`Score: ${score}`;
}
// rotate the current tetromino
function rotateTetromino(){
    const shape = currentTetromino.shape;
    const newShape = shape[0].map((_,i) => shape.map(row => row[i]).reverse());
    currentTetromino.shape = newShape;
    if(hasCollision(0,0)){
        currentTetromino.shape = shape;
    }
}
// move current tetromino down
function moveDown(){
    if(!hasCollision(0,1)){
        currentPos.y++;
    } else{
        mergeTetromino();
        removeRows();
        currentTetromino = getRandomTetromino();
        currentPos = {x: 3, y: 0};
        if(hasCollision(0,0)){
            gameOver=true;
            document.getElementById('restartButton').style.display='block';
        }
    }
}
// if collision creates new tetromino
function move(offsetX){
    if(!hasCollision(offsetX,0)){
        currentPos.x += offsetX;
    }
}
// increase game speed over time
function increaseSpeed(){
    const now = Date.now();
    if(now - lastSpeedIncrease >= speedIncreaseInterval){
        lastSpeedIncrease = now;
        interval = Math.max(500, interval-20)
    }
}
// game loop that updates game
function gameLoop(){
    if(gameOver) return;

    drawBoard();
    drawTetromino();
    moveDown();
    increaseSpeed();
    setTimeout(gameLoop, interval)
}
// keyboard events to control terminal
document.addEventListener("keydown", (event)=>{
    if(gameOver) return;

    switch (event.key){
        case 'ArrowUp':
            rotateTetromino();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        case 'ArrowLeft':
            move(-1);
            break;
        case 'ArrowRight':
            move(1);
            break;
    }
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }
});
// restart game when restart button clicked
document.getElementById('restartButton').addEventListener('click',()=>{
    board = Array.from({length:ROWS}, ()=>Array(COLS).fill(null));
    currentTetromino = getRandomTetromino();
    currentPos = {x: 3, y: 0};
    score = 0;
    interval = 1000;
    gameOver = false;

    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('score').textContent = `Score: ${score}`;
    lastSpeedIncrease = Date.now();
    gameLoop();
});
document.getElementById("Start").addEventListener('click',()=>{
    gameLoop();
})
