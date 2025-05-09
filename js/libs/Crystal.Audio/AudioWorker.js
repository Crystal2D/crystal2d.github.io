let deltaTime = 0;
let time = 0;

onmessage = () => {
    deltaTime = (1e-3 * performance.now()) - time;
    time += deltaTime;

    postMessage({
        time: time,
        deltaTime: deltaTime
    });
};