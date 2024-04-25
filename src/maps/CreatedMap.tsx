const fantasyGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        name: 'Fantasy Island',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.489404, 37.833501],
            [-122.508122, 37.737087],
            [-122.434778, 37.719093],
            [-122.392998, 37.786254],
            [-122.489404, 37.833501],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Seaside Town',
      },
      geometry: {
        type: 'Point',
        coordinates: [-122.450695, 37.772575],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Mountain Village',
      },
      geometry: {
        type: 'Point',
        coordinates: [-122.475891, 37.776554],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Main Road',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.450695, 37.772575],
          [-122.455453, 37.774421],
          [-122.462006, 37.776554],
          [-122.475891, 37.776554],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Highlight Point',
      },
      geometry: {
        type: 'Point',
        coordinates: [-122.462006, 37.776554],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Coastal Highway',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.508122, 37.737087],
          [-122.498283, 37.754831],
          [-122.481689, 37.767267],
          [-122.461767, 37.774602],
          [-122.440529, 37.778109],
          [-122.419891, 37.779021],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Mountain Road',
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-122.462006, 37.776554],
          [-122.468977, 37.782292],
          [-122.475891, 37.787425],
          [-122.482421, 37.791785],
        ],
      },
    },
  ],
};

export default fantasyGeoJson;
