class EventSystem
{
    static dialogueBox = null;

    static async Run (id)
    {
        switch (id)
        {
            case "EV024":
                // this.dialogueBox.SetFace("yoki", "neutral");
                await this.dialogueBox.Type(LocaleManager.Find("EV024"));
                break;
        }
    }
}