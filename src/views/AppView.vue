<template>
    <canvas v-if="showCanvas" ref="canvas"></canvas>
    <div v-if="!uploadedImageUrl">
      <p>Upload a selfie to get started:</p>
      <button @click="handleUploadClick">Upload Image</button>
    </div>
    <div v-if="uploadedImageUrl">
        <button v-if="editValue > 0" @click="handleApplyChanges">Apply Changes</button>
        <h2>Edit:</h2>

        <button value="blur" @click="handleEditSelect">Blur</button>
        <input v-if="editType === 'blur'" type="range" min="0" max="20" @change="handleValueChange">

        <button value="pixelation" @click="handleEditSelect">Pixelation</button>
        <input v-if="editType === 'pixelation'" type="range" min="0" max="20" @change="handleValueChange">

        <button value="hue" @click="handleEditSelect">Hue</button>
        <input v-if="editType === 'hue'" type="range" min="0" max="20" @change="handleValueChange">

        <button value="brightness" @click="handleEditSelect">Brightness</button>
        <input v-if="editType === 'brightness'" type="range" min="0" max="20" @change="handleValueChange">

        <button value="saturation" @click="handleEditSelect">Saturation</button>
        <input v-if="editType === 'saturation'" type="range" min="0" max="20" @change="handleValueChange">
    </div>
</template>

<script>
import { resizeImage } from '../assets/js/resize.js'

export default {
    data(){
        return {
            uploadedImageUrl: null,
            showCanvas: false,
            editType: null,
            editValue: 0,
            imageData: null,
            appliedImageData: null,
        }
    },
    mounted(){
        this.canvas = this.$refs.canvas;
    },
    methods: {
        handleUploadClick(){
            this.showCanvas = true;
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*,.heic,.heif";
            input.addEventListener("change", this.handleUpload.bind(this));
            input.click();
        },
        handleUpload(e){
            const file = e.target.files[0];
            file.crossOrigin="anonymous";

            resizeImage(file, 1080, 1080, (resizedBlob) => {
                const formData = new FormData();
                formData.append("image", resizedBlob, file.name);

                fetch(`${process.env.VUE_APP_SERVER_URL}/upload`, {
                    method: "POST",
                    body: formData,
                })
                .then((res) => res.json())
                .then((data) => {
                    if (data.imageUrl) {
                        this.uploadedImageUrl = data.imageUrl;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        const canvas = this.$refs.canvas;
                        const context = canvas.getContext("2d");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0);

                        // Convert the image data to a base64 string and store it
                        this.imageData = canvas.toDataURL("image/jpeg");
                    };
                    img.crossOrigin="anonymous";
                    img.src = event.target.result;
                };
                reader.readAsDataURL(resizedBlob);
            });
        },
        handleEditSelect(e){
            const editType = e.target.value;
            this.editType = editType;
        },
        handleValueChange(e){
            const editValue = e.target.value;
            this.editValue = editValue;

            this.$nextTick(() => {
                this.updateCanvas();
            });
        },
        dataURLtoBlob(dataURL) {
            const arr = dataURL.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            
            while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
            }
            
            return new Blob([u8arr], { type: mime });
        },
        updateCanvas() {
            const canvas = this.$refs.canvas;
            const editType = this.editType;
            const editValue = this.editValue;

            const imageDataToUse = this.appliedImageData || this.imageData;

            const blob = this.dataURLtoBlob(imageDataToUse);

            const formData = new FormData();
            formData.append('image', blob);
            formData.append('editType', editType);
            formData.append('editValue', editValue);

            fetch(`${process.env.VUE_APP_SERVER_URL}/edit`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                const img = new Image();
                img.onload = function() {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                };
                img.src = `data:image/jpeg;base64,${data.processedImage}`;
            })
            .catch(error => {
                console.error('Error sending data to the server:', error);
            });
        },
        handleApplyChanges(){
            // send canvas version to db
        }
    }
}
</script>

<style>

</style>