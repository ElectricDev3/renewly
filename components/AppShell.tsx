import { Logo } from "./Logo";
import { RenewlyView } from "./RenewlyView";

export function AppShell() {
  return (
    <div className="min-h-screen bg-parchment">
      <header className="border-b border-parchment-dim bg-parchment/80 px-6 py-4 backdrop-blur sm:px-10">
        <Logo />
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
        <RenewlyView />
      </main>
      <footer className="mx-auto max-w-5xl px-6 pb-8 text-xs text-mist sm:px-10">
        Renewly guarda todo en este navegador. Ningún dato se comparte con un servidor.
      </footer>
    </div>
  );
}
