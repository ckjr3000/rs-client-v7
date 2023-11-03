<template>
    <canvas v-if="showCanvas" ref="canvas"></canvas>
    <div v-if="!uploadedImageUrl">
      <p>Upload a selfie to get started:</p>
      <button @click="handleUploadClick">Upload Image</button>
    </div>
    <div v-if="uploadedImageUrl">
        <button v-if="editValue > 0 || editType === 'glitch'" @click="handleApplyChanges">Apply Changes</button>
        <button v-if="appliedImageData" @click="handleUndo">Undo</button>
        <button v-if="redoAvailable" @click="handleRedo">Redo</button>
        <button v-if="appliedImageData" @click="handleReset">Reset Image</button>
        <button v-if="changesApplied" @click="handleSave">Save Image</button>
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

        <button value="glitch" @click="handleGlitch">Glitch!</button>
    </div>
</template>

<script>
import { resizeImage } from '../assets/js/resize.js'
import { glitchImage } from '../assets/js/glitch'

export default {
    data(){
        return {
            sessionId: null,
            uploadedImageUrl: null,
            showCanvas: false,
            editType: null,
            editValue: 0,
            imageData: null,
            appliedImageData: null,
            currentVersionIndex: -1,
            redoAvailable: false,
            changesApplied: false,
        }
    },
    mounted(){
        this.canvas = this.$refs.canvas;
        this.retrieveSessionId();
    },
    methods: {
        retrieveSessionId(){
            let sessionId = sessionStorage.getItem('sessionId');

            if (sessionId === null) {
                sessionId = this.generateSessionId();
                sessionStorage.setItem('sessionId', sessionId);
            }

            this.sessionId = sessionId;
        },
        generateSessionId(){
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const sessionIdLength = 16;
            let sessionId = '';

            for (let i = 0; i < sessionIdLength; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                sessionId += characters.charAt(randomIndex);
            }

            return sessionId;
        },
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
                console.log(data.processedImage);
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
        handleGlitch(){
            const canvas = this.$refs.canvas;
            this.editType = 'glitch';

            const glitchParams = {
                seed: Math.floor(Math.random() * 99),
                quality: Math.floor(Math.random() * 99),
                amount: Math.floor(Math.random() * 99),
                iterations: Math.floor(Math.random() * 50),
            };

            glitchImage(canvas, glitchParams);
        },
        handleApplyChanges() {
            const canvasData = this.$refs.canvas.toDataURL("image/jpeg");
            const editType = this.editType;
            const editValue = this.editValue;
            const sessionId = this.sessionId;

            this.$nextTick( 
                    this.saveCanvasVersion(canvasData, editType, editValue, sessionId)
                );

            this.changesApplied = true;    
        },
        saveCanvasVersion(canvasData, editType, editValue, sessionId) {
            fetch(`${process.env.VUE_APP_SERVER_URL}/save-version`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    canvasData,
                    editType,
                    editValue,
                    sessionId,
                }),
            })
            .then(response => response.json())
            .then(data => {
                this.currentVersionIndex = data.versionIndex;
                this.appliedImageData = canvasData;
            })
            .catch(error => {
                console.error('Error saving canvas version:', error);
            });
        },
        handleUndo() {
            if (this.currentVersionIndex > 0) {
                const newIndex = this.currentVersionIndex +- 1;
                this.redoAvailable = true;
                this.$nextTick(
                    this.getVersion(newIndex)
                );
            }   
        },
        handleRedo() {
            if(this.redoAvailable){
                const newIndex = this.currentVersionIndex + 1;
                this.$nextTick(() => {
                    this.getVersion(newIndex)
                    this.redoAvailable = false;
                });
            }
        },
        getVersion(newIndex){
            const canvas = this.$refs.canvas;

            fetch(`${process.env.VUE_APP_SERVER_URL}/get-version/${newIndex}`)
                    .then(response => response.json())
                    .then(data => {                
                        const img = new Image();
                        img.onload = function () {
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            ctx.drawImage(img, 0, 0);
                        };
                        img.src = `${data.imageData.image_data}`;
                        this.currentVersionIndex = newIndex;
                    })
                    .catch(error => {
                        console.error('Error fetching previous version:', error);
                    })
        },
        handleReset(){
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
  
            const img = new Image();
            img.onload = () => {
                context.drawImage(img, 0, 0);
            };
    
            fetch(this.uploadedImageUrl)
                .then((response) => response.arrayBuffer())
                .then((buffer) => {
                const blob = new Blob([buffer], { type: "image/*" });
                img.src = URL.createObjectURL(blob);
                })
                .catch((error) => {
                console.error("Error loading image:", error);
            });
        },
        handleSave(){
            const canvas = this.$refs.canvas;
  
            const tempCanvas = document.createElement("canvas");
            const tempContext = tempCanvas.getContext("2d");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;

            tempContext.filter = `blur(${this.blurValue}px)`;
            tempContext.drawImage(canvas, 0, 0);

            const link = document.createElement("a");
            link.href = tempCanvas.toDataURL("image/jpg");
            link.download = "rs_image.jpg";
            link.click();
        },
    }
}
</script>

<style>

</style>