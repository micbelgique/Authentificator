import { useSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Webcam from "react-webcam"
import CaptureButton from "../components/CaptureButton"
import WebCamView from "../components/WebcamView"
import useSessionStorage from "../hooks/useSessionStorage"
import { registerPerson } from "../services/api"
import { base64RemoveHeader } from "../utils/image"
import classes from "./Scan.module.css"

export default function Register() {
  const webcamRef = useRef<Webcam>(null)
  const [images, setImages] = useState<string[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [userId, setUserId] = useSessionStorage<string>("userId", "")
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!isRegistering && images.length >= 5) {
      setIsRegistering(true)
      registerPerson(images)
        .then((userId) => {
          setUserId(userId)
          navigate("/preferences")
          enqueueSnackbar("User registered", { variant: "success" })
        })
        .catch((e) => {
          enqueueSnackbar(e.message, { variant: "error" })
        })
        .finally(() => {
          setIsRegistering(false)
          setImages([])
        })
    }
  }, [isRegistering, images, navigate, setUserId, enqueueSnackbar])

  const handleCapture = () => {
    const webcam = webcamRef.current
    try {
      if (!webcam) {
        throw new Error("Webcam not found")
      }
      const imageB64 = base64RemoveHeader(webcam.getScreenshot() ?? "")
      if (imageB64 === "") {
        throw new Error("Image not found")
      }
      setImages((images) => [...images, imageB64])
      enqueueSnackbar("Image captured", { variant: "success" })
    } catch (e: unknown) {
      let errorMsg = ""
      if (e instanceof Error) {
        errorMsg = e.message
      } else {
        errorMsg = "Unknown error"
      }
      enqueueSnackbar(errorMsg, { variant: "error" })
    }
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <WebCamView ref={webcamRef} />
      </div>
      <div className={classes.ButtonCam}>
        <CaptureButton onClick={handleCapture} loading={isRegistering} />
      </div>
    </>
  )
}
