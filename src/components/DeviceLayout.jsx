import { useContext, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import styles from "../pages/VideoEditor/VideoEditor.module.css";
import video_placeholder from "../assets/images/editor/video_placeholder.png";
import VideoPlayer from "./VideoPlayer";
import MultiRangeSlider from "./MultiRangeSlider";
import VideoConversionButton from "./VideoConversionButton";

import { VideoEditorContext } from "../pages/VideoEditor/VideoEditor";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { toTimeString } from "../utils/utils";

const DeviceLayout = () => {
  const {
    device,
    sliderValues, setSliderValues,
    videoFile, setVideoFile,
    videoPlayerState, setVideoPlayerState,
    videoPlayer, setVideoPlayer,
    processing, setProcessing,
    show, setShow,
    ffmpeg
  } = useContext(VideoEditorContext)

  const sliderImagePath = '../assets/images/sliderImgaes'

  const videoTosliderImages = async () => {
    if (videoPlayerState) {
      // ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videoFile));
      // await ffmpeg.run("-i", "input.mp4", "-r", `1/1`, `${sliderImagePath}/frame%d.png`)
      // const data = ffmpeg.FS('readFile', `${sliderImagePath}/frame1..png`);
      // console.log(data)
    }
  }
  useEffect(() => {
    videoTosliderImages()
  }, [videoFile])

  const uploadFile = useRef("");

  return (
    <article className={`${device}_layout`} style={{ padding: "56px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h1 className={styles.title}>Video Edit</h1>
        {videoFile && (
          <div>
            <input onChange={(e) => setVideoFile(e.target.files[0])}
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              ref={uploadFile}
            />
            <Button
              onClick={() => uploadFile.current.click()}
              className={styles.re__upload__btn}
              style={{ width: "fit-content" }}
            >
              비디오 재선택
            </Button>
          </div>
        )}
      </div>
      <section>
        {
          videoFile ? (
            <><VideoPlayer
              src={videoFile}
              onPlayerChange={(videoPlayer) => {
                setVideoPlayer(videoPlayer);
              }}
              onChange={(videoPlayerState) => {
                setVideoPlayerState(videoPlayerState);
              }} />
              <div className="currTime" style={{ color: 'white' }}>
                {videoPlayerState &&
                  `${toTimeString(Math.round(videoPlayerState.currentTime))}/${toTimeString(Math.round(videoPlayerState.duration))}`}
              </div></>
          ) : (
            <>
              <img
                src={video_placeholder}
                alt="비디오를 업로드해주세요."
                style={
                  (device === "mobile") ? { marginBottom: "32px", } :
                    {
                      width: "100%",
                      maxHeight: "inherit",
                      marginBottom: "32px",
                    }
                }
              ></img>
              <div>
                <input onChange={(e) => setVideoFile(e.target.files[0])}
                  type="file"
                  accept="video/*"
                  style={{ display: "none" }}
                  ref={uploadFile}
                />
                <Button
                  className={styles.upload__btn}
                  onClick={() => uploadFile.current.click()}
                >
                  비디오 업로드
                </Button>
              </div>
            </>
          )
        }
      </section>
      {
        videoFile && videoPlayerState && (
          <>
            <section
              style={{
                width: '100%',
                marginTop: 30,
                marginBottom: 62,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <MultiRangeSlider
                min={0}
                curr={5}
                max={100}
                onChange={({ min, curr, max }) => {
                  setSliderValues([min, curr, max])
                }}
                duration={videoPlayerState.duration}
              />
            </section>
            <section
              style={device === "mobile" ? {} : { display: 'flex', gap: 16 }}
            >
              <VideoConversionButton
                onConversionStart={() => {
                  setProcessing(true);
                }}
                onConversionEnd={() => {
                  setProcessing(false);
                  setShow(true);
                }}
                ffmpeg={ffmpeg}
                videoPlayerState={videoPlayerState}
                sliderValues={sliderValues}
                videoFile={videoFile}
              />
            </section>
          </>
        )}
    </article>
  );
}

export default DeviceLayout;