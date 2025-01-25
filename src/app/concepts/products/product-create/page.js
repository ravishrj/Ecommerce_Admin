"use client";
import { useState, useRef, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { fireStore } from "@/app/_components/firebase/config";
import { Timestamp } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { toast } from "react-toastify";

const Create_Product = () => {
  const [productInfo, setProductInfo] = useState({
    productName: "",
    quantity: "", // Added quantity field
    productCode: "",
    productDescription: "",
    how_product_work: "",
    productFeatures: [], // Array to store features
  });
  const [productImages, setProductImages] = useState([]);
  const [priceInfo, setPriceInfo] = useState({
    Price: "",
    costPrice: "",
    discount_Price: "",
    tax_Rate: "",
  });

  const [attribute, setAttributeInfo] = useState({
    category: "",
    Tags: [],
    Brands: "",
  });
  const [faq, setFaq] = useState([
    { question: "", answer: "" }, // Initial empty entry
  ]);

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

  const [createProductInfo, setcreateProductInfo] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather the form data into a productData object
    const productData = {
      productInfo, // Contains productName, productCode, productDescription
      productImages, // Array of images
      priceInfo, // Contains Price, costPrice, discount_Price, tax_Rate
      attribute,
      faq,
    };

    // Add the new product data to the createProductInfo array
    setcreateProductInfo((prevState) => [...prevState, productData]);

    // Log the result to the console
    console.log("Created Product Info:", productData);

    // data stored in firebase
    try {
      const contactDataRef = collection(fireStore, "create_Product");
      // console.log(travelerDataRef, "travelerDataRef");
      //console.log("allTravelerData", allTravelerData);
      await addDoc(contactDataRef, {
        productData,
        // createdAt: new Date(),
        createdAt: Timestamp.now(), // Use Firestore's Timestamp
      });
      toast.success("Congratulatios! product created successsFully");
    } catch (error) {
      console.error("Errorng document: ", error);
    }

    // Reset form data by setting state variables back to their initial values
    setProductInfo({
      productName: "",
      productCode: "",
      productDescription: "",
      quantity: "", // Added quantity field
      how_product_work: "",
      productFeatures: [], // Array to store features
    });

    setProductImages([]); // Reset productImages to an empty array

    setPriceInfo({
      Price: "",
      costPrice: "",
      discount_Price: "",
      tax_Rate: "",
    });

    setAttributeInfo({
      category: "",
      Tags: [],
      Brands: "",
    });
    setFaq([{ question: "", answer: "" }]);
  };

  const handleFeatureChange = (e, index) => {
    const newFeatures = [...productInfo.productFeatures];
    newFeatures[index] = e.target.value;
    setProductInfo({ ...productInfo, productFeatures: newFeatures });
  };

  const addFeature = () => {
    setProductInfo({
      ...productInfo,
      productFeatures: [...productInfo.productFeatures, ""],
    });
  };

  const removeFeature = (index) => {
    const newFeatures = productInfo.productFeatures.filter(
      (_, i) => i !== index
    );
    setProductInfo({ ...productInfo, productFeatures: newFeatures });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyTextStyle = (style) => {
    const textarea = document.getElementById("descriptionTextarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    let formattedText = selectedText;
    if (style === "bold") {
      formattedText = `**${selectedText}**`;
    } else if (style === "italic") {
      formattedText = `_${selectedText}_`;
    } else if (style === "strike") {
      formattedText = `~~${selectedText}~~`;
    }

    const newText =
      text.substring(0, start) + formattedText + text.substring(end);
    setProductInfo((prev) => ({
      ...prev,
      productDescription: newText,
    }));

    // Update textarea value and set the cursor back
    setTimeout(() => {
      textarea.value = newText;
      textarea.setSelectionRange(start, start + formattedText.length);
      textarea.focus();
    }, 0);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];

    files.forEach((file) => {
      if (file.size > 500 * 1024) {
        alert(`${file.name} exceeds 500kb. Please upload a smaller file.`);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          validFiles.push(reader.result); // Convert to base64
          if (
            validFiles.length === files.length ||
            productImages.length + validFiles.length >= 5
          ) {
            const updatedImages = [...productImages, ...validFiles].slice(0, 5); // Limit to 5 images
            setProductImages(updatedImages);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleRemoveImage = (index) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleInputPriceChange = (e) => {
    const { name, value } = e.target;
    setPriceInfo({
      ...priceInfo,
      [name]: value,
    });
  };

  const handleInputAttributeChange = (e) => {
    const { name, value } = e.target;

    // Handle category and brands inputs directly
    if (name === "category" || name === "Brands") {
      setAttributeInfo({
        ...attribute,
        [name]: value, // Update category or Brands directly
      });
    }

    // Handle Tags as an array
    if (name === "Tags") {
      setAttributeInfo({
        ...attribute,
        Tags: value.split(",").map((tag) => tag.trim()), // Split by commas and remove extra spaces
      });
    }
  };

  return (
    <main className="h-full">
      <div
        className="page-container relative h-full flex flex-auto flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8 pb-0 sm:pb-0 md:pb-0"
        bis_skin_checked={1}
      >
        <div
          className="container mx-auto flex items-center justify-between mb-4"
          bis_skin_checked={1}
        >
          <div bis_skin_checked={1}>
            <h3 className="font-bold">Create product</h3>
          </div>
        </div>
        <form className="flex w-full h-full" onSubmit={handleSubmit}>
          <div
            className="form-container vertical flex flex-col w-full justify-between"
            bis_skin_checked={1}
          >
            <div className="container mx-auto" bis_skin_checked={1}>
              <div
                className="flex flex-col xl:flex-row gap-4"
                bis_skin_checked={1}
              >
                <div
                  className="gap-4 flex flex-col flex-auto"
                  bis_skin_checked={1}
                >
                  <div
                    className="card card-border"
                    role="presentation"
                    bis_skin_checked={1}
                  >
                    <div className="card-body">
                      <h4 className="mb-6">Basic Information</h4>

                      {/* Product Name */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">Product Name</label>
                        <input
                          className="input input-md h-12 focus:ring-primary focus:border-primary"
                          autoComplete="off"
                          placeholder="Product Name"
                          type="text"
                          name="productName"
                          value={productInfo.productName}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Product Code */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">Product Code</label>
                        <input
                          className="input input-md h-12 focus:ring-primary focus:border-primary"
                          autoComplete="off"
                          placeholder="Product Code"
                          type="text"
                          name="productCode"
                          value={productInfo.productCode}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Product Quantity */}

                      <div className="form-item vertical">
                        <label className="form-label mb-2">Quantity</label>
                        <input
                          className="input input-md h-12 focus:ring-primary focus:border-primary"
                          autoComplete="off"
                          placeholder="Enter Quantity"
                          type="number"
                          name="quantity"
                          value={productInfo.quantity}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Description */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">Description</label>

                        {/* Formatting Buttons */}
                        <div className="flex gap-x-2 mb-2">
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("bold")}
                          >
                            Bold
                          </button>
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("italic")}
                          >
                            Italic
                          </button>
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("strike")}
                          >
                            Strikethrough
                          </button>
                        </div>

                        {/* Textarea */}
                        <textarea
                          id="descriptionTextarea"
                          className="input input-md h-24 focus:ring-primary focus:border-primary"
                          placeholder="Write a detailed description here..."
                          name="productDescription"
                          value={productInfo.productDescription}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>

                      {/* How product work */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">
                          How Product Works
                        </label>

                        {/* Formatting Buttons */}
                        <div className="flex gap-x-2 mb-2">
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("bold")}
                          >
                            Bold
                          </button>
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("italic")}
                          >
                            Italic
                          </button>
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("strike")}
                          >
                            Strikethrough
                          </button>
                        </div>

                        {/* Textarea */}
                        <textarea
                          id="howProductWorksTextarea"
                          className="input input-md h-24 focus:ring-primary focus:border-primary"
                          placeholder="Explain how the product works..."
                          name="how_product_work"
                          value={productInfo.how_product_work}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>

                      {/* product features */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">
                          Product Features
                        </label>

                        {/* Formatting Buttons */}
                        <div className="flex gap-x-2 mb-2">
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("bold")}
                          >
                            Bold
                          </button>
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("italic")}
                          >
                            Italic
                          </button>
                          <button
                            type="button"
                            className="tool-button text-xl heading-text hover:text-primary p-1.5 rounded-lg border"
                            onClick={() => applyTextStyle("strike")}
                          >
                            Strikethrough
                          </button>
                        </div>

                        {/* Feature List */}
                        {productInfo.productFeatures.map((feature, index) => (
                          <div
                            key={index}
                            className="form-item vertical mb-4 flex items-center gap-2"
                          >
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary w-full"
                              autoComplete="off"
                              placeholder="Enter feature"
                              type="text"
                              value={feature}
                              onChange={(e) => handleFeatureChange(e, index)}
                            />
                            {/* Delete Feature Button */}
                            <button
                              type="button"
                              className="button bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md"
                              onClick={() => removeFeature(index)}
                            >
                              🗑️
                            </button>
                          </div>
                        ))}

                        {/* Add More Feature Button */}
                        <div className="form-item vertical mt-4">
                          <button
                            className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 w-full"
                            type="button"
                            onClick={addFeature}
                          >
                            + Add Another Feature
                          </button>
                        </div>
                      </div>

                      {/* Debugging Output */}
                    </div>
                  </div>
                  <div
                    className="card card-border"
                    role="presentation"
                    bis_skin_checked={1}
                  >
                    <div className="card-body">
                      <h4 className="mb-6">Pricing</h4>
                      <div>
                        <div className="form-item vertical">
                          <label className="form-label mb-2">Price</label>
                          <div>
                            <span className="input-wrapper">
                              <div className="input-suffix-start"> $ </div>
                              <input
                                className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                autoComplete="off"
                                placeholder={0.0}
                                type="text"
                                name="Price"
                                value={priceInfo.Price}
                                onChange={handleInputPriceChange}
                                inputMode="numeric"
                                style={{ paddingLeft: "1.5625rem" }}
                              />
                            </span>
                          </div>
                        </div>

                        <div className="form-item vertical">
                          <label className="form-label mb-2">Cost price</label>
                          <div>
                            <span className="input-wrapper">
                              <div className="input-suffix-start"> $ </div>
                              <input
                                className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                autoComplete="off"
                                placeholder={0.0}
                                type="text"
                                name="costPrice"
                                value={priceInfo.costPrice}
                                onChange={handleInputPriceChange}
                                inputMode="numeric"
                                style={{ paddingLeft: "1.5625rem" }}
                              />
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="md:flex gap-4">
                        <div className="form-item vertical w-full">
                          <label className="form-label mb-2">
                            Bulk discount price
                          </label>
                          <div>
                            <span className="input-wrapper">
                              <div className="input-suffix-start"> $ </div>
                              <input
                                className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                autoComplete="off"
                                placeholder={0.0}
                                type="text"
                                name="discount_Price"
                                value={priceInfo.discount_Price}
                                onChange={handleInputPriceChange}
                                inputMode="numeric"
                                style={{ paddingLeft: "1.5625rem" }}
                              />
                            </span>
                          </div>
                        </div>

                        <div className="form-item vertical w-full">
                          <label className="form-label mb-2">Tax rate(%)</label>
                          <div>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder={0}
                              type="text"
                              name="tax_Rate"
                              value={priceInfo.tax_Rate}
                              onChange={handleInputPriceChange}
                              inputMode="numeric"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="lg:min-w-[440px] 2xl:w-[500px] gap-4 flex flex-col"
                  bis_skin_checked={1}
                >
                  <div
                    className="card card-border"
                    role="presentation"
                    bis_skin_checked={1}
                  >
                    <div className="card-body">
                      <h4 className="mb-2">Product Images</h4>
                      <p>
                        Choose up to 5 product photos or simply drag and drop
                        them here.
                      </p>
                      <div className="mt-4">
                        <div className="form-item vertical mb-4">
                          <label className="form-label">Upload Images</label>
                          <div>
                            <div className="upload upload-draggable hover:border-primary">
                              <input
                                className="upload-input draggable"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                multiple
                                onChange={handleImageChange}
                              />
                              <div className="max-w-full flex flex-col px-4 py-8 justify-center items-center">
                                <div className="text-[60px]">
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth={0}
                                    viewBox="0 0 256 256"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M216,44H72A12,12,0,0,0,60,56V76H40A12,12,0,0,0,28,88V200a12,12,0,0,0,12,12H184a12,12,0,0,0,12-12V180h20a12,12,0,0,0,12-12V56A12,12,0,0,0,216,44ZM68,56a4,4,0,0,1,4-4H216a4,4,0,0,1,4,4v72.4l-16.89-16.89a12,12,0,0,0-17,0l-22.83,22.83L116.49,87.51a12,12,0,0,0-17,0L68,119ZM188,200a4,4,0,0,1-4,4H40a4,4,0,0,1-4-4V88a4,4,0,0,1,4-4H60v84a12,12,0,0,0,12,12H188Zm28-28H72a4,4,0,0,1-4-4V130.34l37.17-37.17a4,4,0,0,1,5.66,0l49.66,49.66a4,4,0,0,0,5.65,0l25.66-25.66a4,4,0,0,1,5.66,0L220,139.71V168A4,4,0,0,1,216,172ZM164,84a8,8,0,1,1,8,8A8,8,0,0,1,164,84Z" />
                                  </svg>
                                </div>
                                <p className="flex flex-col items-center mt-2">
                                  <span className="text-gray-800 dark:text-white">
                                    Drop your images here, or{" "}
                                  </span>
                                  <span className="text-primary">
                                    Click to browse
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {productImages.length > 0 && (
                        <div className="mt-4">
                          <h5 className="mb-2">
                            Preview ({productImages.length}/5):
                          </h5>
                          <div className="grid grid-cols-3 gap-4">
                            {productImages.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Product Preview ${index + 1}`}
                                  className="w-32 h-32 object-cover rounded"
                                />
                                <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <p>
                        Image formats: .jpg, .jpeg, .png, preferred size: 1:1,
                        file size is restricted to a maximum of 500kb per image.
                      </p>
                    </div>
                  </div>
                  <div
                    className="card card-border"
                    role="presentation"
                    bis_skin_checked={1}
                  >
                    <div className="card-body">
                      <h4 className="mb-6">Attribute</h4>

                      {/* Category */}
                      {/* <div className="form-item vertical">
                        <label className="form-label mb-2">Category</label>
                        <div>
                          <input
                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                            autoComplete="off"
                            placeholder="Enter category"
                            type="text"
                            value={attribute.category}
                            onChange={handleInputAttributeChange}
                            name="category"
                          />
                        </div>
                      </div> */}

                      <div className="form-item vertical">
                        <label className="form-label mb-2">Category</label>
                        <div>
                          <select
                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary w-full"
                            value={attribute.category}
                            onChange={handleInputAttributeChange}
                            name="category"
                          >
                            <option value="">Select a category</option>
                            <option value="Norton">Norton</option>
                            <option value="Webroot">Webroot</option>
                            <option value="McAfee">McAfee</option>
                            <option value="Trend Micro">Trend Micro</option>
                            <option value="BitDefender">BitDefender</option>
                            <option value="AVG">AVG</option>
                            <option value="Kaspersky">Kaspersky</option>
                          </select>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">Tags</label>
                        <div>
                          <input
                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                            autoComplete="off"
                            placeholder="Enter tags (comma separated)"
                            type="text"
                            value={attribute.Tags.join(", ")} // Join tags as a comma-separated string
                            onChange={handleInputAttributeChange}
                            name="Tags"
                          />
                        </div>
                      </div>

                      {/* Brand */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">Brand</label>
                        <div>
                          <input
                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                            autoComplete="off"
                            placeholder="Product brand"
                            type="text"
                            value={attribute.Brands}
                            onChange={handleInputAttributeChange}
                            name="Brands"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card card-border"
                    role="presentation"
                    bis_skin_checked={1}
                  >
                    <div className="card-body">
                      <h4 className="mb-6">Frequently Asked Questions</h4>

                      {/* FAQ List */}
                      {Array.isArray(faq) &&
                        faq.map((item, index) => (
                          <div
                            key={index}
                            className="mb-4 relative flex items-start gap-4"
                          >
                            <div className="w-full">
                              {/* Question */}
                              <div className="form-item vertical">
                                <label className="form-label mb-2">
                                  Question
                                </label>
                                <div>
                                  <input
                                    className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary w-full"
                                    autoComplete="off"
                                    placeholder="Enter your question"
                                    type="text"
                                    value={item.question}
                                    onChange={(e) =>
                                      handleFaqChange(e, index, "question")
                                    }
                                  />
                                </div>
                              </div>

                              {/* Answer */}
                              <div className="form-item vertical mt-2">
                                <label className="form-label mb-2">
                                  Answer
                                </label>
                                <div>
                                  <input
                                    className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary w-full"
                                    autoComplete="off"
                                    placeholder="Enter the answer"
                                    type="text"
                                    value={item.answer}
                                    onChange={(e) =>
                                      handleFaqChange(e, index, "answer")
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Delete Button */}
                            <button
                              className="text-error hover:text-red-600 mt-6"
                              type="button"
                              onClick={() => removeFaqField(index)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-trash-2"
                              >
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </div>
                        ))}

                      {/* Add More FAQ Button */}
                      <div className="form-item vertical mt-4">
                        <button
                          className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 w-full"
                          type="button"
                          onClick={addFaqField}
                        >
                          + Add Another FAQ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="bottom-0 left-0 right-0 z-10 mt-8 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 -mx-4 sm:-mx-8 py-4 sticky"
              bis_skin_checked={1}
            >
              <div className="container mx-auto" bis_skin_checked={1}>
                <div
                  className="flex items-center justify-between px-8"
                  bis_skin_checked={1}
                >
                  <span />
                  <div className="flex items-center" bis_skin_checked={1}>
                    <button
                      className="button border dark:bg-gray-700 dark:border-gray-700 dark:ring-white dark:hover:border-white hover:ring-1 dark:hover:text-white dark:hover:bg-transparent dark:text-gray-100 h-12 rounded-xl px-5 py-2 ltr:mr-3 rtl:ml-3 button-press-feedback border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent"
                      type="button"
                    >
                      <span className="flex gap-1 items-center justify-center">
                        <span className="text-lg">
                          <svg
                            stroke="currentColor"
                            fill="none"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4 7l16 0" />
                            <path d="M10 11l0 6" />
                            <path d="M14 11l0 6" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                        </span>
                        <span>Discard</span>
                      </span>
                    </button>
                    <button
                      className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 button-press-feedback"
                      type="submit"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
export default Create_Product;
