type credit = {
    name: string;
    credit: string;
    link: string;
    };

const creditData: credit[] = [
    {
        name: 'Leaflet',
        credit: 'Map Control',
        link: 'https://leafletjs.com/'
    },
    {
        name: 'OpenStreetMap',
        credit: 'Map Data',
        link: 'https://www.openstreetmap.org/'
    },
    // {
    //     name: 'OpenEmoji',
    //     credit: 'Emoji Data',
    //     link: 'https://openmoji.org/'
    // },
    {
        name: 'Songle',
        credit: 'Lyrics Data',
        link: 'https://api.songle.jp/'
    },
    {
        name: 'TextAlive',
        credit: 'Lyrics Control',
        link: 'https://developer.textalive.jp/'
    },
    {
        name: 'ゲーム名',
        credit: 'Team AHEAD, Project Atlas,  🦄 & 👽, 2024',
        link: ''
    }
];

export default creditData;