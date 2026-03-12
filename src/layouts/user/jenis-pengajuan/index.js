import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

// Icons
import {
  Numbers,
  ListAlt,
  Send,
  Verified,
  Refresh,
} from "@mui/icons-material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import BASE_URL from "../../config/BASE_URL";

const JenisPengajuan = () => {
  const navigate = useNavigate();
  const [pengajuan, setPengajuan] = useState("");
  const [nomorTes, setNomorTes] = useState("");
  const [loading, setLoading] = useState(false);

  const kategoriId = sessionStorage.getItem("kategoriId");
  const lastSoalIndex = sessionStorage.getItem("lastSoalIndex");
  const userTestSessionId = localStorage.getItem("userTestSessionId");
  const token = sessionStorage.getItem("token");
  
  if (!token) {
    Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
    navigate("/login");
    return null;
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const timeLeft = localStorage.getItem(`timeLeft_${userId}_${kategoriId}`);
  const currentSoalIndex = localStorage.getItem(
    `currentSoalIndex_${userId}_${kategoriId}`
  );
  const jawabanEssay = localStorage.getItem(
    `jawabanEssay_${userId}_${kategoriId}`
  );

  useEffect(() => {
    const checkAndNavigate = () => {
      if (
        timeLeft != null ||
        currentSoalIndex != null ||
        jawabanEssay != null
      ) {
        navigate("/Ujian");
      }
    };

    checkAndNavigate();
  }, [timeLeft, currentSoalIndex, jawabanEssay, navigate]);

  const handleNomorTes = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/test-session`,
        {
          kategoriTesId: parseInt(kategoriId, 10),
          noTes: nomorTes,
          jenisPengajuan: pengajuan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Sukses!",
          text: "Data berhasil dikirim!",
          confirmButtonColor: "#cb0c9f",
        });
        
        const newUserTestSessionId = response.data.data.id;
        localStorage.setItem("userTestSessionId", newUserTestSessionId);
        navigate("/instruksi-tes");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: error.response?.data?.message || "Silakan coba lagi nanti.",
        confirmButtonColor: "#cb0c9f",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <SoftBox mt={4}>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} lg={6}>
            <Card>
              {/* Header dengan gradient */}
              <SoftBox
                variant="gradient"
                bgColor="info"
                borderRadius="xl"
                p={3}
                mb={2}
                sx={{
                  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                }}
              >
                <SoftTypography variant="h3" fontWeight="bold" color="white" textAlign="center">
                  Formulir Pengajuan Tes
                </SoftTypography>
                <SoftTypography variant="body2" color="white" textAlign="center" opacity={0.9}>
                  Lengkapi data berikut untuk memulai tes
                </SoftTypography>
              </SoftBox>

              <SoftBox p={3}>
                <SoftBox component="form" role="form" onSubmit={handleNomorTes}>
                  {/* Nomor Tes Field */}
                  <SoftBox mb={3}>
                    <SoftTypography
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={1}
                    >
                      No Tes
                    </SoftTypography>
                    <SoftInput
                      type="text"
                      placeholder="Contoh: 0001"
                      value={nomorTes}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 4) {
                          setNomorTes(value);
                        }
                      }}
                      onPaste={(e) => e.preventDefault()}
                      onKeyDown={(e) => {
                        if (
                          !/^\d$/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          e.key !== "Tab" &&
                          e.key !== "Enter"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      required
                      fullWidth
                      startAdornment={
                        <InputAdornment position="start">
                          <Numbers sx={{ color: "#cb0c9f" }} />
                        </InputAdornment>
                      }
                    />
                    <SoftTypography variant="caption" color="text" display="block" mt={1}>
                      Masukkan 4 digit angka
                    </SoftTypography>
                  </SoftBox>

                  {/* Jenis Pengajuan Field */}
                  <SoftBox mb={4}>
                    <SoftTypography
                      variant="caption"
                      fontWeight="bold"
                      color="text"
                      display="block"
                      mb={1}
                    >
                      Jenis Pengajuan
                    </SoftTypography>
                    <FormControl fullWidth required>
                      <Select
                        value={pengajuan}
                        onChange={(e) => setPengajuan(e.target.value)}
                        displayEmpty
                        sx={{
                          height: "44px",
                          borderRadius: "8px",
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
                        startAdornment={
                          <InputAdornment position="start">
                            <ListAlt sx={{ color: "#cb0c9f", mr: 1 }} />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="" disabled>
                          <em>-- Pilih Jenis Pengajuan --</em>
                        </MenuItem>
                        <MenuItem value="PERMOHONAN BARU">PERMOHONAN BARU</MenuItem>
                        <MenuItem value="PERMOHONAN PERPANJANGAN">
                          PERMOHONAN PERPANJANGAN
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </SoftBox>

                  {/* Submit Button */}
                  <SoftBox display="flex" justifyContent="flex-end">
                    <SoftButton
                      type="submit"
                      variant="gradient"
                      color="info"
                      disabled={loading}
                      size="large"
                      endIcon={loading ? <Refresh /> : <Send />}
                      sx={{
                        minWidth: "180px",
                        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 7px 20px rgba(106, 17, 203, 0.4)",
                        },
                      }}
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
                        "Submit Pengajuan"
                      )}
                    </SoftButton>
                  </SoftBox>

                  {/* Info Tambahan */}
                  <SoftBox mt={3} textAlign="center">
                    <SoftTypography variant="caption" color="text" display="flex" alignItems="center" justifyContent="center">
                      <Verified sx={{ fontSize: "16px", mr: 0.5, color: "#4caf50" }} />
                      Pastikan data yang Anda masukkan sudah benar
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
};

export default JenisPengajuan;