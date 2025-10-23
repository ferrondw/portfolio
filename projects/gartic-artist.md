*( first of all, no the extension is not available because I'm pretty sure it violates the ToS of Gartic Phone )*

# Introduction
What started as a simple idea to make a better looking Gartic Phone extension turned into almost completely reverse-engineering how Gartic Phone works!

Because when playing with friends, I always wonder why all the extensions looked so... 'eh'. Not that the extensions didn't work, far from it. But they all added buttons in places you would least expect it. So I set out to figure out how to not only improve existing features, but also make them look the part


# Palette
Really? 18 colors? What about 66?

The color input is handy, but when drawing quickly, only 18 colors won't cut it.

So not only did I make a custom color palette grid, but also added a color picker (much like the other extensions, only mine has the correct `:hover` and `:active` states like the original tools of Gartic Phone)

![Palette](./assets/images/projects/gartic-artist/palette.png)
![Palette](./assets/images/projects/gartic-artist/color-picker.gif)


# Canvas
It's always the seemingly trivial tasks that cause the most headaches, I think a good 70% of development time was spent on this feature, and it isn't even done!

I thought it worked by just... updating the canvas, because it's a HTML canvas element, why not draw directly on top of it?

That dream was VERY short lived, as every shape that was drawn was almost instantly removed, and it made me very curious how it actually worked

The next thought was maybe something to do with React? By looking at the DOM elements it's very apparant that Gartic Phone is made with React, so maybe there is something I can use there?

From climbing into fiber trees (no clue what they are), to hijacking Canvas prototypes to log all events, nothing worked

That was until I went from `Console` to `Network`, where I saw the dreaded WebSocket connection being made

So I made a simple WebSocket patcher, and with "I made" I mean StackOverflow made a simple WebSocket patcher... Alas it worked

So, after almost 2 weeks of daily development, 100's of strokes put on the canvas, and 10's of games started, I think I figured out how Gartic Phone handles WebSockets


# WebSocket

WebSocket connections are opened the instant you make a lobby, client sends a `2probe` and the server responds with `3probe`, which is probably asking "you real and healthy?"

A `2` is a health check, if the server responds with a `3`, all good!

When in the lobby, you can pick a gamemode, because there are other players in the lobby, it needs to be updated live

Client sends for example `42[2,26,20]` and the server responds with the same message to 'confirm' the action. With that all lobby/gamemode messages start with `42[2,26,...` if you pick from the preselected grid of gamemodes, if you make a custom game, the client sends `42[2,27,2]`, and to move back to a preselected gamemode, it sends `42[2,27,1]`. The client sends ``42[2,18,{"1":2}]`` with 1 being the name of the setting being changed, and 2 being the value, 2 is always an int. But even better, I found out the dropdown is not in order! so from option `[0,1,2,3,4,5]` in the dropdown, you could send `[3,2,1,5,8,4]`... 

Now for the canvas itself, which also sends a LOT of messages through the WebSocket

The base message starts with `42[2,7,{}]`, with the last object being the actual content of the message. It consists of a few variables, for example the beginning of a random brush stroke:
`{"t":0,"d":1,"v":[1,67,["#000000",6,1],[188,81]]}`, `t` is always 0 for some reason, i *think* `d` is some sort of state? Shape tools only send a 1, but the brush sends a 1 initially, and a 3 when it's complete, and yes I am also wondering where the 2 went, but I've never seen it... `v` is values, and that consists of for example `[1,67,["#000000",6,1],[188,81]]`. In this array `[0]` is the tool index, in this case a brush for 1. `[1]` is the stroke index, it increments on every message where `d` is 3 from what I found out. `[2]` is the settings, which boils down to `[color, size, opacity]`. all following parameters are `[x,y]` pairs of coordinates.

Now that the basics are done, here is a list of all the tools and their tool index:

| Index | Name |
|---|---|
| 1    | Brush |
| 2 | Eraser |
| 3 | Line |
| 4 | Box Outline |
| 5 | Circle Outline |
| 6 | Box Fill |
| 7 | Circle Fill |
| 8 | Bucket |

I will not be going into how the eraser, bucket, redo and undo work, but for the others:

The line, box outline, circle outline, box fill and circle fill are all the same, they send a single message with 2 pairs of coordinates, that being the top-left and bottom-right corner, the shape is stretched between those 2 coordinates like the image below

![Circle Coordinates](./assets/images/projects/gartic-artist/circle-coordinates.png)
That image would send `42[2,7,{"t":0,"d":1,"v":[6,1,["#ffffff",7,1],[0,0],[150,100]]}]` to the server

<br><br>

The brush works by first sending a `"d":1` message to the server with it's initial coordinates, followed by partially complete `"d":3` message with all points thus far, followed by another `"d":3` message when you let go, containing all the points. In this whole process, the stroke index does *not* go up, because well... it's the same stroke

Keep in mind all the black dots are coordinates being sent in `[x,y]` pairs, the orange partial message sends all coordinates behind it
![Brush Coordinates](./assets/images/projects/gartic-artist/brush-coordinates.png)
This image would initially send `42[2,7,{"t":0,"d":1,"v":[1,2,["#ffffff",6,1],[0,0]]}]`<br>
Followed by all the partial messages containing only a handful of coordinates<br>
And lastly by `42[2,7,{"t":0,"d":3,"v":[1,2,["#ffffff",6,1],[0,0],[0,1],[1,1],[1,2],[1,3],[2,3],[2,4],[3,5],[3,6],[4,6],[4,7],[5,7],[5,9],...`

This is everything I got to know thus far! Even though is is not *super accurate*, because the final book still has some issues, this should be a very good first step in figuring out how Gartic Phone FULLY works!


# The Done Button

Bit of a side rant, but one of the weirdest bugs was figuring out how Gartic Phone decides when the 'Done' button enables (because my canvas tools don't activate it when used)

Turns out, it’s not based on the canvas at all, it’s triggered internally by React state updates whenever the `data` array of strokes changes, which my tools don't even touch

I even looked into React fiber trees (still no clue though) to spy on props. From which I learned there is just a `disabled` prop, which when put to false enables the done button! In the extension I just enable the button as default


<br><br><br><br><br><br><br><br><br><br><br>
*And was all this worth my time? Probably not... But it was fun nonetheless!*