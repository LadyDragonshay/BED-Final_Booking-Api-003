import { PrismaClient } from "@prisma/client";

const deleteBookingById = async (id) => {
  const prisma = new PrismaClient();

  try {
    const booking = await prisma.booking.delete({
      where: { id },
    });
    return booking;
  } catch (error) {
    if (error.code === "P2025") { //The P2025 error in Prisma is a "Record to delete does not exist" error. 
      return null;
    }
    throw error;
  }
};

export default deleteBookingById;