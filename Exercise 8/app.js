export default function luckyDraw (player) {
    return new Promise((res, rej) => {
        const win = (Math.round(Math.random()));

        process.nextTick(() => {
            if (win) {
                res(`${player} won a prize in the draw!`);
            } else {
                rej(new Error(`${player} lost the draw.`));
            }
        });
    });
}

luckyDraw("Joe")
    .then((result) => {
        console.log(result);
    })
    .catch((error) => console.error(error))

    .then(() => luckyDraw("Caroline"))
    .then((result) => console.log(result))
    .catch((error) => console.error(error))

    .then(() => luckyDraw("Sabrina"))
    .then((result) => console.log(result))
    .catch((error) => console.error(error));