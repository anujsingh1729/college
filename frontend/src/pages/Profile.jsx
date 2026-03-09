import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    grade: "",
    interests: "",
    dream_colleges: "",
    career_goals: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        grade: parseInt(form.grade),
        interests: form.interests.split(",").map((s) => s.trim()),
        dream_colleges: form.dream_colleges.split(",").map((s) => s.trim()),
        career_goals: form.career_goals,
      };

      const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://comfortable-forgiveness-production.up.railway.app";
      const res = await axios.post(`${backendUrl}/generate-plan`, payload);
      const plan = res.data;

      // Save to Supabase
      const { error: dbError } = await supabase.from("plans").insert({
        user_id: user.id,
        child_name: form.name,
        profile: payload,
        plan: plan,
      });

      if (dbError) throw dbError;

      // Also cache locally for immediate dashboard render
      localStorage.setItem("plan", JSON.stringify(plan));
      localStorage.setItem("childName", form.name);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-8 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">
        Child's Profile
      </h2>

      <div className="flex flex-col gap-4">
        <input name="name" placeholder="Child's Name" onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:outline-indigo-400" />

        <input name="grade" placeholder="Grade (6-12)" type="number"
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:outline-indigo-400" />

        <input name="interests" placeholder="Interests (e.g. coding, music, sports)"
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:outline-indigo-400" />

        <input name="dream_colleges" placeholder="Dream Colleges (e.g. MIT, Stanford)"
          onChange={handleChange}
          className="border rounded-lg px-4 py-2 focus:outline-indigo-400" />

        <textarea name="career_goals" placeholder="Career Goals (e.g. I want to be a doctor)"
          onChange={handleChange} rows={3}
          className="border rounded-lg px-4 py-2 focus:outline-indigo-400" />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button onClick={handleSubmit} disabled={loading}
          className="bg-indigo-600 text-white py-3 rounded-full font-semibold hover:bg-indigo-700 transition disabled:opacity-50">
          {loading ? "Generating Plan..." : "Generate My Plan →"}
        </button>
      </div>
    </div>
  );
}
