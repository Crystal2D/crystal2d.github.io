// Dependencies:
//     cordova-plugin-file
//     cordova-plugin-filechooser
//     cordova-plugin-filepath
//     cordova-plugin-android-permissions (only if working outside `Android\data\com.dev.app` folder)

class CordovaFS
{
    static isActive = false;

    static async #ResolveURL (dir)
    {
        dir = dir.replaceAll("\\", "/");

        let done = false;
        let output = null;

        window.resolveLocalFileSystemURL(
            dir,
            dirEntry => {
                done = true;
                output = dirEntry;
            },
            () => done = true
        );

        await CrystalEngine.Wait(() => done);

        return output;
    }

    static async GetFileEntry (dir, filepath, createFile = false)
    {
        if (!this.isActive) return;

        let output = null;
        let done = false;

        if (createFile)
        {
            let dirpath = filepath.replaceAll("\\", "/").split("/");
            dirpath.pop();
            dirpath = dirpath.join("/");

            await this.GetDirectoryEntry(dir, dirpath, true);
        }

        const dirEntry = await this.#ResolveURL(dir);
        dirEntry.getFile(
            filepath,
            { create: createFile, exclusive: false },
            fileEntry => {
                output = fileEntry;
                done = true;
            },
            () => done = true
        );

        await CrystalEngine.Wait(() => done);

        await new Promise(resolve => setTimeout(resolve, 125));

        return output;
    }

    static async ReadFile (dir, filepath)
    {
        if (!this.isActive) return;
        
        const fileEntry = await this.GetFileEntry(dir, filepath);

        let read = false;
        let output = false;

        const reader = new FileReader();

        let onLoad = () => { };

        return {
            text: async () => {
                if (read) return;
                read = true;

                reader.onload = () => {
                    output = reader.result;
                    onLoad();
                };
                fileEntry.file(file => reader.readAsText(file));

                await new Promise(resolve => onLoad = resolve);

                return output;
            },
            json: async () => {
                if (read) return;
                read = true;

                reader.onload = () => {
                    output = JSON.parse(reader.result);
                    onLoad();
                };
                fileEntry.file(file => reader.readAsText(file));

                await new Promise(resolve => onLoad = resolve);

                return output;
            },
            arrayBuffer: async () => {
                if (read) return;
                read = true;

                reader.onload = () => {
                    output = reader.result;
                    onLoad();
                };
                fileEntry.file(file => reader.readAsArrayBuffer(file));

                await new Promise(resolve => onLoad = resolve);

                return output;
            },
            blob: async () => {
                if (read) return;
                read = true;

                reader.onload = () => {
                    output = new Blob([reader.result]);
                    onLoad();
                };
                fileEntry.file(file => reader.readAsArrayBuffer(file));

                await new Promise(resolve => onLoad = resolve);

                return output;
            },
            bytes: async () => {
                if (read) return;
                read = true;

                reader.onload = async () => {
                    output = new Uint8Array(reader.result);
                    onLoad();
                };
                fileEntry.file(file => reader.readAsArrayBuffer(file));

                await new Promise(resolve => onLoad = resolve);

                return output;
            }
        };
    }

    static async WriteFile (dir, filepath, data)
    {
        if (!this.isActive) return;

        const fileEntry = await this.GetFileEntry(dir, filepath, true);

        let done = false

        fileEntry.createWriter(
            writer => {
                writer.write(data);
                done = true
            },
            done = true
        );

        await CrystalEngine.Wait(() => done);
    }

    static async GetEntries (dir, recursive)
    {
        if (!this.isActive) return;

        let done = false;
        let output = [];

        const dirEntry = await this.#ResolveURL(dir);
        dirEntry.createReader().readEntries(
            async entries => {
                output.push(...entries);
                done = true;
            },
            () => done = true
        );

        await CrystalEngine.Wait(() => done);

        if (recursive)
        {
            let doneEntries = 0;
            let childEntries = [];

            for (let i = 0; i < output.length; i++) (async () => {
                if (output[i].isFile)
                {
                    doneEntries++;
                    return;
                }

                childEntries.push(...(await this.GetEntries(`${dir}/${output[i].name}`, true)));
                doneEntries++;
            })();

            await CrystalEngine.Wait(() => doneEntries === output.length);

            output.push(...childEntries);
        }

        return output;
    }

