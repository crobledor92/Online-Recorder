import { AudioOff, AudioOn, MicroOff, MicroOn } from "../assets";
import { IAudioOptions, ISetupProps } from "../types";

const VideoSetup = ({ options, setOptions }: ISetupProps<IAudioOptions>) => {

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
    setOptions((prevOptions) => ({
      ...prevOptions,
      format: e.target.value as IAudioOptions["format"],
    }));
  };

  return (
    <section className="my-5 p-5 border rounded-md">
      <div className="relative my-4 mx-auto flex place-content-center gap-1">
        <p className="my-auto">Browser audio: </p>
        <button
          className={`ml-3 p-1 border rounded-md active:translate-y-0.5 ${
            options.audio ? "bg-primary" : "enabled:bg-grey "
          }`}
          title="Browser audio"
          onClick={handleAudioOption}
        >
          {options.audio ? <AudioOn /> : <AudioOff />}
        </button>
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
      <p className="mt-2">Save as:</p>
      <div className="flex place-content-center gap-4">
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.format === "mp3" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="format"
              className="hidden"
              type="radio"
              value="mp3"
              onChange={(e) => handleFormatOption(e)}
            />
            <span className="block py-1">MP3</span>
          </label>
        </div>
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.format === "wav" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="format"
              className="hidden"
              type="radio"
              value="wav"
              onChange={(e) => handleFormatOption(e)}
            />
            <span className="block py-1">WAV</span>
          </label>
        </div>
        <div
          className={`m-2 px-2 bg-slate-300 border rounded active:translate-y-0.5 ${
            options.format === "aac" ? "bg-primary" : "bg-grey"
          }`}
        >
          <label className="cursor-pointer">
            <input
              name="format"
              className="hidden"
              type="radio"
              value="aac"
              onChange={(e) => handleFormatOption(e)}
            />
            <span className="block py-1">AAC</span>
          </label>
        </div>
      </div>
    </section>
  );
};

export default VideoSetup;
