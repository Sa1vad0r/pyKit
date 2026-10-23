import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getMission, MISSIONS } from "../_missions";
import MissionPlayer from "../_modes/MissionPlayer";

// Only the missions listed in _missions/index.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return MISSIONS.map((m) => ({ mission: String(m.card.number) }));
}

export async function generateMetadata({ params }: { params: Promise<{ mission: string }> }): Promise<Metadata> {
  const mission = getMission(Number((await params).mission));
  if (!mission) return {};
  return { title: `${mission.card.name} · Heist School`, description: mission.subtitle };
}

export default async function MissionPage({ params }: { params: Promise<{ mission: string }> }) {
  const mission = getMission(Number((await params).mission));
  if (!mission) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
        <MissionPlayer number={mission.card.number} />
      </main>
    </div>
  );
}
