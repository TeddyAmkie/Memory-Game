document.getElementById("game").style.display = "none";

document.getElementById("start").addEventListener("click",function (){
    document.getElementById("menu").style.display = "none";
    document.getElementById("game").style.display = "grid";
    startGame();
});

let gameBoard = {};
let score;
let currentCards = [];

function startGame() {
    let game = document.getElementById("game");
    // let cardValue = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    let cardValue = [0,1,2,3,4,5,6,7,8,9,10,11,0,1,2,3,4,5,6,7,8,9,10,11];
    game.innerHTML = "";
    for (let i = 0; i < 25; i++) {
        if (i === 12) {
            score = document.createElement("div");
            score.id = "score";
            score.textContent = "0";
            game.appendChild(score);
            continue;
        }
         let card = document.createElement("div");
         card.className = "card";
         card.dataset.index = i; 
         card.addEventListener("click",cardClick);
         game.appendChild(card);
         let cardFace = cardValue.splice(Math.floor(Math.random()*cardValue.length),1)[0];
         gameBoard[i] = {card, cardFace, matched: false};
    }
};
function delay(ms=1000) {
    return new Promise(function (resolve){
        setTimeout(resolve, ms)
    });
}

async function cardClick(event) {
    const clickedCard = parseInt(event.target.dataset.index);
    // Prevents 3rd card to be selected
    if (currentCards.length >= 2) {
       return;
    }
    currentCards.push(gameBoard[clickedCard]);
    gameBoard[clickedCard].card.removeEventListener("click", cardClick);
    gameBoard[clickedCard].card.classList.toggle("flip");
    score.textContent = parseInt(score.textContent) + 1;
    gameBoard[clickedCard].card.textContent = gameBoard[clickedCard].cardFace;
    // if this is first card, lets you click again
    if (currentCards.length !== 2) {
        return;
    }
    // if the card faces are equal, they will remain up
    if (currentCards[0].cardFace === currentCards[1].cardFace) {
        currentCards[0].matched = true;
        currentCards[1].matched = true;
        currentCards = [];
        // Check if game completed
        if (Object.values(gameBoard).every(function (value) {
            return value.matched;
        })) {
            await delay(10);
            alert ("You win! You're amazing!");
            if ((parseInt(score.textContent) < parseInt(document.getElementById("highscore").textContent))|| localStorage.getItem("highscore") === null) {
                localStorage.setItem("highscore", score.textContent)
                document.getElementById("highscore").textContent = score.textContent;
            }
            console.log("why are you here");
            document.getElementById("menu").style.display = "block";
            document.getElementById("game").style.display = "none"; 
        }
        return;
    }
    await delay();
     if (currentCards[0].cardFace !== currentCards[1].cardFace) {
        currentCards[0].card.addEventListener("click", cardClick);
        currentCards[0].card.classList.toggle("flip");
        currentCards[0].card.textContent = "";
        currentCards[1].card.addEventListener("click", cardClick);
        currentCards[1].card.classList.toggle("flip");
        currentCards[1].card.textContent = "";
        currentCards = [];
        return;
    }

};

let currentHigh = localStorage.getItem("highscore");
if (currentHigh) {
    document.getElementById("highscore").textContent = currentHigh;
}
