document.getElementById('start-quiz').addEventListener('click', startQuiz);
document.getElementById('replay-quiz').addEventListener('click', restartQuiz);

let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let shuffledQuestions = [];

async function startQuiz() {
    try {
        document.getElementById('start-quiz').style.display = 'none';
        document.getElementById('quiz-content').classList.remove('hidden');
        document.getElementById('progress-bar-container').classList.remove('hidden');

        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Erreur lors du chargement des questions');
        const questions = await response.json();
        shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 20);
        totalQuestions = shuffledQuestions.length;
        updateProgressBar();
        displayQuestion();
    } catch (error) {
        console.error('Erreur lors du chargement des questions :', error);
    }
}

function displayQuestion() {
    if (!shuffledQuestions[currentQuestionIndex]) {
        console.error('Erreur : Question ou réponses non définies.');
        return;
    }

    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    questionElement.textContent = shuffledQuestions[currentQuestionIndex].question;
    optionsElement.innerHTML = '';

    shuffledQuestions[currentQuestionIndex].options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button', 'bg-gray-200', 'px-4', 'py-2', 'rounded', 'hover:bg-gray-300');
        button.addEventListener('click', (event) => checkAnswer(option, button, event));
        button.addEventListener('touchstart', (event) => checkAnswer(option, button, event)); // Support tactile
        optionsElement.appendChild(button);
    });
}

function checkAnswer(selectedOption, button, event) {
    event.preventDefault();
    const correctAnswer = shuffledQuestions[currentQuestionIndex].correct_answer;

    // Vérifier si la réponse est correcte
    if (selectedOption === correctAnswer) {
        button.classList.add('bg-green-500', 'text-white');
        score++; // Incrémentation du score si la réponse est correcte
    } else {
        button.classList.add('bg-red-500', 'text-white');
    }

    // Désactiver tous les boutons après avoir sélectionné une réponse
    document.querySelectorAll('.option-button').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('bg-green-500', 'text-white');
        }
    });

    // Attendre un moment avant de passer à la question suivante
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < totalQuestions) {
            updateProgressBar();
            displayQuestion();
        } else {
            showFinalScore();
        }
    }, 1000);
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
}

function showFinalScore() {
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('progress-bar-container').classList.add('hidden');
    document.getElementById('result-modal').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Votre score : ${score} / ${totalQuestions}`;
}

function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-modal').classList.add('hidden');
    startQuiz();
}
