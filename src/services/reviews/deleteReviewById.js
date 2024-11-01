import { PrismaClient } from "@prisma/client";

const deleteReviewById = async (id) => {
  const prisma = new PrismaClient();

  try {
    const review = await prisma.review.delete({
      where: { id },
    });
    return review;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

export default deleteReviewById;