---
title: Gartic Artist
description: A chrome extension that adds better and native looking tools and utilities to Gartic Phone
hidden: false
tags:
- JavaScript
- CSS
---

# Introduction
What started as a simple idea to make a better looking Gartic Phone extension turned into almost completely reverse-engineering how Gartic Phone works!

Because when playing with friends, I always wonder why all the extensions looked so... 'eh'. Not that the extensions didn't work, far from it. But they all added buttons in places you would least expect it. So I set out to figure out how to not only improve existing features, but also make them look the part


# Palette
Really? 18 colors? What about 66?

The color input is handy, but when drawing quickly, only 18 colors won't cut it.

So not only did I make a custom color palette grid, but also added a color picker (much like the other extensions, only mine has the correct `:hover` and `:active` states like the original tools of Gartic Phone)

![Palette](/assets/images/projects/gartic-artist/palette.png)
![Palette](/assets/images/projects/gartic-artist/color-picker.gif)


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
| 1 | Brush |
| 2 | Eraser |
| 3 | Line |
| 4 | Box Outline |
| 5 | Circle Outline |
| 6 | Box Fill |
| 7 | Circle Fill |
| 8 | Bucket |

I will not be going into how the eraser, bucket, redo and undo work, but for the others:

The line, box outline, circle outline, box fill and circle fill are all the same, they send a single message with 2 pairs of coordinates, that being the top-left and bottom-right corner, the shape is stretched between those 2 coordinates like the image below

![Circle Coordinates](/assets/images/projects/gartic-artist/circle-coordinates.png)
That image would send `42[2,7,{"t":0,"d":1,"v":[6,1,["#ffffff",7,1],[0,0],[150,100]]}]` to the server

<br><br>

The brush works by first sending a `"d":1` message to the server with it's initial coordinates, followed by partially complete `"d":3` message with all points thus far, followed by another `"d":3` message when you let go, containing all the points. In this whole process, the stroke index does *not* go up, because well... it's the same stroke

Keep in mind all the black dots are coordinates being sent in `[x,y]` pairs, the orange partial message sends all coordinates behind it
![Brush Coordinates](/assets/images/projects/gartic-artist/brush-coordinates.png)
This image would initially send `42[2,7,{"t":0,"d":1,"v":[1,2,["#ffffff",6,1],[0,0]]}]`<br>
Followed by all the partial messages containing only a handful of coordinates<br>
And lastly by `42[2,7,{"t":0,"d":3,"v":[1,2,["#ffffff",6,1],[0,0],[0,1],[1,1],[1,2],[1,3],[2,3],[2,4],[3,5],[3,6],[4,6],[4,7],[5,7],[5,9],...`

This is everything I got to know thus far! Even though is is not *super accurate*, because the final book still has some issues, this should be a very good first step in figuring out how Gartic Phone FULLY works!


# The Done Button

