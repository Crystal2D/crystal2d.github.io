class EventSystem
{
    static dialogueBox = null;
    static dialogueChoiceBox = null;

    static async Run (id)
    {
        switch (id)
        {
            case "hintbird": {
                GameObject.Find("char_hintbird").GetComponent(RPGMovement).LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[2], true);
                
                const choice = await this.DialogueChoice([
                    LocaleManager.Find(`${id}_choices`)[0],
                    LocaleManager.Find(`${id}_choices`)[1]
                ], 1);

                if (choice === 1);
                else
                {
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_zera`)[0]);
                    await this.dialogueBox.Type(LocaleManager.Find(`${id}_zera`)[1]);
                }

                await this.dialogueBox.Close();
                } break;

            // yokihouse
            case "yolkhouse_mail":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "yolkhouse_veggie":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "yolkhouse_well":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                await this.dialogueBox.Close();
                break;
            case "yolkhouse_zera":
                GameObject.Find("char_zera").GetComponent(RPGMovement).LookAtChar(Player.instance);

                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("zera", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                await this.dialogueBox.Close();
                break;

            // forest_barrier
            case "aimmy_mail":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "forestbarrier_fox1": {
                const fox = GameObject.Find("char_fox1").GetComponent(RPGMovement);
                
                fox.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
                } break;
            case "forestbarrier_fox2":
                GameObject.Find("char_fox2").GetComponent(RPGMovement).LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "forestbarrier_squirrel1": {
                const squirrel = GameObject.Find("char_squirrel1").GetComponent(RPGMovement);
                const randMove = squirrel.GetComponent(RandomMove);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                squirrel.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();
                randMove.enabled = true;
                randMove.ResetTime();
                } break;
            case "forestbarrier_squirrel2":
                GameObject.Find("char_squirrel2").GetComponent(RPGMovement).LookAtChar(Player.instance);

                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
            case "forestbarrier_squirrel3": {
                const squirrel = GameObject.Find("char_squirrel3").GetComponent(RPGMovement);
                const randMove = squirrel.GetComponent(RandomMove);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                squirrel.LookAt(Vector2.left);
                await this.Timer(1/30);
                squirrel.LookAt(Vector2.up);
                await this.Timer(1/30);
                squirrel.LookAt(Vector2.right);
                await this.Timer(1/30);
                squirrel.LookAt(Vector2.down);
                await this.Timer(1/30);
                squirrel.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await squirrel.Jump();
                randMove.enabled = true;
                randMove.ResetTime();
                } break;
            case "forestbarrier_deer": {
                const deer = GameObject.Find("char_deer").GetComponent(RPGMovement);

                deer.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await deer.Jump();
                } break;
            case "forestbarrier_bird": {
                const bird = GameObject.Find("char_bird").GetComponent(RPGMovement);
                const randMove = bird.GetComponent(RandomMove);

                randMove.enabled = false;
                await this.WaitFrameEnd();
                const lookingAt = bird.lookingAt;
                bird.LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();

                bird.LookAt(lookingAt);
                randMove.enabled = true;
                randMove.ResetTime();
                } break;
        }
    }

    static async DialogueChoice (choices, nahChoice)
    {
        this.dialogueChoiceBox.transform.parent = GameObject.Find("camera")?.transform;
        this.dialogueChoiceBox.Clear();
        this.dialogueChoiceBox.nahChoice = nahChoice;

        let output = 0;
        let doneCall = () => { };
        
        for (let i = 0; i < choices.length; i++) this.dialogueChoiceBox.AddChoice(choices[i], () => {
            output = i;
            doneCall();
        });

        await CrystalEngine.Wait(() => this.dialogueChoiceBox.setDimensions);

        this.dialogueChoiceBox.transform.localPosition = new Vector2(
            0.5 * (this.dialogueBox.spriteRenderer.size.x - this.dialogueChoiceBox.spriteRenderer.size.x),
            -4.5 + this.dialogueChoiceBox.spriteRenderer.size.y * 0.5 + this.dialogueBox.spriteRenderer.size.y
        );

        this.dialogueChoiceBox.Open();

        await new Promise(resolve => doneCall = resolve);

        this.dialogueChoiceBox.Close();

        return output;
    }

    static async Timer (duration)
    {
        if (duration < Time.deltaTime) return;

        let time = 0;
        let endCallback = () => { };

        const updateCallback = () => {
            time += Time.deltaTime;

            if (time < duration) return;

            PlayerLoop.onAfterUpdate.Remove(updateCallback);
            endCallback();
        };
        PlayerLoop.onAfterUpdate.Add(updateCallback);

        await new Promise(resolve => endCallback = resolve);
    }

    static async WaitFrameEnd ()
    {
        await new Promise(resolve => {
            const callback = () => {
                PlayerLoop.onFrameEnd.Remove(callback);
                resolve();
            };
            PlayerLoop.onFrameEnd.Add(callback);
        });
    }
}