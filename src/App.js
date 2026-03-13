/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================
*/

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard React examples
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Soft UI Dashboard React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

import ProtectedRouteAdmin from "components/Protected/ProtectedRouteAdmin";
import ProtectedRouteUser from "components/Protected/ProtectedRouteUser";

// Soft UI Dashboard React routes
import routes from "routes";

// Soft UI Dashboard React contexts
import { useSoftUIController, setMiniSidenav, setOpenConfigurator, setLayout } from "context";

// Images
import brand from "assets/images/psikologi.svg";

export default function App() {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;

  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();

  // Ambil role dari sessionStorage
  const getUserRole = () => {
    return sessionStorage.getItem("role");
  };

  // Tentukan layout berdasarkan role
  useEffect(() => {
    const role = getUserRole();

    if (role === "ADMIN" || role === "SUPERADMIN") {
      setLayout(dispatch, "dashboard"); // tampil sidenav
    } else {
      setLayout(dispatch, "vr"); // tanpa sidenav
    }
  }, [pathname, dispatch]);

  // RTL cache
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);

  // Set direction
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Scroll ke atas saat pindah halaman
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

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
                <ProtectedRouteUser>
                  {route.component}
                </ProtectedRouteUser>
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
                <ProtectedRouteAdmin>
                  {route.component}
                </ProtectedRouteAdmin>
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
      <Icon fontSize="default" color="inherit">
        settings
      </Icon>
    </SoftBox>
  );

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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </ThemeProvider>
  );
}