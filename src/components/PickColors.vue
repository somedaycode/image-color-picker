<script lang="ts" setup>
import { reactive } from "vue";
import { ImageType } from "../types";

const myImage = reactive<ImageType>({
  file: null,
  el: null,
  src: "",
  width: 0,
  height: 0
});

const rgbaColors = reactive<{ item: string[] | [] }>({ item: [] });

const setMyImageState = (file: File, image: HTMLImageElement) => {
  myImage.file = file;
  myImage.el = image;
  myImage.src = URL.createObjectURL(file);
  myImage.height = image.height;
  myImage.width = image.width;
};

const setImageLoadData = (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = ({ target }: ProgressEvent<FileReader>) => {
    const image = new Image();
    image.src = <string>target?.result;
    image.onload = () => {
      setMyImageState(file, image);
    };
  };
};

const loadFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files![0];
  if (!file) return;
  setImageLoadData(file);
};

const extractColorsFromImage = () => {
  const rgbaSet = new Set();
  const imageData = getUploadImageData();
  for (let i = 0; i < imageData.length; i += 4) {
    const { r, g, b } = ({ r: imageData[i], g: imageData[i + 1], b: imageData[i + 2] });
    const colorStyle = `rgba(${r},${g},${b}, 1)`;
    if (rgbaSet.has(colorStyle)) continue;
    rgbaSet.add(colorStyle);
  }
  rgbaColors.item = [...rgbaSet] as unknown as string[];
};

const getUploadImageData = () => {
  const { el, height, width } = myImage;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  context.drawImage(el!, 0, 0, width, height);
  return context.getImageData(0, 0, width, height).data;
};
</script>

<template>
  <section>
    <form>
      <label for="file">Upload your image file to pick colors</label>
      <input
        id="file"
        accept="image/*"
        name="image"
        type="file"
        @change="loadFile"
      />
    </form>
    <div class="img_wrap">
      <img
        v-if="myImage.src"
        ref="uploadImage"
        :src="myImage.src"
        alt="업로드 사진"
        @load="extractColorsFromImage"
      />
    </div>
  </section>
  <div class="color_container">
    <ul v-if="rgbaColors.item.length > 0">
      <li v-for="color in rgbaColors.item.sort()" :style="{backgroundColor: color}"></li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>

section {
  display: flex;
  flex-direction: column;
  width: 600px;
  height: 400px;
  
  
}

form {
  display: flex;
  flex-direction: column;
}

.img_wrap {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  justify-self: center;
  align-items: center;
  
  img {
    width: 50%;
  }
}

.color_container {
  margin-top: 40px;
  width: 400px;
}

ul {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  
  & > li {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2px;
    border: 1px solid floralwhite;
    width: 20px;
    height: 20px;
  }
  
}

</style>
