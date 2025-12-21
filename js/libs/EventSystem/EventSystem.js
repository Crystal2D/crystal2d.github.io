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
                // await this.dialogueBox.Type(LocaleManager.Find("EV025"));
                await this.dialogueBox.Type("Carrots.");
                this.dialogueBox.SetFace("yoki", "unsure");
                await this.dialogueBox.Type("They keep on disappearing.");
                await this.dialogueBox.Close();
                break;
            case "EV029":
                this.dialogueBox.SetFace("yoki", "look");
                await this.dialogueBox.Type(LocaleManager.Find("EV029")[0]);
                this.dialogueBox.SetFace("yoki", "smile");
                // this.dialogueBox.SetFace("yoki", "look");
                // await this.dialogueBox.Type(LocaleManager.Find("EV029")[1]);
                await this.dialogueBox.Type("Zera is still here.");
                await this.dialogueBox.Close();
                break;
            case "EV054":
                // this.dialogueBox.SetFace("yoki", "look");
                this.dialogueBox.SetFace("yoki", "sweat drop");
                // await this.dialogueBox.Type(LocaleManager.Find("EV054"));
                await this.dialogueBox.Type("There's a pipe bomb!");
                await this.dialogueBox.Close();
                break;
            
            case "WHAT":
                this.dialogueBox.SetFace("yoki", "sweat drop");
                await this.dialogueBox.Type("Its...\\.\\. locked!?");
                this.dialogueBox.SetFace("yoki", "meditative");
                await this.dialogueBox.Type(".\\|.\\|.");
                this.dialogueBox.SetFace("yoki", "upset");
                await this.dialogueBox.Type("CLAAAAAAAAIIIIIIREEEEEE!!!\\!\nOPEN\\.\\. THE\\.\\. DOOR!!!!");
                await this.dialogueBox.Close();
                break;
        }
    }
}