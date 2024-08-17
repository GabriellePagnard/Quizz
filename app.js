// script.js

const questions = [
    {
        question: "Quelle est la capitale de la France ?",
        answers: [
            { text: "Paris", correct: true },
            { text: "Londres", correct: false },
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false },
            { text: "Rome", correct: false },
        ]
    },
    // Ajoutez 19 autres questions ici
    {
        question: "Quelle est la plus grande planète du système solaire ?",
        answers: [
            { text: "Jupiter", correct: true },
            { text: "Saturne", correct: false },
            { text: "Terre", correct: false },
            { text: "Mars", correct: false },
            { text: "Vénus", correct: false },
        ]
    },
    // Ajoutez d'autres questions ici pour atteindre 20 questions au total
];

let currentQuestionIndex = 0;
let score = 0;

const startButton = document.getElementById('start-button');
const quizScreen = document.getElementById('quiz-screen');
const questionContainer = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answersElement = document.getElementById('answers');
const progressBar = document.getElementById('progress-bar');
const endScreen = document.getElementById('end-screen');
const finalScoreElement = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');

startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);

function startQuiz() {
    startButton.parentElement.classList.add('hidden');
    quizScreen.classList.remove('hidden');
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
    updateProgress();
}

function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2', 'rounded', 'hover:bg-blue-600', 'w-full', 'text-left');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answersElement.appendChild(button);
    });
}

function resetState() {
    while (answersElement.firstChild) {
        answersElement.removeChild(answersElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';

    if (correct) {
        score++;
    }

    selectedButton.classList.add(correct ? 'bg-green-500' : 'bg-red-500');
    Array.from(answersElement.children).forEach(button => {
        button.classList.add(button.dataset.correct === 'true' ? 'bg-green-500' : 'bg-red-500');
        button.disabled = true;
    });

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            updateProgress();
        } else {
            endQuiz();
        }
    }, 1000);
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
}

function endQuiz() {
    quizScreen.classList.add('hidden');
    endScreen.classList.remove('hidden');
    finalScoreElement.textContent = `Bravo ! Vous avez obtenu ${score} points sur ${questions.length} !`;
}

function restartQuiz() {
    endScreen.classList.add('hidden');
    startButton.parentElement.classList.remove('hidden');
}
