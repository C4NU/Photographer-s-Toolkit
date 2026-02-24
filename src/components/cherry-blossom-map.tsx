"use client";

import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from "react-simple-maps";
import { FORECAST_DATA, Forecast } from "@/lib/data/forecast";
import { parseISO, isBefore, isAfter, addDays, format } from "date-fns";
import { MotionConfig, motion } from "framer-motion";

// Using a standard world map topojson
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface CherryBlossomMapProps {
    currentDate: Date;
}

type BloomStatus = "waiting" | "blooming" | "full" | "ended";

function getBloomStatus(current: Date, forecast: Forecast): BloomStatus {
    const flowering = parseISO(forecast.floweringDate);
    const fullBloom = parseISO(forecast.fullBloomDate);
    const end = addDays(fullBloom, 7);

    if (isBefore(current, flowering)) return "waiting";
    if (isBefore(current, fullBloom)) return "blooming";
    if (isBefore(current, end)) return "full";
    return "ended";
}

const COLORS = {
    waiting: "#71717a", // zinc-500
    blooming: "#f472b6", // pink-400
    full: "#db2777", // pink-600
    ended: "#15803d", // green-700
};

export function CherryBlossomMap({ currentDate }: CherryBlossomMapProps) {
    return (
        <div className="w-full h-full bg-zinc-900 overflow-hidden rounded-xl border border-zinc-800 shadow-2xl relative">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    center: [133, 36], // Centered between Korea and Japan
                    scale: 1800, // Zoomed in
                }}
                className="w-full h-full"
            >
                <ZoomableGroup center={[133, 36]} zoom={1} minZoom={1} maxZoom={4}>
                    <Geographies geography={GEO_URL}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                // Filter to only show relevant countries for cleaner look if desired,
                                // or just style everything dark.
                                // Korea (South: KR, North: KP), Japan: JP
                                const isRegion = ["KR", "KP", "JP", "CN", "TW", "RU"].includes(geo.properties.ISO_A2);
                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={isRegion ? "#27272a" : "#18181b"} // zinc-800 vs zinc-900
                                        stroke="#3f3f46" // zinc-700
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none" },
                                            hover: { fill: "#27272a", outline: "none" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>

                    {FORECAST_DATA.map((forecast) => {
                        const status = getBloomStatus(currentDate, forecast);
                        const color = COLORS[status];

                        return (
                            <Marker key={forecast.id} coordinates={[forecast.coordinates[1], forecast.coordinates[0]]}>
                                <motion.g
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {/* Outer Glow for Full Bloom */}
                                    {status === 'full' && (
                                        <circle r={12} fill={color} opacity={0.3} className="animate-pulse" />
                                    )}

                                    {/* Main Dot */}
                                    <circle r={5} fill={color} stroke="#fff" strokeWidth={1} />

                                    {/* Label */}
                                    <text
                                        textAnchor="middle"
                                        y={-10}
                                        style={{
                                            fontFamily: "system-ui",
                                            fill: "white",
                                            fontSize: "10px",
                                            fontWeight: "bold",
                                            textShadow: "0px 1px 2px rgba(0,0,0,0.8)"
                                        }}
                                    >
                                        {forecast.name}
                                    </text>
                                </motion.g>
                            </Marker>
                        );
                    })}
                </ZoomableGroup>
            </ComposableMap>

            {/* Legend / Status Indicator Overlay */}
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur p-4 rounded-lg border border-zinc-800 text-xs text-white">
                <div className="font-bold mb-2 text-sm">{format(currentDate, "MMMM d, yyyy")}</div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-zinc-500"></div>
                        <span>Waiting</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                        <span>Blooming</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-600 shadow-[0_0_8px_rgba(219,39,119,0.6)]"></div>
                        <span>Full Bloom</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-700"></div>
                        <span>Ended</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
