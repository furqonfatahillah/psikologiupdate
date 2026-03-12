import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

// Icons
import {
  Warning,
  Info,
  Lock,
  ScreenshotMonitor,
  Tab,
  Logout,
  ArrowForward,
  CheckCircle,
  Gavel,
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

const InstruksiTes = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [instruksiTes, setInstruksiTes] = useState("");
  const kategoriId = parseInt(sessionStorage.getItem("kategoriId"), 10);

  // Hook untuk responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Fungsi untuk mengambil instruksi tes dari API
  const getInstruksi = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/kategori-tes`);

      if (response.data && response.data.data.length > 0) {
        const kategoriTerpilih = response.data.data.find(kategori => kategori.id === kategoriId);
        
        if (kategoriTerpilih) {
          setInstruksiTes(kategoriTerpilih.instruksi_tes);
        } else {
          setInstruksiTes(null);
        }
      } else {
        setInstruksiTes(null);
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Terjadi kesalahan: ${
          error.response?.data?.message || "Silakan coba lagi nanti."
        }`,
        "error"
      );
    }
  };

  // Panggil getInstruksi saat komponen dimuat pertama kali
  useEffect(() => {
    getInstruksi();
  }, []);

  const handleMulai = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const userTestSessionId = localStorage.getItem("userTestSessionId");
      const sessionId = userTestSessionId;

      const response = await axios.put(
        `${BASE_URL}/test-session/${sessionId}/start`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        navigate(`/Ujian`);
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Terjadi kesalahan: ${
          error.response?.data?.message || "Silakan coba lagi nanti."
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <SoftBox mt={{ xs: 2, sm: 3, md: 4 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={11} lg={10} xl={8}>
              {/* Header Card */}
              <Card>
                <SoftBox p={{ xs: 2, sm: 3 }}>
                  <SoftTypography 
                    variant={isMobile ? "h3" : "h2"} 
                    fontWeight="bold" 
                    color="info" 
                    textGradient
                    textAlign="center"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" } }}
                  >
                    Selamat Datang di Ujian Ini
                  </SoftTypography>
                  
                  <SoftTypography 
                    variant="body1" 
                    color="text" 
                    textAlign="center"
                    sx={{ 
                      maxWidth: "600px", 
                      mx: "auto", 
                      mb: { xs: 3, sm: 4 },
                      fontSize: { xs: "0.9rem", sm: "1rem" }
                    }}
                  >
                    Sebelum memulai, pastikan Anda telah membaca seluruh instruksi
                    dengan baik. Kerjakan setiap soal dengan teliti dan sesuai dengan
                    kemampuan Anda. Pastikan untuk mengakhiri sebelum waktu habis.
                  </SoftTypography>

                  {/* Warning Alert */}
                  <Alert 
                    severity="warning" 
                    sx={{ 
                      mb: { xs: 3, sm: 4 },
                      borderRadius: "10px",
                      "& .MuiAlert-icon": {
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                      },
                    }}
                  >
                    <AlertTitle sx={{ 
                      fontWeight: "bold", 
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      display: "flex",
                      alignItems: "center",
                    }}>
                      <Warning sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} />
                      PERINGATAN PENTING
                    </AlertTitle>
                    
                    <List sx={{ p: 0 }}>
                      {/* One-way Test */}
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: { xs: "36px", sm: "40px" } }}>
                          <Lock color="error" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <SoftTypography 
                              variant="body2" 
                              fontWeight="bold" 
                              color="error"
                              sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                            >
                              Tes ini bersifat one-way (satu arah)
                            </SoftTypography>
                          }
                          secondary={
                            <SoftTypography 
                              variant="caption" 
                              color="text"
                              sx={{ 
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                display: "block",
                                mt: 0.5
                              }}
                            >
                              Anda tidak dapat mengulang atau kembali ke soal sebelumnya 
                              setelah melanjutkan ke soal berikutnya. Pastikan untuk
                              memeriksa jawaban Anda sebelum berpindah soal.
                            </SoftTypography>
                          }
                        />
                      </ListItem>

                      <Divider component="li" />

                      {/* No Cheating */}
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: { xs: "36px", sm: "40px" } }}>
                          <Gavel color="error" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <SoftTypography 
                              variant="body2" 
                              fontWeight="bold" 
                              color="error"
                              sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                            >
                              Dilarang keras melakukan kecurangan selama ujian berlangsung
                            </SoftTypography>
                          }
                          secondary={
                            <SoftTypography 
                              variant="caption" 
                              color="text"
                              sx={{ 
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                                display: "block",
                                mt: 0.5
                              }}
                            >
                              Jika sistem mendeteksi aktivitas mencurigakan seperti{" "}
                              <strong>screenshoot, screen recording, atau berpindah tab/browser</strong>
                              , ujian akan <strong>otomatis berakhir</strong> dan Anda
                              akan <strong>terlogout</strong> dari sistem.
                            </SoftTypography>
                          }
                        />
                      </ListItem>

                      <Divider component="li" />

                      {/* Petunjuk Pengerjaan */}
                      <ListItem alignItems="flex-start" sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: { xs: "36px", sm: "40px" } }}>
                          <Info color="info" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <SoftTypography 
                              variant="body2" 
                              fontWeight="bold" 
                              color="info"
                              sx={{ fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
                            >
                              Petunjuk Pengerjaan Soal
                            </SoftTypography>
                          }
                          secondary={
                            <SoftBox 
                              mt={1}
                              sx={{
                                "& p": { 
                                  margin: "0.5rem 0",
                                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                                  color: "text.secondary",
                                },
                                "& ul, & ol": {
                                  paddingLeft: { xs: "1.2rem", sm: "1.5rem" },
                                },
                                "& li": {
                                  fontSize: { xs: "0.7rem", sm: "0.875rem" },
                                  color: "text.secondary",
                                },
                              }}
                            >
                              <div dangerouslySetInnerHTML={{ __html: instruksiTes }} />
                            </SoftBox>
                          }
                        />
                      </ListItem>
                    </List>
                  </Alert>

                  {/* Additional Info */}
                  <SoftBox 
                    bgColor="#f8f9fa" 
                    borderRadius="lg" 
                    p={{ xs: 1.5, sm: 2 }} 
                    mb={{ xs: 3, sm: 4 }}
                    display="flex"
                    alignItems="center"
                    gap={2}
                    sx={{ flexDirection: { xs: "column", sm: "row" } }}
                  >
                    <CheckCircle color="success" sx={{ fontSize: { xs: 24, sm: 28 } }} />
                    <SoftTypography 
                      variant="body2" 
                      color="text"
                      sx={{ 
                        fontSize: { xs: "0.85rem", sm: "1rem" },
                        textAlign: { xs: "center", sm: "left" }
                      }}
                    >
                      Harap patuhi aturan ini untuk menjaga integritas ujian. 
                      Selamat mengerjakan dan semoga sukses!
                    </SoftTypography>
                  </SoftBox>

                  {/* Action Button */}
                  <SoftBox display="flex" justifyContent={{ xs: "center", sm: "flex-end" }}>
                    <SoftButton
                      variant="gradient"
                      color="success"
                      size={isMobile ? "medium" : "large"}
                      onClick={handleMulai}
                      disabled={loading}
                      endIcon={<ArrowForward />}
                      fullWidth={isMobile}
                      sx={{ 
                        minWidth: { xs: "100%", sm: "200px" },
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                        py: { xs: 1.2, sm: 1.5 }
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
                          Memulai...
                        </SoftBox>
                      ) : (
                        "Mulai Ujian"
                      )}
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </Container>

      <Footer />
    </DashboardLayout>
  );
};

export default InstruksiTes;