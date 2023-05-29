import { useEffect } from 'react';
import { SearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { useMap } from 'react-leaflet';

export function Search() {
  const map = useMap();
  // const control = geosearch();
  // // const code = geocode()
  // control.addTo(map);
  // map.setView(coords, 12);
  // return null;

  useEffect(() => {
    const searchControl = new SearchControl({
  notFoundMessage: 'Sorry, that address could not be found.',
  provider: new OpenStreetMapProvider(),
});
 map.addControl(searchControl);
 return() => map.removeControl(searchControl)

  }, []);

  return null;
}