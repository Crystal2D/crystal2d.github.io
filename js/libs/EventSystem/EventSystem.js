class EventSystem
{
    static dialogueBox = null;

    static async Run (id)
    {
        switch (id)
        {
            case "EV024":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find("EV024"));
                await this.dialogueBox.Close();
                break;
            case "EV025":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find("EV025"));
                await this.dialogueBox.Close();
                break;
            case "EV029":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find("EV029")[0]);
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find("EV029")[1]);
                await this.dialogueBox.Close();
                break;
            case "EV054":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find("EV054"));
                await this.dialogueBox.Close();
                break;
            case "Zera":
                const zera = GameObject.Find("char_zera").GetComponent("RPGMovement");
                zera.LookAt(Vector2.Subtract(Player.instance.gridPos, zera.gridPos));

                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find("Zera")[0]);
                this.dialogueBox.SetFace("zera", "look");
                await this.dialogueBox.Type(LocaleManager.Find("Zera")[1]);
                this.dialogueBox.SetFace("yoki", "annoyed");
                await this.dialogueBox.Type(LocaleManager.Find("Zera")[2]);
                await this.dialogueBox.Close();
                break;
        }
    }
}