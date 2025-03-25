const gameModal = document.querySelector('.game-modal');
const donBtn = document.querySelector('.don');
const OpenTut = document.getElementById('tut');
const tutEl = document.querySelector('.tutorial');
const closeTut = document.getElementById('exitTut');
const nameEl = document.querySelector('.name-input');
const submitName = document.getElementById('submit-name');

closeTut.addEventListener('click', exitTut);
OpenTut.addEventListener('click', openTutorial);
submitName.addEventListener('click', function (e) {
    closeNaming();
    naming();
});

function naming() {
    let inputValue = document.getElementById("enter-name").value;
    let playername = document.getElementById("your-name").innerHTML = inputValue + ": " + '<span id="your-sum"></span>';
    return(playername);
}

function closeNaming() {
    nameEl.classList.remove("show");
}

function openNaming() {
    nameEl.classList.add("show");
}

function exitTut() {
    tutEl.classList.remove("show");
}

function openTutorial() {
    tutEl.classList.add("show");
}

let DoubleOrNothing = false;
donBtn.addEventListener('click', donClick);

function donClick() {
    DoubleOrNothing = true;
    wipeDeck();
    buildDeck();
    shuffleDeck();
    startGame();
}

let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let winstreak = 0;

let canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    openNaming();
    openTutorial();
    buildDeck();
    shuffleDeck();
    document.getElementById("creditNum").innerText = "100";
    startGame();
}

function restartGame() {
    DoubleOrNothing = false;
    wipeDeck();
    buildDeck();
    shuffleDeck();
    startGame();
}
document.getElementById('restart').addEventListener("click", restartGame)

function wipeDeck() {
    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";

    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";

    let hiddenCard = document.getElementById("hidden");
    if (!hiddenCard) {
        hiddenCard = document.createElement("img");
        hiddenCard.id = "hidden";
        document.getElementById("dealer-cards").append(hiddenCard);
    }
    hiddenCard.src = "./cards/BACK.png"; // Reset hidden card image

    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
    deck = 0;
    gameModal.classList.remove("show");
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    // console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {
        //<img src="./cards/4-C.png">
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    // console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    // console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = "";

    let creditnum = parseInt(
        document.getElementById("creditNum").innerText
    );

    if(DoubleOrNothing == true) {
        if (yourSum == 21) {
            message = "Blackjack!"
            creditnum += creditnum * 2;
            winstreak += 1;
        }
        else if (yourSum > 21) {
            message = "You Lose!";
            creditnum = 0;
            winstreak = 0;
        }
        else if (dealerSum > 21) {
            message = "You win!";
            creditnum += creditnum * 2;
            winstreak += 1;
        }
        //both you and dealer <= 21
        else if (yourSum == dealerSum) {
            message = "Tie! Nothing happens!";
        }
        else if (yourSum > dealerSum) {
            message = "You Win!";
            creditnum += creditnum * 2;
            winstreak += 1;
        }
        else if (yourSum < dealerSum) {
            message = "You Lose!";
            creditnum = 0;
            winstreak = 0;
        }
    } else {
    if (yourSum == 21) {
        message = "Blackjack!"
        creditnum += 100;
        winstreak += 1;
    }
    else if (yourSum > 21) {
        message = "You Lose!";
        creditnum -= 100;
        winstreak = 0;
    }
    else if (dealerSum > 21) {
        message = "You win!";
        creditnum += 100;
        winstreak += 1;
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie! Nothing happens!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
        creditnum += 100;
        winstreak += 1;
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
        creditnum -= 100;
        winstreak = 0;
    }
}

    if (winstreak > 0 && creditnum > 0) {
        donBtn.classList.add("show");
    } else {
        donBtn.classList.remove("show");
    }

    gameModal.classList.add("show");

    document.getElementById('winstreak').innerText = winstreak;
    document.getElementById("creditNum").innerText = creditnum;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}