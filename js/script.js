/**
 * Frogfrogfrog
 * Pippin Barr
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 480,
        size: 20,
        speed: 12,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 4
};

let score = 0; // Initial score

let captured = false; //check if the fly have been captured

let lives = 3;

let gameState = "start";


/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);
    noCursor();

    // Give the fly its first random position
    resetFly();
    textFont("Comic Sans MS");
}

/**
* Display the start interface
*/
function displayStartScreen() {
    textAlign(CENTER, CENTER);
    textSize(24);
    fill(0);
    text("The frog has just woken up from the ice age\nand now needs to replenish its nutrition.\n\nIf it misses three flies, \nit will starve to death immediately.\nNow it needs 20 flies.\n\nMove: mouse\nEat flies: left click\n\nClick to Start", width / 2, height / 2);
}

/**
 * Runs the game logic
 */
function playGame() {
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    displayScore();
    displayLives();

    // Victory condition
    if (score >= 20) {
        gameState = "victory";
    }
}

function draw() {
    background("#3eede7");
    // Check game state
    if (gameState === "start") {
        displayStartScreen();
    }
    if (gameState === "playing") {
        playGame();
    } else if (gameState === "gameOver") {
        displayGameOver();
    } else if (gameState === "victory") {
        displayVictory();
    }
}
    
    // score systhem
function displayScore() {
    fill(0);
    textSize(28);
    textAlign(RIGHT, TOP);
    text("Score: " + score, width - 20, 20);
}

function displayLives() {
    for (let i = 0; i < 3; i++) {
        if (i < lives) {
            fill("red");
        } else {
            fill("grey");
        }
        ellipse(20 + i * 30, 30, 20, 20);
    }
}

 

/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    if (!captured) {
    // Move the fly
    fly.y += fly.speed;
    // Handle the fly going off the canvas
    if (fly.y > width) {
        lives--; //Reduced health
        resetFly();
        if (lives <= 0) {
            gameState = "gameOver";
        }
    }
  }
}

/**
 * Draws the fly more than a black circle
 */
function drawFly() {
    push();
    noStroke();
    
    // wings
    fill("#d3d3d3");
    ellipse(fly.x - 5, fly.y + 5, 15, 8);
    ellipse(fly.x + 5, fly.y + 5, 15, 8);

    //body
    fill("#000000");
    ellipse(fly.x, fly.y, fly.size);
    ellipse(fly.x, fly.y - 4, fly.size - 3);

    //head
    ellipse(fly.x, fly.y + 4, fly.size - 5);

    //eyes
    fill("#ff0000");
    ellipse(fly.x - 2, fly.y + 5, 3, 3);
    ellipse(fly.x + 2, fly.y + 5, 3, 3);

    pop();
}

/**
 * Resets the fly to the left with a random x
 */
function resetFly() {
    fly.y = 0;
    fly.x = random(0, width);
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    frog.tongue.x = frog.body.x;

    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;

        // If the fly is caught, follow the tongue
        if (captured) {
            fly.x = frog.tongue.x;
            fly.y = frog.tongue.y;
        }

        // The tongue returns to the frog's mouth
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
            if (captured) {
                captured = false;  
                resetFly();        
                score++;           
            }
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {

    // Draw the tongue only        
    if (frog.tongue.state !== "idle") {
    // Draw the tongue tip
    push();
    fill("#b35c44");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#b35c44");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();
    }

    // Draw the frog's body
    push();
    fill("#519a73");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
   

    //Draw frog's eyes
    fill("#000000");
    ellipse(frog.body.x - 30, frog.body.y - 58, 32, 32);
    ellipse(frog.body.x + 30, frog.body.y - 58, 32, 32);

    fill("#ffffff");
    ellipse(frog.body.x - 30, frog.body.y - 58, 30, 30);
    ellipse(frog.body.x + 30, frog.body.y - 58, 30, 30);

    fill("#000000");
    ellipse(frog.body.x - 30, frog.body.y - 58, 5, 5);
    ellipse(frog.body.x + 30, frog.body.y - 58, 5, 5);

    // Draw frog's nose
    fill("#96ce54");
    ellipse(frog.body.x - 5, frog.body.y - 65, 5, 5);
    ellipse(frog.body.x + 5, frog.body.y - 65, 5, 5);
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size/2 + fly.size/2);
    if (eaten && !captured) {
        captured = true;
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (gameState === "playing" && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    } else if (gameState !== "playing") {
        resetGame();
    }
}

// Display functions for game over and victory
function displayGameOver() {
    textAlign(CENTER, CENTER);
    textSize(48);
    fill("red");
    text("Game Over", width / 2, height / 2 - 20);
    textSize(24);
    fill(0);
    text("Click to Restart", width / 2, height / 2 + 40);
}

function displayVictory() {
    textAlign(CENTER, CENTER);
    textSize(48);
    fill("green");
    text("You Win!", width / 2, height / 2 - 20);
    textSize(24);
    fill(0);
    text("Click to Restart", width / 2, height / 2 + 40);
}

/**
 * Resets the game to the initial state
 */
function resetGame() {
    score = 0;
    lives = 3;
    captured = false;
    frog.tongue.state = "idle";
    frog.tongue.y = frog.body.y;
    resetFly();
    gameState = "playing";
}