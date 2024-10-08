/**
 * Fonction principale pour démarrer le quiz
 * Cache le bouton de démarrage et affiche le contenu du quiz
 */
document.getElementById('start-quiz').addEventListener('click', startQuiz);
document.getElementById('replay-quiz').addEventListener('click', restartQuiz);

let currentQuestionIndex = 0; // Index de la question actuelle
let score = 0; // Score du joueur
let totalQuestions = 0; // Nombre total de questions sélectionnées
let shuffledQuestions = []; // Tableau des questions mélangées

/**
 * Démarre le quiz en chargeant les questions et en affichant la première question.
 * @async
 */
async function startQuiz() {
    try {
        // Masquer le bouton de démarrage et afficher le contenu du quiz
        document.getElementById('start-quiz').style.display = 'none';
        document.getElementById('quiz-content').classList.remove('hidden');
        document.getElementById('progress-bar-container').classList.remove('hidden');

        // Charger les questions depuis le fichier JSON
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Erreur lors du chargement des questions');
        const questions = await response.json();

        // Mélanger les questions et sélectionner les 20 premières
        shuffledQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 20);
        totalQuestions = shuffledQuestions.length;
        updateProgressBar();
        displayQuestion();
    } catch (error) {
        console.error('Erreur lors du chargement des questions :', error);
    }
}

/**
 * Affiche la question actuelle et ses options de réponse.
 */
function displayQuestion() {
    if (!shuffledQuestions[currentQuestionIndex]) {
        console.error('Erreur : Question ou réponses non définies.');
        return;
    }

    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    // Afficher la question actuelle
    questionElement.textContent = shuffledQuestions[currentQuestionIndex].question;
    optionsElement.innerHTML = ''; // Vider les options précédentes

    // Générer les boutons pour chaque option
    shuffledQuestions[currentQuestionIndex].options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button', 'bg-gray-200', 'px-4', 'py-2', 'rounded', 'hover:bg-gray-300');
        button.addEventListener('click', (event) => checkAnswer(option, button, event));
        button.addEventListener('touchstart', (event) => checkAnswer(option, button, event)); // Support tactile
        optionsElement.appendChild(button);
    });
}

/**
 * Vérifie si la réponse sélectionnée est correcte et met à jour l'affichage.
 * @param {string} selectedOption - Option sélectionnée par l'utilisateur.
 * @param {HTMLElement} button - Bouton cliqué par l'utilisateur.
 * @param {Event} event - Événement de clic ou de touche.
 */
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

/**
 * Met à jour la barre de progression en fonction de la question actuelle.
 */
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
}

/**
 * Affiche la fenêtre modale avec le score final.
 */
function showFinalScore() {
    document.getElementById('quiz-content').classList.add('hidden');
    document.getElementById('progress-bar-container').classList.add('hidden');
    document.getElementById('result-modal').classList.remove('hidden');
    document.getElementById('final-score').textContent = `Votre score : ${score} / ${totalQuestions}`;
}

/**
 * Redémarre le quiz et réinitialise les paramètres.
 */
function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-modal').classList.add('hidden');
    startQuiz();
}
