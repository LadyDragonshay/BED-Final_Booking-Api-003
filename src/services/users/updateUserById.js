import { PrismaClient } from "@prisma/client";

const updateUserById = async (id, updatedUser) => {
  const prisma = new PrismaClient();
  const user = await prisma.user.updateMany({
    where: { id },
    data: updatedUser,
  });

  return user;
};

export default updateUserById;