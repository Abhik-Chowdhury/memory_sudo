const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const control = document.querySelector(".control-container");

let cards;
let interval;
let firstCard;
let secondCard;
// the objects of the cards
let items = [{name:"bee",image:"./image/bee.png"},
{name:"crab",image:"./image/crab.png"},
{name:"deer",image:"./image/deer.png"},
{name:"elephant",image:"./image/elephant.png"},
{name:"fox",image:"./image/fox.png"},
{name:"gorila",image:"./image/gorila.png"},
{name:"lion",image:"./image/lion.png"},
{name:"octopus",image:"./image/octopus.png"},
{name:"owl",image:"./image/owl.png"},
{name:"parrot",image:"./image/parrot.png"},
{name:"squirrel",image:"./image/squirrel.png"},
{name:"whale",image:"./image/whale.png"}
]

// Initial Time
let seconds = 0,
minutes = 0;
let moves_count = 0,
winCount = 0;

// For Timer
const timeGenerator = ()=>{
    seconds += 1;
    //minutes
    if(seconds >=60){
        minutes += 1;
        seconds = 0;
    }
    // Format time before displaying
    let secondValue = seconds < 10 ? `0${seconds}`:seconds;
    let minuteValue = minutes < 10 ? `0${minutes}`:minutes;
    timeValue.innerHTML = `<span>Time :</span>${minuteValue} : ${secondValue}`;
};

// Calculate moves
const movesCounter = ()=>{
    moves_count += 1;
    moves.innerHTML = `<span>Moves:</span> ${moves_count}`;
};

// Game Logic

const generateRandom = (size = 4)=>{
    //temporary Array
    let tempArray = [...items];
    //initialize cardValues array
    let cardValues = [];
    //size huld be double (4 * 4 matrix) / 2 
    // since pairs of objects would exist

    size = (size * size) / 2;
    //random object selection

    for(let count = 0 ; count < size ; count++){
        const randomIndex = Math.floor(Math.random()*tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        // once selected remove the object from tempArray
        tempArray.splice(randomIndex,1);
    }
    return cardValues
};

const matrixGenerator = (cardValues,size=4)=>{
    gameContainer.innerHTML = "";
    cardValues = [...cardValues,...cardValues];
    //simple suffle
    cardValues.sort(()=> Math.random()-0.5);
    for(let init = 0 ; init < size * size ; init++){
        /*
         Create card
         before => font side (contains question mark)
         after => back side (contains actual image):
         data-card-value is a custom attribute which 
         stores the names of the cards to match later
        */
       gameContainer.innerHTML+= `
       <div class="card-container" data-card-value="${cardValues[init]?.name}">
          <div class="card-before">?</div>
          <div class="card-after">
          <img src="${cardValues[init]?.image}"
          width="90px" height="90px" class="image"/></div>
       </div>
       `;
    }
    //Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

    //Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) =>{
        card.addEventListener("click",()=>{
            //if selected not matched then run only
            // i.e already matched card when clicked would be ingnore
            if(!card.classList.contains("matched")){
                //flip the card
                card.classList.add("flipped");
                //if it is the firstcard (!firstcard 
                //since fitstcard is initially false)
                if(!firstCard){
                    // so the current card will become firstcard
                    firstCard = card;
                    //current cards value becomes fristcard value
                    firstCardValue = card.getAttribute("data-card-value");
                }
                else{
                    // increment moves since user selected second card
                    movesCounter();
                    // secondcard value
                    secondCard = card;
                    secondCardValue = card.getAttribute("data-card-value");
                    if(firstCardValue == secondCardValue){
                        // if both card matched so add matched
                        //they would be ignore next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        //set the firstcard to false since next card going to the firstCard
                        firstCard = false;
                        //winCount increment as user found correct match
                        winCount += 1;
                        //check if the winCount = half of card value
                        if(winCount == Math.floor(cardValues.length / 2)){
                            result.innerHTML = `<h2>You Won</h2>
                            <h4>Move:${moves_count}</h4>`;
                            stopGame();
                        } 
                    }else{
                        //if dont matched
                        // flip the card back to normal
                        let [tempFirst,tempSecond] = [firstCard,secondCard];
                        firstCard = false;
                        secondCard = false;
                        let delay = setTimeout(()=>{
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        },900);
                    }
                }
            }
        });
    });

};

//Start the Game 

startButton.addEventListener("click",()=>{
    moves_count = 0;
    time = 0;
    control.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    //start timer
    interval = setInterval(timeGenerator,1000);
    //initial moves
    moves.innerHTML = `<span>Moves:</span${moves_count}`;
    initializer();
})
//Stop the game
stopButton.addEventListener("click",(stopGame = ()=>{
    control.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
}))
// Ininital values and funct calls

const initializer = ()=>{
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    console.log(cardValues)
    matrixGenerator(cardValues);
};
