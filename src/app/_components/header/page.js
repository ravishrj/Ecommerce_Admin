const Header = ({
  navbarToggle,
  setNavbarToggle,
  isMobile,
  setMobNavabarToggle,
  mobNavbarToggle,
  isLogin,
  setLogin,
}) => {
  const handleNavbarToggle = () => {
    setNavbarToggle((prev) => !prev);
    {
      isMobile && setMobNavabarToggle((prev) => !prev);
    }
  };

  return (
    <header className="header shadow dark:shadow-2xl">
      <div className="header-wrapper" style={{ height: 64 }}>
        <div className="header-action header-action-start">
          <div
            className="header-action-item header-action-item-hoverable"
            role="button"
            onClick={handleNavbarToggle}
          >
            <div className="text-2xl">
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
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
          </div>
          <div className="header-action-item header-action-item-hoverable text-2xl">
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
                d="M192,112a80,80,0,1,1-80-80A80,80,0,0,1,192,112Z"
                opacity="0.2"
              />
              <path d="M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
          </div>
        </div>
        <div className="header-action header-action-end">
          <div
            className="dropdown-toggle"
            role="menuitem"
            aria-expanded="false"
            aria-haspopup="menu"
            {...(isLogin ? { "data-floating-ui-inert": true } : {})}
          >
            <div className="header-action-item header-action-item-hoverable flex items-center">
              <span
                className="avatar avatar-circle"
                style={{
                  width: 24,
                  height: 24,
                  minWidth: 24,
                  lineHeight: 24,
                  fontSize: 12,
                }}
              >
                <img
                  className="avatar-img avatar-circle"
                  loading="lazy"
                  src="/img/countries/US.png"
                  alt="US flag"
                />
              </span>
            </div>
          </div>
          <div
            className="dropdown-toggle"
            role="menuitem"
            aria-expanded="false"
            aria-haspopup="menu"
            {...(isLogin ? { "data-floating-ui-inert": true } : {})}
          >
            <div
              className="text-2xl header-action-item header-action-item-hoverable"
              data-floating-ui-inert
            >
              <span className="badge-wrapper relative flex">
                <span
                  className="badge-dot w-3 h-3 border border-white dark:border-gray-900 rounded-full text-xs font-semibold bg-error text-white badge-inner"
                  style={{ top: 3, right: 6 }}
                />
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
                    d="M208,192H48a8,8,0,0,1-6.88-12C47.71,168.6,56,139.81,56,104a72,72,0,0,1,144,0c0,35.82,8.3,64.6,14.9,76A8,8,0,0,1,208,192Z"
                    opacity="0.2"
                  />
                  <path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
                </svg>
              </span>
            </div>
          </div>
          <div
            className="dropdown-toggle flex items-center"
            onClick={() => {
              setLogin((prev) => !prev);
            }}
            aria-expanded={isLogin ? "true" : "false"}
            {...(isLogin ? { "data-floating-ui-inert": true } : {})}
            aria-controls={isLogin ? ":r7:" : ""}
            {...(isLogin ? { "data-open": true } : {})}
          >
            <span
              className="avatar avatar-circle"
              style={{
                width: 32,
                height: 32,
                minWidth: 32,
                lineHeight: 32,
                fontSize: 12,
              }}
            >
              <img
                className="avatar-img avatar-circle"
                loading="lazy"
                src="/img/avatars/thumb-1.jpg"
                alt="User Avatar"
              />
            </span>
          </div>
          {/* {isLogin && (
            <span
              tabIndex={-1}
              aria-hidden="true"
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
              data-floating-ui-inert=""
            />
          )}
          {isLogin && (
            <span
              data-type="outside"
              tabIndex={0}
              aria-hidden="true"
              data-floating-ui-focus-guard=""
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
          )}
          {isLogin && (
            <span
              aria-owns=":r21:"
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
              data-floating-ui-inert=""
            />
          )}
          {isLogin && (
            <span
              data-type="outside"
              tabIndex={0}
              aria-hidden="true"
              data-floating-ui-focus-guard=""
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
          )} */}
        </div>
      </div>
    </header>
  );
};

export default Header;
