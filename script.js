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
const examProgress = document.querySelector('#exam-progress');
const correctPercent = document.querySelector('#correct-percent');



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
let selectedWord = null;
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
        if (!selectedWord) {
            selectedWord = this.textContent;
            this.classList.add("correct");

        } else {
            if (dictionary[this.textContent] === selectedWord) {
                this.classList.add("correct");
                if (card.classList.contains("correct")) {
                    card.classList.add("fade-out");
                }
                //убирается только вторая карточка, не могу добраться до первой выбранной
                examProgress.value = examProgress.value + 20;
                selectedWord = null;


            } else {
                this.classList.add("wrong");
                const deleteWrong = setTimeout(() => {
                    this.classList.remove("wrong")
                }, 500);


            }


        }
        const count = document.querySelectorAll(".card").length;
        const cardFadeOut = document.querySelectorAll(".card.fade-out").length;
        console.log(count)
        console.log(cardFadeOut)
        if (count === cardFadeOut) {
            alert("Тренировка выполнена успешно!");
        }
        // как правильно сделать сравнение в конце тренировки? Будет ли так работать,если всем карточкам присвоится класс fade-out?





    });
    return card;
}



function changeMode() {
    studyCards.classList.add('hidden');
    studyMode.classList.add('hidden');
    examMode.classList.remove('hidden');
    renderExamCards();
}

buttonExam.addEventListener("click", changeMode);