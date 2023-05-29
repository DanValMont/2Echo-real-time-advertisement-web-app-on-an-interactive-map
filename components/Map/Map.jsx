import { useState, useEffect, useContext } from 'react';
import styles from "./Map.module.css";
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
// import { geosearch } from "esri-leaflet-geocoder";
// import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"
// import { SearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
// import 'leaflet-geosearch/dist/geosearch.css';

import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, LayersControl } from 'react-leaflet';
import { Star } from '@mui/icons-material';
import {format} from "timeago.js";
import axios from "axios";
import { MapStore } from '../../context/MapStore';
import { useSnackbar } from 'notistack';
import { getError } from '../../utils/error';
import Image from "next/image";
import { Search } from '../Search/Search';
import MarkerCreator from '../Marker/MarkerCreator';
import Navbar from '../Navbar/Navbar';
import { Card, CardMedia, CardContent, Typography } from "@mui/material"
// import Register from '../Register/Register';


// export function ChangeView() {
//   const map = useMap();
//   // const control = geosearch();
//   // // const code = geocode()
//   // control.addTo(map);
//   // map.setView(coords, 12);
//   // return null;

//   useEffect(() => {
//     const searchControl = new SearchControl({
//   notFoundMessage: 'Sorry, that address could not be found.',
//   provider: new OpenStreetMapProvider(),
// });
//  map.addControl(searchControl);
//  return() => map.removeControl(searchControl)

//   }, []);

//   return null;
// }

// function MapEvents() { 
//   const { enqueueSnackbar } = useSnackbar();
//   const [position, setPosition] = useState(null);
//   const { state, dispatch } = useContext(MapStore);
//         const {userInfo, createdPin} = state;
//   useMapEvents({
//           dblclick: (ev) => {

//             userInfo ? setPosition(ev.latlng) : enqueueSnackbar("Please sign in or login to start creating content", { variant: "info" });
//           },

//           popupclose: () => {
//       setPosition(null);
//     },
//         });
//         return null
//       }

const { BaseLayer } = LayersControl;


