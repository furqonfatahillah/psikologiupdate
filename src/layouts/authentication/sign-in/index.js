import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
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
        navigate("/");
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
      console.log(fullUrl);
      setBackgroundImage(fullUrl);
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengambil background: ${error.response?.data?.message || "Terjadi kesalahan"}`,
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
        navigate("/");
      } else {
        navigate("/Biodata");
      }
    } catch (error) {
      console.error("Login gagal:", error.response?.data?.message || "Terjadi kesalahan");

      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: error.response?.data?.message || "Terjadi kesalahan",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      title="Selamat Datang"
      description="Masukkan username dan password Anda untuk masuk"
      image={backgroundImage || undefined}
      color="info"
    >
      {/* Konten dengan teks yang dipusatkan */}
      <SoftBox textAlign="center">
        {/* Logo Header */}
        <SoftBox display="flex" justifyContent="center" mb={4} gap={3}>
          <SoftBox
            component="img"
            src={PoldaLogo}
            alt="Polda Logo"
            width="55px"
            height="55px"
            sx={{ objectFit: "contain" }}
          />
          <SoftBox
            component="img"
            src={SDMLogo}
            alt="SDM Logo"
            width="55px"
            height="55px"
            sx={{ objectFit: "contain" }}
          />
          <SoftBox
            component="img"
            src={PsikologiLogo}
            alt="Psikologi Logo"
            width="65px"
            height="55px"
            sx={{ objectFit: "contain" }}
          />
        </SoftBox>

        {/* Title dan Description (jika CoverLayout tidak menampilkannya) */}
        {/* <SoftBox mb={4}>
          <SoftTypography variant="h4" fontWeight="bold" color="info" gutterBottom>
            Selamat Datang
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            Masukkan username dan password Anda untuk masuk
          </SoftTypography>
        </SoftBox> */}

        <SoftBox component="form" role="form" onSubmit={handleLogin}>
          <SoftBox mb={3} textAlign="left">
            <SoftTypography 
              component="label" 
              variant="caption" 
              fontWeight="bold" 
              color="text"
              display="block"
              mb={1}
            >
              Username
            </SoftTypography>
            <SoftInput
              type="text"
              placeholder="Masukkan username anda"
              value={username}
              onChange={(e) => setUsername(e.target.value.toUpperCase())}
              required
              fullWidth
            />
          </SoftBox>

          <SoftBox mb={4} textAlign="left">
            <SoftTypography 
              component="label" 
              variant="caption" 
              fontWeight="bold" 
              color="text"
              display="block"
              mb={1}
            >
              Password
            </SoftTypography>
            <SoftInput
              type="password"
              placeholder="Masukkan password anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </SoftBox>

          <SoftButton
            type="submit"
            variant="gradient"
            color="info"
            fullWidth
            disabled={loading}
            size="large"
          >
            {loading ? (
              <SoftBox display="flex" alignItems="center" justifyContent="center">
                <SoftBox
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: "white",
                    borderTopColor: "transparent",
                    animation: "spin 1s linear infinite",
                    mr: 2,
                    "@keyframes spin": {
                      "0%": { transform: "rotate(0deg)" },
                      "100%": { transform: "rotate(360deg)" },
                    },
                  }}
                />
                Memproses...
              </SoftBox>
            ) : (
              "Login"
            )}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default SignIn;