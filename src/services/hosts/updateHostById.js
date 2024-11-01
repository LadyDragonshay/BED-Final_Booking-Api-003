import { PrismaClient } from "@prisma/client";

const updateHostById = async (id, updatedHost) => {
  const prisma = new PrismaClient();
  const host = await prisma.host.updateMany({
    where: { id },
    data: updatedHost,
  });

  return host;
};

export default updateHostById;