import { Menu, Plus, ArrowDownUp, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  console.log(currentPath)

  const navLinks = [
    { label: 'Tier List', href: '/TierList' },
    { label: 'Games', href: '/Games' },
    { label: 'Hall of Fame', href: '/HallOfFame' },
    { label: 'Stats', href: '/Stats' }
  ];

  const menuOptions = [
    { label: 'Add new game', href: '/AddGame', icon: Plus },
    { label: 'Update tier list', href: '/UpdateTier', icon: ArrowDownUp },
    { label: 'Update data', href: '/UpdateData', icon: RefreshCw }
  ];

  const isActive = (href) => currentPath === href;
  
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="
      fixed w-full z-100
      bg-gradient-to-t from-slate-950 via-slate-950 to-slate-900
      border-b border-indigo-500
      font-mono font-bold text-lg text-gray-100
    ">
      <div className="p-3 flex">
        {/* Contenedor de navegación */}
        <div className="flex-1 flex justify-center">
          <nav className="
            bg-indigo-950/50
            border border-indigo-500 rounded-lg
            inset-shadow-sm inset-shadow-zinc-900
            px-10 py-2 space-x-20
          ">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  isActive(link.href)
                    ? 'text-violet-200 drop-shadow-[0_0_10px_#22d3ee]'
                    : 'hover:text-violet-300'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        {/* Menú desplegable */}
        <div className="absolute right-6" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-md transition-colors ${
              menuOpen
                ? 'bg-indigo-600'
                : 'hover:bg-indigo-600 active:bg-gray-500'
            }`}
          >
            <Menu className="w-6 h-6" />
          </button>


          {menuOpen && (
            <div className="absolute right-0 mt-1 w-52 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 shadow-md rounded-md border border-indigo-500/70 z-10 p-2">
              {menuOptions.map(({ label, href, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  className="flex items-center gap-x-2 px-4 py-2 text-sm rounded-md hover:bg-gray-600 active:bg-gray-500 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
