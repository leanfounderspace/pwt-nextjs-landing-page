'use client';

export default function ElevateSection() {
  return (
    <section id="ecommerce" className="py-10 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="order-2 lg:order-1 lg:sticky lg:top-24">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://img.freepik.com/free-photo/3d-rendering-abstract-black-white-background_23-2150913919.jpg?semt=ais_rp_progressive&w=740&q=80" alt="E-commerce Payment Solutions" className="w-full h-auto object-cover" />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold text-xs sm:text-sm mb-4 sm:mb-6">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
              GLOBAL EXPANSION MADE EASY
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Elevate Your <span className="font-ivyora italic text-gray-900 block">E-commerce Strategy</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              In today&apos;s competitive digital world, scaling globally is no longer a choice it&apos;s a necessity. Our integrated services offer seamless expansion, empowering your business to thrive in USA and beyond.
            </p>
            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                { icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z', title: 'One-Stop Shop', desc: "Everything you need to go global from the heart of USA. From launching your business in new markets to payment processing and website development, we've got you covered!" },
                { icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4', title: 'Customizable and Scalable', desc: "Whether you're a small start-up or a large enterprise in USA, our solutions are tailored and scalable to suit your unique requirements." },
                { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z', title: 'Reliable Support', desc: 'With our dedicated customer service, you can concentrate on your business in USA while we expertly handle your global e-commerce operations.' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-base sm:text-lg">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button onClick={() => window.selectBundleAndScroll?.()} className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg">
                Start Your Journey
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
              <a href="#orderForm" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-900 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base hover:bg-gray-50 transition-all">
                Watch Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
