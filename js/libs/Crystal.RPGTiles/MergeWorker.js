onmessage = async msg => {
    const data = msg.data;

    const res = data.res;
    const canvas = new OffscreenCanvas(
        (data.max.x - data.min.x + 1) * data.gridSize.x * res,
        (data.max.y - data.min.y + 1) * data.gridSize.y * res
    );
    const context = canvas.getContext("2d");

    for (let i = 0; i < data.tiles.length; i++)
    {
        const item = data.tiles[i];

        const sprite = item.sprite;
        const ppu = sprite.texture.pixelPerUnit;
        const rect = sprite.rect;

        const posX = (item.pos.x - data.min.x) * data.gridSize.x;
        const posY = (item.pos.y - data.max.y) * data.gridSize.y;

        const offsetX = (rect.width * 0.5 / ppu) - data.gridSize.x * 0.5;
        const offsetY = (rect.height * 0.5 / ppu) - data.gridSize.y * 0.5;

        const pivotOffsetX = ((sprite.pivot.x * -2) + 1) * (rect.width * 0.5);
        const pivotOffsetY = ((sprite.pivot.y * -2) + 1) * (rect.height * 0.5);
    
        context.imageSmoothingEnabled = false;
        context.drawImage(
            item.bitmap,
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            (posX - offsetX) * res + pivotOffsetX,
            (-posY - offsetY) * res + pivotOffsetY,
            rect.width * res / ppu,
            rect.height * res / ppu
        );
    }

    const blob = await canvas.convertToBlob();
    postMessage(blob);

    canvas.width = 0;
    canvas.height = 0;
    
    context.reset();
};