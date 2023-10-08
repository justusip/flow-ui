"use client";

import "leaflet/dist/leaflet.css";

import L, {LatLngBoundsExpression, TileLayerOptions} from "leaflet";
import "leaflet-velocity/dist/leaflet-velocity";

import React, {useEffect, useRef, useState} from "react";
import {polygonArrowPoints} from "@/app/utils/Arrows";


export default function Page() {
    const mapContainer = useRef<HTMLDivElement | null>(null);

    let latCentre = 22.21997;
    let lngCentre = 114.227654;

    let arrowSize = 0.00007;
    let radiusSize = 0.00025;

    let defZoom = 13;

    useEffect(() => {
        if (!mapContainer.current)
            return;
        onLoad();
    }, [mapContainer.current]);
    const onLoad = async () => {
        const tiles = L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={access_token}",
            {
                // id: "mapbox/streets-v11",
                id: "mapbox/dark-v11",
                access_token: "pk.eyJ1IjoianVzdHVzaXAiLCJhIjoiY2xuZWEzZWplMGJ6cTJqbWs1b3F4Z2NueSJ9.gVm5YadStrOim4uYIFkU6Q",
            }
        );

        const velocityDataRes = await fetch("/data/output/wave_data_x1.grib.json");
        const velocityData = await velocityDataRes.json();

        // @ts-ignore
        const velocityLayer = L.velocityLayer({
            displayValues: false,
            data: velocityData,
            colorScale: [
                "rgb(36,104, 180)",
                "rgb(60,157, 194)",
                "rgb(128,205,193)",
                "rgb(151,218,168)",
                "rgb(198,231,181)",
                "rgb(255,238,159)",
                "rgb(252,217,125)",
                "rgb(255,182,100)",
                "rgb(252,150,75)",
                "rgb(250,112,52)",
                "rgb(245,64,32)",
                "rgb(237,45,28)",
                "rgb(220,24,32)",
                "rgb(180,0,35)"
            ],
            maxVelocity: 12,
            velocityScale: .005
        });

        const bounds: LatLngBoundsExpression = new L.LatLngBounds(
            [
                velocityData[0].header.la1,
                velocityData[0].header.lo1,
            ],
            [
                velocityData[0].header.la2,
                velocityData[0].header.lo2
            ]
        );
        const boundingBox = L.rectangle(bounds.pad(.01), {color: "#777", fillOpacity: 0, weight: 1});

        const map = L.map(mapContainer.current, {
            center: new L.LatLng(latCentre, lngCentre),
            zoom: defZoom,
            minZoom: 10,
            zoomControl: false,
            layers: [tiles, velocityLayer, boundingBox]
        });

        map.fitBounds(bounds.pad(.05));
        map.setMaxBounds(bounds.pad(.1));

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
                        polygonArrowPoints([lat, lng], arrowSize * scaleFactor, dir)
                    ]);
                    waveArrows.push(polygon);
                    polygon.addTo(map);
                }
            }
        }

        // loadWaveData(13);

        map.on("movestart", e => {
            map.removeLayer(velocityLayer);
        });
        map.on("moveend", e => {
            map.addLayer(velocityLayer);
        });
        map.on("zoomstart", e => {
            map.removeLayer(velocityLayer);
        });
        map.on("zoomend", e => {
            map.addLayer(velocityLayer);
            const curZoomLevel = map.getZoom();
            console.log(curZoomLevel);
        });
        var greenIcon = L.icon({
            iconUrl: "pin.png",
            shadowUrl: null,

            iconSize: [10, 10], // size of the icon
            iconAnchor: [5, 5], // point of the icon which will correspond to marker's location
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

            const vertex = new L.marker(e.latlng, {icon: greenIcon}).addTo(map);
            vertices.push(vertex);

            if (vertices.length > 1) {
                const edge = L.polyline(
                    vertices.map(pt => pt.getLatLng()),
                    {color: "#fff", weight: 1}
                ).addTo(map);
                edges.push(edge);
            }
        });
    };

    return <div className={"w-screen h-screen"}>
        {/*<div className={"absolute z-50 w-64 h-full right-0 p-4 shadow bg-neutral-800 text-white text-sm"}>*/}
        {/*    <div>Path Analysis</div>*/}
        {/*</div>*/}
        <div className={"absolute z-0 inset-0 w-screen h-screen"} ref={mapContainer}/>
    </div>;
};