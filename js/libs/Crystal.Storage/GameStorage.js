class GameStorage
{
    // 0: Default
    // 1: Electron
    // 2: Cordova
    static #platform = 0;

    static #path = null;

    static get isActive ()
    {
        return this.#platform > 0;
    }

    static get appDir ()
    {
        return this.#path;
    }

    static async Init ()
    {
        if (Application.isInElectron)
        {
            this.#platform = 1;

            this.#path = `${(await ipcRenderer.invoke("GetPath", "appData"))}\\User Data`;

            NodeFS = require("fs/promises");
            NodeSyncFS = require("fs");

            if (!NodeSyncFS.existsSync(this.#path)) await NodeFS.mkdir(this.#path, { recursive : true });
        }
        else if (Application.isInCordova && cordova.file != null && fileChooser != null && window.FilePath != null)
        {
            this.#platform = 2;
            CordovaFS.isActive = true;

            if (cordova.plugins?.permissions != null)
            {
                let permsDone = false;

                const permissions = cordova.plugins.permissions;
                permissions.requestPermissions(
                    [ permissions.READ_EXTERNAL_STORAGE ],
                    () => permsDone = true,
                    () => permsDone = true
                );

                await CrystalEngine.Wait(() => permsDone);
            }

            this.#path = cordova.file.externalDataDirectory.slice(0, -1);
        }
    }

    static async ReadFile (src)
    {
        if (this.#platform === 1) return NodeFS.readFile(`${this.#path}\\${src}`, "utf8");
        else if (this.#platform === 2)
        {
            const file = await CordovaFS.ReadFile(this.#path, src);
            return file.text();
        }
    }

    static async WriteFile (src, data)
    {
        if (this.#platform === 1) await NodeFS.writeFile(`${this.#path}\\${src}`, data);
        else if (this.#platform === 2) await CordovaFS.WriteFile(this.#path, src, data);
    }

    static async MakeDir (path)
    {
        if (this.#platform === 1 && !NodeSyncFS.existsSync(`${this.#path}\\${path}`)) await NodeFS.mkdir(`${this.#path}\\${path}`, { recursive : true });
        else if (this.#platform === 2) await CordovaFS.GetDirectoryEntry(this.#path, path, true);
    }

    static async DeleteFile (src)
    {
        if (this.#platform === 1) await NodeFS.unlink(`${this.#path}\\${src}`);
        else if (this.#platform === 2) await CordovaFS.DeleteFile(this.#path, src);
    }

    static async DeleteDir (path)
    {
        if (this.#platform === 1) await NodeFS.rm(`${this.#path}\\${path}`);
        else if (this.#platform === 2) await CordovaFS.DeleteDirectory(this.#path, path);
    }

    static async GetFiles (path, recursive)
    {
        if (this.#platform === 1)
        {
            const entries = await FS.readdir(`${this.#path}\\${path}`, { recursive : recursive });
            let output = [];

            for (let i = 0; i < entries.length; i++)
            {
                if (!(await FS.stat(`${this.#path}\\${path}\\${entries[i]}`)).isDirectory()) output.push(entries[i]);
            }

            return output;
        }
        else if (this.#platform === 2)
        {
            const entries = await CordovaFS.GetFileEntries(`${this.#path}\\${path}`, recursive);
            return entries.map(item => item.fullPath.substring(1));
        }
    }

    static async GetDirs (path, recursive)
    {
        if (this.#platform === 1)
        {
            const entries = await FS.readdir(`${this.#path}\\${path}`, { recursive : recursive });
            let output = [];

            for (let i = 0; i < entries.length; i++)
            {
                if ((await FS.stat(`${this.#path}\\${path}\\${entries[i]}`)).isDirectory()) output.push(entries[i]);
            }

            return output;
        }
        else if (this.#platform === 2)
        {
            const entries = await CordovaFS.GetDirectoryEntries(`${this.#path}\\${path}`, recursive);
            return entries.map(item => item.fullPath.substring(1));
        }
    }
}

GameStorage.Init();