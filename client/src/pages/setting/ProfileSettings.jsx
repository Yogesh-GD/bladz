import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiCamera, FiArrowLeft } from 'react-icons/fi';
import { updateUserProfile } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';


const ProfileSettings = () => {
  const {user : authUser ,loading,formError} = useSelector((state) => state.auth);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarImg, setAvatarImg] = useState('/default-avatar.png');
  const [avatar, setAvatar] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let localAdd = "http://localhost:3000";
 
  useEffect(() => {
    if (authUser) {
      setUsername(authUser.username || '');
      setBio(authUser.bio || '');
      setAvatarImg(
        authUser.avatar
          ? localAdd.concat(authUser.avatar.replace("public", ""))
          : "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"
      );
    }
  }, [authUser]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setAvatarImg(preview);
      setAvatar(file);
    }
  };

  const handleSave =async () => {
    const data = new FormData();
    data.append("username", username);
    data.append("bio", bio);
    if (avatar) {
      data.append("avatar", avatar);
    }
     try {
      const res = await dispatch(updateUserProfile(data)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err) {

      toast.error(err?.message + ":\n " + err.error || "Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-[#24272E] text-white px-4 py-6 flex justify-center">
      <div className="w-full max-w-xl bg-[#1d1d1d] rounded-xl p-6 shadow-lg border border-[#2a2f4a] relative">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-pink-500 hover:text-pink-600"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>

        <h2 className="text-2xl font-bold text-pink-500 mb-6 text-center">My Profile</h2>

        <div className="flex flex-col items-center mb-6 relative">
          <div className="relative group">
            <img
              src={avatarImg}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-pink-600 shadow-md"
            />
            <label
              htmlFor="avatarUpload"
              className="absolute bottom-2 right-2 bg-pink-600 p-2 rounded-full cursor-pointer hover:bg-pink-700 transition"
            >
              <FiCamera size={16} />
            </label>
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>
        

        <div className="space-y-5">

           <div>
            <label className="block text-sm text-gray-300 mb-1">Mobile :</label>
           <h2>{authUser.mobile ? authUser.mobile : "Not added..."}</h2>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Username</label>
            <input
              type="text"
              className="w-full bg-[#2f3032] rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-pink-500 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Bio</label>
            <textarea
              rows={3}
              className="w-full bg-[#2F3032] rounded-lg px-4 py-3 text-white outline-none resize-none focus:ring-2 focus:ring-pink-500 transition"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-medium text-center transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
