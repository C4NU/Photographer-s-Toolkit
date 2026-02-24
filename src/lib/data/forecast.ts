export interface Forecast {
    id: string;
    name: string;
    country: 'KR' | 'JP';
    coordinates: [number, number]; // [lat, lng]
    floweringDate: string; // YYYY-MM-DD
    fullBloomDate: string; // YYYY-MM-DD
    description?: string;
}

export const FORECAST_DATA: Forecast[] = [
    // KOREA
    {
        id: 'kr-seogwipo',
        name: 'Seogwipo',
        country: 'KR',
        coordinates: [33.25, 126.56],
        floweringDate: '2026-03-24',
        fullBloomDate: '2026-03-31',
        description: 'The first cherry blossoms in Korea.'
    },
    {
        id: 'kr-busan',
        name: 'Busan',
        country: 'KR',
        coordinates: [35.17, 129.07],
        floweringDate: '2026-03-26',
        fullBloomDate: '2026-04-02',
        description: 'Dalmaji Hill requires a visit.'
    },
    {
        id: 'kr-jinhae',
        name: 'Jinhae',
        country: 'KR',
        coordinates: [35.15, 128.67],
        floweringDate: '2026-03-28',
        fullBloomDate: '2026-04-04',
        description: 'World famous Gunhangje Festival.'
    },
    {
        id: 'kr-daegu',
        name: 'Daegu',
        country: 'KR',
        coordinates: [35.87, 128.60],
        floweringDate: '2026-03-28',
        fullBloomDate: '2026-04-04'
    },
    {
        id: 'kr-seoul',
        name: 'Seoul',
        country: 'KR',
        coordinates: [37.56, 126.97],
        floweringDate: '2026-04-03',
        fullBloomDate: '2026-04-10',
        description: 'Yeouido Park and Seokchon Lake.'
    },
    {
        id: 'kr-gyeongju',
        name: 'Gyeongju',
        country: 'KR',
        coordinates: [35.84, 129.21],
        floweringDate: '2026-03-31',
        fullBloomDate: '2026-04-07',
        description: 'Ancient city with white cherry blossoms.'
    },

    // JAPAN
    {
        id: 'jp-tokyo',
        name: 'Tokyo',
        country: 'JP',
        coordinates: [35.68, 139.76],
        floweringDate: '2026-03-23',
        fullBloomDate: '2026-03-30',
        description: 'Ueno Park and Chidorigafuchi.'
    },
    {
        id: 'jp-kyoto',
        name: 'Kyoto',
        country: 'JP',
        coordinates: [35.01, 135.76],
        floweringDate: '2026-03-25',
        fullBloomDate: '2026-04-02',
        description: 'Philosophers Path is a must.'
    },
    {
        id: 'jp-osaka',
        name: 'Osaka',
        country: 'JP',
        coordinates: [34.69, 135.50],
        floweringDate: '2026-03-26',
        fullBloomDate: '2026-04-03',
        description: 'Osaka Castle Park.'
    },
    {
        id: 'jp-fukuoka',
        name: 'Fukuoka',
        country: 'JP',
        coordinates: [33.59, 130.40],
        floweringDate: '2026-03-21',
        fullBloomDate: '2026-03-30'
    },
    {
        id: 'jp-hokkaido',
        name: 'Sapporo',
        country: 'JP',
        coordinates: [43.06, 141.35],
        floweringDate: '2026-05-01',
        fullBloomDate: '2026-05-06',
        description: 'Late bloomer in the north.'
    }
];
