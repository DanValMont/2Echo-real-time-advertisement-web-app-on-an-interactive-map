import nc from "next-connect";
import { isAdmin, isAuth } from "../../../../utils/auth";
import User from "../../../../models/User";
import db from "../../../../utils/db";

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const users = await User.find();
  const usersCount = await User.countDocuments();
  await db.disconnect();
  res.send({ users, usersCount });
});

export default handler;
