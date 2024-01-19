import { useState } from "react";
import { AudioOn, AudioOff, MicroOn, MicroOff } from "../assets/index";
import { ISetupProps, IVideoOptions } from "../types";
import Alert from "../assets/Alert";

const VideoSetup = ({ options, setOptions }: ISetupProps<IVideoOptions>) => {
  
    const [showAlert, setShowAlert] = useState(false);
    
//     useEffect(() => {
//     if(showAlert && options.displaySurface === 'browser') {
//         setShowAlert(false)
//     }
//   }, [options, showAlert]);

  const handleAudioOption = () => {
    setOptions((prevOptions) => {
      return { ...prevOptions, audio: !prevOptions.audio };
    });
  };

  const handleMicroOption = () => {
    setOptions((prevOptions) => {
      return { ...prevOptions, micro: !prevOptions.micro };
    });
  };

  const handleFormatOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions((prevOptions) => {
      return {
        ...prevOptions,
        format: e.target.value as IVideoOptions["format"],
      };
    });
  };

  const handleSurfaceOption = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions((prevOptions) => {
      return {
        ...prevOptions,
        displaySurface: e.target.value as IVideoOptions["displaySurface"],
      };
    });
    if(e.target.value !== 'browser') {
        if (options.audio === true) {
            handleAudioOption()
        }
        setShowAlert(true)
    } else {
        setShowAlert(false)
    }    
  };

  return (
    <section className="my-5 p-2 border rounded-md bg-zinc-800 shadow-default">
      <div className="relative my-4 mx-auto flex place-content-center gap-1">
        <p className="my-auto">Browser audio: </p>
        <button
          className={`ml-3 p-1 border rounded-md enabled:active:translate-y-0.5 ${
            options.audio ? "bg-primary" : "enabled:bg-grey disabled:bg-lightDark"
          }`}
          disabled={options.displaySurface !== 'browser'}
          title="Browser audio"
          onClick={handleAudioOption}
        >
          {options.audio ? <AudioOn /> : <AudioOff />}
        </button>
        {showAlert && 
        <div className=" absolute right-10 top-1/2 transform -translate-y-1/2" title='It is not possible to access system audio by recording the window or screen'>
            <Alert/>
        </div>
        }
      </div>
      <div className="my-4 flex place-content-center gap-4">
        <p className="my-auto">Microphone audio: </p>
        <button
          className={`p-1 border rounded-md active:translate-y-0.5 ${
            options.micro ? "bg-primary" : "bg-grey"
          }`}
          onClick={handleMicroOption}
        >
          {options.micro ? <MicroOn /> : <MicroOff />}
        </button>
      </div>
      <p>Source:</p>
      <div className="flex place-content-center gap-2">
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.displaySurface === "browser" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="surface"
              className="hidden"
              type="radio"
              value="browser"
              onChange={(e) => handleSurfaceOption(e)}
            />
            <span className="block py-1">Browser</span>
          </label>
        </div>
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.displaySurface === "window" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="surface"
              className="hidden"
              type="radio"
              value="window"
              onChange={(e) => handleSurfaceOption(e)}
            />
            <span className="block py-1">Window</span>
          </label>
        </div>
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.displaySurface === "monitor" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="surface"
              className="hidden"
              type="radio"
              value="monitor"
              onChange={(e) => handleSurfaceOption(e)}
            />
            <span className="block py-1">Screen</span>
          </label>
        </div>
      </div>
      <p className="mt-2">Save as:</p>
      <div className="flex place-content-center gap-4">
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.format === "mp4" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="format"
              className="hidden"
              type="radio"
              value="mp4"
              onChange={(e) => handleFormatOption(e)}
            />
            <span className="block py-1">MP4</span>
          </label>
        </div>
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.format === "webm" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="format"
              className="hidden"
              type="radio"
              value="webm"
              onChange={(e) => handleFormatOption(e)}
            />
            <span className="block py-1">WEBM</span>
          </label>
        </div>
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.format === "avi" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="format"
              className="hidden"
              type="radio"
              value="avi"
              onChange={(e) => handleFormatOption(e)}
            />
            <span className="block py-1">AVI</span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default VideoSetup;
