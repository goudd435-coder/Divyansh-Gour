import React from 'react';
import { motion } from 'motion/react';

export default function FloatingWhatsApp() {
  const phoneNumber = '07999960952';
  const message = encodeURIComponent("Hello Royal Fitness Club! I'm interested in joining the gym. Please share more details about the membership plans.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl border-2 border-white/20 cursor-pointer"
      title="Chat with us on WhatsApp"
      id="whatsapp-floating-button"
    >
      {/* Notification dot */}
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>

      {/* WhatsApp Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.38 2.016 13.908.993 11.278.993c-5.44 0-9.866 4.372-9.87 9.802 0 1.63.454 3.22 1.317 4.634l-.993 3.63 3.733-.966zm11.321-7.72c-.3-.149-1.772-.863-2.046-.962-.275-.099-.475-.149-.675.15-.199.3-.773.962-.948 1.16-.175.2-.35.226-.65.076-.3-.15-1.267-.461-2.413-1.471-.892-.786-1.493-1.758-1.668-2.056-.175-.3-.019-.462.131-.61.135-.134.3-.349.45-.523.15-.174.2-.3.3-.499.1-.2.05-.375-.025-.524-.075-.15-.675-1.608-.925-2.203-.243-.585-.49-.506-.675-.516-.174-.009-.374-.01-.574-.01s-.524.075-.798.374c-.275.3-1.047 1.012-1.047 2.47 0 1.457 1.073 2.865 1.223 3.064.15.2 2.111 3.178 5.113 4.466.714.306 1.272.489 1.708.626.717.224 1.37.193 1.886.117.575-.085 1.772-.714 2.022-1.405.25-.69.25-1.282.175-1.405-.075-.124-.275-.199-.575-.349z" />
      </svg>
    </motion.a>
  );
}
