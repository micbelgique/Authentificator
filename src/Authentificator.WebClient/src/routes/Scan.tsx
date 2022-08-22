import { useSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Webcam from "react-webcam"
import CaptureButton from "../components/CaptureButton"
import WebCamView from "../components/WebcamView"
import useSessionStorage from "../hooks/useSessionStorage"
import { identifyUser } from "../services/api"
import { base64RemoveHeader } from "../utils/image"
import classes from "./Scan.module.css"

export default function Scan() {
  const webcamRef = useRef<Webcam>(null)
  const { enqueueSnackbar } = useSnackbar()
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [userId, setUserId] = useSessionStorage("userId", "")

  useEffect(() => {
    setUserId("")
  }, [setUserId])

  const handleCapture = async () => {
    const webcam = webcamRef.current
    try {
      if (!webcam) {
        throw new Error("Webcam not found")
      }
      const imageB64 = base64RemoveHeader(webcam.getScreenshot() ?? "")
      if (imageB64 === "") {
        throw new Error("Image not found")
      }
      setIsLoading(true)
      const { userId } = await identifyUser(imageB64)
      if (!userId) {
        throw new Error("User not found")
      }
      setUserId(userId)
      navigate("/preferences")
      enqueueSnackbar("User found", { variant: "success" })
    } catch (e: unknown) {
      let errorMsg = ""
      if (e instanceof Error) {
        errorMsg = e.message
      } else {
        errorMsg = "Unknown error"
      }
      enqueueSnackbar(errorMsg, { variant: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <WebCamView ref={webcamRef} />
      </div>
      <div className={classes.ButtonCam}>
        <CaptureButton onClick={handleCapture} loading={isLoading} />
      </div>
    </>
  )
}
