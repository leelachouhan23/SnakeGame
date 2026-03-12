const board = document.getElementById("board");
const scoreElem = document.getElementById("score");
const toggleBtn = document.getElementById("toggleBtn");
const resetBtn = document.getElementById("resetBtn");

const foodSound = new Audio("food2.wav");
const gameOverSound = new Audio("End.wav");
const moveSound = new Audio("bg.wav");
const musicSound = new Audio("food.wav");

let speed = 5;
let score = 0;
let lastPaintTime = 0;
let gameRunning = false;

let snackArr = [{ x:13, y:15 }];
let food = { x:6, y:7 };
let inputDir = { x:0, y:0 };

// Main game loop
function main(ctime){
    if(!gameRunning) return;

    window.requestAnimationFrame(main);

    if((ctime - lastPaintTime)/1000 < 1/speed) return;
    lastPaintTime = ctime;

    gameEngine();
}

// Collision detection
function isCollide(snake){
    for(let i = 1; i < snake.length; i++){
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

// Game Engine
function gameEngine(){
    // Collision
    if(isCollide(snackArr)){
        inputDir = {x:0, y:0};
        gameRunning = false;
        toggleBtn.innerText = "Start";
        musicSound.pause();
        musicSound.currentTime = 0;

        // Play game over sound
        gameOverSound.play();

        // Show Game Over message on board instead of alert
        board.innerHTML = `<div class="game-over">!GAME OVER🐍</div>`;
        return;
    }

    // Eat food
    if(snackArr[0].x === food.x && snackArr[0].y === food.y){
        foodSound.play();
        snackArr.unshift({ x: snackArr[0].x + inputDir.x, y: snackArr[0].y + inputDir.y });
        score += 1;
        scoreElem.innerText = score;
        speed += 0.2;
        let a = 2, b = 16;
        food = { x: Math.round(a + (b-a) * Math.random()), y: Math.round(a + (b-a) * Math.random()) };
    }

    // Move snake
    for(let i = snackArr.length-2; i >= 0; i--){
        snackArr[i+1] = {...snackArr[i]};
    }
    snackArr[0].x += inputDir.x;
    snackArr[0].y += inputDir.y;

    // Render snake & food
    board.innerHTML = "";
    snackArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Keyboard input
window.addEventListener('keydown', e =>{
    moveSound.play();
    musicSound.play();

    switch(e.key){
        case "ArrowUp":    if(inputDir.y !==1) inputDir = {x:0, y:-1}; break;
        case "ArrowDown":  if(inputDir.y !==-1) inputDir = {x:0, y:1}; break;
        case "ArrowLeft":  if(inputDir.x !==1) inputDir = {x:-1, y:0}; break;
        case "ArrowRight": if(inputDir.x !==-1) inputDir = {x:1, y:0}; break;
    }
});

// Toggle Start / Stop button
toggleBtn.addEventListener("click", ()=>{
    if(!gameRunning){
        gameRunning = true;
        toggleBtn.innerText = "Stop";
        lastPaintTime = 0;
        musicSound.play();
        window.requestAnimationFrame(main);
    } else {
        gameRunning = false;
        toggleBtn.innerText = "Start";
        musicSound.pause();
    }
});

// Reset button
resetBtn.addEventListener("click", ()=>{
    gameRunning = false;
    toggleBtn.innerText = "Start";
    inputDir = {x:0, y:0};
    snackArr = [{ x:13, y:15 }];
    food = { x:6, y:7 };
    score = 0;
    speed = 5;
    scoreElem.innerText = score;
    board.innerHTML = "";
    musicSound.pause();
    musicSound.currentTime = 0;
});