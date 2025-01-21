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
  });
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
          : existingProductData.productImages, // Keep existing images if not updated
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
                                defaultValue="Lömnäs"
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
                                defaultValue="098342NT"
                                name="productCode"
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
                                  id=":rf5:"
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
                                  contentEditable="true"
                                  translate="no"
                                  className="tiptap ProseMirror m-2 focus:outline-none"
                                  tabIndex={0}
                                  bis_skin_checked={1}
                                >
                                  <p>
                                    Make a brew a right royal knees up and we
                                    all like figgy pudding a comely wench
                                    gutted its nicked pulled out the eating
                                    irons, ask your mother if on goggle box
                                    toad in the whole Sherlock rather, ar kid
                                    pennyboy naff superb pezzy little.
                                  </p>
                                  <ul>
                                    <li>
                                      <p>
                                        Scally utter shambles blighty squirrel
                                        numbskull rumpy pumpy apple and pears
                                        bow ties are cool
                                      </p>
                                    </li>
                                    <li>
                                      <p>
                                        pompous nosh have a butcher at this
                                        flabbergasted a right toff black cab
                                        jolly good made a pigs ear of it
                                      </p>
                                    </li>
                                    <li>
                                      <p>
                                        Roast beef conked him one on the nose
                                        had a barney with the inlaws beefeater
                                        is she avin a laugh supper, gobsmacked
                                        argy-bargy challenge you to a duel
                                      </p>
                                    </li>
                                    <li>
                                      <p>
                                        whizz air one dirty linen chav not
                                        some sort of dosshouse.
                                      </p>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
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
                            </div>
                          </div>
                          <div
                            className="card card-border"
                            role="presentation"
                            bis_skin_checked={1}
                          >
                            {/* <div className="card-body" bis_skin_checked={1}>
                        <h4 className="mb-6">Pricing</h4>
                        <div bis_skin_checked={1}>
                          <div
                            className="form-item vertical"
                            bis_skin_checked={1}
                          >
                            <label className="form-label mb-2">Price</label>
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
                                  defaultValue={68}
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
                                  defaultValue={12}
                                  inputMode="numeric"
                                  style={{ paddingLeft: "1.5625rem" }}
                                />
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="md:flex gap-4" bis_skin_checked={1}>
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
                                  defaultValue={68}
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
                                defaultValue={6}
                                inputMode="numeric"
                              />
                            </div>
                          </div>
                        </div>
                      </div> */}
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
                            {/* <div className="card-body" bis_skin_checked={1}>
                        <h4 className="mb-2">Product Image</h4>
                        <p>
                          Choose a product photo or simply drag and drop up to
                          5 photos here.
                        </p>
                        <div className="mt-4" bis_skin_checked={1}>
                          <div
                            className="form-item vertical mb-4"
                            bis_skin_checked={1}
                          >
                            <label className="form-label" />
                            <div className="" bis_skin_checked={1}>
                              <div
                                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="group relative rounded-xl border border-gray-200 dark:border-gray-600 p-2 flex"
                                  bis_skin_checked={1}
                                >
                                  <img
                                    className="rounded-lg max-h-[140px] mx-auto max-w-full dark:bg-transparent"
                                    alt="image-1"
                                    src="/img/products/product-4.jpg"
                                  />
                                  <div
                                    className="absolute inset-2 bg-[#000000ba] group-hover:flex hidden text-xl items-center justify-center"
                                    bis_skin_checked={1}
                                  >
                                    <span className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5">
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path
                                          fillRule="evenodd"
                                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                    <span className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5">
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className="upload upload-draggable hover:border-primary min-h-fit"
                                  bis_skin_checked={1}
                                >
                                  <input
                                    className="upload-input draggable"
                                    title=""
                                    type="file"
                                    defaultValue=""
                                  />
                                  <div
                                    className="max-w-full flex flex-col px-4 py-2 justify-center items-center min-h-[130px]"
                                    bis_skin_checked={1}
                                  >
                                    <div
                                      className="text-[50px]"
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
                                    <p className="text-center mt-1 text-xs">
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
                        </div>
                        <p>
                          Image formats: .jpg, .jpeg, .png, preferred size:
                          1:1, file size is restricted to a maximum of 500kb.
                        </p>
                      </div> */}
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
                            {/* <div className="card-body" bis_skin_checked={1}>
                        <h4 className="mb-6">Attribute</h4>
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">Category</label>
                          <div className="" bis_skin_checked={1}>
                            <div
                              className="select select-md css-b62m3t-container"
                              bis_skin_checked={1}
                            >
                              <span
                                id="react-select-21-live-region"
                                className="css-7pg0cj-a11yText"
                              />
                              <span
                                aria-live="polite"
                                aria-atomic="false"
                                aria-relevant="additions text"
                                role="log"
                                className="css-7pg0cj-a11yText"
                              />
                              <div
                                className="select-control min-h-12 bg-gray-100 dark:bg-gray-700 select__control css-0"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="select-value-container grid select__value-container css-0"
                                  bis_skin_checked={1}
                                >
                                  <div
                                    className="select-placeholder text-gray-400 select__placeholder css-0"
                                    id="react-select-21-placeholder"
                                    bis_skin_checked={1}
                                  >
                                    Select...
                                  </div>
                                  <div
                                    className="select-input-container visible select__input-container css-p665u"
                                    data-value=""
                                    bis_skin_checked={1}
                                  >
                                    <input
                                      className="select__input"
                                      autoCapitalize="none"
                                      autoComplete="off"
                                      autoCorrect="off"
                                      id="react-select-21-input"
                                      spellCheck="false"
                                      tabIndex={0}
                                      aria-autocomplete="list"
                                      aria-expanded="false"
                                      aria-haspopup="true"
                                      role="combobox"
                                      aria-activedescendant=""
                                      aria-describedby="react-select-21-placeholder"
                                      type="text"
                                      defaultValue=""
                                      style={{
                                        color: "inherit",
                                        background: "0px center",
                                        opacity: 1,
                                        width: "100%",
                                        gridArea: "1 / 2",
                                        font: "inherit",
                                        minWidth: 2,
                                        border: 0,
                                        margin: 0,
                                        outline: 0,
                                        padding: 0,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div
                                  className="select-indicators-container select__indicators css-1wy0on6"
                                  bis_skin_checked={1}
                                >
                                  <div
                                    className="select-dropdown-indicator"
                                    bis_skin_checked={1}
                                  >
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth={0}
                                      viewBox="0 0 20 20"
                                      aria-hidden="true"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">
                            Tags
                            <span>
                              <span className="tooltip-wrapper">
                                <svg
                                  stroke="currentColor"
                                  fill="none"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                  className="text-base mx-1"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </span>
                            </span>
                          </label>
                          <div className="" bis_skin_checked={1}>
                            <div
                              className="select select-md css-b62m3t-container"
                              bis_skin_checked={1}
                            >
                              <span
                                id="react-select-22-live-region"
                                className="css-7pg0cj-a11yText"
                              />
                              <span
                                aria-live="polite"
                                aria-atomic="false"
                                aria-relevant="additions text"
                                role="log"
                                className="css-7pg0cj-a11yText"
                              />
                              <div
                                className="select-control min-h-12 bg-gray-100 dark:bg-gray-700 select__control css-0"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="select-value-container flex select__value-container select__value-container--is-multi select__value-container--has-value css-0"
                                  bis_skin_checked={1}
                                >
                                  <div
                                    className="select-multi-value select__multi-value css-0"
                                    bis_skin_checked={1}
                                  >
                                    <div
                                      className="select-multi-value-label select__multi-value__label css-0"
                                      bis_skin_checked={1}
                                    >
                                      trend
                                    </div>
                                    <div
                                      role="button"
                                      className="select-multi-value-remove select__multi-value__remove css-0"
                                      aria-label="Remove trend"
                                      bis_skin_checked={1}
                                    >
                                      <svg
                                        height={14}
                                        width={14}
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        focusable="false"
                                        className="css-8mmkcg"
                                      >
                                        <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div
                                    className="select-input-container visible select__input-container css-p665u"
                                    data-value=""
                                    bis_skin_checked={1}
                                  >
                                    <input
                                      className="select__input"
                                      autoCapitalize="none"
                                      autoComplete="off"
                                      autoCorrect="off"
                                      id="react-select-22-input"
                                      spellCheck="false"
                                      tabIndex={0}
                                      aria-autocomplete="list"
                                      aria-expanded="false"
                                      aria-haspopup="true"
                                      role="combobox"
                                      aria-activedescendant=""
                                      type="text"
                                      defaultValue=""
                                      style={{
                                        color: "inherit",
                                        background: "0px center",
                                        opacity: 1,
                                        width: "100%",
                                        gridArea: "1 / 2",
                                        font: "inherit",
                                        minWidth: 2,
                                        border: 0,
                                        margin: 0,
                                        outline: 0,
                                        padding: 0,
                                      }}
                                    />
                                  </div>
                                </div>
                                <div
                                  className="select-indicators-container select__indicators css-1wy0on6"
                                  bis_skin_checked={1}
                                >
                                  <div
                                    aria-hidden="true"
                                    bis_skin_checked={1}
                                  >
                                    <div
                                      className="select-clear-indicator"
                                      bis_skin_checked={1}
                                    >
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 20 20"
                                        aria-hidden="true"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                  <div
                                    className="select-dropdown-indicator"
                                    bis_skin_checked={1}
                                  >
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth={0}
                                      viewBox="0 0 20 20"
                                      aria-hidden="true"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">Brand</label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="Product brand"
                              type="text"
                              defaultValue="Adidas"
                              name="brand"
                            />
                          </div>
                        </div>
                      </div> */}
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
                                    <option value="Palato alto">
                                      Palato Alto
                                    </option>
                                    <option value="Cisco">Cisco</option>
                                    <option value="Watch guard">
                                      Watch Guard
                                    </option>
                                    <option value="Fortinet">Fortinet</option>
                                    <option value="Sophos">Sophos</option>
                                    <option value="Juniper">Juniper</option>
                                    <option value="Barakuda">Barakuda</option>
                                    <option value="Cloudflare">
                                      Cloudflare
                                    </option>
                                    <option value="Digicert">Digicert</option>
                                    <option value="Global sign">
                                      Global Sign
                                    </option>
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
