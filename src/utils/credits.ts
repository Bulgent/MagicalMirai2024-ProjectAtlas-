type credit = {
    name: string;
    credit: string;
    link: string;
    };

const creditData: credit[] = [
    {
        name: 'Leaflet',
        credit: 'Map data',
        link: 'https://leafletjs.com/'
    },
    {
        name: 'OpenStreetMap',
        credit: 'contributors',
        link: 'https://www.openstreetmap.org/'
    },
    {
        name: 'OpenEmoji',
        credit: 'Emoji data',
        link: 'https://openmoji.org/'
    },
    {
        name: 'TextAlive',
        credit: 'Lyrics synchronization API',
        link: 'https://textalive.jp/'
    },
    {
        name: 'ゲーム名',
        credit: 'Team AHEAD, Project Atlas,  🦄 & 👽, 2024',
        link: ''
    }
];

export default creditData;