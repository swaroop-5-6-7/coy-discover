"use client";

import React, { useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Home,
  Flame,
  Heart,
  X,
  MapPin,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Settings,
  EyeOff,
} from "lucide-react";

function SwipeCard({ profile, isTop, exitDirection, onSwipe }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const likeOpacity = useTransform(x, [30, 110], [0, 1]);
  const passOpacity = useTransform(x, [-110, -30], [1, 0]);

  const handleDragEnd = (_, info) => {
    const swipeThreshold = 90;
    if (info.offset.x > swipeThreshold) {
      onSwipe(profile.id, "like");
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe(profile.id, "pass");
    }
  };

  return (
    <motion.div
      custom={exitDirection}
      style={isTop ? { x, rotate } : {}}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.85}
      onDragEnd={isTop ? handleDragEnd : undefined}
      initial={{ scale: isTop ? 1 : 0.96, y: isTop ? 0 : 8, opacity: isTop ? 1 : 0.7 }}
      animate={{ scale: isTop ? 1 : 0.96, y: isTop ? 0 : 8, opacity: isTop ? 1 : 0.85 }}
      exit={(dir) => ({
        x: dir === "left" ? -450 : 450,
        rotate: dir === "left" ? -18 : 18,
        opacity: 0,
        transition: { duration: 0.25, ease: "easeOut" },
      })}
      className={`absolute inset-0 rounded-[28px] overflow-hidden bg-white border-2 border-[#18181B] shadow-[5px_5px_0px_#18181B] select-none flex flex-col ${
        isTop ? "cursor-grab active:cursor-grabbing z-20" : "z-10 pointer-events-none"
      }`}
    >
      {/* Top Photo Section */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#ECEAF6]">
        <img
          src={profile.photo}
          alt={profile.name}
          draggable={false}
          className="w-full h-full object-cover"
        />

        {/* Subtle bottom fade for contrast */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

        {/* LIKE Stamp (Coy Hot Pink) */}
        {isTop && (
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-6 left-5 bg-[#FF3B7F] text-white border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] font-extrabold text-2xl px-4 py-1 rounded-2xl -rotate-12 tracking-wide pointer-events-none"
          >
            CRUSH ♥
          </motion.div>
        )}

        {/* PASS Stamp (Coy Soft Lavender/Charcoal) */}
        {isTop && (
          <motion.div
            style={{ opacity: passOpacity }}
            className="absolute top-6 right-5 bg-white text-[#18181B] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] font-extrabold text-2xl px-4 py-1 rounded-2xl rotate-12 tracking-wide pointer-events-none"
          >
            PASS
          </motion.div>
        )}

        {/* College / City Pill Badge on Photo */}
        <div className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#18181B] text-xs font-bold text-[#18181B] shadow-sm">
          <MapPin className="w-3.5 h-3.5 text-[#FF3B7F] shrink-0" />
          <span>{profile.city_or_college}</span>
        </div>
      </div>

      {/* Bottom Clean White Info Card (Coy Style) */}
      <div className="p-5 bg-white text-[#18181B] space-y-2.5 shrink-0 border-t-2 border-[#18181B]">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#18181B]">
              {profile.name}
            </h2>
            <span className="text-xl font-semibold text-zinc-500">
              {profile.age}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#F3F2F8] text-zinc-600">
            <EyeOff className="w-3 h-3 text-[#FF3B7F]" /> Secret
          </span>
        </div>

        <p className="text-sm text-zinc-600 font-medium leading-snug line-clamp-2">
          {profile.bio}
        </p>

        {/* Pastel Interest Pills */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {profile.interests.map((interest, idx) => {
            const pastelStyles = [
              "bg-[#ECE9FE] text-[#4C1D95]",
              "bg-[#FFE4EE] text-[#9D174D]",
              "bg-[#FEF3C7] text-[#92400E]",
            ];
            return (
              <span
                key={interest}
                className={`px-3 py-1 text-xs font-bold rounded-full ${
                  pastelStyles[idx % pastelStyles.length]
                }`}
              >
                {interest}
              </span>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default function CoyApp() {
  const [activeTab, setActiveTab] = useState("discover");
  const [feed, setFeed] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchedProfile, setMatchedProfile] = useState(null);
  const [swiping, setSwiping] = useState(false);
  const [exitDirection, setExitDirection] = useState("right");

  useEffect(() => {
    async function loadData() {
      try {
        const [feedRes, matchesRes] = await Promise.all([
          fetch("/api/feed"),
          fetch("/api/matches"),
        ]);
        const feedData = await feedRes.json();
        const matchesData = await matchesRes.json();

        setFeed(feedData.profiles || []);
        setMatches(matchesData.matches || []);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSwipe = async (profileId, action) => {
    if (swiping) return;
    setSwiping(true);

    const dir = action === "pass" ? "left" : "right";
    setExitDirection(dir);

    // Wait one tick so AnimatePresence receives the updated exitDirection before unmounting the card
    requestAnimationFrame(() => {
      setFeed((prev) => prev.filter((p) => p.id !== profileId));
    });

    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, action }),
      });

      const data = await res.json();

      if (data.matched && data.profile) {
        setMatchedProfile(data.profile);
        setMatches((prev) => [data.profile, ...prev]);
      }
    } catch (err) {
      console.error("Swipe error:", err);
    } finally {
      setSwiping(false);
    }
  };

  const topProfile = feed[0];
  const nextProfile = feed[1];

  return (
    <div className="min-h-screen bg-[#F4F3F9] text-[#18181B] flex justify-center overflow-x-hidden">
      {/* Mobile-first container matching Coy's clean white app shell */}
      <div className="w-full max-w-md h-dvh flex flex-col bg-white sm:border-x sm:border-zinc-200 relative overflow-hidden">
        {/* Top Coy Header ("coy." + settings icon) */}
        <header className="px-5 pt-4 pb-3 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-baseline select-none">
            <span className="font-extrabold text-[26px] tracking-tight text-[#18181B]">
              coy
            </span>
            <span className="font-extrabold text-[28px] leading-none text-[#FF3B7F]">
              .
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-[#F3F2F8] text-xs font-bold text-zinc-600 capitalize">
              {activeTab}
            </span>
            <div className="w-9 h-9 rounded-full bg-[#F3F2F8] flex items-center justify-center text-zinc-700">
              <Settings className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Main Content Area (overflow-x-hidden prevents horizontal scrollbar while dragging) */}
        <main className="flex-1 relative overflow-x-hidden overflow-y-auto flex flex-col bg-white">
          {/* TAB 1: BLANK HOME TAB (kept blank per assignment instructions) */}
          {activeTab === "home" && <div className="flex-1 bg-white" />}

          {/* TAB 2: DISCOVER SWIPE TAB */}
          {activeTab === "discover" && (
            <div className="flex-1 flex flex-col justify-between px-5 pt-1 pb-5 overflow-hidden">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-9 h-9 border-4 border-[#FF3B7F] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : feed.length === 0 ? (
                /* Coy-Styled Empty State Card */
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full rounded-[28px] bg-white border-2 border-[#18181B] shadow-[5px_5px_0px_#18181B] p-7 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-[#ECE9FE] flex items-center justify-center text-[#FF3B7F]">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-[#18181B]">
                      You&apos;ve seen everyone
                    </h3>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                      No more profiles left in Discover right now. Check your mutual matches or come back later!
                    </p>
                    <button
                      onClick={() => setActiveTab("matches")}
                      className="w-full py-3.5 rounded-full bg-[#FF3B7F] text-white font-bold text-sm border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] active:translate-y-0.5 transition"
                    >
                      View Matches ({matches.length})
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Card Stack */}
                  <div className="relative flex-1 w-full my-1">
                    <AnimatePresence custom={exitDirection}>
                      {nextProfile && (
                        <SwipeCard
                          key={nextProfile.id}
                          profile={nextProfile}
                          isTop={false}
                          exitDirection={exitDirection}
                          onSwipe={handleSwipe}
                        />
                      )}
                      {topProfile && (
                        <SwipeCard
                          key={topProfile.id}
                          profile={topProfile}
                          isTop={true}
                          exitDirection={exitDirection}
                          onSwipe={handleSwipe}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Privacy Micro-Copy matching Coy's exact tone */}
                  <p className="text-center text-[11px] font-medium text-zinc-400 pt-3">
                    Swipes stay private. Only mutual likes are ever revealed.
                  </p>

                  {/* Coy Neo-Brutalist Pass & Like Buttons */}
                  <div className="pt-3 flex items-center justify-center gap-7 shrink-0">
                    <button
                      onClick={() => topProfile && handleSwipe(topProfile.id, "pass")}
                      aria-label="Pass"
                      className="w-16 h-16 rounded-full bg-[#F3F2F8] hover:bg-zinc-200 text-[#18181B] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex items-center justify-center active:translate-y-0.5 transition"
                    >
                      <X className="w-7 h-7 stroke-[2.75]" />
                    </button>

                    <button
                      onClick={() => topProfile && handleSwipe(topProfile.id, "like")}
                      aria-label="Like"
                      className="w-16 h-16 rounded-full bg-[#FF3B7F] hover:brightness-105 text-white border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] flex items-center justify-center active:translate-y-0.5 transition"
                    >
                      <Heart className="w-7 h-7 fill-white stroke-[2.25]" />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: MUTUAL MATCHES VIEW */}
          {activeTab === "matches" && (
            <div className="flex-1 px-5 pt-2 pb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold tracking-tight text-[#18181B]">
                  Your matches
                </h2>
                <span className="px-3 py-1 rounded-full bg-[#F3F2F8] text-xs font-extrabold text-zinc-700">
                  {matches.length}
                </span>
              </div>

              {matches.length === 0 ? (
                <div className="rounded-[24px] bg-[#F3F2F8] p-8 text-center space-y-3 mt-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#FFE4EE] text-[#FF3B7F] flex items-center justify-center mx-auto">
                    <Heart className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-[#18181B]">
                    No mutual matches yet
                  </p>
                  <p className="text-xs text-zinc-500">
                    Swipe right in Discover. When someone likes you back, they&apos;ll appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {matches.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F3F2F8] border border-transparent hover:border-[#18181B] transition"
                    >
                      <img
                        src={person.photo}
                        alt={person.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#18181B] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-base text-[#18181B] truncate">
                            {person.name}, {person.age}
                          </h3>
                        </div>
                        <p className="text-xs font-medium text-zinc-500 truncate">
                          {person.city_or_college}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FFE4EE] text-[#FF3B7F] text-xs font-extrabold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Match
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-center text-xs text-zinc-400 pt-2">
                We never reveal who liked you unless it&apos;s mutual.
              </p>
            </div>
          )}
        </main>

        {/* Bottom Tab Bar (Coy Light Pill Style) */}
        <nav className="h-18 py-2.5 px-6 bg-white border-t border-zinc-200 flex items-center justify-around shrink-0">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl text-xs font-bold transition ${
              activeTab === "home"
                ? "bg-[#FFE4EE] text-[#FF3B7F]"
                : "text-zinc-400 hover:text-zinc-700"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab("discover")}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl text-xs font-bold transition ${
              activeTab === "discover"
                ? "bg-[#FFE4EE] text-[#FF3B7F]"
                : "text-zinc-400 hover:text-zinc-700"
            }`}
          >
            <Flame className="w-5 h-5" />
            <span>Discover</span>
          </button>

          <button
            onClick={() => setActiveTab("matches")}
            className={`relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl text-xs font-bold transition ${
              activeTab === "matches"
                ? "bg-[#FFE4EE] text-[#FF3B7F]"
                : "text-zinc-400 hover:text-zinc-700"
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            <span>Matches</span>
            {matches.length > 0 && (
              <span className="absolute top-1 right-2 min-w-4 h-4 px-1 rounded-full bg-[#FF3B7F] text-white text-[10px] font-extrabold flex items-center justify-center border border-[#18181B]">
                {matches.length}
              </span>
            )}
          </button>
        </nav>

        {/* "IT'S A MATCH!" MODAL (Coy Neo-Brutalist Card) */}
        <AnimatePresence>
          {matchedProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-5"
            >
              <motion.div
                initial={{ scale: 0.9, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 16 }}
                className="w-full max-w-sm rounded-[30px] bg-white border-2 border-[#18181B] shadow-[6px_6px_0px_#18181B] p-6 text-center space-y-5"
              >
                {/* Decorative Coy Dot Banner */}
                <div className="w-full py-3 rounded-2xl bg-[#ECE9FE] flex items-center justify-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF3B7F] border border-[#18181B]" />
                  <span className="w-3.5 h-3.5 rounded-full bg-[#FF3B7F] border border-[#18181B]" />
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#18181B]">
                    It&apos;s a match!
                  </h2>
                  <p className="text-sm font-medium text-zinc-500">
                    You and <span className="font-bold text-[#18181B]">{matchedProfile.name}</span> both liked each other.
                  </p>
                </div>

                <div className="w-28 h-28 mx-auto rounded-full p-1 bg-[#FFE4EE] border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B]">
                  <img
                    src={matchedProfile.photo}
                    alt={matchedProfile.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="space-y-2.5 pt-1">
                  <button
                    onClick={() => {
                      setMatchedProfile(null);
                      setActiveTab("matches");
                    }}
                    className="w-full py-3.5 rounded-full bg-[#FF3B7F] text-white font-bold text-sm border-2 border-[#18181B] shadow-[3px_3px_0px_#18181B] active:translate-y-0.5 transition"
                  >
                    See Your Matches
                  </button>
                  <button
                    onClick={() => setMatchedProfile(null)}
                    className="w-full py-3 rounded-full bg-[#F3F2F8] text-[#18181B] font-bold text-sm hover:bg-zinc-200 transition"
                  >
                    Keep Swiping
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}