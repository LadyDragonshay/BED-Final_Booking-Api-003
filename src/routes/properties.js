import { Router } from "express";
import getProperties from "../services/properties/getProperties.js";
import createProperty from "../services/properties/createProperty.js";
import getPropertyById from "../services/properties/getPropertyById.js";
import deletePropertyById from "../services/properties/deletePropertyById.js";
import updatePropertyById from "../services/properties/updatePropertyById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { location, pricePerNight, amenities } = req.query;
    const properties = await getProperties(location, pricePerNight, amenities);
    return res.json(properties);
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathRoomCount ||
      !maxGuestCount ||
      !hostId ||
      !rating
    ) {
      return res.status(400).json({
        message:
          "All fields are required: title, description, location, pricePerNight, bedroomCount, bathRoomCount, maxGuestCount, hostId, rating",
      });
    }

    const newProperty = await createProperty({
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    });
    return res.status(201).json({
      message: `Property successfully created`,
      property: newProperty,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const property = await getPropertyById(id);

    if (!property) {
      return res.status(404).json({
        message: `Property with id ${id} was not found`,
      });
    }

    return res.json(property);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProperty = await updatePropertyById(id, req.body);

    if (!updatedProperty) {
      return res.status(404).json({
        message: `Property with id ${id} was not found`,
      });
    }

    return res.json({
      message: `Property with id ${id} successfully updated`,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProperty = await deletePropertyById(id);

    if (!deletedProperty) {
      return res.status(404).json({
        message: `Property with id ${id} was not found`,
      });
    }

    return res.json({
      message: `Property with id ${id} successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;