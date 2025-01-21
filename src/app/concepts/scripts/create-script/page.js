//
"use client";

import { useState } from "react";
import { fireStore } from "@/app/_components/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const ScriptsAdmin = () => {
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddScript = async () => {
    if (!script.trim()) {
      toast.error("Script content cannot be empty!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(fireStore, "scripts"), { content: script });
      toast.success("Script added successfully!");
      setScript(""); // Clear input after submission
    } catch (error) {
      console.error("Error adding script:", error);
      alert("Failed to add script!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center  mt-10 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[95%] md:max-w-3xl lg:max-w-5xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Admin: Add Script
        </h2>

        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Paste your JavaScript code here..."
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        ></textarea>

        <button
          onClick={handleAddScript}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add Script"}
        </button>
      </div>
    </div>
  );
};

export default ScriptsAdmin;
