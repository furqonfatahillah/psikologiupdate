import { useState } from "react";
import Card from "@mui/material/Card";
import { FormControl, FormLabel } from "@mui/material";
import { CheckCircle, CloudUpload } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from "axios";

// Soft UI
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import BASE_URL from "../../config/BASE_URL";

function ManajemenTampilan() {
  const [loading, setLoading] = useState(false);
  const [importBackground, setImportBackground] = useState(null);
  const token = sessionStorage.getItem("token");

  const handleNewBackground = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      setLoading(false);
      return;
    }

    if (!importBackground) {
      Swal.fire("Error", "Silakan pilih file background", "error");
      setLoading(false);
      return;
    }

    // Validasi ukuran file
    if (importBackground.size > 10 * 1024 * 1024) {
      // 10MB
      Swal.fire("Error", "Ukuran file tidak boleh lebih dari 10MB", "error");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("background", importBackground);

    try {
      const response = await axios.post(
        `${BASE_URL}/background/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire("Sukses!", "Background berhasil diperbarui!", "success");
      setImportBackground(null);
    } catch (error) {
      console.error("Error:", error);
      Swal.fire(
        "Gagal!",
        `Tambah data gagal: ${
          error.response?.data?.message || "Terjadi kesalahan"
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

      <SoftBox py={3}>
        {/* Header Section */}
        <SoftBox mb={3}>
          <SoftTypography variant="h3" fontWeight="bold" color="info" gutterBottom>
            Manajemen Tampilan
          </SoftTypography>
          <SoftTypography variant="body2" color="text">
            Kelola tampilan background aplikasi Anda
          </SoftTypography>
        </SoftBox>

        {/* Upload Card */}
        <SoftBox component={Card} p={3}>
          <SoftBox mb={3}>
            <SoftTypography variant="h5" fontWeight="medium" color="info">
              Unggah Latar Belakang Baru
            </SoftTypography>
            <SoftTypography variant="caption" color="text">
              Pilih gambar untuk dijadikan background baru
            </SoftTypography>
          </SoftBox>

          <SoftBox component="form" onSubmit={handleNewBackground}>
            <SoftBox mb={3}>
              <SoftTypography
                variant="body2"
                fontWeight="medium"
                color="text"
                mb={1}
              >
                Pilih Gambar
                <SoftTypography
                  variant="caption"
                  color="text"
                  fontWeight="regular"
                  ml={1}
                >
                  (Format: JPG/PNG, Maksimal 10MB)
                </SoftTypography>
              </SoftTypography>

              <SoftBox
                sx={{
                  border: "1px dashed",
                  borderColor: "secondary.main",
                  borderRadius: "8px",
                  p: 3,
                  textAlign: "center",
                  bgcolor: "grey.100",
                  transition: "all 0.3s",
                  "&:hover": {
                    borderColor: "info.main",
                    bgcolor: "grey.200",
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImportBackground(e.target.files[0])}
                  style={{ display: "none" }}
                  id="backgroundUpload"
                />
                <label htmlFor="backgroundUpload">
                  <SoftButton
                    component="span"
                    variant="gradient"
                    color="info"
                    size="small"
                    startIcon={<CloudUpload />}
                  >
                    Pilih File
                  </SoftButton>
                </label>

                {importBackground && (
                  <SoftBox mt={2} display="flex" alignItems="center" justifyContent="center">
                    <CheckCircle color="success" sx={{ mr: 1, fontSize: 18 }} />
                    <SoftTypography variant="caption" color="success">
                      {importBackground.name} (
                      {Math.round(importBackground.size / 1024)} KB)
                    </SoftTypography>
                  </SoftBox>
                )}

                <SoftTypography
                  variant="caption"
                  color="text"
                  display="block"
                  mt={2}
                >
                  Ukuran disarankan: 1920x1080px
                </SoftTypography>
              </SoftBox>
            </SoftBox>

            <SoftBox mt={4}>
              <SoftButton
                type="submit"
                variant="gradient"
                color="info"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? (
                  <SoftBox display="flex" alignItems="center" justifyContent="center">
                    <SoftBox
                      component="span"
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: "white",
                        borderTopColor: "transparent",
                        animation: "spin 1s linear infinite",
                        mr: 2,
                        "@keyframes spin": {
                          "0%": { transform: "rotate(0deg)" },
                          "100%": { transform: "rotate(360deg)" },
                        },
                      }}
                    />
                    Memproses...
                  </SoftBox>
                ) : (
                  "Simpan Perubahan"
                )}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>

        {/* Preview Section */}
        {importBackground && (
          <SoftBox component={Card} p={3} mt={3}>
            <SoftBox mb={3}>
              <SoftTypography variant="h5" fontWeight="medium" color="info">
                Pratinjau
              </SoftTypography>
            </SoftBox>

            <SoftBox
              sx={{
                position: "relative",
                width: "100%",
                paddingTop: "56.25%", // 16:9 Aspect Ratio
                bgcolor: "grey.100",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <SoftBox
                component="img"
                src={URL.createObjectURL(importBackground)}
                alt="Preview"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </SoftBox>
          </SoftBox>
        )}
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default ManajemenTampilan;