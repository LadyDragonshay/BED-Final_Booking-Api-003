import { PrismaClient } from "@prisma/client";

const createReview = async (newReview) => {
  const prisma = new PrismaClient();
  const { userId, propertyId, ...rest } = newReview;

  const review = await prisma.review.create({
    data: {
      ...rest,
      user: { connect: { id: userId } },
      property: { connect: { id: propertyId } },
    },
  });

  return review;
};

export default createReview;