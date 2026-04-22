'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-8">
          <div className="text-2xl md:text-3xl font-bold mb-4">
            PwT <span className="font-ivyora italic">Solutions</span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Building Supreme Customer Experience – Digital and Beyond
          </p>
          <button
            onClick={() => window.selectBundleAndScroll?.()}
            className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-100 transition-all shadow-lg hover:scale-105 mb-8"
          >
            Get Started - $2,499
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <div className="flex justify-center gap-4 mb-8">
            {/* Facebook */}
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            {/* Twitter */}
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-gray-900 rounded-full flex items-center justify-center transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400 text-center md:text-left">© 2026 PwT Solutions. Built for Global Commerce.</p>
            <div className="flex flex-wrap justify-center md:justify-end gap-3 md:gap-6 text-gray-400">
              {[
                ['/privacy-policy','Privacy Policy'],
                ['/terms-of-service','Terms of Service'],
                ['/legal-agreement','Legal Agreement'],
                ['/payment-refund-policy','Refund Policy'],
                ['/service-payment-policy','Service Policy'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="hover:text-white transition-colors">{label}</Link>
              ))}
              <a href="#orderForm" className="hover:text-white transition-colors">Book a Free Consultation</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
