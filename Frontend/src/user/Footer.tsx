
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const Footer = () => {
  const theme = useTheme();
  const lightBlueColor = "#e6f2ff";

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: lightBlueColor,
        py: 2,
        color: "#424242",
        mt: "auto",
        width: "100%",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Logo and about section */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <DirectionsCarIcon
                sx={{ mr: 1, color: theme.palette.primary.main }}
              />
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={theme.palette.primary.main}
              >
                Sarathi
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Smart ride-booking platform
            </Typography>
            <Box>
              <IconButton size="small" color="primary">
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary">
                <TwitterIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary">
                <InstagramIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="primary">
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Quick Links
            </Typography>
            {["About Us", "Services", "Book a Ride"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="hover"
                color="inherit"
                display="block"
                sx={{ mb: 0.5, fontSize: "0.85rem" }}
              >
                {item}
              </Link>
            ))}
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Legal
            </Typography>
            {["Terms of Service", "Privacy Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                underline="hover"
                color="inherit"
                display="block"
                sx={{ mb: 0.5, fontSize: "0.85rem" }}
              >
                {item}
              </Link>
            ))}
          </Grid>

          {/* Contact info */}
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Contact
            </Typography>
            {[
              {
                icon: <LocationOnIcon fontSize="small" />,
                text: "123 Ride Street, Transit City",
              },
              { icon: <PhoneIcon fontSize="small" />, text: "+91 98765 43210" },
              { icon: <EmailIcon fontSize="small" />, text: "support@sarathi.com" },
            ].map((item, index) => (
              <Box
                key={index}
                sx={{ display: "flex", mb: 0.5, alignItems: "center" }}
              >
                {item.icon}
                <Typography variant="body2" sx={{ ml: 1, fontSize: "0.85rem" }}>
                  {item.text}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 1.5 }} />

        {/* Copyright section */}
        <Typography variant="caption" align="center" color="text.secondary">
          © {new Date().getFullYear()} Sarathi. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
