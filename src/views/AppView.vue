<template>
    <canvas 
        v-if="showCanvas" 
        ref="canvas"
        @mousedown="handleOverlayMouseDown"
        @mousemove="handleOverlayMouseMove"
        @mouseup="handleOverlayMouseUp"
        @touchstart="handleOverlayTouchStart"
        @touchmove="handleOverlayTouchMove"
        @touchend="handleOverlayTouchEnd"
        >
    </canvas>
    <div v-if="!uploadedImageUrl">
      <p>Upload a selfie to get started:</p>
      <button @click="handleUploadClick">Upload Image</button>
    </div>
    <!-- edit buttons -->
    <div v-if="uploadedImageUrl">
        <button v-if="editValue > 0 || editType === 'glitch' || editType === 'overlay'" @click="handleApplyChanges">Apply Changes</button>
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
        <input v-if="editType === 'hue'" type="range" min="0" max="360" @change="handleValueChange">

        <button value="brightness" @click="handleEditSelect">Brightness</button>
        <input v-if="editType === 'brightness'" type="range" min="0" max="5" step="0.2" @change="handleValueChange">

        <button value="saturation" @click="handleEditSelect">Saturation</button>
        <input v-if="editType === 'saturation'" type="range" min="0" max="10" step="0.5" @change="handleValueChange">

        <button value="glitch" @click="handleGlitch">Glitch!</button>

        <button value="overlay" @click="handleEditSelect">Overlay</button>

    </div>

    <!-- overlay menu -->
    <div v-if="editType === 'overlay'">
        <p>Select an overlay:</p>
        <button @click="handleUploadClick">Upload Your Own</button>
        <div v-if="userOverlayUploads.length > 0">
            <img
            v-for="overlay in userOverlayUploads"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            >
        </div>
        <div id="overlay-options">
            <img
            v-for="overlay in overlayOptions"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            />
      </div>
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
            secondLayer: false,
            showCanvas: false,
            editType: null,
            editValue: 0,
            imageData: null,
            appliedImageData: null,
            currentVersionIndex: -1,
            redoAvailable: false,
            changesApplied: false,
            overlayOptions: [
                {
                id: 1,
                src: require('@/assets/overlays/1.png')
                },
                {
                id: 2,
                src: require('@/assets/overlays/2.png')
                },
                {
                id: 3,
                src: require('@/assets/overlays/3.png')
                },
                {
                id: 4,
                src: require('@/assets/overlays/4.png')
                },
                {
                id: 5,
                src: require('@/assets/overlays/5.png')
                },
                {
                id: 6,
                src: require('@/assets/overlays/6.png')
                },
                {
                id: 7,
                src: require('@/assets/overlays/7.png')
                },
                {
                id: 8,
                src: require('@/assets/overlays/8.png')
                },
                {
                id: 9,
                src: require('@/assets/overlays/9.png')
                },
                {
                id: 10,
                src: require('@/assets/overlays/10.png')
                },
                {
                id: 11,
                src: require('@/assets/overlays/11.png')
                },
                {
                id: 12,
                src: require('@/assets/overlays/12.png')
                },
                {
                id: 13,
                src: require('@/assets/overlays/13.png')
                },
                {
                id: 14,
                src: require('@/assets/overlays/14.png')
                },
                {
                id: 15,
                src: require('@/assets/overlays/15.png')
                },
                {
                id: 16,
                src: require('@/assets/overlays/16.png')
                },
                {
                id: 17,
                src: require('@/assets/overlays/17.png')
                },
                {
                id: 18,
                src: require('@/assets/overlays/18.png')
                },
                {
                id: 19,
                src: require('@/assets/overlays/19.png')
                },
                {
                id: 20,
                src: require('@/assets/overlays/20.png')
                },
                {
                id: 21,
                src: require('@/assets/overlays/21.png')
                },
                {
                id: 22,
                src: require('@/assets/overlays/22.png')
                },
                {
                id: 23,
                src: require('@/assets/overlays/23.png')
                },
                {
                id: 24,
                src: require('@/assets/overlays/24.png')
                },
                {
                id: 25,
                src: require('@/assets/overlays/25.png')
                },
                        {
                id: 26,
                src: require('@/assets/overlays/26.png')
                },
                        {
                id: 27,
                src: require('@/assets/overlays/27.png')
                },
                {
                id: 28,
                src: require('@/assets/overlays/28.png')
                },
                        {
                id: 29,
                src: require('@/assets/overlays/29.png')
                },
                {
                id: 30,
                src: require('@/assets/overlays/30.png')
                },
                {
                id: 31,
                src: require('@/assets/overlays/31.png')
                },
                {
                id: 32,
                src: require('@/assets/overlays/32.png')
                },
                {
                id: 33,
                src: require('@/assets/overlays/33.png')
                },
                {
                id: 34,
                src: require('@/assets/overlays/34.png')
                },
                {
                id: 35,
                src: require('@/assets/overlays/35.png')
                },
                {
                id: 36,
                src: require('@/assets/overlays/36.png')
                },
                {
                id: 37,
                src: require('@/assets/overlays/37.png')
                },
                {
                id: 38,
                src: require('@/assets/overlays/38.png')
                },
                {
                id: 39,
                src: require('@/assets/overlays/39.png')
                },
            ],
            userOverlayUploads: [],
            isOverlaySelected: false,
            overlayPosition: { x: 0, y: 0 },
            overlaySize: { width: 500, height: 500 },
            touchStartPos: null,
            offscreenCanvas: null,
            offscreenContext: null,
            isScaling: false,
            scalingStartPos: { x: 0, y: 0 },
            isMoving: false,
            movingStartPos: { x: 0, y: 0 },
            secondLayerPosition: { x: 0, y: 0 },
            secondLayerSize: { width: 0, height: 0 },
            isSecondLayerScaling: false,
            isSecondLayerMoving: false,
            secondLayerScalingStartPos: { x: 0, y: 0 },
            secondLayerMovingStartPos: { x: 0, y: 0 },
        }
    },
    mounted(){
        this.canvas = this.$refs.canvas;
        this.retrieveSessionId();
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenContext = this.offscreenCanvas.getContext('2d')
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
            if(this.editType === 'overlay'){
                input.addEventListener("change", this.uploadOverlay.bind(this));
            } else {
                input.addEventListener("change", this.handleUpload.bind(this));
            }
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
        selectOverlay(overlay){
            this.overlayImageUrl = overlay.src;
            this.overlayImage = new Image();
            this.overlayImage.src = overlay.src;
            this.isOverlaySelected = true;
            this.drawCanvas();
            this.isScaling = false;
            this.scalingStartPos = { x: 0, y: 0 };
        },
        uploadOverlay(e) {
            const file = e.target.files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                const dataUrl = event.target.result;

                const overlayObject = {
                    id: this.overlayOptions.length + 1,
                    src: dataUrl
                };

                this.userOverlayUploads.push(overlayObject);
            };

            reader.readAsDataURL(file);
        },
        drawCanvas() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");

            this.offscreenCanvas.width = canvas.width;
            this.offscreenCanvas.height = canvas.height;
            this.offscreenContext.clearRect(0, 0, canvas.width, canvas.height);

            // Draw the current canvas state (uploaded image or applied changes)
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                this.offscreenContext.drawImage(img, 0, 0);

                // Draw the overlay if one is selected
                if (this.isOverlaySelected && this.overlayImage !== null) {
                    const width = this.overlaySize.width;
                    const height = this.overlaySize.height;
                    const x = this.overlayPosition.x + this.overlayImage.width / 2 - width / 2;
                    const y = this.overlayPosition.y + this.overlayImage.height / 2 - height / 2;

                    this.offscreenContext.drawImage(
                        this.overlayImage,
                        x,
                        y,
                        width,
                        height
                    );
                }

                // Clear the main canvas and draw the offscreen canvas on it
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(this.offscreenCanvas, 0, 0);
            };

            if(this.changesApplied === true){
                const dataUrl = this.appliedImageData;
                console.log(dataUrl);
                img.src = dataUrl;
            } else {
                img.src = this.uploadedImageUrl;
            }
        },
        handleOverlayMouseDown(event) {
            const canvas = this.$refs.canvas;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            // Check for shift + click for scaling
            if (event.shiftKey) {
                // Start scaling
                this.isScaling = true;
                this.scalingStartSize = { width: this.overlaySize.width, height: this.overlaySize.height };
                this.scalingStartPos = { x, y };
            } else {
                // Start moving
                this.isMoving = true;
                this.movingStartPos = { x, y };
                this.movingStartOverlayPos = { x: this.overlayPosition.x, y: this.overlayPosition.y };
            }
        },
        handleOverlayMouseMove(event) {
            const canvas = this.$refs.canvas;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.isScaling && this.overlayImage) {
            const scaleRatioX = (x - this.scalingStartPos.x) / 100;
            const scaleRatioY = (y - this.scalingStartPos.y) / 100;

            // Scale while maintaining aspect ratio
            if (event.shiftKey) {
                const scaleRatio = Math.max(scaleRatioX, scaleRatioY);
                this.overlaySize.width = this.scalingStartSize.width + scaleRatio * this.overlayImage.width;
                this.overlaySize.height = this.scalingStartSize.height + scaleRatio * this.overlayImage.height;
            } else {
                this.overlaySize.width = this.scalingStartSize.width + scaleRatioX * this.overlayImage.width;
                this.overlaySize.height = this.scalingStartSize.height + scaleRatioY * this.overlayImage.height;
            }

            this.drawCanvas();
            } else if (this.isMoving && this.overlayImage) {
            const deltaX = x - this.movingStartPos.x;
            const deltaY = y - this.movingStartPos.y;

            this.overlayPosition.x = this.movingStartOverlayPos.x + deltaX;
            this.overlayPosition.y = this.movingStartOverlayPos.y + deltaY;

            this.drawCanvas();
            }
        },
        handleOverlayMouseUp() {
            this.isScaling = false;
            this.isMoving = false;
        },
        handleOverlayTouchStart(e) {
            const touch = e.touches[0];
            if (e.touches.length === 1) {
                // Single touch for moving the overlay
                this.handleOverlayMouseDown(touch);
            } else if (e.touches.length === 2) {
                // Two touches for scaling the overlay
                this.handlePinchStart(e);
            }
        },
        handleOverlayTouchMove(e) {
            const touch = e.touches[0];
            if (e.touches.length === 1) {
            // Single touch for moving the overlay
            this.handleOverlayMouseMove(touch);
            } else if (e.touches.length === 2) {
            // Two touches for scaling the overlay
            this.handlePinchMove(e);
            }
        },
        handleOverlayTouchEnd(e) {
            if (e.touches.length === 0) {
            // No touches for ending scaling
            this.handleOverlayMouseUp();
            }
        },
        handlePinchStart(e) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            this.pinchStartDistance = this.getDistance(touch1, touch2);
            this.pinchStartSize = { width: this.overlaySize.width, height: this.overlaySize.height };
        },
        handlePinchMove(e) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const pinchDistance = this.getDistance(touch1, touch2);

            const scaleRatio = pinchDistance / this.pinchStartDistance;
            this.overlaySize.width = this.pinchStartSize.width * scaleRatio;
            this.overlaySize.height = this.pinchStartSize.height * scaleRatio;

            this.drawCanvas();
        },
        getDistance(point1, point2) {
            const dx = point1.clientX - point2.clientX;
            const dy = point1.clientY - point2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        },
        handleApplyChanges() {
            const canvas = this.$refs.canvas;

            // Create a temporary canvas for applying changes
            const tempCanvas = document.createElement("canvas");
            const tempContext = tempCanvas.getContext("2d");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;

            // Apply overlay if selected
            if (this.isOverlaySelected && this.overlayImage) {
                const width = this.overlaySize.width;
                const height = this.overlaySize.height;
                const x = this.overlayPosition.x + this.overlayImage.width / 2 - width / 2;
                const y = this.overlayPosition.y + this.overlayImage.height / 2 - height / 2;

                tempContext.drawImage(
                    this.overlayImage,
                    x,
                    y,
                    width,
                    height
                );
            }

            tempContext.drawImage(canvas, 0, 0);

            const flattenedCanvasData = tempCanvas.toDataURL("image/jpeg");

            const editType = this.editType;
            const editValue = this.editValue;
            const sessionId = this.sessionId;

            this.saveCanvasVersion(flattenedCanvasData, editType, editValue, sessionId);

            this.appliedImageData = flattenedCanvasData;
            this.isOverlaySelected = false;
            this.overlayImage = null;
            this.overlayPosition = { x: 0, y: 0 };
            this.overlaySize = { width: 500, height: 500 };

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