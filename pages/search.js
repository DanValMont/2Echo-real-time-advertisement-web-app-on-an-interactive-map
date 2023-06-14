import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import db from "../utils/db";
import Pin from "../models/Pin";

const MapWithNoSSR = dynamic(() => import("../components/Map/Map"), {
  ssr: false,
});

export default function Search({ pinDocs, countPins }) {
  const [geoDataSearch, setGeoDataSearch] = useState({ lat: 0, lng: 0 });

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
        <MapWithNoSSR
          geoDataSearch={geoDataSearch}
          pinDocs={pinDocs}
          countPins={countPins}
        />
      </div>
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
