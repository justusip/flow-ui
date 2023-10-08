class FlowData {
    //I know the grid is going to be 161 x 361 in the end
    //because the output is on a 1-degree grid -180 to 179
    //(extended to 180) longitude and -80 to 80 latitude
    width = dataWidth;
    height = dataHeight;

    outputU = new Float32Array(width * height); //u-component of vector
    outputV = new Float32Array(width * height); //v-component of vector
    outputData = new Uint8Array(width * height * 4); //data for RGBA WebGL texture

    constructor() {
        //code block for encoding vector data in image

        for (let i = 0; i < modeledData.length; i++) {
            //taking advantage of lat and lon being integers to use them as indices to arrays
            const lon = +modeledData[i][0];
            const lat = +modeledData[i][1];
            const lonIdx = lon - minLon;
            const latIdx = lat - minLat;

            outputU[latIdx * width + lonIdx] = +modeledData[i][2];
            outputV[latIdx * width + lonIdx] = +modeledData[i][3];

            //duplicate to help world wrapping across dateline
            if (lon == -180) {
                outputU[latIdx * width + width - 1] = +modeledData[i][2];
                outputV[latIdx * width + width - 1] = +modeledData[i][3];
            }
        }

        for (let i = 0; i < outputU.length; i++) {
            const ptr = i * 4;
            //scale data from 0 to 255 using min/max of -110/110 (min/max derived from known data range)
            outputData[ptr] = Math.floor(255 * (outputU[i] - (-110)) / 220);
            outputData[ptr + 1] = Math.floor(255 * (outputV[i] - (-110)) / 220);
            //make alpha channel 255 to be able to see the image (alpha is not relevant to actual calculations)
            outputData[ptr + 3] = 255;
        }

        return outputData;
    }
}