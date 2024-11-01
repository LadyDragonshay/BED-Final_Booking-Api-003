import { PrismaClient } from "@prisma/client";

const updateReviewById = async (id, updatedReview) => {
  const prisma = new PrismaClient();
  const { userId, propertyId, ...rest } = updatedReview;

  try {
    const review = await prisma.review.update({
      where: { id },
      data: {
        ...rest,
        userId: userId || undefined,
        propertyId: propertyId || undefined,
      },
    });
    return review;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

export default updateReviewById;