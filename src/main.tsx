import './index.css';
import { ART_CLASSES, ArtClass, INSTRUCTORS } from './data';

// --- BOOKING STATE & PERSISTENCE ---
interface Booking {
  id: string;
  classId: string;
  classTitle: string;
  guestName: string;
  guestEmail: string;
  seats: number;
  unitPrice: number;
  discount: number;
  totalPaid: number;
  bookingCode: string;
  date: string;
  time: string;
  location: string;
}

let localBookings: Booking[] = [];

// Load from localStorage
function loadBookings() {
  const saved = localStorage.getItem('blue_fox_bookings');
  if (saved) {
    try {
      localBookings = JSON.parse(saved);
    } catch (e) {
      console.error("Error reading saved bookings", e);
      localBookings = [];
    }
  }
}

// Save to localStorage
function saveBookings() {
  localStorage.setItem('blue_fox_bookings', JSON.stringify(localBookings));
  updateBookingsUI();
}

// Get dynamic filled seats count (base filled seats + local bookings)
function getFilledSeats(artClass: ArtClass): number {
  const localReserved = localBookings
    .filter(b => b.classId === artClass.id)
    .reduce((sum, b) => sum + b.seats, 0);
  return Math.min(artClass.maxSeats, artClass.filledSeats + localReserved);
}


// --- ACTIVE FILTERS STATE ---
let selectedMedium = 'All';
let selectedLocation = 'All';
let selectedDay: number | null = null; // 1 to 31


// --- ELEMENT REFERENCING ---
const calendarGrid = document.getElementById('calendar-grid');
const classFeedList = document.getElementById('class-feed-list');
const activeDayBanner = document.getElementById('active-day-banner');
const activeDayValue = document.getElementById('active-day-value');
const clearDayFilter = document.getElementById('clear-day-filter');

const filterMedium = document.getElementById('filter-medium') as HTMLSelectElement;
const filterLocation = document.getElementById('filter-location') as HTMLSelectElement;
const filterReset = document.getElementById('filter-reset');

// Drawer elements
const bookingsDrawer = document.getElementById('bookings-drawer');
const bookingsDrawerTrigger = document.getElementById('bookings-drawer-trigger');
const bookingsDrawerClose = document.getElementById('bookings-drawer-close');
const bookingsDrawerOverlay = document.getElementById('bookings-drawer-overlay');
const bookingsBadge = document.getElementById('bookings-badge');
const bookingsEmptyState = document.getElementById('bookings-empty-state');
const bookingsList = document.getElementById('bookings-list');
const bookingsTotalSeats = document.getElementById('bookings-total-seats');

// Modal elements
const registrationModal = document.getElementById('registration-modal');
const registrationModalClose = document.getElementById('registration-modal-close');
const registrationModalOverlay = document.getElementById('registration-modal-overlay');
const registrationForm = document.getElementById('registration-form') as HTMLFormElement;
const regSuccessScreen = document.getElementById('reg-success-screen');

// Modal fields
const regClassTitle = document.getElementById('reg-class-title');
const regClassDate = document.getElementById('reg-class-date');
const regClassTime = document.getElementById('reg-class-time');
const regClassLocation = document.getElementById('reg-class-location');
const regClassInstructor = document.getElementById('reg-class-instructor');
const regClassLocationDetails = document.getElementById('reg-class-location-details');
const regSeatsAvailable = document.getElementById('reg-seats-available');

const regName = document.getElementById('reg-name') as HTMLInputElement;
const regEmail = document.getElementById('reg-email') as HTMLInputElement;
const regSeats = document.getElementById('reg-seats') as HTMLSelectElement;
const regCoupon = document.getElementById('reg-coupon') as HTMLInputElement;
const applyCouponBtn = document.getElementById('apply-coupon-btn');
const couponFeedback = document.getElementById('coupon-feedback');

