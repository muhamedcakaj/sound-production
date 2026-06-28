import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, AlertCircle, Clock, MapPin, User, Phone, DollarSign } from 'lucide-react';
import { useApi } from "../Auth/ApiHelper";
const ReadReservation = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [isSwipingMonth, setIsSwipingMonth] = useState(false);
  const swipeZoneRef = useRef(null);
  const calendarGridRef = useRef(null);
  const { authFetch } = useApi();
  
  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const dateString = formatLocalDate(selectedDate);
        const response = await authFetch(`https://soundproduction.onrender.com/reservation/date?data=${dateString}`);

        if (!response.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await response.json();
        setReservations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching reservations');
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [selectedDate]);

  // Improved swipe gesture handlers - only for month header
  const handleSwipeZoneTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setIsSwipingMonth(true);
  };

  const handleSwipeZoneTouchEnd = (e) => {
    if (!touchStart || !isSwipingMonth) return;

    const touchEnd = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const distance = touchStart - touchEnd;
    const verticalDistance = Math.abs(touchStartY - touchEndY);

    // Only register swipe if mostly horizontal (not vertical scroll)
    if (Math.abs(distance) > verticalDistance && Math.abs(distance) > 80) {
      if (distance > 80) {
        goToNextMonth();
      } else if (distance < -80) {
        goToPreviousMonth();
      }
    }

    setTouchStart(null);
    setTouchStartY(null);
    setIsSwipingMonth(false);
  };

  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const hasReservation = (day) => {
    if (reservations.length === 0) return false;
    const dateStr = formatLocalDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    return reservations.some(r => r.data === dateStr);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="aspect-square" />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day);
      const today = isToday(day);
      const hasRes = hasReservation(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            aspect-square rounded-xl font-bold text-base md:text-sm transition-all duration-200 ease-out
            flex items-center justify-center relative active:scale-95
            ${selected
              ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg'
              : hasRes
                ? 'bg-amber-50 text-gray-900 border-2 border-amber-400 active:bg-amber-100'
                : today
                  ? 'bg-gray-100 text-gray-900 border-2 border-teal-500 active:bg-gray-200'
                  : 'bg-white text-gray-900 active:bg-gray-50'
            }
          `}
        >
          {day}
          {hasRes && !selected && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          )}
        </button>
      );
    }

    return days;
  };

  const monthYear = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                Rezervimet
              </h1>
              <p className="text-gray-600 text-xs md:text-sm">Menaxhoni dhe shikoni të gjitha rezervimet tuaja</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Calendar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              {/* Month Navigation - Swipe Zone */}
              <div
                ref={swipeZoneRef}
                onTouchStart={handleSwipeZoneTouchStart}
                onTouchEnd={handleSwipeZoneTouchEnd}
                className="flex items-center justify-between mb-6 py-2 px-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <button
                  onClick={goToPreviousMonth}
                  className="p-3 md:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:bg-gray-200"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-6 md:w-5 h-6 md:h-5 text-gray-700" />
                </button>

                <h2 className="text-lg md:text-xl font-bold text-gray-900 min-w-40 text-center select-none">
                  {monthYear}
                </h2>

                <button
                  onClick={goToNextMonth}
                  className="p-3 md:p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 active:bg-gray-200"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-6 md:w-5 h-6 md:h-5 text-gray-700" />
                </button>
              </div>

              {/* Swipe Hint */}
              <div className="text-center text-xs text-gray-500 mb-4 md:mb-6 select-none">
                Swipe left/right to change month
              </div>

              {/* Calendar Grid */}
              <div ref={calendarGridRef} className="transition-all duration-300">
                {/* Week day headers */}
                <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-4">
                  {weekDays.map(day => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold text-gray-600 py-2 uppercase tracking-wider"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {renderCalendarDays()}
                </div>
              </div>
            </div>
          </div>

          {/* Reservations List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {selectedDate?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm mt-1">
                  {loading ? 'Loading reservations...' : `${reservations.length} reservation${reservations.length !== 1 ? 's' : ''}`}
                </p>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin mb-4" />
                  <p className="text-gray-600 text-sm">Loading reservations...</p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900 text-sm">Error</p>
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                </div>
              )}

              {!loading && !error && reservations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 bg-gray-100 rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium text-sm">No reservations for this date</p>
                  <p className="text-gray-500 text-xs mt-1">Select another date to view reservations</p>
                </div>
              )}

              {!loading && !error && reservations.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                  {reservations.map((reservation, index) => (
                    <div
                      key={reservation.id || index}
                      className="p-4 border-l-4 border-l-teal-500 bg-gradient-to-r from-teal-50 to-transparent rounded-lg hover:shadow-md transition-all duration-300 active:scale-95"
                    >
                      {/* Header with name and status */}
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <User className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">
                              {reservation.name} {reservation.surname}
                            </h4>
                          </div>
                        </div>
                        {reservation.status && (
                          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${getStatusColor(reservation.status)}`}>
                            {reservation.status}
                          </span>
                        )}
                      </div>

                      {/* Time and Location */}
                      <div className="space-y-2 mb-3">
                        {reservation.timeAM && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-gray-700">
                              <span className="font-semibold">Paradite:</span> {reservation.timeAM}
                            </span>
                          </div>
                        )}
                       {reservation.locationam && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-gray-700 truncate">
                            {reservation.locationam}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Location */}
                      <div className="space-y-2 mb-3">
                           {reservation.timepm && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-gray-700">
                              <span className="font-semibold">Pasdite:</span> {reservation.timepm}
                            </span>
                          </div>
                        )}
                        {reservation.locationpm && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-gray-700 truncate">
                            {reservation.locationpm}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Contact and Price */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {reservation.contact && (
                          <div className="flex items-center gap-2 min-w-0">
                            <Phone className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs md:text-sm text-gray-700 truncate">{reservation.contact}</span>
                          </div>
                        )}
                        {reservation.price && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-xs md:text-sm font-semibold text-gray-900">{reservation.price}</span>
                          </div>
                        )}
                      </div>

                      {/* Details and Payment */}
                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        {reservation.details && (
                          <div className="text-xs md:text-sm text-gray-700">
                            <span className="font-semibold">Detajet:</span> {reservation.details}
                          </div>
                        )}
                        {reservation.photoshooting && (
                          <div className="inline-block px-2 md:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold border border-purple-300">
                            📸 Photoshooting
                          </div>
                        )}
                        {reservation.paymentinadvance && (
                          <div className="text-xs md:text-sm text-gray-700">
                            <span className="font-semibold">Pagesa Paraprake:</span> {reservation.paymentinadvance}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        /* Prevent text selection during swipe */
        .select-none {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }

        /* Better mobile touch feedback */
        button {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default ReadReservation;