import { Settings, Bell, ChartArea } from 'lucide-react';

export default function Header() {
  return (
    <header className="text-primary sticky top-0 z-20 border border-gray-100 bg-white shadow-xs">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded text-white">
            <ChartArea className="text-brand text-sm" strokeWidth={2.4} />
          </div>
          <h1 className="text-lg font-medium">Mubadala</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-800" />
            <span className="bg-primary absolute top-2 right-2 h-2 w-2 rounded-full"></span>
          </button>

          <button className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Settings className="h-5 w-5 text-gray-800" />
          </button>

          <button className="bg-brand hover:bg-brand-light flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium text-white transition-colors hover:cursor-pointer">
            AE
          </button>
        </div>
      </div>
    </header>
  );
}
