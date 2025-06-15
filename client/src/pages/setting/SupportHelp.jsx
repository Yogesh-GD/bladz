import { useState } from 'react';
import { FiMail, FiHelpCircle, FiChevronDown, FiArrowLeft } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Account > Change Password. Follow the prompts to reset your password.',
  },
  {
    question: 'How do I delete my account?',
    answer: 'You can delete your account from Settings > Account. This action is permanent.',
  },
  {
    question: 'Why am I not receiving notifications?',
    answer: 'Ensure that notification permissions are enabled in your browser and app settings.',
  },
];

const SupportHelp = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support request submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#24272E] text-white px-4 py-6 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-[#1D1D1D] rounded-xl p-6  shadow-lg border border-[#2a2f4a] relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-pink-500 hover:text-pink-600"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button> 
        <h2 className="text-2xl pt-8 font-bold text-pink-500 mb-6 flex items-center gap-2">
          <FiHelpCircle /> Support & Help
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-10">
          <h3 className="text-lg font-semibold mb-2">Contact Support</h3>

          {submitted && (
            <p className="text-green-500">Your message has been sent successfully!</p>
          )}

          <input
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-md bg-[#2F3032] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            required
            placeholder="Your email"
            className="w-full px-4 py-3 rounded-md bg-[#2F3032] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <textarea
            rows={4}
            required
            placeholder="How can we help you?"
            className="w-full px-4 py-3 rounded-md bg-[#2F3032] text-white focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium transition"
          >
            <FiMail className="inline mr-2" />
            Submit Request
          </button>
        </form>

          <FAQSection />


        <div className="text-sm text-gray-400 space-x-4 text-center border-t border-[#2a2f4a] pt-4">
          <a href="/privacy-policy" className="hover:text-pink-400 underline">Privacy Policy</a>
          <a href="/terms-of-service" className="hover:text-pink-400 underline">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default SupportHelp;






const FAQSection = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="mb-10">
      <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>

      {faqs.map((faq, idx) => {
        const isOpen = expandedIndex === idx;

        return (
          <div key={idx} className="mb-3 border border-[#2c2f3f] rounded-md">
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full flex justify-between items-center p-4 bg-[#2F3032] hover:bg-[#3b3c3e] transition text-left"
            >
              <span className="font-medium text-sm sm:text-base text-left">{faq.question}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiChevronDown size={18} />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { height: 'auto', opacity: 1 },
                    collapsed: { height: 0, opacity: 0 }
                  }}
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="px-4 py-3 text-sm text-gray-300">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
