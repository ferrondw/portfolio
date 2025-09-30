---
Master Cappuccino's Café
A merge game where you help master cappuccino by combining cats in his market stall
---

# Jam Results

We won! And not just won, first in every category!

![Jam Results](./assets/images/projects/master-cappuccinos-cafe/score.png)

# Mechanics

When making a chain of 3-5 cats and letting go, they all merge together into the next tier of cat. There are 10 cat tiers, all with unique sprites made by [Annique](https://anniquebebe.artstation.com).

When the market stall overflows (hits the top collider), it's game over. The score is calculated in the following way:

```csharp
private int Score(int kittyTier, int chainLength)
{
    // tier = 1-10 | length = 3-5 | min = 4 | max = 15
    return kittyTier + chainLength;
}
````

And when hovering over another cat while already holding one, they get connected. I'm doing this with DistanceJoints (which are already in the engine, thus perfect for a limited-time event!). This code explains how the cats are connected once you let go:

```csharp
private void ConnectTwoKitties(GameObject kitty1, GameObject kitty2)
{
    if (kitty1 == null || kitty2 == null)
    {
        Debug.LogError("One or both kitties are in the backrooms.");
        return;
    }

    DistanceJoint2D distanceJoint = kitty1.AddComponent<DistanceJoint2D>();
    
    distanceJoint.connectedBody = kitty2.GetComponent<Rigidbody2D>();

    // configure joint settings... thought of instantiating a prefab but this works just fine!
    distanceJoint.autoConfigureDistance = false;
    distanceJoint.maxDistanceOnly = true;
    distanceJoint.enableCollision = false;
    distanceJoint.distance = 0.5f;
}
```

# Art

This is one of the cats that [Annique](https://anniquebebe.artstation.com) made. We talked a bit back and forth, and came to the conclusion that in the theme of a market stall it would be cute to make all the cats food-themed. So this is the highest tier cat: the **Boba Cat**! Wanna see more art? Check out the game on Itch.io!

![Boba Cat](./assets/images/projects/master-cappuccinos-cafe/boba.png)

And this is the background. In Unity the background is set to brown, and the z-layer of the "background" is set higher than other sprites, so it acts more like a foreground. But it looks cute and works like a charm!

![Background](./assets/images/projects/master-cappuccinos-cafe/background.png)