import { Outlet, useNavigate, useLocation } from "react-router-dom"
import logo from "../assets/sound.jpg"
import { useState } from "react"

const DashboardLayout = ({ onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.pathname)

  const handleNavigation = (path) => {
    setActiveTab(path)
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#2D2D2D] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#F1E9E4] px-6 py-5 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2D2D2D] rounded-lg flex items-center justify-center">
            <img src={logo} alt="Sound Production Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-serif text-sm tracking-[0.15em] uppercase font-bold">Sound Production</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FDFCFB] border border-[#F1E9E4] text-[#6D6D6D] hover:bg-[#2D2D2D] hover:text-[#FDFCFB] hover:border-[#2D2D2D] transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Dil</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <footer className="bg-white border-t border-[#F1E9E4] px-4 py-3 flex justify-around items-center sticky bottom-0">
        <button
          onClick={() => handleNavigation("/dashboard/create")}
          className={`flex flex-col items-center gap-1 ${activeTab === "/dashboard/create" ? "text-[#D4AF37]" : "text-[#B0B0B0] hover:text-[#2D2D2D]"} transition-colors`}
        >
          <span>➕</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Create</span>
        </button>

        <button
          onClick={() => handleNavigation("/dashboard/read")}
          className={`flex flex-col items-center gap-1 ${activeTab === "/dashboard/read" ? "text-[#D4AF37]" : "text-[#B0B0B0] hover:text-[#2D2D2D]"} transition-colors`}
        >
          <span>📅</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Calendar</span>
        </button>

        <button
          onClick={() => handleNavigation("/dashboard/crud")}
          className={`flex flex-col items-center gap-1 ${activeTab === "/dashboard/crud" ? "text-[#D4AF37]" : "text-[#B0B0B0] hover:text-[#2D2D2D]"} transition-colors`}
        >
          <span>📖</span>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Reservations</span>
        </button>
      </footer>
    </div>
  )
}

export default DashboardLayout