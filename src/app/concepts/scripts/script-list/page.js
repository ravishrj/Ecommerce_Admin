"use client";

import { useEffect, useState } from "react";
import { fireStore } from "@/app/_components/firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const ScriptsList = () => {
  const [scripts, setScripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch scripts from Firestore
  useEffect(() => {
    const fetchScripts = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireStore, "scripts"));
        const scriptsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScripts(scriptsArray);
      } catch (err) {
        console.error("Error fetching scripts:", err);
        setError("Failed to load scripts!");
      } finally {
        setLoading(false);
      }
    };

    fetchScripts();
  }, []);

  // Handle Delete Script
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this script?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(fireStore, "scripts", id));
      setScripts(scripts.filter((script) => script.id !== id)); // Update UI
      toast.success("Script deleted successfully!");
    } catch (error) {
      toast.error("Error deleting script:", error);
    }
  };

  // Handle Edit Script
  const handleEdit = (script) => {
    setEditId(script.id);
    setEditContent(script.content);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!editContent.trim()) return alert("Script content cannot be empty!");

    try {
      await updateDoc(doc(fireStore, "scripts", editId), {
        content: editContent,
      });
      setScripts(
        scripts.map((s) =>
          s.id === editId ? { ...s, content: editContent } : s
        )
      ); // Update UI
      setEditId(null);
      alert("Script updated successfully!");
    } catch (error) {
      console.error("Error updating script:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[95%] md:max-w-3xl lg:max-w-5xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          All Scripts
        </h2>

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <ul className="space-y-4 overflow-auto max-h-[400px]">
          {scripts.length > 0
            ? scripts.map((script) => (
                <li
                  key={script.id}
                  className="p-4 border rounded-md bg-gray-50 shadow-sm flex flex-col md:flex-row md:items-center justify-between"
                >
                  {editId === script.id ? (
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border rounded-md text-sm"
                    />
                  ) : (
                    <pre className="text-gray-600 bg-gray-200 p-2 rounded-md text-sm overflow-x-auto w-full md:w-auto">
                      {script.content}
                    </pre>
                  )}

                  <div className="flex space-x-2 mt-2 md:mt-0">
                    {editId === script.id ? (
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(script)}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        title="Edit"
                      >
                        ✏️
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(script.id)}
                      className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))
            : !loading && (
                <p className="text-center text-gray-500">No scripts found.</p>
              )}
        </ul>
      </div>
    </div>
  );
};

export default ScriptsList;
