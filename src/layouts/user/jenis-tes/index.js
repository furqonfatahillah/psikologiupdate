import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Icons
import {
  Psychology,
  History,
  ArrowForward,
  CheckCircle,
  Timer,
} from "@mui/icons-material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import BASE_URL from "../../../config/BASE_URL";

const JenisTes = () => {
  const [listKategori, setListKategori] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Hook untuk responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Fetch data kategori tes saat komponen di-mount
  useEffect(() => {
    fetchKategori();
    fetchTestResults();
  }, []);

  const fetchKategori = async () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/kategori-tes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListKategori(response.data.data);
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengambil data kategori: ${
          error.response?.data?.message || "Terjadi kesalahan"
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResults = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    try {
      const response = await axios.get(`${BASE_URL}/hasil-tes/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestResults(response.data.data);
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengambil data hasil tes: ${
          error.response?.data?.message || "Terjadi kesalahan"
        }`,
        "error"
      );
    }
  };

  // Fungsi untuk navigasi ke halaman tes
  const handleNavigateToTes = (kategoriId, kategoriName) => {
    sessionStorage.setItem("kategoriId", kategoriId);
    sessionStorage.setItem("kategoriName", kategoriName);
    navigate(`/jenis-pengajuan`);
  };

  // Filter kategori yang sudah diambil
  const filteredKategori = useMemo(() => {
    const takenCategories = testResults.map((test) => test.kategoriTes);
    const filtered = listKategori.filter(
      (item) => !takenCategories.includes(item.nama_kategori_tes)
    );
    return filtered;
  }, [listKategori, testResults]);

  // Kategori yang sudah diambil
  const completedKategori = useMemo(() => {
    return listKategori.filter((item) =>
      testResults.some((test) => test.kategoriTes === item.nama_kategori_tes)
    );
  }, [listKategori, testResults]);

  // Fungsi untuk menentukan ukuran grid berdasarkan device
  const getGridSize = () => {
    if (isMobile) return 12; // 1 kolom di mobile
    if (isTablet) return 6;  // 2 kolom di tablet
    return 4;                 // 3 kolom di desktop
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <SoftBox mt={{ xs: 2, sm: 3, md: 4 }}>
          {/* Header Section */}
          <SoftBox mb={{ xs: 3, sm: 4 }}>
            <SoftTypography 
              variant={isMobile ? "h4" : "h3"} 
              fontWeight="bold" 
              color="info" 
              gutterBottom
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" } }}
            >
              Pilih Jenis Tes
            </SoftTypography>
            <SoftTypography variant="body2" color="text">
              Pilih jenis tes yang ingin Anda kerjakan
            </SoftTypography>
          </SoftBox>

          {/* Tes Tersedia Section */}
          <SoftBox mb={4}>
            <SoftTypography 
              variant={isMobile ? "h6" : "h5"} 
              fontWeight="medium" 
              color="info" 
              mb={3}
            >
              Tes Tersedia
            </SoftTypography>
            
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {filteredKategori.length > 0 ? (
                filteredKategori.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={getGridSize()} key={item.id}>
                    <SoftBox
                      height="100%"
                      onClick={() => handleNavigateToTes(item.id, item.nama_kategori_tes)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Card
                        sx={{
                          height: "100%",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-5px)",
                            boxShadow: "0 10px 30px rgba(37, 117, 252, 0.2)",
                          },
                        }}
                      >
                        <SoftBox p={{ xs: 2, sm: 3 }}>
                          <SoftBox
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            mb={2}
                          >
                            <SoftBox
                              width={{ xs: "40px", sm: "50px" }}
                              height={{ xs: "40px", sm: "50px" }}
                              borderRadius="lg"
                              bgColor="info"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                              }}
                            >
                              <Psychology sx={{ color: "white", fontSize: { xs: 20, sm: 28 } }} />
                            </SoftBox>
                            <SoftTypography 
                              variant="caption" 
                              color="info" 
                              fontWeight="medium"
                              sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                            >
                              Tersedia
                            </SoftTypography>
                          </SoftBox>

                          <SoftTypography 
                            variant={isMobile ? "body1" : "h5"} 
                            fontWeight="bold" 
                            mb={1}
                            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                          >
                            {item.nama_kategori_tes}
                          </SoftTypography>
                          
                          <SoftTypography 
                            variant="body2" 
                            color="text" 
                            mb={2}
                            sx={{ 
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {item.deskripsi || "Tes psikologi untuk mengukur kemampuan Anda"}
                          </SoftTypography>

                          <SoftBox display="flex" alignItems="center" justifyContent="space-between">
                            <SoftBox display="flex" alignItems="center">
                              <Timer sx={{ fontSize: { xs: 14, sm: 16 }, color: "#6c757d", mr: 0.5 }} />
                              <SoftTypography variant="caption" color="text" sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}>
                                {item.durasi || "60"} menit
                              </SoftTypography>
                            </SoftBox>
                            <ArrowForward sx={{ color: "#2575fc", fontSize: { xs: 18, sm: 24 } }} />
                          </SoftBox>
                        </SoftBox>
                      </Card>
                    </SoftBox>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <SoftBox textAlign="center" py={{ xs: 3, sm: 5 }}>
                    <SoftTypography variant="h6" color="text" gutterBottom>
                      {loading ? "Memuat data..." : "Tidak ada tes tersedia"}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              )}
            </Grid>
          </SoftBox>

          {/* Tes Selesai Section */}
          {completedKategori.length > 0 && (
            <SoftBox mb={4}>
              <SoftTypography 
                variant={isMobile ? "h6" : "h5"} 
                fontWeight="medium" 
                color="success" 
                mb={3}
              >
                Tes yang Telah Diselesaikan
              </SoftTypography>
              
              <Grid container spacing={{ xs: 2, sm: 3 }}>
                {completedKategori.map((item) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={getGridSize()} key={item.id}>
                    <Card sx={{ opacity: 0.8, backgroundColor: "#f8f9fa" }}>
                      <SoftBox p={{ xs: 2, sm: 3 }}>
                        <SoftBox
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <SoftBox
                            width={{ xs: "40px", sm: "50px" }}
                            height={{ xs: "40px", sm: "50px" }}
                            borderRadius="lg"
                            bgColor="success"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <CheckCircle sx={{ color: "white", fontSize: { xs: 20, sm: 28 } }} />
                          </SoftBox>
                          <SoftTypography 
                            variant="caption" 
                            color="success" 
                            fontWeight="medium"
                            sx={{ fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                          >
                            Selesai
                          </SoftTypography>
                        </SoftBox>

                        <SoftTypography 
                          variant={isMobile ? "body1" : "h5"} 
                          fontWeight="bold" 
                          mb={1}
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        >
                          {item.nama_kategori_tes}
                        </SoftTypography>
                        
                        <SoftTypography 
                          variant="body2" 
                          color="text"
                          sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                        >
                          Tes telah Anda selesaikan
                        </SoftTypography>
                      </SoftBox>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </SoftBox>
          )}

          {/* Riwayat Tes Button */}
          <SoftBox mt={{ xs: 3, sm: 4 }} display="flex" justifyContent="center">
            <SoftButton
              variant="gradient"
              color="info"
              size={isMobile ? "medium" : "large"}
              onClick={() => navigate("/riwayat-tes")}
              startIcon={<History />}
              sx={{
                minWidth: { xs: "200px", sm: "250px" },
                width: { xs: "100%", sm: "auto" },
                py: { xs: 1.2, sm: 1.5 },
                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                transition: "all 0.3s ease",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 7px 20px rgba(106, 17, 203, 0.4)",
                },
              }}
            >
              Lihat Riwayat Tes
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </Container>

      <Footer />
    </DashboardLayout>
  );
};

export default JenisTes;