import React from "react";
import { Breadcrumbs, Typography, Chip, Link } from "@mui/material";
import colors from "../../../theme";

const StyledBreadcrumbs = ({ courseTitle }) => {
	return (
		<Breadcrumbs marginTop="-20px" aria-label="breadcrumb">
			<Link underline="hover" color="inherit" href="/course">
				<Chip
					sx={{
						borderRadius: "8px",
						border: `1px solid ${colors.greenAccent[500]}`,
						backgroundColor: colors.greenAccent[900],
						"&:hover": {
							transform: "translate(0, -1px)",
						},
					}}
					label="Course"
					size="small"
				/>
			</Link>
			<Typography
			>
				{courseTitle}
			</Typography>
		</Breadcrumbs>
	)
}

export default StyledBreadcrumbs;