Bit of a side rant, but one of the weirdest bugs was figuring out how Gartic Phone decides when the 'Done' button enables (because my canvas tools don't activate it when used)

Turns out, it’s not based on the canvas at all, it’s triggered internally by React state updates whenever the `data` array of strokes changes, which my tools don't even touch

I even looked into React fiber trees (still no clue though) to spy on props. From which I learned there is just a `disabled` prop, which when put to false enables the done button! In the extension I just enable the button as default


<br><br><br><br><br><br><br><br><br><br><br>

# WebSocket Again

I'm currently working on a more complete documentation, all progress and tables will be put here temporarily until i rewrite the complete project for a better and cleaner explanation

## Preset Game Modes

All payloads for preset gamemodes are denoted by `42[2,26,id]`, the table only includes the ID
| Name | ID |
| - | - |
| Normal | 1 |
| Knock-off | 8 |
| Animation | 11 |
| Icebreaker | 9 |
| Exquisite Corpse | 24 |
| Complement | 15 |
| Masterpiece | 20 |
| Story | 17 |
| Missing Piece | 21 |
| Secret | 3 |
| Co-op | 18 |
| Score | 10 |
| Sandwich | 5 |
| Background | 14 |
| Solo | 13 |

## Custom Game Modes

When clicking on the "Custom Settings" tab `42[2,27,2]` will be sent, returning to a preset gamemode will send `42[2,27,1]`.

When changing a setting, `42[2,18,{"name":value}]` will be sent, with `name` being the internal name of the setting, and `value` being it's corresponding value, which from testing is not always in order of the dropdown menu (imagine making it easy huh...)

| Display Name | Internal Name |
| - | - |
| Time | speed |
| Task Flow | first |
| Turns | turns |
| Keep Drawing | keep |
| Scoreboard | score |
| Secrecy | visible |
| Animation | animate |
| Canvas Format | shape |
| Moderation | mod |

Then each setting has a dropdown or toggle with multiple options, each with their own name and internal ID

### Time (speed)
| Name | ID |
| - | - |
| Fast | 3 |
| Normal | 2 |
| Slow | 1 |
| Regressive | 5 |
| Progressive | 8 |
| Dynamic | 4 |
| Infinite | 6 |
| Host's Decision | 7 |
| Faster First Turn | 9 |
| Slower First Turn | 10 |

### Task Flow (first)
| Name | ID |
| - | - |
| Writing, Drawing | 1 |
| Drawing, Writing | 2 |
| Only Drawings | 3 |
| Only Writings | 12 |
| Writing only at the beginning and the end | 4 |
| Writing only at the beginning | 5 |
| Writing only at the end | 6 |
| Single Sentence | 7 |
| Single Drawing | 8 |
| Solo Drawing | 9 |
| Drawings with a background | 10 |
| Drawings with a background, no preview | 11 |

### Turns (turns)
| Name | ID |
| - | - |
| Few | 1 |
| Most | 2 |
| All | 3 |
| All +1 | 12 |
| 200% | 4 |
| 300% | 5 |
| Single Turn | 6 |
| 2 Turns | 10 |
| 3 Turns | 11 |
| 4 Turns | 17 |
| 5 Turns | 7 |
| 6 Turns | 13 |
| 7 Turns | 14 |
| 8 Turns | 15 |
| 9 Turns | 16 |
| 10 Turns | 8 |
| 15 Turns | 18 |
| 20 Turns | 9 |
| 30 Turns | 19 |

### Keep Drawing (keep)
| Name | ID |
| - | - |
| Disabled | 2 |
| All Drawings | 1 |
| Only the previous drawing | 3 |
| Connected by the top | 4 |

### Scoreboard (score)
| Name | ID |
| - | - |
| Off | 2 |
| On | 1 |

### Secrecy (visible)
| Name | ID |
| - | - |
| Off | 1 |
| On | 2 |

### Animation (animate)
| Name | ID |
| - | - |
| Off | 2 |
| On | 1 |

### Canvas Format (shape)
| Name | ID |
| - | - |
| Standard | 1 |
| Photo | 3 |
| Square | 2 |

### Moderation (mod)
| Name | ID |
| - | - |
| Off | 2 |
| On | 1 |

Weirdly, when you turn off moderation, you receieve a `42[2,39,"key"]` payload, with `key` being a randomized 24 character string. I have absolutely no clue as to how it's used in-game, as I never use moderation haha

### Other Lobby Buttons

The invite button, qr code button, and match settings copy button do not send any payloads to the websocket.

Individual Invite sends `42[2,37]`, and receives a `42[2,37,"code"]` with `code` being the invite code. But it's not the code that gets copied to your clipboard, it is the NEXT code you copy. I still have no clue how you get to the first code, but all following codes can be 'predicted' by the code payload.

Max player count is the same as the other settings, but without stupid out of order dropdowns. It sends `42[2,18,{"maxUsers":amount}]` with `amount` simply being the amount of max players in the lobby. The dropdown has options for the following: `4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 30, 40, 50` players.

## Menus

When the host starts the game, it sends `42[2,5]`, and it receives `42[2,5,1]`

When you go back from the lobby to the main screen, you send `42[2,28]` followed by `41` which closes the websocket connection.