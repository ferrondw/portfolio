---
Hedge Runner
A game where you are a hedgehog needing to clear randomly generated mazes
---

# Maze Generation

Mazes are generated using the Recursive Backtracking Algorithm, this is an example on how a 4x4 maze would be generated:

![4x4 Maze](./assets/images/projects/hedge-runner/4x4.gif)

This is the only algorithm I use in-game, but the system is set up so you can generate using more algorithms. First of all is the 'contract', an interface that says "If you inherit from me, you MUST have these methods!":

```csharp
public interface IMazeGenerationStrategy
{
    // cell[,] is the maze, the stack is a path to the finish
    (Cell[,], Stack<Vector2Int>) Generate(ushort width, ushort height, int seed = -1);
}
````

Then there is the algorithm itself, which inherits from this `IMazeGenerationStrategy` class:

```csharp
public class RecursiveBacktrackingStrategy : IMazeGenerationStrategy
{
    public (Cell[,], Stack<Vector2Int>) Generate(ushort width, ushort height, int seed = -1)
    {
        var randomInt16 = new System.Random().Next(ushort.MinValue, ushort.MaxValue);
        var randomSeed = seed == -1 ? new System.Random(randomInt16) : new System.Random(seed);

        var maze = new Cell[width, height];
        const Cell initial = Cell.RightWall | Cell.LowerWall;

        for (int i = 0; i < width; i++)
        {
            for (int j = 0; j < height; j++)
            {
                maze[i, j] = initial;
            }
        }

        var positionStack = new Stack<Vector2Int>();
        var parentMap = new Dictionary<Vector2Int, Vector2Int>();
        var position = new Vector2Int { x = 0, y = height - 1 };

        maze[position.x, position.y] |= Cell.Visited;
        positionStack.Push(position);

        while (positionStack.Count > 0)
        {
            var current = positionStack.Pop();
            var neighbours = Utilities.GetUnvisitedNeighbours(current, maze, width, height);

            if (neighbours.Count <= 0) continue;

            positionStack.Push(current);

            var randomNeighbour = neighbours[randomSeed.Next(0, neighbours.Count)];
            var neighbourPosition = randomNeighbour.Position;
            var (breakPos, wall) = randomNeighbour.WallToBreak;

            maze[breakPos.x, breakPos.y] &= ~wall;
            maze[neighbourPosition.x, neighbourPosition.y] |= Cell.Visited;

            parentMap[neighbourPosition] = current;

            positionStack.Push(neighbourPosition);
        }

        var pathStack = new Stack<Vector2Int>();
        var pathPosition = new Vector2Int { x = width - 1, y = 0 };

        while (pathPosition != new Vector2Int { x = 0, y = height - 1 })
        {
            pathStack.Push(pathPosition);
            pathPosition = parentMap[pathPosition];
        }

        pathStack.Push(new Vector2Int { x = 0, y = height - 1 });
        
        return (maze, pathStack);
    }
}
```

Lastly, there is a small static class which can actually generate the mazes, it is used in the `LevelManager` to handle loading/getting mazes:

```csharp
public static class MazeGenerator
{
    public static (Cell[,], Stack<Vector2Int>) Generate(ushort width, ushort height, IMazeGenerationStrategy strategy, int seed = -1)
    {
        return strategy.Generate(width, height, seed);
    }
}
```

Put that all together and you get a beautiful maze in-game!

![Maze](./assets/images/projects/hedge-runner/maze.png)

# Shaders

A good game needs graphics, of course! So, I made a lot of shaders, for example the orbs in the main menu:

![Orb Graph](./assets/images/projects/hedge-runner/orb-graph.png)
![Orb Menu](./assets/images/projects/hedge-runner/orb-menu.gif)

But there is more to a game's graphics then orbs, so here are the trees, they have a vertex position offset and fresnel:

![Tree Graph](./assets/images/projects/hedge-runner/tree-graph.png)
![Tree Game](./assets/images/projects/hedge-runner/tree-game.gif)

# Models

Shaders are cool and all... But why have shaders, if you got nothing to put them on? So, there are also models in the game. Here is the Hedgehog:

![Hedgehog 1](./assets/images/projects/hedge-runner/hedgehog-1.png)
![Hedgehog 2](./assets/images/projects/hedge-runner/hedgehog-2.png)
![Hedgehog Rotate](./assets/images/projects/hedge-runner/hedgehog-2-rotate.gif)

Originally, the idea was to give the hedgehog a walking animation, and maybe even a victory pose. But those ideas were later scrapped, the high poly count is still present in the feet of the hedgehog because of it.

There were also no trees in the game. But I wanted to confine the player without making strict borders, the dense trees around the maze make it clear that you can't go outside them, making for a natural way of conveying that to the player.

![Tree](./assets/images/projects/hedge-runner/tree.png)
![Tree Rotate](./assets/images/projects/hedge-runner/tree-rotate.gif)

# Optimisation

Because Hedge Runner is a mobile game, it needs to be as optimised as it can be! So, for the first time, I dipped my toes into GPU instancing. Everything where there are more then \~10 meshes, I try to GPU instance it. It is currently used in the trees, flowers, and hedge/walls of the maze. Here is a snippet on how this works:

```csharp
float offsetX = Random.Range(-randomTreeOffset, randomTreeOffset);
float offsetZ = Random.Range(-randomTreeOffset, randomTreeOffset);
Vector3 basePosition = new Vector3(x + offsetX, trunkHeight, z + offsetZ);

