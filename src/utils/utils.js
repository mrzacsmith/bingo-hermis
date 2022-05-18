export const generateUserCard = () => {
    let temp = [];
    for (let i = 0; i < 25; i++) {
        let cell;
        if (i === 12) {
            cell = 0;
        } else if (i % 5 === 0) {
            cell = 1 + Math.round(14 * Math.random());
            while (temp.indexOf(cell) !== -1) 
                cell = 1 + Math.round(14 * Math.random());
        } else if (i % 5 === 1) {
            cell = 16 + Math.round(14 * Math.random());
            while (temp.indexOf(cell) !== -1) 
                cell = 16 + Math.round(14 * Math.random());
        } else if (i % 5 === 2) {
            cell = 31 + Math.round(14 * Math.random());
            while (temp.indexOf(cell) !== -1) 
                cell = 31 + Math.round(14 * Math.random());
        } else if (i % 5 === 3) {
            cell = 46 + Math.round(14 * Math.random());
            while (temp.indexOf(cell) !== -1) 
                cell = 46 + Math.round(14 * Math.random());
        } else if (i % 5 === 4) {
            cell = 61 + Math.round(14 * Math.random());
            while (temp.indexOf(cell) !== -1) 
                cell = 61 + Math.round(14 * Math.random());
        }
        temp.push(cell);
    }
    return temp;
};
