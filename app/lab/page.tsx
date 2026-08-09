import HeroText from "@/components/ui/hero-shutter-text";

export const metadata = { robots: { index: false, follow: false } };

export default function LabPreview() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      <HeroText />
    </main>
  );
}
