"use client";
import { useState, useRef, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { fireStore } from "@/app/_components/firebase/config";
import { Timestamp } from "firebase/firestore";
import { doc } from "firebase/firestore";

const Create_Product = () => {
  const [productInfo, setProductInfo] = useState({
    productName: "",

    productCode: "",
    productDescription: "",
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
  const [createProductInfo, setcreateProductInfo] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather the form data into a productData object
    const productData = {
      productInfo, // Contains productName, productCode, productDescription
      productImages, // Array of images
      priceInfo, // Contains Price, costPrice, discount_Price, tax_Rate
      attribute, // Contains category, Tags, Brands
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
    } catch (error) {
      console.error("Errorng document: ", error);
    }

    // Reset form data by setting state variables back to their initial values
    setProductInfo({
      productName: "",
      productCode: "",
      productDescription: "",
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
                    {/* <div className="card-body" bis_skin_checked={1}>
                      <h4 className="mb-6">Basic Information</h4>
                      <div bis_skin_checked={1}>
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">
                            Product name
                          </label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="Product Name"
                              type="text"
                              defaultValue=""
                              name="name"
                            />
                          </div>
                        </div>
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">
                            Product code
                          </label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="Product Code"
                              type="text"
                              defaultValue=""
                              name="productCode"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-item vertical" bis_skin_checked={1}>
                        <label className="form-label mb-2">Description</label>
                        <div className="" bis_skin_checked={1}>
                          <div
                            className="rich-text-editor rounded-xl ring-1 ring-gray-200 dark:ring-gray-600 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 pt-3"
                            bis_skin_checked={1}
                          >
                            <div
                              className="flex gap-x-1 gap-y-2 px-2"
                              bis_skin_checked={1}
                            >
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Bold"
                              >
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
                                  <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z" />
                                  <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" />
                                </svg>
                              </button>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Italic"
                              >
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
                                  <path d="M11 5l6 0" />
                                  <path d="M7 19l6 0" />
                                  <path d="M14 5l-4 14" />
                                </svg>
                              </button>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Strikethrough"
                              >
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
                                  <path d="M5 12l14 0" />
                                  <path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" />
                                </svg>
                              </button>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Code"
                              >
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
                                  <path d="M7 8l-4 4l4 4" />
                                  <path d="M17 8l4 4l-4 4" />
                                  <path d="M14 4l-4 16" />
                                </svg>
                              </button>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Blockquote"
                              >
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
                                  <path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />
                                  <path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5" />
                                </svg>
                              </button>
                              <div
                                className="dropdown-toggle"
                                role="menuitem"
                                aria-expanded="false"
                                aria-haspopup="menu"
                                id=":r2v:"
                                bis_skin_checked={1}
                              >
                                <button
                                  className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                  type="button"
                                  title="Heading"
                                >
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
                                    <path d="M6 12h12" />
                                    <path d="M6 20V4" />
                                    <path d="M18 20V4" />
                                  </svg>
                                </button>
                              </div>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Bullet List"
                              >
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
                                  <path d="M9 6l11 0" />
                                  <path d="M9 12l11 0" />
                                  <path d="M9 18l11 0" />
                                  <path d="M5 6l0 .01" />
                                  <path d="M5 12l0 .01" />
                                  <path d="M5 18l0 .01" />
                                </svg>
                              </button>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Ordered List"
                              >
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
                                  <path d="M11 6h9" />
                                  <path d="M11 12h9" />
                                  <path d="M12 18h8" />
                                  <path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" />
                                  <path d="M6 10v-6l-2 2" />
                                </svg>
                              </button>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Code Block"
                              >
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
                                  <path d="M15 12h.01" />
                                  <path d="M12 12h.01" />
                                  <path d="M9 12h.01" />
                                  <path d="M6 19a2 2 0 0 1 -2 -2v-4l-1 -1l1 -1v-4a2 2 0 0 1 2 -2" />
                                  <path d="M18 19a2 2 0 0 0 2 -2v-4l1 -1l-1 -1v-4a2 2 0 0 0 -2 -2" />
                                </svg>
                              </button>
                              <button
                                className="tool-button text-xl heading-text hover:text-primary flex items-center p-1.5 rounded-lg"
                                type="button"
                                title="Horizontal Rule"
                              >
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
                                  <path d="M5 12l14 0" />
                                </svg>
                              </button>
                            </div>
                            <div
                              className="max-h-[600px] overflow-auto px-2 prose prose-p:text-sm prose-p:dark:text-gray-400 max-w-full"
                              bis_skin_checked={1}
                            >
                              <div
                                // contentEditable="true"
                                translate="no"
                                className="tiptap ProseMirror m-2 focus:outline-none"
                                tabIndex={0}
                                bis_skin_checked={1}
                              >
                                <p>
                                  <br className="ProseMirror-trailingBreak" />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
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
                    {/* <div className="card-body" bis_skin_checked={1}>
                      <h4 className="mb-2">Product Image</h4>
                      <p>
                        Choose a product photo or simply drag and drop up to 5
                        photos here.
                      </p>
                      <div className="mt-4" bis_skin_checked={1}>
                        <div
                          className="form-item vertical mb-4"
                          bis_skin_checked={1}
                        >
                          <label className="form-label" />
                          <div className="" bis_skin_checked={1}>
                            <div
                              className="upload upload-draggable hover:border-primary"
                              bis_skin_checked={1}
                            >
                              <input
                                className="upload-input draggable"
                                title=""
                                type="file"
                                defaultValue=""
                              />
                              <div
                                className="max-w-full flex flex-col px-4 py-8 justify-center items-center"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="text-[60px]"
                                  bis_skin_checked={1}
                                >
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
                                    Drop your image here, or{" "}
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
                      <p>
                        Image formats: .jpg, .jpeg, .png, preferred size: 1:1,
                        file size is restricted to a maximum of 500kb.
                      </p>
                    </div> */}
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
                            <option value="Palato alto">Palato Alto</option>
                            <option value="Cisco">Cisco</option>
                            <option value="Watch guard">Watch Guard</option>
                            <option value="Fortinet">Fortinet</option>
                            <option value="Sophos">Sophos</option>
                            <option value="Juniper">Juniper</option>
                            <option value="Barakuda">Barakuda</option>
                            <option value="Cloudflare">Cloudflare</option>
                            <option value="Digicert">Digicert</option>
                            <option value="Global sign">Global Sign</option>
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
