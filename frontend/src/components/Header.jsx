import { Menu, Plus, ArrowDownUp, RefreshCw } from 'lucide-react';
import { useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  console.log(currentPath)

  const navLinks = [
    { label: 'Tier List', href: '/TierList' },
    { label: 'Games', href: '/Games' },
    { label: 'Hall of Fame', href: '/HallOfFame' }
  ];

  const isActive = (href) => currentPath === href;

  return (
    // TODO: Poner borde gris claro
    <header className="bg-gradient-to-br from-slate-900 to-zinc-900 text-white">
      <div className="p-4 flex items-center justify-between">
        {/* Espacio izquierdo para balancear */}
        <div className="md:w-24" />
        
        {/* Links centrados */}
        <nav className="space-x-15">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              className={`transition-colors ${
                isActive(link.href) ? 'text-cyan-400' : 'hover:text-cyan-300'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Botón de menú a la derecha */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-md hover:bg-gray-600 active:bg-gray-500 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-0 w-52 bg-[#121212] bg-gradient-to-br from-slate-800 to-zinc-900 rounded-md shadow-xl z-10 p-2">
              <a
                href="/AddGame"
                className="flex items-center gap-x-2 px-4 py-2 text-sm rounded-md hover:bg-gray-600 active:bg-gray-500 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add new game
              </a>
              <a
                href="/UpdateTier"
                className="flex items-center gap-x-2 px-4 py-2 text-sm rounded-md hover:bg-gray-600 active:bg-gray-500 transition-colors"
              >
                <ArrowDownUp className="w-4 h-4" />
                Update tier list
              </a>
              <a
                href="/UpdateData"
                className="flex items-center gap-x-2 px-4 py-2 text-sm rounded-md hover:bg-gray-600 active:bg-gray-500 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Update data
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
