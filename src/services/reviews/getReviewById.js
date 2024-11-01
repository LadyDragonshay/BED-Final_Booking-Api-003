import { PrismaClient } from "@prisma/client";

const getReviewById = async (id) => {
  const prisma = new PrismaClient();
  try {
    const review = await prisma.review.findUnique({
      where: { id: id.toString() },
    });

    if (!review) {
      return null;
    }

    return review;
  } catch (error) {
    throw error;
  }
};

export default getReviewById;