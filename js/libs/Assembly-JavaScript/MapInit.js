class MapInit extends GameBehavior
{
    static switchCall = () => {
        EventSystem.onBeforeUpdate.RemoveAll();
        EventSystem.onUpdate.RemoveAll();
    };

    #inited = false;

    Awake ()
    {
        Resources.DontDestroyOnLoad(
            "anims/entity",
            "anims/entity_ctrl",
            "anims/entity_reset",
            "sprites/chars/butterfly",
            "spritelibs/chars/butterfly",
            "sprites/entities/sparkle",
            "spritelibs/entities/sparkle"
        );
    }

    async Update ()
    {
        if (this.#inited) return;

        this.#inited = true;

        await Party.Load();

        let save = null;
        let noSave = true;
        
        if (RPGSave.loading != null)
        {
            const loadedSave = await RPGSave.Load(RPGSave.loading);

            if (loadedSave != null)
            {
                save = loadedSave;
                noSave = false;
            }
        }

        if (noSave)
        {
            const blankChar = {
                name: null,
                pos: { x: 2, y: -3 },
                dir: { x: 0, y: -1 },
                moves: []
            };

            save = {
                time: 0,
                scene: 4,
                // scene: 16,
                // scene: 22,
                party: [
                    {
                        name: "yoki",
                        pos: {
                            x: 2, y: -3,
                            // x: -8, y: -3
                        },
                        dir: { x: 0, y: -1 }
                    },
                    blankChar,
                    blankChar,
                    blankChar
                ],
                bgm: {
                    name: "forest",
                    volume: 0.2,
                    pitch: 1
                },
                switches: [],
                variables: [],
                chars: [],
                eventAutostarts: []
            };

            for (let i = 0; i < EventSystem.switchCount; i++) save.switches.push(false);
            for (let i = 0; i < EventSystem.variableCount; i++) save.variables.push(0);
        }

        Loader.Ready(save.scene);
        if (save.bgm != null) await Resources.Load(`audio/bgm/${save.bgm.name}`);

        RPGSave.saveTime = save.time;

        await Party.LoadData(save.party);

        EventSystem.LoadSwitches(save.switches);
        EventSystem.LoadVariables(save.variables);

        Player.instance.LookAt(new Vector2(save.party[0].dir.x, save.party[0].dir.y));
        const transfer = new MapTransfer();
        transfer.pos = new Vector2(save.party[0].pos.x, save.party[0].pos.y);
        MapTransfer.last = transfer;

        Loader.onSwitchStart.Add(MapInit.switchCall);

        const switchingCall = () => {
            Loader.onSwitching.Remove(switchingCall);
            Transitioner.instance.SetFadeIn();
        };
        Loader.onSwitching.Add(switchingCall);

        const switchCall = () => {
            Loader.onSwitchEnd.Remove(switchCall);

            Transitioner.instance.SetFadeIn();

            for (let i = 0; i < save.eventAutostarts.length; i++)
            {
                const data = save.eventAutostarts[i];
                const EA = GameObject.Find(data.name, true)?.GetComponents(EventAutostart)
                                                           ?.find(item => item.event === data.event);

                if (EA == null) continue;

                EA.gameObject.SetActive(data.active);
                EA.done = data.done;
            }

            for (let i = 0; i < save.chars.length; i++)
            {
                const data = save.chars[i];
                const char = RPGMovement.FindChar(data.name, true);

                if (char == null) continue;

                char.gameObject.SetActive(true);

                char.TP(new Vector2(data.pos.x, data.pos.y));
                char.LookAt(new Vector2(data.dir.x, data.dir.y));
                char.lockLook = data.lockLook;
                char.charCollision = data.charCollision;
                char.animateWalk = data.animateWalk;
                char.animateIdle = data.animateIdle;
            }

            RPGSave.Retime();
            RPGSave.loading = null;

            if (save.bgm != null) AudioManager.instance.PlayBGM(save.bgm.name, save.bgm.volume, save.bgm.pitch);

            Transitioner.instance.FadeIn(() => Player.instance.avoidInputs = false);
        };
        Loader.onSwitchEnd.Add(switchCall);

        Loader.Switch(save.scene);
    }
}