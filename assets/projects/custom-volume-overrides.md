# Pixel Transition

Every good game needs a fancy transition! So I thought about what kind of transition would be cool, and then the idea struck. What if the whole screen slowly pixelates and then goes to black?

![Pixel Transition Graph](./assets/images/projects/custom-volume-overrides/pixel-transition-graph.png)  
![Pixel Transition](./assets/images/projects/custom-volume-overrides/pixel-transition.gif)

This shader also has a lot of settings you can tweak, here is an example:

![Pixel Transition Inspector](./assets/images/projects/custom-volume-overrides/pixel-transition-inspector.png)  
![Pixel Transition Variant](./assets/images/projects/custom-volume-overrides/pixel-transition-2.gif)

# SuperDot

The idea came from early CRT like screens, showing each dot more pronounced rather than a clean screen. I made this effect mainly by using the Fraction, UV, and Rounded Polygon nodes in Shader Graph.

![SuperDot Graph](./assets/images/projects/custom-volume-overrides/super-dot-graph.png)  
![SuperDot](./assets/images/projects/custom-volume-overrides/super-dot.png)

I actually LOVE this shader! Due to it using the Rounded Polygon and not a circle, you can customise it in loads of ways! Here is an example where the width is 10, and the polygon is square:

![SuperDot Variant](./assets/images/projects/custom-volume-overrides/super-dot-2.png)

# Rain

Because these shaders are made for a game (Project Starfall), it would be fitting to have some weather-related shaders! So this was my attempt at a rain shader, made with mostly scrolling warped noise and adding / subtracting, then lerping that with the UVs to create a screen warp / rain particle effect!

![Rain Graph](./assets/images/projects/custom-volume-overrides/rain-graph.png)  
![Rain](./assets/images/projects/custom-volume-overrides/rain.gif)

# Fisheye

For the fun of it, I also made a really easy fisheye effect! Though the graph is small, the process to get it there was not. I tried lots of things, but in the end it all worked out.

![Fisheye Graph](./assets/images/projects/custom-volume-overrides/fisheye-graph.png)  
![Fisheye](./assets/images/projects/custom-volume-overrides/fisheye.png)
