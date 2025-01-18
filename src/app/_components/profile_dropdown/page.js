"useState";

import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import { fireStore } from "@/app/_components/firebase/config";
import { updateDoc } from "firebase/firestore";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
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
    // <div id=":rp:" data-floating-ui-portal="true" bis_skin_checked={1}>
    //   <span
    //     data-type="inside"
    //     tabIndex={-1}
    //     aria-hidden="true"
    //     data-floating-ui-focus-guard=""
    //     data-tabindex={0}
    //     style={{
    //       border: 0,
    //       clip: "rect(0px, 0px, 0px, 0px)",
    //       height: 1,
    //       margin: "-1px",
    //       overflow: "hidden",
    //       padding: 0,
    //       position: "fixed",
    //       whiteSpace: "nowrap",
    //       width: 1,
    //       top: 0,
    //       left: 0,
    //     }}
    //   />
    //   <div
    //     tabIndex={0}
    //     data-floating-ui-focusable=""
    //     id=":r7:"
    //     role="menu"
    //     aria-labelledby=":r8:"
    //     aria-orientation="vertical"
    //     className="outline-none z-30"
    //     bis_skin_checked={1}
    //     style={{
    //       position: "absolute",
    //       left: 0,
    //       top: 0,
    //       transform: "translate(738px, 48px)",
    //     }}
    //   >
    //     <ul
    //       className="dropdown-menu min-w-[160px]"
    //       style={{
    //         transitionProperty: "opacity, transform",
    //         transformOrigin: "center top",
    //         opacity: 1,
    //         transform: "translateY(0%)",
    //         transitionDuration: "200ms",
    //       }}
    //     >
    //       <li id="menu-item-71-BvgRlgpeG6" className="menu-item-header">
    //         <div
    //           className="py-2 px-3 flex items-center gap-3"
    //           bis_skin_checked={1}
    //         >
    //           <span className="avatar avatar-circle avatar-md">
    //             <img
    //               className="avatar-img avatar-circle"
    //               loading="lazy"
    //               src={formData?.profileImage}
    //             />
    //           </span>
    //           <div bis_skin_checked={1}>
    //             <div
    //               className="font-bold text-gray-900 dark:text-gray-100"
    //               bis_skin_checked={1}
    //             >
    //               {currentUser.displayName}
    //             </div>
    //             <div className="text-xs" bis_skin_checked={1}>
    //               {currentUser?.email}
    //             </div>
    //           </div>
    //         </div>
    //       </li>
    //       <li id="menu-item-72-VPXevQIpaZ" className="menu-item-divider" />
    //       <li
    //         className="menu-item menu-item-hoverable px-0"
    //         style={{ height: 42 }}
    //       >
    //         <a
    //           className="flex h-full w-full px-2"
    //           href="/concepts/account/settings"
    //           data-tabindex=""
    //           tabIndex={-1}
    //         >
    //           <span className="flex gap-2 items-center w-full">
    //             <span className="text-xl">
    //               <svg
    //                 stroke="currentColor"
    //                 fill="currentColor"
    //                 strokeWidth={0}
    //                 viewBox="0 0 256 256"
    //                 height="1em"
    //                 width="1em"
    //                 xmlns="http://www.w3.org/2000/svg"
    //               >
    //                 <path
    //                   d="M192,96a64,64,0,1,1-64-64A64,64,0,0,1,192,96Z"
    //                   opacity="0.2"
    //                 />
    //                 <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
    //               </svg>
    //             </span>
    //             <span>Profile</span>
    //           </span>
    //         </a>
    //       </li>
    //       <li
    //         className="menu-item menu-item-hoverable px-0"
    //         style={{ height: 42 }}
    //       >
    //         <a
    //           className="flex h-full w-full px-2"
    //           href="/concepts/account/settings"
    //           data-tabindex=""
    //           tabIndex={-1}
    //         >
    //           <span className="flex gap-2 items-center w-full">
    //             <span className="text-xl">
    //               <svg
    //                 stroke="currentColor"
    //                 fill="currentColor"
    //                 strokeWidth={0}
    //                 viewBox="0 0 256 256"
    //                 height="1em"
    //                 width="1em"
    //                 xmlns="http://www.w3.org/2000/svg"
    //               >
    //                 <path
    //                   d="M207.86,123.18l16.78-21a99.14,99.14,0,0,0-10.07-24.29l-26.7-3a81,81,0,0,0-6.81-6.81l-3-26.71a99.43,99.43,0,0,0-24.3-10l-21,16.77a81.59,81.59,0,0,0-9.64,0l-21-16.78A99.14,99.14,0,0,0,77.91,41.43l-3,26.7a81,81,0,0,0-6.81,6.81l-26.71,3a99.43,99.43,0,0,0-10,24.3l16.77,21a81.59,81.59,0,0,0,0,9.64l-16.78,21a99.14,99.14,0,0,0,10.07,24.29l26.7,3a81,81,0,0,0,6.81,6.81l3,26.71a99.43,99.43,0,0,0,24.3,10l21-16.77a81.59,81.59,0,0,0,9.64,0l21,16.78a99.14,99.14,0,0,0,24.29-10.07l3-26.7a81,81,0,0,0,6.81-6.81l26.71-3a99.43,99.43,0,0,0,10-24.3l-16.77-21A81.59,81.59,0,0,0,207.86,123.18ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
    //                   opacity="0.2"
    //                 />
    //                 <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8.06,8.06,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8.06,8.06,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
    //               </svg>
    //             </span>
    //             <span>Account Setting</span>
    //           </span>
    //         </a>
    //       </li>
    //       <li
    //         className="menu-item menu-item-hoverable px-0"
    //         style={{ height: 42 }}
    //       >
    //         <a
    //           className="flex h-full w-full px-2"
    //           href="/concepts/account/activity-log"
    //           data-tabindex=""
    //           tabIndex={-1}
    //         >
    //           <span className="flex gap-2 items-center w-full">
    //             <span className="text-xl">
    //               <svg
    //                 stroke="currentColor"
    //                 fill="currentColor"
    //                 strokeWidth={0}
    //                 viewBox="0 0 256 256"
    //                 height="1em"
    //                 width="1em"
    //                 xmlns="http://www.w3.org/2000/svg"
    //               >
    //                 <path
    //                   d="M96,40l33.52,88H56Zm104,88H129.52L160,208Z"
    //                   opacity="0.2"
    //                 />
    //                 <path d="M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z" />
    //               </svg>
    //             </span>
    //             <span>Activity Log</span>
    //           </span>
    //         </a>
    //       </li>
    //       <li id="menu-item-76-YvjlR1ujRN" className="menu-item-divider" />
    //       <li
    //         className="menu-item menu-item-hoverable gap-2"
    //         style={{ height: 42 }}
    //         onClick={handleSignOut}
    //       >
    //         <span className="text-xl">
    //           <svg
    //             stroke="currentColor"
    //             fill="currentColor"
    //             strokeWidth={0}
    //             viewBox="0 0 256 256"
    //             height="1em"
    //             width="1em"
    //             xmlns="http://www.w3.org/2000/svg"
    //           >
    //             <path
    //               d="M224,56V200a16,16,0,0,1-16,16H48V40H208A16,16,0,0,1,224,56Z"
    //               opacity="0.2"
    //             />
    //             <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z" />
    //           </svg>
    //         </span>
    //         <span>Sign Out</span>
    //       </li>
    //     </ul>
    //   </div>
    //   <span
    //     data-type="inside"
    //     tabIndex={-1}
    //     aria-hidden="true"
    //     data-floating-ui-focus-guard=""
    //     data-tabindex={0}
    //     style={{
    //       border: 0,
    //       clip: "rect(0px, 0px, 0px, 0px)",
    //       height: 1,
    //       margin: "-1px",
    //       overflow: "hidden",
    //       padding: 0,
    //       position: "fixed",
    //       whiteSpace: "nowrap",
    //       width: 1,
    //       top: 0,
    //       left: 0,
    //     }}
    //   />
    // </div>
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
            <a
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
            </a>
          </li>

          <li
            className="menu-item menu-item-hoverable"
            style={{ padding: "10px", display: "flex", alignItems: "center" }}
          >
            <a
              className="flex gap-2 items-center w-full"
              href="/concepts/account/settings"
            >
              <span className="text-xl">🔧</span> <span>Account Setting</span>
            </a>
          </li>

          <li
            className="menu-item menu-item-hoverable"
            style={{ padding: "10px", display: "flex", alignItems: "center" }}
          >
            <a
              className="flex gap-2 items-center w-full"
              href="/concepts/account/activity-log"
            >
              <span className="text-xl">📜</span> <span>Activity Log</span>
            </a>
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
