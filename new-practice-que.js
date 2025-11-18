document.addEventListener('DOMContentLoaded', function () {
    const questionCards = document.querySelectorAll('.question-card');
    const submitTestBtn = document.getElementById('submitTestBtn');
    const resultsCard = document.getElementById('resultsCard');
    const tryAgainBtn = document.getElementById('tryAgainBtn');
    const nextSetBtn = document.getElementById('nextSetBtn');
    const selectedAnswers = {};

    function scrollToFirstQuestion() {
        if (questionCards.length > 0) {
            questionCards[0].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    questionCards.forEach((card, cardIndex) => {
        const viewAnswerBtn = card.querySelector('.view-answer-btn');
        const options = card.querySelectorAll('.option');
        const correctAnswerIndex = parseInt(card.dataset.correctAnswer);

        options.forEach(option => {
            option.addEventListener('click', function () {
                // Remove selected class from all options in this card
                options.forEach(opt => opt.classList.remove('selected', 'correct', 'wrong'));
                // Add selected class to the clicked option
                this.classList.add('selected');
                // Store the selected answer index
                selectedAnswers[cardIndex] = parseInt(this.dataset.optionIndex);
            });
        });

        if (viewAnswerBtn) {
            viewAnswerBtn.addEventListener('click', function () {
                const explanationBox = card.querySelector('.explanation-box');
                if (explanationBox) explanationBox.style.display = 'block';
                this.style.display = 'none'; // Hide View Answer button

                options.forEach(option => {
                    const optionIndex = parseInt(option.dataset.optionIndex);
                    option.classList.remove('selected');
                    
                    if (optionIndex === correctAnswerIndex) {
                        option.classList.add('correct');
                    } else if (selectedAnswers[cardIndex] === optionIndex) {
                        option.classList.add('wrong');
                    }
                    option.style.pointerEvents = 'none'; // Lock options after viewing answer
                });
            });
        }
    });

    if (submitTestBtn) {
        submitTestBtn.addEventListener('click', function () {
            let totalQuestions = questionCards.length;
            let attemptedQuestions = 0;
            let correctAnswers = 0;
            let wrongAnswers = 0;

            questionCards.forEach((card, cardIndex) => {
                const correctAnswerIndex = parseInt(card.dataset.correctAnswer);
                const userAnswerIndex = selectedAnswers[cardIndex];
                const options = card.querySelectorAll('.option');

                // 1. Calculate Score
                if (userAnswerIndex !== undefined) {
                    attemptedQuestions++;
                    if (userAnswerIndex === correctAnswerIndex) {
                        correctAnswers++;
                    } else {
                        wrongAnswers++;
                    }
                }

                // 2. Apply Visual Feedback
                options.forEach(option => {
                    const optionIndex = parseInt(option.dataset.optionIndex);
                    option.style.pointerEvents = 'none'; // Lock all options
                    option.classList.remove('selected', 'correct', 'wrong');
                    
                    if (optionIndex === correctAnswerIndex) {
                        option.classList.add('correct'); // Mark correct answer
                    } else if (userAnswerIndex === optionIndex) {
                        option.classList.add('wrong'); // Mark wrong selection
                    }
                });

                // 3. Show Answer/Explanation Boxes
                const viewAnsBtn = card.querySelector('.view-answer-btn');
                if (viewAnsBtn) viewAnsBtn.style.display = 'none';

                const explanationBox = card.querySelector('.explanation-box');
                if (explanationBox) explanationBox.style.display = 'block';
            });

            // 4. Update Results Card
            document.getElementById('totalQuestions').textContent = totalQuestions;
            document.getElementById('attemptedQuestions').textContent = attemptedQuestions;
            document.getElementById('correctAnswers').textContent = correctAnswers;
            document.getElementById('wrongAnswers').textContent = wrongAnswers;
            document.getElementById('yourScore').textContent = correctAnswers;
            document.getElementById('maxScore').textContent = totalQuestions;

            let message = '';
            if (totalQuestions > 0 && correctAnswers === totalQuestions) {
                message = "Excellent All Answers Are Correct";
            } else if (correctAnswers === 0 && attemptedQuestions === 0) {
                message = "You Haven't Attempted Any Questions Yet";
            } else if (correctAnswers >= totalQuestions / 2) {
                message = "Good Job Keep Practicing";
            } else {
                message = "Keep Practicing To Improve";
            }
            document.getElementById('resultsMessage').textContent = message;

            // 5. Display and Scroll to Results
            resultsCard.style.display = 'block';
            submitTestBtn.style.display = 'none';
            if (resultsCard) {
                resultsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function () {
            location.reload(); // Reload the page to reset the quiz
            // Optional: Scroll to the top after reload (though reload usually resets scroll position)
            setTimeout(scrollToFirstQuestion, 100); 
        });
    }

    // Next Question Set Button Logic - Reads URL from HTML data attribute
    if (nextSetBtn) {
        nextSetBtn.addEventListener('click', function () {
            // Read the URL from the data-next-url attribute in the HTML button
            const NEXT_TEST_URL = this.getAttribute('data-next-url'); 
            
            if (NEXT_TEST_URL && NEXT_TEST_URL !== "https://yourwebsite.com/set-02/test.html") {
                 window.location.href = NEXT_TEST_URL; // Navigate to the next URL
            } else {
                 alert("कृपया Next Test URL को कॉन्फ़िगर करें (HTML में data-next-url एट्रीब्यूट को बदलें)!");
            }
        });
    }
});
