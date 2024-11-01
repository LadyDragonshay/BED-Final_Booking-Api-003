import { PrismaClient } from "@prisma/client";

const updateBookingById = async (id, updatedBooking) => {
  const prisma = new PrismaClient();
  const { userId, propertyId, ...rest } = updatedBooking;

  try {
    const booking = await prisma.booking.update({
      where: { id },
      data: {
        ...rest,
        userId: userId || undefined,
        propertyId: propertyId || undefined,
      },
    });
    return booking;
  } catch (error) {
    if (error.code === "P2025") {
      return null;
    }
    throw error;
  }
};

export default updateBookingById;