// Modal price breakdown
const summaryUnitPrice = document.getElementById('summary-unit-price');
const summarySeatsCount = document.getElementById('summary-seats-count');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryDiscountRow = document.getElementById('summary-discount-row');
const summaryDiscount = document.getElementById('summary-discount');
const summaryTotal = document.getElementById('summary-total');

// Ticket success output
const ticketBookingCode = document.getElementById('ticket-booking-code');
const ticketClassTitle = document.getElementById('ticket-class-title');
const ticketGuestName = document.getElementById('ticket-guest-name');
const ticketSeatsCount = document.getElementById('ticket-seats-count');
const ticketDatetime = document.getElementById('ticket-datetime');
const ticketLocation = document.getElementById('ticket-location');
const successDoneBtn = document.getElementById('success-done-btn');

// Newsletter & Contact Form elements
const newsletterForm = document.getElementById('newsletter-subscription-form') as HTMLFormElement;
const newsletterSuccess = document.getElementById('newsletter-success');
const contactForm = document.getElementById('contact-message-form') as HTMLFormElement;
const contactSuccess = document.getElementById('contact-success');

// Mobile Navigation
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileDropdown = document.getElementById('mobile-dropdown');


// --- GLOBAL DATA DRIVEN HELPER ---
let activeRegistrationClass: ArtClass | null = null;
let couponApplied = false;
const DISCOUNT_PERCENT = 0.15; // 15% off coupon


// --- INITIALIZER HANDLERS ---
function init() {
  loadBookings();
  renderCalendar();
  renderClassFeed();
  updateBookingsUI();
  setupEventListeners();
}


// --- CALENDAR DRAW SYSTEM ---
function renderCalendar() {
  if (!calendarGrid) return;
  calendarGrid.innerHTML = '';

  // July 2026 starts on Wednesday (offset is 3 days: Sun=0, Mon=1, Tue=2, Wed=3)
  const START_OFFSET = 3;
  const DAYS_IN_MONTH = 31;

  // Insert blank spacer offset cells
  for (let i = 0; i < START_OFFSET; i++) {
    const spacer = document.createElement('div');
    spacer.className = 'py-2.5';
    calendarGrid.appendChild(spacer);
  }

  // Draw active days
  for (let day = 1; day <= DAYS_IN_MONTH; day++) {
    const dateStr = `2026-07-${day < 10 ? '0' + day : day}`;
    
    // Check if there's any classes scheduled for this day
    const dayClasses = ART_CLASSES.filter(c => c.date === dateStr);
    const hasClass = dayClasses.length > 0;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.day = day.toString();

    // Visual classes depending on state
    let baseStyles = 'relative py-2.5 text-xs font-mono font-medium rounded-lg hover:bg-slate-100 transition-colors cursor-pointer ';
    if (hasClass) {
      baseStyles += 'bg-slate-50 border border-slate-200 text-[#2D4A53] font-semibold ';
    } else {
      baseStyles += 'text-slate-400 ';
    }

    if (selectedDay === day) {
      baseStyles += 'bg-[#2D4A53] text-white hover:bg-[#2D4A53]/90 border-[#2D4A53] ';
    }

    btn.className = baseStyles;
    btn.innerText = day.toString();

    // Dot indicator for classes
    if (hasClass && selectedDay !== day) {
      const dot = document.createElement('span');
      dot.className = 'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#C87941]';
      btn.appendChild(dot);
    }

    btn.addEventListener('click', () => {
      if (selectedDay === day) {
        selectedDay = null; // toggle selection off
      } else {
        selectedDay = day;
      }
      renderCalendar();
      renderClassFeed();
    });

    calendarGrid.appendChild(btn);
  }
}


