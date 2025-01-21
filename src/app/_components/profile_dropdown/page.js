"useState";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import { fireStore } from "@/app/_components/firebase/config";
import { updateDoc } from "firebase/firestore";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import Link from "next/link";
const Profile_Dropdown = ({
  setLogin,
  setAuthClose,
  setUserData,
  setCurrentUser,
  setLoadedComponent,
  currentUser,
}) => {
  const [currentUserd, setCurrentUserd] = useState(null);
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

  const handleSignOut = () => {
    //router.push("/userLoginDashboard");
    signOut(auth)
      .then(() => {
        // Remove user session info from sessionStorage
        sessionStorage.removeItem("user");
        localStorage.removeItem("current-user");
        localStorage.removeItem("current-userdata");

        setLogin(false);
        setAuthClose(false);
        setUserData("");
        setCurrentUser(""),
          // Show success toast message
          setLoadedComponent("signin");
        toast.success("You have successfully signed out.");
      })
      .catch((error) => {
        // Show error message if sign-out fails
        console.error("Sign-out error: ", error);
        toast.error("An error occurred while signing out. Please try again.");
      });
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
      setCurrentUserd(userData);
    } else {
      setCurrentUserd(null);

      localStorage.removeItem("current-user");
    }

    console.log("currentUser", currentUserd);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUserd || !currentUserd.uid) {
        console.warn("User ID not found! Waiting for currentUser...");
        return;
      }

      try {
        console.log(currentUserd.uid, "Fetching data for userId");

        const userRef = doc(fireStore, "users", currentUserd.uid);
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

    if (currentUserd) {
      fetchUserData();
    }
  }, [currentUserd]);

  return (
    <div id=":rp:" data-floating-ui-portal="true" bis_skin_checked={1}>
      <div
        tabIndex={0}
        data-floating-ui-focusable=""
        id=":r7:"
        role="menu"
        aria-labelledby=":r8:"
        aria-orientation="vertical"
        className="outline-none z-30"
        bis_skin_checked={1}
        style={{
          position: "absolute",
          right: "10px", // Aligns to the right
          top: "50px",
          width: "auto",
          minWidth: "160px",
          maxWidth: "250px",
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          borderRadius: "8px",
          overflow: "hidden",
          zIndex: 9999,
          position: "fixed",
        }}
      >
        <ul
          className="dropdown-menu"
          style={{
            transition: "opacity 0.2s ease, transform 0.2s ease",
            transformOrigin: "top right",
            opacity: 1,
            transform: "translateY(0%)",
          }}
        >
          <li
            className="menu-item-header"
            style={{
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span className="avatar avatar-circle avatar-md">
              <img
                className="avatar-img avatar-circle"
                loading="lazy"
                src={formData?.profileImage}
                alt="User Avatar"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
            </span>
            <div>
              <div className="font-bold text-gray-900 dark:text-gray-100">
                {currentUser.displayName}
              </div>
              <div className="text-xs">{currentUser?.email}</div>
            </div>
          </li>
          <li
            className="menu-item-divider"
            style={{ borderBottom: "1px solid #ddd", margin: "5px 0" }}
          />

          <li
            className="menu-item menu-item-hoverable px-0"
            style={{ height: 42 }}
          >
            <Link
              className="flex h-full w-full px-2"
              href="/concepts/account/settings"
            >
              <span className="flex gap-2 items-center w-full">
                <span className="text-xl">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 256 256"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M192,96a64,64,0,1,1-64-64A64,64,0,0,1,192,96Z"
                      opacity="0.2"
                    />
                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
                  </svg>
                </span>
                <span>Profile</span>
              </span>
            </Link>
          </li>

          <li
            className="menu-item menu-item-hoverable"
            style={{ padding: "10px", display: "flex", alignItems: "center" }}
          >
            <Link
              className="flex gap-2 items-center w-full"
              href="/concepts/account/settings"
            >
              <span className="text-xl">🔧</span> <span>Account Setting</span>
            </Link>
          </li>

          <li
            className="menu-item menu-item-hoverable"
            style={{ padding: "10px", display: "flex", alignItems: "center" }}
          >
            <Link
              className="flex gap-2 items-center w-full"
              href="/concepts/account/activity-log"
            >
              <span className="text-xl">📜</span> <span>Activity Log</span>
            </Link>
          </li>

          <li
            className="menu-item-divider"
            style={{ borderBottom: "1px solid #ddd", margin: "5px 0" }}
          />

          <li
            className="menu-item menu-item-hoverable"
            style={{
              padding: "10px",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleSignOut}
          >
            <span className="text-xl">🚪</span> <span>Sign Out</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default Profile_Dropdown;
