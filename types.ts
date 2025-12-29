
export interface Scene {
  id: number;
  title: string;
  duration: string;
  imageDescription: string;
  dialogue?: string[];
  screenText?: string;
  voiceover?: string;
}

export interface GeneratedImage {
  sceneId: number;
  url: string;
}
