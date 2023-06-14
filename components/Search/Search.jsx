import { useEffect } from 'react';
import { SearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';
import { useMap } from 'react-leaflet';

export function Search() {
  const map = useMap();

  useEffect(() => {
    const searchControl = new SearchControl({
  notFoundMessage: 'Sorry, that address could not be found.',
  provider: new OpenStreetMapProvider(),
});
 map.addControl(searchControl);
 return() => map.removeControl(searchControl)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}