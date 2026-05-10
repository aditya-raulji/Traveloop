import { prisma } from '../lib/prisma';
import { CITIES } from '../lib/data/cities';

const CATEGORIES = ['Sightseeing', 'Food & Dining', 'Adventure', 'Culture', 'Shopping', 'Transport', 'Stay', 'Nature'];

const IMAGE_PATTERNS = {
  'Sightseeing': 'photo-1499856871958-5b9627545d1a',
  'Food & Dining': 'photo-1504674900247-0877df9cc836',
  'Adventure': 'photo-1551632811-561732d1e306',
  'Culture': 'photo-1518998053901-5348d3961a04',
  'Nature': 'photo-1441974231531-c6227db76b6e',
  'Shopping': 'photo-1483985988355-763728e1935b',
  'Transport': 'photo-1494515843206-f3117d3f51b7',
  'Stay': 'photo-1566073771259-6a8506099945'
};

const ADJECTIVES = ['Amazing', 'Historic', 'Beautiful', 'Traditional', 'Modern', 'Scenic', 'Thrilling', 'Relaxing', 'Famous', 'Hidden'];
const NOUNS = {
  'Sightseeing': ['Tour', 'Walk', 'Viewpoint', 'Monument', 'Landmark'],
  'Food & Dining': ['Tasting', 'Class', 'Market', 'Dinner', 'Experience'],
  'Adventure': ['Hike', 'Climb', 'Safari', 'Expedition', 'Trek'],
  'Culture': ['Museum', 'Temple', 'Show', 'Exhibition', 'Gallery'],
  'Nature': ['Park', 'Garden', 'Trail', 'Reserve', 'Beach'],
  'Shopping': ['Bazaar', 'Mall', 'Boutique Tour', 'Market', 'District'],
  'Transport': ['Cruise', 'Ride', 'Transfer', 'Pass', 'Journey'],
  'Stay': ['Hotel', 'Resort', 'Villa', 'Hostel', 'Lodge']
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(arr: any[]) {
  return arr[getRandomInt(0, arr.length - 1)];
}

async function main() {
  console.log('Clearing existing activities...');
  await prisma.activity.deleteMany({});
  
  console.log('Generating activities...');
  const activities = [];

  for (const city of CITIES) {
    // Generate 10-15 activities per city
    const numActivities = getRandomInt(10, 15);
    for (let i = 0; i < numActivities; i++) {
      const category = getRandomElement(CATEGORIES) as keyof typeof IMAGE_PATTERNS;
      const adjective = getRandomElement(ADJECTIVES);
      const noun = getRandomElement(NOUNS[category] || NOUNS['Sightseeing']);
      
      activities.push({
        name: `${adjective} ${city.name} ${noun}`,
        description: `Experience the best of ${city.name} with this ${adjective.toLowerCase()} ${noun.toLowerCase()}. A must-do for any visitor.`,
        category,
        city: city.name,
        country: city.country,
        avgCost: getRandomInt(0, 200),
        duration: getRandomInt(30, 480), // 30 mins to 8 hours
        imageUrl: `https://images.unsplash.com/${IMAGE_PATTERNS[category]}?w=800&q=80`,
        rating: Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1)) // 3.5 to 5.0
      });
    }
    
    // Ensure the topActivities from city data are also included
    for (const topActivityName of city.topActivities) {
      activities.push({
        name: topActivityName,
        description: `One of the most famous attractions in ${city.name}.`,
        category: 'Sightseeing', // default
        city: city.name,
        country: city.country,
        avgCost: getRandomInt(10, 50),
        duration: getRandomInt(60, 240),
        imageUrl: `https://images.unsplash.com/${IMAGE_PATTERNS['Sightseeing']}?w=800&q=80`,
        rating: Number((Math.random() * (5 - 4.5) + 4.5).toFixed(1)) // 4.5 to 5.0
      });
    }
  }

  console.log(`Seeding ${activities.length} activities...`);
  
  // Use createMany for bulk insert
  await prisma.activity.createMany({
    data: activities
  });
  
  console.log(`Successfully seeded ${activities.length} activities.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
