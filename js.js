//  width="800" height="600"
//     
// 
//          x
//  *------------ >
//  |
//  | Y
//  |
//  |
//  \/
// 
//  w - width
//  h - height
//  c - color
//  r - radius

let canvas;
let canvasContext;

const FPS = 60;
let bricsList = [];

class Paddle {
    constructor(){
        this.w = 100
        this.h = 10
        this.x = (800 / 2) - (this.w / 2)
        this.y = 600 - this.h - 1
    }
}
let paddle = new Paddle();

let ball = {
    x: 400,
    y: 500,
    speedY: 1,
    speedX: -1,
    r: 4,
    c: 'white',
    move: function(){
        this.x += this.speedX;
        this.y += this.speedY;
    },
    bounceY: function(){
        this.speedY *= -1;
    },
    bounceX: function() {
        this.speedX *= -1;
    },
    res: function() {
        this.x=499;
        this.y=322;
    }
}

class Brick {
    constructor(x,y,w,h,c='white'){
        this.x=x;
        this.y=y;
        this.w=w;
        this.h=h;
        this.c=c;
    }

    isBallBounce(ball){
        //top or bottom bounce
        if((ball.y == this.y || ball.y == this.y + this.h) && (ball.x > this.x && ball.x < this.x + this.w)){
            console.log("Y");
            return "Y";
        }
        // left right bounce
        else if((ball.x == this.x || ball.x == this.x + this.w) && (ball.y > this.y && ball.y < this.y + this.h)){
            console.log("X");
            return "X";
        }
        // corners
        else if (ball.speedX > 0 && ball.speedY > 0 && ball.x == this.x && ball.y == this.y ||
                 ball.speedX < 0 && ball.speedY < 0 && ball.x == this.x + this.w && ball.y == this.y + this.h ||

                 ball.speedX < 0 && ball.speedY > 0 && ball.x == this.x + this.w && ball.y == this.y ||
                 ball.speedX > 0 && ball.speedY < 0 && ball.x == this.x && ball.y == this.y + this.h ){
                     console.log("Both");
                     return "Both";
        }

        return false;
    }

}

function generateBricsV1(){
    for(let i = 0; i < 800-1; i += 10){
        for(let j = 0; j < 500; j += 5){
            bricsList.push(new Brick(i,j,9,4));
            // color random: ,"#"+Math.floor(Math.random()*16777215).toString(16)
        }
    }
    bricsList.reverse()
}

// magic ?? wtf 
window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    generateBricsV1();

    
    setInterval(function () {
        for(let i = 0; i < 1; i ++){
            moveEverything();
        }
        drawEverything();
    }, 1000 / FPS);

    canvas.addEventListener('mousemove',
        function (evt) {
            const mousePos = calculateMousePos(evt);
            paddle.x = mousePos.x - (paddle.w / 2);
        }
    );

}

// to future understud required to mause and paddle movment 
function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {x:mouseX,y:mouseY};
}

function drawEverything() {
    // black board
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // brics
    for(let i = 0; i < bricsList.length; i++){
        colorRectangle(bricsList[i].x,bricsList[i].y,bricsList[i].w,bricsList[i].h,bricsList[i].c);
    }

    // padle
    colorRectangle(paddle.x,paddle.y, paddle.w, paddle.h);

    //ball
    colorCircle(ball.x, ball.y, ball.r, ball.c);
    
    console.log(ball);
    // alert("pause");
   
}

function moveEverything() {

    //autoplay
    paddle.x = ball.x - 50;

    // baunce left and right
    if(ball.x <= 0 || ball.x > 800){
        ball.bounceX();
    }
    // top
    if (ball.y <= 0){
        ball.bounceY();
    }
    // paddle 
    if (ball.y == 600 - paddle.h -1 && ball.x > paddle.x && ball.x < paddle.x + paddle.w){
        ball.bounceY();
    }
    //bottom
    if (ball.y == 600){
        ball.res();
    }

    // brick bouncing
    for (let i = 0; i < bricsList.length; i++) {
        const ele = bricsList[i].isBallBounce(ball);
        if (ele) {
            switch (ele) {
                case "X":
                    ball.bounceX();
                    break;
                case "Y":
                    ball.bounceY();
                    break;
                case "Both":
                    ball.bounceY();
                    ball.bounceY();
                    break;
                default:
                    alert("Coś poszło nie tak !!!");
                    break;
            }
            bricsList.splice(i,1);
            break;
        }
        
        
    }


    ball.move();
    
}

function colorRectangle(x, y, w, h, c = 'white') {
    canvasContext.fillStyle = c;
    canvasContext.fillRect(x, y, w, h);
}

function colorCircle(x,y,r,c = 'white'){
    canvasContext.fillStyle = c;
    canvasContext.beginPath();
    // ox oy radius beginRad endRad direction
    canvasContext.arc(x,y,r,0,2*Math.PI, true);
    canvasContext.fill();
}