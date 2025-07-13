const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('.flip-card-front');
const frontTitle = document.querySelector('#card-front h1');
const cardBack = document.querySelector('.flip-card-back');
const backTitle = document.querySelector('#card-back h1');
const description = document.querySelector('#card-back span');
const buttonNext = document.querySelector('#next');
const buttonBack = document.querySelector('#back');
const buttonExam = document.querySelector('#exam');
const currentWord = document.querySelector('#current-word');
const wordsProgress = document.querySelector('#words-progress');
const studyCards = document.querySelector('.study-cards');
const studyMode = document.querySelector('#study-mode');
const examCards = document.querySelector('#exam-cards');
const examMode = document.querySelector('#exam-mode');



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
let firstCard = null;
let secondCard = null;


function addWord() {
    frontTitle.textContent = items[index].word;
    backTitle.textContent = items[index].translation;
    description.textContent = items[index].example;
    currentWord.textContent = wordCounter;


}
addWord();

function flipCards() {
    isFliped = !isFliped;
    if (isFliped) {
        flipCard.classList.add('active');
    } else {
        flipCard.classList.remove('active');
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

function shuffleCards() {
    for (let i = 0; i < items.length; i++) {
        const randomIndex = Math.floor(Math.random() * items.length);
        const temp = items[i];
        items[i] = items[randomIndex];
        items[randomIndex] = temp;
    }

} //длина = 5, а мне нужно 10, а то карточки перемешиваются по 5 два раза

function prepareCards() {
    shuffleCards();
    items.forEach(item => {
        const card = document.createElement('div');
        card.textContent = item.word;
        card.classList.add('card');

        card.addEventListener("click", function() {
            if (firstCard === null) {
                firstCard = card;
                firstCard.classList.add('correct');
            } else {
                secondCard = card;
            }
            //  вот здесь я застопорилась, потому что не могу сравнить карточки между собой из-за дублирования.
            if (firstCard !== null && secondCard !== null) {
                const firstCardText = card.textContent;
                const secondCardText = card.textContent;
                if (firstCardText === secondCardText) {
                    secondCard.classList.add('correct');
                }

            }
        });
        examCards.append(card);
    });
    shuffleCards();
    items.forEach(item => {
        const card = document.createElement('div');
        card.textContent = item.translation;
        card.classList.add('card');
        examCards.append(card);
    })

}



function changeMode() {
    studyCards.classList.add('hidden');
    studyMode.classList.add('hidden');
    examMode.classList.remove('hidden');
    prepareCards();

}

buttonExam.addEventListener("click", changeMode);