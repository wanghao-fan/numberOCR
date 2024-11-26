<template>
  <div class="drawing-board">
    <div class="controls">
      <!-- <label>
        背景色:
        <input
          type="color"
          v-model="backgroundColor"
          @input="updateCanvasBackground"
        />
      </label>
      <label>
        画笔颜色:
        <input type="color" v-model="penColor" />
      </label>
      <label>
        画笔粗细:
        <input type="range" min="20" max="50" v-model="penWidth" />
      </label> -->
      <button @click="generateImage">生成图片 URL</button>
      <button @click="clearCanvas">清除</button>
    </div>
    <canvas
      ref="canvas"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
    ></canvas>
    <div v-if="imageUrl" class="image-preview">
      <img style="display: none;" ref="image" :src="imageUrl" alt="Generated Image" />
    </div>
  </div>
</template>
  
  <script setup>
    import { ref, onMounted, defineExpose } from "vue";
    let url = defineModel("url");
    let result = defineModel("result");
    const canvas = ref(null);
    const image = ref(null);
    const isDrawing = ref(false);
    const penColor = ref("#ffffff");
    const penWidth = ref(30);
    const backgroundColor = ref("#000000");
    const imageUrl = ref(null);
    let ctx;

    onMounted(() => {
        const canvasElement = canvas.value;
        ctx = canvasElement.getContext("2d");
        canvasElement.width = 200;
        canvasElement.height = 200;
        updateCanvasBackground();
    });

    const updateCanvasBackground = () => {
        ctx.fillStyle = backgroundColor.value;
        ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);
    };

    const startDrawing = (event) => {
    isDrawing.value = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
    };

    const draw = (event) => {
    if (!isDrawing.value) return;
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.strokeStyle = penColor.value;
    ctx.lineWidth = penWidth.value;
    ctx.lineCap = "round";
    ctx.stroke();
    };

    const stopDrawing = () => {
    isDrawing.value = false;
    ctx.closePath();
    };

    const generateImage = () => {
        imageUrl.value = canvas.value.toDataURL("image/png");
        url.value = imageUrl.value;
    };
    const clearCanvas = () => {
        url.value = false
        result.value = false
        imageUrl.value = false
        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
        updateCanvasBackground();
    };
    defineExpose({
        image,
    });
</script>
  
  <style scoped>
.drawing-board {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.controls {
  margin-bottom: 10px;
}

canvas {
  border: 1px solid #ccc;
  cursor: crosshair;
}

.image-preview {
  margin-top: 20px;
}
</style>
  