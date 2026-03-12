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
import Badge from "@mui/material/Badge";
import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";

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
import Footer from "examples/Footer";

import BASE_URL from "../../../config/BASE_URL";
import BASE_URL_NO_API from "../../../config/BASE_URL_NOT_API";

// Custom CSS untuk proteksi
import "./security.css";

const Ujian = () => {
  const [isProtected, setIsProtected] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listSoal, setListSoal] = useState([]);
  const kategoriId = sessionStorage.getItem("kategoriId");
  const token = localStorage.getItem("tokenLocal");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const [currentSoalIndex, setCurrentSoalIndex] = useState(() => {
    const savedIndex = localStorage.getItem(
      `currentSoalIndex_${userId}_${kategoriId}`
    );
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  const [jawabanEssay, setJawabanEssay] = useState(() => {
    const savedAnswers = localStorage.getItem(
      `jawabanEssay_${userId}_${kategoriId}`
    );
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const sessionTestId = localStorage.getItem("userTestSessionId");
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedTime = localStorage.getItem(`timeLeft_${userId}_${kategoriId}`);
    return savedTime ? parseInt(savedTime, 10) : null;
  });

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
              localStorage.setItem(
                `timeLeft_${userId}_${kategoriId}`,
                totalSeconds
              );
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
            localStorage.removeItem(`timeLeft_${userId}_${kategoriId}`);
          }
          localStorage.setItem(
            `timeLeft_${userId}_${kategoriId}`,
            prevTime - 1
          );
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timeLeft, sessionTestId]);

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

  const handleNextSoal = (
    soalId,
    pilihanJawabanId = null,
    teksJawaban = null
  ) => {
    submitJawaban(soalId, pilihanJawabanId, teksJawaban);

    const nextIndex = currentSoalIndex + 1;
    if (nextIndex < listSoal.length) {
      setCurrentSoalIndex(nextIndex);
      localStorage.setItem(
        `currentSoalIndex_${userId}_${kategoriId}`,
        nextIndex
      );
      localStorage.setItem(
        `jawabanEssay_${userId}_${kategoriId}`,
        JSON.stringify(jawabanEssay)
      );
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
        localStorage.removeItem(`timeLeft_${userId}_${kategoriId}`);
        localStorage.removeItem(`currentSoalIndex_${userId}_${kategoriId}`);
        localStorage.removeItem(`jawabanEssay_${userId}_${kategoriId}`);
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

  // Progress bar untuk soal yang sudah dijawab
  const answeredCount = Object.keys(jawabanEssay).length;
  const progress = (answeredCount / listSoal.length) * 100 || 0;

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <SoftTypography variant="h5" color="text">
            Loading...
          </SoftTypography>
        </SoftBox>
      </DashboardLayout>
    );
  }

  const currentSoal = listSoal[currentSoalIndex];
  if (!currentSoal) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox textAlign="center" py={5}>
          <SoftTypography variant="h5" color="error">
            Soal tidak ditemukan.
          </SoftTypography>
        </SoftBox>
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

      <SoftBox mt={4}>
        <Grid container spacing={3}>
          {/* Sidebar dengan nomor soal */}
          <Grid item xs={12} md={3}>
            <Card>
              <SoftBox p={2}>
                <SoftTypography variant="h6" fontWeight="bold" color="info" mb={2}>
                  Daftar Soal
                </SoftTypography>
                
                {/* Progress Bar */}
                <SoftBox mb={2}>
                  <SoftTypography variant="caption" color="text" display="block" mb={0.5}>
                    Progress: {answeredCount}/{listSoal.length} Soal Terjawab
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
                <SoftBox display="flex" flexWrap="wrap" gap={1}>
                  {listSoal.map((soal, index) => {
                    const isAnswered = jawabanEssay[soal.id] !== undefined;
                    const isCurrent = index === currentSoalIndex;
                    
                    return (
                      <Tooltip title={`Soal ${index + 1}`} key={index}>
                        <SoftBox
                          width="50px"
                          height="50px"
                          borderRadius="md"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgColor={isCurrent ? "info" : isAnswered ? "success" : "light"}
                          color={isCurrent || isAnswered ? "white" : "text"}
                          sx={{
                            cursor: "default",
                            fontWeight: "bold",
                            fontSize: "1.1rem",
                            transition: "all 0.2s ease",
                            border: isCurrent ? "2px solid #cb0c9f" : "none",
                          }}
                        >
                          {index + 1}
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
          </Grid>

          {/* Main Content - Soal */}
          <Grid item xs={12} md={9}>
            <Card>
              <SoftBox p={3}>
                {/* Header Soal & Timer */}
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <SoftBadge 
                    color="info" 
                    badgeContent={`Soal ${currentSoalIndex + 1}`}
                    variant="gradient"
                    size="lg"
                    container
                  />
                  
                  <SoftBox display="flex" alignItems="center">
                    <Timer sx={{ color: "#cb0c9f", mr: 1 }} />
                    <SoftTypography variant="h5" fontWeight="bold" color="info">
                      {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>

                {/* Teks Soal */}
                {currentSoal.teks_soal && (
                  <SoftBox 
                    mb={3}
                    sx={{
                      "& p": { fontSize: "1rem", lineHeight: 1.6 },
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
                        maxHeight: "300px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                    />
                  </SoftBox>
                )}

                {/* Pilihan Jawaban */}
                {processedPilihanJawaban?.length ? (
                  <SoftBox>
                    {processedPilihanJawaban.map((pilihan, index) => (
                      <SoftButton
                        key={index}
                        variant="outlined"
                        color="dark"
                        fullWidth
                        onClick={() => handleNextSoal(currentSoal.id, pilihan.id)}
                        sx={{
                          mb: 2,
                          py: 2,
                          justifyContent: "flex-start",
                          textAlign: "left",
                          borderColor: "#e9ecef",
                          "&:hover": {
                            borderColor: "#cb0c9f",
                            backgroundColor: "rgba(203, 12, 159, 0.04)",
                          },
                        }}
                      >
                        <SoftBox display="flex" alignItems="center">
                          <RadioButtonUnchecked sx={{ mr: 2, fontSize: 20, color: "#cb0c9f" }} />
                          <span dangerouslySetInnerHTML={{ __html: pilihan.teks_pilihan }} />
                        </SoftBox>
                      </SoftButton>
                    ))}

                    {/* Tombol Selesai untuk soal terakhir */}
                    {currentSoalIndex === listSoal.length - 1 && (
                      <SoftButton
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="large"
                        onClick={() => finishTestSession(currentSoal.id)}
                        sx={{ mt: 3 }}
                      >
                        <Check sx={{ mr: 1 }} />
                        Selesai Ujian
                      </SoftButton>
                    )}
                  </SoftBox>
                ) : (
                  // Soal Essay
                  <SoftBox>
                    <SoftBox mb={3}>
                      <TextareaAutosize
                        minRows={5}
                        placeholder="Jawaban Anda..."
                        value={jawabanEssay[currentSoal.id] || ""}
                        onChange={(e) =>
                          setJawabanEssay({
                            ...jawabanEssay,
                            [currentSoal.id]: e.target.value,
                          })
                        }
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "8px",
                          borderColor: "#e9ecef",
                          fontSize: "1rem",
                          fontFamily: "inherit",
                        }}
                      />
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
                        endIcon={<ArrowForward />}
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

      <Footer />
    </DashboardLayout>
  );
};

export default Ujian;