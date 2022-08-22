import PhotoCamera from "@mui/icons-material/PhotoCamera"
import { LoadingButton } from "@mui/lab"

interface CaptureButtonProps {
  onClick: () => void
  disabled?: boolean
  loading?: boolean
}

export default function CaptureButton({ onClick, disabled = false, loading = false }: CaptureButtonProps) {
  return (
    <LoadingButton
      color="primary"
      aria-label="take a picture"
      size="large"
      variant="contained"
      onClick={onClick}
      disabled={disabled}
      loading={loading}
    >
    <PhotoCamera />
    </LoadingButton >
  )
}
