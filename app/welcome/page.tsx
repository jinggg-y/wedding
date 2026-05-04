import CeremonyCountdown from "./ceremony-countdown";

export default function WelcomePage() {
  return (
    <main className="min-h-screen bg-cloud-dancer flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="font-bold tracking-widest text-black uppercase">
          Dimitrije & Jing
        </h1>
        <p className="tracking-wide text-black/70">
          are getting married!
        </p>
        <CeremonyCountdown />
      </div>
    </main>
  );
}
