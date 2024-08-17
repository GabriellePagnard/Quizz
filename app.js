function checkAnswer(selectedOption, button) {
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
        if (btn.textContent === correctAnswer && btn !== button) {
            btn.classList.add('bg-green-500', 'text-white');
        }
    });

    // Forcer le re-rendu pour garantir l'application des styles
    requestAnimationFrame(() => {
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
    });
}
