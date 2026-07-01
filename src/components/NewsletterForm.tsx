import React, { useState } from 'react';
import { Mail, Sparkles, Check } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);

    // Simulate short network subscription delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden my-16">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-4" />
        <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
          Join the Blue Fox Art Newsletter
        </h3>
        <p className="mt-3 text-slate-300 max-w-lg mx-auto leading-relaxed text-sm sm:text-base">
          Get monthly painting tutorials, schedules for our upcoming traveling locations, and an immediate <strong>15% OFF coupon</strong> valid for any painting session!
        </p>

        {isSubscribed ? (
          <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 max-w-md mx-auto">
            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3px]" />
            </div>
            <h4 className="font-bold text-lg text-white">Welcome to the Fox Guild!</h4>
            <p className="text-xs text-slate-300 mt-2">
              Check your email to confirm and receive your coupon. Your secret discount code is:
            </p>
            <div className="mt-3 py-1.5 px-3 bg-amber-400 text-slate-900 font-mono text-sm font-bold tracking-widest rounded-lg inline-block">
              WELCOMEOX15
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-8 max-w-lg mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white text-slate-800 placeholder-slate-400 focus:text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 border border-white/10 transition-all focus:border-amber-400"
                  aria-label="Newsletter Email Input"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold text-sm rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:bg-amber-500/50"
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <span>Send Me My 15% Off</span>
                )}
              </button>
            </div>

            {/* Interest categories check boxes */}
            <div className="pt-2 text-left">
              <span className="block text-xs font-semibold text-slate-400 mb-2 text-center">
                Select your interests (optional):
              </span>
              <div className="flex flex-wrap justify-center gap-3">
                {['Watercolor Basics', 'Textured Acrylics', 'Charcoal & Sketching'].map((interest) => {
                  const isChecked = selectedInterests.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isChecked 
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold' 
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5px]" />}
                      <span>{interest}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal text-center max-w-xs mx-auto">
              We respect your privacy. Unsubscribe in one click at any time. We send 2-3 newsletters per month containing art tips and schedules.
            </p>
          </form>
        )}
      </div>

    </div>
  );
}
