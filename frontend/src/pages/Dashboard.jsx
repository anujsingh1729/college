import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const sections = [
  { key: "activities", label: "🏫 Activities & Clubs", color: "bg-blue-50 border-blue-200" },
  { key: "volunteering", label: "🤝 Volunteering", color: "bg-green-50 border-green-200" },
  { key: "summer_programs", label: "☀️ Summer Programs", color: "bg-yellow-50 border-yellow-200" },
  { key: "skills_certifications", label: "📜 Skills & Certifications", color: "bg-purple-50 border-purple-200" },
  { key: "monthly_tracker", label: "📅 Monthly Goals", color: "bg-pink-50 border-pink-200" },
  { key: "essay_topics", label: "✍️ Essay Topics", color: "bg-orange-50 border-orange-200" },
];

export default function Dashboard() {
  const [savedPlans, setSavedPlans] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPlans() {
      const { data, error } = await supabase
        .from("plans")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setSavedPlans(data);
      }
      setLoading(false);
    }
    fetchPlans();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-lg">
        Loading your plans...
      </div>
    );
  }

  if (savedPlans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-400 text-lg">No plans yet.</p>
        <button onClick={() => navigate("/profile")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
          Create Your First Plan
        </button>
      </div>
    );
  }

  const current = savedPlans[selectedIndex];
  const plan = current.plan;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 pb-16">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-extrabold text-indigo-700">
          {current.child_name}'s College Readiness Plan
        </h2>
        <p className="text-gray-400 mt-2">
          Personalized roadmap to your dream college
        </p>
      </div>

      {/* Plan selector (if multiple plans) */}
      {savedPlans.length > 1 && (
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {savedPlans.map((p, i) => (
            <button key={p.id} onClick={() => setSelectedIndex(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                i === selectedIndex
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
              }`}>
              {p.child_name} · {new Date(p.created_at).toLocaleDateString()}
            </button>
          ))}
        </div>
      )}

      {/* Plan grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.key}
            className={`border rounded-2xl p-6 ${section.color}`}>
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              {section.label}
            </h3>
            <ul className="flex flex-col gap-2">
              {plan[section.key].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-indigo-400 font-bold mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button onClick={() => navigate("/profile")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition">
          Generate New Plan
        </button>
      </div>
    </div>
  );
}
