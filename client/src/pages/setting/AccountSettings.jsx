import { useState } from 'react';
import { FiArrowLeft, FiMail, FiLock, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import PasswordSettings from '../../components/PasswordSetting';
import EmailSetting from '../../components/EmailSetting';
import MobileSetting from '../../components/MobileSetting';

const AccountSettings = () => {
  const navigate = useNavigate();

 



  const handleDeleteAccount = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This cannot be undone.');
    if (confirmed) {
      toast.success('Account deleted (simulation)');
    }
  };

  return (
    <div className="min-h-screen bg-[#24272E] text-white px-4 py-6 flex justify-center">
      <div className="w-full max-w-xl  rounded-xl p-6  bg-[#24272E] relative">

        <div className='bg-[#1D1D1D] px-2 py-2  rounded-xl  shadow-lg border border-[#2a2f4a]'>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 text-pink-500 hover:text-pink-600"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>

        <h2 className="text-2xl font-bold text-pink-500 mb-8 text-center">Account Settings</h2>

        </div>
        <EmailSetting />

        <MobileSetting />

      
       <PasswordSettings />

        {/* Danger Zone */}
        <div className="border-t border-pink-700 pt-6">
          <h3 className="text-lg font-semibold text-red-500 mb-2">Danger Zone</h3>
          <p className="text-sm text-gray-400 mb-4">Deleting your account is permanent and cannot be undone.</p>
          <button
            onClick={handleDeleteAccount}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
          >
            <FiTrash2 /> Delete My Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
