import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
    try {
        const rows = db
            .prepare(
                `
        SELECT p.id, p.name, p.age, p.photo, p.bio, p.city_or_college, p.interests, m.matched_at
        FROM matches m
        JOIN profiles p ON p.id = m.profile_id
        ORDER BY m.matched_at DESC
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
                matched_at: string;
            }>;

        const matches = rows.map((row) => ({
            ...row,
            interests: JSON.parse(row.interests) as string[],
        }));

        return NextResponse.json({ matches });
    } catch (error) {
        console.error("GET /api/matches error:", error);
        return NextResponse.json(
            { error: "Failed to load matches" },
            { status: 500 }
        );
    }
}