const Create_Product = () => {
  return (
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
            <h3 className="font-bold">Create product</h3>
          </div>
        </div>
        <form className="flex w-full h-full">
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
                              defaultValue=""
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
                              defaultValue=""
                              name="productCode"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-item vertical" bis_skin_checked={1}>
                        <label className="form-label mb-2">Description</label>
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
                                id=":r2v:"
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
                                // contentEditable="true"
                                translate="no"
                                className="tiptap ProseMirror m-2 focus:outline-none"
                                tabIndex={0}
                                bis_skin_checked={1}
                              >
                                <p>
                                  <br className="ProseMirror-trailingBreak" />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card card-border"
                    role="presentation"
                    bis_skin_checked={1}
                  >
                    <div className="card-body" bis_skin_checked={1}>
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
                                defaultValue=""
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
                          <label className="form-label mb-2">Cost price</label>
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
                                defaultValue=""
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
                                defaultValue=""
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
                          <label className="form-label mb-2">Tax rate(%)</label>
                          <div className="" bis_skin_checked={1}>
                            <input
                              className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                              autoComplete="off"
                              placeholder={0}
                              type="text"
                              defaultValue={0}
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
                    <div className="card-body" bis_skin_checked={1}>
                      <h4 className="mb-2">Product Image</h4>
                      <p>
                        Choose a product photo or simply drag and drop up to 5
                        photos here.
                      </p>
                      <div className="mt-4" bis_skin_checked={1}>
                        <div
                          className="form-item vertical mb-4"
                          bis_skin_checked={1}
                        >
                          <label className="form-label" />
                          <div className="" bis_skin_checked={1}>
                            <div
                              className="upload upload-draggable hover:border-primary"
                              bis_skin_checked={1}
                            >
                              <input
                                className="upload-input draggable"
                                title=""
                                type="file"
                                defaultValue=""
                              />
                              <div
                                className="max-w-full flex flex-col px-4 py-8 justify-center items-center"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="text-[60px]"
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
                                <p className="flex flex-col items-center mt-2">
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
                      <p>
                        Image formats: .jpg, .jpeg, .png, preferred size: 1:1,
                        file size is restricted to a maximum of 500kb.
                      </p>
                    </div>
                  </div>
                  <div
                    className="card card-border"
                    role="presentation"
                    bis_skin_checked={1}
                  >
                    <div className="card-body" bis_skin_checked={1}>
                      <h4 className="mb-6">Attribute</h4>
                      <div className="form-item vertical" bis_skin_checked={1}>
                        <label className="form-label mb-2">Category</label>
                        <div className="" bis_skin_checked={1}>
                          <div
                            className="select select-md css-b62m3t-container"
                            bis_skin_checked={1}
                          >
                            <span
                              id="react-select-13-live-region"
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
                                  id="react-select-13-placeholder"
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
                                    id="react-select-13-input"
                                    spellCheck="false"
                                    tabIndex={0}
                                    aria-autocomplete="list"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                    role="combobox"
                                    aria-activedescendant=""
                                    aria-describedby="react-select-13-placeholder"
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
                      <div className="form-item vertical" bis_skin_checked={1}>
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
                              <div
                                className="select-value-container grid select__value-container select__value-container--is-multi css-0"
                                bis_skin_checked={1}
                              >
                                <div
                                  className="select-placeholder text-gray-400 select__placeholder css-0"
                                  id="react-select-14-placeholder"
                                  bis_skin_checked={1}
                                >
                                  Add tags for product...
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
                                    aria-describedby="react-select-14-placeholder"
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
                      <div className="form-item vertical" bis_skin_checked={1}>
                        <label className="form-label mb-2">Brand</label>
                        <div className="" bis_skin_checked={1}>
                          <input
                            className="input input-md h-12 focus:ring-primary focus-within:ring-primary focus-within:border-primary focus:border-primary"
                            autoComplete="off"
                            placeholder="Product brand"
                            type="text"
                            defaultValue=""
                            name="brand"
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
                  <span />
                  <div className="flex items-center" bis_skin_checked={1}>
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
                        <span>Discard</span>
                      </span>
                    </button>
                    <button
                      className="button bg-primary hover:bg-primary-mild text-neutral h-12 rounded-xl px-5 py-2 button-press-feedback"
                      type="submit"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};
export default Create_Product;
