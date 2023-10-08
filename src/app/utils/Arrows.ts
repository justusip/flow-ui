const x_y = 2;

function deg2Rad(theta: number) {
    return theta * Math.PI / 180;
}

function rotatePoint(center: number[], coords: number[], theta: number) {
    let n = Math.sqrt(Math.pow(coords[0] - center[0], 2) + Math.pow(coords[1] - center[1], 2));
    let theta1 = Math.atan2(coords[1] - center[1], coords[0] - center[0]);
    let theta2 = theta1 + deg2Rad(theta);

    let lat = center[0] + n * Math.cos(theta2);
    let long = center[1] + n * Math.sin(theta2);

    return [lat, long];
}

function polygonArrowPoints(center: number[], size: number, angleTheta: number) {
    let coords = [
        [center[0] - size, center[1]],
        [center[0] + size, center[1]],
        [center[0], center[1] - size / 2],
        [center[0], center[1] + size / 2],
        [center[0] + size, center[1]]
    ];

    for (let i = 0; i < coords.length; i++) {
        let temp_coords = coords[i];

        let t = Math.abs(Math.sin(deg2Rad(angleTheta)));
        temp_coords[0] = center[0] + (temp_coords[0] - center[0]) * (x_y * t + (1 - t)); // y-axis
        temp_coords[1] = center[1] + (temp_coords[1] - center[1]) / (x_y * t + (1 - t)); // x-axis

        temp_coords = rotatePoint(center, temp_coords, angleTheta);
        coords[i] = temp_coords;
    }

    return coords;
}

export {polygonArrowPoints};