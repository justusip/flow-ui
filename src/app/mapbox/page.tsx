// "use client";
//
// import "mapbox-gl/dist/mapbox-gl.css";
//
// import {useEffect, useRef, useState} from "react";
// import mapboxgl from "mapbox-gl";
// import HighlightLayer from "@/app/HighlightLayer";
// import WindLayer from "@sakitam-gis/mapbox-wind";
//
// mapboxgl.accessToken = "pk.eyJ1IjoianVzdHVzaXAiLCJhIjoiY2xuZWEzZWplMGJ6cTJqbWs1b3F4Z2NueSJ9.gVm5YadStrOim4uYIFkU6Q";
//
// export default function Page() {
//     const mapContainer = useRef<HTMLDivElement | null>(null);
//     const map = useRef<mapboxgl.Map | null>(null);
//
//     const [lat, setLat] = useState(22.22);
//     const [lng, setLng] = useState(114.25);
//     const [zoom, setZoom] = useState(11);
//
//     useEffect(() => {
//         if (!mapContainer.current)
//             return;
//         onLoad();
//     }, [mapContainer.current]);
//
//     const onLoad = async () => {
//         map.current = new mapboxgl.Map({
//             container: mapContainer.current!,
//             style: "mapbox://styles/mapbox/dark-v11",
//             // style: "mapbox://styles/mapbox/outdoors-v12",
//             center: [lng, lat],
//             zoom: zoom,
//             projection: {
//                 name: "mercator"
//             }
//         });
//         const m = map.current!;
//         m.on("load", () => {
//             m.getStyle().layers.forEach(layer => {
//                 if (layer.id.indexOf("-label") <= 0)
//                     return;
//                 m.setLayoutProperty(layer.id, "text-field", ["get", "name_zh-Hant"]);
//             });
//         });
//
//         m.on("move", () => {
//             setLng(m.getCenter().lng);
//             setLat(m.getCenter().lat);
//             setZoom(m.getZoom());
//         });
//
//         // const velocityDataRes = await fetch("/tmp/wind-global.json");
//         const velocityDataRes = await fetch("/data/output/wave_data_x8.grib.json");
//         const velocityData = await velocityDataRes.json();
//         const windLayer = new WindLayer("wind", velocityData, {
//                 windOptions: {
//                     colorScale: [
//                         "rgb(36,104, 180)",
//                         "rgb(60,157, 194)",
//                         "rgb(128,205,193)",
//                         "rgb(151,218,168)",
//                         "rgb(198,231,181)",
//                         "rgb(238,247,217)",
//                         "rgb(255,238,159)",
//                         "rgb(252,217,125)",
//                         "rgb(255,182,100)",
//                         "rgb(252,150,75)",
//                         "rgb(250,112,52)",
//                         "rgb(245,64,32)",
//                         "rgb(237,45,28)",
//                         "rgb(220,24,32)",
//                         "rgb(180,0,35)"
//                     ],
//                     maxAge: 100,
//                     globalAlpha: 0.9,
//                     velocityScale: 0.0005,
//                     paths: 1000,
//                     frameRate: 16,
//                 },
//             }
//         );
//         m.addLayer(windLayer);
//     };
//
//     return (
//         <div className={"w-screen h-screen bg-black"}>
//             <div className="absolute px-2 py-1 m-2 text-xs bg-black/50 text-white z-50">
//                 Longitude: {lng.toFixed(4)} | Latitude: {lat.toFixed(4)} | Zoom: {zoom.toFixed(2)}
//             </div>
//             <div ref={mapContainer} className="absolute inset-0 w-screen h-screen"/>
//         </div>
//     );
// }
export default function Page() {
    return <></>;
}