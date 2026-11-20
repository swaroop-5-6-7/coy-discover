import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "coy.db");
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read/write performance
db.pragma("journal_mode = WAL");

// 1. Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    photo TEXT NOT NULL,
    bio TEXT NOT NULL,
    city_or_college TEXT NOT NULL,
    interests TEXT NOT NULL,
    has_liked_me INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS swipes (
    profile_id INTEGER PRIMARY KEY,
    action TEXT NOT NULL CHECK(action IN ('like', 'pass')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS matches (
    profile_id INTEGER PRIMARY KEY,
    matched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES profiles(id)
  );
`);

// 2. Seed 32 mock profiles automatically if the table is empty
const countRow = db.prepare("SELECT COUNT(*) as count FROM profiles").get() as { count: number };

if (countRow.count === 0) {
  const seedProfiles = [
    {
      name: "Aanya",
      age: 21,
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80",
      bio: "Design student who rates cafes by their cold brew and playlist.",
      city_or_college: "BITS Pilani",
      interests: ["Coffee", "UI/UX", "Indie Music"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Rohan",
      age: 22,
      photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
      bio: "Building side projects by night, searching for the best momos by day.",
      city_or_college: "IIT Delhi",
      interests: ["Startups", "Badminton", "Street Food"],
      has_liked_me: 0,
    },
    {
      name: "Meera",
      age: 20,
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
      bio: "Bookworm & weekend hiker. Looking for someone to swap book recs with.",
      city_or_college: "Christ University, Bengaluru",
      interests: ["Reading", "Trekking", "Photography"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Kabir",
      age: 23,
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80",
      bio: "Guitarist in a college band. Yes, I know Wonderwall, no, I won't play it.",
      city_or_college: "Mumbai",
      interests: ["Guitar", "Concerts", "Films"],
      has_liked_me: 0,
    },
    {
      name: "Diya",
      age: 21,
      photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&auto=format&fit=crop&q=80",
      bio: "Always down for late-night drives and deep conversations about sci-fi.",
      city_or_college: "Manipal Institute of Technology",
      interests: ["Sci-Fi", "Night Drives", "Astrology"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Arjun",
      age: 22,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80",
      bio: "Training for my first half-marathon. Send running playlist recommendations!",
      city_or_college: "Pune",
      interests: ["Running", "Fitness", "Podcasts"],
      has_liked_me: 0,
    },
    {
      name: "Tara",
      age: 20,
      photo: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&auto=format&fit=crop&q=80",
      bio: "Thrifting enthusiast and amateur baker. My brownies have a 5-star rating.",
      city_or_college: "Delhi University",
      interests: ["Baking", "Thrifting", "Art"],
      has_liked_me: 0,
    },
    {
      name: "Vikram",
      age: 24,
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=80",
      bio: "Product designer who takes board game nights way too seriously.",
      city_or_college: "Bengaluru",
      interests: ["Board Games", "Design", "Cooking"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Sana",
      age: 21,
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80",
      bio: "Architecture major surviving on chai and deadline adrenaline.",
      city_or_college: "NIT Trichy",
      interests: ["Sketching", "Chai", "Travel"],
      has_liked_me: 0,
    },
    {
      name: "Dev",
      age: 22,
      photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=600&auto=format&fit=crop&q=80",
      bio: "F1 Sundays are non-negotiable. Looking for a fellow paddock analyst.",
      city_or_college: "VIT Vellore",
      interests: ["Formula 1", "Gaming", "Tech"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Naina",
      age: 20,
      photo: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
      bio: "Classical dancer learning hip-hop. Spontaneous plans > overthinking.",
      city_or_college: "Hyderabad",
      interests: ["Dance", "Movies", "Sushi"],
      has_liked_me: 0,
    },
    {
      name: "Siddharth",
      age: 23,
      photo: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&auto=format&fit=crop&q=80",
      bio: "Film photography and rooftop sunsets. Tell me your favorite underrated movie.",
      city_or_college: "IIT Bombay",
      interests: ["Cinema", "Photography", "Vinyl"],
      has_liked_me: 0,
    },
    {
      name: "Kavya",
      age: 21,
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80",
      bio: "Psychology student trying to psychoanalyze my own dog.",
      city_or_college: "Ashoka University",
      interests: ["Dogs", "Psychology", "Journaling"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Aditya",
      age: 22,
      photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=600&auto=format&fit=crop&q=80",
      bio: "Chess nerd and tennis player. Beat me in bullet chess and dinner is on me.",
      city_or_college: "IIT Madras",
      interests: ["Chess", "Tennis", "AI"],
      has_liked_me: 0,
    },
    {
      name: "Riya",
      age: 20,
      photo: "https://images.unsplash.com/photo-1514315384763-ba401779410f?w=600&auto=format&fit=crop&q=80",
      bio: "Collecting passport stamps and spicy ramen spots.",
      city_or_college: "SRM Chennai",
      interests: ["Ramen", "Solo Travel", "Anime"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Ishaan",
      age: 23,
      photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
      bio: "Stand-up comedy open-mic regular. Need someone to test new jokes on.",
      city_or_college: "Chandigarh",
      interests: ["Comedy", "Cricket", "Podcasts"],
      has_liked_me: 0,
    },
    {
      name: "Zoya",
      age: 21,
      photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&auto=format&fit=crop&q=80",
      bio: "Pottery class dropout, full-time plant mom.",
      city_or_college: "Symbiosis, Pune",
      interests: ["Plants", "Ceramics", "Matcha"],
      has_liked_me: 0,
    },
    {
      name: "Karan",
      age: 22,
      photo: "https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600&auto=format&fit=crop&q=80",
      bio: "DJing house parties on weekends, writing clean code on weekdays.",
      city_or_college: "IIIT Hyderabad",
      interests: ["Electronic Music", "Coding", "Basketball"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Ananya",
      age: 20,
      photo: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600&auto=format&fit=crop&q=80",
      bio: "Museum hopper and poetry writer. Let's get lost in a bookstore.",
      city_or_college: "Kolkata",
      interests: ["Poetry", "Museums", "History"],
      has_liked_me: 0,
    },
    {
      name: "Nikhil",
      age: 24,
      photo: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=600&auto=format&fit=crop&q=80",
      bio: "Rock climbing beginner. Currently nursing sore forearms.",
      city_or_college: "Bengaluru",
      interests: ["Bouldering", "Camping", "Specialty Coffee"],
      has_liked_me: 0,
    },
    {
      name: "Priya",
      age: 21,
      photo: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&auto=format&fit=crop&q=80",
      bio: "Biotech student fascinated by marine life and scuba diving.",
      city_or_college: "Goa",
      interests: ["Scuba Diving", "Beaches", "Documentaries"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Varun",
      age: 22,
      photo: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&auto=format&fit=crop&q=80",
      bio: "Amateur chef perfecting handmade pasta. Taste-testers welcome.",
      city_or_college: "NMIMS Mumbai",
      interests: ["Cooking", "Italian Food", "Football"],
      has_liked_me: 0,
    },
    {
      name: "Shreya",
      age: 20,
      photo: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80",
      bio: "Fashion styling student who thinks sneakers go with every outfit.",
      city_or_college: "NIFT Delhi",
      interests: ["Sneakers", "Fashion", "Reels"],
      has_liked_me: 0,
    },
    {
      name: "Aryan",
      age: 23,
      photo: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&auto=format&fit=crop&q=80",
      bio: "Astrophotography hobbyist. Ask me about the clearest stargazing spots.",
      city_or_college: "Jaipur",
      interests: ["Astronomy", "Road Trips", "Cameras"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Myra",
      age: 21,
      photo: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
      bio: "Piano player and K-drama binge watcher.",
      city_or_college: "Amity Noida",
      interests: ["Piano", "K-Dramas", "Bubble Tea"],
      has_liked_me: 0,
    },
    {
      name: "Rohan K.",
      age: 22,
      photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=600&auto=format&fit=crop&q=80",
      bio: "Table tennis champ of my hostel floor. Ready for a rematch anytime.",
      city_or_college: "NIT Surathkal",
      interests: ["Table Tennis", "Surfing", "Anime"],
      has_liked_me: 0,
    },
    {
      name: "Simran",
      age: 21,
      photo: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=600&auto=format&fit=crop&q=80",
      bio: "Bhangra dancer and food blogger exploring every hidden dhaba.",
      city_or_college: "Thapar University",
      interests: ["Dance", "Food Blogging", "Music"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Yash",
      age: 23,
      photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&auto=format&fit=crop&q=80",
      bio: "Open-source contributor and mechanical keyboard builder.",
      city_or_college: "IIIT Bangalore",
      interests: ["Keyboards", "Open Source", "Cycling"],
      has_liked_me: 0,
    },
    {
      name: "Nandini",
      age: 20,
      photo: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&auto=format&fit=crop&q=80",
      bio: "Debate society captain who actually enjoys listening more than arguing.",
      city_or_college: "St. Xavier's, Mumbai",
      interests: ["Debate", "Philosophy", "Sunsets"],
      has_liked_me: 0,
    },
    {
      name: "pranav",
      age: 22,
      photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&auto=format&fit=crop&q=80",
      bio: "Skateboarding around campus and editing travel vlogs.",
      city_or_college: "BITS Goa",
      interests: ["Skateboarding", "Video Editing", "Beaches"],
      has_liked_me: 1, // Will match if you swipe right!
    },
    {
      name: "Alisha",
      age: 21,
      photo: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&auto=format&fit=crop&q=80",
      bio: "Journalism major chasing good stories and better croissants.",
      city_or_college: "Lady Shri Ram College",
      interests: ["Writing", "Bakeries", "Theatre"],
      has_liked_me: 0,
    },
    {
      name: "Harsh",
      age: 23,
      photo: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&auto=format&fit=crop&q=80",
      bio: "FinTech intern by day, FIFA striker by night.",
      city_or_college: "DTU Delhi",
      interests: ["FIFA", "Finance", "Streetwear"],
      has_liked_me: 0,
    },
  ];

  const insert = db.prepare(`
    INSERT INTO profiles (name, age, photo, bio, city_or_college, interests, has_liked_me)
    VALUES (@name, @age, @photo, @bio, @city_or_college, @interests, @has_liked_me)
  `);

  const insertMany = db.transaction((profiles) => {
    for (const p of profiles) {
      insert.run({
        ...p,
        interests: JSON.stringify(p.interests),
      });
    }
  });

  insertMany(seedProfiles);
}

export default db;