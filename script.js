fetch('dictionary.txt')
.then(response => response.text())
.then(data => {
    // Spliting the dictionary into an array of words
    const dictionary = data.split(/[\s,]+/);
    // function to find the closest words
    function closeWords(a, b) {
        if (a.length === 0) return b.length; 
        if (b.length === 0) return a.length; 
        var matrix = [];
        for (var i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (var j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (i = 1; i <= b.length; i++) {
            for (j = 1; j <= a.length; j++) {
                if (b.charAt(i-1) == a.charAt(j-1)) {
                    matrix[i][j] = matrix[i-1][j-1];
                } 
                else {
                    matrix[i][j] = Math.min(matrix[i-1][j-1] + 1,
                    Math.min(matrix[i][j-1] + 1,
                    matrix[i-1][j] + 1));
                } 
            }
        }
        return matrix[b.length][a.length];
    }

    // Checks if two letters are swapped that is not the first letter to get a more exact first suggestion
    function checkSwappedLetters(incorrectWord, dictionaryWord) {
        if (incorrectWord[0] !== dictionaryWord[0]) {
            return false;
        }
        var swappedWord = incorrectWord.split('');
        for (var i = 0; i < swappedWord.length - 1; i++) {
            for (var j = i + 1; j < swappedWord.length; j++) {
                var temp = swappedWord[i];
                swappedWord[i] = swappedWord[j];
                swappedWord[j] = temp;
                if (swappedWord.join('') === dictionaryWord) {
                    return true;
                }
                swappedWord[j] = swappedWord[i];
                swappedWord[i] = temp;
            }
        }
        return false;
    }

    // Displays the suggestions to the inccorect words
    function suggestCorrections(incorrectWords, dictionary) {
        var suggestions = {};
        for (const incorrectWord of incorrectWords) {
            var closestWords = [];
            var minDistance = Number.MAX_SAFE_INTEGER;
            for (const dictionaryWord of dictionary) {
                if (checkSwappedLetters(incorrectWord, dictionaryWord)) {
                    closestWords.unshift(dictionaryWord);
                } 
                else {
                    var distance = closeWords(incorrectWord, dictionaryWord);
                    if (distance < minDistance) {
                        closestWords = [dictionaryWord];
                        minDistance = distance;
                    } 
                    else if (distance === minDistance) {
                        closestWords.push(dictionaryWord);
                    }
                    if (closestWords.length > 4) {
                        closestWords.pop();
                    }
                }
            }
            suggestions[incorrectWord] = closestWords;
        }
        return suggestions;
    }      
      
    function spellCheck(input) {
        var correctWords = [];
        var incorrectWords = [];
        // converting user input into an array of words
        const inputWords = input.toLowerCase().split(/[\s,;:.!?"']+/);
        // check each word 
        for (const word of inputWords) { 
            if (dictionary.includes(word)) {
                correctWords.push(word);
            } 
            else {
                incorrectWords.push(word);
            }
        }
        var suggestions = suggestCorrections(incorrectWords, dictionary);
        return {correctWords, incorrectWords, suggestions};
    }
    // event listener for button click
    var button = document.getElementById("check-spelling-button");
    button.addEventListener("click", function(){
        var textarea = document.getElementById("user-input");
        var userInput = textarea.value;
        var result = spellCheck(userInput);
        var correctDiv = document.querySelector("#correct-word p");
        correctDiv.innerHTML = result.correctWords;
        var incorrectDiv = document.querySelector("#incorrect-word p");
        incorrectDiv.innerHTML = result.incorrectWords;
        for (const [incorrect, suggestions] of Object.entries(result.suggestions)) {
            var suggestionsDiv = document.querySelector("#suggestions p");
            suggestionsDiv.innerHTML += `<br>Förslag för <strong>${incorrect}:</strong> ${suggestions.join(', ')}`;
        }
    });
})