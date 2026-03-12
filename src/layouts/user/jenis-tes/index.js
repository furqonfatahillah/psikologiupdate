import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Icons
import {
  Psychology,
  History,
  ArrowForward,
  CheckCircle,
  Lock,
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

import BASE_URL from "../../config/BASE_URL";

const JenisTes = () => {
  const [listKategori, setListKategori] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <SoftBox mt={4}>
        {/* Header Section */}
        <SoftBox mb={4}>
          <SoftTypography variant="h3" fontWeight="bold" color="info" gutterBottom>
            Pilih Jenis Tes
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            Pilih jenis tes yang ingin Anda kerjakan
          </SoftTypography>
        </SoftBox>

        {/* Tes Tersedia Section */}
        <SoftBox mb={4}>
          <SoftTypography variant="h5" fontWeight="medium" color="info" mb={3}>
            Tes Tersedia
          </SoftTypography>
          
          <Grid container spacing={3}>
            {filteredKategori.length > 0 ? (
              filteredKategori.map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
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
                      <SoftBox p={3}>
                        <SoftBox
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <SoftBox
                            width="50px"
                            height="50px"
                            borderRadius="lg"
                            bgColor="info"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            sx={{
                              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                            }}
                          >
                            <Psychology sx={{ color: "white", fontSize: 28 }} />
                          </SoftBox>
                          <SoftTypography variant="caption" color="info" fontWeight="medium">
                            Tersedia
                          </SoftTypography>
                        </SoftBox>

                        <SoftTypography variant="h5" fontWeight="bold" mb={1}>
                          {item.nama_kategori_tes}
                        </SoftTypography>
                        
                        <SoftTypography variant="body2" color="text" mb={2}>
                          {item.deskripsi || "Tes psikologi untuk mengukur kemampuan Anda"}
                        </SoftTypography>

                        <SoftBox display="flex" alignItems="center" justifyContent="space-between">
                          <SoftBox display="flex" alignItems="center">
                            <Timer sx={{ fontSize: 16, color: "#6c757d", mr: 0.5 }} />
                            <SoftTypography variant="caption" color="text">
                              {item.durasi || "60"} menit
                            </SoftTypography>
                          </SoftBox>
                          <ArrowForward sx={{ color: "#2575fc" }} />
                        </SoftBox>
                      </SoftBox>
                    </Card>
                  </SoftBox>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <SoftBox textAlign="center" py={5}>
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
            <SoftTypography variant="h5" fontWeight="medium" color="success" mb={3}>
              Tes yang Telah Diselesaikan
            </SoftTypography>
            
            <Grid container spacing={3}>
              {completedKategori.map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item.id}>
                  <Card sx={{ opacity: 0.8, backgroundColor: "#f8f9fa" }}>
                    <SoftBox p={3}>
                      <SoftBox
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                      >
                        <SoftBox
                          width="50px"
                          height="50px"
                          borderRadius="lg"
                          bgColor="success"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <CheckCircle sx={{ color: "white", fontSize: 28 }} />
                        </SoftBox>
                        <SoftTypography variant="caption" color="success" fontWeight="medium">
                          Selesai
                        </SoftTypography>
                      </SoftBox>

                      <SoftTypography variant="h5" fontWeight="bold" mb={1}>
                        {item.nama_kategori_tes}
                      </SoftTypography>
                      
                      <SoftTypography variant="body2" color="text">
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
        <SoftBox mt={4} display="flex" justifyContent="center">
          <SoftButton
            variant="gradient"
            color="info"
            size="large"
            onClick={() => navigate("/riwayat-tes")}
            startIcon={<History />}
            sx={{
              minWidth: "250px",
              py: 1.5,
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              transition: "all 0.3s ease",
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

      <Footer />
    </DashboardLayout>
  );
};

export default JenisTes;