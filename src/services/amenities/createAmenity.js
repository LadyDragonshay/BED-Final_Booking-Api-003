import { PrismaClient } from "@prisma/client";

const createAmenity = async (newAmenity) => {
  const prisma = new PrismaClient();

  const amenity = await prisma.amenity.create({
    data: newAmenity,
  });

  return amenity;
};

export default createAmenity;