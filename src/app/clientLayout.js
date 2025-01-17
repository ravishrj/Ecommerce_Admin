// src/app/layout.js or src/app/_components/layout/page.js
"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import Header from "./_components/header/page";
import Sidebar from "./_components/sidebar/page";
import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";
import { auth } from "./_components/firebase/config";
import { useParams } from "next/navigation";
import Sign_up from "./_components/sign-up/page";
import Sign_In from "./_components/sign-in/page";

import { fireStore, useAuth } from "./_components/firebase/config";
import Loading from "./_components/loading/page";
export default function ClientLayout({ children }) {
  const [navbarToggle, setNavbarToggle] = useState(false);
  const [mobNavbarToggle, setMobNavabarToggle] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [isAuthClose, setAuthClose] = useState(false);
  const [userdata, setUserData] = useState("");
  //const [user, loading] = useAuthState(auth);

  const [currentUser, setCurrentUser] = useState(null);
  //const currentUser = useAuth();

  const [loadedComponent, setLoadedComponent] = useState("");

  const [windowWidth, setWindowWidth] = useState(0);
  const router = useRouter();
  const params = useParams();
  const [activeRoute, setActiveRoute] = useState("");

  useEffect(() => {
    const userL = JSON.parse(localStorage.getItem("current-user"));
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, update the state and local storage
        const userData = {
          uid: user.uid,
          displayName: user.displayName || "User",
          email: user.email,
        };
        console.log("userData", userData);
        setCurrentUser(userData);
        setUserData(user);
        setLoadedComponent("");
        setAuthClose(true);
        localStorage.setItem("current-user", JSON.stringify(userData));
      } else {
        // User is signed out
        setLoadedComponent("signin");
        setCurrentUser(null);
        setAuthClose(false);
        localStorage.removeItem("current-user");

        // Force navigation to sign-in and reload the page
        // if (router.pathname !== "/sign-in") {

        //   router.push("/sign-in");
        // }
      }
    });
    console.log("currentUser", currentUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActiveRoute(
        window.location.href.split("/")[
          window.location.href.split("/").length - 1
        ],
        "Active path"
      );
    }
    // Function to update window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width on mount
    handleResize();

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
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

  // Determine if it's mobile or desktop
  const isMobile = windowWidth <= 1012; // You can adjust the breakpoint as needed

  return (
    <>
      {isAuthClose && (
        <>
          {" "}
          <div className="app-layout-collapsible-side flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
              {!isMobile && (
                <Sidebar
                  navbarToggle={navbarToggle}
                  setNavbarToggle={setNavbarToggle}
                  isMobile={isMobile}
                />
              )}
              <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                <Header
                  navbarToggle={navbarToggle}
                  setNavbarToggle={setNavbarToggle}
                  isMobile={isMobile}
                  setMobNavabarToggle={setMobNavabarToggle}
                  mobNavbarToggle={mobNavbarToggle}
                  isLogin={isLogin}
                  setLogin={setLogin}
                  userdata={userdata}
                />
                {children}
              </div>
            </div>
          </div>
          {mobNavbarToggle ? (
            <>
              <div
                className="drawer-portal"
                bis_skin_checked={1}
                {...(isLogin ? { "data-floating-ui-inert": true } : {})}
              >
                <div
                  className="drawer-overlay drawer-overlay-after-open"
                  bis_skin_checked={1}
                >
                  <div
                    className="drawer drawer-after-open"
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    bis_skin_checked={1}
                  >
                    <div
                      className="drawer-content vertical"
                      bis_skin_checked={1}
                      style={{ width: 330, left: 0 }}
                    >
                      <div className="drawer-header" bis_skin_checked={1}>
                        <h4>Navigation</h4>
                        <button
                          className="close-button button-press-feedback"
                          type="button"
                          onClick={() => setMobNavabarToggle((prev) => !prev)}
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
                        </button>
                      </div>
                      <div className="drawer-body p-0" bis_skin_checked={1}>
                        <nav className="menu px-4 pb-4">
                          <div className="menu-group" bis_skin_checked={1}>
                            <div className="menu-title" bis_skin_checked={1}>
                              Dashboard
                            </div>
                            <ul>
                              <div
                                className="menu-item menu-item-active menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/dashboards/ecommerce"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M232,72l-25.63,92.28A16,16,0,0,1,191,176H92.16a16,16,0,0,1-15.41-11.72L51.11,72Z"
                                        opacity="0.2"
                                      />
                                      <path d="M104,216a16,16,0,1,1-16-16A16,16,0,0,1,104,216Zm88-16a16,16,0,1,0,16,16A16,16,0,0,0,192,200ZM239.71,74.14l-25.64,92.28A24.06,24.06,0,0,1,191,184H92.16A24.06,24.06,0,0,1,69,166.42L33.92,40H16a8,8,0,0,1,0-16H40a8,8,0,0,1,7.71,5.86L57.19,64H232a8,8,0,0,1,7.71,10.14ZM221.47,80H61.64l22.81,82.14A8,8,0,0,0,92.16,168H191a8,8,0,0,0,7.71-5.86Z" />
                                    </svg>
                                  </span>
                                  <span>Ecommerce</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/dashboards/project"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M94.81,192,65.36,214.24a8,8,0,0,1-12.81-4.51L40.19,154.1a8,8,0,0,1,1.66-6.86l30.31-36.33C71,134.25,76.7,161.43,94.81,192Zm119.34-44.76-30.31-36.33c1.21,23.34-4.54,50.52-22.65,81.09l29.45,22.24a8,8,0,0,0,12.81-4.51l12.36-55.63A8,8,0,0,0,214.15,147.24Z"
                                        opacity="0.2"
                                      />
                                      <path d="M152,224a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h32A8,8,0,0,1,152,224ZM128,112a12,12,0,1,0-12-12A12,12,0,0,0,128,112Zm95.62,43.83-12.36,55.63a16,16,0,0,1-25.51,9.11L158.51,200h-61L70.25,220.57a16,16,0,0,1-25.51-9.11L32.38,155.83a16.09,16.09,0,0,1,3.32-13.71l28.56-34.26a123.07,123.07,0,0,1,8.57-36.67c12.9-32.34,36-52.63,45.37-59.85a16,16,0,0,1,19.6,0c9.34,7.22,32.47,27.51,45.37,59.85a123.07,123.07,0,0,1,8.57,36.67l28.56,34.26A16.09,16.09,0,0,1,223.62,155.83ZM99.43,184h57.14c21.12-37.54,25.07-73.48,11.74-106.88C156.55,47.64,134.49,29,128,24c-6.51,5-28.57,23.64-40.33,53.12C74.36,110.52,78.31,146.46,99.43,184Zm-15,5.85Q68.28,160.5,64.83,132.16L48,152.36,60.36,208l.18-.13ZM208,152.36l-16.83-20.2q-3.42,28.28-19.56,57.69l23.85,18,.18.13Z" />
                                    </svg>
                                  </span>
                                  <span>Project</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/dashboards/marketing"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M240,120a40,40,0,0,1-40,40H160V80h40A40,40,0,0,1,240,120Z"
                                        opacity="0.2"
                                      />
                                      <path d="M248,120a48.05,48.05,0,0,0-48-48H160.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,32,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,159.12,214l11,7.33A16,16,0,0,0,194.5,212l11.77-44.36A48.07,48.07,0,0,0,248,120ZM48,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C134.65,155,90.84,164.07,48,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM200,152H168V88h32a32,32,0,1,1,0,64Z" />
                                    </svg>
                                  </span>
                                  <span>Marketing</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/dashboards/analytic"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M208,40V208H152V40Z"
                                        opacity="0.2"
                                      />
                                      <path d="M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z" />
                                    </svg>
                                  </span>
                                  <span>Analytic</span>
                                </a>
                              </div>
                            </ul>
                          </div>
                          <div className="menu-group" bis_skin_checked={1}>
                            <div className="menu-title" bis_skin_checked={1}>
                              Concepts
                            </div>
                            <ul>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M194.82,151.43l-55.09,20.3-20.3,55.09a7.92,7.92,0,0,1-14.86,0l-20.3-55.09-55.09-20.3a7.92,7.92,0,0,1,0-14.86l55.09-20.3,20.3-55.09a7.92,7.92,0,0,1,14.86,0l20.3,55.09,55.09,20.3A7.92,7.92,0,0,1,194.82,151.43Z"
                                          opacity="0.2"
                                        />
                                        <path d="M197.58,129.06,146,110l-19-51.62a15.92,15.92,0,0,0-29.88,0L78,110l-51.62,19a15.92,15.92,0,0,0,0,29.88L78,178l19,51.62a15.92,15.92,0,0,0,29.88,0L146,178l51.62-19a15.92,15.92,0,0,0,0-29.88ZM137,164.22a8,8,0,0,0-4.74,4.74L112,223.85,91.78,169A8,8,0,0,0,87,164.22L32.15,144,87,123.78A8,8,0,0,0,91.78,119L112,64.15,132.22,119a8,8,0,0,0,4.74,4.74L191.85,144ZM144,40a8,8,0,0,1,8-8h16V16a8,8,0,0,1,16,0V32h16a8,8,0,0,1,0,16H184V64a8,8,0,0,1-16,0V48H152A8,8,0,0,1,144,40ZM248,88a8,8,0,0,1-8,8h-8v8a8,8,0,0,1-16,0V96h-8a8,8,0,0,1,0-16h8V72a8,8,0,0,1,16,0v8h8A8,8,0,0,1,248,88Z" />
                                      </svg>
                                    </span>
                                    <span>AI</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/ai/chat"
                                      target=""
                                    >
                                      <span>Chat</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/ai/image"
                                      target=""
                                    >
                                      <span>Image</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M208,72V184H48V72Z"
                                          opacity="0.2"
                                        />
                                        <path d="M88,144V128a8,8,0,0,1,16,0v16a8,8,0,0,1-16,0Zm40,8a8,8,0,0,0,8-8V120a8,8,0,0,0-16,0v24A8,8,0,0,0,128,152Zm32,0a8,8,0,0,0,8-8V112a8,8,0,0,0-16,0v32A8,8,0,0,0,160,152Zm56-72v96h8a8,8,0,0,1,0,16H136v17.38a24,24,0,1,1-16,0V192H32a8,8,0,0,1,0-16h8V80A16,16,0,0,1,24,64V48A16,16,0,0,1,40,32H216a16,16,0,0,1,16,16V64A16,16,0,0,1,216,80ZM136,232a8,8,0,1,0-8,8A8,8,0,0,0,136,232ZM40,64H216V48H40ZM200,80H56v96H200Z" />
                                      </svg>
                                    </span>
                                    <span>Projects</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/projects/scrum-board"
                                      target=""
                                    >
                                      <span>Scrum Board</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/projects/project-list"
                                      target=""
                                    >
                                      <span>List</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/projects/project-details/27"
                                      target=""
                                    >
                                      <span>Details</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/projects/tasks"
                                      target=""
                                    >
                                      <span>Tasks</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/projects/tasks/1"
                                      target=""
                                    >
                                      <span>Issue</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M136,108A52,52,0,1,1,84,56,52,52,0,0,1,136,108Z"
                                          opacity="0.2"
                                        />
                                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" />
                                      </svg>
                                    </span>
                                    <span>Customer</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/customers/customer-list"
                                      target=""
                                    >
                                      <span>List</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/customers/customer-edit/1"
                                      target=""
                                    >
                                      <span>Edit</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/customers/customer-create"
                                      target=""
                                    >
                                      <span>Create</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/customers/customer-details/1"
                                      target=""
                                    >
                                      <span>Details</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M128,129.09V232a8,8,0,0,1-3.84-1l-88-48.18a8,8,0,0,1-4.16-7V80.18a8,8,0,0,1,.7-3.25Z"
                                          opacity="0.2"
                                        />
                                        <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" />
                                      </svg>
                                    </span>
                                    <span>Products</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/products/product-list"
                                      target=""
                                    >
                                      <span>List</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/products/product-edit/12"
                                      target=""
                                    >
                                      <span>Edit</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/products/product-create"
                                      target=""
                                    >
                                      <span>Create</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M224,64l-12.16,66.86A16,16,0,0,1,196.1,144H70.55L56,64Z"
                                          opacity="0.2"
                                        />
                                        <path d="M230.14,58.87A8,8,0,0,0,224,56H62.68L56.6,22.57A8,8,0,0,0,48.73,16H24a8,8,0,0,0,0,16h18L67.56,172.29a24,24,0,0,0,5.33,11.27,28,28,0,1,0,44.4,8.44h45.42A27.75,27.75,0,0,0,160,204a28,28,0,1,0,28-28H91.17a8,8,0,0,1-7.87-6.57L80.13,152h116a24,24,0,0,0,23.61-19.71l12.16-66.86A8,8,0,0,0,230.14,58.87ZM104,204a12,12,0,1,1-12-12A12,12,0,0,1,104,204Zm96,0a12,12,0,1,1-12-12A12,12,0,0,1,200,204Zm4-74.57A8,8,0,0,1,196.1,136H77.22L65.59,72H214.41Z" />
                                      </svg>
                                    </span>
                                    <span>Orders</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/orders/order-list"
                                      target=""
                                    >
                                      <span>List</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/orders/order-edit/95954"
                                      target=""
                                    >
                                      <span>Edit</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/orders/order-create"
                                      target=""
                                    >
                                      <span>Create</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/orders/order-details/95954"
                                      target=""
                                    >
                                      <span>Details</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M224,128a95.76,95.76,0,0,1-31.8,71.37A72,72,0,0,0,128,160a40,40,0,1,0-40-40,40,40,0,0,0,40,40,72,72,0,0,0-64.2,39.37h0A96,96,0,1,1,224,128Z"
                                          opacity="0.2"
                                        />
                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24ZM74.08,197.5a64,64,0,0,1,107.84,0,87.83,87.83,0,0,1-107.84,0ZM96,120a32,32,0,1,1,32,32A32,32,0,0,1,96,120Zm97.76,66.41a79.66,79.66,0,0,0-36.06-28.75,48,48,0,1,0-59.4,0,79.66,79.66,0,0,0-36.06,28.75,88,88,0,1,1,131.52,0Z" />
                                      </svg>
                                    </span>
                                    <span>Account</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/account/settings"
                                      target=""
                                    >
                                      <span>Settings</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/account/activity-log"
                                      target=""
                                    >
                                      <span>Activity log</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/account/roles-permissions"
                                      target=""
                                    >
                                      <span>Roles &amp; Permissions</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/account/pricing"
                                      target=""
                                    >
                                      <span>Pricing</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z"
                                          opacity="0.2"
                                        />
                                        <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                                      </svg>
                                    </span>
                                    <span>Help Center</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/help-center/support-hub"
                                      target=""
                                    >
                                      <span>Support Hub</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/help-center/article/pWBKE_0UiQ"
                                      target=""
                                    >
                                      <span>Article</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/help-center/edit-article/pWBKE_0UiQ"
                                      target=""
                                    >
                                      <span>Edit Article</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/concepts/help-center/manage-article"
                                      target=""
                                    >
                                      <span>Manage Article</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/concepts/calendar"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M216,48V88H40V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z"
                                        opacity="0.2"
                                      />
                                      <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z" />
                                    </svg>
                                  </span>
                                  <span>Calendar</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/concepts/file-manager"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M208,88v24H69.77a8,8,0,0,0-7.59,5.47L32,208V64a8,8,0,0,1,8-8H93.33a8,8,0,0,1,4.8,1.6L128,80h72A8,8,0,0,1,208,88Z"
                                        opacity="0.2"
                                      />
                                      <path d="M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" />
                                    </svg>
                                  </span>
                                  <span>File Manager</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/concepts/mail"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M224,56l-96,88L32,56Z"
                                        opacity="0.2"
                                      />
                                      <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z" />
                                    </svg>
                                  </span>
                                  <span>Mail</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/concepts/chat"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M224,128A96,96,0,0,1,79.93,211.11h0L42.54,223.58a8,8,0,0,1-10.12-10.12l12.47-37.39h0A96,96,0,1,1,224,128Z"
                                        opacity="0.2"
                                      />
                                      <path d="M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z" />
                                    </svg>
                                  </span>
                                  <span>Chat</span>
                                </a>
                              </div>
                            </ul>
                          </div>
                          <div className="menu-group" bis_skin_checked={1}>
                            <div className="menu-title" bis_skin_checked={1}>
                              UI Components
                            </div>
                            <ul>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M135.88,43.11l-25,143.14a35.71,35.71,0,0,1-41.34,29.2h0a36,36,0,0,1-28.95-41.71l25-143.13a8,8,0,0,1,9.19-6.49l54.67,9.73A8,8,0,0,1,135.88,43.11Z"
                                          opacity="0.2"
                                        />
                                        <path d="M88,180a12,12,0,1,1-12-12A12,12,0,0,1,88,180Zm152-23.81V208a16,16,0,0,1-16,16H76a46.36,46.36,0,0,1-7.94-.68,44,44,0,0,1-35.43-50.95l25-143.13a15.94,15.94,0,0,1,18.47-13L130.84,26a16,16,0,0,1,12.92,18.52l-12.08,69L199.49,89a16,16,0,0,1,20.45,9.52L239,150.69A18.35,18.35,0,0,1,240,156.19ZM103,184.87,128,41.74,73.46,32l-25,143.1A28,28,0,0,0,70.9,207.57,27.29,27.29,0,0,0,91.46,203,27.84,27.84,0,0,0,103,184.87ZM116.78,195,224,156.11,204.92,104,128.5,131.7l-9.78,55.92A44.63,44.63,0,0,1,116.78,195ZM224,173.12,127.74,208H224Z" />
                                      </svg>
                                    </span>
                                    <span>Common</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/button"
                                      target=""
                                    >
                                      <span>Button</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/grid"
                                      target=""
                                    >
                                      <span>Grid</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/typography"
                                      target=""
                                    >
                                      <span>Typography</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/icons"
                                      target=""
                                    >
                                      <span>Icons</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M224,64V192a8,8,0,0,1-8,8H80L45.15,230.11A8,8,0,0,1,32,224V64a8,8,0,0,1,8-8H216A8,8,0,0,1,224,64Z"
                                          opacity="0.2"
                                        />
                                        <path d="M116,128a12,12,0,1,1,12,12A12,12,0,0,1,116,128ZM84,140a12,12,0,1,0-12-12A12,12,0,0,0,84,140Zm88,0a12,12,0,1,0-12-12A12,12,0,0,0,172,140Zm60-76V192a16,16,0,0,1-16,16H83l-32.6,28.16-.09.07A15.89,15.89,0,0,1,40,240a16.13,16.13,0,0,1-6.8-1.52A15.85,15.85,0,0,1,24,224V64A16,16,0,0,1,40,48H216A16,16,0,0,1,232,64ZM40,224h0ZM216,64H40V224l34.77-30A8,8,0,0,1,80,192H216Z" />
                                      </svg>
                                    </span>
                                    <span>Feedback</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/alert"
                                      target=""
                                    >
                                      <span>Alert</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/dialog"
                                      target=""
                                    >
                                      <span>Dialog</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/drawer"
                                      target=""
                                    >
                                      <span>Drawer</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/progress"
                                      target=""
                                    >
                                      <span>Progress</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/skeleton"
                                      target=""
                                    >
                                      <span>Skeleton</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/spinner"
                                      target=""
                                    >
                                      <span>Spinner</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/toast"
                                      target=""
                                    >
                                      <span>Toast</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M224,64v88H32V64A16,16,0,0,1,48,48H208A16,16,0,0,1,224,64Z"
                                          opacity="0.2"
                                        />
                                        <path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24h72v16H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V200h72a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40ZM48,56H208a8,8,0,0,1,8,8v80H40V64A8,8,0,0,1,48,56ZM208,184H48a8,8,0,0,1-8-8V160H216v16A8,8,0,0,1,208,184Z" />
                                      </svg>
                                    </span>
                                    <span>Data Display</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/avatar"
                                      target=""
                                    >
                                      <span>Avatar</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/badge"
                                      target=""
                                    >
                                      <span>Badge</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/calendar"
                                      target=""
                                    >
                                      <span>Calendar</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/cards"
                                      target=""
                                    >
                                      <span>Cards</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/table"
                                      target=""
                                    >
                                      <span>Table</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/tag"
                                      target=""
                                    >
                                      <span>Tag</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/timeline"
                                      target=""
                                    >
                                      <span>Timeline</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/tooltip"
                                      target=""
                                    >
                                      <span>Tooltip</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M208,88H152V32Z"
                                          opacity="0.2"
                                        />
                                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-32-80a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,136Zm0,32a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,168Z" />
                                      </svg>
                                    </span>
                                    <span>Forms</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/checkbox"
                                      target=""
                                    >
                                      <span>Checkbox</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/date-picker"
                                      target=""
                                    >
                                      <span>Date Picker</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/form-control"
                                      target=""
                                    >
                                      <span>Form Control</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/input"
                                      target=""
                                    >
                                      <span>Input</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/input-group"
                                      target=""
                                    >
                                      <span>Input Group</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/radio"
                                      target=""
                                    >
                                      <span>Radio</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/segment"
                                      target=""
                                    >
                                      <span>Segment</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/select"
                                      target=""
                                    >
                                      <span>Select</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/switcher"
                                      target=""
                                    >
                                      <span>Switcher</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/time-input"
                                      target=""
                                    >
                                      <span>Time Input</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/upload"
                                      target=""
                                    >
                                      <span>Upload</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Zm16,112L80,176l32-64,64-32Z"
                                          opacity="0.2"
                                        />
                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216ZM172.42,72.84l-64,32a8.05,8.05,0,0,0-3.58,3.58l-32,64A8,8,0,0,0,80,184a8.1,8.1,0,0,0,3.58-.84l64-32a8.05,8.05,0,0,0,3.58-3.58l32-64a8,8,0,0,0-10.74-10.74ZM138,138,97.89,158.11,118,118l40.15-20.07Z" />
                                      </svg>
                                    </span>
                                    <span>Navigation</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/dropdown"
                                      target=""
                                    >
                                      <span>Dropdown</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/menu"
                                      target=""
                                    >
                                      <span>Menu</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/pagination"
                                      target=""
                                    >
                                      <span>Pagination</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/steps"
                                      target=""
                                    >
                                      <span>Steps</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/tabs"
                                      target=""
                                    >
                                      <span>Tabs</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M96,37.5v72l-62.4,36A96,96,0,0,1,96,37.5Z"
                                          opacity="0.2"
                                        />
                                        <path d="M100,116.43a8,8,0,0,0,4-6.93v-72A8,8,0,0,0,93.34,30,104.06,104.06,0,0,0,25.73,147a8,8,0,0,0,4.52,5.81,7.86,7.86,0,0,0,3.35.74,8,8,0,0,0,4-1.07ZM88,49.62v55.26L40.12,132.51C40,131,40,129.48,40,128A88.12,88.12,0,0,1,88,49.62ZM128,24a8,8,0,0,0-8,8v91.82L41.19,169.73a8,8,0,0,0-2.87,11A104,104,0,1,0,128,24Zm0,192a88.47,88.47,0,0,1-71.49-36.68l75.52-44a8,8,0,0,0,4-6.92V40.36A88,88,0,0,1,128,216Z" />
                                      </svg>
                                    </span>
                                    <span>Graph</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/graph/charts"
                                      target=""
                                    >
                                      <span>Charts</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/ui-components/graph/maps"
                                      target=""
                                    >
                                      <span>Maps</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                            </ul>
                          </div>
                          <div className="menu-group" bis_skin_checked={1}>
                            <div className="menu-title" bis_skin_checked={1}>
                              Authentication
                            </div>
                            <ul>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M232,98.36C230.73,136.92,198.67,168,160.09,168a71.68,71.68,0,0,1-26.92-5.17h0L120,176H96v24H72v24H40a8,8,0,0,1-8-8V187.31a8,8,0,0,1,2.34-5.65l58.83-58.83h0A71.68,71.68,0,0,1,88,95.91c0-38.58,31.08-70.64,69.64-71.87A72,72,0,0,1,232,98.36Z"
                                          opacity="0.2"
                                        />
                                        <path d="M216.57,39.43A80,80,0,0,0,83.91,120.78L28.69,176A15.86,15.86,0,0,0,24,187.31V216a16,16,0,0,0,16,16H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8,8,0,0,0,5.66-2.34l9.56-9.57A79.73,79.73,0,0,0,160,176h.1A80,80,0,0,0,216.57,39.43ZM224,98.1c-1.09,34.09-29.75,61.86-63.89,61.9H160a63.7,63.7,0,0,1-23.65-4.51,8,8,0,0,0-8.84,1.68L116.69,168H96a8,8,0,0,0-8,8v16H72a8,8,0,0,0-8,8v16H40V187.31l58.83-58.82a8,8,0,0,0,1.68-8.84A63.72,63.72,0,0,1,96,95.92c0-34.14,27.81-62.8,61.9-63.89A64,64,0,0,1,224,98.1ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
                                      </svg>
                                    </span>
                                    <span>Sign In</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/sign-in-simple"
                                      target=""
                                    >
                                      <span>Simple</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/sign-in-side"
                                      target=""
                                    >
                                      <span>Side</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/sign-in-split"
                                      target=""
                                    >
                                      <span>Split</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M168,100a60,60,0,1,1-60-60A60,60,0,0,1,168,100Z"
                                          opacity="0.2"
                                        />
                                        <path d="M256,136a8,8,0,0,1-8,8H232v16a8,8,0,0,1-16,0V144H200a8,8,0,0,1,0-16h16V112a8,8,0,0,1,16,0v16h16A8,8,0,0,1,256,136Zm-57.87,58.85a8,8,0,0,1-12.26,10.3C165.75,181.19,138.09,168,108,168s-57.75,13.19-77.87,37.15a8,8,0,0,1-12.25-10.3c14.94-17.78,33.52-30.41,54.17-37.17a68,68,0,1,1,71.9,0C164.6,164.44,183.18,177.07,198.13,194.85ZM108,152a52,52,0,1,0-52-52A52.06,52.06,0,0,0,108,152Z" />
                                      </svg>
                                    </span>
                                    <span>Sign Up</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/sign-up-simple"
                                      target=""
                                    >
                                      <span>Simple</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/sign-up-side"
                                      target=""
                                    >
                                      <span>Side</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/sign-up-split"
                                      target=""
                                    >
                                      <span>Split</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M208,88H48a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V96A8,8,0,0,0,208,88Zm-80,72a20,20,0,1,1,20-20A20,20,0,0,1,128,160Z"
                                          opacity="0.2"
                                        />
                                        <path d="M208,80H96V56a32,32,0,0,1,32-32c15.37,0,29.2,11,32.16,25.59a8,8,0,0,0,15.68-3.18C171.32,24.15,151.2,8,128,8A48.05,48.05,0,0,0,80,56V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm0,128H48V96H208V208Zm-80-96a28,28,0,0,0-8,54.83V184a8,8,0,0,0,16,0V166.83A28,28,0,0,0,128,112Zm0,40a12,12,0,1,1,12-12A12,12,0,0,1,128,152Z" />
                                      </svg>
                                    </span>
                                    <span>Forgot Password</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/forgot-password-simple"
                                      target=""
                                    >
                                      <span>Simple</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/forgot-password-side"
                                      target=""
                                    >
                                      <span>Side</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/forgot-password-split"
                                      target=""
                                    >
                                      <span>Split</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M144,139.72,160,176H96l16-36.28a32,32,0,1,1,32,0Z"
                                          opacity="0.2"
                                        />
                                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-104a40,40,0,1,0-65.94,30.44L88.68,172.77A8,8,0,0,0,96,184h64a8,8,0,0,0,7.32-11.23l-13.38-30.33A40.14,40.14,0,0,0,168,112ZM136.68,143l11,25.05H108.27l11-25.05A8,8,0,0,0,116,132.79a24,24,0,1,1,24,0A8,8,0,0,0,136.68,143Z" />
                                      </svg>
                                    </span>
                                    <span>Reset Password</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/reset-password-simple"
                                      target=""
                                    >
                                      <span>Simple</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/reset-password-side"
                                      target=""
                                    >
                                      <span>Side</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/reset-password-split"
                                      target=""
                                    >
                                      <span>Split</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                              <div
                                className="menu-collapse"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="menu-collapse-item"
                                  role="presentation"
                                  bis_skin_checked={1}
                                >
                                  <span className="flex items-center gap-2">
                                    <span className="text-2xl">
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
                                          d="M256,72V184a16,16,0,0,1-16,16H16A16,16,0,0,1,0,184V72A16,16,0,0,1,16,56H240A16,16,0,0,1,256,72Z"
                                          opacity="0.2"
                                        />
                                        <path d="M48,56V200a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0Zm92,54.5L120,117V96a8,8,0,0,0-16,0v21L84,110.5a8,8,0,0,0-5,15.22l20,6.49-12.34,17a8,8,0,1,0,12.94,9.4l12.34-17,12.34,17a8,8,0,1,0,12.94-9.4l-12.34-17,20-6.49A8,8,0,0,0,140,110.5ZM246,115.64A8,8,0,0,0,236,110.5L216,117V96a8,8,0,0,0-16,0v21l-20-6.49a8,8,0,0,0-4.95,15.22l20,6.49-12.34,17a8,8,0,1,0,12.94,9.4l12.34-17,12.34,17a8,8,0,1,0,12.94-9.4l-12.34-17,20-6.49A8,8,0,0,0,246,115.64Z" />
                                      </svg>
                                    </span>
                                    <span>Otp Verification</span>
                                  </span>
                                  <span
                                    className="text-lg mt-1"
                                    style={{ transform: "rotate(0deg)" }}
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
                                      <path d="M6 9l6 6l6 -6" />
                                    </svg>
                                  </span>
                                </div>
                                <ul
                                  className=""
                                  style={{
                                    opacity: 0,
                                    height: 0,
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/otp-verification-simple"
                                      target=""
                                    >
                                      <span>Simple</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/otp-verification-side"
                                      target=""
                                    >
                                      <span>Side</span>
                                    </a>
                                  </div>
                                  <div
                                    className="menu-item menu-item-hoverable items-center gap-2"
                                    bis_skin_checked={1}
                                    style={{ height: 48 }}
                                  >
                                    <div bis_skin_checked={1}>
                                      <svg
                                        stroke="currentColor"
                                        fill="currentColor"
                                        strokeWidth={0}
                                        viewBox="0 0 256 256"
                                        className="text-3xl w-[24px] opacity-25"
                                        height="1em"
                                        width="1em"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z" />
                                      </svg>
                                    </div>
                                    <a
                                      className="flex items-center gap-2 h-full w-full"
                                      href="/auth/otp-verification-split"
                                      target=""
                                    >
                                      <span>Split</span>
                                    </a>
                                  </div>
                                </ul>
                              </div>
                            </ul>
                          </div>
                          <div className="menu-group" bis_skin_checked={1}>
                            <div className="menu-title" bis_skin_checked={1}>
                              Guide
                            </div>
                            <ul>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/guide/documentation/introduction"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M208,32V192H72a24,24,0,0,0-24,24V56A24,24,0,0,1,72,32Z"
                                        opacity="0.2"
                                      />
                                      <path d="M208,24H72A32,32,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-8,160H72a31.82,31.82,0,0,0-16,4.29V56A16,16,0,0,1,72,40H200Z" />
                                    </svg>
                                  </span>
                                  <span>Documentation</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/guide/shared-component-doc/abbreviate-number"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M208,200a32,32,0,1,1-32-32A32,32,0,0,1,208,200ZM176,88a32,32,0,1,0-32-32A32,32,0,0,0,176,88Z"
                                        opacity="0.2"
                                      />
                                      <path d="M176,160a39.89,39.89,0,0,0-28.62,12.09l-46.1-29.63a39.8,39.8,0,0,0,0-28.92l46.1-29.63a40,40,0,1,0-8.66-13.45l-46.1,29.63a40,40,0,1,0,0,55.82l46.1,29.63A40,40,0,1,0,176,160Zm0-128a24,24,0,1,1-24,24A24,24,0,0,1,176,32ZM64,152a24,24,0,1,1,24-24A24,24,0,0,1,64,152Zm112,72a24,24,0,1,1,24-24A24,24,0,0,1,176,224Z" />
                                    </svg>
                                  </span>
                                  <span>Shared Component</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/guide/utils-doc/use-auth"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M232,120v72a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V120Z"
                                        opacity="0.2"
                                      />
                                      <path d="M224,64H176V56a24,24,0,0,0-24-24H104A24,24,0,0,0,80,56v8H32A16,16,0,0,0,16,80V192a16,16,0,0,0,16,16H224a16,16,0,0,0,16-16V80A16,16,0,0,0,224,64ZM96,56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM32,80H224v32H192v-8a8,8,0,0,0-16,0v8H80v-8a8,8,0,0,0-16,0v8H32ZM224,192H32V128H64v8a8,8,0,0,0,16,0v-8h96v8a8,8,0,0,0,16,0v-8h32v64Z" />
                                    </svg>
                                  </span>
                                  <span>Utilities</span>
                                </a>
                              </div>
                              <div
                                className="menu-item menu-item-hoverable"
                                bis_skin_checked={1}
                                style={{ height: 48 }}
                              >
                                <a
                                  className="flex items-center gap-2 h-full w-full"
                                  href="/guide/changelog"
                                  target=""
                                >
                                  <span className="text-2xl">
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
                                        d="M240,128l-48,40H64L16,128,64,88H192Z"
                                        opacity="0.2"
                                      />
                                      <path d="M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z" />
                                    </svg>
                                  </span>
                                  <span>Changelog</span>
                                </a>
                              </div>
                            </ul>
                          </div>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className="drawer-portal"
                bis_skin_checked={1}
                {...(isLogin ? { "data-floating-ui-inert": true } : {})}
              />
            </>
          )}
          {isLogin && (
            <div id=":rp:" data-floating-ui-portal="true" bis_skin_checked={1}>
              <span
                data-type="inside"
                tabIndex={-1}
                aria-hidden="true"
                data-floating-ui-focus-guard=""
                data-tabindex={0}
                style={{
                  border: 0,
                  clip: "rect(0px, 0px, 0px, 0px)",
                  height: 1,
                  margin: "-1px",
                  overflow: "hidden",
                  padding: 0,
                  position: "fixed",
                  whiteSpace: "nowrap",
                  width: 1,
                  top: 0,
                  left: 0,
                }}
              />
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
                  left: 0,
                  top: 0,
                  transform: "translate(738px, 48px)",
                }}
              >
                <ul
                  className="dropdown-menu min-w-[160px]"
                  style={{
                    transitionProperty: "opacity, transform",
                    transformOrigin: "center top",
                    opacity: 1,
                    transform: "translateY(0%)",
                    transitionDuration: "200ms",
                  }}
                >
                  <li id="menu-item-71-BvgRlgpeG6" className="menu-item-header">
                    <div
                      className="py-2 px-3 flex items-center gap-3"
                      bis_skin_checked={1}
                    >
                      <span className="avatar avatar-circle avatar-md">
                        <img
                          className="avatar-img avatar-circle"
                          loading="lazy"
                          src="/img/avatars/thumb-1.jpg"
                        />
                      </span>
                      <div bis_skin_checked={1}>
                        <div
                          className="font-bold text-gray-900 dark:text-gray-100"
                          bis_skin_checked={1}
                        >
                          {currentUser.displayName}
                        </div>
                        <div className="text-xs" bis_skin_checked={1}>
                          admin-01@ecme.com
                        </div>
                      </div>
                    </div>
                  </li>
                  <li
                    id="menu-item-72-VPXevQIpaZ"
                    className="menu-item-divider"
                  />
                  <li
                    className="menu-item menu-item-hoverable px-0"
                    style={{ height: 42 }}
                  >
                    <a
                      className="flex h-full w-full px-2"
                      href="/concepts/account/settings"
                      data-tabindex=""
                      tabIndex={-1}
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
                    className="menu-item menu-item-hoverable px-0"
                    style={{ height: 42 }}
                  >
                    <a
                      className="flex h-full w-full px-2"
                      href="/concepts/account/settings"
                      data-tabindex=""
                      tabIndex={-1}
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
                              d="M207.86,123.18l16.78-21a99.14,99.14,0,0,0-10.07-24.29l-26.7-3a81,81,0,0,0-6.81-6.81l-3-26.71a99.43,99.43,0,0,0-24.3-10l-21,16.77a81.59,81.59,0,0,0-9.64,0l-21-16.78A99.14,99.14,0,0,0,77.91,41.43l-3,26.7a81,81,0,0,0-6.81,6.81l-26.71,3a99.43,99.43,0,0,0-10,24.3l16.77,21a81.59,81.59,0,0,0,0,9.64l-16.78,21a99.14,99.14,0,0,0,10.07,24.29l26.7,3a81,81,0,0,0,6.81,6.81l3,26.71a99.43,99.43,0,0,0,24.3,10l21-16.77a81.59,81.59,0,0,0,9.64,0l21,16.78a99.14,99.14,0,0,0,24.29-10.07l3-26.7a81,81,0,0,0,6.81-6.81l26.71-3a99.43,99.43,0,0,0,10-24.3l-16.77-21A81.59,81.59,0,0,0,207.86,123.18ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
                              opacity="0.2"
                            />
                            <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8.06,8.06,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8.06,8.06,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
                          </svg>
                        </span>
                        <span>Account Setting</span>
                      </span>
                    </a>
                  </li>
                  <li
                    className="menu-item menu-item-hoverable px-0"
                    style={{ height: 42 }}
                  >
                    <a
                      className="flex h-full w-full px-2"
                      href="/concepts/account/activity-log"
                      data-tabindex=""
                      tabIndex={-1}
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
                              d="M96,40l33.52,88H56Zm104,88H129.52L160,208Z"
                              opacity="0.2"
                            />
                            <path d="M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z" />
                          </svg>
                        </span>
                        <span>Activity Log</span>
                      </span>
                    </a>
                  </li>
                  <li
                    id="menu-item-76-YvjlR1ujRN"
                    className="menu-item-divider"
                  />
                  <li
                    className="menu-item menu-item-hoverable gap-2"
                    style={{ height: 42 }}
                    onClick={handleSignOut}
                  >
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
                          d="M224,56V200a16,16,0,0,1-16,16H48V40H208A16,16,0,0,1,224,56Z"
                          opacity="0.2"
                        />
                        <path d="M120,216a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H56V208h56A8,8,0,0,1,120,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L204.69,120H112a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,229.66,122.34Z" />
                      </svg>
                    </span>
                    <span>Sign Out</span>
                  </li>
                </ul>
              </div>
              <span
                data-type="inside"
                tabIndex={-1}
                aria-hidden="true"
                data-floating-ui-focus-guard=""
                data-tabindex={0}
                style={{
                  border: 0,
                  clip: "rect(0px, 0px, 0px, 0px)",
                  height: 1,
                  margin: "-1px",
                  overflow: "hidden",
                  padding: 0,
                  position: "fixed",
                  whiteSpace: "nowrap",
                  width: 1,
                  top: 0,
                  left: 0,
                }}
              />
            </div>
          )}
        </>
      )}

      {!isAuthClose && (
        <>
          <Sign_In
            loadedComponent={loadedComponent}
            setAuthClose={setAuthClose}
            setLoadedComponent={setLoadedComponent}
            classProp={loadedComponent === "signin" ? "is-visible" : ""}
          />
          <Sign_up
            loadedComponent={loadedComponent}
            setAuthClose={setAuthClose}
            setLoadedComponent={setLoadedComponent}
            classProp={loadedComponent === "signup" ? "is-visible" : ""}
          />
          {!loadedComponent && <Loading />}
        </>
      )}
    </>
  );
}
