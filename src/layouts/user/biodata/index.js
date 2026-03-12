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
import InputAdornment from "@mui/material/InputAdornment";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

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

  // Hook untuk responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

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
            navigate("/jenis-tes");
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
      navigate("/jenis-tes");
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
    <CoverLayout image={backgroundImage}>
      <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
        <SoftBox 
          bgColor="white" 
          borderRadius="lg" 
          shadow="lg" 
          p={{ xs: 2, sm: 3, md: 4 }}
        >
          <SoftBox textAlign="center">
            {/* Logo Header */}
            <SoftBox 
              display="flex" 
              justifyContent="center" 
              mb={{ xs: 3, sm: 4 }} 
              gap={{ xs: 2, sm: 3 }}
            >
              <SoftBox
                component="img"
                src={PoldaLogo}
                alt="Polda Logo"
                width={{ xs: "45px", sm: "55px" }}
                height={{ xs: "45px", sm: "55px" }}
                sx={{ objectFit: "contain" }}
              />
              <SoftBox
                component="img"
                src={SDMLogo}
                alt="SDM Logo"
                width={{ xs: "45px", sm: "55px" }}
                height={{ xs: "45px", sm: "55px" }}
                sx={{ objectFit: "contain" }}
              />
              <SoftBox
                component="img"
                src={PsikologiLogo}
                alt="Psikologi Logo"
                width={{ xs: "55px", sm: "65px" }}
                height={{ xs: "45px", sm: "55px" }}
                sx={{ objectFit: "contain" }}
              />
            </SoftBox>

            {/* Title */}
            <SoftTypography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold" 
              color="info" 
              gutterBottom
            >
              Biodata Peserta
            </SoftTypography>
            <SoftTypography 
              variant="body2" 
              color="text" 
              mb={{ xs: 3, sm: 4 }}
              sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
            >
              Lengkapi data diri Anda untuk melanjutkan
            </SoftTypography>

            {/* Form Biodata */}
            <SoftBox component="form" role="form" onSubmit={handleSubmit}>
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {/* Nama Lengkap */}
                <Grid item xs={12}>
                  <SoftBox textAlign="left">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={0.5}
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
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
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        },
                      }}
                    />
                  </SoftBox>
                </Grid>

                {/* Pangkat dengan Material-UI Select */}
                <Grid item xs={12} md={6}>
                  <SoftBox textAlign="left">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={0.5}
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                    >
                      Pangkat
                    </SoftTypography>
                    <FormControl fullWidth required size={isMobile ? "small" : "medium"}>
                      <Select
                        value={pangkat}
                        onChange={(e) => setPangkat(e.target.value)}
                        displayEmpty
                        sx={{
                          borderRadius: "8px",
                          bgcolor: "#f8f9fa",
                          height: isMobile ? "40px" : "44px",
                          fontSize: { xs: "0.9rem", sm: "1rem" },
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
                </Grid>

                {/* NRP */}
                <Grid item xs={12} md={6}>
                  <SoftBox textAlign="left">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={0.5}
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
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
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        },
                      }}
                    />
                  </SoftBox>
                </Grid>

                {/* Jabatan */}
                <Grid item xs={12} md={6}>
                  <SoftBox textAlign="left">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={0.5}
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
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
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        },
                      }}
                    />
                  </SoftBox>
                </Grid>

                {/* Kesatuan (Read Only) */}
                <Grid item xs={12} md={6}>
                  <SoftBox textAlign="left">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={0.5}
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                    >
                      Kesatuan
                    </SoftTypography>
                    <SoftInput
                      type="text"
                      value={kesatuan}
                      disabled
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        bgcolor: "#f5f5f5",
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        },
                      }}
                    />
                  </SoftBox>
                </Grid>

                {/* Alamat */}
                <Grid item xs={12}>
                  <SoftBox textAlign="left">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={0.5}
                      sx={{ fontSize: { xs: "0.7rem", sm: "0.75rem" } }}
                    >
                      Alamat
                    </SoftTypography>
                    <SoftInput
                      multiline
                      rows={isMobile ? 2 : 3}
                      placeholder="Masukkan alamat anda"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                      required
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      sx={{
                        "& .MuiInputBase-root": {
                          padding: "10px 14px",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        },
                      }}
                    />
                  </SoftBox>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <SoftButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    fullWidth
                    disabled={loading}
                    size={isMobile ? "medium" : "large"}
                    sx={{
                      py: { xs: 1.2, sm: 1.5 },
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    {loading ? (
                      <SoftBox display="flex" alignItems="center" justifyContent="center">
                        <SoftBox
                          component="span"
                          sx={{
                            width: { xs: 16, sm: 20 },
                            height: { xs: 16, sm: 20 },
                            borderRadius: "50%",
                            border: "2px solid",
                            borderColor: "white",
                            borderTopColor: "transparent",
                            animation: "spin 1s linear infinite",
                            mr: 1,
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
                </Grid>
              </Grid>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Container>
    </CoverLayout>
  );
}

export default Biodata;