import nc from "next-connect";
// import { isAdmin, isAuth } from "../../../../utils/auth";
import Pin from "../../models/Pin";
import db from "../../utils/db";

const handler = nc();
// handler.use(isAuth, isAdmin);

// handler.get(async (req, res) => {
//   await db.connect();
//   const products = await Product.find({});
//   await db.disconnect();
//   res.send(products);
// });

handler.get(async (req, res) => {
  await db.connect();
  const pins = await Pin.find({});
  await db.disconnect();
  res.send(pins);
});

handler.post(async (req, res) => {
  await db.connect();
  const newPin = new Pin(req.body);

  const savedPin = await newPin.save();
  await db.disconnect();
  res.send({ message: "Pin Created", savedPin });
});

export default handler;

//https://stackblitz.com/edit/nextjs-3paj5o?file=package.json
//https://www.youtube.com/watch?v=MujnOg175Yo
//https://stackblitz.com/edit/nextjs-3paj5o (same url root as the first above)
//https://react-leaflet.js.org/docs/example-events/
//https://www.youtube.com/watch?v=9oEQvI7K-rA
//https://dev.to/paigen11/create-an-asset-tracker-map-with-nextjs-and-react-leaflet-42d2
//https://egghead.io/lessons/react-add-placename-location-search-to-react-leaflet-with-esri-leaflet-geocoder
//https://smeijer.github.io/leaflet-geosearch/usage
//https://stackoverflow.com/questions/65909171/using-react-leaflet-geosearch-in-react-leaflet-cannot-read-property-addcontrol
//https://blog.logrocket.com/understanding-react-useeffect-cleanup-function/
//https://dev.to/otamnitram/react-useeffect-cleanup-how-and-when-to-use-it-2hbm
//https://webomnizz.com/change-parent-component-state-from-child-using-hooks-in-react/
//https://www.loginradius.com/blog/engineering/guest-post/local-storage-vs-session-storage-vs-cookies/
