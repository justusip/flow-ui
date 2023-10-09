"use client";

import L from "leaflet";

import {polygonArrowPoints} from "@/app/utils/Arrows";
import React from "react";

import "leaflet-velocity/dist/leaflet-velocity";
import "leaflet/dist/leaflet.css";
import VelocityLayerColourScale from "@/app/utils/VelocityLayerColourScale";


export default function App() {
    const mMapElement = React.useRef<HTMLDivElement | null>(null);
    const mMap = React.useRef<L.Map | null>(null);
    const mVelLayer = React.useRef<any | null>(null);

    const pinIcon = L.icon({
        iconUrl: "pin.png",
        iconSize: [10, 10],
        iconAnchor: [5, 5],
    });

    let latCentre = 22.21997;
    let lngCentre = 114.227654;

    let arrowSize = 0.00007;
    let radiusSize = 0.00025;

    let defZoom = 13;

    React.useEffect(() => {
        if (!mMapElement.current)
            return;
        if (mMap.current)
            return;
        const tileLayer = L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={access_token}",
            {
                // id: "mapbox/streets-v11",
                id: "mapbox/dark-v11",
                access_token: "pk.eyJ1IjoianVzdHVzaXAiLCJhIjoiY2xuZWEzZWplMGJ6cTJqbWs1b3F4Z2NueSJ9.gVm5YadStrOim4uYIFkU6Q",
            } as L.TileLayerOptions
        );

        // @ts-ignore
        const velLayer = L.velocityLayer({
            displayValues: false,
            colorScale: VelocityLayerColourScale,
            maxVelocity: 12,
            velocityScale: .005
        });
        mVelLayer.current = velLayer;

        const map = L.map(mMapElement.current, {
            center: new L.LatLng(latCentre, lngCentre),
            zoom: defZoom,
            minZoom: 10,
            zoomControl: false,
            layers: [tileLayer, velLayer]
        });
        mMap.current = map;

        let waveArrows: L.Polygon[] = [];

        async function loadWaveData(mapZoomLevel: number) {
            let scaleFactor = 1; // File to load

            switch (Math.min(16, Math.max(13, mapZoomLevel))) { // Clamp map zoom level to 13 - 16
                case 13:
                    scaleFactor = 8;
                    break;
                case 14:
                    scaleFactor = 4;
                    break;
                case 15:
                    scaleFactor = 2;
                    break;
                case 16:
                    scaleFactor = 1;
                    break;
            }

            const dataFileURL = `/data/output/wave_data_x${scaleFactor}.json`;
            console.log(dataFileURL);

            const dataReq = await fetch(dataFileURL);
            const data = await dataReq.json();

            for (let i = 0; i < data.lng.length; i++) {
                for (let j = 0; j < data.lng[0].length; j++) {
                    const lng = data.lng[i][j];
                    const lat = data.lat[i][j];

                    let dir = data.dir[i][j];
                    if (dir == -180.0)
                        continue;

                    const polygon = L.polygon([
                        polygonArrowPoints([lat, lng], arrowSize * scaleFactor, dir) as any
                    ]);
                    waveArrows.push(polygon);
                    polygon.addTo(map);
                }
            }
        }

        // loadWaveData(13);

        map.on("movestart", e => {
            velLayer._clearWind();
        });
        map.on("moveend", e => {
            velLayer._clearWind();
            // map.addLayer(velLayer);
        });
        map.on("zoomstart", e => {
            velLayer._clearWind();
        });
        map.on("zoomend", e => {
            velLayer._clearWind();
            const curZoomLevel = map.getZoom();
        });

        let vertices: L.Marker[] = [];
        let edges: L.Polyline[] = [];
        map.on("click", e => {
            if (vertices.length == 2) {
                for (const v of vertices)
                    v.remove();
                vertices = [];
                for (const e of edges)
                    e.remove();
                edges = [];
            }

            const vertex = new L.Marker(e.latlng, {icon: pinIcon}).addTo(map);
            vertices.push(vertex);

            if (vertices.length > 1) {
                const edge = L.polyline(
                    vertices.map(pt => pt.getLatLng()),
                    {color: "#fff", weight: 1}
                ).addTo(map);
                edges.push(edge);
            }
        });

        loadData();
    }, [mMapElement.current]);

    const loadData = async () => {
        const dataRes = await fetch("/data/output/wave_data_x1.grib.json");
        const data = await dataRes.json();

        const dataBounds: L.LatLngBoundsExpression = new L.LatLngBounds(
            [
                data[0].header.la1,
                data[0].header.lo1,
            ],
            [
                data[0].header.la2,
                data[0].header.lo2
            ]
        );
        const mapBorder = L.rectangle(dataBounds.pad(.01), {color: "#777", fillOpacity: 0, weight: 1});
        mMap.current.addLayer(mapBorder);

        mMap.current.fitBounds(dataBounds.pad(.05));
        mMap.current.setMaxBounds(dataBounds.pad(.1));

        mVelLayer.current.setData(data);
    };


    return <div className={"w-screen h-screen"}>
        {/*<div className={"absolute z-50 w-64 h-full right-0 p-4 shadow bg-neutral-800 text-white text-sm"}>*/}
        {/*    <div>Path Analysis</div>*/}
        {/*</div>*/}
        <div className={"absolute z-0 inset-0 w-screen h-screen"} ref={mMapElement}/>
    </div>;
};