    static async GetDirectoryEntries (dir, recursive)
    {
        if (!this.isActive) return;

        const entries = await this.GetEntries(dir, recursive);

        return entries.filter(item => item.isDirectory);
    }

    static async GetFileEntries (dir, recursive)
    {
        if (!this.isActive) return;

        const entries = await this.GetEntries(dir, recursive);

        return entries.filter(item => item.isFile);
    }

    static async GetDirectoryEntry (dir, dirname, createDir = false)
    {
        if (!this.isActive) return;

        let done = false;
        let output = null;

        if (!createDir)
        {
            const dirEntry = await this.#ResolveURL(dir);
            dirEntry.getDirectory(
                dirname,
                { create: false },
                subdirEntry => {
                    output = subdirEntry;
                    done = true;
                },
                () => done = true
            );

            await CrystalEngine.Wait(() => done);

            return output;
        }

        const dirList = dirname.replaceAll("\\", "/").split("/");
        const currentDir = dirList.shift();

        const dirEntry = await this.#ResolveURL(dir);

        dirEntry.getDirectory(
            currentDir,
            { create: true },
            subdirEntry => {
                output = subdirEntry;
                done = true;
            },
            () => done = true
        );

        await CrystalEngine.Wait(() => done);

        if (dirList.length > 0) return this.GetDirectoryEntry(`${dir}/${currentDir}`, dirList.join("/"), true);

        return output;
    }

    static async SelectFile (type)
    {
        if (!this.isActive) return;

        let output = null;

        if (type == null) fileChooser.open(
            async uri => output = {
                canceled: false,
                path: await this.URIToAbsolute(uri)
            },
            () => output = {
                canceled: true,
                path: null
            }
        );
        else fileChooser.open(
            { mime: type },
            async uri => output = {
                canceled: false,
                path: await this.URIToAbsolute(uri)
            },
            () => output = {
                canceled: true,
                path: null
            }
        );

        await CrystalEngine.Wait(() => output != null);

        return output;
    }

    static async URIToAbsolute (uri)
    {
        if (!this.isActive) return;

        let done = false;
        let output = null;

        window.FilePath.resolveNativePath(
            uri,
            path => {
                output = path;
                done = true;
            },
            () => done = true
        );

        await CrystalEngine.Wait(() => done);

        return output;
    }

    static async DeleteFile (dir, filepath)
    {
        if (!this.isActive) return;

        const fileEntry = await this.GetFileEntry(dir, filepath);

        let done = false;

        fileEntry.remove(
            () => done = true,
            () => done = true
        );

        await CrystalEngine.Wait(() => done);
    }

    static async DeleteDirectory (dir, dirname)
    {
        if (!this.isActive) return;

        const dirEntry = await this.GetDirectoryEntry(dir, dirname);

        let done = false;

        dirEntry.removeRecursively(
            () => done = true,
            () => done = true
        );

        await CrystalEngine.Wait(() => done);
    }

    static async CopyDirectory (fromDir, dirname, toDir, toParentName, newname)
    {
        if (!this.isActive) return;

        const dirEntry = await this.GetDirectoryEntry(fromDir, dirname);
        const parentEntry = await this.GetDirectoryEntry(toDir, toParentName);

        let done = false;

        dirEntry.copyTo(
            parentEntry,
            newname ?? dirname,
            () => done = true,
            () => done = true
        );

        await CrystalEngine.Wait(() => done);
    }

    static async CopyFile (fromDir, filepath, toDir, toParentName, newname)
    {
        if (!this.isActive) return;

        const fileEntry = await this.GetFileEntry(fromDir, filepath);
        const parentEntry = await this.GetDirectoryEntry(toDir, toParentName);

        let done = false;

        fileEntry.copyTo(
            parentEntry,
            newname ?? filepath,
            () => done = true,
            () => done = true
        );

        await CrystalEngine.Wait(() => done);
    }

    static async Rename (dir, filepath, newname)
    {
        if (!this.isActive || filepath === newname) return;

        const dataRequest = await this.ReadFile(dir, filepath);
        const data = await dataRequest.arrayBuffer();
        await this.WriteFile(dir, newname, data);
        await this.DeleteFile(dir, filepath);
    }
}