// Fetches the content of the dictionary file (dictionary.txt)
fetch('dictionary.txt')
.then(response => response.text()) // Converts the response to text
.then(data => {
    // Splits the dictionary content (string) into an array of words based on spaces or commas
    const dictionary = data.split(/[\s,]+/);

    // Function to calculate the edit distance between two words (Levenshtein distance)
    function closeWords(a, b) {
        if (a.length === 0) return b.length;  // If one word is empty, return the length of the other
        if (b.length === 0) return a.length;
        var matrix = [];
        // Initialize matrix with row and column indices
        for (var i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (var j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        // Fill in the matrix with calculated edit distances
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i-1) == a.charAt(j-1)) {
                    matrix[i][j] = matrix[i-1][j-1]; // No operation needed if characters match
                } 
                else {
                    matrix[i][j] = Math.min(
                        matrix[i-1][j-1] + 1, // Substitution
                        Math.min(matrix[i][j-1] + 1, // Insertion
                        matrix[i-1][j] + 1) // Deletion
                    );
                }
            }
        }
        return matrix[b.length][a.length]; // Return the Levenshtein distance
    }

    // Checks if two words differ only by a swapped letter (not the first letter)
    function checkSwappedLetters(incorrectWord, dictionaryWord) {
        if (incorrectWord[0] !== dictionaryWord[0]) { // Ensure the first letters match
            return false;
        }
        var swappedWord = incorrectWord.split('');
        // Loop through letters and swap them to check for possible matches
        for (var i = 0; i < swappedWord.length - 1; i++) {
            for (var j = i + 1; j < swappedWord.length; j++) {
                var temp = swappedWord[i];
                swappedWord[i] = swappedWord[j];
                swappedWord[j] = temp;
                if (swappedWord.join('') === dictionaryWord) {
                    return true; // Return true if swapped letters create a match
                }
                swappedWord[j] = swappedWord[i];
                swappedWord[i] = temp;
            }
        }
        return false; // Return false if no valid swap is found
    }

    // Suggests corrections for incorrect words based on dictionary words
    function suggestCorrections(incorrectWords, dictionary) {
        var suggestions = {};
        for (const incorrectWord of incorrectWords) {
            var closestWords = [];
            var minDistance = Number.MAX_SAFE_INTEGER; // Initialize the minimum distance
            // Compare the incorrect word with every word in the dictionary
            for (const dictionaryWord of dictionary) {
                if (checkSwappedLetters(incorrectWord, dictionaryWord)) {
                    closestWords.unshift(dictionaryWord); // Add swapped words at the front
                } 
                else {
                    var distance = closeWords(incorrectWord, dictionaryWord);
                    if (distance < minDistance) {
                        closestWords = [dictionaryWord]; // New closest word found
                        minDistance = distance;
                    } 
                    else if (distance === minDistance) {
                        closestWords.push(dictionaryWord); // Add as an alternative suggestion
                    }
                    if (closestWords.length > 4) { // Limit the number of suggestions to 4
                        closestWords.pop();
                    }
                }
            }
            suggestions[incorrectWord] = closestWords; // Store suggestions for the incorrect word
        }
        return suggestions; // Return the suggestions object
    }

    // Main spell-checking function
    function spellCheck(input) {
        var correctWords = [];
        var incorrectWords = [];
        // Convert user input into an array of words (lowercased and split by punctuation)
        const inputWords = input.toLowerCase().split(/[\s,;:.!?"']+/);
        // Check each word if it exists in the dictionary
        for (const word of inputWords) { 
            if (dictionary.includes(word)) {
                correctWords.push(word); // Add correct words
            } 
            else {
                incorrectWords.push(word); // Add incorrect words
            }
        }
        // Get suggestions for incorrect words
        var suggestions = suggestCorrections(incorrectWords, dictionary);
        return {correctWords, incorrectWords, suggestions}; // Return the result
    }

    // Event listener for the "check-spelling-button"
    var button = document.getElementById("check-spelling-button");
    button.addEventListener("click", function(){
        var textarea = document.getElementById("user-input");
        var userInput = textarea.value; // Get the input text from the user
        var result = spellCheck(userInput); // Run spellCheck function
        var correctDiv = document.querySelector("#correct-word p");
        correctDiv.innerHTML = result.correctWords; // Display correct words
        var incorrectDiv = document.querySelector("#incorrect-word p");
        incorrectDiv.innerHTML = result.incorrectWords; // Display incorrect words
        // Loop through suggestions and display them
        for (const [incorrect, suggestions] of Object.entries(result.suggestions)) {
            var suggestionsDiv = document.querySelector("#suggestions p");
            suggestionsDiv.innerHTML += `<br>Förslag för <strong>${incorrect}:</strong> ${suggestions.join(', ')}`;
        }
    });
})
