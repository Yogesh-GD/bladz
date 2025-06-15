import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearStatus, registerUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, status, formError } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });



    useEffect(() => {
        if (status === 'success') {
            toast.success('Registered successfully!');
            dispatch(clearStatus())
            navigate("/registration-success")
        } else if (status === 'failed' && formError) {
            toast.error(formError);
        }
    }, [status, formError, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(form));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e]">
            <form
                onSubmit={handleSubmit}
                className="bg-[#252525] p-8 rounded-3xl shadow-lg w-full max-w-sm space-y-5 text-white"
            >
                <h2 className="text-3xl font-bold text-center">Create Account</h2>

                <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
                    value={form.username}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl bg-[#2e2e2e] placeholder-gray-400 outline-none shadow-inner"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={form.email}
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
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p className="text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <span
                        className="text-[#ff3b30] hover:underline cursor-pointer"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </span>
                </p>

            </form>
        </div>
    );
}

export default RegisterPage;
