import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";

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
import Swal from "sweetalert2";

function Biodata() {
  const navigate = useNavigate();
  const [nama_lengkap, setNamaLengkap] = useState("");
  const [pangkat, setPangkat] = useState("");
  const [nrp, setNrp] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [kesatuan, setKesatuan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [loading, setLoading] = useState(false);

  const [listPangkat, setListPangkat] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchBiodata = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await axios.get(`${BASE_URL}/user-biodata/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const biodata = response.data.data;

        if (biodata) {
          setNamaLengkap(biodata.nama_lengkap || "");
          setNrp(biodata.nrp || "");
          setJabatan(biodata.jabatan || "");
          setKesatuan(biodata.kesatuan || "");
          setAlamat(biodata.alamat || "");

          if (
            biodata.nama_lengkap &&
            biodata.nrp &&
            biodata.jabatan &&
            biodata.kesatuan &&
            biodata.alamat
          ) {
            navigate("/user/jenis-tes");
          }
        }
      } catch (error) {
        Swal.fire(
          "Gagal!",
          `Gagal mengambil biodata: ${error.response?.data?.message || "Terjadi kesalahan"
          }`,
          "error"
        );
      }
    };

    fetchBiodata();
    fetchBackground();
  }, [navigate]);

  const fetchBackground = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/background`);
      const svgPath = response.data.data.svg_path;
      const fullUrl = `${BASE_URL}/${svgPath}`;
      setBackgroundImage(fullUrl);
    } catch (error) {
      console.error("Gagal mengambil background:", error);
    }
  };

  useEffect(() => {
    const fetchPangkat = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
        return;
      }

      try {
        const response = await axios.get(
          `${BASE_URL}/masters/kesatuan-pangkat`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { pangkat } = response.data.data;
        setListPangkat(pangkat || []);
      } catch (error) {
        Swal.fire(
          "Gagal!",
          `Gagal mengambil data pangkat: ${error.response?.data?.message || "Terjadi kesalahan"
          }`,
          "error"
        );
      }
    };

    fetchPangkat();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    if (!nama_lengkap || !pangkat || !nrp || !jabatan || !alamat) {
      Swal.fire("Peringatan", "Harap isi semua field", "warning");
      setLoading(false);
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const data = {
      userId,
      nama_lengkap,
      nrp,
      jabatan,
      masterPangkatId: pangkat,
      alamat
    };

    try {
      await axios.post(`${BASE_URL}/biodata`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire("Sukses!", "Biodata berhasil dikirim", "success");
      navigate("/user/jenis-tes");
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengirim biodata: ${error.response?.data?.message || "Terjadi kesalahan"
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <CoverLayout
      image={backgroundImage}
      color="white"
    >
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

        {/* Title */}
        <SoftTypography variant="h4" fontWeight="bold" color="info" gutterBottom>
          Biodata Peserta
        </SoftTypography>
        <SoftTypography variant="body2" color="text" mb={4}>
          Lengkapi data diri Anda untuk melanjutkan
        </SoftTypography>

        {/* Form Biodata */}
        <SoftBox component="form" role="form" onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <SoftBox mb={3} textAlign="left">
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              color="text"
              display="block"
              mb={1}
            >
              Nama Lengkap
            </SoftTypography>
            <SoftInput
              type="text"
              placeholder="Masukkan nama lengkap anda"
              value={nama_lengkap}
              onChange={(e) => setNamaLengkap(e.target.value)}
              required
              fullWidth
            />
          </SoftBox>

          {/* Pangkat dengan Material-UI Select */}
          <SoftBox mb={3} textAlign="left">
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              color="text"
              display="block"
              mb={1}
            >
              Pangkat
            </SoftTypography>
            <FormControl fullWidth required size="small">
              <Select
                value={pangkat}
                onChange={(e) => setPangkat(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: "8px",
                  bgcolor: "#f8f9fa",
                  height: "44px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e9ecef",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cb0c9f",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#cb0c9f",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <em>Pilih pangkat</em>
                </MenuItem>
                {listPangkat.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nama_pangkat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </SoftBox>

          {/* NRP */}
          <SoftBox mb={3} textAlign="left">
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              color="text"
              display="block"
              mb={1}
            >
              NRP
            </SoftTypography>
            <SoftInput
              type="text"
              placeholder="Masukkan NRP anda"
              value={nrp}
              onChange={(e) => {
                const newValue = e.target.value.replace(/\D/g, "");
                setNrp(newValue);
              }}
              required
              fullWidth
            />
          </SoftBox>

          {/* Jabatan */}
          <SoftBox mb={3} textAlign="left">
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              color="text"
              display="block"
              mb={1}
            >
              Jabatan
            </SoftTypography>
            <SoftInput
              type="text"
              placeholder="Masukkan jabatan anda"
              value={jabatan}
              onChange={(e) => setJabatan(e.target.value.toUpperCase())}
              required
              fullWidth
            />
          </SoftBox>

          {/* Kesatuan (Read Only) */}
          <SoftBox mb={3} textAlign="left">
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              color="text"
              display="block"
              mb={1}
            >
              Kesatuan
            </SoftTypography>
            <SoftInput
              type="text"
              value={kesatuan}
              disabled
              fullWidth
              sx={{ bgcolor: "#f5f5f5" }}
            />
          </SoftBox>

          {/* Alamat */}
          <SoftBox mb={4} textAlign="left">
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              color="text"
              display="block"
              mb={1}
            >
              Alamat
            </SoftTypography>
            <SoftInput
              multiline
              rows={3}
              placeholder="Masukkan alamat anda"
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              required
              fullWidth
              sx={{
                "& .MuiInputBase-root": {
                  padding: "10px 14px",
                },
              }}
            />
          </SoftBox>

          {/* Submit Button */}
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
              "Submit"
            )}
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </CoverLayout>
  );
}

export default Biodata;