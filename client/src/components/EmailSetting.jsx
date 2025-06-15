import { useState } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserEmail } from '../features/auth/authSlice';

const EmailSetting = () => {
    const dispatch = useDispatch()

  const [email, setEmail] = useState('');


  const handleEmailChange = async () => {
    if(!email){
toast.error('Please enter a valid email.');
return 
    }

     try {
          const res = await dispatch(updateUserEmail({email})).unwrap();
          toast.success("Email updated successfully!");
        } catch (err) {
          toast.error(err?.message + ":\n " + err.error || "Failed to update email.");
        }
  };



  return (
    <div className=" bg-[#1D1D1D] text-white py-6 flex justify-center">
      <div className="w-full max-w-xl bg-[#1D1D1D] rounded-xl p-6  relative">

        <div className="mb-6 space-y-3">
          <label className="text-sm text-gray-300 flex items-center gap-2">
            <FiMail /> New Email
          </label>
          <input
            type="email"
            placeholder="Enter new email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#2F3032] rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <button
            onClick={handleEmailChange}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md transition"
          >
            Update Email
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailSetting;
