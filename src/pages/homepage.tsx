import { Dispatch, SetStateAction, useEffect, useState } from "react";
import VideoSetup from "../components/VideoSetup";
import { IAudioOptions, IOptions, IVideoOptions } from "../types";
import AudioSetup from "../components/AudioSetup";
import RedCircle from "../assets/RedCircle";

function Homepage() {
  const [options, setOptions] = useState<
    IOptions | IVideoOptions | IAudioOptions
  >({
    type: null,
  });
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const [media, setMedia] = useState<MediaStream>();
  const [record, setRecord] = useState<BlobEvent>();

  useEffect(() => {
    if (options.type === "video" && isRecording && media) {
      startStreaming(media);
    }
  }, [isRecording, media, options]);

  const startStreaming = (media: MediaStream) => {
    const videoStreaming: HTMLVideoElement | null =
      document.querySelector("#videoStreaming");

    if (videoStreaming) {
      console.log("existe el video");
      videoStreaming.className = "block";
      videoStreaming.srcObject = media;
    }
  };

  const startVideoRecording = async () => {
    const videoOptions = options as IVideoOptions;

    const mediaOptions = {
      video: {
        frameRate: { ideal: 90 },
        displaySurface: videoOptions.displaySurface,
      },
      audio: videoOptions.audio,
    };

    const media = await navigator.mediaDevices.getDisplayMedia(mediaOptions);

    setMedia(media);

    const [video] = media.getVideoTracks();

    video.addEventListener("ended", () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    });

    //Instanciamos el media recorder
    const mediaRecorder = new MediaRecorder(media, {
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 2500000,
      mimeType: "video/webm;codecs=vp8,opus",
    });
    //Event listener que detecta cuando hay datos disponibles (se generan al hacer stop() del mediaRecorder) y lo descarga
    if (mediaRecorder) {
      mediaRecorder.addEventListener("dataavailable", (e) => {
        setIsRecording(false);
        setRecord(e);
      });
    }

    setMediaRecorder(mediaRecorder);
    mediaRecorder?.start();
    setIsRecording(true);
  };

  const startMicroRecording = async () => {
    const audioOptions = options as IAudioOptions;

    let media: MediaStream | null = null;

    if (audioOptions.micro === true) {
      media = await navigator.mediaDevices.getUserMedia({ audio: true });
    } else {
      media = await navigator.mediaDevices.getDisplayMedia({ audio: true });
    }

    setMedia(media);

    const [audio] = media.getAudioTracks();

    audio.addEventListener("ended", () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
      }
    });

    const audioOnlyStream = new MediaStream(media.getAudioTracks());

    //Instanciamos el media recorder
    const mediaRecorder = new MediaRecorder(audioOnlyStream);

    if (mediaRecorder) {
      mediaRecorder.addEventListener("dataavailable", (e) => {
        setIsRecording(false);
        setRecord(e);
      });
    }

    setMediaRecorder(mediaRecorder);
    mediaRecorder?.start();
    setIsRecording(true);
  };

  const startAudioAndMicroRecording = async () => {
    //Get audio screen display media
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
    });
    const audioOnlyStream = new MediaStream(screenStream.getAudioTracks());

    //Get microphone display media
    const microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    //Create context to combine audios
    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    //Create screen audio context
    const screenAudioSource =
      audioContext.createMediaStreamSource(audioOnlyStream);

    const borwserGain = audioContext.createGain();

    borwserGain.gain.value = 0.7;

    screenAudioSource.connect(borwserGain).connect(destination);

    //Create microphone audio context
    const microphoneAudioSource =
      audioContext.createMediaStreamSource(microphoneStream);

    const voiceGain = audioContext.createGain();

    voiceGain.gain.value = 0.7;

    microphoneAudioSource.connect(voiceGain).connect(destination);

    const combinedAudioStream = destination.stream;

    setMedia(screenStream);

    const tracks = combinedAudioStream.getTracks();

    tracks.forEach((track) => {
      track.addEventListener("ended", () => {
        if (mediaRecorder) {
          mediaRecorder.stop();
        }
      });
    });

    //Instanciamos el media recorder
    const mediaRecorder = new MediaRecorder(combinedAudioStream);

    if (mediaRecorder) {
      mediaRecorder.addEventListener("dataavailable", (e) => {
        setIsRecording(false);
        setRecord(e);
      });
    }

    setMediaRecorder(mediaRecorder);
    mediaRecorder?.start();
    setIsRecording(true);
  };

  const startVideoAndMicroRecording = async () => {
    const recordOptions = options as IVideoOptions;
    console.log("SE INICIA");

    const mediaOptions = {
      video: {
        frameRate: { ideal: 90 },
        displaySurface: recordOptions.displaySurface,
      },
      audio: recordOptions.audio,
    };

    const screenStream = await navigator.mediaDevices.getDisplayMedia(
      mediaOptions
    );

    const microphoneStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    const audioContext = new AudioContext();
    const destination = audioContext.createMediaStreamDestination();

    if (recordOptions.audio) {
      const screenAudioSource =
        audioContext.createMediaStreamSource(screenStream);

      const borwserGain = audioContext.createGain();

      borwserGain.gain.value = 0.7;

      screenAudioSource.connect(borwserGain).connect(destination);
    }

    if (recordOptions.micro) {
      const microphoneAudioSource =
        audioContext.createMediaStreamSource(microphoneStream);

      const voiceGain = audioContext.createGain();

      voiceGain.gain.value = 0.7;

      microphoneAudioSource.connect(voiceGain).connect(destination);
    }

    console.log(destination);
    const combinedAudioStream = destination.stream;

    const combinedStream = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...combinedAudioStream.getAudioTracks(),
    ]);

    console.log("MEDIA", combinedStream);

    setMedia(screenStream);

    const tracks = combinedStream.getTracks();

    tracks.forEach((track) => {
      track.addEventListener("ended", () => {
        if (mediaRecorder) {
          mediaRecorder.stop();
        }
      });
    });

    // Create a MediaRecorder instance
    const mediaRecorder = new MediaRecorder(combinedStream);

    // Handle data available event
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        setRecord(event);
        setIsRecording(false);
      }
    };

    setMediaRecorder(mediaRecorder);
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();

    if (media !== undefined && options.type === "video") {
      const tracks = media.getTracks();
      tracks.forEach((track) => track.stop());
    } else if (media !== undefined) {
      const tracks = media.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const downloadVideo = (e: BlobEvent) => {
    const blob = new Blob([e.data], {
      type: `video/${(options as IVideoOptions).format}`,
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const clipName = prompt("Enter a name for your sound clip") || "capture";
    link.download = clipName;
    link.click();
  };

  const downloadAudio = (e: BlobEvent) => {
    const blob = new Blob([e.data], {
      type: `audio/${(options as IAudioOptions).format}`,
    });
    console.log(blob);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    const clipName = prompt("Enter a name for your sound clip") || "capture";
    link.download = clipName;
    link.click();
  };

  return (
    <main className="font-medium">
      <h1 className="text-4xl">Online Recorder</h1>
      {!record && !isRecording && (
        <>
          <p className="mt-5 mb-2">Capture:</p>
          <div className="flex gap-2 mb-5 justify-center">
            <button
              className={`p-2 rounded hover:outline-2 active:translate-y-0.5 ${
                options.type === "video"
                  ? "bg-primary outline outline-2"
                  : "outline outline-1 outline-grey bg-dark"
              }`}
              onClick={() =>
                setOptions(() => ({
                  type: "video",
                  audio: true,
                  micro: false,
                  displaySurface: "browser",
                  format: "mp4",
                }))
              }
            >
              Video
            </button>
            <button
              className={`p-2 rounded hover:outline-2 active:translate-y-0.5 ${
                options.type === "audio"
                  ? "bg-primary outline outline-2"
                  : "outline outline-1 outline-grey bg-dark"
              }`}
              onClick={() =>
                setOptions(() => ({
                  type: "audio",
                  audio: true,
                  micro: false,
                  format: "mp3",
                }))
              }
            >
              Audio
            </button>
          </div>
        </>
      )}
      {options.type === "video" && !record && !isRecording && (
        <>
          <VideoSetup
            options={options as IVideoOptions}
            setOptions={setOptions as Dispatch<SetStateAction<IVideoOptions>>}
          />
          <button
            className="mt-2 p-2 outline outline-1 rounded bg-lightDark outline-secondary text-secondary active:translate-y-0.5 hover:bg-secondary hover:text-white"
            onClick={
              (options as IVideoOptions).micro
                ? startVideoAndMicroRecording
                : startVideoRecording
            }
          >
            Start recording
          </button>
        </>
      )}
      {options.type === "audio" && !record && !isRecording && (
        <>
          <AudioSetup
            options={options as IAudioOptions}
            setOptions={setOptions as Dispatch<SetStateAction<IAudioOptions>>}
          />
          <button
            className="mt-2 p-2 outline outline-1 rounded bg-dark outline-secondary text-secondary active:translate-y-0.5 hover:bg-secondary hover:text-white"
            onClick={
              (options as IAudioOptions).audio &&
              (options as IAudioOptions).micro
                ? startAudioAndMicroRecording
                : startMicroRecording
            }
          >
            Start recording
          </button>
        </>
      )}
      <div className="record-container">
        {isRecording && options.type === "video" && (
          <section className="mt-5 relative w-4/5 mx-auto">
            <div className="rounded-md overflow-hidden">
              <video
                className="hidden"
                id="videoStreaming"
                autoPlay
                muted
                playsInline
              />
            </div>
            <div className="absolute top-1 left-3 bg-dark rounded-sm animate-fullPulse flex gap-1">
              <RedCircle />
              <p>REC</p>
            </div>
            <button
              className="mt-5 p-2 outline outline-1 rounded bg-lightDark outline-tertiary text-tertiary active:translate-y-0.5 hover:bg-tertiary hover:text-white"
              onClick={stopRecording}
            >
              STOP
            </button>
          </section>
        )}
        {isRecording && options.type === "audio" && (
          <section className="mt-5 relative w-4/5 flex gap-4 justify-center">
            <div className="rounded-sm animate-fullPulse flex gap-1 my-auto">
              <RedCircle />
              <p>REC</p>
            </div>
            <button
              className="p-2 outline outline-1 rounded outline-tertiary text-tertiary active:translate-y-0.5 hover:bg-tertiary hover:text-white"
              onClick={stopRecording}
            >
              STOP
            </button>
          </section>
        )}
        {record && options?.type === "video" && (
          <section className="m-6 relative w-4/5 mx-auto">
            <div className="overflow-hidden rounded-md">
              <video
                src={URL.createObjectURL(record.data)}
                controls
                autoPlay
              ></video>
            </div>
            <button
              className="mt-5 p-2 outline outline-1 rounded outline-primary text-primary active:translate-y-0.5 hover:bg-primary hover:text-white"
              onClick={() => downloadVideo(record)}
            >
              DOWNLOAD
            </button>
          </section>
        )}
        {record && options?.type === "audio" && (
          <section className="mt-5">
            <audio
              src={URL.createObjectURL(record.data)}
              controls
              autoPlay
            ></audio>
            <button
              className="mt-5 p-2 outline outline-1 rounded outline-primary text-primary active:translate-y-0.5 hover:bg-primary hover:text-white"
              onClick={() => downloadAudio(record)}
            >
              DOWNLOAD
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

export default Homepage;
