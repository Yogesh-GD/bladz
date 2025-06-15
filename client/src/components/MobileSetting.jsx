import { useState } from 'react';
import { FiPhone } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateMobile } from '../features/auth/authSlice';

const MobileSetting = () => {
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState('');

  const handleMobileChange = async () => {
    const mobileRegex = /^[0-9]{10,15}$/;
    if (!mobileRegex.test(mobile)) {
      toast.error('Please enter a valid mobile number.');
      return;
    }

    try {
      const res = await dispatch(updateMobile({ mobile })).unwrap();
      toast.success('Mobile number updated successfully!');
    } catch (err) {
      toast.error(err?.message + ':\n ' + err.error || 'Failed to update mobile number.');
    }
  };

  return (
    <div className="bg-[#1D1D1D] text-white py-6 flex justify-center">
      <div className="w-full max-w-xl bg-[#1D1D1D] rounded-xl p-6  relative">
        <div className="mb-6 space-y-3">
          <label className="text-sm text-gray-300 flex items-center gap-2">
            <FiPhone /> New Mobile Number
          </label>
          <input
            type="tel"
            placeholder="Enter new mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full bg-[#2F3032] rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <button
            onClick={handleMobileChange}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md transition"
          >
            Update Mobile Number
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSetting;
