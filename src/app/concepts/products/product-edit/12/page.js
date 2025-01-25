"use client";
import { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import { fireStore } from "@/app/_components/firebase/config";
import { updateDoc } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";

const Edit_Product = () => {
  const searchParams = useSearchParams() || null;
  const productId = searchParams.get("id") || null;
  const [product, setProduct] = useState("");

  const [updatedData, setUpdatedData] = useState({
    productName: "",
    productCode: "",
    productDescription: "",
    Price: "",
    costPrice: "",
    discount_Price: "",
    tax_Rate: "",
    category: "",
    Tags: [],
    Brands: "",
    productImages: [],
    quantity: "", // Added quantity field
    faq: [{ question: "", answer: "" }], // Added FAQ to the state
    how_product_work: "",
    productFeatures: [],
  });
  const handleFeatureChange = (e, index) => {
    const newFeatures = [...updatedData.productFeatures];
    newFeatures[index] = e.target.value;
    setUpdatedData({ ...updatedData, productFeatures: newFeatures });
  };

  const removeFeature = (index) => {
    const newFeatures = updatedData.productFeatures.filter(
      (_, i) => i !== index
    );
    setUpdatedData({ ...updatedData, productFeatures: newFeatures });
  };

  const addFeature = () => {
    setUpdatedData({
      ...updatedData,
      productFeatures: [...updatedData.productFeatures, ""],
    });
  };

  const handleFaqChange = (e, index, field) => {
    const updatedFaq = [...updatedData.faq]; // Copy the faq array
    updatedFaq[index][field] = e.target.value; // Update the specific field
    setUpdatedData({ ...updatedData, faq: updatedFaq }); // Update the faq in the updatedData state
  };

  const addFaqField = () => {
    const updatedFaq = [...updatedData.faq, { question: "", answer: "" }];
    setUpdatedData({ ...updatedData, faq: updatedFaq });
  };

  const removeFaqField = (index) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      faq: prevData.faq.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    if (updatedData.productImages.length + newImages.length <= 5) {
      setUpdatedData((prev) => ({
        ...prev,
        productImages: [...prev.productImages, ...newImages],
      }));
    } else {
      alert("You can upload up to 5 images only.");
    }
  };

  const handleRemoveImage = (index) => {
    setUpdatedData((prev) => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
  };

  const { productImages } = updatedData;

  const handleInputAttributeChange = (event) => {
    const { name, value } = event.target;

    setUpdatedData((prevData) => {
      // For tags, split the comma-separated string into an array
      if (name === "Tags") {
        return {
          ...prevData,
          [name]: value.split(",").map((tag) => tag.trim()), // Convert back to array
        };
      }

      // For other fields, directly update the value
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(fireStore, "create_Product", productId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const productData = productDoc.data();
          setProduct(productData);

          // Populate updatedData with all fields
          setUpdatedData({
            productName:
              productData.productData?.productInfo?.productName || "",
            productCode:
              productData.productData?.productInfo?.productCode || "",
            productDescription:
              productData.productData?.productInfo?.productDescription || "",
            Price: productData.productData?.priceInfo?.Price || "",
            costPrice: productData.productData?.priceInfo?.costPrice || "",
            discount_Price:
              productData.productData?.priceInfo?.discount_Price || "",
            tax_Rate: productData.productData?.priceInfo?.tax_Rate || "",
            category: productData.productData?.attribute?.category || "",
            Tags: productData.productData?.attribute?.Tags || [],
            Brands: productData.productData?.attribute?.Brands || "",
            productImages: productData.productData?.productImages || [],
            quantity: productData.productData?.stockInfo?.quantity || "", // Added quantity field
            faq: productData?.productData?.faq || [
              { question: "", answer: "" },
            ],
            how_product_work: productData?.productData?.productInfo
              ?.how_product_work || [""],
            productFeatures: productData?.productData?.productInfo
              ?.productFeatures || [""],
          });
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Error fetching product");
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productId) {
      toast.error("No product ID found");
      return;
    }

    try {
      // Reference to the product document
      const productRef = doc(fireStore, "create_Product", productId);

      // Fetch the current product document
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        toast.error("Product not found");
        return;
      }

      // Fetch the existing product data
      let existingProductData = productDoc.data().productData;

      if (!existingProductData || typeof existingProductData !== "object") {
        existingProductData = {}; // Ensure it is an object
      }

      // Merge the existing productData with the updated values
      const updatedProductData = {
        ...existingProductData,
        productInfo: {
          ...existingProductData.productInfo, // Preserve existing data
          productName: updatedData.productName,
          productCode: updatedData.productCode,
          productDescription: updatedData.productDescription,
          how_product_work: updatedData.how_product_work,
          quantity: updatedData.quantity, // Added quantity field
          productFeatures: updatedData.productFeatures,
        },
        priceInfo: {
          ...existingProductData.priceInfo,
          Price: updatedData.Price,
          costPrice: updatedData.costPrice,
          discount_Price: updatedData.discount_Price,
          tax_Rate: updatedData.tax_Rate,
        },
        attribute: {
          ...existingProductData.attribute,
          category: updatedData.category,
          Tags: updatedData.Tags,
          Brands: updatedData.Brands,
        },
        productImages: updatedData.productImages.length
          ? updatedData.productImages
          : existingProductData.productImages,

        faq: updatedData.faq?.length
          ? updatedData.faq
          : existingProductData.faq || [],
      };

      // Update the document in Firestore
      await updateDoc(productRef, { productData: updatedProductData });

      toast.success("Product updated successfully");

      // Redirect or refresh if needed
      //router.push(`/concepts/products/product-list`);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Error updating product");
    }
  };

  return (
    <>
      {productId && (
        <div className="h-full flex flex-auto flex-col" bis_skin_checked={1}>
          <div
            className="h-full flex flex-auto flex-col justify-between"
            bis_skin_checked={1}
            style={{}}
          >
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
                    <h3 className="font-bold">Edit product</h3>
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
                            <div className="card-body" bis_skin_checked={1}>
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
                                      value={updatedData.productName}
                                      name="productName"
                                      onChange={handleChange}
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
                                      value={updatedData.productCode}
                                      name="productCode"
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                                <div
                                  className="form-item vertical"
                                  bis_skin_checked={1}
                                >
                                  <label className="form-label mb-2">
                                    Quantity
                                  </label>
                                  <div className="" bis_skin_checked={1}>
                                    <input
                                      className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                      autoComplete="off"
                                      placeholder="Enter Quantity"
                                      type="number"
                                      value={updatedData.quantity}
                                      name="quantity"
                                      onChange={handleChange}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div
                                className="form-item vertical"
                                bis_skin_checked={1}
                              >
                                <label className="form-label mb-2">
                                  Description
                                </label>
                                <div className="" bis_skin_checked={1}>
                                  <textarea
                                    className="input input-md h-24 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                    autoComplete="off"
                                    placeholder="Product Description"
                                    value={updatedData.productDescription}
                                    name="productDescription"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div
                                className="form-item vertical"
                                bis_skin_checked={1}
                              >
                                <label className="form-label mb-2">
                                  How Product Works
                                </label>
                                <div bis_skin_checked={1}>
                                  <textarea
                                    className="input input-md h-24 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                    autoComplete="off"
                                    placeholder="Explain how the product works..."
                                    value={updatedData.how_product_work}
                                    name="how_product_work"
                                    onChange={handleChange}
                                  />
                                </div>
                              </div>
                              <div
                                className="form-item vertical"
                                bis_skin_checked={1}
                              >
                                <label className="form-label mb-2">
                                  Product Features
                                </label>

                                {/* Feature List */}
                                {updatedData.productFeatures.map(
                                  (feature, index) => (
                                    <div
                                      key={index}
                                      className="form-item vertical mb-4 flex items-center gap-2"
                                      bis_skin_checked={1}
                                    >
                                      <input
                                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary w-full"
                                        autoComplete="off"
                                        placeholder="Enter feature"
                                        type="text"
                                        value={feature}
                                        onChange={(e) =>
                                          handleFeatureChange(e, index)
                                        }
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
                                  )
                                )}

                                {/* Add More Feature Button */}
                                <div
                                  className="form-item vertical mt-4"
                                  bis_skin_checked={1}
                                >
                                  <button
                                    className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 w-full"
                                    type="button"
                                    onClick={addFeature}
                                  >
                                    + Add Another Feature
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="card card-border"
                            role="presentation"
                            bis_skin_checked={1}
                          >
                            <div className="card-body" bis_skin_checked={1}>
                              <h4 className="mb-6">Pricing</h4>
                              <div bis_skin_checked={1}>
                                <div
                                  className="form-item vertical"
                                  bis_skin_checked={1}
                                >
                                  <label className="form-label mb-2">
                                    Price
                                  </label>
                                  <div className="" bis_skin_checked={1}>
                                    <span className="input-wrapper">
                                      <div
                                        className="input-suffix-start"
                                        bis_skin_checked={1}
                                      >
                                        {" "}
                                        ${" "}
                                      </div>
                                      <input
                                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                        autoComplete="off"
                                        placeholder={0.0}
                                        type="text"
                                        value={updatedData.Price}
                                        name="Price"
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        style={{ paddingLeft: "1.5625rem" }}
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="form-item vertical"
                                  bis_skin_checked={1}
                                >
                                  <label className="form-label mb-2">
                                    Cost price
                                  </label>
                                  <div className="" bis_skin_checked={1}>
                                    <span className="input-wrapper">
                                      <div
                                        className="input-suffix-start"
                                        bis_skin_checked={1}
                                      >
                                        {" "}
                                        ${" "}
                                      </div>
                                      <input
                                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                        autoComplete="off"
                                        placeholder={0.0}
                                        type="text"
                                        value={updatedData.costPrice}
                                        name="costPrice"
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        style={{ paddingLeft: "1.5625rem" }}
                                      />
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="md:flex gap-4"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="form-item vertical w-full"
                                  bis_skin_checked={1}
                                >
                                  <label className="form-label mb-2">
                                    Bulk discount price
                                  </label>
                                  <div className="" bis_skin_checked={1}>
                                    <span className="input-wrapper">
                                      <div
                                        className="input-suffix-start"
                                        bis_skin_checked={1}
                                      >
                                        {" "}
                                        ${" "}
                                      </div>
                                      <input
                                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                        autoComplete="off"
                                        placeholder={0.0}
                                        type="text"
                                        value={updatedData.discount_Price}
                                        name="discount_Price"
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        style={{ paddingLeft: "1.5625rem" }}
                                      />
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="form-item vertical w-full"
                                  bis_skin_checked={1}
                                >
                                  <label className="form-label mb-2">
                                    Tax rate(%)
                                  </label>
                                  <div className="" bis_skin_checked={1}>
                                    <input
                                      className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                      autoComplete="off"
                                      placeholder={0}
                                      type="text"
                                      value={updatedData.tax_Rate}
                                      name="tax_Rate"
                                      onChange={handleChange}
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
                                Choose up to 5 product photos or simply drag and
                                drop them here.
                              </p>
                              <div className="mt-4">
                                <div className="form-item vertical mb-4">
                                  <label className="form-label">
                                    Upload Images
                                  </label>
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
                                          onClick={() =>
                                            handleRemoveImage(index)
                                          }
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
                                Image formats: .jpg, .jpeg, .png, preferred
                                size: 1:1, file size is restricted to a maximum
                                of 500kb per image.
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
                                <label className="form-label mb-2">
                                  Category
                                </label>
                                <div>
                                  <input
                                    className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                                    autoComplete="off"
                                    placeholder="Enter category"
                                    type="text"
                                    value={updatedData.category}
                                    onChange={handleInputAttributeChange}
                                    name="category"
                                  />
                                </div>
                              </div> */}
                              <div className="form-item vertical">
                                <label className="form-label mb-2">
                                  Category
                                </label>
                                <div>
                                  <select
                                    className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary w-full"
                                    value={updatedData.category}
                                    onChange={handleInputAttributeChange}
                                    name="category"
                                  >
                                    <option value="">Select a category</option>
                                    <option value="Norton">Norton</option>
                                    <option value="Webroot">Webroot</option>
                                    <option value="McAfee">McAfee</option>
                                    <option value="Trend Micro">
                                      Trend Micro
                                    </option>
                                    <option value="BitDefender">
                                      BitDefender
                                    </option>
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
                                    value={updatedData.Tags.join(", ")} // Join tags as a comma-separated string
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
                                    value={updatedData.Brands}
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
                              <h4 className="mb-6">
                                Frequently Asked Questions
                              </h4>

                              {/* FAQ List */}
                              {updatedData.faq.map((item, index) => (
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
                                            handleFaqChange(
                                              e,
                                              index,
                                              "question"
                                            )
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
                                      <line
                                        x1="10"
                                        y1="11"
                                        x2="10"
                                        y2="17"
                                      ></line>
                                      <line
                                        x1="14"
                                        y1="11"
                                        x2="14"
                                        y2="17"
                                      ></line>
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
                          <button
                            className="button dark:primary-mild dark:bg-opacity-20 hover:text-primary-mild dark:active:primary-mild dark:active:bg-opacity-40 h-12 rounded-xl px-5 py-2 ltr:mr-3 rtl:ml-3 button-press-feedback"
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
                                  <path d="M5 12l14 0" />
                                  <path d="M5 12l4 4" />
                                  <path d="M5 12l4 -4" />
                                </svg>
                              </span>
                              <span>Back</span>
                            </span>
                          </button>
                          <div
                            className="flex items-center"
                            bis_skin_checked={1}
                          >
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
                                <span>Delete</span>
                              </span>
                            </button>
                            <button
                              className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 button-press-feedback"
                              type="submit"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};
export default Edit_Product;
