import Card from "@mui/material/Card";
import BASE_URL_NO_API from "../../config/BASE_URL_NOT_API";

// Soft UI
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";

function Template() {
  const files = [
    {
      nama: "Soal Pilihan Ganda",
      link: `${BASE_URL_NO_API}storage/template/pilihan-ganda.xlsx`,
    },
    {
      nama: "Soal Essay",
      link: `${BASE_URL_NO_API}storage/template/essay.xlsx`,
    },
  ];

  // Format data untuk Soft UI Table
  const columns = [
    { name: "no", align: "center" },
    { name: "nama_template", align: "left" },
    { name: "aksi", align: "center" },
  ];

  const rows = files.map((item, index) => ({
    no: (
      <SoftTypography variant="caption" fontWeight="medium">
        {index + 1}
      </SoftTypography>
    ),
    nama_template: (
      <SoftTypography variant="button" fontWeight="medium">
        {item.nama}
      </SoftTypography>
    ),
    aksi: (
      <SoftButton
        component="a"
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        variant="gradient"
        color="info"
        size="small"
      >
        Download
      </SoftButton>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftBox py={3}>
        <Card>
          <SoftBox p={3}>
            <SoftTypography variant="h5" fontWeight="bold">
              Template Download
            </SoftTypography>
          </SoftBox>

          <SoftBox
            sx={{
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                    `${borderWidth[1]} solid ${borderColor}`,
                },
              },
            }}
          >
            <Table columns={columns} rows={rows} />
          </SoftBox>
        </Card>
      </SoftBox>

      <Footer />
    </DashboardLayout>
  );
}

export default Template;
