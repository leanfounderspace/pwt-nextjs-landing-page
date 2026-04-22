'use client';
import { useState, useEffect, useRef } from 'react';

import { CONTACT_FORM_SOURCE } from '@/lib/contact';

type PkgKey = 'payment' | 'infrastructure' | 'marketing';
interface Pkg { selected: boolean; price: number; name: string; }
interface Message { role: 'user' | 'assistant'; content: string; }

const INIT: Record<PkgKey, Pkg> = {
  payment:        { selected: false, price: 699,  name: 'Payment Gateway'    },
  infrastructure: { selected: false, price: 1299, name: 'Infrastructure Setup' },
  marketing:      { selected: false, price: 699,  name: 'Marketing Support'  },
};

export default function PackageSection() {
  const [pkgs, setPkgs] = useState<Record<PkgKey, Pkg>>(INIT);
  const [bundle, setBundle] = useState(false);
  const [toast, setToast] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState<{ status: 'success' | 'error'; message: string } | null>(null);
  const [identified, setIdentified] = useState(false);
  const [infoForm, setInfoForm] = useState({ name: '', contact: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  const sessionId = useRef<string>('');

  // Init session ID + load saved messages
  useEffect(() => {
    let sid = localStorage.getItem('pwt-chat-sid');
    if (!sid) { sid = crypto.randomUUID(); localStorage.setItem('pwt-chat-sid', sid); }
    sessionId.current = sid;
    const alreadyId = !!localStorage.getItem('pwt-chat-identified');
    setIdentified(alreadyId);
    try {
      const saved = localStorage.getItem('pwt-chat-session');
      if (saved) setMessages(JSON.parse(saved));
    } catch {}
  }, []);

  // SSE: listen for new assistant messages
  useEffect(() => {
    let es: EventSource;
    const seenIds = new Set<number>();
    const connect = () => {
      if (!sessionId.current) return;
      es = new EventSource(`/api/chat/stream?sessionId=${sessionId.current}`);
      es.onmessage = (e) => {
        const msgs: { id: number; role: string; content: string }[] = JSON.parse(e.data);
        const fresh = msgs.filter(m => !seenIds.has(m.id));
        if (!fresh.length) return;
        fresh.forEach(m => seenIds.add(m.id));
        setMessages(m => {
          const updated = [...m, ...fresh.map(({ role, content }) => ({ role: role as 'assistant', content }))];
          try { localStorage.setItem('pwt-chat-session', JSON.stringify(updated)); } catch {}
          return updated;
        });
      };
      es.onerror = () => { es.close(); setTimeout(connect, 3000); };
    };
    const t = setTimeout(connect, 100);
    return () => { clearTimeout(t); es?.close(); };
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    const text = (inputRef.current?.value || input).trim();
    if (!text || loading) return;
    if (inputRef.current) inputRef.current.value = '';
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    try { localStorage.setItem('pwt-chat-session', JSON.stringify(newMessages)); } catch {}
    setLoading(true);
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, sessionId: sessionId.current }),
      });
      // AI reply will come via SSE stream, no need to append here
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Unable to connect. Please try again.' }]);
    }
    setLoading(false);
  };

  const submitInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, contact } = infoForm;
    if (!name.trim() || !contact.trim()) return;

    const device = `${navigator.platform} — ${navigator.userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/)?.[0] || 'Unknown browser'}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    const referrer = document.referrer || 'Direct';

    let region = '';
    try {
      const geo = await fetch('https://ipapi.co/json/').then(r => r.json());
      region = `${geo.city}, ${geo.country_name}`;
    } catch {}

    await fetch('/api/chat/init', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.current, name: name.trim(), contact: contact.trim(), device, region, timezone, language, referrer }),
    });
    localStorage.setItem('pwt-chat-identified', '1');
    setIdentified(true);
  };

  // Expose selectBundleAndScroll globally
  useEffect(() => {
    window.selectBundleAndScroll = () => {
      setBundle(true);
      setPkgs(p => Object.fromEntries(Object.entries(p).map(([k,v]) => [k,{...v,selected:true}])) as Record<PkgKey,Pkg>);
      setTimeout(() => document.getElementById('orderForm')?.scrollIntoView({behavior:'smooth'}), 100);
    };
    // Load localStorage
    try {
      const saved = localStorage.getItem('pwt-package-selections');
      if (saved) {
        const d = JSON.parse(saved);
        if (d.packages) setPkgs(p => Object.fromEntries(Object.entries(p).map(([k,v]) => [k,{...v,selected:!!d.packages[k]}])) as Record<PkgKey,Pkg>);
        if (d.bundle) setBundle(d.bundle);
      }
    } catch {}
  }, []);

  const save = (p: Record<PkgKey,Pkg>, b: boolean) => {
    try { localStorage.setItem('pwt-package-selections', JSON.stringify({packages:Object.fromEntries(Object.entries(p).map(([k,v])=>[k,v.selected])),bundle:b})); } catch {}
  };

  const showToast = () => {
    setToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 4000);
  };

  const togglePkg = (key: PkgKey) => {
    setPkgs(p => {
      const n = {...p, [key]: {...p[key], selected: !p[key].selected}};
      const allSel = Object.values(n).every(v=>v.selected);
      setBundle(allSel);
      save(n, allSel);
      return n;
    });
    showToast();
  };

  const toggleBundle = (checked: boolean) => {
    setBundle(checked);
    setPkgs(p => {
      const n = Object.fromEntries(Object.entries(p).map(([k,v])=>[k,{...v,selected:checked}])) as Record<PkgKey,Pkg>;
      save(n, checked);
      return n;
    });
    if (checked) showToast();
  };

  const total = bundle ? 2499 : Object.values(pkgs).filter(p=>p.selected).reduce((s,p)=>s+p.price,0);
  const hasSelection = bundle || Object.values(pkgs).some(p=>p.selected);
  const selectedPackages = Object.entries(pkgs)
    .filter(([, value]) => value.selected)
    .map(([key, value]) => ({ key, name: value.name }));

  const submitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasSelection || submittingOrder) return;

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('orderName') || '').trim(),
      email: String(formData.get('orderEmail') || '').trim(),
      phone: String(formData.get('orderPhone') || '').trim(),
      requirements: String(formData.get('orderRequirements') || '').trim(),
      selectedPackages,
      bundle,
      total,
      source: CONTACT_FORM_SOURCE,
    };

    setSubmittingOrder(true);
    setOrderFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Unable to submit your request right now. Please try again.');
      }

      form.reset();
      setBundle(false);
      setPkgs(INIT);
      save(INIT, false);
      setOrderFeedback({
        status: 'success',
        message:
          data.message ||
          'Thank you. Your request has been submitted and a confirmation email is on its way.',
      });
    } catch (error) {
      setOrderFeedback({
        status: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Unable to submit your request right now. Please try again.',
      });
    } finally {
      setSubmittingOrder(false);
    }
  };

  const CARDS = [
    { key: 'infrastructure' as PkgKey, num:'01', title:'Infrastructure Setup', sub:'COMPLETE E-COMMERCE', desc:'Build your complete e-commerce website with powerful features and seamless payment gateway integration.', features:['Product listings & categories','Shopping cart & checkout','User accounts & order history'], displayPrice:'$1,299', togglePrice:1299 },
    { key: 'payment' as PkgKey, num:'02', title:'Payment Gateway', sub:'ALL GATEWAYS IN USA', desc:'Accept payments from customers worldwide. Complete registration assistance with Stripe payment gateway integration.', features:[], displayPrice:'$999', togglePrice:699 },
    { key: 'marketing' as PkgKey, num:'03', title:'Marketing Support', sub:'SETUP & ADS MANAGEMENT', desc:'Professional marketing setup and ad campaign management to drive traffic and boost your e-commerce sales.', features:['Google Ads setup & management','Facebook & Instagram ads','SEO optimization','Analytics & reporting'], displayPrice:'$699', togglePrice:699 },
  ];

  return (
    <section id="payment-gateway" className="relative py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-24">
          <p className="text-sm tracking-[0.3em] uppercase text-gray-500 mb-6">Tailored Solutions</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Discover <span className="font-ivyora italic">Perfect Solution</span><br />For Your Business
          </h2>
          <div className="w-24 h-1 bg-gray-900 mx-auto mb-8" />
          <p className="text-md sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Elevate your USA e-commerce venture with the right tools, strategies, and solutions.
          </p>
        </div>

        {/* Package cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {CARDS.map(card => (
            <div key={card.key} className={`package-card group relative ${pkgs[card.key].selected ? 'selected-package' : ''}`}>
              <div className="bg-white border-2 border-gray-200 rounded-none p-10 h-full transition-all duration-500 hover:border-gray-900 hover:shadow-xl">
                <div className="text-7xl font-ivyora italic text-gray-100 absolute top-4 right-6 leading-none">{card.num}</div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 border-2 border-gray-900 flex items-center justify-center mb-6">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-500 mb-6 tracking-widest">{card.sub}</p>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed flex-grow">{card.desc}</p>
                  {card.features.length > 0 && (
                    <div className="border-l-2 border-gray-900 pl-4 mb-6 space-y-1">
                      {card.features.map(f => <p key={f} className="text-xs text-gray-600">&bull; {f}</p>)}
                    </div>
                  )}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-gray-900">{card.displayPrice}</span>
                      <span className="text-sm text-gray-500">USD</span>
                    </div>
                  </div>
                  <button onClick={() => togglePkg(card.key)} className="package-btn w-full text-center border-2 border-gray-900 text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300">
                    {pkgs[card.key].selected ? 'Selected ✓' : 'Select Package →'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bundle */}
        <div className="mt-16">
          <button type="button" onClick={() => toggleBundle(!bundle)} className={`w-full group relative text-left ${bundle ? 'bundle-selected' : ''}`}>
            <div className="bg-gray-50 border-2 border-gray-200 rounded-none p-8 transition-all duration-300 hover:border-gray-900">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-shrink-0 text-center md:text-left">
                  <p className="text-xs tracking-widest text-gray-500 mb-2 bundle-badge">BUNDLE & SAVE</p>
                  <h3 className="text-2xl font-bold text-gray-900 bundle-title">Complete Package</h3>
                </div>
                <div className="flex-grow text-center md:text-left md:px-6">
                  <p className="text-gray-600 bundle-desc">Combine all three services and save up to ~$500</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-gray-400 line-through text-lg bundle-old-price">$2,997</span>
                      <span className="text-3xl font-bold text-gray-900 bundle-price">$2,499</span>
                    </div>
                    <p className="text-xs text-gray-500 bundle-save">~$500</p>
                  </div>
                  <div className="w-12 h-12 border-2 border-gray-900 flex items-center justify-center transition-all bundle-arrow">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Order form */}
        <div id="orderForm" className="mt-16">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-4 sm:px-6">Your Order</h3>
          <p className="text-sm text-gray-600 mb-6 sm:mb-8 px-4 sm:px-6">Select your packages and complete the form below</p>
          <div className="grid lg:grid-cols-2 gap-8 px-0 sm:px-6">
            {/* Left: summary */}
            <div className="lg:sticky lg:top-24 h-fit space-y-6">
              <div className="bg-white border-2 border-gray-900 rounded-none p-6">
                <h4 className="text-base font-bold text-gray-900 mb-4">Select Packages</h4>
                <div className="space-y-2">
                  {CARDS.map(card => (
                    <label key={card.key} className={`flex items-center gap-3 p-3 border cursor-pointer hover:border-gray-900 transition-all duration-300 package-checkbox-wrapper ${pkgs[card.key].selected ? 'border-gray-900 bg-gray-50' : 'border-gray-200'}`}>
                      <input type="checkbox" checked={pkgs[card.key].selected} onChange={e => { setPkgs(p => { const n={...p,[card.key]:{...p[card.key],selected:e.target.checked}}; const all=Object.values(n).every(v=>v.selected); setBundle(all); save(n,all); return n; }); }} className="w-4 h-4 border-2 border-gray-900 text-gray-900 cursor-pointer flex-shrink-0" />
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900 truncate">{card.title}</span>
                          <span className="font-bold text-sm text-gray-900 whitespace-nowrap">{card.displayPrice}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 p-3 bg-gray-900 text-white cursor-pointer hover:bg-gray-800 transition-all duration-300">
                    <input type="checkbox" checked={bundle} onChange={e => toggleBundle(e.target.checked)} className="w-4 h-4 border-2 border-white bg-gray-900 cursor-pointer flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <div className="min-w-0">
                          <span className="text-xs tracking-wider text-gray-400 block">BUNDLE & SAVE</span>
                          <span className="font-semibold text-sm block truncate">Complete Package</span>
                        </div>
                        <div className="text-right whitespace-nowrap">
                          <span className="font-bold text-sm">$2,499</span>
                          <span className="text-xs text-gray-400 line-through block">$2,997</span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <div className="bg-gray-50 border-2 border-gray-200 rounded-none p-6 sm:p-8">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h4>
                <div className="mb-6">
                  {hasSelection ? (
                    bundle ? (
                      <div className="bg-white border-2 border-gray-900 p-4 mb-2">
                        <p className="font-bold text-gray-900 mb-2">Complete Package Bundle</p>
                        <div className="space-y-1 text-sm text-gray-600">
                          {[['Infrastructure Setup','$1,299'],['Payment Gateway','$999'],['Marketing Support','$899']].map(([n,p])=>(
                            <div key={n} className="flex justify-between"><span>&bull; {n}</span><span>{p}</span></div>
                          ))}
                          <div className="flex justify-between pt-2 border-t border-gray-300 font-semibold text-green-600"><span>Bundle Discount</span><span>-$499</span></div>
                        </div>
                      </div>
                    ) : (
                      Object.entries(pkgs).filter(([,v])=>v.selected).map(([k,v])=>(
                        <div key={k} className="flex justify-between items-center text-sm py-2 border-b border-gray-200">
                          <span className="text-gray-700">{v.name}</span>
                          <span className="font-semibold text-gray-900">${v.price.toLocaleString('en-US')}</span>
                        </div>
                      ))
                    )
                  ) : <p className="text-sm text-gray-500 italic">No packages selected yet</p>}
                </div>
                <div className="border-t-2 border-gray-900 pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-base sm:text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">${total.toLocaleString('en-US')}</span>
                  </div>
                  <div className="space-y-3 text-sm text-gray-600">
                    {['Secure payment processing','Response within 24 hours','Free consultation included'].map(t=>(
                      <div key={t} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Right: form */}
            <div>
              <div className="bg-white border-2 border-gray-900 rounded-none p-6 sm:p-8">
                <h4 className="text-lg font-bold text-gray-900 mb-6">Contact Information</h4>
                <form onSubmit={submitOrder} className="space-y-4 sm:space-y-5">
                  {[{id:'orderName',label:'Full Name *',type:'text',placeholder:'John Doe'},{id:'orderEmail',label:'Email Address *',type:'email',placeholder:'john@example.com'},{id:'orderPhone',label:'Phone Number *',type:'tel',placeholder:'+1 (555) 000-0000'}].map(f=>(
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-sm font-semibold text-gray-900 mb-2">{f.label}</label>
                      <input type={f.type} id={f.id} name={f.id} required className="w-full border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none transition-colors" placeholder={f.placeholder} />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="orderRequirements" className="block text-sm font-semibold text-gray-900 mb-2">Additional Requirements</label>
                    <textarea id="orderRequirements" name="orderRequirements" rows={5} className="w-full border-2 border-gray-200 px-4 py-3 text-gray-900 focus:border-gray-900 focus:outline-none transition-colors resize-none" placeholder="Tell us about your specific needs..." />
                  </div>
                  <button type="submit" disabled={!hasSelection || submittingOrder} className="w-full bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {submittingOrder ? 'Sending Request...' : 'Submit Request →'}
                  </button>
                  {orderFeedback && (
                    <div
                      className={`border px-4 py-3 text-sm leading-relaxed ${
                        orderFeedback.status === 'success'
                          ? 'border-green-200 bg-green-50 text-green-800'
                          : 'border-red-200 bg-red-50 text-red-700'
                      }`}
                      role={orderFeedback.status === 'error' ? 'alert' : 'status'}
                    >
                      {orderFeedback.message}
                    </div>
                  )}
                  {!hasSelection && <p className="text-xs text-gray-500 text-center">Please select at least one package to continue</p>}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Toast */}
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-4 shadow-2xl z-[90] max-w-sm w-full mx-4 transition-all duration-300 ${toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-32 pointer-events-none'}`}>
          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <div className="flex-grow"><p className="font-semibold text-sm">Package selected!</p><p className="text-xs text-gray-300">Scroll down to complete your order</p></div>
            <button onClick={() => { document.getElementById('orderForm')?.scrollIntoView({behavior:'smooth'}); setToast(false); }} className="text-xs underline whitespace-nowrap mr-2">Go now</button>
            <button onClick={() => setToast(false)} className="text-gray-400 hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </div>

        {/* Floating buttons */}
        <div className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-4">
          <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="group relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          <button onClick={() => setChatOpen(o=>!o)} className="group relative w-14 h-14 bg-gray-900 hover:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">1</span>
          </button>
        </div>

        {/* Chat popup */}
        {chatOpen && (
          <div className="fixed bottom-28 right-8 w-96 max-w-[calc(100vw-4rem)] bg-white rounded-lg shadow-2xl z-50">
            <div className="bg-gray-900 text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
                <div><p className="font-semibold">Support Team</p><p className="text-xs text-gray-300">Online • Typically replies instantly</p></div>
              </div>
              <button onClick={() => setChatOpen(false)} className="hover:bg-gray-800 p-1 rounded transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="h-64 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
              {!identified ? (
                <form onSubmit={submitInfo} className="flex flex-col gap-3 p-2">
                  <p className="text-sm text-gray-700 font-medium">Before we start, please tell us:</p>
                  <input required value={infoForm.name} onChange={e => setInfoForm(f => ({...f, name: e.target.value}))}
                    placeholder="Your name *" className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gray-900" />
                  <input required value={infoForm.contact} onChange={e => setInfoForm(f => ({...f, contact: e.target.value}))}
                    placeholder="Email or phone number *" className="border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-gray-900" />
                  <button type="submit" className="bg-gray-900 text-white rounded-full py-2 text-sm font-semibold hover:bg-gray-800">Start chatting</button>
                </form>
              ) : (
                <>
                  <div className="bg-white p-3 rounded-lg shadow-sm self-start max-w-[85%]">
                    <p className="text-sm text-gray-800">Hi there! 👋 Welcome to PwT Solutions. How can we help you today?</p>
                  </div>
                  {messages.map((m, i) => (
                    <div key={i} className={`p-3 rounded-lg shadow-sm text-sm max-w-[85%] whitespace-pre-wrap ${m.role === 'user' ? 'bg-gray-900 text-white self-end' : 'bg-white text-gray-800 self-start'}`}>
                      {m.content}
                    </div>
                  ))}
                  {loading && <div className="bg-white p-3 rounded-lg shadow-sm self-start text-sm text-gray-400">Typing…</div>}
                </>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
              {identified && <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  defaultValue=""
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
                  placeholder="Type your message..."
                  className="flex-1 border-2 border-gray-200 rounded-full px-4 py-2 text-sm focus:border-gray-900 focus:outline-none transition-colors"
                />
                <button onClick={sendMessage} disabled={loading} className="bg-gray-900 text-white p-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
