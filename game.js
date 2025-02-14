//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//characters
let char1Width = 88;
let char1Height = 94;
let char2Width = 88;
let char2Height = 94;
let charX = 50;
let charY = boardHeight - char1Height;
let char1Img;
let char2Img;

let char1 = {
    x: charX,
    y: charY,
    width: char1Width,
    height: char1Height,
    velocityY: 0
}

let char2 = {
    x: charX + 100,
    y: charY,
    width: char2Width,
    height: char2Height,
    velocityY: 0,
    jumpDelay: 15, // frames to wait before jumping
    shouldJump: false,
    delayCount: 0
}

//hearts
let heartArray = [];
let heartWidth = 34;
let heartHeight = 34;
let heartX = 700;
let heartY = boardHeight - heartHeight;
let heartImg;

//physics
let velocityX = -8;
let gravity = .4;
let jumpStrength = -10;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    char1Img = new Image();
    char1Img.src = "./img/wombat.png";
    char1Img.onload = function() {
        context.drawImage(char1Img, char1.x, char1.y, char1.width, char1.height);
    }

    char2Img = new Image();
    char2Img.src = "./img/tiger.png";
    char2Img.onload = function() {
        context.drawImage(char2Img, char2.x, char2.y, char2.width, char2.height);
    }

    heartImg = new Image();
    heartImg.src = "./img/heart.png";

    requestAnimationFrame(update);
    setInterval(placeHeart, 1000);
    document.addEventListener("keydown", moveCharacters);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //update char1
    char1.velocityY += gravity;
    char1.y = Math.min(char1.y + char1.velocityY, charY);

    //update char2
    if (char2.shouldJump) {
        char2.delayCount++;
        if (char2.delayCount >= char2.jumpDelay) {
            char2.velocityY = jumpStrength;
            char2.shouldJump = false;
            char2.delayCount = 0;
        }
    }
    char2.velocityY += gravity;
    char2.y = Math.min(char2.y + char2.velocityY, charY);
    
    context.drawImage(char1Img, char1.x, char1.y, char1.width, char1.height);
    context.drawImage(char2Img, char2.x, char2.y, char2.width, char2.height);

    //hearts
    for (let i = 0; i < heartArray.length; i++) {
        let heart = heartArray[i];
        heart.x += velocityX;
        context.drawImage(heartImg, heart.x, heart.y, heart.width, heart.height);

        if (detectCollision(char1, heart) || detectCollision(char2, heart)) {
            heartArray.splice(i, 1);
            score += 10;
            i--;
        }
    }

    //score
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText("Hearts: " + score, 5, 20);
}

function moveCharacters(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && char1.y == charY) {
        // First character jumps immediately
        char1.velocityY = jumpStrength;
        // Second character will jump after delay
        char2.shouldJump = true;
    }
}

function placeHeart() {
    if (gameOver) {
        return;
    }

    let heart = {
        img: heartImg,
        x: heartX,
        y: Math.random() * (boardHeight - heartHeight),
        width: heartWidth,
        height: heartHeight
    }

    if (Math.random() > 0.5) {
        heartArray.push(heart);
    }

    if (heartArray.length > 5) {
        heartArray.shift();
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
