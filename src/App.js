/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================
*/

import { useState, useEffect } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Soft UI components
import SoftBox from "components/SoftBox";

// Soft UI examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Protected route
import ProtectedRouteAdmin from "components/Protected/ProtectedRouteAdmin";
import ProtectedRouteUser from "components/Protected/ProtectedRouteUser";

// routes
import routes from "routes";

// context
import {
  useSoftUIController,
  setMiniSidenav,
  setOpenConfigurator,
  setLayout,
} from "context";

// logo
import brand from "assets/images/psikologi.svg";

export default function App() {
  const [controller, dispatch] = useSoftUIController();

  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } =
    controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);

  const { pathname } = useLocation();

  // ambil role dari session
  const getUserRole = () => {
    return sessionStorage.getItem("role");
  };

  // set layout berdasarkan role
  useEffect(() => {
    const role = getUserRole();

    if (role === "ADMIN" || role === "SUPERADMIN") {
      setLayout(dispatch, "dashboard");
    } else {
      setLayout(dispatch, "vr");
    }
  }, [pathname, dispatch]);

  // RTL cache
  useEffect(() => {
    const cache = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cache);
  }, []);

  // open sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // close sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // configurator
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // direction
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // scroll top saat pindah halaman
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  // generate routes
  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        // USER ROUTE
        if (
          route.route === "/biodata" ||
          route.route === "/profile" ||
          route.route === "/detail-profile" ||
          route.route === "/instruksi-tes" ||
          route.route === "/jenis-pengajuan" ||
          route.route === "/jenis-tes" ||
          route.route === "/riwayat-tes" ||
          route.route === "/ujian"
        ) {
          return (
            <Route
              key={route.key}
              path={route.route}
              element={
                <ProtectedRouteUser>{route.component}</ProtectedRouteUser>
              }
            />
          );
        }

        // ADMIN ROUTE
        if (
          route.route === "/dashboard" ||
          route.route === "/template" ||
          route.route === "/manajemen-tes" ||
          route.route === "/hasil-laporan" ||
          route.route === "/manajemen-pengguna" ||
          route.route === "/manajemen-tampilan"
        ) {
          return (
            <Route
              key={route.key}
              path={route.route}
              element={
                <ProtectedRouteAdmin>{route.component}</ProtectedRouteAdmin>
              }
            />
          );
        }

        return (
          <Route
            key={route.key}
            path={route.route}
            element={route.component}
          />
        );
      }

      return null;
    });

  // button setting
  const configsButton = (
    <SoftBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.5rem"
      height="3.5rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon>settings</Icon>
    </SoftBox>
  );

  // cegah error jika rtlCache belum ada
  if (direction === "rtl" && !rtlCache) {
    return null;
  }

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />

        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={brand}
              brandName="BAG PSIKOLOGI POLDA SULSEL"
              routes={routes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />

            <Configurator />
            {configsButton}
          </>
        )}

        {layout === "vr" && <Configurator />}

        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={brand}
            brandName={
              <>
                BAG PSIKOLOGI <br />
                BIRO SDM <br />
                POLDA SULSEL
              </>
            }
            routes={routes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />

          <Configurator />
          {configsButton}
        </>
      )}

      {layout === "vr" && <Configurator />}

      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>
  );
}