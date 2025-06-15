import { FiGithub, FiMail, FiGlobe, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import logo from "../../assets/logo.png"

const AboutPage = () => {
    const navigate = useNavigate()
  const appVersion = 'v1.0.0';

  return (
    <div className="min-h-screen bg-[#24272E] text-white px-4 py-8 flex justify-center">
      <div className="w-full   rounded-xl p-6  space-y-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-pink-500 hover:text-pink-600"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>
        <div className="text-center">
          <img
            src={logo}
            alt="App Logo"
            className="w-16 h-16 mx-auto mb-2 invert"
          />
          <h1 className="text-2xl font-bold text-pink-500">BaldZ</h1>
          <p className="text-sm text-gray-400 mt-1">Version {appVersion}</p>
        </div>

        <section>
          <h2 className="text-lg font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
BledZ is a real-time chat platform focused on privacy, simplicity, and lightning-fast communication. Our mission is to empower people to stay connected — securely and beautifully. We believe in creating meaningful conversations without compromising user data or overwhelming interfaces. With end-to-end encryption, intuitive design, and seamless performance across devices, BledZ is built for individuals and teams who value trust, speed, and elegance in every interaction. Whether it's a quick message or a deep conversation, BledZ makes staying connected effortless and secure.          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Developed By</h2>
          <p className="text-gray-300 text-sm">Yash V (Full Stack Developer)</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">Connect With Us</h2>
          <div className="space-y-2 text-sm text-gray-300">
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-pink-500 transition"
            >
              <FiGithub size={16} /> GitHub Repository
            </a>
            <a
              href="mailto:support@swordtalk.app"
              className="flex items-center gap-2 hover:text-pink-500 transition"
            >
              <FiMail size={16} /> support@bladz.app
            </a>
            <a
              href="https://swordtalk.app"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-pink-500 transition"
            >
              <FiGlobe size={16} /> Official Website
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
