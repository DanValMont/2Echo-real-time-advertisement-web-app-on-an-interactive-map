import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
import { Star } from '@mui/icons-material';
import {format} from "timeago.js";
import { useSnackbar } from 'notistack';
import { Search } from '../Search/Search';
import MarkerCreator from '../Marker/MarkerCreator';
import Navbar from '../Navbar/Navbar';
import { Card, CardMedia, CardContent, Typography } from "@mui/material"

const { BaseLayer } = LayersControl;


export default function Map({geoData, geoDataSearch, pins, pinDocs, countPins}) {
  //const [geoData, setGeoData] = useState({ lat: 64.536634, lng: 16.779852 });

  // const [geoData, setGeoData] = useState({ lat: 0, lng: 0 });
  const { enqueueSnackbar } = useSnackbar();
  const center = geoData ? [geoData.lat, geoData.lng] : [geoDataSearch.lat, geoDataSearch.lng];

  const mapMarkers = pins && ( pins.map((pin) => (
        <Marker icon={L.icon({iconUrl: "/2echo-logo-no-name.svg", shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', shadowSize: [41, 41], iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]})} key={pin._id}  position={[pin.latitude, pin.longitude]} title={pin.title} alt={pin.title} riseOnHover={true} >
      <Popup>
       <Card sx={{maxWidth: 345, backgroundColor: "#ffffff"}}>
        <CardMedia
        component="img"
        alt={pin.title}
        height="140"
        image={pin.image}
         />
         <CardContent>
          <Typography variant="h1" component="div" sx={{
                fontSize: 24,
                // textAlign: "center",
                fontFamily: "Comfortaa",
              }}>
                {pin.title}
              </Typography>
              <Typography variant="body2"  sx={{
                fontFamily: "Comfortaa",
              }}>
                {pin.description}
              </Typography>
              <Typography variant="div" component="div">
                {Array(pin.rating).fill(pin.rating).map((e, i) => (<Star key={i} sx={{color: "gold"}}  />))}
              </Typography>
              <Typography variant="span" component="span" sx={{
                fontFamily: "Comfortaa", display: "block"
              }}>
                Created by <b>{pin.username}</b>
              </Typography>
              <Typography variant="span" component="span" sx={{
                fontFamily: "Comfortaa",
              }}>
               {format(pin.createdAt)}
              </Typography>
         </CardContent>
       </Card>
      </Popup>
      </Marker>
      )));

      const resultSearchMapMarkers = pinDocs && (pinDocs.map((pinDoc) => (
        <Marker icon={L.icon({iconUrl: "/2echo-logo-no-name.svg", shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', shadowSize: [41, 41], iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34]})} key={pinDoc._id}  position={[pinDoc.latitude, pinDoc.longitude]} title={pinDoc.title} alt={pinDoc.title} riseOnHover={true}>
      <Popup>
       <Card sx={{maxWidth: 345, backgroundColor: "#ffffff"}}>
        <CardMedia
        component="img"
        alt={pinDoc.title}
        height="140"
        image={pinDoc.image}
         />
         <CardContent>
          <Typography variant="h1" component="div" sx={{
                fontSize: 24,
                // textAlign: "center",
                fontFamily: "Comfortaa",
              }}>
                {pinDoc.title}
              </Typography>
              <Typography variant="body2"  sx={{
                fontFamily: "Comfortaa",
              }}>
                {pinDoc.description}
              </Typography>
              <Typography variant="div" component="div">
                {Array(pinDoc.rating).fill(pinDoc.rating).map((e, i) => (<Star key={i} sx={{color: "gold"}}  />))}
              </Typography>
              <Typography variant="span" component="span" sx={{
                fontFamily: "Comfortaa", display: "block"
              }}>
                Created by <b>{pinDoc.username}</b>
              </Typography>
              <Typography variant="span" component="span" sx={{
                fontFamily: "Comfortaa",
              }}>
               {format(pinDoc.createdAt)}
              </Typography>
         </CardContent>
       </Card>
      </Popup>
      </Marker>
      )));

  return (
    <MapContainer center={center} zoom={1} style={{ height: '100vh', width: '100vw'}} >
      <LayersControl>
        <BaseLayer checked name="OpenStreetMap">
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      </BaseLayer>
      <BaseLayer name="Esri World Imagery">
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        // maxNativeZoom={19}
      />
      </BaseLayer>
      <BaseLayer name="Esri">
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 201'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        // maxNativeZoom={19}
      />
      </BaseLayer>
      <BaseLayer name="Stadia Maps">
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        maxNativeZoom={20}
      />
      </BaseLayer>
      </LayersControl>
      {pinDocs && (pinDocs.length === 0 ? enqueueSnackbar("No Results, try again in a moment", { variant: "info" }) : enqueueSnackbar(`${countPins} Results`, { variant: "info" }))}
      {resultSearchMapMarkers}
      {mapMarkers}
      <Navbar />
      <Search />
      <MarkerCreator />
    </MapContainer>
  );
}