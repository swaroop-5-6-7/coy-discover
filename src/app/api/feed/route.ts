import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    // Select only profiles not yet in the swipes table.
    // Notice we DO NOT select `has_liked_me` so it is never leaked to the client!
    const rows = db
      .prepare(
        `
        SELECT id, name, age, photo, bio, city_or_college, interests
        FROM profiles
        WHERE id NOT IN (SELECT profile_id FROM swipes)
        ORDER BY id ASC
        `
      )
      .all() as Array<{
      id: number;
      name: string;
      age: number;
      photo: string;
      bio: string;
      city_or_college: string;
      interests: string;
    }>;

    const profiles = rows.map((row) => ({
      ...row,
      interests: JSON.parse(row.interests) as string[],
    }));

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("GET /api/feed error:", error);
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}