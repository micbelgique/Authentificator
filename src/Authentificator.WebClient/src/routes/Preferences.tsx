import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
} from "@mui/material"
import { useSnackbar } from "notistack"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useSessionStorage from "../hooks/useSessionStorage"
import { getProfile, updateProfile } from "../services/api"

export default function Preferences() {
  const [userId, setUserId] = useSessionStorage<string>("userId", "")
  const [favouriteCoffee, setFavouriteCoffee] = useState("")
  const [name, setName] = useState("")
  const [isPermanent, setIsPermanent] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (userId) {
      getProfile(userId).then((user) => {
        setFavouriteCoffee(user.favouriteCoffee)
        setName(user.name)
        setIsPermanent(user.isPermanent)
        setAvatarUrl(user.avatarUrl)
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

  const handleChangeIsPermanent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsPermanent(event.target.checked)
  }

  const handleRandomAvatar = () => {
    const seed = Math.floor(Math.random() * 10000000)
    setAvatarUrl(`https://avatars.dicebear.com/api/big-smile/${seed.toString(16)}.svg`)
  }

  const handleSubmit = async () => {
    await updateProfile(userId, { favouriteCoffee, name, isPermanent, avatarUrl })
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
            <img src={avatarUrl} style={{ height: "auto", width: "100%" }} alt="Avatar" />
          </Box>
          <Button variant="contained" onClick={handleRandomAvatar}>
            Regenerate
          </Button>
        </Grid>
        <Grid item>
          <TextField label="Name" value={name} onChange={handleChangeName} sx={{ mb: 2 }} />
          <br />
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
              <MenuItem value={"coffee"}>Coffee</MenuItem>
              <MenuItem value={"longCoffee"}>Long Coffee</MenuItem>
              <MenuItem value={"espresso"}>Espresso</MenuItem>
              <MenuItem value={"doubleEspresso"}>Double Espresso</MenuItem>
              <MenuItem value={"doppio"}>Doppio</MenuItem>
            </Select>
          </FormControl>
          <br />
          <FormControlLabel
            control={<Switch checked={isPermanent} onChange={handleChangeIsPermanent} />}
            label="Permanent"
          />
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