export default function Map({geoData, geoDataSearch, pins, pinDocs, countPins}) {
  //const [geoData, setGeoData] = useState({ lat: 64.536634, lng: 16.779852 });

  // const [geoData, setGeoData] = useState({ lat: 0, lng: 0 });
  const { enqueueSnackbar } = useSnackbar();
  const center = geoData ? [geoData.lat, geoData.lng] : [geoDataSearch.lat, geoDataSearch.lng];
  
  // useEffect(() => {
    
  //   const { current } = mapRef;
  //   console.log(current);
  //   const { leafletElement: map} = current;

  //   if (!map) return;

  //   const control = geosearch();
  //   control.addTo(map)

  //   control.on("results", handleOnSearchResults);

  //   return () => {
  //     control.off("results", handleOnSearchResults);
  //   }
    
  // }, []);

  // function handleOnSearchResults(data) {
  //   console.log("Search Results", data);
  // }

  //https://res.cloudinary.com/revelationecommerce/image/upload/v1662070110/bsuou0uxg5nqi32gxgds.jpg
  //icon={L.icon({iconUrl: "/2echo-logo-no-name.svg", iconSize: [25, 41], iconAnchor: [12, 41]})}


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

        {/* <div className={styles.card}>
          <label className={styles.label}>Title</label>
          <h4 className={styles.title}>{pin.title}</h4>
          <label className={styles.label} >About</label>
          <p className={styles.about}>{pin.description}
          </p>
          <label className={styles.label}>Image</label>
          <div className={styles.imageContainer}>
          <Image src={pin.image} alt={pin.title} objectFit="contain" layout="fill"/>
          </div>
          <label className={styles.label}>Rating</label>
          <div className={styles.stars}>
            {Array(pin.rating).fill(pin.rating).map((e, i) => (<Star key={i} className="star" />))}
          </div>
          <label className={styles.label}>Information</label>
          <span className={styles.username}>Created by <b>{pin.username}</b></span>
          <span className={styles.date}>{format(pin.createdAt)}</span>
        </div> */}
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

        {/* <div className={styles.card}>
          <label className={styles.label}>Title</label>
          <h4 className={styles.title}>{pin.title}</h4>
          <label className={styles.label} >About</label>
          <p className={styles.about}>{pin.description}
          </p>
          <label className={styles.label}>Image</label>
          <div className={styles.imageContainer}>
          <Image src={pin.image} alt={pin.title} objectFit="contain" layout="fill"/>
          </div>
          <label className={styles.label}>Rating</label>
          <div className={styles.stars}>
            {Array(pin.rating).fill(pin.rating).map((e, i) => (<Star key={i} className="star" />))}
          </div>
          <label className={styles.label}>Information</label>
          <span className={styles.username}>Created by <b>{pin.username}</b></span>
          <span className={styles.date}>{format(pin.createdAt)}</span>
        </div> */}
      </Popup>

      </Marker>
      )));




  //     function updatePin() {
  //   setCreatedPin(true);
  // }


      
  //     function CreateMarker() {
  //       const { dispatch } = useContext(MapStore);
  //       const { enqueueSnackbar } = useSnackbar();
  //       const [position, setPosition] = useState(null);
  //       const [title, setTitle] = useState(null);
  //       const [description, setDescription] = useState(null);
  //       const [star, setStar] = useState(0);
  //       const [image, setImage] = useState(null);
  //       const currentUsername = "Adrian";
  //       // const imageTemplate = "https://myimage.com"

  //       useMapEvents({
  //         dblclick(ev) {
  //           setPosition(ev.latlng)
  //         }
  //       });

  //       const uploadHandler = async (e) => {
  //   const file = e.target.files[0];
  //   const bodyFormData = new FormData();
  //   bodyFormData.append("file", file);
  //   try {
  //     // dispatch({ type: "UPLOAD_REQUEST" });
  //     const { data } = await axios.post("/api/admin/upload", bodyFormData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         authorization: `Bearer ${userInfo.token}`,
  //       },
  //     });
  //     // dispatch({ type: "UPLOAD_SUCCESS" });
  //     setImage(data.secure_url);
  //     enqueueSnackbar("File uploaded successfully", { variant: "success" });
  //   } catch (err) {
  //     // dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
  //     enqueueSnackbar(getError(err), { variant: "error" });
  //   }
  // };

  //       const handleSubmit = async (e) => {
  //             e.preventDefault();
  //         const newPin = {
  //             username: currentUsername, // check this!
  //             title,
  //             image,
  //             description,
  //             rating: star,
  //             latitude: position.lat,
  //             longitude: position.lng,
  //         };

  //         try {
  //              await axios.post("/api/pins", newPin);
  //              dispatch({type: "CREATED_PIN", payload: true})
  //              enqueueSnackbar("Review submitted successfully", { variant: "success" });
  //             //  updatePin();
  //             //  setPins([...pins, data]);
  //             //  setCreatedPin(true);
  //             //  setNewPlace(null);
  //         } catch (err) {
  //           console.log(err);
  //           enqueueSnackbar(getError(err), { variant: "error" });
  //         }
  //       };

        

  //       return position === null ? null : (
  //         <Marker position={position} >
  //      <Popup>
  //        <div className={styles.card}>
  //          <form className={styles.form} onSubmit={handleSubmit}>
  //                 <label>Title</label>
  //                 <input
  //                   className={styles.input}
  //                   placeholder="Enter a title"
  //                   autoFocus
  //                   onChange={(e) => setTitle(e.target.value)}
  //                 />
  //                 <label>Image</label>
  //                 <button type="button" >
  //                   Upload File
  //                   <input type="file" onChange={(e) => uploadHandler(e)} hidden />
  //                 </button>
  //                 <label>Description</label>
  //                 <textarea
  //                   className={styles.textarea}
  //                   placeholder="Say us something about this place."
  //                   onChange={(e) => setDescription(e.target.value)}
  //                 />
  //                 <label>Rating</label>
  //                 <select className={styles.select} onChange={(e) => setStar(e.target.value)}>
  //                   <option value="1">1</option>
  //                   <option value="2">2</option>
  //                   <option value="3">3</option>
  //                   <option value="4">4</option>
  //                   <option value="5">5</option>
  //                 </select>
  //                 <button type="submit" className={styles.submitButton}>
  //                   Add Pin
  //                 </button>
  //               </form>
  //        </div>
  //      </Popup>

  //      </Marker>
  //       );
  //     }

      // const createMarker = (newPlace && (<Marker position={[pin.latitude, pin.longitude]} >
      // <Popup>
      //   <div className={styles.card}>
      //     <label className={styles.label}>Title</label>
      //     <h4 className={styles.title}>{pin.title}</h4>
      //     <label className={styles.label} >About</label>
      //     <p className={styles.about}>{pin.description}
      //     </p>
      //     <label className={styles.label}>Image</label>
      //     <label className={styles.label}>Rating</label>
      //     <div className={styles.stars}>
      //       <Star className={styles.star}/>
      //       <Star className={styles.star} />
      //       <Star className={styles.star} />
      //       <Star className={styles.star}/>
      //       <Star className={styles.star}/>
      //     </div>
      //     <label className={styles.label}>Information</label>
      //     <span className={styles.username}>Created by <b>{pin.user}</b></span>
      //     <span className={styles.date}>{format(pin.createdAt)}</span>
      //   </div>
      // </Popup>

      // </Marker>))

  //     function NewLocationMarker() {
  //   // const [position, setPosition] = useState(null);
  //   // const map = useMap();
  //   // const getLatLong = map.getCenter();
  //   // console.log(getLatLong);
  //   useMapEvents({
  //     dblclick(ev) {
  //       console.log(ev.latlng);
  //     }
  //   })
    
  //   return null;

  //   // const map = useMapEvents({
  //   //   dbclick() {
  //   //     const latlong = map.getCenter();
  //   //     console.log(latlong);
  //   //   },
  //   // });

  //   //   locationfound(e) {
  //   //     setPosition(e.latlng);
  //   //     map.flyTo(e.latlng, map.getZoom());
  //   //   },
  //   // });

  //   // return position === null ? null : (
  //   //   <Marker position={position}>
  //   //     <Popup>You are here</Popup>
  //   //   </Marker>
  //   // );
  // }

  //https://www.oruxmaps.com/cs/es/maps
  //https://anygis.ru/Web/Html/Orux_en
  //https://leaflet-extras.github.io/leaflet-providers/preview/

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
      {/* <Register/> */}
      {/* {geoData.lat && geoData.lng && (
        <Marker position={[geoData.lat, geoData.lng]} />
      )} */}
      
      
    </MapContainer>
  );
}
//https://stackoverflow.com/questions/66288089/how-to-display-a-list-of-points-using-dbclick-in-react-leaflet-v-3-x
//https://feirasorganicas.org.br/
//https://github.com/safak/youtube/blob/mern-travel-app/frontend/src/App.js
//https://react-hook-form.com/api/useform/setvalue
//https://frontend.turing.edu/lessons/module-3/advanced-react-hooks.html