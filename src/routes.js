// Soft UI Dashboard React layouts
import Dashboard from "./layouts/dashboard/index";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import VirtualReality from "layouts/virtual-reality";
import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import Template from "layouts/template";
import ManajemenTes from "layouts/manajemen-tes";

import HasilLaporan from "layouts/hasil-laporan";
import HasilUjian from "layouts/hasil-ujian";
import ManajemenPengguna from "layouts/manajemen-pengguna";
import ManajemenTampilan from "layouts/manajemen-tampilan";

// USER
import Biodata from "layouts/user/biodata";
import JenisTes from "layouts/user/jenis-tes";
import RiwayatTes from "layouts/user/riwayat-tes";
import JenisPengajuan from "layouts/user/jenis-pengajuan";
import InstruksiTes from "layouts/user/instruksi-tes";
import DetailProfile from "layouts/user/detail-profile";
import Ujian from "layouts/user/ujian";

// Protected
import ProtectedRouteAdmin from "components/Protected/ProtectedRouteAdmin";
import ProtectedRouteUser from "components/Protected/ProtectedRouteUser";

// Icons
import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";

const routes = [

  // ================= ADMIN =================

  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: (
      <ProtectedRouteAdmin>
        <Dashboard />
      </ProtectedRouteAdmin>
    ),
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Template",
    key: "template",
    route: "/template",
    icon: <Office size="12px" />,
    component: (
      <ProtectedRouteAdmin>
        <Template />
      </ProtectedRouteAdmin>
    ),
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Manajemen Tes",
    key: "manajemen-tes",
    route: "/manajemen-tes",
    icon: <Office size="12px" />,
    component: (
      <ProtectedRouteAdmin>
        <ManajemenTes />
      </ProtectedRouteAdmin>
    ),
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Hasil Laporan",
    key: "hasil-laporan",
    route: "/hasil-laporan",
    icon: <Office size="12px" />,
    component: (
      <ProtectedRouteAdmin>
        <HasilLaporan />
      </ProtectedRouteAdmin>
    ),
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "Hasil Ujian",
    key: "hasil-ujian",
    route: "/hasil-ujian",
    icon: <Office size="12px" />,
    component: (
      <ProtectedRouteAdmin>
        <HasilUjian />
      </ProtectedRouteAdmin>
    ),
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Manajemen Pengguna",
    key: "manajemen-pengguna",
    route: "/manajemen-pengguna",
    icon: <Office size="12px" />,
    component: (
      <ProtectedRouteAdmin>
        <ManajemenPengguna />
      </ProtectedRouteAdmin>
    ),
    noCollapse: true,
  },

  {
    type: "collapse",
    name: "Manajemen Tampilan",
    key: "manajemen-tampilan",
    route: "/manajemen-tampilan",
    icon: <Office size="12px" />,
    component: (
      <ProtectedRouteAdmin>
        <ManajemenTampilan />
      </ProtectedRouteAdmin>
    ),
    noCollapse: true,
  },

  // ================= USER =================

  {
    type: "hidden",
    name: "Biodata",
    key: "biodata",
    route: "/biodata",
    icon: <CustomerSupport size="12px" />,
    component: (
      <ProtectedRouteUser>
        <Biodata />
      </ProtectedRouteUser>
    ),
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "JenisTes",
    key: "jenis-tes",
    route: "/jenis-tes",
    icon: <CustomerSupport size="12px" />,
    component: (
      <ProtectedRouteUser>
        <JenisTes />
      </ProtectedRouteUser>
    ),
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "RiwayatTes",
    key: "riwayat-tes",
    route: "/riwayat-tes",
    icon: <CustomerSupport size="12px" />,
    component: (
      <ProtectedRouteUser>
        <RiwayatTes />
      </ProtectedRouteUser>
    ),
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "JenisPengajuan",
    key: "jenis-pengajuan",
    route: "/jenis-pengajuan",
    icon: <CustomerSupport size="12px" />,
    component: (
      <ProtectedRouteUser>
        <JenisPengajuan />
      </ProtectedRouteUser>
    ),
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "InstruksiTes",
    key: "instruksi-tes",
    route: "/instruksi-tes",
    icon: <CustomerSupport size="12px" />,
    component: (
      <ProtectedRouteUser>
        <InstruksiTes />
      </ProtectedRouteUser>
    ),
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "DetailProfile",
    key: "detail-profile",
    route: "/detail-profile",
    icon: <CustomerSupport size="12px" />,
    component: (
      <ProtectedRouteUser>
        <DetailProfile />
      </ProtectedRouteUser>
    ),
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "Ujian",
    key: "ujian",
    route: "/ujian",
    icon: <CustomerSupport size="12px" />,
    component: (
      <ProtectedRouteUser>
        <Ujian />
      </ProtectedRouteUser>
    ),
    noCollapse: true,
  },

  // ================= AUTH =================

  {
    type: "hidden",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },

  {
    type: "hidden",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
    noCollapse: true,
  },
];

export default routes;