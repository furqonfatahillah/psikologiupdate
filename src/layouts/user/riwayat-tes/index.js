import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import Icon from "@mui/material/Icon";
import Badge from "@mui/material/Badge";
import Divider from "@mui/material/Divider";

// Icons
import {
  History,
  Event,
  AccessTime,
  Description,
  Person,
  Badge as BadgeIcon,
  Star,
  Business,
  Shield,
  Assignment,
  Category,
  CalendarToday,
  Schedule,
  CheckCircle,
  Cancel,
  Pending,
  Close,
  Visibility,
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

const RiwayatTes = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [biodata, setBiodata] = useState(null);
  
  const token = sessionStorage.getItem("token");
  if (!token) {
    Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
    return null;
  }
  
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/hasil-tes/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && response.data.data) {
          setTestResults(response.data.data);
        } else {
          setError("Data tes tidak valid");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchBiodata = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/user-biodata/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          setBiodata(response.data.data);
        } else {
          setBiodata(null);
        }
      } catch (error) {
        Swal.fire("Gagal!", "Gagal mengambil data Biodata.", "error");
        setBiodata(null);
      }
    };

    if (token && userId) {
      fetchTestResults();
      fetchBiodata();
    } else {
      setError("Token atau user ID tidak ditemukan");
      setLoading(false);
    }
  }, [token, userId]);

  const handleTestClick = (test) => {
    setSelectedTest(test);
  };

  const closeModal = () => {
    setSelectedTest(null);
  };

  // Fungsi untuk mendapatkan warna status
  const getStatusColor = (status) => {
    switch (status) {
      case "MEMENUHI_SYARAT":
        return "success";
      case "TIDAK_MEMENUHI_SYARAT":
        return "error";
      default:
        return "warning";
    }
  };

  // Fungsi untuk mendapatkan icon status
  const getStatusIcon = (status) => {
    switch (status) {
      case "MEMENUHI_SYARAT":
        return <CheckCircle />;
      case "TIDAK_MEMENUHI_SYARAT":
        return <Cancel />;
      default:
        return <Pending />;
    }
  };

  // Fungsi untuk format teks status
  const getStatusText = (status) => {
    switch (status) {
      case "MEMENUHI_SYARAT":
        return "MEMENUHI SYARAT";
      case "TIDAK_MEMENUHI_SYARAT":
        return "TIDAK MEMENUHI";
      default:
        return "MENUNGGU";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <SoftTypography variant="h5" color="text">
            Loading...
          </SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <SoftTypography variant="h5" color="error">
            Error: {error}
          </SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <SoftBox mt={4}>
        {/* Header Section */}
        <SoftBox mb={4}>
          <SoftTypography variant="h3" fontWeight="bold" color="info" gutterBottom>
            Riwayat Tes
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            Daftar tes yang telah Anda kerjakan
          </SoftTypography>
        </SoftBox>

        {/* Test List Section */}
        {testResults.length > 0 ? (
          <Grid container spacing={3}>
            {testResults.map((test) => (
              <Grid item xs={12} key={test.id}>
                <SoftBox
                  onClick={() => handleTestClick(test)}
                  sx={{ cursor: "pointer" }}
                >
                  <Card
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <SoftBox p={3}>
                      <Grid container alignItems="center" spacing={2}>
                        <Grid item xs={12} md={8}>
                          <SoftBox display="flex" alignItems="center" flexWrap="wrap" gap={1} mb={1}>
                            <SoftTypography variant="h5" fontWeight="bold" color="info">
                              {test.kategoriTes || "N/A"}
                            </SoftTypography>
                            <Badge
                              color={getStatusColor(test.status)}
                              badgeContent={getStatusText(test.status)}
                              sx={{
                                "& .MuiBadge-badge": {
                                  fontSize: "0.7rem",
                                  height: "20px",
                                  minWidth: "80px",
                                  borderRadius: "10px",
                                },
                              }}
                            />
                          </SoftBox>

                          <SoftBox display="flex" alignItems="center" flexWrap="wrap" gap={2}>
                            <SoftBox display="flex" alignItems="center">
                              <Event sx={{ fontSize: 16, color: "#6c757d", mr: 0.5 }} />
                              <SoftTypography variant="caption" color="text">
                                {test.finishedAt
                                  ? new Date(test.finishedAt).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </SoftTypography>
                            </SoftBox>

                            {test.finishedAt && (
                              <SoftBox display="flex" alignItems="center">
                                <AccessTime sx={{ fontSize: 16, color: "#6c757d", mr: 0.5 }} />
                                <SoftTypography variant="caption" color="text">
                                  {new Date(test.finishedAt).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  })}
                                </SoftTypography>
                              </SoftBox>
                            )}
                          </SoftBox>
                        </Grid>

                        <Grid item xs={12} md={4}>
                          <SoftBox display="flex" justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                            <SoftButton
                              variant="text"
                              color="info"
                              size="small"
                              endIcon={<Visibility />}
                            >
                              Lihat Detail
                            </SoftButton>
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </Card>
                </SoftBox>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <SoftBox p={5} textAlign="center">
              <Description sx={{ fontSize: 60, color: "#6c757d", mb: 2 }} />
              <SoftTypography variant="h5" color="text" gutterBottom>
                Tidak ada riwayat tes
              </SoftTypography>
              <SoftTypography variant="body2" color="text">
                Anda belum mengerjakan tes apapun
              </SoftTypography>
            </SoftBox>
          </Card>
        )}
      </SoftBox>

      {/* Detail Modal */}
      <Modal
        open={!!selectedTest}
        onClose={closeModal}
        aria-labelledby="detail-modal-title"
      >
        <SoftBox
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
          width={{ xs: "90%", sm: 800 }}
        >
          <Card>
            <SoftBox p={3}>
              {/* Modal Header */}
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <SoftTypography variant="h5" fontWeight="bold" color="info">
                  Detail Hasil Tes
                </SoftTypography>
                <SoftButton variant="text" color="dark" onClick={closeModal}>
                  <Close />
                </SoftButton>
              </SoftBox>

              <Grid container spacing={3}>
                {/* Kolom Kiri - Biodata */}
                <Grid item xs={12} md={6}>
                  <SoftTypography variant="h6" fontWeight="medium" color="info" mb={2}>
                    Data Peserta
                  </SoftTypography>

                  <SoftBox mb={2}>
                    <SoftBox display="flex" alignItems="center" mb={1}>
                      <Person sx={{ fontSize: 18, color: "#cb0c9f", mr: 1 }} />
                      <SoftTypography variant="caption" fontWeight="bold" color="text">
                        Nama Lengkap
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="body2" pl={3.5}>
                      {biodata?.nama_lengkap || "Tidak tersedia"}
                    </SoftTypography>
                  </SoftBox>

                  <SoftBox mb={2}>
                    <SoftBox display="flex" alignItems="center" mb={1}>
                      <BadgeIcon sx={{ fontSize: 18, color: "#17c1e8", mr: 1 }} />
                      <SoftTypography variant="caption" fontWeight="bold" color="text">
                        NRP
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="body2" pl={3.5}>
                      {biodata?.nrp || "Tidak tersedia"}
                    </SoftTypography>
                  </SoftBox>

                  <SoftBox mb={2}>
                    <SoftBox display="flex" alignItems="center" mb={1}>
                      <Star sx={{ fontSize: 18, color: "#ff9800", mr: 1 }} />
                      <SoftTypography variant="caption" fontWeight="bold" color="text">
                        Pangkat
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="body2" pl={3.5}>
                      {biodata?.pangkat || "Tidak tersedia"}
                    </SoftTypography>
                  </SoftBox>

                  <SoftBox mb={2}>
                    <SoftBox display="flex" alignItems="center" mb={1}>
                      <Business sx={{ fontSize: 18, color: "#4caf50", mr: 1 }} />
                      <SoftTypography variant="caption" fontWeight="bold" color="text">
                        Jabatan
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="body2" pl={3.5}>
                      {biodata?.jabatan || "Tidak tersedia"}
                    </SoftTypography>
                  </SoftBox>

                  <SoftBox mb={2}>
                    <SoftBox display="flex" alignItems="center" mb={1}>
                      <Shield sx={{ fontSize: 18, color: "#f44335", mr: 1 }} />
                      <SoftTypography variant="caption" fontWeight="bold" color="text">
                        Kesatuan
                      </SoftTypography>
                    </SoftBox>
                    <SoftTypography variant="body2" pl={3.5}>
                      {biodata?.kesatuan || "Tidak tersedia"}
                    </SoftTypography>
                  </SoftBox>
                </Grid>

                {/* Kolom Kanan - Detail Tes */}
                <Grid item xs={12} md={6}>
                  <SoftTypography variant="h6" fontWeight="medium" color="info" mb={2}>
                    Detail Tes
                  </SoftTypography>

                  {selectedTest && (
                    <>
                      <SoftBox mb={2}>
                        <SoftBox display="flex" alignItems="center" mb={1}>
                          <Assignment sx={{ fontSize: 18, color: "#cb0c9f", mr: 1 }} />
                          <SoftTypography variant="caption" fontWeight="bold" color="text">
                            No Tes
                          </SoftTypography>
                        </SoftBox>
                        <SoftTypography variant="body2" pl={3.5}>
                          {selectedTest.noTes || "Tidak tersedia"}
                        </SoftTypography>
                      </SoftBox>

                      <SoftBox mb={2}>
                        <SoftBox display="flex" alignItems="center" mb={1}>
                          <Category sx={{ fontSize: 18, color: "#17c1e8", mr: 1 }} />
                          <SoftTypography variant="caption" fontWeight="bold" color="text">
                            Kategori Tes
                          </SoftTypography>
                        </SoftBox>
                        <SoftTypography variant="body2" pl={3.5}>
                          {selectedTest.kategoriTes || "Tidak tersedia"}
                        </SoftTypography>
                      </SoftBox>

                      <SoftBox mb={2}>
                        <SoftBox display="flex" alignItems="center" mb={1}>
                          <CalendarToday sx={{ fontSize: 18, color: "#ff9800", mr: 1 }} />
                          <SoftTypography variant="caption" fontWeight="bold" color="text">
                            Tanggal Tes
                          </SoftTypography>
                        </SoftBox>
                        <SoftTypography variant="body2" pl={3.5}>
                          {selectedTest.finishedAt
                            ? new Date(selectedTest.finishedAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Tidak tersedia"}
                        </SoftTypography>
                      </SoftBox>

                      <SoftBox mb={2}>
                        <SoftBox display="flex" alignItems="center" mb={1}>
                          <Schedule sx={{ fontSize: 18, color: "#4caf50", mr: 1 }} />
                          <SoftTypography variant="caption" fontWeight="bold" color="text">
                            Waktu Tes
                          </SoftTypography>
                        </SoftBox>
                        <SoftTypography variant="body2" pl={3.5}>
                          {selectedTest.createdAt && selectedTest.finishedAt
                            ? `${new Date(selectedTest.createdAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })} - ${new Date(selectedTest.finishedAt).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}`
                            : "Tidak tersedia"}
                        </SoftTypography>
                      </SoftBox>

                      <SoftBox mb={2}>
                        <SoftBox display="flex" alignItems="center" mb={1}>
                          {getStatusIcon(selectedTest.status)}
                          <SoftTypography variant="caption" fontWeight="bold" color="text" ml={1}>
                            Status
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox pl={3.5}>
                          <Badge
                            color={getStatusColor(selectedTest.status)}
                            badgeContent={getStatusText(selectedTest.status)}
                            sx={{
                              "& .MuiBadge-badge": {
                                fontSize: "0.75rem",
                                height: "22px",
                                minWidth: "90px",
                                borderRadius: "11px",
                                position: "relative",
                                transform: "none",
                              },
                            }}
                          />
                        </SoftBox>
                      </SoftBox>
                    </>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Info Tambahan */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    Masa Berlaku
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    {selectedTest?.masa_berlaku || "Tidak tersedia"}
                  </SoftTypography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    Keterangan
                  </SoftTypography>
                  <SoftTypography variant="body2">
                    {selectedTest?.keterangan || "Tidak tersedia"}
                  </SoftTypography>
                </Grid>
              </Grid>

              {/* Modal Footer */}
              <SoftBox display="flex" justifyContent="flex-end" mt={3}>
                <SoftButton variant="gradient" color="info" onClick={closeModal}>
                  Tutup
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </Card>
        </SoftBox>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
};

export default RiwayatTes;