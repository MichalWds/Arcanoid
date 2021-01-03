console.log("arkanoid")

var canvas, canvasContext;
var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;

const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE_FROM_EDGE = 60;

const BRICK_W = 80;
const BRICK_H = 20;
const BRICK_COL = 10;
const BRICK_ROWS = 14;
const BRICK_GAP = 2;

var bricksLeft = 0;
var brickGrid = new Array(BRICK_COL * BRICK_ROWS);

var mouseX = 0;
var mouseY = 0;

var paddleX = 400;

//DOM function will be called right after loading html file
window.onload = function () {
    var framePerSecond = 30;
    canvas = document.getElementById('gameCanvas');

    canvasContext = canvas.getContext('2d');
    //refreshing 30 times per second
    setInterval(updateAll, 1000 / framePerSecond);
    canvas.addEventListener('mousemove', updateMousePosition);
    brickReset();
    ballReset();
}

function updateMousePosition(event) {
    //gives actual position on the page
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    mouseX = event.clientX - rect.left - root.scrollLeft;
    mouseY = event.clientY - rect.top - root.scrollTop;

    //paddle will follow mouse cursor which has to be in the middle of paddle
    paddleX = mouseX - PADDLE_WIDTH / 2;

    //cheat to test
    /** ballX = mouseX;
     ballY = mouseY;
     ballSpeedX = 4;
     ballSpeedY = -4;
     **/
}

function brickReset() {
    bricksLeft = 0;
    var i;
    for (i = 0; i < 3 * BRICK_COL; i++) {
        brickGrid[i] = false;
    }
//skipping new declaration
    for (; i < BRICK_COL * BRICK_ROWS; i++) {
        brickGrid[i] = true;
        bricksLeft++;
    } // end of for each brick

    //bricksLeft = BRICK_COL * BRICK_ROWS;
} //end of brickReset function
function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

//function which update the status (refreshing)
function updateAll() {
    moveAll();
    drawAll();
}

function ballMove() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0 && ballSpeedX < 0.0) { //left
        ballSpeedX *= -1;
    }
    if (ballX > canvas.width && ballSpeedX > 0.0) { // right
        ballSpeedX *= -1;
    }
    if (ballY < 0 && ballSpeedX < 0.0) { // top
        ballSpeedY *= -1;
    }
    if (ballY > canvas.height) { // bottom
        ballReset();
        brickReset();
    }
}

function isBrickAtColRow(col, row) {

    if (col >= 0 && col < BRICK_COL &&
        row >= 0 && row < BRICK_ROWS) {
        var brickIndexUnderCoord = rowColToArrayIndex(col, row);
        return brickGrid[brickIndexUnderCoord];
    } else {
        return false;
    }
}

function ballBrickHandling() {
    var ballBrickCol = Math.floor(ballX / BRICK_W); //math floor count bricks row/col
    var ballBrickRow = Math.floor(ballY / BRICK_H);
    var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

    //check if it is not negative, to avoid bugs like disappearing brick from another side of frame
    if (isBrickAtColRow(ballBrickCol, ballBrickRow) >= 0 && ballBrickCol < BRICK_COL &&
        ballBrickRow >= 0 && ballBrickRow < BRICK_ROWS) {

        if (brickGrid[brickIndexUnderBall]) {
            brickGrid[brickIndexUnderBall] = false;
            bricksLeft--;
            //     console.log(bricksLeft);
            var prevBallX = ballX - ballSpeedX;
            var prevBallY = ballY - ballSpeedY;
            var prevBrickCol = Math.floor(prevBallX / BRICK_W);
            var prevBrickRow = Math.floor(prevBallY / BRICK_H);

            var bothTestsFailed = true;

            if (prevBrickCol != ballBrickCol) {

                if (isBrickAtColRow(prevBrickCol, ballBrickRow) == false) {
                    ballSpeedX *= -1;
                    bothTestsFailed = false;
                }
            }
            if (prevBrickRow != ballBrickRow) {
                if (isBrickAtColRow(ballBrickCol, prevBrickRow) == false) {
                    ballSpeedY *= -1;
                    bothTestsFailed = false;
                }
            }
            if (bothTestsFailed) {  //armpit case, prevents ball from going through
                ballSpeedX *= -1;
                ballSpeedY *= -1;
            }
        } //end of brick found
    }  //end valid col and row
}

function ballPaddleHandling() {
    var paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;

    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

    if (ballY > paddleTopEdgeY &&  //ball below the top of paddle
        ballY < paddleBottomEdgeY && //above bottom of paddle
        ballX > paddleLeftEdgeX && //right of the left side of paddle
        ballX < paddleRightEdgeX) { //left of the right side of paddle
        ballSpeedY *= -1;

        //speed will be bigger after hitting on the right or left side of paddle
        var centerOfPaddleX = paddleX + PADDLE_WIDTH / 2;
        var ballDistanceFromPaddleCenterX = ballX - centerOfPaddleX;
        ballSpeedX = ballDistanceFromPaddleCenterX * 0.35;
    }
    if (bricksLeft == 0) {
        brickReset();
    } //out of bricks
} //ball center inside paddle

function moveAll() {
    ballMove();
    ballBrickHandling();
    ballPaddleHandling();

    console.log(ballX);
}

function rowColToArrayIndex(col, row) {
    return col + BRICK_COL * row;
}

function drawBricks() {

    for (var eachRow = 0; eachRow < BRICK_ROWS; eachRow++) {
        for (var eachCol = 0; eachCol < BRICK_COL; eachCol++) {

            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);

            if (brickGrid[arrayIndex]) {
                colorRectangle(BRICK_W * eachCol, BRICK_H * eachRow, BRICK_W - BRICK_GAP, BRICK_H - BRICK_GAP, 'blue');
            } //end of is this brick here
        }
    } //end of for each brick
} //end of drawBrick function

function drawAll() {

    colorRectangle(0, 0, canvas.width, canvas.height, 'black'); //clear screen
    colorCircle(ballX, ballY, 10, 0, 'red');   //draw ball
    colorRectangle(paddleX, canvas.height - PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'yellow'); //paddle
    drawBricks();
}

function colorRectangle(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight,);
}

function colorCircle(centerX, centerY, radius, fillColor) {
    canvasContext.fillStyle = 'red';
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, fillColor, Math.PI * 2, true);
    canvasContext.fill();
}

function colorText(showWords, textX, textY, fillColor) {
    canvasContext.fillStyle = fillColor;
    canvasContext.fillText(showWords, textX, textY);
}