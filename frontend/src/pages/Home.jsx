import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-5xl font-extrabold text-indigo-700 mb-4">
        Build Your Child's Future Today
      </h1>
      <p className="text-gray-500 text-lg max-w-xl mb-8">
        CollegeEdge generates a personalized college readiness plan for your
        child — activities, volunteering, summer programs, and more.
      </p>
      <Link
        to="/profile"
        className="bg-indigo-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition"
      >
        Get Started →
      </Link>
    </div>
  );
}