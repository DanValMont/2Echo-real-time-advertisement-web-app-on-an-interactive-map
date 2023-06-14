import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { MapStore } from "../context/MapStore";
import db from "../utils/db";
import Pin from "../models/Pin";

const MapWithNoSSR = dynamic(() => import("../components/Map/Map"), {
  ssr: false,
});

export default function Home({ pin }) {
  const { state, dispatch } = useContext(MapStore);
  const { createdPin } = state;
  const [geoData, setGeoData] = useState({ lat: 0, lng: 0 });
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        dispatch({ type: "CREATED_PIN", payload: false });
        const { data } = await axios.get("/api/pins");
        setPins(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, createdPin]);

  return (
    <div className={styles.container}>
      <Head>
        <title>2ECHO - homepage</title>
        <meta
          name="description"
          content="Welcome to 2echo, a web application that allows anyone to post diverse ads and display them on an interactive, real-time map."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <MapWithNoSSR geoData={geoData} pins={pins} />
      </div>
    </div>
  );
}

export const getStaticProps = async () => {
  await db.connect();
  const pin = await Pin.find().lean();
  await db.disconnect();
  return {
    props: {
      pin: JSON.parse(JSON.stringify(pin)),
    },
  };
  // /* we're able to use Nextjs's ISR (incremental static regeneration)
  // revalidate functionality to re-fetch updated map coords and re-render one a regular interval */
  // const { data } = await axios.get("/api/pins");

  // return { props: { data }, revalidate: 120 };
};
