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
import Profile_Dropdown from "./_components/profile_dropdown/page";
import Mobile_Navbar from "./_components/mobileNavbar/page";
import Forget_Password from "./_components/forget-password/page";
export default function ClientLayout({ children }) {
  const [navbarToggle, setNavbarToggle] = useState(false);
  const [mobNavbarToggle, setMobNavabarToggle] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [isAuthClose, setAuthClose] = useState(false);
  const [userdata, setUserData] = useState("");
  //const [user, loading] = useAuthState(auth);

  const [currentUser, setCurrentUser] = useState(null);

  const [loadedComponent, setLoadedComponent] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
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
            <Mobile_Navbar
              setMobNavabarToggle={setMobNavabarToggle}
              isMobile={isMobile}
              isLogin={isLogin}
              setLogin={setLogin}
            />
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
            <Profile_Dropdown
              setLogin={setLogin}
              setAuthClose={setAuthClose}
              setUserData={setUserData}
              setCurrentUser={setCurrentUser}
              setLoadedComponent={setLoadedComponent}
              currentUser={currentUser}
            />
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
            setSignupLoading={setSignupLoading}
            classProp={loadedComponent === "signup" ? "is-visible" : ""}
          />
          <Forget_Password
            loadedComponent={loadedComponent}
            setAuthClose={setAuthClose}
            setLoadedComponent={setLoadedComponent}
            classProp={
              loadedComponent === "forget_password" ? "is-visible" : ""
            }
          />
          {!loadedComponent && <Loading />}
        </>
      )}
    </>
  );
}
