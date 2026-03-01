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
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftBadge from "components/SoftBadge";
import SoftAvatar from "components/SoftAvatar";

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// MUI components
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';
import Icon from '@mui/material/Icon';
import { alpha } from '@mui/material/styles';

// Config
import BASE_URL from "config/BASE_URL";
import BASE_URL_NO_API from "config/BASE_URL_NOT_API";
import PropTypes from 'prop-types';

// Simple Editor component
const SimpleEditor = ({ value, onChange }) => {
  return (
    <TextField
      fullWidth
      multiline
      rows={4}
      variant="outlined"
      placeholder="Masukkan instruksi tes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ mt: 1 }}
    />
  );
};

SimpleEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

// Custom Tab Panel component
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

function ManajemenTes() {
  const [activeTab, setActiveTab] = useState(0);
  const [tableKey, setTableKey] = useState(0);

  // Modal states
  const [openModalKategori, setOpenModalKategori] = useState(false);
  const [openModalSoal, setOpenModalSoal] = useState(false);

  // Form states for kategori
  const [namaKategori, setNamaKategori] = useState("");
  const [instruksiTes, setInstruksiTes] = useState("");
  const [masterJenisTesId, setMasterJenisTesId] = useState("");
  const [waktuPengerjaan, setWaktuPengerjaan] = useState("");

  // Form states for soal
  const [kategoriTesId, setKategoriTesId] = useState("");
  const [teksSoal, setTeksSoal] = useState("");
  const [gambarSoal, setGambarSoal] = useState(null);
  const [pilihanJawaban, setPilihanJawaban] = useState([
    { teks_pilihan: "", gambar_pilihan: null },
    { teks_pilihan: "", gambar_pilihan: null },
    { teks_pilihan: "", gambar_pilihan: null },
    { teks_pilihan: "", gambar_pilihan: null },
  ]);
  const [excelFile, setExcelFile] = useState(null);
  const [idSoal, setIdSoal] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Data states
  const [listJenisTes, setListJenisTes] = useState([]);
  const [listKategoriTes, setListKategoriTes] = useState([]);
  const [soalData, setSoalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModalKategori = () => setOpenModalKategori(true);
  const handleCloseModalKategori = () => {
    setOpenModalKategori(false);
    resetFormKategori();
  };

  const handleOpenModalSoal = (mode = 'add') => {
    if (mode === 'add') {
      setEditMode(false);
      resetFormSoal();
    }
    setOpenModalSoal(true);
  };

  const handleCloseModalSoal = () => {
    setOpenModalSoal(false);
    resetFormSoal();
  };

  const resetFormKategori = () => {
    setNamaKategori("");
    setMasterJenisTesId("");
    setInstruksiTes("");
    setWaktuPengerjaan("");
  };

  const resetFormSoal = () => {
    setTeksSoal("");
    setGambarSoal(null);
    setKategoriTesId("");
    setPilihanJawaban([
      { teks_pilihan: "", gambar_pilihan: null },
      { teks_pilihan: "", gambar_pilihan: null },
      { teks_pilihan: "", gambar_pilihan: null },
      { teks_pilihan: "", gambar_pilihan: null },
    ]);
    setIdSoal(null);
    setEditMode(false);
  };

  const isPilihanGanda = () => {
    const selectedKategori = listKategoriTes.find(
      (kategori) => kategori.id === parseInt(kategoriTesId, 10)
    );
    return selectedKategori?.masterJenisTesId === 1;
  };

  // Fetch data jenis tes
  useEffect(() => {
    const fetchJenisTes = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${BASE_URL}/master-jenis-tes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "success") {
          setListJenisTes(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data jenis tes:", error);
      }
    };

    fetchJenisTes();
  }, []);

  // Fetch kategori data
  useEffect(() => {
    const fetchKategoriTes = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      setLoadingData(true);
      try {
        const response = await axios.get(`${BASE_URL}/kategori-tes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "success") {
          setListKategoriTes(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data kategori tes:", error);
        Swal.fire(
          "Gagal!",
          `Gagal mengambil data kategori tes: ${error.response?.data?.message || "Terjadi kesalahan"}`,
          "error"
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchKategoriTes();
  }, [tableKey]);

  // Fetch soal data
  useEffect(() => {
    const fetchSoalData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      setLoadingData(true);
      try {
        const response = await axios.get(`${BASE_URL}/soal`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "success") {
          setSoalData(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data soal:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchSoalData();
  }, [tableKey]);

  const handleTambahKategori = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/kategori-tes`,
        {
          nama_kategori_tes: namaKategori,
          masterJenisTesId: parseInt(masterJenisTesId, 10),
          instruksi_tes: instruksiTes,
          waktu_pengerjaan: waktuPengerjaan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        Swal.fire("Sukses!", "Kategori tes berhasil ditambahkan!", "success");
        setTableKey((prevKey) => prevKey + 1);
        handleCloseModalKategori();
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal menambahkan kategori tes: ${error.response?.data?.message || "Terjadi kesalahan"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTambahSoal = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("kategoriTesId", kategoriTesId);
    formData.append("teks_soal", teksSoal);
    if (gambarSoal) {
      formData.append("gambar_soal", gambarSoal);
    }

    const selectedKategori = listKategoriTes.find(
      (kategori) => kategori.id === parseInt(kategoriTesId, 10)
    );
    if (selectedKategori?.masterJenisTesId === 1) {
      formData.append(
        "pilihanJawaban",
        JSON.stringify(
          pilihanJawaban.map((pilihan) => ({
            teks_pilihan: pilihan.teks_pilihan,
            gambar_pilihan: pilihan.gambar_pilihan,
          }))
        )
      );
    }

    try {
      const response = await axios.post(`${BASE_URL}/soal`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        Swal.fire("Sukses!", "Soal berhasil ditambahkan!", "success");
        setTableKey((prevKey) => prevKey + 1);
        handleCloseModalSoal();
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal menambahkan soal: ${error.response?.data?.message || "Terjadi kesalahan"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditSoal = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("kategoriTesId", kategoriTesId);
    formData.append("teks_soal", teksSoal);
    formData.append("id", idSoal);
    if (gambarSoal) {
      formData.append("gambar_soal", gambarSoal);
    }

    const selectedKategori = listKategoriTes.find(
      (kategori) => kategori.id === parseInt(kategoriTesId, 10)
    );
    if (selectedKategori?.masterJenisTesId === 1) {
      formData.append(
        "pilihanJawaban",
        JSON.stringify(
          pilihanJawaban.map((pilihan) => ({
            teks_pilihan: pilihan.teks_pilihan,
            gambar_pilihan: pilihan.gambar_pilihan,
          }))
        )
      );
    }

    try {
      const response = await axios.put(`${BASE_URL}/soal/${idSoal}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        Swal.fire("Sukses!", "Soal berhasil diupdate!", "success");
        setTableKey((prevKey) => prevKey + 1);
        handleCloseModalSoal();
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengupdate soal: ${error.response?.data?.message || "Terjadi kesalahan"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/soal/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        const soal = response.data.data;
        setIdSoal(soal.id);
        setTeksSoal(soal.teks_soal || "");
        setKategoriTesId(soal.kategoriTesId);
        setGambarSoal(null);
        setPilihanJawaban(
          soal.pilihanJawaban || [
            { teks_pilihan: "", gambar_pilihan: null },
            { teks_pilihan: "", gambar_pilihan: null },
            { teks_pilihan: "", gambar_pilihan: null },
            { teks_pilihan: "", gambar_pilihan: null },
          ]
        );
        setEditMode(true);
        setOpenModalSoal(true);
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengambil data soal: ${error.response?.data?.message || "Terjadi kesalahan"}`,
        "error"
      );
    }
  };

  const handleDelete = useCallback(async (id, type) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: type === "kategori-tes"
        ? "Apakah Anda yakin ingin menghapus kategori tes ini? Tindakan ini akan menghapus semua data pengguna yang telah mengikuti tes dalam kategori ini, serta semua soal yang terkait dengan kategori ini"
        : "Apakah Anda yakin ingin menghapus soal ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${BASE_URL}/${type}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        Swal.fire(
          "Terhapus!",
          `${type === "kategori-tes" ? "Kategori Tes" : "Soal"} berhasil dihapus.`,
          "success"
        );
        setTableKey((prevKey) => prevKey + 1);
      } catch (error) {
        Swal.fire(
          "Gagal!",
          `Gagal menghapus ${type}: ${error.response?.data?.message || "Terjadi kesalahan"}`,
          "error"
        );
      }
    }
  }, []);

  const handleImportSoal = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("kategoriTesId", kategoriTesId);
    formData.append("jenis_soal", isPilihanGanda() ? "pilihan_ganda" : "essay");
    formData.append("excel_file", excelFile);

    try {
      const response = await axios.post(
        `${BASE_URL}/soal/import-excel`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        Swal.fire("Sukses!", "Soal berhasil diimport!", "success");
        setTableKey((prevKey) => prevKey + 1);
        setExcelFile(null);
        handleCloseModalSoal();
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengimport soal: ${error.response?.data?.message || "Terjadi kesalahan"}`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Action Buttons Component
  const ActionButtons = ({ onEdit, onDelete }) => (
    <SoftBox display="flex" justifyContent="center" gap={1}>
      {onEdit && (
        <SoftButton
          variant="text"
          color="info"
          size="small"
          onClick={onEdit}
          sx={{ minWidth: "auto", p: "6px" }}
        >
          <EditIcon fontSize="small" />
        </SoftButton>
      )}
      <SoftButton
        variant="text"
        color="error"
        size="small"
        onClick={onDelete}
        sx={{ minWidth: "auto", p: "6px" }}
      >
        <DeleteIcon fontSize="small" />
      </SoftButton>
    </SoftBox>
  );

  ActionButtons.propTypes = {
    onEdit: PropTypes.func,
    onDelete: PropTypes.func.isRequired,
  };

  // Prepare data for kategori table
  const getKategoriColumns = () => {
    return [
      { name: "no", align: "center", width: "5%" },
      { name: "kategori", align: "left", width: "40%" },
      { name: "jenis", align: "left", width: "25%" },
      { name: "waktu", align: "left", width: "20%" },
      { name: "aksi", align: "center", width: "10%" },
    ];
  };

  const getKategoriRows = () => {
    return listKategoriTes.map((item, index) => ({
      no: index + 1,
      kategori: item.nama_kategori_tes,
      jenis: item.masterJenisTes?.nama_jenis_tes || '-',
      waktu: item.waktu_pengerjaan || '-',
      aksi: <ActionButtons onDelete={() => handleDelete(item.id, "kategori-tes")} />,
    }));
  };

  // Prepare data for soal table
  const getSoalColumns = () => {
    return [
      { name: "no", align: "center", width: "5%" },
      { name: "soal", align: "left", width: "55%" },
      { name: "kategori", align: "left", width: "30%" },
      { name: "aksi", align: "center", width: "10%" },
    ];
  };

  const getSoalRows = () => {
    return soalData.map((item, index) => {
      let soalContent = '-';
      if (item.teks_soal) {
        soalContent = item.teks_soal;
      } else if (item.gambar_soal) {
        soalContent = (
          <img
            src={`${BASE_URL_NO_API}/${item.gambar_soal}`}
            alt="Soal"
            style={{ maxWidth: '100px', maxHeight: '100px' }}
          />
        );
      }

      return {
        no: index + 1,
        soal: soalContent,
        kategori: item.kategoriTes?.nama_kategori_tes || '-',
        aksi: (
          <ActionButtons
            onEdit={() => handleEditClick(item.id)}
            onDelete={() => handleDelete(item.id, "soal")}
          />
        ),
      };
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
              <SoftTypography variant="h5" fontWeight="medium">
                Manajemen Tes
              </SoftTypography>
            </SoftBox>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, bgcolor: 'white' }}>
              <Tabs
                value={activeTab}
                onChange={handleChange}
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '14px',
                    fontWeight: 600,
                    textTransform: 'none',
                    minWidth: 'auto',
                    px: 3,
                    color: 'rgba(0, 0, 0, 0.6)',
                  },
                  '& .Mui-selected': {
                    color: '#ffffff'
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#fafafa'
                  }
                }}
              >
                <Tab label="Manajemen Kategori" {...a11yProps(0)} />
                <Tab label="Manajemen Soal" {...a11yProps(1)} />
              </Tabs>
            </Box>

            {/* Tab Panel Kategori */}
            <CustomTabPanel value={activeTab} index={0}>
              <SoftBox display="flex" justifyContent="flex-end" mb={3}>
                <SoftButton
                  variant="gradient"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleOpenModalKategori}
                  size="small"
                  sx={{
                    background: 'linear-gradient(195deg, #cb0c9f, #9506a3)',
                    color: 'white',
                    fontSize: '13px',
                    '&:hover': {
                      background: 'linear-gradient(195deg, #b00b8a, #7a0588)'
                    }
                  }}
                >
                  TAMBAH KATEGORI
                </SoftButton>
              </SoftBox>

              {loadingData ? (
                <SoftBox display="flex" justifyContent="center" py={5}>
                  <CircularProgress size={40} sx={{ color: "#cb0c9f" }} />
                </SoftBox>
              ) : (
                <Table columns={getKategoriColumns()} rows={getKategoriRows()} />
              )}

              {/* Modal Kategori */}
              <Modal
                open={openModalKategori}
                onClose={handleCloseModalKategori}
                aria-labelledby="modal-kategori-title"
                aria-describedby="modal-kategori-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-kategori-title"
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
                    TAMBAH KATEGORI TES
                  </Typography>
                  <form onSubmit={handleTambahKategori}>
                    <TextField
                      fullWidth
                      label="Nama Kategori"
                      variant="outlined"
                      size="medium"
                      value={namaKategori}
                      onChange={(e) => setNamaKategori(e.target.value.toUpperCase())}
                      required
                      sx={{
                        mb: 2,
                        '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                        '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                      }}
                    />

                    <FormControl fullWidth size="medium" sx={{ mb: 2 }}>
                      <select
                        value={masterJenisTesId}
                        onChange={(e) => setMasterJenisTesId(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '8.5px 14px',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          backgroundColor: '#fff',
                          outline: 'none',
                        }}
                      >
                        <option value="">Pilih Jenis Tes</option>
                        {listJenisTes.map((jenis) => (
                          <option key={jenis.id} value={jenis.id}>
                            {jenis.nama_jenis_tes}
                          </option>
                        ))}
                      </select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Waktu Pengerjaan (HH:MM:SS)"
                      variant="outlined"
                      size="medium"
                      value={waktuPengerjaan}
                      onChange={(e) => {
                        let value = e.target.value;
                        value = value.replace(/[^0-9:]/g, "");
                        if (value.length <= 8) setWaktuPengerjaan(value);
                      }}
                      required
                      sx={{
                        mb: 2,
                        '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                        '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                      }}
                    />

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: '0.875rem' }}>
                        Instruksi Tes
                      </Typography>
                      <SimpleEditor
                        value={instruksiTes}
                        onChange={setInstruksiTes}
                      />
                    </Box>

                    <Box display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={handleCloseModalKategori}
                        size="small"
                        sx={{
                          fontSize: '0.875rem',
                          color: 'rgba(0, 0, 0, 0.87)'
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        size="small"
                        sx={{
                          fontSize: '0.875rem',
                          backgroundColor: '#cb0c9f',
                          '&:hover': { backgroundColor: '#b00b8a' },
                          color: '#ffffff' // Warna putih dalam hex
                        }}
                      >
                        {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : "Simpan"}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Modal>
            </CustomTabPanel>

            {/* Tab Panel Soal */}
            <CustomTabPanel value={activeTab} index={1}>
              <SoftBox display="flex" justifyContent="flex-end" mb={3}>
                <SoftButton
                  variant="gradient"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModalSoal('add')}
                  size="small"
                  sx={{
                    background: 'linear-gradient(195deg, #cb0c9f, #9506a3)',
                    color: 'white',
                    fontSize: '13px',
                    '&:hover': {
                      background: 'linear-gradient(195deg, #b00b8a, #7a0588)'
                    }
                  }}
                >
                  TAMBAH SOAL
                </SoftButton>
              </SoftBox>

              {loadingData ? (
                <SoftBox display="flex" justifyContent="center" py={5}>
                  <CircularProgress size={40} sx={{ color: "#cb0c9f" }} />
                </SoftBox>
              ) : (
                <Table columns={getSoalColumns()} rows={getSoalRows()} />
              )}

              {/* Modal Soal */}
              <Modal
                open={openModalSoal}
                onClose={handleCloseModalSoal}
                aria-labelledby="modal-soal-title"
                aria-describedby="modal-soal-description"
              >
                <Box sx={{ ...style, width: 700 }}>
                  <Typography
                    id="modal-soal-title"
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
                    {editMode ? "EDIT SOAL" : "TAMBAH SOAL"}
                  </Typography>
                  <form onSubmit={editMode ? handleEditSoal : handleTambahSoal}>
                    <Box sx={{ mb: 2 }}>
                      <select
                        value={kategoriTesId}
                        onChange={(e) => setKategoriTesId(e.target.value)}
                        required
                        style={{
                          width: '100%',
                          padding: '8.5px 14px',
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          backgroundColor: '#fff',
                          outline: 'none',
                        }}
                      >
                        <option value="">Pilih Kategori Soal</option>
                        {listKategoriTes.map((kategori) => (
                          <option key={kategori.id} value={kategori.id}>
                            {kategori.nama_kategori_tes}
                          </option>
                        ))}
                      </select>
                    </Box>

                    <TextField
                      fullWidth
                      label="Soal"
                      variant="outlined"
                      size="small"
                      multiline
                      rows={3}
                      value={teksSoal}
                      onChange={(e) => setTeksSoal(e.target.value)}
                      required
                      sx={{
                        mb: 2,
                        '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                        '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                      }}
                    />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom sx={{ fontSize: '0.875rem', mb: 1 }}>
                        Gambar Soal (Opsional)
                      </Typography>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setGambarSoal(e.target.files[0])}
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ced4da',
                          borderRadius: '4px',
                          fontSize: '0.875rem'
                        }}
                      />
                    </Box>

                    {isPilihanGanda() && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" fontWeight="medium" mb={2} sx={{ fontSize: '0.875rem' }}>
                          Opsi Jawaban:
                        </Typography>
                        {pilihanJawaban.map((pilihan, index) => (
                          <Box
                            key={index}
                            mb={2}
                            p={2}
                            sx={{
                              border: 1,
                              borderColor: '#e0e0e0',
                              borderRadius: 1,
                              backgroundColor: '#f9f9f9'
                            }}
                          >
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography
                                variant="body2"
                                sx={{
                                  minWidth: '24px',
                                  fontWeight: 'bold',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {String.fromCharCode(65 + index)}:
                              </Typography>
                              <TextField
                                fullWidth
                                size="small"
                                multiline
                                rows={2}
                                placeholder={`Opsi ${String.fromCharCode(65 + index)}`}
                                value={pilihan.teks_pilihan}
                                onChange={(e) => {
                                  const newPilihanJawaban = [...pilihanJawaban];
                                  newPilihanJawaban[index].teks_pilihan = e.target.value;
                                  setPilihanJawaban(newPilihanJawaban);
                                }}
                                sx={{
                                  '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                                  '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                                }}
                              />
                            </Box>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const newPilihanJawaban = [...pilihanJawaban];
                                newPilihanJawaban[index].gambar_pilihan = e.target.files[0];
                                setPilihanJawaban(newPilihanJawaban);
                              }}
                              style={{
                                width: '100%',
                                marginTop: '8px',
                                padding: '4px',
                                fontSize: '0.875rem'
                              }}
                            />
                          </Box>
                        ))}
                      </Box>
                    )}

                    <Box sx={{ borderTop: 1, borderColor: '#e0e0e0', pt: 3, mt: 2 }}>
                      <Typography variant="body2" fontWeight="medium" mb={2} sx={{ fontSize: '0.875rem' }}>
                        Import Soal dari Excel
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={(e) => setExcelFile(e.target.files[0])}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}
                        />
                      </Box>

                      <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                          variant="outlined"
                          onClick={handleImportSoal}
                          disabled={loading || !excelFile}
                          startIcon={<UploadIcon />}
                          size="small"
                          sx={{ fontSize: '0.875rem' }}
                        >
                          {loading ? "Mengimport..." : "Import Soal"}
                        </Button>
                      </Box>
                    </Box>

                    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                      <Button
                        variant="outlined"
                        onClick={handleCloseModalSoal}
                        size="small"
                        sx={{
                          fontSize: '0.875rem',
                          color: 'rgba(0, 0, 0, 0.87)'
                        }}
                      >
                        Batal
                      </Button>
                      <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        size="small"
                        sx={{
                          fontSize: '0.875rem',
                          backgroundColor: '#cb0c9f',
                          '&:hover': { backgroundColor: '#b00b8a' },
                          color: '#ffffff' // Warna putih dalam hex
                        }}
                      >
                        {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : "Simpan"}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Modal>
            </CustomTabPanel>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default ManajemenTes;