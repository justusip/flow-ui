const datapoints = 15;
const sectionLen = 10;
const dp = 2;

function lineHeight(dict: any, coord1: number[], coord2: number[], datapoints: number) {
    let heightList = [];
    if (datapoints == 0) {
        datapoints = Math.floor(Math.sqrt(
            Math.pow(coord2[0] - coord1[0], 2) + Math.pow(coord2[1] - coord1[1], 2)
        )) + 2;
    }

    const xlen = dict.x[0].length;
    const ylen = dict.x.length;

    // let xInt = 0;
    // for (let i=0; i<xlen-1; i++) {
    //   xInt += dict.x[0][i+1] - dict.x[0][i];
    // }
    // xInt /= xlen - 1;

    const frx = (coord1[1] - dict.x[0][0]) / (dict.x[ylen - 1][xlen - 1] - dict.x[0][0]) * (xlen - 1);
    const fry = (coord1[0] - dict.y[0][0]) / (dict.y[ylen - 1][xlen - 1] - dict.y[0][0]) * (ylen - 1);
    const lrx = (coord2[1] - dict.x[0][0]) / (dict.x[ylen - 1][xlen - 1] - dict.x[0][0]) * (xlen - 1);
    const lry = (coord2[0] - dict.y[0][0]) / (dict.y[ylen - 1][xlen - 1] - dict.y[0][0]) * (ylen - 1);

    for (let i = 0; i <= datapoints - 1; i++) {
        const xc = Math.abs((frx * (datapoints - 1 - i) + lrx * i) / (datapoints - 1));
        const yc = Math.abs((fry * (datapoints - 1 - i) + lry * i) / (datapoints - 1));
        const lu = [Math.floor(xc), Math.floor(yc)];
        const ld = [Math.floor(xc), Math.ceil(yc)];
        const ru = [Math.ceil(xc), Math.floor(yc)];
        const rd = [Math.ceil(xc), Math.ceil(yc)];
        const ug = yc - lu[1];
        const lg = xc - lu[0];

        console.log(coord1[0]);

        const wh = dict.waveHeight[lu[1]][lu[0]] * (1 - ug) * (1 - lg) +
            dict.waveHeight[ld[1]][ld[0]] * ug * (1 - lg) +
            dict.waveHeight[ru[1]][ru[0]] * (1 - ug) * lg +
            dict.waveHeight[rd[1]][rd[0]] * ug * lg;
        heightList.push(wh);
    }

    return (heightList);
}

function getCrossSection(dict: any, coord1: number[], coord2: number[]) {
    let lineHeightData = lineHeight(dict, coord1, coord2, datapoints);
    let dataPos = [];
    var dataLen = lineHeightData.length;
    var inc = sectionLen / (dataLen - 1);
    var xc = 0;
    for (let i = 0; i < dataLen; i++) {
        dataPos.push(Math.round((xc + Number.EPSILON) * Math.pow(10, dp)) / Math.pow(10, dp));
        if (i < dataLen - 1) xc += inc;
    }

    let crossSection = {
        "data": lineHeightData,
        "pos": dataPos
    };

    return crossSection;
}

// console.log(lineHeightdata);