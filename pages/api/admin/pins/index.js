import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import Pin from "../../../../models/Pin";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const pins = await Pin.find({});
  const pinsCount = await Pin.countDocuments();
  await db.disconnect();
  res.send({ pins, pinsCount });
});

// handler.post(async (req, res) => {
//   await db.connect();
//   const newProduct = new Product({
//     name: "sample name",
//     slug: "sample-slug-" + Math.random(),
//     image: "/images/shirt1.jpg",
//     price: 0,
//     category: "sample category",
//     brand: "sample brand",
//     countInStock: 0,
//     description: "sample description",
//     rating: 0,
//     numReviews: 0,
//   });

//   const product = await newProduct.save();
//   await db.disconnect();
//   res.send({ message: "Product Created", product });
// });

export default handler;
