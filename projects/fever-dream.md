---
Fever Dream
A platformer game where you can't jump
---

# Mechanic Handler

Mechanics are all based on one base class, and a script that handles trigger collisions with a mechanic

```csharp
public class BaseMechanic : MonoBehaviour
{
    // Collision checks do nothing if not overridden (e.g. Lava only needs Enter, while Black Hole needs all 3).
    public virtual void HandleTriggerEnter(Collider2D other){}

    public virtual void HandleTriggerStay(Collider2D other){}

    public virtual void HandleTriggerExit(Collider2D other){}
}
````

```csharp
public class MechanicChecker : MonoBehaviour
{    
    private Collider2D _collider;
    private void Start() => _collider = GetComponent<Collider2D>();
    
    private void OnTriggerEnter2D(Collider2D collision)
    {
        BaseMechanic baseMechanic = collision.gameObject.GetComponent<BaseMechanic>();
        baseMechanic?.HandleTriggerEnter(_collider);
    }
    
    private void OnTriggerStay2D(Collider2D collision)
    {
        BaseMechanic baseMechanic = collision.gameObject.GetComponent<BaseMechanic>();
        baseMechanic?.HandleTriggerStay(_collider);
    }
    
    private void OnTriggerExit2D(Collider2D collision)
    {
        BaseMechanic baseMechanic = collision.gameObject.GetComponent<BaseMechanic>();
        baseMechanic?.HandleTriggerExit(_collider);
    }
}
```

For example, here are the Key, Lava and Jump Pad mechanic:

```csharp
public class Key : BaseMechanic
{
    public GameObject objectToToggleOnHit;
        
    private void Start()
    {
        RecursiveKeyAnimation();
    }

    private void RecursiveKeyAnimation()
    {
        transform.DOMoveY(transform.position.y + 0.3f, 1).SetEase(Ease.InOutSine).OnComplete(() =>
        {
            transform.DOMoveY(transform.position.y - 0.3f, 1).SetEase(Ease.InOutSine).OnComplete(RecursiveKeyAnimation);
        });
    }

    public override void HandleTriggerEnter(Collider2D other)
    {
        objectToToggleOnHit.SetActive(!objectToToggleOnHit.activeSelf);
        Destroy(gameObject);
    }
}
```

![Key Mechanic](./assets/images/projects/fever-dream/key.png)

```csharp
public class Lava : BaseMechanic
{
    public override void HandleTriggerEnter(Collider2D other)
    {
        LevelManager.Instance.RestartLevel();
    }
}
```

![Lava Mechanic](./assets/images/projects/fever-dream/lava.png)

```csharp
public class JumpPad : BaseMechanic
{
    [SerializeField] private float JumpPadStrength;

    private bool isAnimating = false;
    private Vector3 transformUp;

    private void Start() => transformUp = transform.up;

    public override void HandleTriggerEnter(Collider2D other)
    {
        other.GetComponent<PlayerMovement>().Rigidbody.velocity = new Vector2(other.GetComponent<PlayerMovement>().Rigidbody.velocity.x, JumpPadStrength) * transform.up;
            
        if (isAnimating) return;
        
        isAnimating = true;
        transform.DOMove(transform.position + transformUp * 0.2f, 0.25f).OnComplete(() =>
        {
            transform.DOMove(transform.position - transformUp * 0.2f, 0.4f)
            .OnComplete(() => { isAnimating = false; });
        });
    }
}
```

![Jump Pad Mechanic](./assets/images/projects/fever-dream/jump-pad.png)

# Player Movement

Even though the player is a simple rectangle, it needs to keep track of a lot of things, such as which way it moves:

```csharp
private MovementState movementState { get; set; }

public enum MovementState
{
    Idle,
    Left,
    Right
}
```

The player also manages how loud the wind sound effect needs to be

```csharp
public void HandleWindVolume()
{
    if (player.CanMove)
    {
        RotationSound.volume = Mathf.Lerp(RotationSound.volume,
            (Mathf.Abs(player.Rigidbody.angularVelocity) / 1700) * AudioSettings.sfxVolume * 0.5f,
            1.3f * Time.deltaTime);
    }
}
```

After some more code the player actually moves...

```csharp
private void Update()
{
    if (!CanMove)
    {
        playerInput.ChangeMovementState(0);
        Rigidbody.ResetVelocity();
        Rigidbody.ResetAngularVelocity();
        playerWindSFX.RotationSound.volume = Mathf.Lerp(playerWindSFX.RotationSound.volume, 0, 0.5f);

        return;
    }
    
    playerWindSFX.HandleWindVolume();
    
    if (ControlSchemeHandler.UsingFullScreenControlScheme)
    {
        playerInput.FullscreenInput();
        return;
    }
    
    playerInput.ButtonInput();
}
```

# Customisation

I LOVE customisation in games, so I'm not one to leave it out. Fever Dream has customisable skins, themes, trails, backgrounds and music. Here is an example of some skins:

![Skin Example](./assets/images/projects/fever-dream/skins-inspector.png)
![Skins Gif](./assets/images/projects/fever-dream/skins.gif)

# Level Handling

Levels are loaded while the transition animation is playing in the background, this is a snippet of how the level handling works:

![Level Handling](./assets/images/projects/fever-dream/levels.png)

Each level has it's own script

```csharp
public class Level : MonoBehaviour
{
    public string levelName;
    public AudioClip audioClip;
    public Vector2 spawnPosition;
}
```

Those are used in LevelManager (this is the method 'LoadLevel(int levelID, bool doFadeIn)')

```csharp
for (int i = 0; i < levelParent.childCount; i++)
{
    levelParent.GetChild(i).gameObject.SetActive(i == levelID);
}

ResetPlayer();
```

```csharp
public void ResetPlayer()
{
    playerMovement.isGravityInversed = false;

    GameObject player = playerMovement.gameObject;
    player.transform.position = levelParent.transform.GetChild(StaticData.CurrentLevel).GetComponent<Level>().spawnPosition;
    player.transform.rotation = Quaternion.identity;

    Rigidbody2D rb = playerMovement.Rigidbody;
    rb.position = startPosition;
    rb.angularVelocity = 0;
    rb.gravityScale = 0.5f;
    rb.velocity = Vector2.zero;
}
```

# Level Sketches

Level design is also important for a platformer! So I made some sketches to plan out level creation in the editor beforehand

![Level Sketch 1](./assets/images/projects/fever-dream/level-sketch-1.png)
![Level Sketch 2](./assets/images/projects/fever-dream/level-sketch-2.png)
![Level Sketch 3](./assets/images/projects/fever-dream/level-sketch-3.png)