import { PrismaClient } from "@prisma/client";

const getPropertyById = async (id) => {
  const prisma = new PrismaClient();
  try {
    const property = await prisma.property.findUnique({
      where: { id: id.toString() },
    });

    if (!property) {
      return null;
    }

    return property;
  } catch (error) {
    console.error("Error in getPropertyById:", error);
    throw error;
  }
};

export default getPropertyById;