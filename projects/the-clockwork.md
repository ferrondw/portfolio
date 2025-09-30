---
The Clockwork
A choose your own adventure text story written in JavaScript as beginnner course for MediaCollege Amsterdam
---

# Introduction

This was my first ever JavaScript project made in my first year in Mediacollege Amsterdam. It's a text adventure story

# Flowchart

![Story Flowchart](./assets/images/projects/the-clockwork/flowchart.png)

# Story Handling

Besides the story, I focussed on making the programming of it modular and easy to edit. Thus I made `main.js`, which parses the story written fully in JSON. Then I use external ASCII art and such by making a JavaScript file and making it export itself, making it usable as an import.

```js
async function PlayPart(index) {
    try {
        const { text, choices } = Story[index];

        for (const line of text) {
            for(const word of line.split('')){
                process.stdout.write(`${word}`);
                await new Promise(resolve => setTimeout(resolve, letterDelay * 1000));
            }
            process.stdout.write("\n")
            await new Promise(resolve => setTimeout(resolve, sentenceDelay * 1000));
        }

        const choiceKeys = Object.keys(choices);
        const userAnswer = readlineSync.keyInSelect(choiceKeys, '');

        const nextStoryPart = choices[choiceKeys[userAnswer]];

        // check for endings
        if (!parseInt(nextStoryPart)) {
            PlayEnding(parseInt(nextStoryPart.slice(1)));
            return;
        }

        // play the next part of the story based on the users choice
        PlayPart(nextStoryPart);
    }
    catch {
        // something went wrong trying to play a story part
        // this means there is a flaw in the story file, something leads to nothing!
        console.log('Seems like a wormhole sucked up the story, so it cannot continue!');
    }
}
```

And not to forget the story itself, which is neatly organised in a formatted json export

```js
const Art = require("./art.js");

const Story = [
    { // 0 - Waking up with a headache
        text: [
            'After a long day of work, you can finally sleep.',
            'But, after waking up, you have a splitting headache!',
            'Pressing the sore eyelids together while yawning with crispy lips, you get out of bed.',
            'Still a little bit dizzy from standing up, you quickly come to a decision to make.'
        ],
        choices: {
            'Look around what can help with the headache': 1,
            'Notice something glowing': 9
        },
    },
    { // 1 - Looking for help
        text: [
            'As you stumble around your room looking for something to help with the headache, you notice 2 things.',
            'On one end of the room is a paracetemol, on the other a cold glass of water.',
            'You are simply too dizzy to get both, who knows what might go wrong if you did!',
            'So, will you...'
        ],
        choices: {
            'Get the glass of water.': 2,
            'Get the paracetemol.': 2,
        },
    }...
];
module.exports = Story;
```

Using `process.stdout.write()` I can write the next character without creating a new line, this is how animating the characters is made. If an error occurs, I handle that with spitting out a custom error message in line with the 'world' of the story.

# Example

![Playing](./assets/images/projects/the-clockwork/playing.gif)