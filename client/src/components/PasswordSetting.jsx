import { useState } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { changeUserPassword } from '../features/auth/authSlice';
import { useDispatch } from 'react-redux';

const PasswordSettings = () => {
const dispatch = useDispatch()
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');



  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) {
        toast.error('Please fill both fields.');
    } 

    try {
              const res = await dispatch(changeUserPassword({currentPassword,newPassword})).unwrap();
      toast.success('Password changed successfully!');
            } catch (err) {
              toast.error(err?.message + ":\n " + err.error || "Failed to change password.");
            }
  };



  return (
    <div className=" bg-[#1D1D1D] text-white py-6 flex justify-center">
      <div className="w-full max-w-xl bg-[#1D1D1D] rounded-xl p-6  relative">

        <div className="mb-6 space-y-3">
          <label className="text-sm text-gray-300 flex items-center gap-2">
            <FiLock /> Current Password
          </label>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-[#2F3032] rounded-lg px-4 py-3 text-white outline-none"
          />

          <label className="text-sm text-gray-300 flex items-center gap-2 mt-2">
            <FiLock /> New Password
          </label>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#2F3032] rounded-lg px-4 py-3 text-white outline-none"
          />

          <button
            onClick={handlePasswordChange}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md transition mt-2"
          >
            Change Password
          </button>
        </div>

     
      </div>
    </div>
  );
};

export default PasswordSettings;
