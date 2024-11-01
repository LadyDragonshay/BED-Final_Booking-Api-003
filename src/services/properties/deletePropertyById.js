import { PrismaClient } from "@prisma/client";

const deletePropertyById = async (id) => {
  const prisma = new PrismaClient();

  try {
    const property = await prisma.property.delete({
      where: { id },
    });
    return property;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

export default deletePropertyById;