trunkMatrices.Add(Matrix4x4.TRS(basePosition, Quaternion.identity, Vector3.one * trunkScale));
leavesStaticMatrices.Add(Matrix4x4.TRS(basePosition, Quaternion.identity, Vector3.one * leavesScale));

Vector3 leavesOverlayPosition = basePosition + relativeLeavePosition;
leavesDynamicMatrices.Add(Matrix4x4.TRS(leavesOverlayPosition, Quaternion.identity, Vector3.one * leavesOverlayScale));
```

This snippet is from the `DecorationGenerator`. This specific part calculates all the matrices for the trees. Using `Matrix4x4.TRS` (translation, rotation and scaling), I can easily pass in a Vector3 position, Quaternion rotation and Vector3 scaling, and it will calculate the complex matrix for me. Then in the `Update`, I call `DrawMeshInChunks`, as shown here:

```csharp
private static void DrawMeshInChunks(Mesh mesh, Material material, List<Matrix4x4> matrices, ShadowCastingMode shadowCastingMode)
{
    const int batchSize = 1023;
    for (int i = 0; i < matrices.Count; i += batchSize)
    {
        int count = Mathf.Min(batchSize, matrices.Count - i);
        Graphics.DrawMeshInstanced(
            mesh,
            0,
            material,
            matrices.GetRange(i, count),
            null,
            shadowCastingMode,
            false
        );
    }
}
```

It draws all the trees without instantiating them as a GameObject, but just their Mesh and Material using the given Matrix4x4. This reduces draw calls REAL fast. I went from 1260 draw calls to **108**. This lets the game run at 60FPS consistently on mobile.

# Levels

Levels are generated both infinitely (32bit limit: 4,294,967,295) and randomly, using the Maze Generation explained above. The image below explain how the `LevelManager` works:

![Level Manager Visual Sheet](./assets/images/projects/hedge-runner/level-manager-visual-sheet.png)

The levels use a random seed, but this is stashed and saved using `PlayerPrefs`. This means you can revisit and clear levels with better times, but this feature has not been implemented yet. I implemented it in this way so I could later revisit this feature and maybe implement it.

# Skins

Another game means more room for customisation! And of course, this game is no exception from that. I had lots of fun making cool looking skins, here are some of them:

![Skins](./assets/images/projects/hedge-runner/skins.gif)
![Goldenwind Skin](./assets/images/projects/hedge-runner/skin-goldenwind.gif)
![Cosmos Skin](./assets/images/projects/hedge-runner/skin-cosmos.gif)
![Rainbow Skin](./assets/images/projects/hedge-runner/skin-rainbow.gif)