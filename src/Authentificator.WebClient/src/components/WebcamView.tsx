import { forwardRef } from "react"
import Webcam from "react-webcam"
import classes from "./WebcamView.module.css"

const DEFAULT_VIDEO_CONSTRAINTS: MediaTrackConstraints  = {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: "user",
      }

interface WebCamViewProps {
  videoConstraints?: boolean | MediaTrackConstraints
  mirrored?: boolean
}

export default forwardRef<Webcam, WebCamViewProps>(function WebcamView({mirrored = false, videoConstraints}, ref) {
  if (videoConstraints === undefined) {
    videoConstraints = DEFAULT_VIDEO_CONSTRAINTS
  }
  return (
    <Webcam
      className={classes.WebcamScreen}
      ref={ref}
      audio={false}
      screenshotFormat="image/jpeg"
      forceScreenshotSourceSize={true}
      videoConstraints={videoConstraints}
      mirrored={mirrored}
    />
  )
})
