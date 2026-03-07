import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import SoftSelect from "components/SoftSelect"; // Jika ada, atau gunakan Select MUI

// Soft UI Dashboard React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Images
import BASE_URL from "../../config/BASE_URL";

// Icons
import {
  Person,
  Badge,
  Star,
  Business,
  Shield,
  LocationOn,
  Edit,
  Logout,
  Print,
  Share,
  QrCodeScanner,
  Save,
  Close,
} from "@mui/icons-material";

const DetailProfile = () => {
  const navigate = useNavigate();
  const [biodata, setBiodata] = useState({});
  const [kesatuanList, setKesatuanList] = useState([]);
  const [pangkatList, setPangkatList] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedBiodata, setUpdatedBiodata] = useState({});
  const [loading, setLoading] = useState(false);

  const token = sessionStorage.getItem("token");
  if (!token) {
    Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
    navigate("/login");
    return null;
  }

  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  // Fetch biodata
  const fetchBiodata = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user-biodata/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBiodata(response.data.data);
      setUpdatedBiodata(response.data.data);
    } catch (error) {
      Swal.fire("Gagal!", "Gagal mengambil data Biodata.", "error");
    }
  };

  // Fetch kesatuan and pangkat
  const fetchKesatuanPangkat = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/masters/kesatuan-pangkat`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status === "success") {
        const { kesatuan, pangkat } = response.data.data;
        setKesatuanList(kesatuan || []);
        setPangkatList(pangkat || []);
      }
    } catch (error) {
      Swal.fire("Gagal!", "Gagal mengambil data master.", "error");
    }
  };

  // Handle input change in update form
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pangkat") {
      setUpdatedBiodata({ ...updatedBiodata, masterPangkatId: Number(value) });
    } else if (name === "kesatuan") {
      setUpdatedBiodata({ ...updatedBiodata, masterKesatuanId: Number(value) });
    } else {
      setUpdatedBiodata({ ...updatedBiodata, [name]: value });
    }
  };

  // Handle update biodata
  const handleUpdateBiodata = async () => {
    setLoading(true);
    try {
      const payload = {
        ...updatedBiodata,
        masterPangkatId: updatedBiodata.masterPangkatId,
        masterKesatuanId: updatedBiodata.masterKesatuanId,
      };
      const response = await axios.put(
        `${BASE_URL}/user-biodata/${userId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.status === "success") {
        Swal.fire("Berhasil!", "Biodata berhasil diperbarui.", "success");
        setShowUpdateModal(false);
        fetchBiodata();
      }
    } catch (error) {
      Swal.fire(
        "Gagal!",
        error.response?.data?.message || "Gagal memperbarui biodata.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBiodata();
    fetchKesatuanPangkat();
  }, []);

  // Format data untuk select
  const pangkatOptions = pangkatList.map((item) => ({
    value: item.id,
    label: item.nama_pangkat,
  }));

  const kesatuanOptions = kesatuanList.map((item) => ({
    value: item.id,
    label: item.nama_kesatuan,
  }));

  // Profile items configuration
  const profileItems = [
    {
      label: "Nama Lengkap",
      value: biodata.nama_lengkap,
      icon: <Person />,
      color: "#cb0c9f",
    },
    {
      label: "NRP",
      value: biodata.nrp,
      icon: <Badge />,
      color: "#17c1e8",
    },
    {
      label: "Pangkat",
      value: biodata.pangkat,
      icon: <Star />,
      color: "#ff9800",
    },
    {
      label: "Jabatan",
      value: biodata.jabatan,
      icon: <Business />,
      color: "#4caf50",
    },
    {
      label: "Kesatuan",
      value: biodata.kesatuan,
      icon: <Shield />,
      color: "#f44335",
    },
    {
      label: "Alamat",
      value: biodata.alamat,
      icon: <LocationOn />,
      color: "#9c27b0",
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <SoftBox mt={4}>
        <Grid container spacing={3}>
          {/* Left Side - Profile Info */}
          <Grid item xs={12} lg={8}>
            <SoftBox mb={3}>
              <SoftTypography variant="h3" fontWeight="bold" color="info" gutterBottom>
                Profil Peserta
              </SoftTypography>
              <SoftBox
                width="60px"
                height="4px"
                bgColor="info"
                borderRadius="md"
                mb={1}
              />
              <SoftTypography variant="body2" color="text">
                Kelola informasi profil Anda
              </SoftTypography>
            </SoftBox>

            <Card>
              <SoftBox p={3}>
                {/* Profile Avatar */}
                <SoftBox display="flex" alignItems="center" mb={4}>
                  <SoftBox
                    width="80px"
                    height="80px"
                    borderRadius="50%"
                    bgColor="info"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    position="relative"
                  >
                    <SoftTypography variant="h2" color="white">
                      {biodata.nama_lengkap ? (
                        biodata.nama_lengkap.charAt(0).toUpperCase()
                      ) : (
                        <Person />
                      )}
                    </SoftTypography>
                    <SoftBox
                      width="15px"
                      height="15px"
                      borderRadius="50%"
                      bgColor="success"
                      border="2px solid white"
                      position="absolute"
                      bottom="5px"
                      right="5px"
                    />
                  </SoftBox>
                </SoftBox>

                {/* Profile Info Grid */}
                <Grid container spacing={2}>
                  {profileItems.map((item, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <SoftBox
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={2}
                        bgColor="#f8f9fa"
                        borderRadius="lg"
                        sx={{ transition: "all 0.3s ease" }}
                      >
                        <SoftBox
                          width="40px"
                          height="40px"
                          borderRadius="50%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bgColor={`${item.color}15`}
                          color={item.color}
                        >
                          {item.icon}
                        </SoftBox>
                        <SoftBox>
                          <SoftTypography variant="caption" color="text" fontWeight="medium">
                            {item.label}
                          </SoftTypography>
                          <SoftTypography variant="body2" fontWeight="bold">
                            {item.value || "-"}
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>
                    </Grid>
                  ))}
                </Grid>
              </SoftBox>
            </Card>
          </Grid>

          {/* Right Side - Actions */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: "100%" }}>
              <SoftBox p={3} display="flex" flexDirection="column" height="100%">
                <SoftTypography variant="h5" fontWeight="bold" textAlign="center" mb={3}>
                  Aksi Profil
                </SoftTypography>

                <SoftBox display="flex" flexDirection="column" gap={2} flexGrow={1}>
                  <SoftButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    size="large"
                    onClick={() => setShowUpdateModal(true)}
                    startIcon={<Edit />}
                  >
                    Update Profil
                  </SoftButton>

                  <SoftButton
                    variant="outlined"
                    color="error"
                    fullWidth
                    size="large"
                    onClick={() => setShowLogoutModal(true)}
                    startIcon={<Logout />}
                  >
                    Keluar
                  </SoftButton>

                  <SoftBox mt={4} display="flex" justifyContent="center" gap={2}>
                    <SoftButton variant="text" color="dark" size="small" circular>
                      <Print />
                    </SoftButton>
                    <SoftButton variant="text" color="dark" size="small" circular>
                      <Share />
                    </SoftButton>
                    <SoftButton variant="text" color="dark" size="small" circular>
                      <QrCodeScanner />
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        aria-labelledby="logout-modal-title"
      >
        <SoftBox
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
          width={{ xs: "90%", sm: 400 }}
        >
          <Card>
            <SoftBox p={3} textAlign="center">
              <SoftBox
                width="60px"
                height="60px"
                borderRadius="50%"
                bgColor="error"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mx="auto"
                mb={3}
              >
                <Logout sx={{ color: "white", fontSize: 24 }} />
              </SoftBox>

              <SoftTypography variant="h5" fontWeight="bold" gutterBottom>
                Konfirmasi Logout
              </SoftTypography>
              
              <SoftTypography variant="body2" color="text" mb={3}>
                Anda akan keluar dari sistem. Pastikan semua perubahan telah disimpan.
              </SoftTypography>

              <SoftBox display="flex" gap={2}>
                <SoftButton
                  variant="outlined"
                  color="dark"
                  fullWidth
                  onClick={() => setShowLogoutModal(false)}
                  startIcon={<Close />}
                >
                  Batal
                </SoftButton>
                <SoftButton
                  variant="gradient"
                  color="error"
                  fullWidth
                  onClick={handleLogout}
                  startIcon={<Logout />}
                >
                  Ya, Keluar
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </Card>
        </SoftBox>
      </Modal>

      {/* Update Biodata Modal */}
      <Modal
        open={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        aria-labelledby="update-modal-title"
      >
        <SoftBox
          position="absolute"
          top="50%"
          left="50%"
          sx={{ transform: "translate(-50%, -50%)" }}
          width={{ xs: "90%", sm: 600 }}
        >
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="bold" mb={3}>
                <Edit sx={{ mr: 1, verticalAlign: "middle" }} />
                Update Biodata
              </SoftTypography>

              <Grid container spacing={2}>
                {/* Nama Lengkap */}
                <Grid item xs={12} md={6}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    Nama Lengkap
                  </SoftTypography>
                  <SoftInput
                    fullWidth
                    name="nama_lengkap"
                    value={updatedBiodata.nama_lengkap || ""}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    startAdornment={<Person sx={{ color: "#cb0c9f" }} />}
                  />
                </Grid>

                {/* NRP */}
                <Grid item xs={12} md={6}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    NRP
                  </SoftTypography>
                  <SoftInput
                    fullWidth
                    name="nrp"
                    value={updatedBiodata.nrp || ""}
                    onChange={handleChange}
                    placeholder="Masukkan NRP"
                    onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
                    startAdornment={<Badge sx={{ color: "#17c1e8" }} />}
                  />
                </Grid>

                {/* Pangkat */}
                <Grid item xs={12} md={6}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    Pangkat
                  </SoftTypography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="pangkat"
                      value={updatedBiodata.masterPangkatId || ""}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: "8px",
                        height: "44px",
                      }}
                    >
                      <MenuItem value="" disabled>Pilih Pangkat</MenuItem>
                      {pangkatList.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nama_pangkat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Jabatan */}
                <Grid item xs={12} md={6}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    Jabatan
                  </SoftTypography>
                  <SoftInput
                    fullWidth
                    name="jabatan"
                    value={updatedBiodata.jabatan || ""}
                    onChange={handleChange}
                    placeholder="Masukkan jabatan"
                    startAdornment={<Business sx={{ color: "#4caf50" }} />}
                  />
                </Grid>

                {/* Kesatuan */}
                <Grid item xs={12}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    Kesatuan
                  </SoftTypography>
                  <FormControl fullWidth size="small">
                    <Select
                      name="kesatuan"
                      value={updatedBiodata.masterKesatuanId || ""}
                      onChange={handleChange}
                      displayEmpty
                      sx={{
                        borderRadius: "8px",
                        height: "44px",
                      }}
                    >
                      <MenuItem value="" disabled>Pilih Kesatuan</MenuItem>
                      {kesatuanList.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.nama_kesatuan}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Alamat */}
                <Grid item xs={12}>
                  <SoftTypography variant="caption" fontWeight="bold" color="text" display="block" mb={0.5}>
                    Alamat
                  </SoftTypography>
                  <SoftInput
                    fullWidth
                    multiline
                    rows={3}
                    name="alamat"
                    value={updatedBiodata.alamat || ""}
                    onChange={handleChange}
                    placeholder="Masukkan alamat"
                    startAdornment={<LocationOn sx={{ color: "#9c27b0" }} />}
                  />
                </Grid>
              </Grid>

              <SoftBox display="flex" gap={2} mt={3}>
                <SoftButton
                  variant="outlined"
                  color="dark"
                  fullWidth
                  onClick={() => setShowUpdateModal(false)}
                  startIcon={<Close />}
                >
                  Batal
                </SoftButton>
                <SoftButton
                  variant="gradient"
                  color="info"
                  fullWidth
                  onClick={handleUpdateBiodata}
                  disabled={loading}
                  startIcon={<Save />}
                >
                  {loading ? "Menyimpan..." : "Simpan Perubahan"}
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

export default DetailProfile;