import { supabase } from "../supabaseClient";

export default function Login() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/profile",
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
        Build Your Child's Future Today
      </h1>
      <p className="text-gray-500 text-lg max-w-xl mb-10">
        CollegeEdge generates a personalized college readiness plan for your
        child — activities, volunteering, summer programs, and more.
      </p>
      <button
        onClick={handleGoogleLogin}
        className="flex items-center gap-3 bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-full text-lg font-semibold shadow hover:shadow-md transition"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-6 h-6"
        />
        Continue with Google
      </button>
    </div>
  );
}
