class LocaleManager
{
    static #lang = null;
    static #data = null;

    static get currentLanguange ()
    {
        return this.#lang;
    }

    static async Set (lang)
    {
        this.#lang = lang;

        const langRequest = await CrystalEngine.FetchFile(`data/locales/${lang}.json`);
        const langData = await langRequest.json();

        this.#data = new Map(Object.entries(langData));
    }

    static Find (key)
    {
        return this.#data.get(key);
    }
}