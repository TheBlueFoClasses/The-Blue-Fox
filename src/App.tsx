import { useState, useEffect } from 'react';
import { 
  Palette, Sparkles, Menu, X, ChevronRight, Info, Heart, Gift, 
  Map, Star, Compass, RefreshCw, Ticket, Trash2, Calendar, Check,
  Instagram, Facebook, Link as LinkIcon
} from 'lucide-react';
import { ART_CLASSES, INSTRUCTORS, TESTIMONIALS, GENERAL_GALLERY } from './data';
import { ArtClass, Booking, ArtMedium } from './types';
import ClassCalendar from './components/ClassCalendar';
import RegistrationModal from './components/RegistrationModal';
import ContactForm from './components/ContactForm';
import NewsletterForm from './components/NewsletterForm';

export default function App() {
  const [registeredBookings, setRegisteredBookings] = useState<Booking[]>([]);
  const [selectedClassForReg, setSelectedClassForReg] = useState<ArtClass | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load bookings from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('blue_fox_bookings');
      if (stored) {
        setRegisteredBookings(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error reading localStorage bookings', e);
    }
  }, []);

  // Handle new booking confirmation
  const handleBookingSubmit = (newBooking: Booking) => {
    const updated = [newBooking, ...registeredBookings];
    setRegisteredBookings(updated);
    localStorage.setItem('blue_fox_bookings', JSON.stringify(updated));
    
    // Auto-open bookings drawer to show ticket
    setTimeout(() => {
      setIsMyBookingsOpen(true);
    }, 600);
  };

  // Handle booking deletion/cancellation
  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this registration? You will receive full studio credit in your inbox.')) {
      const updated = registeredBookings.filter(b => b.id !== bookingId);
      setRegisteredBookings(updated);
      localStorage.setItem('blue_fox_bookings', JSON.stringify(updated));
    }
  };

  const registeredClassIds = registeredBookings.map(b => b.classId);

  // Helper scroll function for smooth anchor scrolling
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900 font-sans antialiased">
      
      {/* HEADER & NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo and Brand Name */}
            <div 
              onClick={() => scrollToSection('home')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-blue-100 border border-blue-200 flex items-center justify-center transition-transform group-hover:scale-105">
                <img 
                  src="/src/assets/images/blue_fox_logo_1782863083223.jpg" 
                  alt="The Blue Fox Mascot" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-blue-900 tracking-tight leading-none">
                  The Blue Fox
                </h1>
                <span className="text-xs font-mono font-semibold tracking-wider text-amber-500 uppercase block mt-0.5">
                  Traveling Art Studio
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
              <button onClick={() => scrollToSection('home')} className="hover:text-blue-600 transition-colors py-2">Home</button>
              <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors py-2">About</button>
              <button onClick={() => scrollToSection('programs')} className="hover:text-blue-600 transition-colors py-2">Programs</button>
              <button onClick={() => scrollToSection('calendar')} className="hover:text-blue-600 transition-colors py-2">Classes</button>
              <button onClick={() => scrollToSection('work')} className="hover:text-blue-600 transition-colors py-2">Student Work</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors py-2">Contact</button>
            </nav>

            {/* Booking Drawer Activator and Actions */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsMyBookingsOpen(true)}
                className="relative p-2.5 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all border border-slate-200 flex items-center gap-2 text-sm font-semibold"
                aria-label="View My Booked Classes"
              >
                <Ticket className="w-4.5 h-4.5" />
                <span>My Bookings</span>
                {registeredBookings.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {registeredBookings.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => scrollToSection('calendar')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-sm hover:shadow transition-all"
              >
                Book Class
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center gap-3 md:hidden">
              <button
                onClick={() => setIsMyBookingsOpen(true)}
                className="relative p-2 rounded-lg text-slate-600 border border-slate-200 flex items-center"
                aria-label="View My Booked Classes"
              >
                <Ticket className="w-5 h-5" />
                {registeredBookings.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-amber-500 text-slate-950 font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                    {registeredBookings.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-blue-600 border border-slate-200 rounded-lg transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 space-y-1 shadow-inner animate-fade-in">
            <button
              onClick={() => scrollToSection('home')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              About Studio
            </button>
            <button
              onClick={() => scrollToSection('programs')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              Art Programs
            </button>
            <button
              onClick={() => scrollToSection('calendar')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              Class Schedule
            </button>
            <button
              onClick={() => scrollToSection('work')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              Student Portfolio
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              Contact Us
            </button>
            <div className="pt-4 border-t border-slate-100 px-4">
              <button
                onClick={() => scrollToSection('calendar')}
                className="w-full text-center py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl"
              >
                Register For A Class
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="relative bg-white pt-6 pb-20 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-4 py-2 rounded-full border border-blue-100 font-semibold text-xs tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Now Traveling July 2026 Schedule</span>
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-extrabold text-slate-900 tracking-tight leading-none">
                Unleash Your <span className="text-blue-600 underline decoration-amber-400 decoration-wavy decoration-2">Inner Artist</span> on the Open Road.
              </h2>
              
              <p className="text-slate-600 text-lg sm:text-xl leading-relaxed font-normal">
                <strong>The Blue Fox</strong> is Asheville’s premier traveling art studio. We bring delightful, cozy, and professional watercolor, acrylic, and sketching workshops directly to local scenic vineyards, plant greenhouses, and coffee roasteries. 
              </p>

              <div className="text-sm font-semibold text-slate-700 border-l-4 border-amber-500 pl-4 py-1 text-left max-w-md mx-auto lg:mx-0">
                "Tailor-made for absolute beginners ages 30+. Every canvas includes gourmet beverages, premium art kits, and kind coaching."
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <button
                  onClick={() => scrollToSection('calendar')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>View Class Calendar</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-all flex items-center justify-center"
                >
                  Meet the Instructors
                </button>
              </div>

              {/* Quick Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-center sm:text-left">
                <div>
                  <strong className="block text-2xl font-bold text-slate-900">100%</strong>
                  <span className="text-xs text-slate-500">Supplies Provided</span>
                </div>
                <div>
                  <strong className="block text-2xl font-bold text-slate-900">1.2k+</strong>
                  <span className="text-xs text-slate-500">Happy Beginners</span>
                </div>
                <div>
                  <strong className="block text-2xl font-bold text-slate-900">4.9★</strong>
                  <span className="text-xs text-slate-500">Student Rating</span>
                </div>
              </div>

            </div>

            {/* Hero Right Banner Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[16/10] sm:aspect-video lg:aspect-[4/3]">
                <img
                  src="/src/assets/images/hero_traveling_studio_1782863093535.jpg"
                  alt="Cozy blue Volkswagen art studio van in lavender field with wood easels"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Glassmorphism Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/70 backdrop-blur-md text-white p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500 rounded-xl text-white">
                      <Map className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-300 font-medium">This Week’s Spot</p>
                      <h4 className="text-sm font-bold">Willow Cafe Glasshouse</h4>
                    </div>
                  </div>
                  <span className="text-xs font-mono bg-amber-400 text-slate-900 font-bold py-1 px-2.5 rounded-lg uppercase">
                    Plein Air
                  </span>
                </div>
              </div>

              {/* Decorative graphic blobs */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-400/10 rounded-full blur-xl -z-10"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/15 rounded-full blur-xl -z-10"></div>
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT THE STUDIO SECTION */}
      <section id="about" className="scroll-mt-24 py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-md border-4 border-white aspect-square max-w-md mx-auto">
                  <img
                    src="/src/assets/images/art_class_scene_1782863103858.jpg"
                    alt="Adult art students drinking wine and painting under warm string lights"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Mascot Quote Sticker */}
                <div className="absolute -bottom-6 -right-4 sm:right-6 bg-white rounded-2xl p-4 shadow-lg border border-slate-100 max-w-xs">
                  <div className="flex gap-2.5 items-start">
                    <span className="text-2xl">🎨</span>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "No grades, no judgment. Only warm drinks, gorgeous music, and the peaceful joy of wet paint."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm block">Our Creative Heart</span>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
                Gentle, Welcoming, Mobile Art Workshops
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                Founded in Asheville, <strong>The Blue Fox</strong> was born from a simple observation: so many adults believe they are "not creative" simply because they haven't held a brush in years. We wanted to strip away the clinical feeling of academic studios. 
              </p>
              
              <p className="text-slate-600 leading-relaxed">
                We packed premium easels and paints into our vintage blue van and hit the road to organize casual workshops in places you already love—greenhouses, gardens, and vineyards.
              </p>

              {/* Mission & Vision Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-3">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Our Warm Mission</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    To host gentle, high-quality, step-by-step painting spaces that foster creative courage and warm social connections for adults of all ages.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-3">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Our Guiding Vision</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    A world where artistic creation is valued as a nourishing, accessible weekly habit for mental wellness and gentle reflection.
                  </p>
                </div>
              </div>

              {/* Three distinct reasons to choose us */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold mt-1 shrink-0">1</span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Completely Supplies-Inclusive</h5>
                    <p className="text-xs text-slate-500">We furnish everything down to archival cotton paper, professional heavy-body acrylics, and cloth table covers.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold mt-1 shrink-0">2</span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Scenic & Inspiring Locations</h5>
                    <p className="text-xs text-slate-500">No sterile classrooms. Paint surrounding live ferns, overlooking rustic valleys, or sniffing gourmet roasting beans.</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold mt-1 shrink-0">3</span>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Beverages Included on the House</h5>
                    <p className="text-xs text-slate-500">Sip artisan coffee, garden tea, or regional vineyard wines as part of your standard seat registration.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* MEET THE INSTRUCTORS SUB-SECTION */}
          <div className="mt-20 pt-16 border-t border-slate-200">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-amber-500 font-semibold tracking-wide uppercase text-xs block mb-1">Passionate Art Educators</span>
              <h4 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
                Meet Your Friendly Mentors
              </h4>
              <p className="text-sm text-slate-600 mt-2">
                Our instructors aren’t just acclaimed regional artists; they are patient, warm guides dedicated to boosting your self-assurance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {INSTRUCTORS.map((teacher) => (
                <div key={teacher.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner mb-4">
                    <img 
                      src={teacher.avatar} 
                      alt={teacher.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">{teacher.specialty}</span>
                  <h5 className="text-lg font-bold font-serif text-slate-900 mt-1">{teacher.name}</h5>
                  <p className="text-xs text-slate-400 font-medium mb-3">{teacher.role}</p>
                  
                  <p className="text-slate-500 text-xs leading-relaxed">
                    "{teacher.bio}"
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ART PROGRAMS (CLASSES SUMMARY) */}
      <section id="programs" className="scroll-mt-24 py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm block mb-2">Our Class Mediums</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Three Distinct Mediums to Explore
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Each workshop medium is crafted to accommodate different sensory experiences and visual styles. Discover what sings to your heart.
            </p>
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Watercolor Card */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <img
                  src="/src/assets/images/watercolor_forest_1782863115766.jpg"
                  alt="Watercolor sample painting of dreamy forest paths"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-sky-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  Watercolor
                </span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Watercolor & Flow</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Learn to blend delicate colors with water. Work wet-on-wet, design translucent floral glazes, and capture soft mist. Highly therapeutic, low stress, and gorgeous.
                  </p>
                </div>
                
                <button
                  onClick={() => scrollToSection('calendar')}
                  className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors group"
                >
                  <span>See Watercolor Schedule</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Acrylic Card */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <img
                  src="/src/assets/images/acrylic_sunset_1782863123550.jpg"
                  alt="Acrylic sample sunset over misty pine forest mountain canvas"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-indigo-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  Acrylic
                </span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Textured Acrylic Landscapes</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Paint bold, rich colors that build structure. Practice mountain slopes using palette knives, stipple foam sprays, and layer vibrant skies with heavy-body paints.
                  </p>
                </div>
                
                <button
                  onClick={() => scrollToSection('calendar')}
                  className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors group"
                >
                  <span>See Acrylic Schedule</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Sketching Card */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex flex-col justify-between group hover:-translate-y-1 transition-transform duration-300">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-200">
                <img
                  src="/src/assets/images/pencil_sketch_1782863132031.jpg"
                  alt="Fine graphite pencil architectural street cafe illustration"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-4 left-4 bg-amber-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-sm">
                  Sketching
                </span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Graphite, Ink & Shading</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Master line illustration, one-point architectural perspectives, and moody charcoal shading. Turn local store fronts and botanical specimens into lovely ink vignettes.
                  </p>
                </div>
                
                <button
                  onClick={() => scrollToSection('calendar')}
                  className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors group"
                >
                  <span>See Sketching Schedule</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

          </div>

          {/* Specialty private event booking callout */}
          <div className="mt-16 bg-blue-50/50 rounded-3xl p-8 border border-blue-100/80 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl mt-1">🎁</span>
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-lg">Looking for a Private Art Experience?</h4>
                <p className="text-slate-600 text-sm mt-1 max-w-xl">
                  We host personalized birthday art parties, elegant corporate team cohesion workshops, couples painting dates, and botanical garden retreats. All supplies loaded on our van!
                </p>
              </div>
            </div>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              Inquire About Events
            </button>
          </div>

        </div>
      </section>

      {/* DYNAMIC CLASS SCHEDULE & CALENDAR SECTION */}
      <ClassCalendar 
        onRegister={(artClass) => setSelectedClassForReg(artClass)}
        registeredClassIds={registeredClassIds}
      />

      {/* STUDENT WORK / PORTFOLIO & TESTIMONIALS */}
      <section id="work" className="scroll-mt-24 py-20 bg-white border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-amber-500 font-semibold tracking-wide uppercase text-sm block mb-2">Our Student Showcase</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              What Our Beginner Artists Create
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Every single piece of artwork displayed below was completed by our students during their very first session. Check out their brilliant work!
            </p>
          </div>

          {/* Student Work Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {GENERAL_GALLERY.map((item) => (
              <div key={item.id} className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className="relative aspect-square overflow-hidden bg-slate-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-400 rounded-full font-mono uppercase">
                    {item.category}
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-sm font-serif">{item.title}</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Student Testimonials */}
          <div className="pt-12 border-t border-slate-100">
            <div className="text-center mb-10">
              <h3 className="text-xl font-serif font-bold text-slate-900">Loved by Asheville’s Creative Community</h3>
              <p className="text-xs text-slate-500 mt-1">Real reviews from our actual student registration files</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((review) => (
                <div key={review.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col justify-between">
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4.5 h-4.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed italic">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Student Profile Block */}
                  <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/60">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm leading-tight">{review.name}</h4>
                      <p className="text-xs text-slate-400">Age {review.age} • Taken <strong className="text-slate-600">{review.classTaken}</strong></p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT FORM */}
      <ContactForm />

      {/* NEWSLETTER SIGNUP AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewsletterForm />
      </div>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Logo/Description */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                  <img 
                    src="/src/assets/images/blue_fox_logo_1782863083223.jpg" 
                    alt="The Blue Fox Art Studio Logo" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-lg font-serif font-bold text-white tracking-tight">The Blue Fox Art Studio</h4>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                A creative, traveling art academy packing premium paints, fine drawing kits, and supportive instructors to organize delightful beginner workshops in gorgeous local spots.
              </p>
              
              {/* Phone + Email links */}
              <div className="space-y-1 text-xs">
                <p>Support: <a href="mailto:hello@bluefoxartstudio.com" className="hover:text-white transition-colors">hello@bluefoxartstudio.com</a></p>
                <p>Phone: <a href="tel:5554627463" className="hover:text-white transition-colors">(555) FOX-ART-STUDIO</a></p>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="md:col-span-3">
              <h5 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider mb-4">Explore Studio</h5>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition-colors">Home Landing</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About & Instructors</button></li>
                <li><button onClick={() => scrollToSection('programs')} className="hover:text-white transition-colors">Art Mediums</button></li>
                <li><button onClick={() => scrollToSection('calendar')} className="hover:text-white transition-colors">Class Calendar</button></li>
                <li><button onClick={() => scrollToSection('work')} className="hover:text-white transition-colors">Student Gallery</button></li>
              </ul>
            </div>

            {/* Classes Locations */}
            <div className="md:col-span-4">
              <h5 className="text-xs font-mono font-bold uppercase text-slate-200 tracking-wider mb-4">Our Traveling Spots</h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <strong className="text-slate-300 block">The Willow Cafe Greenhouse</strong>
                  <span className="text-slate-500">Asheville, NC — Botanical watercolors</span>
                </li>
                <li>
                  <strong className="text-slate-300 block">Harvest Ridge Vineyards</strong>
                  <span className="text-slate-500">Hendersonville, NC — Wine & acrylic sunset</span>
                </li>
                <li>
                  <strong className="text-slate-300 block">Urban Grind Roastery</strong>
                  <span className="text-slate-500">Black Mountain, NC — Coffee & sketching</span>
                </li>
                <li>
                  <strong className="text-slate-300 block">The Bloom Garden Emporium</strong>
                  <span className="text-slate-500">Weaverville, NC — Courtyard drawing</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Socials & Copyright Line */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-slate-600">
              © {new Date().getFullYear()} The Blue Fox Art Studio. All rights reserved. Built for Asheville art hobbyists.
            </p>

            <div className="flex items-center gap-4 text-slate-500">
              <span className="text-slate-700">Follow us:</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors" aria-label="Visit Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors" aria-label="Visit Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-amber-400 transition-colors" aria-label="Visit Pinterest">
                <LinkIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* TICKET REGISTRATION MODAL */}
      <RegistrationModal 
        artClass={selectedClassForReg}
        onClose={() => setSelectedClassForReg(null)}
        onSubmit={handleBookingSubmit}
      />

      {/* "MY BOOKINGS" SLIDE-OUT DRAWER */}
      {isMyBookingsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Drawer backdrop overlay */}
            <div 
              onClick={() => setIsMyBookingsOpen(false)} 
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            ></div>

            {/* Content holder */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  
                  {/* Drawer Header */}
                  <div className="bg-slate-950 px-6 py-6 text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-amber-400" />
                      <h2 id="slide-over-title" className="text-lg font-bold font-serif">
                        My Booked Classes
                      </h2>
                    </div>
                    <button 
                      onClick={() => setIsMyBookingsOpen(false)} 
                      className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Close Bookings Drawer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Drawer Content Body */}
                  <div className="flex-1 py-6 px-4 sm:px-6">
                    {registeredBookings.length === 0 ? (
                      <div className="text-center py-20">
                        <Ticket className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-800 text-base font-serif">No booked classes yet</h3>
                        <p className="text-slate-500 text-xs mt-2 max-w-xs mx-auto">
                          You haven't reserved any seats on our schedule. Find an art workshop you love on our calendar and secure your spot!
                        </p>
                        <button
                          onClick={() => {
                            setIsMyBookingsOpen(false);
                            scrollToSection('calendar');
                          }}
                          className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
                        >
                          Find a Painting Class
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-xs text-slate-500">
                          Below are the art classes registered during your session. Show up 10 minutes prior with comfortable painting clothes!
                        </p>

                        <div className="space-y-4">
                          {registeredBookings.map((booking) => {
                            const longDate = new Date(booking.classDate + 'T00:00:00')
                              .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

                            return (
                              <div key={booking.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative overflow-hidden">
                                
                                {/* Barcode Placeholder side graphic */}
                                <div className="absolute right-3 top-3 opacity-10 font-mono text-[8px] flex flex-col items-center">
                                  <div className="h-8 bg-black w-20 flex gap-0.5">
                                    {Array.from({ length: 15 }).map((_, bIdx) => (
                                      <span key={bIdx} className={`h-full bg-black block`} style={{ width: `${Math.random() > 0.4 ? '3px' : '1px'}` }}></span>
                                    ))}
                                  </div>
                                  <span className="mt-1">{booking.id}</span>
                                </div>

                                <div className="pr-16">
                                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider font-mono">
                                    {booking.id}
                                  </span>
                                  <h4 className="font-serif font-bold text-slate-900 text-sm mt-0.5 leading-tight">
                                    {booking.classTitle}
                                  </h4>
                                </div>

                                <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-200/60 pt-3">
                                  <div className="flex justify-between">
                                    <span>Session:</span>
                                    <strong className="text-slate-800">{longDate}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Time:</span>
                                    <strong className="text-slate-800">{booking.classTime}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Venue:</span>
                                    <strong className="text-slate-800 truncate max-w-[180px]">{booking.classLocation}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Seats Booked:</span>
                                    <strong className="text-slate-800 font-mono">{booking.seats} {booking.seats === 1 ? 'Seat' : 'Seats'}</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Registrant:</span>
                                    <strong className="text-slate-800">{booking.name}</strong>
                                  </div>
                                </div>

                                {/* Actions on booked ticket */}
                                <div className="mt-4 pt-3 border-t border-dashed border-slate-200/80 flex items-center justify-between text-xs">
                                  <span className="text-[10px] text-slate-400 font-medium">Booked {booking.dateBooked}</span>
                                  
                                  <button
                                    onClick={() => handleCancelBooking(booking.id)}
                                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 hover:underline p-1"
                                    title="Cancel Seat Booking"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Cancel Seat</span>
                                  </button>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Drawer Footer */}
                  {registeredBookings.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-6 sm:px-6">
                      <div className="flex justify-between text-sm font-semibold text-slate-900 mb-4">
                        <span>Total Registered Sessions:</span>
                        <span>{registeredBookings.length} Class(es)</span>
                      </div>
                      
                      <button
                        onClick={() => window.print()}
                        className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl text-center shadow transition-colors"
                      >
                        Print All Tickets
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
