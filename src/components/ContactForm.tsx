import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div id="contact" className="scroll-mt-24 py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm block mb-2">Get In Touch</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
            Contact The Blue Fox
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Have questions about group bookings, corporate art retreats, gift certificates, or specific accommodations? Send us a message and we will respond swiftly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Contact Details Side */}
          <div className="lg:col-span-5 bg-slate-950 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-5">
              <span className="text-[200px] font-bold font-serif leading-none select-none">FOX</span>
            </div>

            <div className="space-y-8 z-10">
              <div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Studio Information</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  We are a fully mobile art studio traveling across regional venues, cafes, vineyards, and community halls. Follow our classes on the schedule!
                </p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Email Us</p>
                    <a href="mailto:hello@bluefoxartstudio.com" className="hover:text-blue-400 transition-colors">
                      hello@bluefoxartstudio.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Phone Support</p>
                    <a href="tel:5554627463" className="hover:text-blue-400 transition-colors">
                      (555) FOX-ART-STUDIO
                    </a>
                    <p className="text-xs text-slate-500 mt-0.5">Mon–Fri, 9:00 AM – 5:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Response Time</p>
                    <p className="text-slate-200">Usually under 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-400 font-medium">Headquarters</p>
                    <p className="text-slate-200">Asheville, North Carolina — Traveling Coast-to-Coast</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Beginner Affirmation */}
            <div className="pt-8 mt-8 border-t border-slate-800 z-10">
              <h4 className="text-xs font-mono font-bold text-amber-400 tracking-wider uppercase mb-1">
                Have a unique request?
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We organize private birthday painting celebrations, customized couples acrylic workshops, and structured beginner art retreats. Let us know below!
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-100 flex flex-col justify-center">
            {isSubmitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50 shadow-sm animate-bounce">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold font-serif text-slate-900">Message Received!</h3>
                <p className="text-slate-600 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out to The Blue Fox. One of our artists will email or call you back shortly. Have a beautiful, creative day!
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                action="#"
                method="post"
                className="space-y-5"
                aria-label="Contact Studio Form"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Helena Carter"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-semibold text-slate-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    placeholder="e.g. Private Acrylic Painting Class Inquiries"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="Tell us details about what you need or ask us any questions..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Sending message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Secure Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
