import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { profileId, action } = body as {
      profileId?: number;
      action?: "like" | "pass";
    };

    if (!profileId || (action !== "like" && action !== "pass")) {
      return NextResponse.json(
        { error: "Invalid profileId or action" },
        { status: 400 }
      );
    }

    const profile = db
      .prepare(
        `SELECT id, name, age, photo, bio, city_or_college, interests, has_liked_me
         FROM profiles WHERE id = ?`
      )
      .get(profileId) as
      | {
          id: number;
          name: string;
          age: number;
          photo: string;
          bio: string;
          city_or_college: string;
          interests: string;
          has_liked_me: number;
        }
      | undefined;

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Record the swipe so this profile never appears again
    db.prepare(
      `INSERT OR IGNORE INTO swipes (profile_id, action) VALUES (?, ?)`
    ).run(profileId, action);

    // Check for mutual match: only happens when user likes AND profile already liked user
    const isMatch = action === "like" && profile.has_liked_me === 1;

    if (isMatch) {
      db.prepare(`INSERT OR IGNORE INTO matches (profile_id) VALUES (?)`).run(
        profileId
      );
    }

    // Strip `has_liked_me` before returning profile details
    const { has_liked_me, ...safeProfile } = profile;

    return NextResponse.json({
      matched: isMatch,
      profile: isMatch
        ? {
            ...safeProfile,
            interests: JSON.parse(safeProfile.interests) as string[],
          }
        : null,
    });
  } catch (error) {
    console.error("POST /api/swipe error:", error);
    return NextResponse.json({ error: "Failed to record swipe" }, { status: 500 });
  }
}