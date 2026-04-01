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

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

// MUI components
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PropTypes from 'prop-types';

// React Select
import Select from 'react-select';

// Config
import BASE_URL from "../../config/BASE_URL";

// Modal style
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

// Custom styles for react-select to match Soft UI
const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: '36px',
    fontSize: '0.875rem',
    borderColor: state.isFocused ? '#cb0c9f' : '#ced4da',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(203, 12, 159, 0.25)' : 'none',
    '&:hover': {
      borderColor: '#cb0c9f',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: '0.875rem',
    backgroundColor: state.isSelected ? '#cb0c9f' : state.isFocused ? '#f8f9fa' : null,
    color: state.isSelected ? 'white' : '#333',
    '&:active': {
      backgroundColor: '#b00b8a',
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: '0.875rem',
    color: '#6c757d',
  }),
  singleValue: (provided) => ({
    ...provided,
    fontSize: '0.875rem',
  }),
  input: (provided) => ({
    ...provided,
    fontSize: '0.875rem',
  }),
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

const ManajemenPengguna = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tableKey, setTableKey] = useState(0);
  const [adminTableKey, setAdminTableKey] = useState(0);

  // Modal states
  const [openModalUser, setOpenModalUser] = useState(false);
  const [openModalAdmin, setOpenModalAdmin] = useState(false);
  const [openUpdateUserModal, setOpenUpdateUserModal] = useState(false);
  const [openUpdateAdminModal, setOpenUpdateAdminModal] = useState(false);

  // Form states for user
  const [jumlah, setJumlah] = useState("");
  const [kota, setKota] = useState("");
  const [kesatuan, setKesatuan] = useState("");
  const [listKesatuan, setListKesatuan] = useState([]);
  const [pangkatList, setPangkatList] = useState([]);

  // Form states for admin
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminRole, setAdminRole] = useState("ADMIN");

  // Update states
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [adminToUpdate, setAdminToUpdate] = useState(null);
  const [updatedBiodata, setUpdatedBiodata] = useState({});

  // Data states
  const [userData, setUserData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const userRows = useMemo(() => getUserRows(), [userData]);
  const userColumns = useMemo(() => getUserColumns(), []);

  const role = sessionStorage.getItem("role");

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fetch data kesatuan
  useEffect(() => {
    const fetchKesatuan = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${BASE_URL}/master-kesatuan`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setListKesatuan(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data kesatuan:", error);
      }
    };

    fetchKesatuan();
  }, []);

  // Fetch data pangkat
  useEffect(() => {
    const fetchPangkat = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${BASE_URL}/master-pangkat`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPangkatList(response.data.data);
      } catch (error) {
        console.error("Gagal mengambil data pangkat:", error);
      }
    };

    fetchPangkat();
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      setLoadingData(true);
      try {
        const response = await axios.get(`${BASE_URL}/user-biodata`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "success") {
          setUserData(response.data.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [tableKey]);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      setLoadingData(true);
      try {
        const response = await axios.get(`${BASE_URL}/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.status === "success") {
          setAdminData(response.data.data.admins);
        }
      } catch (error) {
        console.error("Gagal mengambil data admin:", error);
      } finally {
        setLoadingData(false);
      }
    };

    if (role === "SUPERADMIN") {
      fetchAdminData();
    }
  }, [adminTableKey, role]);

  const handleDelete = useCallback(async (id, type) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
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
          `${type === "admins" ? "Admin" : "Pengguna"} berhasil dihapus.`,
          "success"
        );
        type === "admins"
          ? setAdminTableKey((prevKey) => prevKey + 1)
          : setTableKey((prevKey) => prevKey + 1);
      } catch (error) {
        Swal.fire(
          "Gagal!",
          `Gagal menghapus ${type}: ${error.response?.data?.message || "Terjadi kesalahan"
          }`,
          "error"
        );
      }
    }
  }, []);

  const handleNewAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/admins`,
        { username: adminUsername, password: adminPassword, role: adminRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Sukses!", "Admin berhasil ditambahkan!", "success");
      setAdminUsername("");
      setAdminPassword("");
      setAdminRole("ADMIN");
      setAdminTableKey((prevKey) => prevKey + 1);
      setOpenModalAdmin(false);
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Tambah admin gagal: ${error.response?.data?.message || "Terjadi kesalahan"
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    try {
      const jumlahNumerik = parseInt(jumlah, 10);
      if (isNaN(jumlahNumerik)) {
        Swal.fire("Error", "Jumlah harus berupa angka", "error");
        setLoading(false);
        return;
      }

      const masterKesatuanId = parseInt(kesatuan, 10);
      if (isNaN(masterKesatuanId)) {
        Swal.fire("Error", "Kesatuan tidak valid", "error");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/users/batch`,
        { masterKesatuanId, nama_kota: kota, jumlah: jumlahNumerik },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      Swal.fire("Sukses!", "Pengguna berhasil ditambahkan!", "success");
      setJumlah("");
      setKesatuan("");
      setKota("");
      setTableKey((prevKey) => prevKey + 1);
      setOpenModalUser(false);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Gagal!",
        `Tambah data gagal: ${error.response?.data?.message || "Terjadi kesalahan"
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/user-biodata/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserToUpdate(response.data.data);
      setUpdatedBiodata(response.data.data);
      setOpenUpdateUserModal(true);
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengambil data pengguna: ${error.response?.data?.message || "Terjadi kesalahan"
        }`,
        "error"
      );
    }
  };

  const handleEditAdmin = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminToUpdate(response.data.data);
      setOpenUpdateAdminModal(true);
    } catch (error) {
      Swal.fire(
        "Gagal!",
        `Gagal mengambil data admin: ${error.response?.data?.message || "Terjadi kesalahan"
        }`,
        "error"
      );
    }
  };

  const handleUpdateBiodata = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    try {
      const payload = {
        ...updatedBiodata,
        masterPangkatId: updatedBiodata.masterPangkatId,
      };
      const response = await axios.put(
        `${BASE_URL}/user-biodata/${userToUpdate.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.status === "success") {
        Swal.fire("Berhasil!", "Biodata berhasil diperbarui.", "success");
        setOpenUpdateUserModal(false);
        setTableKey((prevKey) => prevKey + 1);
      } else {
        Swal.fire(
          "Gagal!",
          response.data.message || "Gagal memperbarui biodata.",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        error.response?.data?.message || "Gagal memperbarui biodata.",
        "error"
      );
    }
  };

  // PERBAIKAN: Handle update admin dengan payload sesuai format
  const handleUpdateAdmin = async (e) => {
    e.preventDefault(); // Mencegah refresh halaman
    setLoading(true);

    const token = sessionStorage.getItem("token");
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    // Validasi input
    if (!adminToUpdate?.username?.trim()) {
      Swal.fire("Error", "Username tidak boleh kosong", "error");
      setLoading(false);
      return;
    }

    try {
      // Buat payload dengan format yang benar
      const payload = {
        username: adminToUpdate.username,
        role: adminToUpdate.role,
      };

      // Hanya tambahkan password jika diisi dan tidak kosong
      if (adminToUpdate.password && adminToUpdate.password.trim() !== "") {
        payload.password = adminToUpdate.password;
      }

      console.log("Sending payload:", payload); // Untuk debugging

      const response = await axios.put(
        `${BASE_URL}/admins/${adminToUpdate.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response.data.status === "success") {
        Swal.fire("Berhasil!", "Admin berhasil diperbarui.", "success");
        setOpenUpdateAdminModal(false);
        setAdminToUpdate(null); // Reset state
        setAdminTableKey((prevKey) => prevKey + 1); // Refresh data
      } else {
        Swal.fire(
          "Gagal!",
          response.data.message || "Gagal memperbarui admin.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating admin:", error);

      // Tangani error dengan lebih baik
      let errorMessage = "Gagal memperbarui admin.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        // Jika error terkait username sudah digunakan
        if (errorMessage.toLowerCase().includes("username sudah digunakan") ||
          errorMessage.toLowerCase().includes("already exists")) {
          errorMessage = "Username sudah digunakan. Silakan pilih username lain.";
        }
        // Jika error terkait validasi Prisma
        else if (errorMessage.includes("prisma") || errorMessage.includes("Argument")) {
          errorMessage = "Terjadi kesalahan validasi data. Silakan coba lagi atau hubungi administrator.";
        }
      }

      Swal.fire("Gagal!", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleJumlahChange = (e) => {
    let newValue = e.target.value.replace(/\D/g, "");
    if (newValue.length > 4) newValue = newValue.slice(0, 4);
    setJumlah(newValue);
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminToUpdate({ ...adminToUpdate, [name]: value });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBiodata({ ...updatedBiodata, [name]: value });
  };

  // User table columns
  const getUserColumns = () => {
    return [
      { name: "no", align: "center", width: "5%" },
      { name: "username", align: "left", width: "10%" },
      { name: "nama lengkap", align: "left", width: "15%" },
      { name: "pangkat", align: "left", width: "10%" },
      { name: "nrp", align: "left", width: "10%" },
      { name: "jabatan", align: "left", width: "15%" },
      { name: "kesatuan", align: "left", width: "15%" },
      { name: "alamat", align: "left", width: "15%" },
      { name: "aksi", align: "center", width: "5%" },
    ];
  };

  const getUserRows = () => {
    return userData.map((item, index) => ({
      no: index + 1,
      username: item.username || '-',
      'nama lengkap': item.nama_lengkap || '-',
      pangkat: item.pangkat || '-',
      nrp: item.nrp || '-',
      jabatan: item.jabatan || '-',
      kesatuan: item.kesatuan || '-',
      alamat: item.alamat || '-',
      aksi: (
        <ActionButtons
          onEdit={() => handleEditUser(item.id)}
          onDelete={() => handleDelete(item.id, "users")}
        />
      ),
    }));
  };

  // Admin table columns
  const getAdminColumns = () => {
    return [
      { name: "no", align: "center", width: "10%" },
      { name: "username", align: "left", width: "40%" },
      { name: "role", align: "left", width: "30%" },
      { name: "aksi", align: "center", width: "20%" },
    ];
  };

  const getAdminRows = () => {
    return adminData.map((item, index) => ({
      no: index + 1,
      username: item.username || '-',
      role: item.role || '-',
      aksi: (
        <ActionButtons
          onEdit={() => handleEditAdmin(item.id)}
          onDelete={() => handleDelete(item.id, "admins")}
        />
      ),
    }));
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="medium" color="info" gutterBottom>
                Manajemen Pengguna
              </SoftTypography>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': {
                      fontSize: '14px',
                      fontWeight: 600,
                      textTransform: 'none',
                      minWidth: 'auto',
                      px: 3,
                    },
                    '& .Mui-selected': {
                      color: '#ffffff'
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#ffffff'
                    }
                  }}
                >
                  <Tab label="Manajemen Peserta" {...a11yProps(0)} />
                  {role === "SUPERADMIN" && (
                    <Tab label="Manajemen Admin" {...a11yProps(1)} />
                  )}
                </Tabs>
              </Box>

              {/* Tab Panel Peserta */}
              <CustomTabPanel value={activeTab} index={0}>
                <SoftBox display="flex" justifyContent="flex-end" mb={3}>
                  <SoftButton
                    variant="gradient"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenModalUser(true)}
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
                    TAMBAH PENGGUNA
                  </SoftButton>
                </SoftBox>

                {loadingData ? (
                  <SoftBox display="flex" justifyContent="center" py={5}>
                    <CircularProgress size={40} sx={{ color: "#cb0c9f" }} />
                  </SoftBox>
                ) : (
                  <Table columns={userColumns} rows={userRows} />
                )}

                {/* Modal Tambah User */}
                <Modal
                  open={openModalUser}
                  onClose={() => setOpenModalUser(false)}
                  aria-labelledby="modal-user-title"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-user-title"
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
                      TAMBAH PENGGUNA BARU
                    </Typography>

                    <form onSubmit={handleNewUser}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                          Kesatuan
                        </Typography>
                        <Select
                          options={listKesatuan.map(item => ({ value: item.id, label: item.nama_kesatuan }))}
                          value={listKesatuan.find(item => item.id === parseInt(kesatuan)) ?
                            { value: parseInt(kesatuan), label: listKesatuan.find(item => item.id === parseInt(kesatuan))?.nama_kesatuan } :
                            null}
                          onChange={(selected) => setKesatuan(selected ? selected.value : '')}
                          placeholder="Pilih kesatuan..."
                          isClearable
                          required
                          styles={selectStyles}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Nama Kota"
                        variant="outlined"
                        size="small"
                        value={kota}
                        onChange={(e) => setKota(e.target.value.toUpperCase())}
                        required
                        sx={{
                          mb: 2,
                          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                          '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Jumlah"
                        variant="outlined"
                        size="small"
                        type="number"
                        value={jumlah}
                        onChange={handleJumlahChange}
                        required
                        sx={{
                          mb: 2,
                          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                          '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                        }}
                      />

                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontSize: '0.875rem' }}>
                          Import Excel
                        </Typography>
                        <input
                          type="file"
                          accept=".xls,.xlsx"
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                          }}
                        />
                      </Box>

                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenModalUser(false)}
                          size="small"
                          sx={{
                            fontSize: '0.875rem',
                            color: 'rgba(0, 0, 0, 0.87)'
                          }}                        >
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
                            color: 'white'
                          }}
                        >
                          {loading ? <CircularProgress size={20} sx={{ color: '#ffff' }} /> : "Simpan"}
                        </Button>
                      </Box>
                    </form>
                  </Box>
                </Modal>

                {/* Update User Modal */}
                <Modal
                  open={openUpdateUserModal}
                  onClose={() => setOpenUpdateUserModal(false)}
                  aria-labelledby="update-user-title"
                >
                  <Box sx={style}>
                    <Typography
                      id="update-user-title"
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
                      UPDATE BIODATA
                    </Typography>

                    <Box>
                      <TextField
                        fullWidth
                        label="Nama Lengkap"
                        variant="outlined"
                        size="small"
                        name="nama_lengkap"
                        value={updatedBiodata.nama_lengkap || ""}
                        onChange={handleUserChange}
                        sx={{
                          mb: 2,
                          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                          '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="NRP"
                        variant="outlined"
                        size="small"
                        name="nrp"
                        value={updatedBiodata.nrp || ""}
                        onChange={handleUserChange}
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        sx={{
                          mb: 2,
                          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                          '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                        }}
                      />

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                          Pangkat
                        </Typography>
                        <Select
                          options={pangkatList.map(item => ({ value: item.id, label: item.nama_pangkat }))}
                          value={pangkatList.find(item => item.id === parseInt(updatedBiodata.masterPangkatId)) ?
                            { value: parseInt(updatedBiodata.masterPangkatId), label: pangkatList.find(item => item.id === parseInt(updatedBiodata.masterPangkatId))?.nama_pangkat } :
                            null}
                          onChange={(selected) => handleUserChange({
                            target: { name: 'masterPangkatId', value: selected ? selected.value : '' }
                          })}
                          placeholder="Pilih pangkat..."
                          isClearable
                          styles={selectStyles}
                        />
                      </Box>

                      <TextField
                        fullWidth
                        label="Jabatan"
                        variant="outlined"
                        size="small"
                        name="jabatan"
                        value={updatedBiodata.jabatan || ""}
                        onChange={handleUserChange}
                        sx={{
                          mb: 2,
                          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                          '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Alamat"
                        variant="outlined"
                        size="small"
                        name="alamat"
                        multiline
                        rows={3}
                        value={updatedBiodata.alamat || ""}
                        onChange={handleUserChange}
                        sx={{
                          mb: 3,
                          '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                          '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                        }}
                      />

                      <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                          variant="outlined"
                          onClick={() => setOpenUpdateUserModal(false)}
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
                          onClick={handleUpdateBiodata}
                          size="small"
                          sx={{
                            fontSize: '0.875rem',
                            backgroundColor: '#cb0c9f',
                            '&:hover': { backgroundColor: '#b00b8a' },
                            color: '#ffff'
                          }}
                        >
                          Simpan
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Modal>
              </CustomTabPanel>

              {/* Tab Panel Admin */}
              {role === "SUPERADMIN" && (
                <CustomTabPanel value={activeTab} index={1}>
                  <SoftBox display="flex" justifyContent="flex-end" mb={3}>
                    <SoftButton
                      variant="gradient"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenModalAdmin(true)}
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
                      TAMBAH ADMIN
                    </SoftButton>
                  </SoftBox>

                  {loadingData ? (
                    <SoftBox display="flex" justifyContent="center" py={5}>
                      <CircularProgress size={40} sx={{ color: "#cb0c9f" }} />
                    </SoftBox>
                  ) : (
                    <Table columns={getAdminColumns()} rows={getAdminRows()} />
                  )}

                  {/* Modal Tambah Admin */}
                  <Modal
                    open={openModalAdmin}
                    onClose={() => setOpenModalAdmin(false)}
                    aria-labelledby="modal-admin-title"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-admin-title"
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
                        TAMBAH ADMIN BARU
                      </Typography>

                      <form onSubmit={handleNewAdmin}>
                        <TextField
                          fullWidth
                          label="Username"
                          variant="outlined"
                          size="small"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          required
                          sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                            '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Password"
                          variant="outlined"
                          size="small"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                          sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                            '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                          }}
                        />

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                            Role
                          </Typography>
                          <Select
                            options={[
                              { value: 'ADMIN', label: 'ADMIN' },
                              { value: 'SUPERADMIN', label: 'SUPERADMIN' }
                            ]}
                            value={adminRole ? { value: adminRole, label: adminRole } : null}
                            onChange={(selected) => setAdminRole(selected ? selected.value : '')}
                            placeholder="Pilih role..."
                            styles={selectStyles}
                          />
                        </Box>

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                          <Button
                            variant="outlined"
                            onClick={() => setOpenModalAdmin(false)}
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
                              color: 'white'
                            }}
                          >
                            {loading ? <CircularProgress size={20} sx={{ color: '#ffff' }} /> : "Simpan"}
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  </Modal>

                  {/* PERBAIKAN: Update Admin Modal dengan form yang benar */}
                  <Modal
                    open={openUpdateAdminModal}
                    onClose={() => {
                      setOpenUpdateAdminModal(false);
                      setAdminToUpdate(null); // Reset state saat modal ditutup
                    }}
                    aria-labelledby="update-admin-title"
                  >
                    <Box sx={style}>
                      <Typography
                        id="update-admin-title"
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
                        UPDATE ADMIN
                      </Typography>

                      <form onSubmit={handleUpdateAdmin}>
                        <TextField
                          fullWidth
                          label="Username"
                          variant="outlined"
                          size="small"
                          name="username"
                          value={adminToUpdate?.username || ""}
                          onChange={handleAdminChange}
                          required
                          sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                            '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                          }}
                        />

                        <TextField
                          fullWidth
                          label="Password (Kosongkan jika tidak diubah)"
                          variant="outlined"
                          size="small"
                          type="password"
                          name="password"
                          value={adminToUpdate?.password || ""}
                          onChange={handleAdminChange}
                          placeholder="Biarkan kosong jika tidak ingin mengubah password"
                          sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': { fontSize: '0.875rem' },
                            '& .MuiOutlinedInput-input': { fontSize: '0.875rem' }
                          }}
                        />

                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.875rem', fontWeight: 500 }}>
                            Role
                          </Typography>
                          <Select
                            options={[
                              { value: 'ADMIN', label: 'ADMIN' },
                              { value: 'SUPERADMIN', label: 'SUPERADMIN' }
                            ]}
                            value={adminToUpdate?.role ? { value: adminToUpdate.role, label: adminToUpdate.role } : null}
                            onChange={(selected) => handleAdminChange({
                              target: { name: 'role', value: selected ? selected.value : '' }
                            })}
                            placeholder="Pilih role..."
                            styles={selectStyles}
                            required
                          />
                        </Box>

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setOpenUpdateAdminModal(false);
                              setAdminToUpdate(null);
                            }}
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
                              color: '#ffffff'
                            }}
                          >
                            {loading ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : "Simpan"}
                          </Button>
                        </Box>
                      </form>
                    </Box>
                  </Modal>
                </CustomTabPanel>
              )}
            </SoftBox>
          </Card>
        </SoftBox>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default ManajemenPengguna;