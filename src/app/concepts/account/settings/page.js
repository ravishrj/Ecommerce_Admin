"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { fireStore } from "@/app/_components/firebase/config";
import { updateDoc } from "firebase/firestore";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";

const Account_Setting = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email2: "",
    phone: "",
    countryCode: "",
    profileImage: "",
    country: "",
    address: "",
    city: "",
    postcode: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle File Upload
  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setSelectedFile(file);
  //     setFormData({ ...formData, profileImage: URL.createObjectURL(file) });
  //   }
  // };
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first file (only one)

    if (!file) return; // If no file is selected, exit

    if (file.size > 500 * 1024) {
      alert(`${file.name} exceeds 500KB. Please upload a smaller file.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, profileImage: reader.result }); // Store as base64
    };
    reader.readAsDataURL(file);
  };

  // Remove Selected Image
  // const handleRemoveImage = () => {
  //   setSelectedFile(null);
  //   setFormData({ ...formData, profileImage: "" });
  // };
  const handleRemoveImage = () => {
    setSelectedFile(null); // Reset selected file state
    setFormData((prevFormData) => ({
      ...prevFormData,
      profileImage: "", // Clear profile image
    }));
  };

  useEffect(() => {
    const userL = JSON.parse(localStorage.getItem("current-user"));
    if (userL) {
      const userData = {
        uid: userL.uid,
        displayName: userL.displayName || "User",
        email: userL.email,
      };
      console.log("userData", userData);
      setCurrentUser(userData);
    } else {
      setCurrentUser(null);

      localStorage.removeItem("current-user");
    }

    console.log("currentUser", currentUser);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser || !currentUser.uid) {
        console.warn("User ID not found! Waiting for currentUser...");
        return;
      }

      try {
        console.log(currentUser.uid, "Fetching data for userId");

        const userRef = doc(fireStore, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.log("User data not found in Firestore");
          return;
        }

        let existingData = userDoc.data();

        // ✅ Directly accessing fields without userData
        setFormData({
          firstName: existingData?.firstName || "",
          lastName: existingData?.lastName || "",
          email2: existingData?.email || "",
          phone: existingData?.phone || "",
          country: existingData?.country || "",
          address: existingData?.address || "",
          city: existingData?.city || "",
          postcode: existingData?.postcode || "",
          profileImage: existingData?.profileImage || "",
        });

        console.log("Fetched user data:", existingData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Try again.");
      }
    };

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]); // 🔥 Added currentUser as a dependency
  // 🔥 Runs when `currentUser` changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(currentUser, "currentUserid");

    const userId = currentUser.uid;
    if (!userId) {
      toast.error("User ID not found!");
      return;
    }

    try {
      const userRef = doc(fireStore, "users", userId);
      const userDoc = await getDoc(userRef);

      let existingData = userDoc.exists() ? userDoc.data() : {};

      // 🔥 Correct way to merge existing user data and update fields
      const updatedUserData = {
        ...existingData, // Keep existing user data
        firstName: formData.firstName || existingData.firstName || "",
        lastName: formData.lastName || existingData.lastName || "",
        email2: formData.email2 || existingData.email2 || "",
        phone: formData.phone || existingData.phone || "",
        country: formData.country || existingData.country || "",
        address: formData.address || existingData.address || "",
        city: formData.city || existingData.city || "",
        postcode: formData.postcode || existingData.postcode || "",
        profileImage: formData.profileImage || existingData.profileImage || "",
        updatedAt: new Date(), // Track last update
      };

      // ✅ Update fields directly without nesting under "userData"
      await setDoc(userRef, updatedUserData, { merge: true });

      toast.success("Profile updated successfully!");
      localStorage.setItem("current-userdata", JSON.stringify(updatedUserData));

      // Clear the form
      setFormData({
        firstName: "",
        lastName: "",
        email2: "",
        phone: "",
        country: "",
        address: "",
        city: "",
        postcode: "",
        profileImage: "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update profile. Try again.");
    }
  };

  return (
    <main className="h-full">
      <div
        className="page-container relative h-full flex flex-auto flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8 container mx-auto"
        bis_skin_checked={1}
      >
        <div
          className="flex items-center justify-between mb-4"
          bis_skin_checked={1}
        >
          <div bis_skin_checked={1}>
            <h3 className="font-bold">Settings</h3>
          </div>
        </div>
        <div className="container mx-auto h-full" bis_skin_checked={1}>
          <div
            className="card h-full card-border"
            role="presentation"
            bis_skin_checked={1}
          >
            <div className="card-body" bis_skin_checked={1}>
              <div className="flex flex-auto h-full" bis_skin_checked={1}>
                <div className="'w-[200px] xl:w-[280px]" bis_skin_checked={1}>
                  <div
                    className="flex flex-col justify-between h-full"
                    bis_skin_checked={1}
                  >
                    <div
                      data-simplebar="init"
                      className="h-full overflow-y-auto"
                      bis_skin_checked={1}
                    >
                      <div
                        className="simplebar-wrapper"
                        bis_skin_checked={1}
                        style={{ margin: 0 }}
                      >
                        <div
                          className="simplebar-height-auto-observer-wrapper"
                          bis_skin_checked={1}
                        >
                          <div
                            className="simplebar-height-auto-observer"
                            bis_skin_checked={1}
                          />
                        </div>
                        <div className="simplebar-mask" bis_skin_checked={1}>
                          <div
                            className="simplebar-offset"
                            bis_skin_checked={1}
                            style={{ right: 0, bottom: 0 }}
                          >
                            <div
                              className="simplebar-content-wrapper"
                              tabIndex={0}
                              role="region"
                              aria-label="scrollable content"
                              bis_skin_checked={1}
                              style={{ height: "100%", overflow: "hidden" }}
                            >
                              <div
                                className="simplebar-content"
                                bis_skin_checked={1}
                                style={{ padding: 0 }}
                              >
                                <nav className="menu mx-2 mb-10">
                                  <div
                                    className="menu-item menu-item-hoverable mb-2 bg-gray-100 dark:bg-gray-700"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <span className="text-2xl ltr:mr-2 rtl:ml-2">
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
                                        <path d="M9 10a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                        <path d="M6 21v-1a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v1" />
                                        <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14z" />
                                      </svg>
                                    </span>
                                    <span>Profile</span>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable mb-2 "
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <span className="text-2xl ltr:mr-2 rtl:ml-2">
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
                                        <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
                                        <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
                                        <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
                                      </svg>
                                    </span>
                                    <span>Security</span>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable mb-2 "
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <span className="text-2xl ltr:mr-2 rtl:ml-2">
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
                                        <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                                        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                                      </svg>
                                    </span>
                                    <span>Notification</span>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable mb-2 "
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <span className="text-2xl ltr:mr-2 rtl:ml-2">
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
                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                        <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
                                        <path d="M12 17v1m0 -8v1" />
                                      </svg>
                                    </span>
                                    <span>Billing</span>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable mb-2 "
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <span className="text-2xl ltr:mr-2 rtl:ml-2">
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
                                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                                        <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                                      </svg>
                                    </span>
                                    <span>Integration</span>
                                  </div>
                                </nav>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="simplebar-placeholder"
                          bis_skin_checked={1}
                          style={{ width: 139, height: 312 }}
                        />
                      </div>
                      <div
                        className="simplebar-track simplebar-horizontal"
                        bis_skin_checked={1}
                        style={{ visibility: "hidden" }}
                      >
                        <div
                          className="simplebar-scrollbar"
                          bis_skin_checked={1}
                          style={{ width: 0, display: "none" }}
                        />
                      </div>
                      <div
                        className="simplebar-track simplebar-vertical"
                        bis_skin_checked={1}
                        style={{ visibility: "hidden" }}
                      >
                        <div
                          className="simplebar-scrollbar"
                          bis_skin_checked={1}
                          style={{ height: 0, display: "none" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="ltr:xl:pl-6 rtl:xl:pr-6 flex-1 py-2"
                  bis_skin_checked={1}
                >
                  <h4 className="mb-8">Personal information</h4>
                  <form onSubmit={handleSubmit}>
                    <div
                      className="form-container vertical"
                      bis_skin_checked={1}
                    >
                      {/* <div className="mb-8" bis_skin_checked={1}>
                        <div
                          className="flex items-center gap-4"
                          bis_skin_checked={1}
                        >
                          <span
                            className="avatar avatar-circle border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                            style={{
                              width: 90,
                              height: 90,
                              minWidth: 90,
                              lineHeight: 90,
                              fontSize: 45,
                            }}
                          >
                            <img
                              className="avatar-img avatar-circle"
                              loading="lazy"
                              src="/img/avatars/thumb-1.jpg"
                            />
                          </span>
                          <div
                            className="flex items-center gap-2"
                            bis_skin_checked={1}
                          >
                            <div className="upload" bis_skin_checked={1}>
                              <input
                                className="upload-input"
                                title=""
                                type="file"
                                defaultValue=""
                              />
                              <button
                                className="button bg-primary hover:bg-primary-mild text-neutral h-10 rounded-xl px-3 py-2 text-sm button-press-feedback"
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
                                      <path d="M12 5l0 14" />
                                      <path d="M5 12l14 0" />
                                    </svg>
                                  </span>
                                  <span>Upload Image</span>
                                </span>
                              </button>
                            </div>
                            <button
                              className="button bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 ring-primary dark:ring-white hover:border-primary dark:hover:border-white hover:ring-1 hover:text-primary dark:hover:text-white dark:hover:bg-transparent text-gray-600 dark:text-gray-100 h-10 rounded-xl px-3 py-2 text-sm button-press-feedback"
                              type="button"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                      <div
                        className="grid md:grid-cols-2 gap-4"
                        bis_skin_checked={1}
                      >
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">First name</label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="First Name"
                              type="text"
                              defaultValue="Angelina"
                              name="firstName"
                            />
                          </div>
                        </div>
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">User name</label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="Last Name"
                              type="text"
                              defaultValue="Gotelli"
                              name="lastName"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-item vertical" bis_skin_checked={1}>
                        <label className="form-label mb-2">Email</label>
                        <div className="" bis_skin_checked={1}>
                          <input
                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                            autoComplete="off"
                            placeholder="Email"
                            type="email"
                            defaultValue="carolyn_h@hotmail.com"
                            name="email"
                          />
                        </div>
                      </div>
                      <div
                        className="flex items-end gap-4 w-full mb-6"
                        bis_skin_checked={1}
                      >
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label" />
                          <div className="" bis_skin_checked={1}>
                            <label className="form-label mb-2">
                              Phone number
                            </label>
                            <div
                              className="select select-md w-[150px] css-b62m3t-container"
                              bis_skin_checked={1}
                            >
                              <span
                                id="react-select-14-live-region"
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
                                <span
                                  className="avatar avatar-circle ltr:ml-4 rtl:mr-4"
                                  style={{
                                    width: 20,
                                    height: 20,
                                    minWidth: 20,
                                    lineHeight: 20,
                                    fontSize: 12,
                                  }}
                                >
                                  <img
                                    className="avatar-img avatar-circle"
                                    loading="lazy"
                                    src="/img/countries/US.png"
                                  />
                                </span>
                                <div
                                  className="select-value-container grid select__value-container select__value-container--has-value css-0"
                                  bis_skin_checked={1}
                                >
                                  <div
                                    className="select-single-value select__single-value css-0"
                                    bis_skin_checked={1}
                                  >
                                    +1
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
                                      id="react-select-14-input"
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
                              <input
                                type="hidden"
                                defaultValue="US"
                                name="dialCode"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          className="form-item vertical w-full"
                          bis_skin_checked={1}
                        >
                          <label className="form-label" />
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="Phone Number"
                              type="text"
                              defaultValue={121231234}
                              inputMode="numeric"
                            />
                          </div>
                        </div>
                      </div> */}

                      {/* Profile Image Upload */}
                      <div className="mb-8">
                        <div className="flex items-center gap-4">
                          <span
                            className="avatar avatar-circle border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                            style={{
                              width: 90,
                              height: 90,
                              minWidth: 90,
                              lineHeight: 90,
                              fontSize: 45,
                            }}
                          >
                            <img
                              className="avatar-img avatar-circle"
                              src={formData.profileImage}
                              alt="User Avatar"
                            />
                          </span>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              hidden
                              id="fileUpload"
                            />
                            <label
                              htmlFor="fileUpload"
                              className="button bg-primary text-neutral h-10 px-3 py-2 rounded-xl cursor-pointer"
                            >
                              Upload Image
                            </label>
                            {selectedFile && (
                              <button
                                onClick={handleRemoveImage}
                                type="button"
                                className="button bg-white border border-gray-300 text-gray-600 h-10 px-3 py-2 rounded-xl"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-item vertical">
                          <label className="form-label mb-2">First Name</label>
                          <input
                            className="input input-md h-12 focus:ring-primary"
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="form-item vertical">
                          <label className="form-label mb-2">Last Name</label>
                          <input
                            className="input input-md h-12 focus:ring-primary"
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="form-item vertical">
                        <label className="form-label mb-2">Email</label>
                        <input
                          className="input input-md h-12 focus:ring-primary"
                          name="email2"
                          type="email"
                          placeholder="Email"
                          value={formData.email2}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Phone Number */}
                      <div className="flex items-end gap-4 w-full mb-6">
                        <div className="form-item vertical">
                          <label className="form-label mb-2">
                            Country Code
                          </label>
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleChange}
                            className="input h-12"
                          >
                            <option value="+1">+1 (USA)</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+44">+44 (UK)</option>
                          </select>
                        </div>
                        <div className="form-item vertical w-full">
                          <label className="form-label mb-2">
                            Phone Number
                          </label>
                          <input
                            className="input input-md h-12 focus:ring-primary"
                            name="phone"
                            type="text"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <h4 className="mb-6">Address information</h4>
                      {/* <div className="form-item vertical" bis_skin_checked={1}>
                        <label className="form-label mb-2">Country</label>
                        <div className="" bis_skin_checked={1}>
                          <div
                            className="select select-md css-b62m3t-container"
                            bis_skin_checked={1}
                          >
                            <span
                              id="react-select-15-live-region"
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
                              <span
                                className="avatar avatar-circle ltr:ml-4 rtl:mr-4"
                                style={{
                                  width: 20,
                                  height: 20,
                                  minWidth: 20,
                                  lineHeight: 20,
                                  fontSize: 12,
                                }}
                              >
                                <img
                                  className="avatar-img avatar-circle"
                                  loading="lazy"
                                  src="/img/countries/US.png"
                                />
                              </span>
                              <div
                                className="select-value-container grid select__value-container select__value-container--has-value css-0"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="select-single-value select__single-value css-0"
                                  bis_skin_checked={1}
                                >
                                  United States
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
                                    id="react-select-15-input"
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
                            <input
                              type="hidden"
                              defaultValue="US"
                              name="country"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-item vertical" bis_skin_checked={1}>
                        <label className="form-label mb-2">Address</label>
                        <div className="" bis_skin_checked={1}>
                          <input
                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                            autoComplete="off"
                            placeholder="Address"
                            type="text"
                            defaultValue="123 Main St"
                            name="address"
                          />
                        </div>
                      </div>
                      <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        bis_skin_checked={1}
                      >
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">City</label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="City"
                              type="text"
                              defaultValue="New York"
                              name="city"
                            />
                          </div>
                        </div>
                        <div
                          className="form-item vertical"
                          bis_skin_checked={1}
                        >
                          <label className="form-label mb-2">Postal Code</label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder="Postal Code"
                              type="text"
                              defaultValue={10001}
                              name="postcode"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end" bis_skin_checked={1}>
                        <button
                          className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 button-press-feedback"
                          type="submit"
                        >
                          Save
                        </button>
                      </div> */}
                      <div className="form-item vertical">
                        <label className="form-label mb-2">Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className="input input-md h-12 focus:ring-primary"
                          placeholder="Country"
                        />
                      </div>

                      <div className="form-item vertical">
                        <label className="form-label mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="input input-md h-12 focus:ring-primary"
                          placeholder="Address"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="form-item vertical">
                          <label className="form-label mb-2">City</label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="input input-md h-12 focus:ring-primary"
                            placeholder="City"
                          />
                        </div>
                        <div className="form-item vertical">
                          <label className="form-label mb-2">Postal Code</label>
                          <input
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleChange}
                            className="input input-md h-12 focus:ring-primary"
                            placeholder="Postal Code"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="button bg-primary text-neutral h-12 rounded-xl px-5 py-2"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Account_Setting;
