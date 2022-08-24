import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useSessionStorage from "../hooks/useSessionStorage"
import User from "../models/user"
import { getProfile, updateProfile } from "../services/api"

export default function Preferences() {
  const [userId, setUserId] = useSessionStorage<string>("userId", "")
  const [favouriteCoffee, setFavouriteCoffee] = useState("")
  const [name, setName] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (userId) {
      getProfile(userId).then((user) => {
        setUser(user)
        setFavouriteCoffee(user.favouriteCoffee)
        setName(user.name)
        setIsLoading(false)
      })
    }
  }, [userId])

  const handleChangeFavouriteCoffee = (event: SelectChangeEvent) => {
    setFavouriteCoffee(event.target.value as string)
  }
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleSubmit = async () => {
    await updateProfile(userId, { favouriteCoffee, name })
    enqueueSnackbar("Preferences updated", { variant: "success" })
    setUserId("")
    navigate("/")
  }

  const handleDisconnect = () => {
    navigate("/")
    setUserId("")
  }

  if (userId === "") return <div>No User</div>
  if (isLoading) return <LinearProgress variant="indeterminate" />

  return (
    <>
      <Grid container direction="row" spacing={4}>
        <Grid item>
          <Box sx={{ height: "10em", width: "10em" }}>
            <img src={user?.avatarUrl} style={{ height: "auto", width: "100%" }} alt="Avatar" />
          </Box>
        </Grid>
        <Grid item>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="favoutite-coffee-label">Favourite coffee</InputLabel>
            <Select
              labelId="favourite-coffee-label"
              id="favourite-coffee-select"
              value={favouriteCoffee}
              label="Favourite coffee"
              onChange={handleChangeFavouriteCoffee}
            >
              <MenuItem value={""}>None</MenuItem>
              <MenuItem value={"cofee"}>Coffee</MenuItem>
            </Select>
          </FormControl>
          <br />
          <TextField label="Name" value={name} onChange={handleChangeName} sx={{ mb: 2 }} />
          <br />
          <Button variant="contained" color="primary" onClick={handleSubmit} type="submit">
            Submit
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="error" onClick={handleDisconnect}>
            Disconnect
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
