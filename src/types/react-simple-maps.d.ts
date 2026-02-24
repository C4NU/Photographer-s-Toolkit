import * as React from 'react';

declare module 'react-simple-maps' {
    export interface GeographiesProps {
        geography?: string | object | string[];
        children?: (data: { geographies: any[] }) => React.ReactNode;
    }
    export const Geographies: React.FC<GeographiesProps>;
    export const ComposableMap: React.FC<any>;
    export const Geography: React.FC<any>;
    export const Marker: React.FC<any>;
    export const ZoomableGroup: React.FC<any>;
}
