import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import BASE_URL from "../../config/BASE_URL";

// Soft UI
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import SoftBox from "components/SoftBox";

// MUI
import Grid from "@mui/material/Grid";

function Dashboard() {
  const [jumlahKategori, setJumlahKategori] = useState(0);
  const [jumlahUser, setJumlahUser] = useState({ total: 0 });

  const [barChartData, setBarChartData] = useState({
    chart: {
      labels: [],
      datasets: {
        label: "Total Participants per Kesatuan",
        data: [],
      },
    },
    items: [],
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      Swal.fire("Akses Ditolak", "Token tidak ditemukan", "error");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchJumlahUser = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/masters/user-count`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          }
        );
        setJumlahUser(response.data.data);
      } catch (error) {
        if (!axios.isCancel(error)) {
          Swal.fire("Gagal!", "Gagal mengambil jumlah user", "error");
        }
      }
    };

    const fetchKategori = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/kategori-tes`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          }
        );
        setJumlahKategori(response.data.data.length);
      } catch (error) {
        if (!axios.isCancel(error)) {
          Swal.fire("Gagal!", "Gagal mengambil kategori", "error");
        }
      }
    };

    const fetchUserByKesatuan = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/masters/user-count-all-kesatuan`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal,
          }
        );

        const kesatuanData = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        const labels = kesatuanData.map((item) => item.nama_kesatuan);

        // Pastikan semua total number
        const data = kesatuanData.map((item) =>
          Number(item.total) || 0
        );

        // 🔥 Ambil nilai terbesar untuk pembanding progress
        const maxValue = data.length > 0 ? Math.max(...data) : 0;

        const items = kesatuanData.map((item) => {
          const total = Number(item.total) || 0;

          const percentage =
            maxValue > 0
              ? Math.round((total / maxValue) * 100)
              : 0;

          return {
            icon: { color: "info", component: "groups" },
            label: item.nama_kesatuan,
            progress: {
              content: total.toLocaleString(),
              percentage: percentage,
            },
          };
        });

        setBarChartData({
          chart: {
            labels,
            datasets: {
              label: "Total Participants per Kesatuan",
              data,
            },
          },
          items,
        });
      } catch (error) {
        console.error(error);
        if (!axios.isCancel(error)) {
          Swal.fire("Gagal!", "Gagal mengambil data kesatuan", "error");
        }
      }
    };

    fetchJumlahUser();
    fetchKategori();
    fetchUserByKesatuan();

    return () => controller.abort();
  }, [token]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox py={3}>
        <SoftBox mb={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Total Participants" }}
                count={jumlahUser.total.toLocaleString()}
                icon={{ color: "info", component: "public" }}
              />
            </Grid>

            <Grid item xs={12} sm={6} xl={3}>
              <MiniStatisticsCard
                title={{ text: "Test Categories" }}
                count={jumlahKategori}
                icon={{ color: "success", component: "emoji_events" }}
              />
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mb={3}>
          <Grid container>
            <Grid item xs={12}>
              {barChartData.chart.labels.length > 0 && (
                <ReportsBarChart
                  title="Participant Distribution by Unit"
                  description="Live Data"
                  chart={barChartData.chart}
                  items={barChartData.items}
                />
              )}
            </Grid>
          </Grid>
        </SoftBox>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
