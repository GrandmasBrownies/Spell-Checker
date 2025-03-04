# Spell Checker

This is a simple JavaScript-based spell checker that takes user input, checks for spelling errors against a predefined dictionary, and suggests corrections for misspelled words. It utilizes the Levenshtein distance algorithm to determine the closest matching words.

## Features
- Loads a dictionary of words from `dictionary.txt`.
- Identifies correct and incorrect words in the user input.
- Suggests possible corrections for misspelled words.
- Recognizes minor typos, including swapped letters.
- Displays results dynamically on a webpage.

## Installation & Setup
```sh
# Clone this repository
git clone https://github.com/GrandmasBrownies/Spell-Checker.git

# Navigate to the project directory
cd Spell-Checker
```
Make sure `dictionary.txt` is present in the same directory as the script. Then, open the `index.html` file in a web browser to use the spell checker.

## How It Works
1. The script fetches `dictionary.txt` and splits it into an array of valid words.
2. When the user inputs text and clicks the "Check Spelling" button:
   - Words are split and converted to lowercase.
   - Words found in the dictionary are marked as correct.
   - Words not found are marked as incorrect and checked for close matches.
3. Suggestions are generated using:
   - **Levenshtein Distance Algorithm**: Computes word similarity.
   - **Swapped Letter Detection**: Checks if letters (except the first) are swapped.
4. Results are displayed under:
   - **Correct Words**
   - **Incorrect Words**
   - **Suggested Corrections**

## Usage Example
1. Enter text in the provided input field.
2. Click the "Check Spelling" button.
3. The program will:
   - Highlight correctly spelled words.
   - Identify incorrect words.
   - Provide possible suggestions for corrections.
  
## Improvments
Although this project works it is still quite a simple program were many improvments can be made
1. The first thing I would do is improve it's capability of dealing with longer texts were as of now it starts slowing down the longer the text gets (would most likely do this by haveing it constantly check for misspelled words instead of haveing to click a button for it)
2. Add a way to click the suggested word and swap it out for the incorrect word
3. Improve on the dictionary library
4. Make a better looking web page were as of now it was almost only focused on the functionality rather then the looks

## Contribution
Feel free to contribute by submitting pull requests for:
- Improving accuracy of suggestions.
- Enhancing UI/UX.
- Adding support for additional languages.

## License
This project is licensed under the MIT License.

## Author
Developed by [GrandmasBrownies](https://github.com/GrandmasBrownies).

