"use client";

import { useState } from "react";
import { auth } from "../firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify"; // Optional: For notifications

const Forget_Password = ({
  setAuthClose,
  classProp,
  loadedComponent,

  setLoadedComponent,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent! Check your mail.");
      setEmail("");
      setLoadedComponent("signin");
    } catch (error) {
      console.error("Error:", error.message);
      toast.error("Failed to send reset email. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div
      className={`flex flex-auto flex-col h-[100vh] ${classProp}`}
      style={{ display: classProp === "is-visible" ? "flex" : "none" }}
    >
      <div className="h-full flex flex-auto flex-col justify-between">
        <main className="h-full">
          <div className="page-container relative h-full flex flex-auto flex-col pb-0">
            <div className="flex h-full p-6 bg-white dark:bg-gray-800">
              <div className="flex flex-col justify-center items-center flex-1">
                <div className="w-full xl:max-w-[450px] px-8 max-w-[380px]">
                  <div>
                    <div className="mb-6">
                      <h3 className="mb-2">Forgot Password</h3>
                      <p className="font-semibold heading-text">
                        Please enter your email to receive a verification link.
                      </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleResetPassword}>
                      <div className="form-container vertical">
                        <div className="form-item vertical">
                          <label className="form-label mb-2">Email</label>
                          <input
                            className="input input-md h-12 focus:ring-primary focus:border-primary"
                            placeholder="Email"
                            autoComplete="off"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                        <button
                          className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 w-full"
                          type="submit"
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Submit"}
                        </button>
                      </div>
                    </form>

                    {/* Back to Sign In */}
                    <div className="mt-4 text-center">
                      <span>Back to </span>
                      <button
                        className="hover:underline heading-text font-bold"
                        onClick={() => setLoadedComponent("signin")}
                      >
                        Sign in
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side Image */}
              <div className="py-6 px-10 lg:flex flex-col flex-1 justify-between hidden rounded-3xl items-end relative max-w-[520px]">
                <img
                  className="absolute h-full w-full top-0 left-0 rounded-3xl"
                  src="/img/auth-side-bg.png"
                  alt="Background"
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Forget_Password;
