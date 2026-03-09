import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-tight">
        🎓 CollegeEdge
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium">
        {user ? (
          <>
            <Link to="/profile" className="hover:text-indigo-200">Create Plan</Link>
            <Link to="/dashboard" className="hover:text-indigo-200">My Plans</Link>
            <span className="text-indigo-200 hidden sm:block">{user.email}</span>
            <button onClick={handleSignOut}
              className="bg-white text-indigo-600 px-4 py-1.5 rounded-full font-semibold hover:bg-indigo-50 transition">
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-indigo-200">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
