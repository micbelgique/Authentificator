import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useSessionStorage from "../hooks/useSessionStorage"
import { getProfile, updateProfile } from "../services/api"

export default function Preferences() {
  const [userId, setUserId] = useSessionStorage<string>("userId", "")
  const [favouriteCoffee, setFavouriteCoffee] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (userId) {
      getProfile(userId).then(({ favouriteCoffee }) => {
        setFavouriteCoffee(favouriteCoffee)
        setIsLoading(false)
      })
    }
  }, [userId])

  const handleChange = (event: SelectChangeEvent) => {
    setFavouriteCoffee(event.target.value as string)
  }

  const handleSubmit = async () => {
    await updateProfile(userId, { favouriteCoffee })
    enqueueSnackbar("Preferences updated", { variant: "success" })
    setUserId("")
    navigate("/")
  }

  if (userId === "") return <div>No User</div>
  if (isLoading) return <LinearProgress variant="indeterminate" />

  return (
    <>
      <Grid container direction="column" sx={{ mt: 0.2 }}>
        <Grid item>
          <FormControl fullWidth>
            <InputLabel id="favoutite-coffee-label">Favourite coffee</InputLabel>
            <Select
              labelId="favourite-coffee-label"
              id="favourite-coffee-select"
              value={favouriteCoffee}
              label="Favourite coffee"
              onChange={handleChange}
            >
              <MenuItem value={""}>None</MenuItem>
              <MenuItem value={"cofee"}>Coffee</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleSubmit} type="submit">
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
