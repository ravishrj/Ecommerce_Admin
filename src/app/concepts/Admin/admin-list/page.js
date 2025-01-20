"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, getDoc } from "firebase/firestore";
import { fireStore } from "@/app/_components/firebase/config";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
const Admin_List = () => {
  const router = useRouter();
  const [admins, setAdmins] = useState([]);
  const [role, setRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const querySnapshot = await getDocs(collection(fireStore, "users"));
        const adminsData = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          console.log("Fetched Admin:", data); // Log each document's dat
          return {
            id: doc.id, // Document ID
            ...data, // Spread all fields from Firestore
          };
        });
        setAdmins(adminsData);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    console.log(admins, "admins");

    fetchAdmins();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("current-user"));

      if (!user) {
        console.log("No user found in localStorage");
        return;
      }

      try {
        const userRef = doc(fireStore, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.log("User data not found in Firestore");
          return;
        }

        let existingData = userDoc.data();
        setRole(existingData?.role);
        console.log("Fetched user role:", existingData?.role);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Try again.");
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      if (role == "SUPER_ADMIN") {
        const adminDocRef = doc(fireStore, "users", id);

        // Delete the document
        await deleteDoc(adminDocRef);
        setAdmins((prevAdmins) =>
          prevAdmins.filter((admin) => admin.id !== id)
        );

        console.log("Admin deleted successfully!");
        toast.success("Admin deleted successfully!");
      } else {
        toast.error("Sorry Your are not Super Admins");
      }
    } catch (error) {
      toast.error("Error deleting product:");
      console.error("Error deleting product:", error.message);
    }
  };

  const handleEditProduct = async (id) => {
    router.push(`/concepts/products/product-edit/12?id=${id}`);
  };

  const exportToCSV = async () => {
    try {
      // Step 1: Fetch Product Data from Firestore
      const querySnapshot = await getDocs(collection(fireStore, "users"));
      const adminList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (adminList.length === 0) {
        alert("No products found!");
        return;
      }

      // Step 2: Convert Data to CSV Format
      const csvHeader =
        "ID,Name,email,Mobile Number,address,country,postal code\n";
      const csvRows = adminList.map((admin) => {
        const adminname = admin?.Name || {}; // Access first productData object
        const email = admin?.email || {};
        const mobile = admin?.phone || {};
        const address = admin?.address || {};
        const country = admin?.country || {};
        const postal_code = admin?.postcode || {};
        return `${admin.id},"${adminname}",${email},"${mobile}","${address}","${country}","${postal_code}"`;
      });

      const csvContent = csvHeader + csvRows.join("\n");

      // Step 3: Create a Blob & Generate a Download Link
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      // Step 4: Create a Temporary Download Link and Click it
      const a = document.createElement("a");
      a.href = url;
      a.download = "admin-list.csv";
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const totalPages = 5;
  const initialPage = 1;
  const itemsPerPageOptions = [10, 20, 50];
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  // Handle previous page
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Handle next page
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const filteredAdmins = admins.filter(
    (admin) =>
      admin?.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin?.phone?.includes(searchTerm)
  );
  return (
    <main className="h-full">
      <div
        className="page-container relative h-full flex flex-auto flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8"
        bis_skin_checked={1}
      >
        <div className="container mx-auto" bis_skin_checked={1}>
          <div
            className="card card-border"
            role="presentation"
            bis_skin_checked={1}
          >
            <div className="card-body" bis_skin_checked={1}>
              <div className="flex flex-col gap-4" bis_skin_checked={1}>
                <div
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  bis_skin_checked={1}
                >
                  <h3>Admins</h3>
                  <div
                    className="flex flex-col md:flex-row gap-3"
                    bis_skin_checked={1}
                  >
                    <button
                      onClick={exportToCSV}
                      className="button bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 ring-primary dark:ring-white hover:border-primary dark:hover:border-white hover:ring-1 hover:text-primary dark:hover:text-white dark:hover:bg-transparent text-gray-600 dark:text-gray-100 h-12 rounded-xl px-5 py-2 button-press-feedback"
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
                            className="text-xl"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M19 18a3.5 3.5 0 0 0 0 -7h-1a5 4.5 0 0 0 -11 -2a4.6 4.4 0 0 0 -2.1 8.4" />
                            <path d="M12 13l0 9" />
                            <path d="M9 19l3 3l3 -3" />
                          </svg>
                        </span>
                        <span>Export</span>
                      </span>
                    </button>

                    <button
                      className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 button-press-feedback"
                      onClick={() => {
                        router.push("/concepts/products/product-create");
                      }}
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
                            className="text-xl"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M12 5l0 14" />
                            <path d="M5 12l14 0" />
                          </svg>
                        </span>
                        <span>Add products</span>
                      </span>
                    </button>
                  </div>
                </div>
                <div
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  bis_skin_checked={1}
                >
                  <span className="input-wrapper">
                    <input
                      className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                      placeholder="Search by Name, Email, or Phone"
                      type="text"
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingRight: "2.125rem" }}
                    />
                    <div className="input-suffix-end" bis_skin_checked={1}>
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-lg"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                      </svg>
                    </div>
                  </span>
                  <button className="button bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 ring-primary dark:ring-white hover:border-primary dark:hover:border-white hover:ring-1 hover:text-primary dark:hover:text-white dark:hover:bg-transparent text-gray-600 dark:text-gray-100 h-12 rounded-xl px-5 py-2 button-press-feedback">
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
                          <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
                        </svg>
                      </span>
                      <span>Filter</span>
                    </span>
                  </button>
                </div>
                <div className="" bis_skin_checked={1}>
                  <div className="overflow-x-auto" bis_skin_checked={1}>
                    <table className="table-default table-hover">
                      <thead>
                        <tr>
                          <th colSpan={1}>
                            <div className="" bis_skin_checked={1}>
                              <label className="checkbox-label mb-0">
                                <span className="checkbox-wrapper h-5 relative">
                                  <input
                                    className="checkbox peer text-primary"
                                    type="checkbox"
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-3.5 w-3.5 stroke-neutral fill-neutral opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 mt-[1.25px]"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </span>
                              </label>
                            </div>
                          </th>
                          <th colSpan={1}>
                            <div
                              className="cursor-pointer select-none point"
                              bis_skin_checked={1}
                            >
                              ADMIN
                              <div className="inline-flex" bis_skin_checked={1}>
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 320 512"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                                </svg>
                              </div>
                            </div>
                          </th>
                          <th colSpan={1}>
                            <div
                              className="cursor-pointer select-none point"
                              bis_skin_checked={1}
                            >
                              Email
                              <div className="inline-flex" bis_skin_checked={1}>
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 320 512"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                                </svg>
                              </div>
                            </div>
                          </th>
                          <th colSpan={1}>
                            <div
                              className="cursor-pointer select-none point"
                              bis_skin_checked={1}
                            >
                              Mobile Number
                              <div className="inline-flex" bis_skin_checked={1}>
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 320 512"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                                </svg>
                              </div>
                            </div>
                          </th>
                          <th colSpan={1}>
                            <div
                              className="cursor-pointer select-none point"
                              bis_skin_checked={1}
                            >
                              Address
                              <div className="inline-flex" bis_skin_checked={1}>
                                <svg
                                  stroke="currentColor"
                                  fill="currentColor"
                                  strokeWidth={0}
                                  viewBox="0 0 320 512"
                                  height="1em"
                                  width="1em"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                                </svg>
                              </div>
                            </div>
                          </th>
                          <th colSpan={1}>
                            <div className="" bis_skin_checked={1} />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {admins.length > 0 &&
                          filteredAdmins
                            .slice(
                              (currentPage - 1) * itemsPerPage,
                              currentPage * itemsPerPage
                            )
                            .map((admin) => (
                              <tr key={admin.id}>
                                <td style={{ width: 50 }}>
                                  <label className="checkbox-label mb-0">
                                    <span className="checkbox-wrapper h-5 relative">
                                      <input
                                        className="checkbox peer text-primary"
                                        type="checkbox"
                                      />
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-3.5 w-3.5 stroke-neutral fill-neutral opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 mt-[1.25px]"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 0 1 0 1.414l-8 8a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 12.586l7.293-7.293a1 1 0 0 1 1.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  </label>
                                </td>

                                <td style={{ width: 150 }}>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className="avatar avatar-round"
                                      style={{
                                        width: 60,
                                        height: 60,
                                        minWidth: 60,
                                        lineHeight: 60,
                                        fontSize: 12,
                                      }}
                                    >
                                      <img
                                        className="avatar-img avatar-round"
                                        loading="lazy"
                                        src={admin?.profileImage}
                                      />
                                    </span>
                                    <div>
                                      <div className="font-bold heading-text mb-1">
                                        {admin?.Name}
                                      </div>
                                      <span>ID: {admin.id}</span>
                                    </div>
                                  </div>
                                </td>

                                <td style={{ width: 150 }}>
                                  <span className="font-bold heading-text">
                                    {admin?.email}
                                  </span>
                                </td>

                                <td style={{ width: 150 }}>
                                  <span className="font-bold heading-text">
                                    {admin?.phone}
                                  </span>
                                </td>

                                <td style={{ width: 150 }}>
                                  <div className="flex flex-col gap-1">
                                    <span className="flex gap-1">
                                      <span className="font-semibold">
                                        {admin?.address}
                                      </span>
                                    </span>
                                    {/* <div className="progress line">
                                    <div className="progress-wrapper">
                                      <div className="progress-inner">
                                        <div
                                          className="progress-bg h-2 bg-success"
                                          style={{
                                            width: `${product?.progress}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div> */}
                                  </div>
                                </td>

                                <td style={{ width: 150 }}>
                                  <div className="flex items-center justify-end gap-3">
                                    <span
                                      className="tooltip-wrapper"
                                      onClick={() =>
                                        handleEditProduct(admin?.id)
                                      }
                                    >
                                      <div className="text-xl cursor-pointer font-semibold">
                                        <svg
                                          stroke="currentColor"
                                          fill="none"
                                          strokeWidth={2}
                                          viewBox="0 0 24 24"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          height="1em"
                                          width="1em"
                                        >
                                          <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                          <path d="M13.5 6.5l4 4" />
                                        </svg>
                                      </div>
                                    </span>
                                    <span
                                      className="tooltip-wrapper"
                                      onClick={() =>
                                        handleDeleteProduct(admin?.id)
                                      } // Use an arrow function
                                    >
                                      <div className="text-xl cursor-pointer font-semibold">
                                        <svg
                                          stroke="currentColor"
                                          fill="none"
                                          strokeWidth={2}
                                          viewBox="0 0 24 24"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          height="1em"
                                          width="1em"
                                        >
                                          <path d="M4 7l16 0" />
                                          <path d="M10 11l0 6" />
                                          <path d="M14 11l0 6" />
                                          <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                          <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                                        </svg>
                                      </div>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                  {/* <div
                    className="flex items-center justify-between mt-4"
                    bis_skin_checked={1}
                  >
                    <div className="pagination" bis_skin_checked={1}>
                      <span
                        className="pagination-pager pagination-pager-prev pagination-pager-disabled"
                        role="presentation"
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
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <ul>
                        <li
                          className="pagination-pager text-primary dark:bg-primary dark:text-neutral"
                          role="presentation"
                        >
                          1
                        </li>
                        <li
                          className="pagination-pager pagination-pager-inactive"
                          role="presentation"
                        >
                          2
                        </li>
                      </ul>
                      <span
                        className="pagination-pager pagination-pager-next pagination-pager-inactive"
                        role="presentation"
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
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                    <div bis_skin_checked={1} style={{ minWidth: 130 }}>
                      <div
                        className="select select-sm css-b62m3t-container"
                        bis_skin_checked={1}
                      >
                        <span
                          id="react-select-data-table-live-region"
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
                          className="select-control min-h-10 bg-gray-100 dark:bg-gray-700 select__control css-0"
                          bis_skin_checked={1}
                        >
                          <div
                            className="select-value-container grid select__value-container select__value-container--has-value css-0"
                            bis_skin_checked={1}
                          >
                            <div
                              className="select-single-value select__single-value css-0"
                              bis_skin_checked={1}
                            >
                              10 / page
                            </div>
                            <input
                              id="react-select-data-table-input"
                              tabIndex={0}
                              inputMode="none"
                              aria-autocomplete="list"
                              aria-expanded="false"
                              aria-haspopup="true"
                              role="combobox"
                              aria-activedescendant=""
                              aria-readonly="true"
                              className="css-1hac4vs-dummyInput"
                              defaultValue=""
                            />
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
                  </div> */}

                  <div className="flex items-center justify-between mt-4">
                    {/* Pagination Controls */}
                    <div className="pagination flex items-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        className={`pagination-pager ${
                          currentPage === 1 ? "pagination-pager-disabled" : ""
                        }`}
                        aria-label="Previous Page"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          height="1em"
                          width="1em"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      <ul className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, index) => {
                          const pageNum = index + 1;
                          return (
                            <li
                              key={pageNum}
                              className={`pagination-pager ${
                                currentPage === pageNum
                                  ? "text-primary dark:bg-primary dark:text-neutral"
                                  : "pagination-pager-inactive"
                              }`}
                              onClick={() => setCurrentPage(pageNum)}
                              role="button"
                              tabIndex={0}
                              aria-label={`Page ${pageNum}`}
                            >
                              {pageNum}
                            </li>
                          );
                        })}
                      </ul>

                      {/* Next Button */}
                      <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`pagination-pager ${
                          currentPage === totalPages
                            ? "pagination-pager-disabled"
                            : ""
                        }`}
                        aria-label="Next Page"
                      >
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth={0}
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                          height="1em"
                          width="1em"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Items Per Page Dropdown */}
                    <div className="min-w-[130px]">
                      <select
                        className="select select-sm bg-gray-100 dark:bg-gray-700"
                        value={itemsPerPage}
                        onChange={(e) =>
                          setItemsPerPage(Number(e.target.value))
                        }
                        aria-label="Items per page"
                      >
                        {itemsPerPageOptions.map((option) => (
                          <option key={option} value={option}>
                            {option} / page
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default Admin_List;
