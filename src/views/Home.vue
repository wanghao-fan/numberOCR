<template>
  <div class="image-uploader">
    <button @click="selectImage">选择图片</button>
    <input
      type="file"
      ref="fileInput"
      @change="onFileChange"
      accept="image/*"
      style="display: none"
    />
    <paintingBoard v-model:url="url" v-model:result="result" ref="drawingBoard"></paintingBoard>
    <div v-if="imageSrc" class="image-preview">
      <img ref="img" :src="imageSrc" alt="Selected Image" />
    </div>
    <button v-show="imageSrc" @click="start">开始识别</button>
    <button v-show="url"  @click="startHb">开始识别 画板</button>
    <div v-show="result">识别结果: {{ result }}</div>
  </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import * as tf from '@tensorflow/tfjs';
  import paintingBoard from '../components/paintingBoard.vue'
    const drawingBoard = ref(null);
    const url = ref(false);
    let img = ref();
    let fileInput = ref();
    let imageSrc = ref('')
    let result = ref(false)
    async function loadAndPredict(imageElement) {
      result.value = false
      const model = await tf.loadLayersModel("/aiModel/my-model.json");

      // 预处理输入图像
      const inputTensor = await preprocessImage(imageElement);
        console.log('inputTensor',inputTensor)
      // 进行预测
      const predictions = model.predict(inputTensor);

      // 获取预测结果
      const predictedIndex = predictions.argMax(1).dataSync()[0];
      result.value = predictedIndex
    }

    // 预处理函数
    async function  preprocessImage(imageElement) {
      // 将图像转换为 28x28 的灰度图像
      const tensor = tf.browser
        .fromPixels(imageElement, 1)
        .resizeNearestNeighbor([28, 28])
        .toFloat()
        .div(tf.scalar(255.0))
        .expandDims();
      return tensor;
    }
    function selectImage() {
        imageSrc.value = ''
        result.value = false
        console.log('fileInput',fileInput)
        fileInput.value.click();
    }
    function onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        imageSrc.value = URL.createObjectURL(file);
      }
    }
    function start(){
        console.log('img',img.value)
        loadAndPredict(img.value);
    }
    function startHb(){
        loadAndPredict(drawingBoard.value.image);
    }
   
</script>
  
  <style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #369f77;
}

.image-preview {
  margin-top: 20px;
  width: 300px;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
  