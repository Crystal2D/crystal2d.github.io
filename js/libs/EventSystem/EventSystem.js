class EventSystem
{
    static dialogueBox = null;

    static async Run (id)
    {
        switch (id)
        {
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
                GameObject.Find("char_zera").GetComponent("RPGMovement").LookAtChar(Player.instance);

                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                this.dialogueBox.SetFace("zera", "look");
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find(id)[2]);
                await this.dialogueBox.Close();
                break;
            case "yolkhouse_bird":
                GameObject.Find("char_bird").GetComponent("RPGMovement").LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id)[0]);
                await this.dialogueBox.Type(LocaleManager.Find(id)[1]);
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
                const fox = GameObject.Find("char_fox1").GetComponent("RPGMovement");
                
                fox.LookAtChar(Player.instance);

                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
                AudioManager.instance.PlaySE("jump", 0.9, 1.5);
                await fox.Jump();
                } break;
            case "forestbarrier_fox2":
                GameObject.Find("char_fox2").GetComponent("RPGMovement").LookAtChar(Player.instance);

                await this.dialogueBox.Type(LocaleManager.Find(id));
                await this.dialogueBox.Close();
                break;
        }
    }
}