// --- CLASS FEED GENERATION ---
function renderClassFeed() {
  if (!classFeedList) return;
  classFeedList.innerHTML = '';

  // Filter logic
  const filtered = ART_CLASSES.filter(c => {
    // Medium filter
    if (selectedMedium !== 'All' && c.medium !== selectedMedium) return false;
    // Location filter
    if (selectedLocation !== 'All' && c.location !== selectedLocation) return false;
    // Date filter
    if (selectedDay !== null) {
      const dayStr = selectedDay < 10 ? '0' + selectedDay : selectedDay.toString();
      const matchDate = `2026-07-${dayStr}`;
      if (c.date !== matchDate) return false;
    }
    return true;
  });

  // Display active day banner indicator
  if (selectedDay !== null && activeDayBanner && activeDayValue) {
    activeDayValue.innerText = `July ${selectedDay}, 2026`;
    activeDayBanner.classList.remove('hidden');
  } else if (activeDayBanner) {
    activeDayBanner.classList.add('hidden');
  }

  // Handle empty listings
  if (filtered.length === 0) {
    const emptyBox = document.createElement('div');
    emptyBox.className = 'text-center py-16 bg-white rounded-xl border border-[#EBE6D7] space-y-3';
    emptyBox.innerHTML = `
      <div class="text-3xl">🎨</div>
      <p class="text-xs font-bold text-[#2D4A53]">No art classes match your selection</p>
      <p class="text-[11px] text-slate-400 max-w-xs mx-auto">Try resetting filters or choosing another calendar date to discover sessions.</p>
    `;
    classFeedList.appendChild(emptyBox);
    return;
  }

  // Populate list
  filtered.forEach(artClass => {
    const filledSeats = getFilledSeats(artClass);
    const seatsRemaining = artClass.maxSeats - filledSeats;
    const isSoldOut = seatsRemaining <= 0;

    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl border border-[#EBE6D7] p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-5';

    // Image section
    let imgHTML = `
      <div class="sm:w-40 h-32 sm:h-full rounded-lg overflow-hidden relative border border-[#EBE6D7] flex-shrink-0">
        <img src="${artClass.image}" alt="${artClass.title}" class="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <span class="absolute top-2 left-2 bg-white/95 text-[#2D4A53] text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded shadow-sm border border-[#EBE6D7]/60">
          ${artClass.medium}
        </span>
      </div>
    `;

    // Format readable date
    const dateObj = new Date(artClass.date + 'T00:00:00');
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const readableDate = dateObj.toLocaleDateString('en-US', options);

    // Build seats indicator badge styling
    let seatsBadgeHTML = '';
    if (isSoldOut) {
      seatsBadgeHTML = `<span class="text-[10px] font-bold text-red-600 font-mono bg-red-50 border border-red-200 px-2 py-0.5 rounded">SOLD OUT</span>`;
    } else if (seatsRemaining <= 3) {
      seatsBadgeHTML = `<span class="text-[10px] font-bold text-amber-600 font-mono bg-amber-50 border border-amber-200 px-2 py-0.5 rounded animate-pulse">ONLY ${seatsRemaining} SEATS LEFT</span>`;
    } else {
      seatsBadgeHTML = `<span class="text-[10px] text-slate-400 font-mono">${seatsRemaining} of ${artClass.maxSeats} seats remaining</span>`;
    }

    card.innerHTML = `
      ${imgHTML}
      <div class="flex-grow flex flex-col justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-[10px] font-mono font-bold text-[#C87941] uppercase tracking-wider">${readableDate} — ${artClass.time}</span>
            <span class="text-sm font-serif font-bold text-[#2D4A53]">$${artClass.price} <span class="text-[10px] text-slate-400 font-normal">/ Seat</span></span>
          </div>
          <h3 class="font-serif text-base font-bold text-[#2D4A53] leading-snug">${artClass.title}</h3>
          <p class="text-[11px] text-[#334155]/85 leading-relaxed">${artClass.description}</p>
          
          <div class="grid grid-cols-2 gap-x-4 gap-y-1 pt-2.5 border-t border-[#EBE6D7]/60 text-[10px] text-slate-500 font-mono">
            <div>📍 <strong>Venue:</strong> ${artClass.location}</div>
            <div>👩‍🎨 <strong>Instructor:</strong> ${artClass.instructor}</div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2">
          ${seatsBadgeHTML}
          <button type="button" class="register-trigger px-4 py-1.5 rounded bg-[#2D4A53] text-white hover:bg-[#22383F] disabled:bg-slate-200 disabled:text-slate-400 disabled:border-slate-300 font-medium text-xs transition-colors cursor-pointer" 
                  data-class-id="${artClass.id}" ${isSoldOut ? 'disabled' : ''}>
            ${isSoldOut ? 'Sold Out' : 'Register Now'}
          </button>
        </div>
      </div>
    `;

    // Listen to register click
    const regBtn = card.querySelector('.register-trigger');
    if (regBtn) {
      regBtn.addEventListener('click', () => {
        openRegistrationModal(artClass);
      });
    }

    classFeedList.appendChild(card);
  });
}


// --- ACTIVE BOOKING DRAWER UI UPDATE ---
function updateBookingsUI() {
  if (!bookingsBadge || !bookingsEmptyState || !bookingsList || !bookingsTotalSeats) return;

  const totalTickets = localBookings.length;
  const totalSeatsReserved = localBookings.reduce((sum, b) => sum + b.seats, 0);

  // Badge count
  if (totalTickets > 0) {
    bookingsBadge.innerText = totalTickets.toString();
    bookingsBadge.classList.remove('hidden');
    bookingsEmptyState.classList.add('hidden');
  } else {
    bookingsBadge.classList.add('hidden');
    bookingsEmptyState.classList.remove('hidden');
  }

  // Output tickets
  bookingsList.innerHTML = '';
  localBookings.forEach(booking => {
    const ticket = document.createElement('div');
    ticket.className = 'bg-white rounded-lg border border-[#EBE6D7] overflow-hidden shadow-sm relative text-xs';

    // Format discount string if any
    const discountRow = booking.discount > 0 
      ? `<div class="flex justify-between text-emerald-600 font-mono">
           <span>Coupon Discount (15%):</span>
           <span>-$${booking.discount.toFixed(2)}</span>
         </div>`
      : '';

    ticket.innerHTML = `
      <div class="bg-[#2D4A53] p-2 text-white text-[9px] font-mono uppercase tracking-wider flex items-center justify-between">
        <span>Entry Receipt</span>
        <strong class="text-amber-400">${booking.bookingCode}</strong>
      </div>
      
      <div class="p-3.5 space-y-2">
        <h4 class="font-serif font-bold text-[#2D4A53] leading-snug">${booking.classTitle}</h4>
        
        <div class="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-mono">
          <div>👤 <strong>Guest:</strong> ${booking.guestName}</div>
          <div>🎟️ <strong>Seats:</strong> ${booking.seats} Seat(s)</div>
          <div>📅 <strong>Date:</strong> ${booking.date}</div>
          <div>📍 <strong>Venue:</strong> ${booking.location}</div>
        </div>

        <div class="pt-2 border-t border-slate-100 flex flex-col gap-1 font-mono text-[10px]">
          <div class="flex justify-between">
            <span>Price breakdown:</span>
            <span>${booking.seats} x $${booking.unitPrice.toFixed(2)}</span>
          </div>
          ${discountRow}
          <div class="flex justify-between font-bold text-[#2D4A53]">
            <span>Total Amount Paid:</span>
            <span>$${booking.totalPaid.toFixed(2)}</span>
          </div>
        </div>

        <button type="button" class="cancel-booking-btn w-full mt-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded text-[10px] font-mono transition-colors border border-red-150" data-booking-id="${booking.id}">
          Cancel Registration (Release Seats)
        </button>
      </div>

      <!-- Ticket decorative circular cutouts -->
      <div class="absolute left-0 right-0 top-[26px] flex justify-between px-1 pointer-events-none">
        <span class="w-2 h-2 rounded-full bg-[#FDFCF9] -ml-1 border-r border-[#EBE6D7]"></span>
        <span class="w-2 h-2 rounded-full bg-[#FDFCF9] -mr-1 border-l border-[#EBE6D7]"></span>
      </div>
    `;

    // Listen to cancel button
    const cancelBtn = ticket.querySelector('.cancel-booking-btn');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        cancelReservation(booking.id, booking.classTitle);
      });
    }

    bookingsList.appendChild(ticket);
  });

  // Footer totals
  bookingsTotalSeats.innerText = `${totalSeatsReserved} Seat${totalSeatsReserved === 1 ? '' : 's'}`;
}


