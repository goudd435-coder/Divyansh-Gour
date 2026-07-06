import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to send message. Please try again.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const mapEmbedUrl = "https://maps.google.com/maps?q=Shagun%20Vihar%20colony,%20Sarangpur,%20Madhya%20Pradesh%20465697&t=&z=16&ie=UTF8&iwloc=&output=embed";

  return (
    <section id="contact" className="py-24 bg-dark-bg border-t border-red-950/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 font-mono text-xs uppercase mb-3">
            Get In Touch
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Contact <span className="text-red-500">Royal Fitness Club</span>
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto text-sm">
            Have questions about fees, personal training slots, or custom requirements? Shoot us a message or visit the club directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Info list */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-dark-card border border-dark-card-border rounded-2xl space-y-6">
              
              {/* Gym Name & Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-display font-semibold text-lg uppercase tracking-wide">Club Location</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    Royal Fitness Club, Shagun Vihar colony, Sarangpur, Madhya Pradesh 465697
                  </p>
                  <p className="text-red-500 text-xs mt-1.5 font-mono">
                    Plus Code: HFCH+F3 Sarangpur, Madhya Pradesh
                  </p>
                </div>
              </div>

              {/* Mobile details */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.18-4.156-6.98-6.98l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-display font-semibold text-lg uppercase tracking-wide">Mobile Number</h4>
                  <p className="text-gray-300 text-sm mt-1">
                    <a href="tel:07999960952" className="hover:text-red-500 transition-colors">07999960952</a>
                  </p>
                </div>
              </div>

              {/* Working hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-display font-semibold text-lg uppercase tracking-wide">Working Batches</h4>
                  <div className="text-gray-300 text-xs space-y-1.5 mt-2 font-sans">
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Morning Batch:</span>
                      <span className="text-red-400 font-bold font-mono">5:00 AM - 10:00 AM</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span>Evening Batch:</span>
                      <span className="text-red-400 font-bold font-mono">4:00 PM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Sundays:</span>
                      <span className="font-semibold uppercase tracking-wider text-[10px]">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact message form */}
          <div className="lg:col-span-7">
            <div className="p-8 bg-dark-card border border-dark-card-border rounded-2xl shadow-xl">
              <h3 className="font-display font-bold text-xl text-white mb-6 uppercase tracking-wide">
                Send a <span className="text-red-500 font-black">Direct Enquiry</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {success && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-sm">Message Sent!</h4>
                      <p className="text-xs text-green-500/80 mt-0.5">Thank you for contacting Royal Fitness Club. We will review your message and reach out shortly.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl text-red-400 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                    <div>
                      <h4 className="font-bold text-sm">Failed to Send Message</h4>
                      <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      placeholder="e.g. Priyanshu"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Your Email</label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      required
                      placeholder="e.g. contact@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                    <input
                      type="tel"
                      id="contact-phone"
                      name="phone"
                      required
                      placeholder="e.g. 07999960952"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      required
                      placeholder="e.g. Personal Training Enquiries"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-bg border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Describe your questions or requirements in detail..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-bg border border-dark-card-border text-white rounded-xl focus:outline-none focus:border-red-500 transition-colors text-sm resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  id="contact-submit-btn"
                  disabled={loading}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all duration-300 shadow-lg shadow-red-600/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending Message...' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </div>

        </div>

        {/* Full-width Map container */}
        <div className="w-full h-96 rounded-2xl overflow-hidden border border-dark-card-border shadow-2xl relative">
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Royal Fitness Club Location Map"
            className="filter invert-[90%] hue-rotate-[180deg] contrast-[120%] brightness-[95%]"
          ></iframe>
        </div>

      </div>
    </section>
  );
}
