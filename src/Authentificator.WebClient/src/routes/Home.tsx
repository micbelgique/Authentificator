import { Button, Grid } from "@mui/material"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import useSessionStorage from "../hooks/useSessionStorage"

function Home() {
  const [userId, setUserId] = useSessionStorage("userId", "")

  useEffect(() => {
    if (userId) {
      setUserId("")
    }
  }, [userId, setUserId])

  return (
    <Grid
      className="App"
      container
      direction="column"
      justifyContent="flex-end"
      alignItems="center"
      spacing={2}
    >
      <Grid item>
        <Button size="large" variant="contained" component={Link} to="/register">
          Register
        </Button>
      </Grid>
      <Grid item>
        <Button size="large" variant="contained" component={Link} to="/scan">
          Scan
        </Button>
      </Grid>
    </Grid>
  )
}

export default Home

