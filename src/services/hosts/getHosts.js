import { PrismaClient } from "@prisma/client";

const getHosts = async (name) => {
  const prisma = new PrismaClient();

  try {
    console.log("Searching for host with name:", name);

    const hosts = await prisma.host.findMany({
      where: name
        ? {
            name,
          }
        : {},
      include: {
        properties: true,
      },
    });

    console.log("Found hosts:", hosts);

    return hosts;
  } catch (error) {
    console.error("Error in getHosts:", error);
    throw error;
  }
};

export default getHosts;