import { Router } from "express";
import getHosts from "../services/hosts/getHosts.js";
import createHost from "../services/hosts/createHost.js";
import getHostById from "../services/hosts/getHostById.js";
import deleteHostById from "../services/hosts/deleteHostById.js";
import updateHostById from "../services/hosts/updateHostById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { name } = req.query;
    const hosts = await getHosts(name);
    res.json(hosts);
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    } = req.body;

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !profilePicture ||
      !aboutMe
    ) {
      return res.status(400).send({
        message:
          "All fields are required: username, password, name, email, phonenNumber, profilePicture and aboutMe",
      });
    }

    const newHost = await createHost({
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    });
    res.status(201).send({
      message: `Account succesfully created`,
      newHost,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await getHostById(id);

    if (!host) {
      res.status(404).json({ message: `Host with id ${id} was not found` });
    } else {
      res.status(200).json(host);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    } = req.body;
    const host = await updateHostById(id, {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    });

    if (!host || host.count === 0) {
      res.status(404).json({
        message: `Host with id ${id} was not found`,
      });
    } else {
      res.status(200).send({
        message: `Host with id ${id} successfully updated`,
      });
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const host = await deleteHostById(id);

    if (!host || host.count === 0) {
      res.status(404).json({
        message: `Host with id ${id} was not found`,
      });
    } else {
      res.status(200).send({
        message: `Host with id ${id} successfully deleted`,
      });
    }
  } catch (err) {
    next(err);
  }
});

export default router;