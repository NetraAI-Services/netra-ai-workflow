import { Navbar } from '@/components/layout/Navbar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background netra-page-bg flex flex-col">
      <Navbar />
      <main className="flex-1 pt-[5.5rem] relative z-[1]">
        <div className="max-w-screen-xl mx-auto px-5 py-8 lg:px-8 lg:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
