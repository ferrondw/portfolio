---
Waypoint System
A simple visual waypoint system for Unity
---

# Examples

This is an example of a Waypoint on a Bobert (from Project StarFall). This means Bobert knows where it can go.

![Small Patrol Path](./assets/images/projects/waypoint-system/small-patrol-path.png)  

![Big Patrol Path](./assets/images/projects/waypoint-system/big-patrol-path.png)  

# Gizmos

The gizmos are easy to use, consisting of the line itself, position handles and a few buttons to edit the line. When you create a new waypoint it looks like this:

![New Waypoint Gizmo](./assets/images/projects/waypoint-system/gizmo.png)

If you press the gear, more settings will appear.

![Waypoint Gizmo Settings](./assets/images/projects/waypoint-system/gizmo-settings.png)

- The gear toggles the settings on/off.  
- The gray plus sign switches the insert mode on/off.  
- The gray X switches the delete mode on/off.  
- The pink line simplifies the waypoint, removing unnecessary points.  
- The purple line makes the waypoint smoother, although there will be exponentially more points.  
- The green plus sign creates a new point in the waypoint.  

Below you see a waypoint with multiple points, and a custom name. You can always adjust this in the inspector!

![Waypoint with Multiple Points](./assets/images/projects/waypoint-system/multiple-points.png)

# Modes

Then there are also the 2 modes: insert and delete.

By switching on the insert mode (can be done in the inspector and gizmos) there will be blue plus signs between the points in the line. By pressing these plus signs there will be a point where the plus sign is, making it easy to quickly place a point in between.

![Insert Mode](./assets/images/projects/waypoint-system/insert-mode.png)

Then there is also the delete mode. By turning it on, red crosses appear at the points. By pressing this, the point is deleted.

![Delete Mode](./assets/images/projects/waypoint-system/delete-mode.png)

Pressing the pink line removes unnecessary points in the line, while the purple line does the exact opposite: it makes the line smoother by adding more points using Catmull–Rom.

![Simplify and Smooth Options](./assets/images/projects/waypoint-system/simplify-smooth.png)

This is even easier when using the shortcuts! Holding `Left Alt` will enable the delete mode, and `Left Control` will enable the insert mode. This makes creating waypoints EVEN faster!

# 3D

Every example thus far has been in 2D, but this system is fully functional in 3D:

![3D Waypoint](./assets/images/projects/waypoint-system/3d-waypoint.png)

# Inspector

![Waypoint Inspector](./assets/images/projects/waypoint-system/waypoint-inspector.png)

In the inspector you have even more control over your waypoint than in the gizmos. Although the gizmos are useful, the inspector has the ability to change the name, color, and other settings.

# Code

Once you're happy with your waypoint you can quickly use it in another script.  
The code below shows how a script can get the points from the waypoint, and even change them:

```csharp
using UnityEngine;

public class WaypointChanger : MonoBehaviour
{
    [SerializeField] private Waypoint waypoint;

    private void Start()
    {
        waypoint[0] = transform.position;
        waypoint.WaypointName = "This waypoint's name is now this very long string!";
    }
}
```

# Toolbar

Waypoints can also be made using the Toolbar in Unity, as seen below.
This is possible due to Unity's `MenuItem` attribute:

![Waypoint Toolbar](./assets/images/projects/waypoint-system/toolbar.png)

```csharp
public static class WaypointCreateUtility
{
    private const string undoMessage = "Created new waypoint";
    private const string baseName = "New Waypoint";
    private const string lineWaypointName = "New Line Waypoint";
    private const string dotsWaypointName = "New Dots Waypoint";

    [MenuItem("NeoN/Waypoint System/Line Waypoint")]
    public static void CreateLineWaypoint(MenuCommand menuCommand) => CreateWaypoint(lineWaypointName, true);

    [MenuItem("NeoN/Waypoint System/Dots Waypoint")]
    public static void CreateDotsWaypoint(MenuCommand menuCommand) => CreateWaypoint(dotsWaypointName, false);

    private static void CreateWaypoint(string name, bool shouldDrawLines)
    {
        var newWaypoint = ObjectFactory.CreateGameObject(baseName, typeof(Waypoint));

        var lastView = SceneView.lastActiveSceneView;
        newWaypoint.transform.position = lastView ? lastView.pivot : Vector3.zero;

        StageUtility.PlaceGameObjectInCurrentStage(newWaypoint);
        GameObjectUtility.EnsureUniqueNameForSibling(newWaypoint);

        Undo.RegisterCreatedObjectUndo(newWaypoint, undoMessage);
        Selection.activeGameObject = newWaypoint;

        EditorSceneManager.MarkSceneDirty(SceneManager.GetActiveScene());

        ApplySettings(newWaypoint.GetComponent<Waypoint>(), name, shouldDrawLines);
    }

    private static void ApplySettings(Waypoint waypoint, string name, bool shouldDrawLines)
    {
        waypoint.WaypointName = name;
        waypoint.name = name;
        waypoint.ShouldDrawLines = shouldDrawLines;
    }
}
```