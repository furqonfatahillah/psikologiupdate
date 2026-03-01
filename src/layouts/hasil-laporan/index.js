/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================
* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
=========================================================
*/

// @mui material components
import Card from "@mui/material/Card";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// MUI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CircularProgress from '@mui/material/CircularProgress';
import Badge from '@mui/material/Badge';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";

// Config
import BASE_URL from "../../config/BASE_URL";
import PropTypes from 'prop-types';

// Custom Card Component for selection
const SelectionCard = ({
  id,
  name,
  isSelected,
  hasData,
  onClick,
  disabled,
  type
}) => {
  // Determine card style based on state
  let backgroundColor = '#f8f9fa';
  let borderColor = '#dee2e6';
  let textColor = '#7b809a';
  let borderWidth = '1px';

  if (isSelected) {
    backgroundColor = 'linear-gradient(195deg, #cb0c9f, #9506a3)';
    textColor = '#ffffff';
    borderColor = 'transparent';
  } else if (hasData) {
    borderColor = '#4caf50';
    borderWidth = '2px';
    backgroundColor = '#ffffff';
  }

  return (
    <SoftBox
      onClick={disabled ? null : onClick}
      sx={{
        width: '100%',
        padding: '1.5rem',
        background: isSelected ? backgroundColor : backgroundColor,
        border: `${borderWidth} solid ${borderColor}`,
        borderRadius: '10px',
        transition: 'all 0.3s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        opacity: disabled ? 0.6 : 1,
        boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
        '&:hover': !disabled && !isSelected ? {
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transform: 'translateY(-2px)'
        } : {}
      }}
    >
      <SoftTypography
        variant="body1"
        fontWeight={isSelected ? "medium" : "regular"}
        color={isSelected ? "white" : "text"}
        textAlign="center"
      >
        {name}
      </SoftTypography>

      {hasData && !isSelected && (
        <SoftBox
          position="absolute"
          top="-8px"
          right="-8px"
        >
          <Badge
            badgeContent="Data Tersedia"
            color="success"
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '0 8px',
                height: '20px',
                minWidth: '20px',
              }
            }}
          />
        </SoftBox>
      )}
    </SoftBox>
  );
};

SelectionCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  hasData: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  type: PropTypes.string,
};

