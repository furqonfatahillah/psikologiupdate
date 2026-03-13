/**
=========================================================
* Soft UI Dashboard React - v4.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Soft UI Dashboard React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard React examples
import PageLayout from "examples/LayoutContainers/PageLayout";
import PoldaLogo from "../../../../assets/images/background.svg";


function CoverLayout({ color, header, title, description, image, children }) {
  console.log(image);
  return (
    <PageLayout background="white">
      {/* Background Image Full Screen */}
      <SoftBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        sx={{
          backgroundImage: `url(https://www.svgrepo.com/show/430111/address-pin-location.svg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay gelap untuk membuat form lebih terbaca */}
      <SoftBox
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Content - Form di tengah dengan card putih */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: "100vh",
          margin: 0,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Grid item xs={11} sm={8} md={5} lg={4}>
          {/* Card Putih */}
          <SoftBox
            bgColor="white"
            borderRadius="lg"
            shadow="lg"
            p={3}
            sx={{
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Header Content - DIPUSATKAN */}
            {(title || description || header) && (
              <SoftBox pt={2} px={2} mb={3} textAlign="center">
                {!header ? (
                  <>
                    {title && (
                      <SoftBox mb={1}>
                        <SoftTypography
                          variant="h3"
                          fontWeight="bold"
                          color={color}
                          textGradient
                          sx={{ textAlign: "center" }}
                        >
                          {title}
                        </SoftTypography>
                      </SoftBox>
                    )}
                    {description && (
                      <SoftTypography
                        variant="body2"
                        fontWeight="regular"
                        color="text"
                        sx={{ textAlign: "center" }}
                      >
                        {description}
                      </SoftTypography>
                    )}
                  </>
                ) : (
                  <SoftBox sx={{ textAlign: "center" }}>
                    {header}
                  </SoftBox>
                )}
              </SoftBox>
            )}

            {/* Children Content (Form) */}
            <SoftBox px={2} pb={2}>
              {children}
            </SoftBox>
          </SoftBox>
        </Grid>
      </Grid>
    </PageLayout>
  );
}

// Setting default values for the props of CoverLayout
CoverLayout.defaultProps = {
  header: "",
  title: "",
  description: "",
  color: "info",
};

// Typechecking props for the CoverLayout
CoverLayout.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  header: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CoverLayout;