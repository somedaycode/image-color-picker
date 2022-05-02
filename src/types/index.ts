export interface ImageType {
  file: File | null;
  el: HTMLImageElement | CanvasImageSource | null;
  src: string;
  width: number;
  height: number;
}
