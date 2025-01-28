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

const FAQList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");

  // Fetch FAQs from Firestore
  //   useEffect(() => {
  //     const fetchFAQs = async () => {
  //       try {
  //         const querySnapshot = await getDocs(collection(fireStore, "FAQ"));
  //         const faqArray = querySnapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           ...doc.data(),
  //         }));
  //         console.log("Fetched FAQs:", faqArray); // Debugging
  //         setFaqs(faqArray);
  //       } catch (err) {
  //         toast.error("Error fetching FAQs:");
  //         console.error("Error fetching FAQs:", err);
  //         setError("Failed to load FAQs!");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchFAQs();
  //   }, []);
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        console.log("Fetching FAQs...");
        const faqCollection = collection(fireStore, "FAQ");
        const querySnapshot = await getDocs(faqCollection);

        if (querySnapshot.empty) {
          console.log("No FAQs found in Firestore.");
          setFaqs([]); // Ensure UI updates
          return;
        }

        const faqArray = querySnapshot.docs.flatMap((doc) =>
          doc.data().faqs.map((faq, index) => ({
            id: `${doc.id}-${index}`, // Ensure unique key
            ...faq,
          }))
        );

        console.log("Fetched FAQs:", faqArray);
        setFaqs(faqArray);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
        toast.error("Failed to load FAQs!");
        setError("Failed to load FAQs!");
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Handle Delete FAQ
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;
    try {
      await deleteDoc(doc(fireStore, "FAQ", id));
      setFaqs(faqs.filter((faq) => faq.id !== id)); // Update UI
      toast.success("FAQ deleted successfully!");
    } catch (error) {
      toast.error("Error deleting FAQ:", error);
    }
  };

  // Handle Edit FAQ
  const handleEdit = (faq) => {
    setEditId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!editQuestion.trim() || !editAnswer.trim()) {
      toast.error("Question and Answer cannot be empty!");
      return;
    }

    try {
      await updateDoc(doc(fireStore, "FAQ", editId), {
        question: editQuestion,
        answer: editAnswer,
      });
      setFaqs(
        faqs.map((faq) =>
          faq.id === editId
            ? { ...faq, question: editQuestion, answer: editAnswer }
            : faq
        )
      ); // Update UI
      setEditId(null);
      toast.success("FAQ updated successfully!");
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  };
  //   console.log(faqs[0].faqs, "faqs");
  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Frequently Asked Questions
        </h2>

        {loading && <p className="text-center text-blue-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <ul className="space-y-4">
          {faqs.length > 0
            ? faqs.map((faq) => (
                <li
                  key={faq.id}
                  className="p-4 border rounded-md bg-gray-50 shadow-sm flex flex-col"
                >
                  {editId === faq.id ? (
                    <>
                      <input
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm mb-2"
                        placeholder="Edit Question"
                      />
                      <input
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        className="w-full p-2 border rounded-md text-sm"
                        placeholder="Edit Answer"
                      />
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold text-gray-800">
                        {faq.question}
                      </h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </>
                  )}

                  <div className="flex space-x-2 mt-2">
                    {editId === faq.id ? (
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(faq)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            : !loading && (
                <p className="text-center text-gray-500">No FAQs found.</p>
              )}
        </ul>
      </div>
    </div>
  );
};

export default FAQList;
