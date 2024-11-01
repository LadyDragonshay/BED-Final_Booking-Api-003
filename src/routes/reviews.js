import { Router } from "express";
import getReviews from "../services/reviews/getReviews.js";
import createReview from "../services/reviews/createReview.js";
import getReviewById from "../services/reviews/getReviewById.js";
import deleteReviewById from "../services/reviews/deleteReviewById.js";
import updateReviewById from "../services/reviews/updateReviewById.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const reviews = await getReviews();
    return res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;

    if (!userId || !propertyId || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required: userId, propertyId, rating, comment",
      });
    }

    const newReview = await createReview({
      userId,
      propertyId,
      rating,
      comment,
    });
    return res.status(201).json({
      message: `Review successfully created`,
      review: newReview,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await getReviewById(id);

    if (!review) {
      return res.status(404).json({
        message: `Review with id ${id} was not found`,
      });
    }

    return res.json(review);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedReview = await updateReviewById(id, req.body);

    if (!updatedReview) {
      return res.status(404).json({
        message: `Review with id ${id} was not found`,
      });
    }

    return res.json({
      message: `Review with id ${id} successfully updated`,
    });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", auth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedReview = await deleteReviewById(id);

    if (!deletedReview) {
      return res.status(404).json({
        message: `Review with id ${id} was not found`,
      });
    }

    return res.json({
      message: `Review with id ${id} successfully deleted`,
    });
  } catch (err) {
    next(err);
  }
});

export default router;