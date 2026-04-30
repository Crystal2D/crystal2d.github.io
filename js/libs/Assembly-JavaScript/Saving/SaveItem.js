class SaveItem extends GameBehavior
{
    #textFile = null;
    #textTitle = null;
    #textTime = null;
    #party = [];

    Awake ()
    {
        this.#textFile = this.transform.Find("save_text_file").GetComponent(Text);
        this.#textTitle = this.transform.Find("save_text_title").GetComponent(Text);
        this.#textTime = this.transform.Find("save_text_time").GetComponent(Text);

        this.#party = [
            this.transform.Find("save_char_0").GetComponent(SpriteLibrary),
            this.transform.Find("save_char_1").GetComponent(SpriteLibrary),
            this.transform.Find("save_char_2").GetComponent(SpriteLibrary),
            this.transform.Find("save_char_3").GetComponent(SpriteLibrary)
        ];
    }

    Set (index)
    {
        const data = RPGSave.global[index];

        this.#textFile.text = `File ${index + 1}`;
        this.#textFile.color.a = data == null ? 0.63 : 1;
        
        this.#textTitle.text = data == null ? "" : data.title;

        if (data != null)
        {
            const padZero = (number, length) => {
                let string = `${number}`;
                while (string.length < length) { string = "0" + string; }
                return string;
            };

            const hr = padZero(Math.floor(data.time / 60 / 60), 2);
            const min = padZero(Math.floor(data.time / 60) % 60, 2);
            const sec = padZero(Math.floor(data.time) % 60, 2);

            this.#textTime.text = `${hr}:${min}:${sec}`;
        }
        else this.#textTime.text = "";

        for (let i = 0; i < 4; i++)
        {
            const noChar = data?.party[i] == null;

            this.#party[i].gameObject.SetActive(!noChar);

            if (noChar) continue;

            this.#party[i].asset = Resources.Find(`spritelibs/chars/${data?.party[i]}`);
        }
    }
}