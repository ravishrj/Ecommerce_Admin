"use client";

import React, { useRef } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, googleAuth } from "../_components/firebase/config";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Sign_In = ({ setAuthClose }) => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const router = useRouter();
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(email, password);
      console.log(res, "ROLE BASED");

      if (res?.user) {
        console.log(res, "ROLE BASED");
        sessionStorage.setItem("user", true);
        localStorage.setItem("current-user", JSON.stringify(user));
        sessionStorage.setItem("UserAuthentication", JSON.stringify(res));
        const isSuccessful = true; // Replace with actual success condition
        // if (isSuccessful) {
        //   onLoginSuccess(); // Notify parent component of successful login
        // }
        toast.success("Successfully logged in!");
        setAuthClose(true);
        router.push("/");
      } else {
        // Handle unexpected response from the server
        throw new Error("Unexpected server response.");
      }
    } catch (err) {
      console.error(err);
      setAuthClose(false);
      //router.push("/sign-in");
      toast.error("Login failed! Please check your credentials.");
    }
    console.log({ email, password });
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      console.log(result, "ROLE BASED");
      const user = result.user;
      console.log("Google sign-in successful", user);
      sessionStorage.setItem("user", true);
      localStorage.setItem("current-user", JSON.stringify(user));
      const isSuccessful = true; // Replace with actual success condition
      //   if (isSuccessful) {
      //     onLoginSuccess(); // Notify parent component of successful login
      //   }
      toast.success("Google sign-in successful");
      setAuthClose(true);
      router.push("/");
    } catch (error) {
      console.error("Google sign-in error", error);
      toast.error("Google sign-in error");
    }
  };

  const handleLogin = async () => {
    // Your existing login logic
    const isSuccessful = true; // Replace with actual success condition
    // if (isSuccessful) {
    //   onLoginSuccess(); // Notify parent component of successful login
    // }
  };

  return (
    <div className="flex flex-auto flex-col h-[100vh]" bis_skin_checked={1}>
      <div
        className="flex h-full p-6 bg-white dark:bg-gray-800"
        bis_skin_checked={1}
      >
        <div
          className=" flex flex-col justify-center items-center flex-1"
          bis_skin_checked={1}
        >
          <div
            className="w-full xl:max-w-[450px] px-8 max-w-[380px]"
            bis_skin_checked={1}
          >
            <div className="mb-8" bis_skin_checked={1}>
              <div className="logo" bis_skin_checked={1} style={{ width: 60 }}>
                <img
                  className="mx-auto"
                  alt="Ecme logo"
                  src="/img/logo/logo-light-streamline.png"
                />
              </div>
            </div>
            <div className="mb-10" bis_skin_checked={1}>
              <h2 className="mb-2">Welcome back!</h2>
              <p className="font-semibold heading-text">
                Please enter your credentials to sign in!
              </p>
            </div>
            <div bis_skin_checked={1}>
              <form>
                <div className="form-container vertical" bis_skin_checked={1}>
                  <div className="form-item vertical" bis_skin_checked={1}>
                    <label className="form-label mb-2">Email</label>
                    <div className="" bis_skin_checked={1}>
                      <input
                        id="user_uid"
                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                        placeholder="Email"
                        autoComplete="off"
                        type="email"
                        defaultValue="admin-01@ecme.com"
                        name="email"
                        ref={emailRef}
                      />
                    </div>
                  </div>
                  <div className="form-item vertical mb-0" bis_skin_checked={1}>
                    <label className="form-label mb-2">Password</label>
                    <div className="" bis_skin_checked={1}>
                      <span className="input-wrapper">
                        <input
                          id="user_pin"
                          className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                          placeholder="Password"
                          autoComplete="off"
                          type="password"
                          defaultValue="123Qwe"
                          name="password"
                          ref={passwordRef}
                          style={{ paddingRight: "2.25rem" }}
                        />
                        <div className="input-suffix-end" bis_skin_checked={1}>
                          <span
                            className="cursor-pointer select-none text-xl"
                            role="button"
                          >
                            <svg
                              stroke="currentColor"
                              fill="none"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                              />
                            </svg>
                          </span>
                        </div>
                      </span>
                    </div>
                  </div>
                  <div className="mb-7 mt-2" bis_skin_checked={1}>
                    <a
                      className="hover:underline font-semibold heading-text mt-2 underline"
                      href="/forgot-password"
                    >
                      Forgot password
                    </a>
                  </div>
                  <button
                    className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 w-full button-press-feedback"
                    type="submit"
                    onClick={handleSubmit}
                    id="SignInbtn"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-8" bis_skin_checked={1}>
              <div
                className="flex items-center gap-2 mb-6"
                bis_skin_checked={1}
              >
                <div
                  className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]"
                  bis_skin_checked={1}
                />
                <p className="font-semibold heading-text">or countinue with</p>
                <div
                  className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]"
                  bis_skin_checked={1}
                />
              </div>
              <div className="flex items-center gap-2" bis_skin_checked={1}>
                <button
                  className="button bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 ring-primary dark:ring-white hover:border-primary dark:hover:border-white hover:ring-1 hover:text-primary dark:hover:text-white dark:hover:bg-transparent text-gray-600 dark:text-gray-100 h-12 rounded-xl px-5 py-2 flex-1 button-press-feedback"
                  type="button"
                  id="gsign"
                  onClick={handleGoogleSignIn}
                >
                  <div
                    className="flex items-center justify-center gap-2"
                    bis_skin_checked={1}
                  >
                    <img
                      className="h-[25px] w-[25px]"
                      alt="Google sign in"
                      src="/img/others/google.png"
                    />
                    <span>Google</span>
                  </div>
                </button>
                <button
                  className="button bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 ring-primary dark:ring-white hover:border-primary dark:hover:border-white hover:ring-1 hover:text-primary dark:hover:text-white dark:hover:bg-transparent text-gray-600 dark:text-gray-100 h-12 rounded-xl px-5 py-2 flex-1 button-press-feedback"
                  type="button"
                >
                  <div
                    className="flex items-center justify-center gap-2"
                    bis_skin_checked={1}
                  >
                    <img
                      className="h-[25px] w-[25px]"
                      alt="Google sign in"
                      src="/img/others/github.png"
                    />
                    <span>Github</span>
                  </div>
                </button>
              </div>
            </div>
            <div bis_skin_checked={1}>
              <div className="mt-6 text-center" bis_skin_checked={1}>
                <span>Don't have an account yet? </span>
                <a
                  className="hover:underline heading-text font-bold"
                  href="/sign-up"
                >
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          className="py-6 px-10 lg:flex flex-col flex-1 justify-between hidden rounded-3xl items-end relative max-w-[520px] 2xl:max-w-[720px]"
          bis_skin_checked={1}
        >
          <img
            className="absolute h-full w-full top-0 left-0 rounded-3xl"
            src="/img/auth-side-bg.png"
          />
        </div>
      </div>
    </div>
  );
};
export default Sign_In;