// --- BOOKING OPERATIONS ---
function cancelReservation(bookingId: string, title: string) {
  const confirmCancel = confirm(`Are you sure you want to cancel your seat registration for "${title}"?\n\nThis will immediately release your reserved seats back to the schedule and process a standard digital ticket credit refund.`);
  if (!confirmCancel) return;

  localBookings = localBookings.filter(b => b.id !== bookingId);
  saveBookings();
  renderClassFeed();
  renderCalendar();
}

function openRegistrationModal(artClass: ArtClass) {
  activeRegistrationClass = artClass;
  couponApplied = false;
  if (regCoupon) regCoupon.value = '';
  if (couponFeedback) couponFeedback.innerText = '';
  if (summaryDiscountRow) summaryDiscountRow.classList.add('hidden');
  if (registrationForm) registrationForm.classList.remove('hidden');
  if (regSuccessScreen) regSuccessScreen.classList.add('hidden');

  const filledSeats = getFilledSeats(artClass);
  const seatsRemaining = artClass.maxSeats - filledSeats;

  // Bind values
  if (regClassTitle) regClassTitle.innerText = artClass.title;
  if (regClassDate) regClassDate.innerText = `📅 ${artClass.date}`;
  if (regClassTime) regClassTime.innerText = `🕒 ${artClass.time}`;
  if (regClassLocation) regClassLocation.innerText = `📍 ${artClass.location}`;
  if (regClassInstructor) regClassInstructor.innerText = artClass.instructor;
  if (regClassLocationDetails) regClassLocationDetails.innerText = artClass.locationDetails;
  
  if (regSeatsAvailable) {
    regSeatsAvailable.innerText = `${seatsRemaining} seats left`;
  }

  // Configure seats dropdown options dynamically
  if (regSeats) {
    regSeats.innerHTML = '';
    const limit = Math.min(4, seatsRemaining);
    for (let i = 1; i <= limit; i++) {
      const opt = document.createElement('option');
      opt.value = i.toString();
      opt.innerText = `${i} Seat${i === 1 ? '' : 's'}`;
      regSeats.appendChild(opt);
    }
  }

  // Update prices breakdown
  calculateRegistrationPrice();

  // Show modal
  if (registrationModal) {
    registrationModal.classList.add('modal-active');
  }
}

