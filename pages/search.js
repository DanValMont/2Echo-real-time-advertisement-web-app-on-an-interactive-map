import Head from "next/head";
//import Image from 'next/image'
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { MapStore } from "../context/MapStore";
import db from "../utils/db";
import Pin from "../models/Pin";
// import { LeafletContext } from "@react-leaflet/core";

const MapWithNoSSR = dynamic(() => import("../components/Map/Map"), {
  ssr: false,
});

export default function Search({ pinDocs, countPins }) {
  //   const { state, dispatch } = useContext(MapStore);
  //   const { createdPin } = state;
  const [geoDataSearch, setGeoDataSearch] = useState({ lat: 0, lng: 0 });
  // const [pins, setPins] = useState([]);
  // const [createdPin, setCreatedPin] = useState(false);
  // const [newPlace, setNewPlace] = useState(null);
  // function updatePin() {
  //   setCreatedPin(true);
  // }

  //   useEffect(() => {
  //     const fetchPins = async () => {
  //       try {
  //         dispatch({ type: "CREATED_PIN", payload: false });
  //         const { data } = await axios.get("/api/pins");
  //         setPins(data);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };

  //     fetchPins();
  //   }, [pin, createdPin]);

  return (
    <div className={styles.container}>
      <Head>
        <title>2ECHO - homepage</title>
        <meta
          name="description"
          content="Welcome to Map Adventure travel App. A website App where you can share with your peers about interesting places to visit such as swap meets, street markets, expositions etc."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <MapWithNoSSR
          geoDataSearch={geoDataSearch}
          pinDocs={pinDocs}
          countPins={countPins}
          // updatePin={updatePin}
          // setPins={setPins}
          // setCreatedPin={setCreatedPin}
        />
      </div>

      {/* <main className={styles.main}>
        <div>
          <h1>Let's create a map adventure travel app</h1>
        </div>
      </main> */}
    </div>
  );
}

export const getServerSideProps = async ({ query }) => {
  await db.connect();
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== ""
      ? {
          $or: [
            {
              title: {
                $regex: searchQuery,
                $options: "i",
              },
            },
            {
              description: {
                $regex: searchQuery,
                $options: "i",
              },
            },
          ],
        }
      : {};

  const pinDocs = await Pin.find({
    ...queryFilter,
  }).lean();

  const countPins = await Pin.countDocuments({
    ...queryFilter,
  });

  await db.disconnect();

  return {
    props: {
      pinDocs: JSON.parse(JSON.stringify(pinDocs)),
      countPins: countPins,
    },
  };

  //   await db.connect();
  //   const pin = await Pin.find().lean();
  //   await db.disconnect();
  //   return {
  //     props: {
  //       pin: JSON.parse(JSON.stringify(pin)),
  //     },
  //   };

  // /* we're able to use Nextjs's ISR (incremental static regeneration)
  // revalidate functionality to re-fetch updated map coords and re-render one a regular interval */
  // const { data } = await axios.get("/api/pins");

  // return { props: { data }, revalidate: 120 };
};
