const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'dap.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS businesses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    phone TEXT,
    website TEXT,
    image_url TEXT,
    owner_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    business_id INTEGER NOT NULL,
    reviewer_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id)
  );
`);

// Seed with sample data if empty
const count = db.prepare('SELECT COUNT(*) as cnt FROM businesses').get();
if (count.cnt === 0) {
  const insert = db.prepare(`
    INSERT INTO businesses (name, category, description, address, city, state, phone, website, image_url, owner_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const businesses = [
    ['Sweet Auburn Bread Co.', 'Food & Dining', 'Award-winning artisan bakery crafting hand-made breads, pastries and sandwiches inspired by Southern tradition.', '234 Auburn Ave NE', 'Atlanta', 'GA', '(404) 555-0101', 'https://sweetauburn.com', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600', 'Sherri Davis'],
    ['Trap Music Museum', 'Arts & Entertainment', 'An immersive art experience celebrating the culture and impact of trap music and its Atlanta roots.', '630 Travis St NW', 'Atlanta', 'GA', '(404) 555-0102', 'https://trapmusicmuseum.net', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600', 'T.I. Harris'],
    ['Harlem Haberdashery', 'Shopping', 'Upscale streetwear and custom fashion boutique in the heart of Harlem, celebrating Black style and creativity.', '245 Malcolm X Blvd', 'New York', 'NY', '(212) 555-0103', 'https://harlemhaberdashery.com', 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600', 'Carlton Brown'],
    ['Bludorn Restaurant', 'Food & Dining', 'Contemporary American cuisine with Southern flair, featuring locally sourced ingredients and innovative cocktails.', '807 Taft St', 'Houston', 'TX', '(713) 555-0104', 'https://bludorn.com', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', 'Aaron Bludorn'],
    ['Mahogany Books', 'Books & Education', 'Independent Black-owned bookstore dedicated to books by and about people of the African diaspora.', '1231 Good Hope Rd SE', 'Washington', 'DC', '(202) 555-0105', 'https://mahoganybooks.com', 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600', 'Derrick Young'],
    ['The Shade Room', 'Media & Tech', 'Digital media company and pop culture news platform with millions of followers across social media.', '6500 Wilshire Blvd', 'Los Angeles', 'CA', '(323) 555-0106', 'https://theshaderoom.com', 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600', 'Angelica Nwandu'],
    ['Curl Ambassadors', 'Beauty & Wellness', 'Premier natural hair salon specializing in loc maintenance, protective styles, and curl definition for all textures.', '4321 Martin Luther King Jr Dr', 'Chicago', 'IL', '(312) 555-0107', 'https://curlambassadors.com', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600', 'Keisha Williams'],
    ['Trap Yoga Bae', 'Health & Fitness', 'Inclusive yoga and wellness studio blending hip-hop music with mindfulness practices in a welcoming community space.', '800 Peachtree St NE', 'Atlanta', 'GA', '(404) 555-0108', 'https://trapyogabae.com', 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600', 'Kimberlyn "Kimbae" Mathis'],
    ['Black Feast', 'Food & Dining', 'A celebrated supper club and catering company showcasing the rich culinary traditions of the African diaspora.', '2200 S Michigan Ave', 'Chicago', 'IL', '(312) 555-0109', 'https://blackfeast.com', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600', 'Jared Leonard'],
    ['Melanin Essentials', 'Beauty & Wellness', 'Clean beauty brand formulating skincare products specifically designed for melanin-rich skin tones.', '120 W 125th St', 'New York', 'NY', '(212) 555-0110', 'https://melaninessentials.com', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600', 'Tiffany James'],
    ['Black Tech Nation', 'Media & Tech', 'Technology accelerator and community organization empowering Black tech entrepreneurs and innovators.', '100 Innovation Blvd', 'Pittsburgh', 'PA', '(412) 555-0111', 'https://blacktechnation.com', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600', 'Evan Frazier'],
    ['Noire Nail Bar', 'Beauty & Wellness', 'Luxury nail studio offering premium nail art, gel services, and wellness treatments in a chic atmosphere.', '555 Peachtree Pkwy', 'Atlanta', 'GA', '(404) 555-0112', 'https://noirenailbar.com', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600', 'Tiara Scott'],
  ];

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(...item);
    }
  });
  insertMany(businesses);

  // Seed some reviews
  const insertReview = db.prepare(`
    INSERT INTO reviews (business_id, reviewer_name, rating, comment)
    VALUES (?, ?, ?, ?)
  `);
  const reviews = [
    [1, 'Marcus J.', 5, 'The sourdough here is absolutely incredible. Best bread I\'ve ever had. Supports the community too!'],
    [1, 'Tanya W.', 4, 'Great pastries and wonderful staff. Lines can be long on weekends but worth the wait.'],
    [2, 'Derek P.', 5, 'An unforgettable experience. The exhibits really capture the culture and history of trap music.'],
    [3, 'Simone R.', 5, 'Beautiful clothes and amazing craftsmanship. Proud to support this business every time I\'m in Harlem.'],
    [4, 'James A.', 5, 'Exceptional food and warm hospitality. The shrimp and grits are a must-try.'],
    [5, 'Lisa B.', 5, 'My favorite bookstore in DC. The curation is phenomenal and the staff always give great recommendations.'],
    [5, 'Kevin T.', 5, 'So important to have a space like this. Great selection of titles and community events.'],
    [7, 'Amber G.', 5, 'My locs have never looked better. Keisha is a true artist and the atmosphere is so welcoming.'],
    [8, 'Raven M.', 5, 'Trap Yoga is a vibe! Kimbae creates a safe, energetic space for everyone. Highly recommend.'],
  ];
  const insertManyReviews = db.transaction((items) => {
    for (const item of items) {
      insertReview.run(...item);
    }
  });
  insertManyReviews(reviews);
}

module.exports = db;
