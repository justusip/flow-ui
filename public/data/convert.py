import json
import math
from json import JSONEncoder
from pathlib import Path

import netCDF4 as nc
import numpy as np


class NumpyArrayEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return JSONEncoder.default(self, obj)


def vals_avg(vals):
    s = 0
    for v in vals:
        s += v
    avg_sum = s / len(vals)
    return avg_sum


def angles_avg(vals):
    sx = 0
    sy = 0

    for v in vals:
        sx += math.sin(np.deg2rad(v))
        sy += math.cos(np.deg2rad(v))

    sx /= len(vals)
    sy /= len(vals)

    avg_deg = np.rad2deg(math.atan2(sy, sx))
    return avg_deg


def interpolate_zoom(arr, mult, is_dir):
    arr_shape = np.shape(arr)
    arr_mod_shape = [math.ceil(s / mult) for s in arr_shape]

    arr_mod = np.zeros(arr_mod_shape)
    for i in range(arr_mod_shape[0]):
        for j in range(arr_mod_shape[1]):
            val_list = []
            for x in range(mult):
                if i * mult + x < arr_shape[0]:
                    for y in range(mult):
                        if j * mult + y < arr_shape[1]:
                            val_list.append(arr[i * mult + x][j * mult + y])
            if not is_dir:
                arr_mod[i][j] = vals_avg(val_list)
            else:
                arr_mod[i][j] = angles_avg(val_list)

    return arr_mod


def main():
    path_input_dir = Path("input")
    path_input_dir.mkdir(exist_ok=True)

    # Extraction of wave data parameters from .nc file
    path_input = next(path_input_dir.glob("*.nc"), None)
    if path_input is None:
        print("No .nc file found in input directory")
        return

    print(f"Reading wave data from {path_input}...")

    data = nc.Dataset(path_input)
    print(data)
    print(data["x"].shape, data["y"].shape, data["depth"].shape, data["hsign"].shape, data["dir"].shape)

    """
    netCDF input data format:
    
    lng = [
        [114.20, 114.21, 114.22, 114.23],
        [114.20, 114.21, 114.22, 114.23],
        [114.20, 114.21, 114.22, 114.23],
    ]
    lat = [
        [22.20, 22.20, 22.20, 22.20],
        [22.21, 22.21, 22.21, 22.21],
        [22.23, 22.23, 22.23, 22.23],
    ]
    
    In netCDF data, points are stored in both descending longitude and latitude order. This means that the top-left 
    point represents the bottom-left point of a northern hemisphere bounding box. When exporting as GRIB, points 
    should be flipped vertically as it is expected to be stored in descending latitude order (?).
    """

    lng = np.array(data["x"])
    lat = np.array(data["y"])
    depth = np.array(data["depth"][0, :, :])
    height = np.array(data["hsign"][0, :, :])
    angle = np.array(data["dir"][0, :, :])
    vel_x = np.array(data["windu"][0, :, :])
    vel_y = np.array(data["windv"][0, :, :])

    path_output_dir = Path("output")
    path_output_dir.mkdir(exist_ok=True)

    for density_factor in [1, 2, 4, 8]:
        path_output = path_output_dir / f"wave_data_x{density_factor}.json"
        print(f"Writing wave data with density factor {density_factor} as {path_output}...")

        # Data with adjusted density
        lng_adj = interpolate_zoom(lng, density_factor, False)
        lat_adj = interpolate_zoom(lat, density_factor, False)
        height_adj = interpolate_zoom(height, density_factor, False)
        angle_adj = interpolate_zoom(angle, density_factor, True)
        vel_x_adj = interpolate_zoom(vel_x, density_factor, False)
        vel_y_adj = interpolate_zoom(vel_y, density_factor, False)

        h, w = lng_adj.shape  # (height, width)
        print(w, h)

        with open(path_output, "w") as f:
            json.dump(
                {
                    "lng": lng_adj,
                    "lat": lat_adj,
                    "dir": angle_adj,
                    "height": height_adj
                }, f, cls=NumpyArrayEncoder
            )

        header = {
            "dx": (lng_adj[0][-1] - lng_adj[0][0]) / (w - 1),
            "dy": (lat_adj[-1][0] - lat_adj[0][0]) / (h - 1),

            "la1": lat_adj[-1][0],
            "lo1": lng_adj[0][0],
            "la2": lat_adj[0][0],
            "lo2": lng_adj[0][-1],

            "nx": w,
            "ny": h,

            "refTime": "2000-01-01 00:00:00",

            "parameterUnit": "m.s-1",
            "parameterCategory": 2,
        }

        content = [
            {
                "header": {
                    **header,
                    "parameterNumber": 2,
                    "parameterNumberName": "eastward"
                },
                "data": np.flip(vel_x_adj, axis=0).flatten().tolist(),
            },
            {
                "header": {
                    **header,
                    "parameterNumber": 3,
                    "parameterNumberName": "northward"
                },
                "data": np.flip(vel_y_adj, axis=0).flatten().tolist(),
            }
        ]

        path_output_grib = path_output_dir / f"wave_data_x{density_factor}.grib.json"
        with open(path_output_grib, "w") as f:
            json.dump(content, f, cls=NumpyArrayEncoder, indent=4)


if __name__ == "__main__":
    main()
