import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useApi } from "../Auth/ApiHelper";

const CreateReservation = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { authFetch } = useApi()
  const timeOptions = []
  for (let hour = 8; hour <= 22; hour++) {
    for (let min of [0, 30]) {
      const h = hour.toString().padStart(2, "0")
      const m = min.toString().padStart(2, "0")
      timeOptions.push(`${h}:${m}`)
    }
  }
  timeOptions.unshift("")

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    contact: "",
    price: "",
    paymentinadvance: "",
    data: "",
    timeAM: "",
    timepm: "",
    photoshooting: false,
    status: "Zgjedh Statusin e Rezervimit",
    details: "",
    locationam: "",
    locationpm: ""
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await authFetch("https://soundproduction.onrender.com/reservation", {
        method: "POST",
        body: JSON.stringify(formData)
      })

      if (!response.ok) throw new Error("Failed to create reservation. Please try again.")

      // Optional: Toast or snackbar
      alert("Reservation Created Successfully ✨")
      navigate("/dashboard/read")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#2D2D2D] pb-17">
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-[#1A1A1A]">Shto Rezervimin</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Ju lutemi plotësoni të dhënat më poshtë për të konfirmuar rezervimin tuaj</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-sm rounded-xl animate-in fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-gray-600 uppercase">Informacionet e Klientit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Emri"
                required
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              />
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Mbiemri"
                required
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              />
            </div>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Numri Kontaktues"
              required
              className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
            />
          </section>

          {/* Event Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-gray-600 uppercase">Detajet e eventit</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              />

              <select
                name="timeAM"
                value={formData.timeAM}
                onChange={handleChange}
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time === "" ? "Zgjedh Kohen Paradite (opsionale)" : time}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="locationam"
                value={formData.locationam}
                onChange={handleChange}
                placeholder="Lokacioni Paradite (opsionale)"
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              />
              <select
                name="timepm"
                value={formData.timepm}
                onChange={handleChange}
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              >
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time === "" ? "Zgjedh Kohen Pasdite (opsionale)" : time}
                  </option>
                ))}
              </select>


              <input
                type="text"
                name="locationpm"
                value={formData.locationpm}
                onChange={handleChange}
                placeholder="Lokacioni Pasdite (opsionale)"
                className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              />

            </div>
          </section>

          {/* Service Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold tracking-widest text-gray-600 uppercase">Detajet e Shërbimit</h3>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-14 px-4 rounded-2xl border border-gray-200 bg-white
               focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37]
               outline-none transition-all"
            >
              <option value="">Zgjedh Statusin e Rezervimit</option>
              <option value="Rezervuar">Rezervuar</option>
              <option value="Biseduar">Biseduar</option>
            </select>

            <div className="relative">
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Qmimi"
                required
                className="w-full h-14 pl-10 pr-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>

            </div>
            <div className="relative">
              <input
                type="text"
                name="paymentinadvance"
                value={formData.paymentinadvance}
                onChange={handleChange}
                placeholder="Pagesa Paraprake(Kopare)"
                required
                className="w-full h-14 pl-10 pr-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
            </div>

            <label className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer">
              <span className="text-sm font-medium">Photoshooting</span>
              <input
                type="checkbox"
                name="photoshooting"
                checked={formData.photoshooting}
                onChange={handleChange}
                className="h-5 w-5 accent-[#D4AF37]"
              />
            </label>

            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              rows="4"
              placeholder="Detajet e tjera..."
              className="w-full p-4 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] outline-none transition-all resize-none"
            ></textarea>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-[#2D2D2D] hover:bg-black text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span className="text-sm uppercase tracking-[0.3em]">Konfirmo Rezervimin</span>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateReservation