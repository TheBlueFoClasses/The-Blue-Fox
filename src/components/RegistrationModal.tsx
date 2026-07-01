import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Clock, MapPin, Sparkles, Check, Download, AlertCircle } from 'lucide-react';
import { ArtClass, Booking } from '../types';

interface RegistrationModalProps {
  artClass: ArtClass | null;
  onClose: () => void;
  onSubmit: (booking: Booking) => void;
}

export default function RegistrationModal({ artClass, onClose, onSubmit }: RegistrationModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [seats, setSeats] = useState(1);
  const [notes, setNotes] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Trap focus roughly or focus heading on open
  useEffect(() => {
    if (artClass && modalRef.current) {
      modalRef.current.focus();
    }
  }, [artClass]);

  if (!artClass) return null;

  const seatsLeft = artClass.maxSeats - artClass.filledSeats;
  const availableSeatCount = Math.min(4, seatsLeft); // Max booking seats of 4 at a time

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }

    setIsSubmitting(true);

    // Simulate short network booking delay
    setTimeout(() => {
      const generatedCode = `FOX-${Math.floor(1000 + Math.random() * 9000)}-${artClass.id.split('-')[1].toUpperCase()}`;
      
      const newBooking: Booking = {
        id: generatedCode,
        classId: artClass.id,
        classTitle: artClass.title,
        classDate: artClass.date,
        classTime: artClass.time,
        classLocation: artClass.location,
        classPrice: artClass.price,
        name: name,
        email: email,
        phone: phone,
        seats: seats,
        dateBooked: new Date().toLocaleDateString(),
      };

      setSuccessBooking(newBooking);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleFinish = () => {
    if (successBooking) {
      onSubmit(successBooking);
    }
    onClose();
  };

  const formatLongDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden relative focus:outline-none my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Registration Form"
          className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!successBooking ? (
          /* REGISTRATION FORM */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Class Registration</span>
              <h2 id="modal-title" className="text-2xl font-serif font-bold text-slate-900 tracking-tight leading-tight pr-8">
                {artClass.title}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Hosted by <span className="font-semibold text-slate-700">{artClass.instructor}</span>
              </p>
            </div>

            {/* Quick Class Summary Card */}
            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 space-y-2.5 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{formatLongDate(artClass.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{artClass.time} ({artClass.duration})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="truncate"><strong>{artClass.location}</strong></span>
              </div>
              <div className="text-xs text-slate-500 pl-6">
                {artClass.locationDetails}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="reg-name" className="block text-sm font-semibold text-slate-700 mb-1">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="e.g. Helena Carter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-email" className="block text-sm font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="reg-phone" className="block text-sm font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    required
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div>
                  <label htmlFor="reg-seats" className="block text-sm font-semibold text-slate-700 mb-1">
                    Number of Seats
                  </label>
                  <select
                    id="reg-seats"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white"
                  >
                    {Array.from({ length: availableSeatCount }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i + 1 === 1 ? 'Seat' : 'Seats'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs text-blue-800 font-medium">Total Price:</span>
                  <span className="text-lg font-bold text-blue-900">${artClass.price * seats}</span>
                </div>
              </div>

              <div>
                <label htmlFor="reg-notes" className="block text-sm font-semibold text-slate-700 mb-1">
                  Special Notes / Request <span className="text-xs text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="reg-notes"
                  placeholder="Seating requests, dietary preferences (for beverages), access requirements, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Terms check */}
            <div className="text-xs text-slate-500 mt-5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              By registering, you agree to show up 10 minutes early. Cancellations made 48 hours in advance will receive full studio credits. Wine/coffee/tea included with registration where indicated.
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 text-sm font-semibold text-slate-700 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Securing Seat...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* SUCCESS SCREEN (BOOKING TICKET RECEIPT) */
          <div className="p-6 sm:p-8 text-center bg-slate-50">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50 shadow-sm animate-bounce">
              <Check className="w-8 h-8 text-green-600 stroke-[3px]" />
            </div>

            <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">Registration Secured!</span>
            <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight leading-tight mb-2">
              You are all set for art!
            </h2>
            <p className="text-slate-600 text-sm max-w-sm mx-auto mb-6">
              We have booked your seat(s) and sent a confirmation ticket with arrival directions to <strong className="text-slate-800">{successBooking.email}</strong>.
            </p>

            {/* Ticket Graphic */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-5 text-left shadow-sm max-w-sm mx-auto relative overflow-hidden mb-6">
              {/* Left and Right half circles in ticket */}
              <div className="absolute w-6 h-6 bg-slate-50 border-r border-slate-200 rounded-full -left-3 top-1/2 -translate-y-1/2"></div>
              <div className="absolute w-6 h-6 bg-slate-50 border-l border-slate-200 rounded-full -right-3 top-1/2 -translate-y-1/2"></div>

              <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
                <div>
                  <h4 className="font-serif font-bold text-slate-800 text-sm truncate max-w-[200px]">
                    {successBooking.classTitle}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">Booking Reference</p>
                  <p className="text-xs font-mono font-bold text-blue-600 uppercase">{successBooking.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                    {seats} {seats === 1 ? 'Seat' : 'Seats'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <strong className="text-slate-800">{formatLongDate(successBooking.classDate)}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <strong className="text-slate-800">{successBooking.classTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <strong className="text-slate-800 truncate max-w-[180px]">{successBooking.classLocation}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span>Registrant:</span>
                  <strong className="text-slate-800">{successBooking.name}</strong>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Ticket</span>
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
              >
                <span>Done & Return</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
