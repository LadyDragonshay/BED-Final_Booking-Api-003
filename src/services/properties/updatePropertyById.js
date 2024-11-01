import { PrismaClient } from "@prisma/client";

const updatePropertyById = async (id, updatedProperty) => {
  const prisma = new PrismaClient();
  const { hostId, ...rest } = updatedProperty;

  try {
    const property = await prisma.property.update({
      where: { id },
      data: {
        ...rest,
        hostId: hostId || undefined,
      },
    });
    return property;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

export default updatePropertyById;