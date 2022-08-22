import { Box, Link } from "@mui/material"
import classes from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <Box
        sx={{
          mt: "2rem",
          mb: 0.4,
          color: (theme) => {
            return theme.palette.grey[600]
          },
          width: "100%",
          textAlign: "center",
        }}
      >
        <span>
          Made by{" "}
          <Link href="https://github.com/micbelgique/" underline="hover">
            MIC Belgique
          </Link>
          .
        </span>
      </Box>
    </footer>
  )
}
