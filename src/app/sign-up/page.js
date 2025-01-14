"use client";
import { useState, useRef } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, googleAuth, fireStore } from "../_components/firebase/config";
import { signInWithPopup, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Sign_up = ({ setAuthClose }) => {
  const router = useRouter();
  const userNameRef = useRef("");

  const emailRef = useRef("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        emailRef.current.value,
        password
      );
      console.log(userCredential, "userCredential");
      const user = userCredential.user;

      //setting display name
      await updateProfile(user, {
        displayName: `${userNameRef.current.value}`,
      });
      // Store additional user information in Firestore
      await setDoc(doc(fireStore, "users", user.uid), {
        firstName: userNameRef.current.value,

        email: user.email,

        createdAt: new Date(),
      });

      sessionStorage.setItem("user", true);
      // router.push("/sign-in");
      // Optionally, you can add a success message or redirect
      toast.success("Sign-up successful! Click on Sign-in to Login");

      // setSuccess(true);
    } catch (e) {
      setAuthClose(false);
      console.log(e);
      toast.error("Sign-up failed! Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuth);
      const user = result.user;
      console.log("Google sign-in successful", user);
      toast.success("Google sign-in successful");
      sessionStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email })
      );
    } catch (error) {
      console.error("Google sign-in error", error);
      toast.error("Google sign-in error");
    }
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
            <div className="mb-8" bis_skin_checked={1}>
              <h3 className="mb-1">Sign Up</h3>
              <p className="font-semibold heading-text">
                And lets get started with your free trial
              </p>
            </div>
            <div bis_skin_checked={1}>
              <form>
                <div className="form-container vertical" bis_skin_checked={1}>
                  <div className="form-item vertical" bis_skin_checked={1}>
                    <label className="form-label mb-2">User name</label>
                    <div className="" bis_skin_checked={1}>
                      <input
                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                        placeholder="User Name"
                        autoComplete="off"
                        type="text"
                        defaultValue="admin-01@ecme.com"
                        name="userName"
                        ref={userNameRef}
                      />
                    </div>
                  </div>
                  <div className="form-item vertical" bis_skin_checked={1}>
                    <label className="form-label mb-2">Email</label>
                    <div className="" bis_skin_checked={1}>
                      <input
                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                        placeholder="Email"
                        autoComplete="off"
                        type="email"
                        defaultValue=""
                        name="email"
                        ref={emailRef}
                      />
                    </div>
                  </div>
                  <div className="form-item vertical" bis_skin_checked={1}>
                    <label className="form-label mb-2">Password</label>
                    <div className="" bis_skin_checked={1}>
                      <input
                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                        autoComplete="off"
                        placeholder="Password"
                        type="password"
                        defaultValue="123Qwe"
                        name="password"
                        id="Password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-item vertical" bis_skin_checked={1}>
                    <label className="form-label mb-2">Confirm Password</label>
                    <div className="" bis_skin_checked={1}>
                      <input
                        className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                        autoComplete="off"
                        placeholder="Confirm Password"
                        type="password"
                        defaultValue=""
                        name="confirmPassword"
                        id="ConfirmPassword"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 w-full button-press-feedback"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
            <div bis_skin_checked={1}>
              <div className="mt-6 text-center" bis_skin_checked={1}>
                <span>Already have an account? </span>
                <a
                  className="hover:underline heading-text font-bold"
                  href="/sign-in"
                >
                  Sign in
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
export default Sign_up;
