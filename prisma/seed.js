import { PrismaClient } from "@prisma/client";
import amenityData from '../src/data/amenities.json' with { type: 'json' };
import bookingData from '../src/data/bookings.json' with { type: 'json' };
import hostData from '../src/data/hosts.json' with { type: 'json' };
import propertyData from '../src/data/properties.json' with { type: 'json' };
import reviewData from '../src/data/reviews.json' with { type: 'json' };
import userData from '../src/data/users.json' with { type: 'json' };

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"]
});

async function main() {
  try {
    const { amenities } = amenityData;
    const { bookings } = bookingData;
    const { hosts } = hostData;
    const { properties } = propertyData;
    const { reviews } = reviewData;
    const { users } = userData;

    console.log('Starting to seed database...');

    // Clear existing data
    await prisma.$transaction([
      prisma.review.deleteMany(),
      prisma.booking.deleteMany(),
      prisma.propertyAmenity.deleteMany(),
      prisma.property.deleteMany(),
      prisma.amenity.deleteMany(),
      prisma.host.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Seed users
    console.log('Seeding users...');
    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          username: user.username,
          password: user.password,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          profilePicture: user.profilePicture || null,
        },
      });
    }

    // Seed hosts
    console.log('Seeding hosts...');
    for (const host of hosts) {
      await prisma.host.create({
        data: {
          id: host.id,
          username: host.username,
          password: host.password,
          name: host.name,
          email: host.email,
          phoneNumber: host.phoneNumber,
          profilePicture: host.profilePicture || null,
          aboutMe: host.aboutMe || null,
        },
      });
    }

    // Seed amenities
    console.log('Seeding amenities...');
    for (const amenity of amenities) {
      await prisma.amenity.create({
        data: {
          id: amenity.id,
          name: amenity.name,
        },
      });
    }

    // Seed properties and property amenities
    console.log('Seeding properties...');
    for (const property of properties) {
      await prisma.property.create({
        data: {
          id: property.id,
          title: property.title,
          description: property.description,
          location: property.location,
          pricePerNight: property.pricePerNight,
          bedroomCount: property.bedroomCount,
          bathRoomCount: property.bathRoomCount,
          maxGuestCount: property.maxGuestCount,
          rating: property.rating,
          hostId: property.hostId,
        },
      });

      // Create property amenities relationships
      // Assuming each property has 3-5 random amenities for demonstration
      const randomAmenities = amenities
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 3);

      for (const amenity of randomAmenities) {
        await prisma.propertyAmenity.create({
          data: {
            propertyId: property.id,
            amenityId: amenity.id,
          },
        });
      }
    }

    // Seed bookings
    console.log('Seeding bookings...');
    for (const booking of bookings) {
      await prisma.booking.create({
        data: {
          id: booking.id,
          userId: booking.userId,
          propertyId: booking.propertyId,
          checkinDate: new Date(booking.checkinDate),
          checkoutDate: new Date(booking.checkoutDate),
          numberOfGuests: booking.numberOfGuests,
          totalPrice: booking.totalPrice,
          bookingStatus: booking.bookingStatus,
        },
      });
    }

    // Seed reviews
    console.log('Seeding reviews...');
    for (const review of reviews) {
      await prisma.review.create({
        data: {
          id: review.id,
          userId: review.userId,
          propertyId: review.propertyId,
          rating: review.rating,
          comment: review.comment,
        },
      });
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});