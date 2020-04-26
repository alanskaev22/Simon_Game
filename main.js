// ----- Fields -----

let availableColors = ["green", "red", "yellow", "blue"];
let gameGeneratedColors = [];
let userClickedColors = [];
let isOn = false;
let level = 0;
let randomColor;


// ----- Handlers -----
// Flash title on mouse click while game is not started
$("html").on("click", function () {
    if (isOn === false) {
        flashTitle();
        flashTitle();
        flashTitle();
    }
});

// Start the game
$("body").on("keypress", function () {

    if (!isOn) {
        // Generate Game Pattern Colors
        randomColor = availableColors[randomNum()];
        gameGeneratedColors.push(randomColor);
        setTimeout(function () {
            animateColorBlock(randomColor);
        }, 1500);
        changeLevelTitle();
        isOn = true;
    }
});

// Handle and Record Color Click
$(".btn").on("click", function (event) {
    if (isOn) {
        let userClickedColor = event.target.id;
        userClickedColors.push(userClickedColor);
        playSound(userClickedColor);
        animateColorBlock(userClickedColor);

        // Validate if user clicked colors in correct sequence
        let answerBool = checkAnswer(userClickedColors, gameGeneratedColors);
        let equalSizeBool = userClickedColors.length == gameGeneratedColors.length;

        if (answerBool && equalSizeBool) {
            setTimeout(function () {
                addRandomColorToList();
                setTimeout(function () {
                    animateColorBlock(randomColor);
                }, 1500);
            }, 500);

            // Reset user clicked colors list
            userClickedColors.length = 0;

            //Update Level
            changeLevelTitle();
            level = gameGeneratedColors.length;
        } else if (!answerBool && equalSizeBool) {
            gameOver();
            level = 0;
        }
    }

});


// ----- Functions -----
function randomNum() {  // Between 0-3;
    return Math.floor(Math.random() * 4);

};

function addRandomColorToList() {
    randomColor = availableColors[randomNum()];
    gameGeneratedColors.push(randomColor);
}

function playSound(color) {
    let audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
};

function animateColorBlock(userClickedColor) {
    $(`#${userClickedColor}`).addClass("pressed");
    setTimeout(function () {
        $(`#${userClickedColor}`).removeClass("pressed");
    }, 200);

};

function flashTitle() {
    $("h1").fadeOut(80).fadeIn(80);

};

function checkAnswer(userColors, gameColors) {
    let areEqual;

    for (let i = 0; i < gameColors.length; i++) {

        if (userColors[i] === gameColors[i]) {
            areEqual = true;
        } else {
            areEqual = false;
            break;
        }
    }
    return areEqual;
};

function changeLevelTitle() {
    setTimeout(function () {
        $("h1").text(`Level ${level}`)
    }, 1000);
};


function gameOver() {
    $("h1").multiline("GAME OVER :( \n Press any key to restart");
    gameGeneratedColors.length = 0;
    userClickedColors.length = 0;
    isOn = false;
    $("body").addClass("game-over").fadeOut(80).fadeIn(80);
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 500);
    new Audio("sounds/wrong.mp3").play();
};


$.fn.multiline = function (text) {
    this.text(text);
    this.html(this.html().replace(/\n/g, '<br/>'));
    return this;
}