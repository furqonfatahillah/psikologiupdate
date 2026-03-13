import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Soft UI components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Layout
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import PoldaLogo from "../../../assets/images/Polda.svg";
import SDMLogo from "../../../assets/images/SDM.svg";
import PsikologiLogo from "../../../assets/images/psikologi.svg";

import BASE_URL from "../../../config/BASE_URL";
import BASE_URL_NO_API from "../../../config/BASE_URL_NOT_API";

import Swal from "sweetalert2";

function SignIn() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (token) {
      if (role === "ADMIN" || role === "SUPERADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/Biodata");
      }
    }

    fetchBackground();
  }, [navigate]);

  const fetchBackground = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/background`);

      const svgPath = response.data.data.svg_path;

      const fullUrl = `${BASE_URL_NO_API}/${svgPath}`;

      setBackgroundImage(fullUrl);
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengambil background`,
        "error"
      );
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username,
        password,
      });

      const { token, role } = response.data.data;

      sessionStorage.setItem("token", token);
      localStorage.setItem("tokenLocal", token);
      sessionStorage.setItem("role", role);

      if (role === "ADMIN" || role === "SUPERADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/Biodata");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      title="Selamat Datang"
      description="Masukkan username dan password Anda untuk masuk"
      image={backgroundImage}
      color="info"
    >
      <SoftBox textAlign="center">
        {/* LOGO */}
        <SoftBox display="flex" justifyContent="center" mb={4} gap={3}>
          <SoftBox component="img" src={PoldaLogo} width="55px" />
          <SoftBox component="img" src={SDMLogo} width="55px" />
          <SoftBox component="img" src={PsikologiLogo} width="65px" />
        </SoftBox>

        {/* FORM */}
        <SoftBox component="form" onSubmit={handleLogin}>
          <SoftBox mb={3} textAlign="left">
            <SoftTypography variant="caption" fontWeight="bold">
              Username
            </SoftTypography>

            <SoftInput
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              fullWidth
              required
            />
          </SoftBox>

          <SoftBox mb={4} textAlign="left">
            <SoftTypography variant="caption" fontWeight="bold">
              Password
            </SoftTypography>

            <SoftInput
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
          </SoftBox>

          <SoftButton
            type="submit"
            variant="gradient"
            color="info"
            fullWidth
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;