const HasilLaporan = () => {
  const [listKategori, setListKategori] = useState([]);
  const [listKesatuan, setListKesatuan] = useState([]);
  const [selectedKategoriId, setSelectedKategoriId] = useState(null);
  const [selectedKesatuanId, setSelectedKesatuanId] = useState(null);
  const [selectedKategoriName, setSelectedKategoriName] = useState("");
  const [selectedKesatuanName, setSelectedKesatuanName] = useState("");
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingKesatuan, setLoadingKesatuan] = useState(false);
  const [dataAvailability, setDataAvailability] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    setLoadingKategori(true);
    try {
      const response = await axios.get(`${BASE_URL}/kategori-tes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListKategori(response.data.data);

      // Check data availability for each category
      const availability = {};
      for (const kategori of response.data.data) {
        const hasData = await checkHasData(kategori.id);
        availability[kategori.id] = hasData;
      }
      setDataAvailability(availability);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal mengambil data kategori", "error");
    } finally {
      setLoadingKategori(false);
    }
  };

  const fetchKesatuan = async (kategoriId, kategoriName) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    setLoadingKesatuan(true);
    try {
      const response = await axios.get(`${BASE_URL}/master-kesatuan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListKesatuan(response.data.data);
      setSelectedKategoriName(kategoriName);

      // Check data availability for each kesatuan in this category
      const newAvailability = { ...dataAvailability };
      for (const kesatuan of response.data.data) {
        const hasData = await checkHasData(kategoriId, kesatuan.id);
        newAvailability[`${kategoriId}-${kesatuan.id}`] = hasData;
      }
      setDataAvailability(newAvailability);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal mengambil data kesatuan", "error");
    } finally {
      setLoadingKesatuan(false);
    }
  };

  const checkHasData = async (kategoriId, kesatuanId = null) => {
    const token = sessionStorage.getItem("token");
    try {
      const params = { kategoriTesId: kategoriId };
      if (kesatuanId) params.kesatuanId = kesatuanId;

      const response = await axios.get(`${BASE_URL}/hasil-tes/filter`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      return response.data.data && response.data.data.length > 0;
    } catch (error) {
      console.error("Error checking data availability:", error);
      return false;
    }
  };

  const handleSelectKategori = (kategoriId, kategoriName) => {
    setSelectedKategoriId(kategoriId);
    setSelectedKesatuanId(null);
    setSelectedKesatuanName("");
    sessionStorage.setItem("kategoriId", kategoriId);
    sessionStorage.setItem("kategoriName", kategoriName);
    fetchKesatuan(kategoriId, kategoriName);
  };

  const handleSelectKesatuan = (kesatuanId, kesatuanName) => {
    setSelectedKesatuanId(kesatuanId);
    setSelectedKesatuanName(kesatuanName);
    sessionStorage.setItem("kesatuanId", kesatuanId);
    sessionStorage.setItem("kesatuanName", kesatuanName);
    navigate(`/hasil-ujian`);
  };

  const handleBreadcrumbClick = (type) => {
    if (type === 'kategori') {
      setSelectedKesatuanId(null);
      setSelectedKesatuanName("");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="medium" color="info" gutterBottom>
                Hasil & Laporan
              </SoftTypography>

              {/* Breadcrumb */}
              <SoftBox mt={3} mb={2}>
                <Paper
                  elevation={0}
                  sx={{
                    backgroundColor: '#f8f9fa',
                    padding: '10px 15px',
                    borderRadius: '5px'
                  }}
                >
                  <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                  >
                    <Link
                      underline="hover"
                      color={selectedKategoriName ? "info" : "textSecondary"}
                      href="#"
                      onClick={() => handleBreadcrumbClick('kategori')}
                      sx={{
                        fontWeight: selectedKategoriName ? 600 : 400,
                        cursor: 'pointer'
                      }}
                    >
                      {selectedKategoriName || "Pilih Kategori"}
                    </Link>
                    {selectedKategoriId && (
                      <Link
                        underline="hover"
                        color={selectedKesatuanName ? "info" : "textSecondary"}
                        href="#"
                        sx={{
                          fontWeight: selectedKesatuanName ? 600 : 400,
                          cursor: 'default'
                        }}
                      >
                        {selectedKesatuanName || "Pilih Kesatuan"}
                      </Link>
                    )}
                  </Breadcrumbs>
                </Paper>
              </SoftBox>

              {/* Main Content */}
              <Card sx={{ mt: 2, p: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <SoftTypography variant="h6" fontWeight="bold" mb={3}>
                  Pilih Kategori Tes
                </SoftTypography>

                {loadingKategori ? (
                  <SoftBox display="flex" justifyContent="center" py={5}>
                    <CircularProgress size={40} sx={{ color: "#cb0c9f" }} />
                  </SoftBox>
                ) : (
                  <Grid container spacing={2}>
                    {listKategori.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <SelectionCard
                          id={item.id}
                          name={item.nama_kategori_tes}
                          isSelected={selectedKategoriId === item.id}
                          hasData={dataAvailability[item.id] || false}
                          onClick={() => handleSelectKategori(item.id, item.nama_kategori_tes)}
                          disabled={loadingKesatuan}
                          type="kategori"
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}

                {selectedKategoriId && (
                  <>
                    <SoftTypography variant="h6" fontWeight="bold" mt={4} mb={3}>
                      Pilih Kesatuan
                    </SoftTypography>

                    {loadingKesatuan ? (
                      <SoftBox display="flex" justifyContent="center" py={5}>
                        <CircularProgress size={40} sx={{ color: "#cb0c9f" }} />
                      </SoftBox>
                    ) : (
                      <Grid container spacing={2}>
                        {listKesatuan.map((kesatuan) => {
                          const hasData = dataAvailability[`${selectedKategoriId}-${kesatuan.id}`];
                          return (
                            <Grid item xs={12} sm={6} md={4} key={kesatuan.id}>
                              <SelectionCard
                                id={kesatuan.id}
                                name={kesatuan.nama_kesatuan}
                                isSelected={selectedKesatuanId === kesatuan.id}
                                hasData={hasData || false}
                                onClick={() => handleSelectKesatuan(kesatuan.id, kesatuan.nama_kesatuan)}
                                disabled={false}
                                type="kesatuan"
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    )}
                  </>
                )}
              </Card>
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default HasilLaporan;