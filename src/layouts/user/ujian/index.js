import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import disableDevtool from "disable-devtool";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import "./security.css"

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import Fab from "@mui/material/Fab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

// Icons
import {
  Timer,
  Warning,
  Lock,
  CheckCircle,
  RadioButtonUnchecked,
  ArrowForward,
  Check,
  Assignment,
  Image,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import SoftBadge from "components/SoftBadge";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";

import BASE_URL from "../../../config/BASE_URL";
import BASE_URL_NO_API from "../../../config/BASE_URL_NOT_API";


const Ujian = () => {
  const [isProtected, setIsProtected] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listSoal, setListSoal] = useState([]);
  
  // Hook untuk responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const kategoriId = sessionStorage.getItem("kategoriId");
  const token = localStorage.getItem("tokenLocal");
  
  // Deklarasikan userId setelah token dan sebelum useState yang menggunakannya
  let userId = null;
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      userId = decodedToken.id;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const sessionTestId = localStorage.getItem("userTestSessionId");
  
  const [currentSoalIndex, setCurrentSoalIndex] = useState(() => {
    if (!userId || !kategoriId) return 0;
    const savedIndex = localStorage.getItem(
      `currentSoalIndex_${userId}_${kategoriId}`
    );
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  // State untuk menyimpan jawaban pilihan ganda
  const [jawabanPilihanGanda, setJawabanPilihanGanda] = useState(() => {
    if (!userId || !kategoriId) return {};
    const savedAnswers = localStorage.getItem(
      `jawabanPilihanGanda_${userId}_${kategoriId}`
    );
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [jawabanEssay, setJawabanEssay] = useState(() => {
    if (!userId || !kategoriId) return {};
    const savedAnswers = localStorage.getItem(
      `jawabanEssay_${userId}_${kategoriId}`
    );
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    if (!userId || !kategoriId) return null;
    const savedTime = localStorage.getItem(`timeLeft_${userId}_${kategoriId}`);
    return savedTime ? parseInt(savedTime, 10) : null;
  });

  // Toggle drawer untuk mobile
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Prevent back button
  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Anda tidak dapat kembali sebelum menyelesaikan ujian!",
        confirmButtonText: "OK",
        confirmButtonColor: "#cb0c9f",
      });
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  // Cheating prevention
  useEffect(() => {
    disableDevtool();
    preventCheating();
  }, []);

  useEffect(() => {
    if (violationCount >= 3 && !hasLoggedOut) {
      setHasLoggedOut(true);
      Swal.fire({
        icon: "error",
        title: "Pelanggaran",
        text: "Anda telah dikeluarkan dari ujian karena pelanggaran!",
        confirmButtonText: "OK",
        confirmButtonColor: "#cb0c9f",
      }).then(() => {
        sessionStorage.removeItem("token");
        navigate("/login");
      });
    }
  }, [violationCount, hasLoggedOut, navigate]);

  const preventCheating = () => {
    const handleViolationEvent = () => handleViolation();

    document.addEventListener("keyup", (e) => {
      if (e.key === "PrintScreen") {
        handleViolationEvent();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        handleViolationEvent();
      }
    });

    document.addEventListener("touchstart", (e) => {
      if (e.touches.length > 2) {
        handleViolationEvent();
      }
    });

    window.addEventListener("blur", handleViolationEvent);

    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    return () => {
      document.removeEventListener("keyup", handleViolationEvent);
      document.removeEventListener("visibilitychange", handleViolationEvent);
      document.removeEventListener("touchstart", handleViolationEvent);
      window.removeEventListener("blur", handleViolationEvent);
      document.removeEventListener("contextmenu", handleViolationEvent);
    };
  };

  const handleViolation = () => {
    setIsProtected(true);
    setViolationCount((prevCount) => {
      setTimeout(() => setIsProtected(false), 1000);
      return prevCount + 1;
    });
  };

  // Fetch soal
  useEffect(() => {
    if (kategoriId) {
      fetchSoal();
    } else {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Kategori ID tidak ditemukan",
        confirmButtonColor: "#cb0c9f",
      }).then(() => {
        navigate("/jenis-tes");
      });
    }
  }, [kategoriId, navigate]);

  const fetchSoal = async () => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Token tidak ditemukan",
        confirmButtonColor: "#cb0c9f",
      }).then(() => {
        navigate("/login");
      });
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/soal/kategori/${kategoriId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const responseWaktu = await axios.get(
        `${BASE_URL}/kategori-tes/${kategoriId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data && response.data.data.length > 0) {
        setListSoal(response.data.data);
        setLoading(false);

        const waktuPengerjaanStr = responseWaktu.data.data.waktu_pengerjaan;
        if (typeof waktuPengerjaanStr === "string") {
          const [hh, mm, ss] = waktuPengerjaanStr.split(":").map(Number);
          const waktuPengerjaan = hh * 60 + mm;

          if (!isNaN(waktuPengerjaan)) {
            const totalSeconds = waktuPengerjaan * 60;
            if (timeLeft === null) {
              setTimeLeft(totalSeconds);
              if (userId && kategoriId) {
                localStorage.setItem(
                  `timeLeft_${userId}_${kategoriId}`,
                  totalSeconds
                );
              }
            }
          } else {
            console.error("Format waktu tidak valid:", waktuPengerjaanStr);
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: "Format waktu pengerjaan tidak valid",
              confirmButtonColor: "#cb0c9f",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: "Format waktu pengerjaan tidak valid",
            confirmButtonColor: "#cb0c9f",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Tidak ada soal tersedia",
          confirmButtonColor: "#cb0c9f",
        }).then(() => {
          navigate("/jenis-tes");
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching soal:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal mengambil data soal",
        confirmButtonColor: "#cb0c9f",
      });
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    let timer;
    if (timeLeft !== null) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            finishTestSession();
            if (userId && kategoriId) {
              localStorage.removeItem(`timeLeft_${userId}_${kategoriId}`);
            }
          }
          if (userId && kategoriId) {
            localStorage.setItem(
              `timeLeft_${userId}_${kategoriId}`,
              prevTime - 1
            );
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeLeft, sessionTestId, userId, kategoriId]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  const submitJawaban = async (
    soalId,
    pilihanJawabanId = null,
    teksJawaban = null
  ) => {
    if (!token || !sessionTestId) {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Token atau sesi tidak ditemukan",
        confirmButtonColor: "#cb0c9f",
      });
      return;
    }

    const payload = {
      userTestSessionId: parseInt(sessionTestId),
      soalId: soalId,
      ...(pilihanJawabanId
        ? { pilihanJawabanId }
        : { teks_jawaban: teksJawaban }),
    };

    try {
      await axios.post(`${BASE_URL}/test-answer`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error submitting jawaban:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan jawaban",
        text: "Terjadi kesalahan",
        confirmButtonColor: "#cb0c9f",
      });
    }
  };

  const handlePilihJawaban = (soalId, pilihanJawabanId) => {
    // Simpan jawaban pilihan ganda ke state
    setJawabanPilihanGanda(prev => {
      const newJawaban = {
        ...prev,
        [soalId]: pilihanJawabanId
      };
      if (userId && kategoriId) {
        localStorage.setItem(
          `jawabanPilihanGanda_${userId}_${kategoriId}`,
          JSON.stringify(newJawaban)
        );
      }
      return newJawaban;
    });
  };

  const handleNextSoal = (
    soalId,
    pilihanJawabanId = null,
    teksJawaban = null
  ) => {
    // Submit jawaban ke server
    submitJawaban(soalId, pilihanJawabanId, teksJawaban);

    const nextIndex = currentSoalIndex + 1;
    if (nextIndex < listSoal.length) {
      setCurrentSoalIndex(nextIndex);
      if (userId && kategoriId) {
        localStorage.setItem(
          `currentSoalIndex_${userId}_${kategoriId}`,
          nextIndex
        );
        localStorage.setItem(
          `jawabanEssay_${userId}_${kategoriId}`,
          JSON.stringify(jawabanEssay)
        );
      }
    } else {
      finishTestSession(soalId, pilihanJawabanId, teksJawaban);
    }
  };

  const finishTestSession = async (
    soalId = null,
    pilihanJawabanId = null,
    teksJawaban = null
  ) => {
    if (soalId) {
      await submitJawaban(soalId, pilihanJawabanId, teksJawaban);
    }

    try {
      await axios.put(
        `${BASE_URL}/test-session/${sessionTestId}/finish`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Selesai!",
        text: "Ujian telah diselesaikan.",
        confirmButtonColor: "#cb0c9f",
      }).then(() => {
        if (userId && kategoriId) {
          localStorage.removeItem(`timeLeft_${userId}_${kategoriId}`);
          localStorage.removeItem(`currentSoalIndex_${userId}_${kategoriId}`);
          localStorage.removeItem(`jawabanEssay_${userId}_${kategoriId}`);
          localStorage.removeItem(`jawabanPilihanGanda_${userId}_${kategoriId}`);
        }
        navigate("/jenis-tes");
      });
    } catch (error) {
      console.error("Error finishing test session:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal menyelesaikan ujian",
        text: "Terjadi kesalahan",
        confirmButtonColor: "#cb0c9f",
      });
    }
  };

  const insertBreakBeforeB = (text) => {
    return (text ?? "").replace(/b\./g, "<br>b.");
  };

  // Cek apakah soal sudah dijawab
  const isSoalTerjawab = (soalId) => {
    return jawabanPilihanGanda[soalId] !== undefined || jawabanEssay[soalId] !== undefined;
  };

  // Hitung jumlah soal terjawab
  const totalTerjawab = listSoal.filter(soal => isSoalTerjawab(soal.id)).length;
  const progress = (totalTerjawab / listSoal.length) * 100 || 0;

  // Komponen Sidebar Soal
  const SoalSidebar = () => (
    <Card sx={{ height: "100%", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
      <SoftBox p={2}>
        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <SoftTypography variant="h6" fontWeight="bold" color="info">
            Daftar Soal
          </SoftTypography>
          {isMobile && (
            <SoftButton variant="text" color="dark" onClick={toggleDrawer} size="small">
              <CloseIcon />
            </SoftButton>
          )}
        </SoftBox>
        
        {/* Progress Bar */}
        <SoftBox mb={2}>
          <SoftTypography variant="caption" color="text" display="block" mb={0.5}>
            Progress: {totalTerjawab}/{listSoal.length} Soal Terjawab
          </SoftTypography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: "#e9ecef",
              "& .MuiLinearProgress-bar": {
                bgcolor: "#4caf50",
              }
            }}
          />
        </SoftBox>

        {/* Grid Nomor Soal */}
        <SoftBox 
          display="flex" 
          flexWrap="wrap" 
          gap={1}
          sx={{ maxHeight: isMobile ? "auto" : "calc(100vh - 300px)", overflowY: "auto", p: 0.5 }}
        >
          {listSoal.map((soal, index) => {
            const isAnswered = isSoalTerjawab(soal.id);
            const isCurrent = index === currentSoalIndex;
            
            return (
              <Tooltip title={`Soal ${index + 1} - ${isAnswered ? 'Terjawab' : 'Belum Dijawab'}`} key={index}>
                <SoftBox
                  width={{ xs: "40px", sm: "50px" }}
                  height={{ xs: "40px", sm: "50px" }}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgColor={isAnswered ? "success" : isCurrent ? "info" : "light"}
                  color={isAnswered || isCurrent ? "white" : "text"}
                  sx={{
                    cursor: "default",
                    fontWeight: "bold",
                    fontSize: { xs: "0.9rem", sm: "1.1rem" },
                    transition: "all 0.2s ease",
                    border: isCurrent ? "2px solid #cb0c9f" : "none",
                    position: "relative",
                    boxShadow: isAnswered ? "0 2px 8px rgba(76, 175, 80, 0.3)" : "none",
                  }}
                >
                  {index + 1}
                  {isAnswered && (
                    <CheckCircleIcon 
                      sx={{ 
                        position: "absolute", 
                        top: -2, 
                        right: -2, 
                        fontSize: 16, 
                        color: "#fff",
                        backgroundColor: "#4caf50",
                        borderRadius: "50%",
                        border: "2px solid white"
                      }} 
                    />
                  )}
                </SoftBox>
              </Tooltip>
            );
          })}
        </SoftBox>

        {/* Alert Pelanggaran */}
        {violationCount > 0 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <AlertTitle>Peringatan</AlertTitle>
            Pelanggaran: {violationCount}/3
          </Alert>
        )}
      </SoftBox>
    </Card>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Container maxWidth="xl">
          <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <SoftTypography variant={isMobile ? "h6" : "h5"} color="text">
              Loading...
            </SoftTypography>
          </SoftBox>
        </Container>
      </DashboardLayout>
    );
  }

  const currentSoal = listSoal[currentSoalIndex];
  if (!currentSoal) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <Container maxWidth="xl">
          <SoftBox textAlign="center" py={5}>
            <SoftTypography variant={isMobile ? "h6" : "h5"} color="error">
              Soal tidak ditemukan.
            </SoftTypography>
          </SoftBox>
        </Container>
      </DashboardLayout>
    );
  }

  const processedTeksSoal = insertBreakBeforeB(currentSoal.teks_soal);
  const processedPilihanJawaban = currentSoal.pilihanJawaban?.map(
    (pilihan) => ({
      ...pilihan,
      teks_pilihan: insertBreakBeforeB(pilihan.teks_pilihan),
    })
  );

  // Cek apakah soal saat ini sudah dijawab
  const isCurrentSoalTerjawab = isSoalTerjawab(currentSoal.id);
  const jawabanTerpilih = jawabanPilihanGanda[currentSoal.id];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      {/* Overlay untuk pelanggaran */}
      {isProtected && (
        <SoftBox
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgColor="dark"
          zIndex={9999}
          sx={{ opacity: 0.5 }}
        />
      )}

      {/* Floating Action Button untuk mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="daftar soal"
          onClick={toggleDrawer}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            bgcolor: "#cb0c9f",
            "&:hover": {
              bgcolor: "#a00b7f",
            },
          }}
        >
          <MenuIcon />
        </Fab>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={toggleDrawer}
          PaperProps={{
            sx: { width: "80%", maxWidth: "300px" },
          }}
        >
          <SoalSidebar />
        </Drawer>
      )}

      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
        <SoftBox mt={{ xs: 2, sm: 3, md: 4 }}>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {/* Sidebar dengan nomor soal - hanya tampil di desktop */}
            {!isMobile && (
              <Grid item xs={12} md={3} lg={3}>
                <SoalSidebar />
              </Grid>
            )}

            {/* Main Content - Soal */}
            <Grid item xs={12} md={isMobile ? 12 : 9} lg={isMobile ? 12 : 9}>
              <Card sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                <SoftBox p={{ xs: 2, sm: 3 }}>
                  {/* Header Soal & Timer */}
                  <SoftBox 
                    display="flex" 
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent="space-between" 
                    alignItems={{ xs: "flex-start", sm: "center" }} 
                    mb={3}
                    gap={2}
                  >
                    <SoftBox display="flex" alignItems="center" gap={1}>
                      <SoftBadge 
                        color="info" 
                        badgeContent={`Soal ${currentSoalIndex + 1}`}
                        variant="gradient"
                        size={isMobile ? "md" : "lg"}
                        container
                      />
                      {isCurrentSoalTerjawab && (
                        <SoftBadge 
                          color="success" 
                          badgeContent="Terjawab"
                          variant="gradient"
                          size="sm"
                          container
                          sx={{ ml: 1 }}
                        >
                          <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 20, ml: 1 }} />
                        </SoftBadge>
                      )}
                    </SoftBox>
                    
                    <SoftBox display="flex" alignItems="center">
                      <Timer sx={{ color: "#cb0c9f", mr: 1, fontSize: { xs: 20, sm: 24 } }} />
                      <SoftTypography 
                        variant={isMobile ? "h6" : "h5"} 
                        fontWeight="bold" 
                        color="info"
                      >
                        {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>

                  {/* Teks Soal */}
                  {currentSoal.teks_soal && (
                    <SoftBox 
                      mb={3}
                      sx={{
                        "& p": { fontSize: { xs: "0.9rem", sm: "1rem" }, lineHeight: 1.6 },
                        "& br": { display: "block", margin: "0.5rem 0" },
                      }}
                    >
                      <SoftTypography 
                        variant="body1" 
                        dangerouslySetInnerHTML={{ __html: processedTeksSoal }}
                      />
                    </SoftBox>
                  )}

                  {/* Gambar Soal */}
                  {currentSoal.gambar_soal && (
                    <SoftBox mb={3} textAlign="center">
                      <SoftBox
                        component="img"
                        src={`${BASE_URL_NO_API}/${currentSoal.gambar_soal}`}
                        alt="gambar soal"
                        sx={{ 
                          maxWidth: "100%", 
                          maxHeight: { xs: "200px", sm: "300px" },
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                      />
                    </SoftBox>
                  )}

                  {/* Pilihan Jawaban */}
                  {processedPilihanJawaban?.length ? (
                    <SoftBox>
                      {processedPilihanJawaban.map((pilihan, index) => {
                        const isSelected = jawabanTerpilih === pilihan.id;
                        
                        return (
                          <SoftButton
                            key={index}
                            variant={isSelected ? "contained" : "outlined"}
                            color={isSelected ? "success" : "dark"}
                            fullWidth
                            onClick={() => {
                              handlePilihJawaban(currentSoal.id, pilihan.id);
                              // Otomatis lanjut ke soal berikutnya setelah memilih
                              setTimeout(() => {
                                handleNextSoal(currentSoal.id, pilihan.id);
                              }, 300);
                            }}
                            sx={{
                              mb: 2,
                              py: { xs: 1.5, sm: 2 },
                              justifyContent: "flex-start",
                              textAlign: "left",
                              borderColor: isSelected ? "#4caf50" : "#e9ecef",
                              backgroundColor: isSelected ? "rgba(76, 175, 80, 0.1)" : "transparent",
                              fontSize: { xs: "0.9rem", sm: "1rem" },
                              transition: "all 0.2s ease",
                              "&:hover": {
                                borderColor: isSelected ? "#4caf50" : "#cb0c9f",
                                backgroundColor: isSelected ? "rgba(76, 175, 80, 0.15)" : "rgba(203, 12, 159, 0.04)",
                              },
                              "& .MuiButton-startIcon": {
                                marginRight: 2,
                              },
                            }}
                            startIcon={
                              isSelected ? (
                                <RadioButtonCheckedIcon sx={{ color: "#4caf50" }} />
                              ) : (
                                <RadioButtonUncheckedIcon sx={{ color: "#cb0c9f" }} />
                              )
                            }
                          >
                            <SoftBox display="flex" alignItems="center" width="100%">
                              <SoftBox flex={1}>
                                <span dangerouslySetInnerHTML={{ __html: pilihan.teks_pilihan }} />
                              </SoftBox>
                              {isSelected && (
                                <CheckCircleIcon 
                                  sx={{ 
                                    color: "#4caf50", 
                                    ml: 1,
                                    fontSize: 20
                                  }} 
                                />
                              )}
                            </SoftBox>
                          </SoftButton>
                        );
                      })}

                      {/* Tombol Selesai untuk soal terakhir */}
                      {currentSoalIndex === listSoal.length - 1 && (
                        <SoftButton
                          variant="gradient"
                          color="success"
                          fullWidth
                          size={isMobile ? "medium" : "large"}
                          onClick={() => finishTestSession(currentSoal.id, jawabanTerpilih)}
                          disabled={!isCurrentSoalTerjawab}
                          sx={{ 
                            mt: 3,
                            opacity: isCurrentSoalTerjawab ? 1 : 0.6,
                          }}
                        >
                          <Check sx={{ mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                          Selesai Ujian
                        </SoftButton>
                      )}
                    </SoftBox>
                  ) : (
                    // Soal Essay
                    <SoftBox>
                      <SoftBox mb={3}>
                        <TextareaAutosize
                          minRows={isMobile ? 4 : 5}
                          placeholder="Jawaban Anda..."
                          value={jawabanEssay[currentSoal.id] || ""}
                          onChange={(e) => {
                            setJawabanEssay({
                              ...jawabanEssay,
                              [currentSoal.id]: e.target.value,
                            });
                            // Simpan ke localStorage
                            if (userId && kategoriId) {
                              localStorage.setItem(
                                `jawabanEssay_${userId}_${kategoriId}`,
                                JSON.stringify({
                                  ...jawabanEssay,
                                  [currentSoal.id]: e.target.value,
                                })
                              );
                            }
                          }}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "8px",
                            borderColor: jawabanEssay[currentSoal.id] ? "#4caf50" : "#e9ecef",
                            borderWidth: jawabanEssay[currentSoal.id] ? "2px" : "1px",
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            fontFamily: "inherit",
                            backgroundColor: jawabanEssay[currentSoal.id] ? "rgba(76, 175, 80, 0.02)" : "transparent",
                          }}
                        />
                        {jawabanEssay[currentSoal.id] && (
                          <SoftBox display="flex" alignItems="center" mt={1}>
                            <CheckCircleIcon sx={{ color: "#4caf50", fontSize: 18, mr: 0.5 }} />
                            <SoftTypography variant="caption" color="success">
                              Jawaban tersimpan
                            </SoftTypography>
                          </SoftBox>
                        )}
                      </SoftBox>

                      <SoftBox display="flex" justifyContent="flex-end">
                        <SoftButton
                          variant="gradient"
                          color={currentSoalIndex < listSoal.length - 1 ? "info" : "success"}
                          onClick={() =>
                            handleNextSoal(
                              currentSoal.id,
                              null,
                              jawabanEssay[currentSoal.id]
                            )
                          }
                          disabled={!jawabanEssay[currentSoal.id]}
                          endIcon={<ArrowForward />}
                          size={isMobile ? "medium" : "large"}
                          fullWidth={isMobile}
                          sx={{
                            opacity: jawabanEssay[currentSoal.id] ? 1 : 0.6,
                          }}
                        >
                          {currentSoalIndex < listSoal.length - 1
                            ? "Selanjutnya"
                            : "Selesai"}
                        </SoftButton>
                      </SoftBox>
                    </SoftBox>
                  )}
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </Container>

      {/* <Footer />} */}
    </DashboardLayout>
  );
};

export default Ujian;