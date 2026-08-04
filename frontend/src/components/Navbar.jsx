import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleLogout } from '../utils/auth';

const Navbar = () => {
    const navigate = useNavigate();

    const Logout = () => {
        handleLogout(navigate);
        toast.success('Logged out successfully');
    }

    return (
        <div className="sticky top-0 z-50 bg-slate-950 text-white shadow-xl border-b border-green-500">
            <nav className="bg-slate-900 text-white shadow-sm border-b border-green-500">
                <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
                    <Link to="/dashboard" className="text-2xl font-extrabold tracking-tight">
                        Manage Your Work
                    </Link>
                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                        <Link
                            to="/dashboard"
                            className="px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-300 transition"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/profile"
                            className="px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-cyan-300 transition"
                        >
                            Profile
                        </Link>
                        <button
                            onClick={Logout}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-semibold transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar;