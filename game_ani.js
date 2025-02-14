//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//characters
let char1Width = 100;
let char1Height = 100;
let char2Width = 100;
let char2Height = 100;
let charX = 150;
let charY = boardHeight - char1Height;

// Animation frames
let char1RunFrames = [];
let char2RunFrames = [];
let currentFrame = 0;
let frameCount = 7;
let frameInterval = 7;
let frameTimer = 10;
let char1Img = null;
let char2Img = null;
let imagesLoaded = 0;
let totalImages = frameCount * 2 + 1;

// Sound effects
let jumpSound;
let collectSound;

let char1 = {
    x: charX,
    y: charY,
    width: char1Width,
    height: char1Height,
    velocityY: 0,
    isJumping: false
}

let char2 = {
    x: charX - 100,
    y: charY,
    width: char2Width,
    height: char2Height,
    velocityY: 0,
    isJumping: false
}

//hearts
let heartArray = [];
let heartWidth = 34;
let heartHeight = 34;
let heartX = 700;
let heartY = boardHeight - heartHeight;
let heartImg;

//physics
let velocityX = -12;
let gravity = .4;
let jumpStrength = -10;

let gameOver = false;
let score = 0;

function loadSounds() {
    jumpSound = new Audio('./sound/jump.mp3');
    collectSound = new Audio('./sound/collect.mp3');
    
    jumpSound.volume = 0.3;
    collectSound.volume = 0.3;
}

function loadImages() {
    // Load character 1 running frames
    for(let i = 0; i < frameCount; i++) {
        let img = new Image();
        img.onload = function() {
            imagesLoaded++;
            checkAllImagesLoaded();
        };
        img.src = `./img/wom${i}.png`;
        char1RunFrames.push(img);
    }

    // Load character 2 running frames
    for(let i = 0; i < frameCount; i++) {
        let img = new Image();
        img.onload = function() {
            imagesLoaded++;
            checkAllImagesLoaded();
        };
        img.src = `./img/tig${i}.png`;
        char2RunFrames.push(img);
    }

    // Load static heart image
    heartImg = new Image();
    heartImg.onload = function() {
        imagesLoaded++;
        checkAllImagesLoaded();
    };
    heartImg.src = "./img/heart.png";
}

function checkAllImagesLoaded() {
    if (imagesLoaded === totalImages) {
        requestAnimationFrame(update);
        setInterval(placeHeart, 1000);
    }
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    
    context.imageSmoothingEnabled = true;
    // context.imageSmoothingQuality = 'high';

    loadSounds();
    loadImages();
    document.addEventListener("keydown", moveCharacters);
}

function update() {
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    updateAnimation();
    updateChar1();
    updateChar2();
    
    context.drawImage(char1RunFrames[currentFrame], char1.x, char1.y, char1.width, char1.height);
    context.drawImage(char2RunFrames[currentFrame], char2.x, char2.y, char2.width, char2.height);

    updateHearts();
    drawScore();

    requestAnimationFrame(update);
}

function updateAnimation() {
    frameTimer++;
    if (frameTimer >= frameInterval) {
        frameTimer = 0;
        currentFrame = (currentFrame + 1) % frameCount;
    }
}

function updateChar1() {
    char1.velocityY += gravity;
    char1.y = Math.min(char1.y + char1.velocityY, charY);
    
    if (char1.y === charY) {
        char1.isJumping = false;
    }
}

function updateChar2() {
    if (char1.isJumping && !char2.isJumping && char1.velocityY > -5) {
        char2.velocityY = jumpStrength;
        char2.isJumping = true;
        // jumpSound.currentTime = 0;
        // jumpSound.play();
    }
    
    char2.velocityY += gravity;
    char2.y = Math.min(char2.y + char2.velocityY, charY);
    
    if (char2.y === charY) {
        char2.isJumping = false;
    }
}

function updateHearts() {
    for (let i = 0; i < heartArray.length; i++) {
        let heart = heartArray[i];
        heart.x += velocityX;
        context.drawImage(heartImg, heart.x, heart.y, heart.width, heart.height);

        if (detectCollision(char1, heart) || detectCollision(char2, heart)) {
            heartArray.splice(i, 1);
            score += 1;
            i--;
            collectSound.currentTime = 0;
            collectSound.play();
        }
    }
}

function drawScore() {
    context.fillStyle = "black";
    context.font = "20px courier";
    context.fillText("Hearts: " + score, 5, 20);
}

function moveCharacters(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && char1.y == charY) {
        char1.velocityY = jumpStrength;
        char1.isJumping = true;
        jumpSound.currentTime = 0;
        jumpSound.play();
    }
}

function placeHeart() {
    if (gameOver) {
        return;
    }

    let heart = {
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
