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
import * as XLSX from "xlsx";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// MUI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

// Config
import BASE_URL from "../../config/BASE_URL";

// Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const HasilUjian = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [token, setToken] = useState("");
  const [kategoriId, setKategoriId] = useState("");
  const [kesatuanId, setKesatuanId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableKey, setTableKey] = useState(0);
  const [kategoriName, setKategoriName] = useState("");
  const [kesatuanName, setKesatuanName] = useState("");
  const [previewData, setPreviewData] = useState([]);

  const storedToken = sessionStorage.getItem("token");
  const storedKategoriId = sessionStorage.getItem("kategoriId");
  const storedKesatuanId = sessionStorage.getItem("kesatuanId");

  useEffect(() => {
    // Ambil data dari sessionStorage
    const storedKategoriName = sessionStorage.getItem("kategoriName") || "Pilih Kategori";
    const storedKesatuanName = sessionStorage.getItem("kesatuanName") || "Pilih Kesatuan";

    setKategoriName(storedKategoriName);
    setKesatuanName(storedKesatuanName);
  }, []);

  useEffect(() => {
    if (!storedToken) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error").then(() => {
        navigate("/login");
      });
      return;
    }

    setToken(storedToken);
    setKategoriId(storedKategoriId);
    setKesatuanId(storedKesatuanId);
  }, [navigate, storedToken, storedKategoriId, storedKesatuanId]);

  // Fetch data hasil tes
  const fetchHasilTes = async () => {
    if (!kategoriId || !kesatuanId) return;

    setLoadingData(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/hasil-tes/filter?kategoriTesId=${kategoriId}&kesatuanId=${kesatuanId}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (response.data.status === "success") {
        setTableData(response.data.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data hasil tes:", error);
      Swal.fire("Error", "Gagal mengambil data hasil tes", "error");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (kategoriId && kesatuanId) {
      fetchHasilTes();
    }
  }, [kategoriId, kesatuanId, tableKey]);

  const handleDownloadCsv = async () => {
    if (!kategoriId) {
      Swal.fire("Error", "Kategori Tes tidak ditemukan!", "error");
      return;
    }

    if (!kesatuanId) {
      Swal.fire("Error", "Sesi ujian tidak ditemukan!", "error");
      return;
    }

    const url = `${BASE_URL}/hasil-tes/generate-template?kategoriTesId=${kategoriId}&kesatuanId=${kesatuanId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error("Gagal mengunduh file!");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "template_update_hasil_tes.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire("Berhasil", "File berhasil diunduh", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Gagal mengunduh file", "error");
    }
  };

  const handleDownloadExcel = async () => {
    if (!kategoriId) {
      Swal.fire("Error", "Kategori Tes tidak ditemukan!", "error");
      return;
    }

    if (!kesatuanId) {
      Swal.fire("Error", "Sesi ujian tidak ditemukan!", "error");
      return;
    }

    const url = `${BASE_URL}/hasil-tes-export/export-all?kategoriTesId=${kategoriId}&kesatuanId=${kesatuanId}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response:", errorData);
        throw new Error("Gagal mengunduh file!");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "HasilUjian.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Swal.fire("Berhasil", "File berhasil diunduh", "success");
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Error", "Gagal mengunduh file", "error");
    }
  };

  const columns = [
    { name: "no", align: "center", width: "5%" },
    { name: "username", align: "left", width: "15%" },
    { name: "nrp", align: "left", width: "10%" },
    { name: "nomor tes", align: "left", width: "10%" },
    { name: "masa berlaku", align: "left", width: "15%" },
    { name: "keterangan", align: "left", width: "20%" },
    { name: "status", align: "center", width: "25%" },
  ];

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${BASE_URL}/hasil-tes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Gagal mengupdate status!");

      Swal.fire("Berhasil", "Status berhasil diperbarui", "success");
      setTableKey((prevKey) => prevKey + 1); // Refresh table
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const getRows = (data) => {
    if (!data || data.length === 0) return [];

    return data.map((item, index) => {
      // Status dropdown component
      const StatusDropdown = () => (
        <FormControl fullWidth size="small">
          <Select
            value={item.status || "MENUNGGU"}
            onChange={(e) => handleStatusChange(item.id, e.target.value)}
            sx={{ fontSize: '0.875rem' }}
          >
            <MenuItem value="MENUNGGU">MENUNGGU</MenuItem>
            <MenuItem value="MEMENUHI_SYARAT">MEMENUHI SYARAT</MenuItem>
            <MenuItem value="TIDAK_MEMENUHI_SYARAT">TIDAK MEMENUHI SYARAT</MenuItem>
          </Select>
        </FormControl>
      );

      return {
        no: index + 1,
        username: item.username || '-',
        nrp: item.nrp || '-',
        'nomor tes': item.noTes || '-',
        'masa berlaku': item.masa_berlaku || '-',
        keterangan: item.keterangan || '-',
        status: <StatusDropdown />,
      };
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setPreviewData(parsedData);
      };
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    if (excelFile) {
      formData.append("file", excelFile);
    } else {
      Swal.fire("Error", "Tidak ada file yang dipilih", "error");
      setLoading(false);
      return;
    }

    formData.append("kategoriId", kategoriId);
    formData.append("kesatuanId", kesatuanId);

    try {
      const response = await axios.post(
        `${BASE_URL}/hasil-tes/batch-update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        Swal.fire("Sukses!", "Status berhasil diupdate!", "success");
        setTableKey((prevKey) => prevKey + 1);
        setExcelFile(null);
        setPreviewData([]);
        setModalOpen(false);
      } else {
        Swal.fire("Gagal!", response.data.message, "error");
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        error.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
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
                Hasil Ujian
              </SoftTypography>

              {/* Breadcrumb */}
              <SoftBox mt={2} mb={3}>
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
                      color="info"
                      href="/HasilLaporan"
                      sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                      {kategoriName}
                    </Link>
                    <Link
                      underline="hover"
                      color="info"
                      href="/HasilLaporan"
                      sx={{ cursor: 'pointer', textDecoration: 'none' }}
                    >
                      {kesatuanName}
                    </Link>
                    <Typography color="text.primary">Hasil Ujian</Typography>
                  </Breadcrumbs>
                </Paper>
              </SoftBox>

              {/* Main Card */}
              <Card sx={{ p: 3, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                {/* Action Buttons */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <SoftButton
                      variant="gradient"
                      color="primary"
                      fullWidth
                      onClick={handleDownloadCsv}
                      startIcon={<CloudDownloadIcon />}
                      sx={{
                        background: 'linear-gradient(195deg, #cb0c9f, #9506a3)',
                        color: 'white',
                        fontSize: '13px',
                        py: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(195deg, #b00b8a, #7a0588)'
                        }
                      }}
                    >
                      Download Template CSV
                    </SoftButton>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <SoftButton
                      variant="gradient"
                      color="success"
                      fullWidth
                      onClick={handleDownloadExcel}
                      startIcon={<CloudDownloadIcon />}
                      sx={{
                        background: 'linear-gradient(195deg, #4caf50, #388e3c)',
                        color: 'white',
                        fontSize: '13px',
                        py: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(195deg, #43a047, #2e7d32)'
                        }
                      }}
                    >
                      Download Hasil Ujian
                    </SoftButton>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <SoftButton
                      variant="gradient"
                      color="warning"
                      fullWidth
                      onClick={() => setModalOpen(true)}
                      startIcon={<EditIcon />}
                      sx={{
                        background: 'linear-gradient(195deg, #ff9800, #f57c00)',
                        color: 'white',
                        fontSize: '13px',
                        py: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(195deg, #fb8c00, #ef6c00)'
                        }
                      }}
                    >
                      Edit Status
                    </SoftButton>
                  </Grid>
                </Grid>

                {/* Data Table */}
                {kategoriId && kesatuanId && (
                  <SoftBox mt={2}>
                    {loadingData ? (
                      <SoftBox display="flex" justifyContent="center" py={5}>
                        <CircularProgress size={40} sx={{ color: "#cb0c9f" }} />
                      </SoftBox>
                    ) : (
                      <Table
                        columns={columns}
                        rows={getRows(tableData)}
                      />
                    )}
                  </SoftBox>
                )}
              </Card>
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>

      {/* Update Status Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-update-status-title"
      >
        <Box sx={style}>
          <Typography
            id="modal-update-status-title"
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              borderBottom: '1px solid #e0e0e0',
              pb: 2,
              mb: 3
            }}
          >
            Update Status
          </Typography>

          <form onSubmit={handleUpdateStatus}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>
                Import File Excel/CSV
              </Typography>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  fontSize: '0.875rem'
                }}
              />
            </Box>

            {/* Preview Table */}
            {previewData.length > 0 && (
              <SoftBox sx={{ mt: 3, mb: 2 }}>
                <SoftTypography variant="body2" fontWeight="medium" mb={2}>
                  Preview Data
                </SoftTypography>
                <Paper variant="outlined" sx={{ maxHeight: 300, overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {Object.keys(previewData[0]).map((key) => (
                          <th key={key} style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value, i) => (
                            <td key={i} style={{ padding: '8px', borderBottom: '1px solid #e0e0e0' }}>
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Paper>
              </SoftBox>
            )}

            <Box display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setModalOpen(false)}
                sx={{ fontSize: '0.875rem' }}
              >
                Batal
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  fontSize: '0.875rem',
                  backgroundColor: '#cb0c9f',
                  '&:hover': { backgroundColor: '#b00b8a' },
                  color: 'white'
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : "Update"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Footer />
    </DashboardLayout>
  );
};

export default HasilUjian;