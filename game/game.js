console.log("arkanoid")

var canvas, canvasContext;
var ballX = 75;
var ballY = 75;
var ballSpeedX = 5;
var ballSpeedY = 7;
const PADDLE_WIDTH = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE_FROM_EDGE = 60;

var paddleX = 400;

//DOM function will be called right after loading html file
window.onload = function () {
    var framePerSecond = 30;
    canvas = document.getElementById('gameCanvas');

    canvasContext = canvas.getContext('2d');
    //refreshing 30 times per second
    setInterval(updateAll, 1000 / framePerSecond);
    canvas.addEventListener('mousemove', updateMousePosition);
}

function updateMousePosition(event) {
    //gives actual position on the page
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;

    var mouseX = event.clientX - rect.left - root.scrollLeft;
    //  var mouseY = event.clientY - rect.top - root.scrollTop;

    var mouseX = event.clientX;

    //paddle will follow mouse cursor which has to be in the middle of paddle
    paddleX = mouseX - PADDLE_WIDTH / 2;
}

function ballReset() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}


//    function which update the status (refreshing)
function updateAll() {
    moveAll();
    drawAll();
}

function moveAll() {
    //canvas = frame
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) { //left
        ballSpeedX = -ballSpeedX;
    }
    if (ballX > canvas.width) {  //right
        ballSpeedX = -ballSpeedX;
    }

    if (ballY < 0) {  //top
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) { //leading the bottom
        ballReset();
    }

    var paddleTopEdgeY = canvas.height - PADDLE_DISTANCE_FROM_EDGE;
    var paddleBottomEdgeY = paddleTopEdgeY + PADDLE_THICKNESS;

    var paddleLeftEdgeX = paddleX;
    var paddleRightEdgeX = paddleLeftEdgeX + PADDLE_WIDTH;

    if (ballY > paddleTopEdgeY &&  //ball below the top of paddle
        ballY < paddleBottomEdgeY && //above bottom of paddle
        ballX > paddleLeftEdgeX && //right of the left side of paddle
        ballX < paddleRightEdgeX){ //left of the right side of paddle
        ballSpeedY *= -1;


        //speed will be bigger after hitting on the right or left side of paddle
        var centerOfPaddleX = paddleX + PADDLE_WIDTH/2;
        var ballDistanceFromPaddleCenterX  =ballX - centerOfPaddleX;
        ballSpeedX = ballDistanceFromPaddleCenterX * 0.35;

        console.log(ballX);
    }

}

function drawAll() {

    colorRectangle(0, 0, canvas.width, canvas.height, 'black'); //clear screen
    colorCircle(ballX, ballY, 10, 0, 'red');   //draw ball
    colorRectangle(paddleX, canvas.height - PADDLE_DISTANCE_FROM_EDGE, PADDLE_WIDTH, PADDLE_THICKNESS, 'yellow'); //paddle
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