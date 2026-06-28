import { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, X, Loader2, Menu, ChevronDown } from 'lucide-react';
import { useApi } from "../Auth/ApiHelper";
const API_BASE_URL = 'https://soundproduction.onrender.com/reservation';

export default function ReservationCRUD() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { authFetch } = useApi();
    const [editingId, setEditingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        contact: '',
        price: '',
        data: '',
        timeAM: '',
        timepm: '',
        photoshooting: false,
        status: "",
        details: '',
        paymentinadvance: '',
        locationam: '',
        locationpm: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch all reservations
    const fetchReservations = async () => {
        setLoading(true);
        setError('');
        try {
            console.log(`${API_BASE_URL}`);
            const response = await authFetch(`${API_BASE_URL}`);
            if (!response.ok) throw new Error('Failed to fetch reservations');
            const data = await response.json();
            setReservations(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    // Fetch single reservation by ID
    const fetchReservationById = async (id) => {
        try {
            const response = await authFetch(`${API_BASE_URL}/${id}`);
            if (!response.ok) throw new Error('Failed to fetch reservation');
            const data = await response.json();
            setFormData(data);
            setEditingId(id);
            setShowModal(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching reservation');
        }
    };

    // Create or Update reservation
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const url = editingId ? `${API_BASE_URL}/${editingId}` : `${API_BASE_URL}/`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await authFetch(url, {
                method,
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} reservation`);

            setSuccess(`Reservation ${editingId ? 'updated' : 'created'} successfully!`);
            setShowModal(false);
            resetForm();
            fetchReservations();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving reservation');
        }
    };

    // Delete reservation
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this reservation?')) return;

        setError('');
        setSuccess('');

        try {
            const response = await authFetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete reservation');

            setSuccess('Reservation deleted successfully!');
            fetchReservations();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting reservation');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            surname: '',
            contact: '',
            price: '',
            data: '',
            timeAM: '',
            timepm: '',
            photoshooting: false,
            status: "",
            details: '',
            paymentinadvance: '',
            locationam: '',
            locationpm: '',
        });
        setEditingId(null);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Load reservations on mount
    useEffect(() => {
        fetchReservations();
    }, []);

    const getStatusColor = (status) => {
        if (status === 'Rezervuar') return 'bg-green-100 text-green-800';
        if (status === 'Biseduar') return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-20">
            {/* Mobile Header */}
            <div className="sticky top-0 z-40 bg-white shadow-sm">
                <div className="px-4 py-4 sm:px-6">
                    <h1 className="text-2xl sm:text-4xl font-bold text-slate-900">Reservations</h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">Manage your bookings</p>
                </div>
            </div>

            <div className="px-4 py-4 sm:px-6 sm:py-6">
                {/* Alert Messages */}
                {error && (
                    <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm sm:text-base flex justify-between items-start gap-2">
                        <span className="flex-1">{error}</span>
                        <button onClick={() => setError('')} className="text-red-500 hover:text-red-700 flex-shrink-0">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm sm:text-base flex justify-between items-start gap-2">
                        <span className="flex-1">{success}</span>
                        <button onClick={() => setSuccess('')} className="text-green-500 hover:text-green-700 flex-shrink-0">
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Action Bar */}
                <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                    {/* <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-lg font-medium transition w-full sm:w-auto text-sm sm:text-base"
                    >
                        <Plus size={20} />
                        New Reservation
                    </button>
                    <button
                        onClick={fetchReservations}
                        disabled={loading}
                        className="px-4 py-3 sm:py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition disabled:opacity-50 w-full sm:w-auto text-sm sm:text-base"
                    >
                        {loading ? <Loader2 className="animate-spin inline mr-2" size={18} /> : 'Refresh'}
                    </button>
                    */}
                </div>


                {/* Mobile Card View & Desktop Table View */}
                {loading && reservations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                        <p className="text-sm sm:text-base">Loading reservations...</p>
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <p className="text-sm sm:text-base">No reservations found. Create your first one!</p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="sm:hidden space-y-3">
                            {reservations.map((reservation) => (
                                <div key={reservation.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    {/* Card Header - Always Visible */}
                                    <button
                                        onClick={() => setExpandedId(expandedId === reservation.id ? null : reservation.id)}
                                        className="w-full p-4 flex justify-between items-start hover:bg-slate-50 transition"
                                    >
                                        <div className="text-left flex-1">
                                            <h3 className="font-semibold text-slate-900 text-sm">
                                                {reservation.name} {reservation.surname}
                                            </h3>
                                            <p className="text-xs text-slate-600 mt-1">{reservation.contact}</p>
                                            <div className="flex gap-2 mt-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                                    {reservation.status}
                                                </span>
                                                <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                                                    ${reservation.price}
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronDown
                                            size={20}
                                            className={`text-slate-500 transition-transform flex-shrink-0 ${expandedId === reservation.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {/* Card Expanded Content */}
                                    {expandedId === reservation.id && (
                                        <div className="border-t border-slate-200 p-4 bg-slate-50 space-y-3 text-sm">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-slate-600">Date</p>
                                                    <p className="font-medium text-slate-900">{reservation.data}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-600">Time AM</p>
                                                    <p className="font-medium text-slate-900">{reservation.timeAM || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-600">Time PM</p>
                                                    <p className="font-medium text-slate-900">{reservation.timepm || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-600">Location AM</p>
                                                    <p className="font-medium text-slate-900 truncate">{reservation.locationam || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-600">Location PM</p>
                                                    <p className="font-medium text-slate-900 truncate">{reservation.locationpm || '-'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-600">Payment</p>
                                                    <p className="font-medium text-slate-900">{reservation.paymentinadvance || '-'}</p>
                                                </div>
                                            </div>

                                            {reservation.details && (
                                                <div>
                                                    <p className="text-xs text-slate-600">Details</p>
                                                    <p className="font-medium text-slate-900">{reservation.details}</p>
                                                </div>
                                            )}

                                            {reservation.photoshooting && (
                                                <div className="flex items-center gap-2 text-slate-700">
                                                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                                    <span className="text-xs">Photoshooting included</span>
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-3 border-t border-slate-200">
                                                <button
                                                    onClick={() => fetchReservationById(reservation.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-xs font-medium"
                                                >
                                                    <Edit2 size={16} />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(reservation.id)}
                                                    className="flex-1 flex items-center justify-center gap-2 p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition text-xs font-medium"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden sm:block bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Contact</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Price</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservations.map((reservation, idx) => (
                                            <tr key={reservation.id || idx} className="border-b border-slate-200 hover:bg-slate-50 transition">
                                                <td className="px-6 py-4 text-sm text-slate-900">
                                                    {reservation.name} {reservation.surname}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{reservation.contact}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{reservation.data}</td>
                                                <td className="px-6 py-4 text-sm font-medium text-slate-900">${reservation.price}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                                        {reservation.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm flex gap-2">
                                                    <button
                                                        onClick={() => fetchReservationById(reservation.id)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(reservation.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
                    <div className="bg-white rounded-t-2xl sm:rounded-lg shadow-xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                                {editingId ? 'Edit Reservation' : 'New Reservation'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-slate-500 hover:text-slate-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="First Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <input
                                    type="text"
                                    name="surname"
                                    placeholder="Last Name"
                                    value={formData.surname}
                                    onChange={handleInputChange}
                                    required
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="contact"
                                    placeholder="Contact"
                                    value={formData.contact}
                                    onChange={handleInputChange}
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <input
                                    type="text"
                                    name="price"
                                    placeholder="Price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="date"
                                    name="data"
                                    value={formData.data}
                                    onChange={handleInputChange}
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                >
                                    <option value="Rezervuar">Rezervuar</option>
                                    <option value="Biseduar">Biseduar</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="time"
                                    name="timeAM"
                                    value={formData.timeAM}
                                    onChange={handleInputChange}
                                    placeholder="Time AM"
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <input
                                    type="time"
                                    name="timepm"
                                    value={formData.timepm}
                                    onChange={handleInputChange}
                                    placeholder="Time PM"
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="locationam"
                                    placeholder="Location AM"
                                    value={formData.locationam}
                                    onChange={handleInputChange}
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <input
                                    type="text"
                                    name="locationpm"
                                    placeholder="Location PM"
                                    value={formData.locationpm}
                                    onChange={handleInputChange}
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="paymentinadvance"
                                    placeholder="Payment in Advance"
                                    value={formData.paymentinadvance}
                                    onChange={handleInputChange}
                                    className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <label className="flex items-center gap-3 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="photoshooting"
                                        checked={formData.photoshooting}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 rounded border-slate-300 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <span className="text-slate-700 text-sm font-medium">Photoshooting</span>
                                </label>
                            </div>

                            <textarea
                                name="details"
                                placeholder="Details"
                                value={formData.details}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />

                            {/* Modal Footer */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-3 sm:py-2 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition font-medium text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-3 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium text-sm"
                                >
                                    {editingId ? 'Update' : 'Create'} Reservation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}