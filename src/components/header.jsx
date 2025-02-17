import { Typography, Box, useTheme, Link } from "@mui/material";
import colors from "../theme";
import { Link as RouterLink} from "react-router-dom";

const Header = ({ title, subtitle, url, urltitle }) => {
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {url ? (
          <>
            <Link component={RouterLink}      // Tell MUI <Link> to use react-router <Link> internally
              to={url}                    // Actual route path
              underline="none"           // Removes the underline
              style={{ color: colors.greenAccent[400] }} // Inherit the same color as the Typography
              title={urltitle}>
              {urltitle}
            </Link>
            <span>-</span>
          </>
        ) : null}
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
