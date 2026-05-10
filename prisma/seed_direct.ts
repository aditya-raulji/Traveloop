import pg from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually
const envPath = path.join(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) envVars[match[1].trim()] = match[2].trim().replace(/^"|"$/g, '');
}

const DIRECT_URL = envVars['DIRECT_URL'] || envVars['DATABASE_URL'];
console.log('Connecting to:', DIRECT_URL?.substring(0, 50) + '...');

const client = new pg.Client({ connectionString: DIRECT_URL });

const CATEGORIES = ['Sightseeing', 'Food & Dining', 'Adventure', 'Culture', 'Shopping', 'Nature'];
const IMAGE_PATTERNS: Record<string, string> = {
  'Sightseeing': 'photo-1499856871958-5b9627545d1a',
  'Food & Dining': 'photo-1504674900247-0877df9cc836',
  'Adventure': 'photo-1551632811-561732d1e306',
  'Culture': 'photo-1518998053901-5348d3961a04',
  'Nature': 'photo-1441974231531-c6227db76b6e',
  'Shopping': 'photo-1483985988355-763728e1935b',
};
const NOUNS: Record<string, string[]> = {
  'Sightseeing': ['Tour', 'Walk', 'Viewpoint Visit', 'Guided Tour', 'Landmark Visit'],
  'Food & Dining': ['Food Tasting', 'Cooking Class', 'Market Visit', 'Dinner Experience', 'Street Food Tour'],
  'Adventure': ['Hiking Trail', 'Mountain Trek', 'Safari', 'Kayaking Tour', 'Cycling Adventure'],
  'Culture': ['Museum Visit', 'Temple Tour', 'Cultural Show', 'Art Exhibition', 'Heritage Walk'],
  'Nature': ['Nature Walk', 'Garden Tour', 'Wildlife Trail', 'Beach Excursion', 'Scenic Hike'],
  'Shopping': ['Bazaar Tour', 'Night Market', 'Artisan District', 'Local Souvenir Hunt', 'Shopping District Walk'],
};
const ADJECTIVES = ['Amazing', 'Historic', 'Beautiful', 'Traditional', 'Scenic', 'Thrilling', 'Relaxing', 'Hidden', 'Iconic', 'Unforgettable'];

const CITIES = [
  { name: "Paris", country: "France", topActivities: ["Eiffel Tower", "Louvre Museum", "Seine River Cruise", "Montmartre Walk"] },
  { name: "Tokyo", country: "Japan", topActivities: ["Senso-ji Temple", "Shibuya Crossing", "Tsukiji Market", "Shinjuku Gardens"] },
  { name: "Bali", country: "Indonesia", topActivities: ["Uluwatu Temple", "Tegalalang Rice Terrace", "Sacred Monkey Forest", "Mount Batur Trek"] },
  { name: "Rome", country: "Italy", topActivities: ["Colosseum", "Vatican Museums", "Trevi Fountain", "Pantheon", "Roman Forum"] },
  { name: "New York City", country: "USA", topActivities: ["Central Park", "Statue of Liberty", "The Met", "Broadway Show", "Times Square"] },
  { name: "London", country: "UK", topActivities: ["Tower of London", "British Museum", "London Eye", "Borough Market", "Buckingham Palace"] },
  { name: "Barcelona", country: "Spain", topActivities: ["Sagrada Família", "Park Güell", "Gothic Quarter Walk", "La Boqueria Market"] },
  { name: "Sydney", country: "Australia", topActivities: ["Sydney Opera House", "Bondi Beach Walk", "Sydney Harbour Bridge Climb"] },
  { name: "Cape Town", country: "South Africa", topActivities: ["Table Mountain", "Cape of Good Hope", "Boulders Beach Penguins"] },
  { name: "Rio de Janeiro", country: "Brazil", topActivities: ["Christ the Redeemer", "Sugarloaf Mountain", "Copacabana Beach", "Lapa Arches"] },
  { name: "Kyoto", country: "Japan", topActivities: ["Fushimi Inari Taisha", "Kinkaku-ji Golden Temple", "Arashiyama Bamboo Grove", "Gion District Walk"] },
  { name: "Marrakech", country: "Morocco", topActivities: ["Jemaa el-Fnaa", "Majorelle Garden", "Bahia Palace", "Medina Souks Tour"] },
  { name: "Vancouver", country: "Canada", topActivities: ["Stanley Park", "Granville Island", "Capilano Suspension Bridge"] },
  { name: "Amsterdam", country: "Netherlands", topActivities: ["Rijksmuseum", "Anne Frank House", "Canal Cruise", "Van Gogh Museum"] },
  { name: "Bangkok", country: "Thailand", topActivities: ["Grand Palace", "Wat Arun", "Chatuchak Weekend Market", "Floating Markets"] },
  { name: "Cairo", country: "Egypt", topActivities: ["Pyramids of Giza", "Egyptian Museum", "Khan el-Khalili", "Sphinx"] },
  { name: "Dubai", country: "UAE", topActivities: ["Burj Khalifa", "Dubai Mall", "Desert Safari", "Dubai Creek"] },
  { name: "Queenstown", country: "New Zealand", topActivities: ["Milford Sound Tour", "Bungy Jumping", "Skyline Gondola", "Lake Wakatipu Cruise"] },
  { name: "Istanbul", country: "Turkey", topActivities: ["Hagia Sophia", "Blue Mosque", "Grand Bazaar", "Bosphorus Cruise"] },
  { name: "Machu Picchu", country: "Peru", topActivities: ["Inca Trail Hike", "Huayna Picchu", "Temple of the Sun", "Sun Gate Trek"] },
];

