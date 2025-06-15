import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearStatus, loginUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, status, formError } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    usernameOrEmail: '', 
    password: ''
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success('Login successful!');
      toast.success("Redirecting to app>")
      setTimeout(() => {
        navigate("/chats")
        dispatch(clearStatus())
      },1000)
    } else if (status === 'failed' && formError) {
      toast.error(formError);
    }
  }, [status, formError, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#252525] p-8 rounded-3xl shadow-lg w-full max-w-sm space-y-5 text-white"
      >
        <h2 className="text-3xl font-bold text-center">Login</h2>

        <input
          name="usernameOrEmail"
          type="text"
          placeholder="Username or Email"
          required
          value={form.usernameOrEmail}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[#2e2e2e] placeholder-gray-400 outline-none shadow-inner"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full p-3 rounded-xl bg-[#2e2e2e] placeholder-gray-400 outline-none shadow-inner"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#ff3b30] hover:bg-[#e63229] text-white rounded-xl shadow-md font-semibold transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-[#ff3b30] cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
