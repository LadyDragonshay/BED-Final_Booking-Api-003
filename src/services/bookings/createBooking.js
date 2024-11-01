import { PrismaClient } from "@prisma/client";

const createBooking = async (newBooking) => {
  const prisma = new PrismaClient();

  const booking = await prisma.booking.create({
    data: newBooking,
  });

  return booking;
};

export default createBooking;