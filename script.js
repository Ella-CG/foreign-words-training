const flipCard = document.querySelector(".flip-card");
const cardFront = document.querySelector(".flip-card-front");
const frontTitle = document.querySelector("#card-front h1");
const cardBack = document.querySelector(".flip-card-back");
const backTitle = document.querySelector("#card-back h1");
const description = document.querySelector("#card-back span");
const buttonNext = document.querySelector("#next");
const buttonBack = document.querySelector("#back");
const buttonExam = document.querySelector("#exam");
const currentWord = document.querySelector("#current-word");
const wordsProgress = document.querySelector("#words-progress");
const studyCards = document.querySelector(".study-cards");
const studyMode = document.querySelector("#study-mode");
const examCards = document.querySelector("#exam-cards");
const examMode = document.querySelector("#exam-mode");
const examProgress = document.querySelector("#exam-progress");
const time = document.querySelector("#time");



const items = [{
        word: "apple",
        translation: "яблоко",
        example: "She ate an apple for breakfast.",
    },
    {
        word: "cat",
        translation: "кошка",
        example: "Her cat loves to climb trees.",
    },
    {
        word: "home",
        translation: "дом",
        example: "The family is happy to be home.",
    },
    {
        word: "popcorn",
        translation: "попкорн",
        example: "Popcorn is my favorite movie snack.",
    },
    {
        word: "street",
        translation: "улица",
        example: "We walked down the busy street."
    }
];


let index = 0;
let slideCounter = 0;
let isFliped = false;
let wordCounter = 1;
wordsProgress.value = 20;
examProgress.value = 0;
let minutes = 0;
let seconds = 0;
let selectedWord = null;
let fadeoutCardsCount = 0;
let percent = 0;
let timerId;
const dictionary = {};

function fillDictionary() {
    items.forEach((item) => {
        dictionary[item.word] = item.translation;
        dictionary[item.translation] = item.word;
    });

}

function addWord() {
    frontTitle.textContent = items[index].word;
    backTitle.textContent = items[index].translation;
    description.textContent = items[index].example;
    currentWord.textContent = wordCounter;


}
addWord();
fillDictionary();

function flipCards() {
    isFliped = !isFliped;
    if (isFliped) {
        flipCard.classList.add("active");
    } else {
        flipCard.classList.remove("active");
    }
}

function nextSlide() {

    slideCounter++;
    index++;
    wordCounter++;
    wordsProgress.value = wordsProgress.value + 20;
    if (slideCounter > 0) {
        buttonBack.disabled = false;
    }
    if (slideCounter === items.length - 1) {
        buttonNext.disabled = true;
    }
    addWord();
}

function prevSlide() {
    slideCounter--;
    index--;
    wordCounter--;
    wordsProgress.value = wordsProgress.value - 20;
    buttonNext.disabled = false;
    if (slideCounter === 0) {
        buttonBack.disabled = true;
    }
    addWord();
}

flipCard.addEventListener("click", flipCards);

buttonNext.addEventListener("click", nextSlide);
buttonBack.addEventListener("click", prevSlide);


function addZero(value) {
    if (value < 10) {
        return "0" + value;
    }
    return value;
}


function shuffleCards(arr) {
    arr.sort(() => Math.random() - 0.5);
}

function renderExamCards() {
    const fragment = new DocumentFragment();
    const arr = [];
    items.forEach((item) => {
        const question = makeExamCard(item.word);
        arr.push(question);
        const answer = makeExamCard(item.translation);
        arr.push(answer);
    });
    shuffleCards(arr);
    fragment.append(...arr);
    examCards.innerHTML = "";
    examCards.append(fragment);

}


function makeExamCard(word) {

    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = word;

    card.addEventListener("click", function() {
        if (card.classList.contains("correct") || card.classList.contains("fade-out")) {
            return;
        }

        if (!selectedWord) {
            selectedWord = this.textContent;
            this.classList.add("correct");

        } else {
            if (dictionary[this.textContent] === selectedWord) {
                this.classList.add("correct");
                const cardsCorrect = document.querySelectorAll(".correct");
                cardsCorrect.forEach((card) => {
                    card.classList.add("fade-out");

                })
                increasePercent();
                fadeoutCardsCount++;

            } else {
                this.classList.add("wrong");
                const correct = document.querySelectorAll(".correct");
                const wrong = document.querySelectorAll(".wrong");
                const wrongCards = [...correct, ...wrong];
                wrongCards.forEach((card) => {
                    if (!card.classList.contains("fade-out")) {
                        setTimeout(() => {
                            card.className = "card";
                        }, 500);
                    };

                })
            }
            selectedWord = null;

        }
        checkEndGame();

    });

    return card;

}

function checkEndGame() {
    if (fadeoutCardsCount === items.length) {
        clearInterval(timerId);
        setTimeout(() => {
            alert("Тренировка успешно завершена!");
        }, 800);
    }
}

function changeMode() {
    studyCards.classList.add("hidden");
    studyMode.classList.add("hidden");
    examMode.classList.remove("hidden");
    renderExamCards();
    startTimer();

}


function startTimer() {
    timerId = setInterval(() => {
        time.textContent = `${addZero(minutes)}:${addZero(seconds)}`;
        seconds++;
        if (seconds === 59) {
            minutes++;
            seconds = 0;
        }
    }, 1000);

}

function increasePercent() {
    const correctPercent = document.querySelector("#correct-percent");

    function newPercent(number) {
        return number + 20;
    }
    percent = newPercent(percent);
    correctPercent.textContent = percent + "%";
    examProgress.value = examProgress.value + 20;
}

buttonExam.addEventListener("click", changeMode);