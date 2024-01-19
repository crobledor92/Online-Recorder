import { Dispatch, SetStateAction } from "react"

export interface IOptions {
    type: "audio" | "video" | null,
}

export interface IVideoOptions extends IOptions {
    audio?: true | false,
    micro?: true | false,
    displaySurface?: 'browser' |  'window' | 'monitor',
    format?: 'mp4' | 'webm' | 'avi'
}

export interface IAudioOptions extends IOptions {
    audio?: true | false,
    micro?: true | false,
    format?: 'mp3' | 'wav' | 'aac'
}

export interface ISetupProps<T> {
    options: T,
    setOptions: Dispatch<SetStateAction<T>>,
}