function calculateRegistrationPrice() {
  if (!activeRegistrationClass) return;

  const seatsCount = regSeats ? parseInt(regSeats.value) || 1 : 1;
  const unitPriceVal = activeRegistrationClass.price;
  const subtotalVal = seatsCount * unitPriceVal;
  
  const discountVal = couponApplied ? subtotalVal * DISCOUNT_PERCENT : 0;
  const totalVal = subtotalVal - discountVal;

  if (summaryUnitPrice) summaryUnitPrice.innerText = `$${unitPriceVal.toFixed(2)}`;
  if (summarySeatsCount) summarySeatsCount.innerText = `${seatsCount} Seat${seatsCount === 1 ? '' : 's'}`;
  if (summarySubtotal) summarySubtotal.innerText = `$${subtotalVal.toFixed(2)}`;

  if (couponApplied && summaryDiscountRow && summaryDiscount) {
    summaryDiscount.innerText = `-$${discountVal.toFixed(2)}`;
    summaryDiscountRow.classList.remove('hidden');
  } else if (summaryDiscountRow) {
    summaryDiscountRow.classList.add('hidden');
  }

  if (summaryTotal) summaryTotal.innerText = `$${totalVal.toFixed(2)}`;
}


// --- EVENT LISTENERS REGISTRATION ---
function setupEventListeners() {
  
  // Drawer close/open
  if (bookingsDrawerTrigger && bookingsDrawer) {
    bookingsDrawerTrigger.addEventListener('click', () => {
      bookingsDrawer.classList.add('drawer-active');
    });
  }

  if (bookingsDrawerClose && bookingsDrawer) {
    bookingsDrawerClose.addEventListener('click', () => {
      bookingsDrawer.classList.remove('drawer-active');
    });
  }

  if (bookingsDrawerOverlay && bookingsDrawer) {
    bookingsDrawerOverlay.addEventListener('click', () => {
      bookingsDrawer.classList.remove('drawer-active');
    });
  }

  // Modal Close
  if (registrationModalClose && registrationModal) {
    registrationModalClose.addEventListener('click', () => {
      registrationModal.classList.remove('modal-active');
    });
  }
  if (registrationModalOverlay && registrationModal) {
    registrationModalOverlay.addEventListener('click', () => {
      registrationModal.classList.remove('modal-active');
    });
  }

  // Reset filter button
  if (filterReset) {
    filterReset.addEventListener('click', () => {
      selectedMedium = 'All';
      selectedLocation = 'All';
      selectedDay = null;

      if (filterMedium) filterMedium.value = 'All';
      if (filterLocation) filterLocation.value = 'All';

      renderCalendar();
      renderClassFeed();
    });
  }

  // Dropdown filter changes
  if (filterMedium) {
    filterMedium.addEventListener('change', (e) => {
      selectedMedium = (e.target as HTMLSelectElement).value;
      renderClassFeed();
      renderCalendar();
    });
  }

  if (filterLocation) {
    filterLocation.addEventListener('change', (e) => {
      selectedLocation = (e.target as HTMLSelectElement).value;
      renderClassFeed();
      renderCalendar();
    });
  }

  // Clear day banner shortcut click
  if (clearDayFilter) {
    clearDayFilter.addEventListener('click', () => {
      selectedDay = null;
      renderCalendar();
      renderClassFeed();
    });
  }

  // Calculate prices on dropdown seats change
  if (regSeats) {
    regSeats.addEventListener('change', calculateRegistrationPrice);
  }

  // Coupon application handler
  if (applyCouponBtn && regCoupon && couponFeedback) {
    applyCouponBtn.addEventListener('click', () => {
      const code = regCoupon.value.trim().toUpperCase();
      if (code === 'WELCOMEOX15') {
        couponApplied = true;
        couponFeedback.innerText = '✓ Promo Code Welcomed! 15% discount applied.';
        couponFeedback.className = 'block text-[9px] font-semibold text-emerald-600';
        calculateRegistrationPrice();
      } else if (code === '') {
        couponFeedback.innerText = '';
      } else {
        couponApplied = false;
        couponFeedback.innerText = '✗ Unknown Promo Code. Try WELCOMEOX15';
        couponFeedback.className = 'block text-[9px] font-semibold text-red-500';
        calculateRegistrationPrice();
      }
    });
  }

  // Class registration submit form handler
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!activeRegistrationClass) return;

      const seatsCount = parseInt(regSeats.value) || 1;
      const filledSeats = getFilledSeats(activeRegistrationClass);
      const seatsRemaining = activeRegistrationClass.maxSeats - filledSeats;

      if (seatsCount > seatsRemaining) {
        alert(`Sorry, only ${seatsRemaining} seats remain for this class workshop.`);
        return;
      }

      // Calculations
      const unitPriceVal = activeRegistrationClass.price;
      const subtotalVal = seatsCount * unitPriceVal;
      const discountVal = couponApplied ? subtotalVal * DISCOUNT_PERCENT : 0;
      const totalVal = subtotalVal - discountVal;

      // Generate customized code
      const uniqueLetter = activeRegistrationClass.medium[0].toUpperCase();
      const codeNum = Math.floor(1000 + Math.random() * 9000);
      const uniqueCode = `FOX-${codeNum}-${uniqueLetter}${seatsCount}`;

      // Assemble Booking Object
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        classId: activeRegistrationClass.id,
        classTitle: activeRegistrationClass.title,
        guestName: regName.value.trim(),
        guestEmail: regEmail.value.trim(),
        seats: seatsCount,
        unitPrice: unitPriceVal,
        discount: discountVal,
        totalPaid: totalVal,
        bookingCode: uniqueCode,
        date: activeRegistrationClass.date,
        time: activeRegistrationClass.time,
        location: activeRegistrationClass.location
      };

      // Store booking
      localBookings.push(newBooking);
      saveBookings();

      // Output to success ticket screen
      if (ticketBookingCode) ticketBookingCode.innerText = uniqueCode;
      if (ticketClassTitle) ticketClassTitle.innerText = activeRegistrationClass.title;
      if (ticketGuestName) ticketGuestName.innerText = regName.value.trim();
      if (ticketSeatsCount) ticketSeatsCount.innerText = `${seatsCount} Seat${seatsCount === 1 ? '' : 's'}`;
      if (ticketDatetime) ticketDatetime.innerText = `${activeRegistrationClass.date} — ${activeRegistrationClass.time}`;
      if (ticketLocation) ticketLocation.innerText = activeRegistrationClass.location;

      // Hide form, show success sheet
      registrationForm.classList.add('hidden');
      if (regSuccessScreen) regSuccessScreen.classList.remove('hidden');

      // Refresh listings
      renderClassFeed();
      renderCalendar();
    });
  }

  // Done success button trigger
  if (successDoneBtn && registrationModal && bookingsDrawer) {
    successDoneBtn.addEventListener('click', () => {
      // Close modal
      registrationModal.classList.remove('modal-active');
      
      // Open bookings drawer with small delay
      setTimeout(() => {
        bookingsDrawer.classList.add('drawer-active');
      }, 200);
    });
  }

  // Program Shortcuts triggers
  const programShortcuts = document.querySelectorAll('.program-shortcut');
  programShortcuts.forEach(lnk => {
    lnk.addEventListener('click', (e) => {
      const filterValue = (e.currentTarget as HTMLElement).dataset.mediumFilter;
      if (filterValue && filterMedium) {
        selectedMedium = filterValue;
        filterMedium.value = filterValue;
        renderClassFeed();
        renderCalendar();
      }
    });
  });

  // Interactive hearts logic
  const likeButtons = document.querySelectorAll('.like-button');
  likeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const currentBtn = e.currentTarget as HTMLButtonElement;
      const countSpan = currentBtn.querySelector('.like-count') as HTMLSpanElement;
      let currentCount = parseInt(countSpan.innerText) || 0;

      if (currentBtn.classList.contains('liked')) {
        currentBtn.classList.remove('liked');
        countSpan.innerText = (currentCount - 1).toString();
      } else {
        currentBtn.classList.add('liked');
        countSpan.innerText = (currentCount + 1).toString();
      }
    });
  });

  // Newsletter Submissions
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterForm.classList.add('hidden');
      if (newsletterSuccess) {
        newsletterSuccess.classList.remove('hidden');
      }
    });
  }

  // Contact Form Message
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactForm.classList.add('hidden');
      if (contactSuccess) {
        contactSuccess.classList.remove('hidden');
      }
    });
  }

  // Mobile menu button
  if (mobileMenuToggle && mobileDropdown) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileDropdown.classList.toggle('hidden');
    });
  }

  // Close dropdown on click links
  const dropdownLinks = mobileDropdown?.querySelectorAll('a');
  dropdownLinks?.forEach(lnk => {
    lnk.addEventListener('click', () => {
      mobileDropdown?.classList.add('hidden');
    });
  });
}


// --- RUN ENTRYPOINT ---
init();
