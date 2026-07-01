import { useState, useMemo } from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, Filter, Check, ChevronRight } from 'lucide-react';
import { ArtClass, ArtMedium } from '../types';
import { ART_CLASSES } from '../data';

interface ClassCalendarProps {
  onRegister: (artClass: ArtClass) => void;
  registeredClassIds: string[];
}

export default function ClassCalendar({ onRegister, registeredClassIds }: ClassCalendarProps) {
  const [selectedMedium, setSelectedMedium] = useState<ArtMedium | 'All'>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  // Extract unique locations
  const locations = useMemo(() => {
    const locs = ART_CLASSES.map(c => c.location);
    return ['All', ...Array.from(new Set(locs))];
  }, []);

  // Filter classes
  const filteredClasses = useMemo(() => {
    return ART_CLASSES.filter(c => {
      const matchMedium = selectedMedium === 'All' || c.medium === selectedMedium;
      const matchLocation = selectedLocation === 'All' || c.location === selectedLocation;
      
      let matchDate = true;
      if (selectedDateFilter) {
        matchDate = c.date === selectedDateFilter;
      }
      
      return matchMedium && matchLocation && matchDate;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedMedium, selectedLocation, selectedDateFilter]);

  // Handle date click from calendar sidebar
  const handleDateSelect = (date: string) => {
    if (selectedDateFilter === date) {
      setSelectedDateFilter(null); // Toggle off
    } else {
      setSelectedDateFilter(date);
    }
  };

  // Small custom helper to format dates beautifully
  const formatLongDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
  };

  const formatShortDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      day: date.toLocaleDateString('en-US', { day: 'numeric' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
    };
  };

  return (
    <div id="calendar" className="scroll-mt-24 py-16 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm block mb-2">Class Schedule</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Our Upcoming Classes
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose a painting medium, pick a location that inspires you, and book your seat. 
            All tools, canvases, and expert guidance are included. No prior experience required!
          </p>
        </div>

        {/* Calendar and Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Sidebar Filters and Mini Calendar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Filter Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                <Filter className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-800 text-lg">Filter Schedule</h3>
              </div>

              {/* Medium Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-600 mb-2">Art Medium</label>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Watercolor', 'Acrylic', 'Sketching'].map((med) => (
                    <button
                      key={med}
                      onClick={() => {
                        setSelectedMedium(med as ArtMedium | 'All');
                        setSelectedDateFilter(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedMedium === med
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {med}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Venue / Location</label>
                <div className="space-y-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setSelectedDateFilter(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        selectedLocation === loc
                          ? 'bg-blue-50 text-blue-700 font-medium border border-blue-100'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-transparent'
                      }`}
                    >
                      <span className="truncate">{loc === 'All' ? 'All Venues' : loc}</span>
                      {selectedLocation === loc && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* July 2026 Interactive Calendar Widget */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                <h4 className="font-semibold text-slate-800">July 2026</h4>
                {selectedDateFilter && (
                  <button 
                    onClick={() => setSelectedDateFilter(null)} 
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    Clear Date
                  </button>
                )}
              </div>
              
              {/* Day Headings */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>

              {/* Calendar Grid Days (July 2026 starts on a Wednesday) */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-sm">
                {/* Empty days before Wednesday */}
                <div className="py-1"></div>
                <div className="py-1"></div>
                <div className="py-1"></div>

                {/* Days 1 to 31 */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `2026-07-${dayNum.toString().padStart(2, '0')}`;
                  
                  // Check if there is a class on this day
                  const classesOnThisDay = ART_CLASSES.filter(c => c.date === dateStr);
                  const hasClass = classesOnThisDay.length > 0;
                  const isSelected = selectedDateFilter === dateStr;

                  return (
                    <button
                      key={dayNum}
                      disabled={!hasClass}
                      onClick={() => handleDateSelect(dateStr)}
                      className={`relative py-1.5 rounded-lg transition-all font-medium ${
                        isSelected 
                          ? 'bg-amber-500 text-white font-bold shadow-md z-10Scale scale-105' 
                          : hasClass 
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 hover:scale-105 cursor-pointer font-semibold' 
                            : 'text-slate-300 pointer-events-none'
                      }`}
                      title={hasClass ? `${classesOnThisDay.length} class(es) scheduled` : ''}
                    >
                      {dayNum}
                      {hasClass && !isSelected && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-blue-100 border border-blue-200 rounded-full inline-block"></span>
                  <span>Class Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                  <span>Selected</span>
                </div>
              </div>
            </div>

            {/* Beginner Info Card */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10">
                <Sparkles className="w-32 h-32" />
              </div>
              <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Fox Fine Art Promise
              </h4>
              <p className="text-sm text-blue-100/90 leading-relaxed mb-4">
                "We provide all supplies—highest-grade professional paints, soft brushes, canvases, sketchpads, easel stands, and custom protective aprons. All you need to bring is your curiosity."
              </p>
              <div className="text-xs text-amber-300 font-mono tracking-wider uppercase">
                Zero Stress • 100% Encouraging
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Class List */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Filters Summary */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-slate-600">
                Showing <strong className="text-slate-900">{filteredClasses.length}</strong> classes
                {selectedMedium !== 'All' && <span> in <strong className="text-blue-600">{selectedMedium}</strong></span>}
                {selectedLocation !== 'All' && <span> at <strong className="text-blue-600">{selectedLocation}</strong></span>}
                {selectedDateFilter && <span> on <strong className="text-amber-600">{formatLongDate(selectedDateFilter)}</strong></span>}
              </div>
              
              {(selectedMedium !== 'All' || selectedLocation !== 'All' || selectedDateFilter) && (
                <button
                  onClick={() => {
                    setSelectedMedium('All');
                    setSelectedLocation('All');
                    setSelectedDateFilter(null);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* Class Cards */}
            {filteredClasses.length > 0 ? (
              <div className="space-y-6">
                {filteredClasses.map((artClass) => {
                  const isSoldOut = artClass.filledSeats >= artClass.maxSeats;
                  const isRegistered = registeredClassIds.includes(artClass.id);
                  const seatsLeft = artClass.maxSeats - artClass.filledSeats;
                  const dateInfo = formatShortDate(artClass.date);

                  return (
                    <div
                      key={artClass.id}
                      className={`bg-white rounded-2xl shadow-sm hover:shadow-md border transition-all duration-300 overflow-hidden flex flex-col md:flex-row ${
                        isRegistered ? 'border-green-200 ring-2 ring-green-50' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      {/* Date Block Left / Image Top */}
                      <div className="relative md:w-56 shrink-0 bg-slate-100">
                        <img
                          src={artClass.image}
                          alt={artClass.title}
                          className="w-full h-48 md:h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Floating Date Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl py-2 px-3 shadow-md text-center border border-slate-100">
                          <span className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 leading-none">
                            {dateInfo.weekday}
                          </span>
                          <span className="block text-2xl font-bold font-serif text-slate-900 leading-none mt-1">
                            {dateInfo.day}
                          </span>
                          <span className="block text-xs font-bold text-blue-600 mt-1 uppercase">
                            {dateInfo.month}
                          </span>
                        </div>

                        {/* Floating Medium Tag */}
                        <div className="absolute bottom-4 left-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                            artClass.medium === 'Watercolor' 
                              ? 'bg-sky-500 text-white' 
                              : artClass.medium === 'Acrylic' 
                                ? 'bg-indigo-500 text-white' 
                                : 'bg-amber-500 text-white'
                          }`}>
                            {artClass.medium}
                          </span>
                        </div>
                      </div>

                      {/* Content Middle */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-xl font-serif font-bold text-slate-900 hover:text-blue-600 transition-colors">
                              {artClass.title}
                            </h3>
                            <div className="text-right shrink-0">
                              <span className="text-2xl font-bold text-slate-900">${artClass.price}</span>
                              <span className="text-xs text-slate-500 block">incl. supplies</span>
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-none">
                            {artClass.description}
                          </p>

                          {/* Quick details */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-600 pb-4 mb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              <span>{artClass.time} ({artClass.duration})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="truncate" title={artClass.locationDetails}>
                                <strong>{artClass.location}</strong>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-slate-400" />
                              <span className="font-mono text-xs">Instructor: {artClass.instructor}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSoldOut ? (
                                <span className="text-red-600 font-semibold text-xs bg-red-50 px-2 py-0.5 rounded">
                                  Sold Out
                                </span>
                              ) : (
                                <span className="text-slate-500 text-xs">
                                  Seats available: <strong className="text-slate-800 font-mono font-medium">{seatsLeft}</strong> / {artClass.maxSeats}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-4 pt-1">
                          <span className="text-xs text-slate-400 italic">
                            {artClass.locationDetails.split('—')[0]}
                          </span>

                          {isRegistered ? (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl text-sm font-semibold border border-green-200">
                              <Check className="w-4 h-4 stroke-[3px]" />
                              <span>Registered</span>
                            </div>
                          ) : isSoldOut ? (
                            <button
                              disabled
                              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                            >
                              Class Full
                            </button>
                          ) : (
                            <button
                              onClick={() => onRegister(artClass)}
                              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center gap-1 group"
                            >
                              <span>Register Now</span>
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-800">No classes found</h3>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                  There are no art classes scheduled matching your active Art Medium or Venue filters. Try expanding your search options.
                </p>
                <button
                  onClick={() => {
                    setSelectedMedium('All');
                    setSelectedLocation('All');
                    setSelectedDateFilter(null);
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Safety & Cancellation Banner */}
            <div className="bg-slate-100/80 rounded-2xl p-6 border border-slate-200 text-sm text-slate-600 leading-relaxed">
              <h5 className="font-bold text-slate-800 mb-1">Frequently Asked Questions</h5>
              <p className="mb-2">
                <strong>What if I need to cancel?</strong> We understand life happens. Cancel up to 48 hours before class for a 100% refund or studio credit voucher.
              </p>
              <p>
                <strong>Age limit?</strong> Our courses are tailor-made for adults ages 30+. It is a calm, leisurely, and companionable environment where we paint at a comfortable, step-by-step pace.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