function randInt(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randEl<T>(arr: T[]): T { return arr[randInt(0, arr.length - 1)]; }
function randRating(min: number, max: number) { return parseFloat((Math.random() * (max - min) + min).toFixed(1)); }
function cuid() { return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }

async function main() {
  await client.connect();
  console.log('Connected to database.');

  console.log('Clearing existing activity data...');
  await client.query('DELETE FROM "StopActivity"'); // delete children first
  await client.query('DELETE FROM "Activity"');


  const activities: any[] = [];

  for (const city of CITIES) {
    const count = randInt(8, 11);
    for (let i = 0; i < count; i++) {
      const cat = randEl(CATEGORIES);
      const adj = randEl(ADJECTIVES);
      const noun = randEl(NOUNS[cat] || NOUNS['Sightseeing']);
      activities.push({
        id: cuid(), name: `${adj} ${noun} in ${city.name}`,
        description: `Discover ${city.name}'s ${noun.toLowerCase()} — a ${adj.toLowerCase()} experience not to be missed.`,
        category: cat, city: city.name, country: city.country,
        avgCost: randInt(0, 150), duration: randInt(45, 420),
        imageUrl: `https://images.unsplash.com/${IMAGE_PATTERNS[cat]}?w=800&q=80`,
        rating: randRating(3.5, 5.0),
      });
    }
    for (const topName of city.topActivities) {
      activities.push({
        id: cuid(), name: topName,
        description: `One of the most celebrated experiences in ${city.name}. A must-see attraction for visitors.`,
        category: 'Sightseeing', city: city.name, country: city.country,
        avgCost: randInt(10, 55), duration: randInt(60, 240),
        imageUrl: `https://images.unsplash.com/${IMAGE_PATTERNS['Sightseeing']}?w=800&q=80`,
        rating: randRating(4.5, 5.0),
      });
    }
  }

  console.log(`Inserting ${activities.length} activities...`);
  for (const a of activities) {
    await client.query(
      `INSERT INTO "Activity" (id, name, description, category, city, country, "avgCost", duration, "imageUrl", rating) 
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [a.id, a.name, a.description, a.category, a.city, a.country, a.avgCost, a.duration, a.imageUrl, a.rating]
    );
  }
  console.log(`✅ Seeded ${activities.length} activities across ${CITIES.length} cities.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => client.end());
