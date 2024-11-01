import { PrismaClient } from "@prisma/client";

const createProperty = async (newProperty) => {
  const prisma = new PrismaClient();
  try {
    console.log("Creating property with data:", newProperty);
    const { hostId, ...rest } = newProperty;

    const property = await prisma.property.create({
      data: {
        ...rest,
        host: { connect: { id: hostId } },
      },
    });
    return property;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
};

export default createProperty;