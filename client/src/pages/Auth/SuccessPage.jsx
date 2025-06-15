import { useNavigate } from 'react-router';

function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] text-white">
      <div className="bg-[#252525] p-8 rounded-3xl shadow-lg w-full max-w-md text-center space-y-6">
        <h2 className="text-3xl font-bold text-green-400"> Successfully Registered!</h2>
        <p className="text-gray-300 text-lg">You can now login to your account.</p>

        <button
          onClick={() => navigate('/login')}
          className="px-6 py-3 bg-[#ff3b30] hover:bg-[#e63229] text-white font-semibold rounded-xl shadow-md transition"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}

export default SuccessPage;
