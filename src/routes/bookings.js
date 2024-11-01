import { Router } from "express";
import getBookings from "../services/bookings/getBookings.js";
import createBooking from "../services/bookings/createBooking.js";
import getBookingById from "../services/bookings/getBookingById.js";
import deleteBookingById from "../services/bookings/deleteBookingById.js";
import updateBookingById from "../services/bookings/updateBookingById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { userId } = req.query;
    const bookings = await getBookings(userId);
    return res.json(bookings);
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    if (
      !userId ||
      !propertyId ||
      !checkinDate ||
      !checkoutDate ||
      !numberOfGuests ||
      !totalPrice ||
      !bookingStatus
    ) {
      return res.status(400).json({
        message:
          "All fields are required: userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus",
      });
    }

    const newBooking = await createBooking({
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    });
    return res.status(201).json({
      message: `Booking successfully created`,
      booking: newBooking,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        message: `Booking with id ${id} was not found`,
      });
    }

    return res.json(booking);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBooking = await updateBookingById(id, req.body);

    if (!updatedBooking) {
      return res.status(404).json({
        message: `Booking with id ${id} was not found`,
      });
    }

    return res.json({
      message: `Booking with id ${id} successfully updated`,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedBooking = await deleteBookingById(id);

    if (!deletedBooking) {
      return res.status(404).json({
        message: `Booking with id ${id} was not found`,
      });
    }

    return res.json({
      message: `Booking with id ${id} successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;