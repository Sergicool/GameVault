import { Menu, Plus, ArrowDownUp, RefreshCw, HardDrive, Upload } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname;
  const fileInputRef = useRef(null);

  const navLinks = [
    { label: 'Tier List', href: '/TierList' },
    { label: 'Games', href: '/Games' },
    { label: 'Hall of Fame', href: '/HallOfFame' },
    { label: 'Stats', href: '/Stats' }
  ];

  const menuOptions = [
    { label: 'Add new game', href: '/AddGame', icon: Plus },
    { label: 'Update tier list', href: '/UpdateTier', icon: ArrowDownUp },
    { label: 'Update data', href: '/UpdateData', icon: RefreshCw },
    { label: 'Download DB', href: 'http://localhost:3001/download-db', icon: HardDrive },
    { label: 'Import DB', action: () => fileInputRef.current.click(), icon: Upload }
  ];

  const isActive = (href) => currentPath === href;
  
  const menuRef = useRef(null);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("dbfile", file);

    try {
      const res = await fetch("http://localhost:3001/upload-db", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Base de datos importada correctamente");
      } else {
        throw new Error(data.error || "Error en la importación");
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

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
            <div className="absolute right-0 mt-1 w-52 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 shadow-md rounded-md border border-indigo-500/70 z-10 p-2">
              {/* Bloque de los tres primeros botones */}
              <div className="flex flex-col space-y-2">
                {menuOptions.map(({ label, href, icon: Icon, action }, idx) => {
                  if (label === "Download DB" || label === "Import DB") return null;

                  return (
                    <a
                      key={label}
                      href={href}
                      className="flex items-center gap-x-4 pl-3 py-2 text-sm rounded-md
                                hover:bg-gray-600/40 active:bg-gray-500/40 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </a>
                  );
                })}
              </div>

              {/* Divisor entre los grupos */}
              <div className="my-2 border-t-2 border-indigo-500/70" />

              {/* Bloque de Download e Import */}
              {menuOptions.map(({ label, href, icon: Icon, action }, idx) => {
                if (label !== "Download DB" && label !== "Import DB") return null;

                return (
                  <div key={label}>
                    {label === "Download DB" ? (
                      <a
                        href={href}
                        className="w-full flex items-center gap-x-4 pl-3 py-2 text-sm rounded-md 
                                  bg-indigo-500 text-white font-semibold 
                                  hover:bg-indigo-700 active:bg-indigo-800 
                                  transition-colors shadow-sm"
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                      </a>
                    ) : (
                      <button
                        onClick={action}
                        className="w-full flex items-center gap-x-4 pl-3 py-2 mt-2 text-sm rounded-md 
                                  bg-violet-500 text-white font-semibold 
                                  hover:bg-violet-700 active:bg-violet-800 
                                  transition-colors shadow-sm"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    )}
                  </div>
                );
              })}

            </div>

          )}
        </div>
      </div>

      {/* Input oculto para subir archivo */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".db"
        onChange={handleFileChange}
      />
    </header>
  );
}

export default Header;
