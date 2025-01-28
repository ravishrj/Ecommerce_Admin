"use client";

import { useState } from "react";
import { fireStore } from "@/app/_components/firebase/config";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const FAQAdmin = () => {
  const [faq, setFaq] = useState([{ question: "", answer: "" }]);
  const [loading, setLoading] = useState(false);

  const handleFaqChange = (e, index, field) => {
    const updatedFaqs = [...faq];
    updatedFaqs[index][field] = e.target.value;
    setFaq(updatedFaqs);
  };

  const addFaqField = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const removeFaqField = (index) => {
    setFaq((prevFaq) => prevFaq.filter((_, i) => i !== index));
  };

  const handleAddFAQ = async () => {
    if (faq.some((item) => !item.question.trim() || !item.answer.trim())) {
      toast.error("All FAQ fields must be filled!");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(fireStore, "FAQ"), { faqs: faq });
      toast.success("FAQ added successfully!");
      setFaq([{ question: "", answer: "" }]); // Reset form after submission
    } catch (error) {
      console.error("Error adding FAQ:", error);
      alert("Failed to add FAQ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10 bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-[95%] md:max-w-3xl lg:max-w-5xl">
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">
          Admin: Add FAQ
        </h2>

        {faq.map((item, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Enter your question"
              value={item.question}
              onChange={(e) => handleFaqChange(e, index, "question")}
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              placeholder="Enter the answer"
              value={item.answer}
              onChange={(e) => handleFaqChange(e, index, "answer")}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              className="text-red-500 mt-2 hover:text-red-700"
              type="button"
              onClick={() => removeFaqField(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full"
          type="button"
          onClick={addFaqField}
        >
          + Add Another FAQ
        </button>

        <button
          onClick={handleAddFAQ}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded-md text-white font-semibold ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Adding..." : "Add FAQ"}
        </button>
      </div>
    </div>
  );
};

export default FAQAdmin;
