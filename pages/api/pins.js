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
