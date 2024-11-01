import { PrismaClient } from "@prisma/client";

const getProperties = async (location, pricePerNight, amenities) => {
  const prisma = new PrismaClient();

  try {
    const whereClause = {};

    if (location) whereClause.location = location;
    if (pricePerNight) whereClause.pricePerNight = parseFloat(pricePerNight);
    if (amenities) {
      whereClause.amenities = {
        some: {
          name: amenities,
        },
      };
    }

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        amenities: true,
        host: true,
      },
    });

    return properties;
  } catch (error) {
    throw error;
  }
};

export default getProperties;