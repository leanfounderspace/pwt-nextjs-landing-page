'use client';

const LOGOS = [
  { src: 'https://1000logos.net/wp-content/uploads/2021/05/Stripe-logo.png', alt: 'Stripe' },
  { src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkM4NXbJiiQB5aDG9ACj2dybcqNmqJS0FWkA&s', alt: 'PayPal' },
  { src: 'https://images.squarespace-cdn.com/content/v1/6256bbc958459115bb736708/ff8b5bda-1238-4478-baa4-0012ea756ec4/airwallex_logo2.png', alt: 'Airwallex' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Adyen_Corporate_Logo.svg/1280px-Adyen_Corporate_Logo.svg.png', alt: 'Adyen' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Authorize.net_logo.png', alt: 'Authorize.net' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/3840px-Google_Pay_Logo.svg.png', alt: 'Google Pay' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Apple_Pay_logo.svg/1280px-Apple_Pay_logo.svg.png', alt: 'Apple Pay' },
];

export default function HeroSection() {
  return (
    <section className="bg-gray-50 min-h-[calc(100vh-80px)] flex items-center py-6 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight px-2">
          <span className="font-neue text-gray-900">Start Your Online Business Journey</span><br />
          <span className="font-neue text-gray-900">With Us</span>
        </h1>

        {/* Pricing box */}
        <div className="max-w-5xl mx-auto mb-8 sm:mb-10">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl sm:rounded-2xl p-4 py-6 sm:p-6 shadow-2xl text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                {/* Price */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full font-semibold text-xs mb-3 shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    SPECIAL LAUNCH OFFER
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl lg:text-5xl font-extrabold">$2,499</span>
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-100 line-through text-sm font-bold">$2,997</span>
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-full font-bold text-xs">Save ~$500</span>
                    </div>
                  </div>
                </div>
                {/* Benefits */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 lg:flex-1">
                  {['Website Ecommerce', 'Payment Gateway Integration', 'Digital Marketing Set up', 'All set in 1 Week'].map(b => (
                    <div key={b} className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                      <span className="text-xs font-medium">{b}</span>
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={() => window.selectBundleAndScroll?.()} className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap">
                    Get Started Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo marquee */}
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="flex gap-6 sm:gap-12 animate-scroll">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex gap-6 sm:gap-12 items-center">
                {LOGOS.map(logo => (
                  <div key={logo.alt} className="bg-white border border-gray-200 rounded-lg px-4 sm:px-8 py-3 sm:py-6 shadow-sm min-w-[100px] sm:min-w-[160px] h-14 sm:h-20 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo.src} alt={logo.alt} className="h-5 sm:h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
