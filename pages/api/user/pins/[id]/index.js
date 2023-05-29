import nc from "next-connect";
import { isNotAdmin, isAuth } from "../../../../../utils/auth";
import Pin from "../../../../../models/Pin";
import db from "../../../../../utils/db";

const handler = nc();
handler.use(isAuth, isNotAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const pin = await Pin.findById(req.query.id);
  await db.disconnect();
  res.send(pin);
});

handler.put(async (req, res) => {
  await db.connect();
  const pin = await Pin.findById(req.query.id);
  if (pin) {
    pin.username = req.body.username;
    pin.title = req.body.title;
    pin.image = req.body.image;
    pin.description = req.body.description;
    pin.rating = req.body.rating;
    pin.latitude = req.body.latitude;
    pin.longitude = req.body.longitude;
    await pin.save();
    await db.disconnect();
    res.send({ message: "Pin Updated Successfully" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Pin Not Found" });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const pin = await Pin.findById(req.query.id);
  if (pin) {
    await pin.remove();
    await db.disconnect();
    res.send({ message: "Pin Deleted" });
  } else {
    await db.disconnect();
    res.status(404).send({ message: "Pin Not Found" });
  }
});

export default handler;
