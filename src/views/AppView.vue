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
        <div id="upload-card">
            <p>Upload a selfie to get started.</p>
            <font-awesome-icon icon="fa-solid fa-upload" size="5x" id="upload-icon"/>
            <button @click="handleUploadClick" id="upload-button" class="button-secondary">Upload Image</button>
        </div>
        <div id="installation-help">
            <h2>Installation</h2>
            <p>
                RebelSelves is a Progressive Web App, meaning it can be used in the browser or installed on your phone or tablet.
            </p>
            <h3>
                Android
            </h3>
            <p>
                On android devices, you should be prompted to add 
            </p>
            <h3>
                iOS
            </h3>
            <p>iOS devices don't automatically send a prompt when visting a PWA.</p>
            <p>To install RebelSelves on your device, you should select 'Share' under the URL of this page, then 'Add To Home Screen'.</p>
        </div>
    </div>
    <!-- edit buttons -->
    <div v-if="uploadedImageUrl">
        <div class="edit-buttons">
                <button v-if="editValue > 0 || editType === 'glitch' || editType === 'overlay'" @click="handleApplyChanges" class="edit-button-secondary">Apply Changes</button>
                <button v-if="appliedImageData" @click="handleUndo" class="edit-button-secondary">Undo</button>
                <button v-if="redoAvailable" @click="handleRedo" class="edit-button-secondary">Redo</button>
                <button v-if="appliedImageData" @click="handleReset" class="edit-button-secondary">Reset Image</button>
                <button v-if="changesApplied" @click="handleSave" class="edit-button-secondary">Save Image</button>
                <button v-if="changesApplied" @click="handleShare" id="shareButton" class="edit-button-secondary">Share Image</button>
        </div>
        <div class="edit-buttons">
            <div class="button-input">
                <button value="blur" @click="handleEditSelect" class="edit-button">Blur</button>
                <input v-if="editType === 'blur'" type="range" min="0" max="20" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="pixelation" @click="handleEditSelect" class="edit-button">Pixelation</button>
                <input v-if="editType === 'pixelation'" type="range" min="0" max="20" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="hue" @click="handleEditSelect" class="edit-button">Hue</button>
                <input v-if="editType === 'hue'" type="range" min="0" max="360" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="brightness" @click="handleEditSelect" class="edit-button">Brightness</button>
                <input v-if="editType === 'brightness'" type="range" min="0" max="5" step="0.2" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="saturation" @click="handleEditSelect" class="edit-button">Saturation</button>
                <input v-if="editType === 'saturation'" type="range" min="0" max="10" step="0.5" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="glitch" @click="handleGlitch" class="edit-button">Glitch!</button>
            </div>

            <div class="button-input">
                <button value="overlay" @click="handleEditSelect" class="edit-button">Overlay</button>
            </div>
        </div>
    </div>

    <!-- overlay menu -->
    <div v-if="editType === 'overlay'">
        <div v-if="isOverlaySelected" class="edit-buttons">
            <div class="button-input">
                <button value="transparency" @click="handleTransparency" class="edit-button-secondary">Overlay Transparency</button>
                <input v-if="transparencySelected" type="range" min="0" max="10" step="0.5" @change="adjustOverlayTransparency">
            </div>
            <div class="button-input">
                <button @click="toggleScaling" class="edit-button-secondary">Resize</button>
            </div>
            <div class="button-input">
                <button @click="toggleRotating" class="edit-button-secondary">Rotate</button>
            </div> 
        </div>
        <p>Select an overlay:</p>
        <button @click="handleUploadClick" class="edit-button" id="upload-overlay-button">Upload Your Own</button>
        <div v-if="userOverlayUploads.length > 0" class="overlay-options">
            <img
            v-for="overlay in userOverlayUploads"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            @touch="selectOverlay(overlay)"
            >
        </div>

        <button 
            value="masks"
            class="overlay-submenu-button"
            @click="toggleOverlaySubmenu">
            Masks 
            <font-awesome-icon v-if="!toggleMasks" icon="fa-solid fa-chevron-down"/>
            <font-awesome-icon v-else icon="fa-solid fa-chevron-up"/>
        </button>
        <div v-if="toggleMasks" class="overlay-options">
            <img
            v-for="overlay in overlayMaskOptions"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            />
        </div>

        <button 
            value="selfies"
            class="overlay-submenu-button"
            @click="toggleOverlaySubmenu">
            Selfies 
            <font-awesome-icon v-if="!toggleSelfie" icon="fa-solid fa-chevron-down"/>
            <font-awesome-icon v-else icon="fa-solid fa-chevron-up"/>
        </button>
        <div v-if="toggleSelfie" class="overlay-options">
            <img
            v-for="overlay in overlaySelfieOptions"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            />
        </div>
        
        <button 
            value="texture"
            class="overlay-submenu-button"
            @click="toggleOverlaySubmenu">
            Texture 
            <font-awesome-icon v-if="!toggleTexture" icon="fa-solid fa-chevron-down"/>
            <font-awesome-icon v-else icon="fa-solid fa-chevron-up"/>
        </button>
        <div v-if="toggleTexture" class="overlay-options">
            <img
            v-for="overlay in overlayTextureOptions"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            />
        </div>
        
        <button 
            value="stickers"
            class="overlay-submenu-button"
            @click="toggleOverlaySubmenu">
            Stickers 
            <font-awesome-icon v-if="!toggleStickers" icon="fa-solid fa-chevron-down"/>
            <font-awesome-icon v-else icon="fa-solid fa-chevron-up"/>
        </button>
        <div v-if="toggleStickers" class="overlay-options">
            <img
            v-for="overlay in overlayStickerOptions"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            />
        </div>
        
        <button 
            value="other"
            class="overlay-submenu-button"
            @click="toggleOverlaySubmenu">
            Other 
            <font-awesome-icon v-if="!toggleOther" icon="fa-solid fa-chevron-down"/>
            <font-awesome-icon v-else icon="fa-solid fa-chevron-up"/>
        </button>
        <div v-if="toggleOther" class="overlay-options">
            <img
            v-for="overlay in overlayOtherOptions"
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
            isMobileOrTablet: this.detectMobileOrTablet(),
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
            toggleMasks: false,
            toggleSelfie: false,
            toggleStickers: false,
            toggleTexture: false,
            toggleOther: false,
            overlayMaskOptions: [
                {
                    id: 1,
                    src: require('@/assets/overlays/masks/1.png')
                },
                {
                    id: 2,
                    src: require('@/assets/overlays/masks/2.png')
                },
                {
                    id: 3,
                    src: require('@/assets/overlays/masks/3.png')
                },
                {
                    id: 4,
                    src: require('@/assets/overlays/masks/4.png')
                },
                {
                    id: 5,
                    src: require('@/assets/overlays/masks/5.png')
                },
                {
                    id: 6,
                    src: require('@/assets/overlays/masks/6.png')
                },
                {
                    id: 7,
                    src: require('@/assets/overlays/masks/7.png')
                },
                {
                    id: 8,
                    src: require('@/assets/overlays/masks/8.png')
                },
                {
                    id: 9,
                    src: require('@/assets/overlays/masks/9.png')
                },
            ],
            overlaySelfieOptions: [
                {
                    id: 1,
                    src: require('@/assets/overlays/selfie/1.png')
                },
                {
                    id: 2,
                    src: require('@/assets/overlays/selfie/2.png')
                },
                {
                    id: 3,
                    src: require('@/assets/overlays/selfie/3.png')
                },
                {
                    id: 4,
                    src: require('@/assets/overlays/selfie/4.png')
                },
                {
                    id: 5,
                    src: require('@/assets/overlays/selfie/5.png')
                },
                {
                    id: 6,
                    src: require('@/assets/overlays/selfie/6.png')
                },
                {
                    id: 7,
                    src: require('@/assets/overlays/selfie/7.png')
                },
                {
                    id: 8,
                    src: require('@/assets/overlays/selfie/8.png')
                },
                {
                    id: 9,
                    src: require('@/assets/overlays/selfie/9.png')
                },
                {
                    id: 10,
                    src: require('@/assets/overlays/selfie/10.png')
                },
                {
                    id: 11,
                    src: require('@/assets/overlays/selfie/11.png')
                },
            ],
            overlayStickerOptions: [
                {
                    id: 1,
                    src: require('@/assets/overlays/stickers/1.png')
                },
                {
                    id: 2,
                    src: require('@/assets/overlays/stickers/2.png')
                },
                {
                    id: 3,
                    src: require('@/assets/overlays/stickers/3.png')
                },
                {
                    id: 4,
                    src: require('@/assets/overlays/stickers/4.png')
                },
                {
                    id: 5,
                    src: require('@/assets/overlays/stickers/5.png')
                },
                {
                    id: 6,
                    src: require('@/assets/overlays/stickers/6.png')
                },
                {
                    id: 7,
                    src: require('@/assets/overlays/stickers/7.png')
                },
                {
                    id: 8,
                    src: require('@/assets/overlays/stickers/8.png')
                },
                {
                    id: 9,
                    src: require('@/assets/overlays/stickers/9.png')
                },
                {
                    id: 10,
                    src: require('@/assets/overlays/stickers/10.png')
                },
                {
                    id: 11,
                    src: require('@/assets/overlays/stickers/11.png')
                },
                {
                    id: 12,
                    src: require('@/assets/overlays/stickers/12.png')
                },
                {
                    id: 13,
                    src: require('@/assets/overlays/stickers/13.png')
                },
                {
                    id: 14,
                    src: require('@/assets/overlays/stickers/14.png')
                },
                {
                    id: 15,
                    src: require('@/assets/overlays/stickers/15.png')
                },
                {
                    id: 16,
                    src: require('@/assets/overlays/stickers/16.png')
                },
                {
                    id: 17,
                    src: require('@/assets/overlays/stickers/17.png')
                },
                {
                    id: 18,
                    src: require('@/assets/overlays/stickers/18.png')
                },
                {
                    id: 19,
                    src: require('@/assets/overlays/stickers/19.png')
                },
                {
                    id: 20,
                    src: require('@/assets/overlays/stickers/11.png')
                },
                {
                    id: 21,
                    src: require('@/assets/overlays/stickers/11.png')
                },
            ],
            overlayTextureOptions: [
            {
                    id: 1,
                    src: require('@/assets/overlays/textures/1.png')
                },
                {
                    id: 2,
                    src: require('@/assets/overlays/textures/2.png')
                },
                {
                    id: 3,
                    src: require('@/assets/overlays/textures/3.png')
                },
                {
                    id: 4,
                    src: require('@/assets/overlays/textures/4.png')
                },
                {
                    id: 5,
                    src: require('@/assets/overlays/textures/5.png')
                },
                {
                    id: 6,
                    src: require('@/assets/overlays/textures/6.png')
                },
                {
                    id: 7,
                    src: require('@/assets/overlays/textures/7.png')
                },
                {
                    id: 8,
                    src: require('@/assets/overlays/textures/8.png')
                },
                {
                    id: 9,
                    src: require('@/assets/overlays/textures/9.png')
                },
                {
                    id: 10,
                    src: require('@/assets/overlays/textures/10.png')
                },
                {
                    id: 11,
                    src: require('@/assets/overlays/textures/11.png')
                },
                {
                    id: 12,
                    src: require('@/assets/overlays/textures/12.png')
                },
                {
                    id: 13,
                    src: require('@/assets/overlays/textures/13.png')
                },
                {
                    id: 14,
                    src: require('@/assets/overlays/textures/14.png')
                },
                {
                    id: 15,
                    src: require('@/assets/overlays/textures/15.png')
                },
            ],
            overlayOtherOptions: [
            {
                    id: 1,
                    src: require('@/assets/overlays/other/1.png')
                },
                {
                    id: 2,
                    src: require('@/assets/overlays/other/2.png')
                },
                {
                    id: 3,
                    src: require('@/assets/overlays/other/3.png')
                },
                {
                    id: 4,
                    src: require('@/assets/overlays/other/4.png')
                },
                {
                    id: 5,
                    src: require('@/assets/overlays/other/5.png')
                },
                {
                    id: 6,
                    src: require('@/assets/overlays/other/6.png')
                },
                {
                    id: 7,
                    src: require('@/assets/overlays/other/7.png')
                },
                {
                    id: 8,
                    src: require('@/assets/overlays/other/8.png')
                },
                {
                    id: 9,
                    src: require('@/assets/overlays/other/9.png')
                },
                {
                    id: 10,
                    src: require('@/assets/overlays/other/10.png')
                },
                {
                    id: 11,
                    src: require('@/assets/overlays/other/11.png')
                },
                {
                    id: 12,
                    src: require('@/assets/overlays/other/12.png')
                },
                {
                    id: 13,
                    src: require('@/assets/overlays/other/13.png')
                },
                {
                    id: 14,
                    src: require('@/assets/overlays/other/14.png')
                },
                {
                    id: 15,
                    src: require('@/assets/overlays/other/15.png')
                },
                {
                    id: 16,
                    src: require('@/assets/overlays/other/16.png')
                },
                {
                    id: 17,
                    src: require('@/assets/overlays/other/17.png')
                },
                {
                    id: 18,
                    src: require('@/assets/overlays/other/18.png')
                },
                {
                    id: 19,
                    src: require('@/assets/overlays/other/19.png')
                },
                {
                    id: 20,
                    src: require('@/assets/overlays/other/11.png')
                },
                {
                    id: 21,
                    src: require('@/assets/overlays/other/11.png')
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
            rotationStartPos: { x: 0, y: 0},
            rotationStartAngle: 0,
            overlayRotation: 0,
            isRotating: false,
            transparencySelected: false,
        }
    },
    created(){
        document.title = 'RebelSelves';
    },
    mounted(){
        this.canvas = this.$refs.canvas;
        this.retrieveSessionId();
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenContext = this.offscreenCanvas.getContext('2d')
    },
    beforeUnmount(){
        navigator.sendBeacon(`${process.env.VUE_APP_SERVER_URL}/clean-up`)
    },
    methods: {
        detectMobileOrTablet() {
            const screenWidth = window.innerWidth;
            const isMobileOrTablet = screenWidth < 768; 

            return isMobileOrTablet;
        },
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
            
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*,.heic,.heif";
            input.capture = "true"
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
                        this.showCanvas = true;

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

                                this.imageData = canvas.toDataURL("image/jpeg");
                            };
                            img.crossOrigin="anonymous";
                            img.src = event.target.result;
                        };
                        reader.readAsDataURL(resizedBlob);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

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
        handleTransparency(){
            this.transparencySelected = true;
        },
        adjustOverlayTransparency(e) {
            const transparencyValue = e.target.value;

            // Assuming this.overlayImage is the reference to your overlay <img> element
            if (this.overlayImage) {
                const opacity = transparencyValue / 10; // Adjust the divisor based on your needs
                this.overlayImage.style.opacity = opacity.toString();
            }

            this.$nextTick(() => {
                this.drawCanvas();
            });
        },
        toggleOverlaySubmenu(e){
            const value = e.target.value;

            this.$nextTick(() => {
                if (value === 'masks') {
                    this.toggleMasks = !this.toggleMasks;
                } else if (value === 'selfies') {
                    this.toggleSelfie = !this.toggleSelfie;
                } else if (value === 'texture') {
                    this.toggleTexture = !this.toggleTexture;
                } else if (value === 'stickers') {
                    this.toggleStickers = !this.toggleStickers;
                } else if (value === 'other') {
                    this.toggleOther = !this.toggleOther;
                } else {
                    console.log('Error opening overlay sub menu. ', value);
                }
            })
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

            resizeImage(file, 1080, 1080, (resizedBlob) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    const dataUrl = event.target.result;

                    const overlayObject = {
                        id: this.userOverlayUploads.length + 1,
                        src: dataUrl
                    };

                    this.userOverlayUploads.push(overlayObject);
                };

                reader.readAsDataURL(resizedBlob);
            })
        },
        drawCanvas() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");

            this.offscreenCanvas.width = canvas.width;
            this.offscreenCanvas.height = canvas.height;
            this.offscreenContext.clearRect(0, 0, canvas.width, canvas.height);

            const img = new Image();
            img.crossOrigin = "Anonymous";

            if (this.changesApplied === true) {
                const dataUrl = this.appliedImageData;
                img.src = dataUrl;
            } else {
                img.src = this.imageData;
            }

            img.onload = () => {
                this.offscreenContext.drawImage(img, 0, 0);

                if (this.isOverlaySelected && this.overlayImage !== null) {
                    const width = this.overlaySize.width;
                    const height = this.overlaySize.height;
                    const x = this.overlayPosition.x + this.overlayImage.width / 2 - width / 2;
                    const y = this.overlayPosition.y + this.overlayImage.height / 2 - height / 2;

                    // Save the current transformation matrix
                    this.offscreenContext.save();

                    // Translate to the center of the overlay
                    this.offscreenContext.translate(x + width / 2, y + height / 2);

                    // Apply rotation
                    this.offscreenContext.rotate(this.overlayRotation);

                    // Set opacity
                    this.offscreenContext.globalAlpha = this.overlayImage.style.opacity || 1;

                    // Draw the rotated overlay
                    this.offscreenContext.drawImage(
                        this.overlayImage,
                        -width / 2,
                        -height / 2,
                        width,
                        height
                    );

                    // Restore the original transformation matrix
                    this.offscreenContext.restore();
                }

                // Clear the main canvas and draw the offscreen canvas on it
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(this.offscreenCanvas, 0, 0);
            };
        },
        toggleScaling() {
            this.isScaling = !this.isScaling;
            if (this.isScaling) {
                this.isRotating = false;
            }
        },
        toggleRotating() {
            this.isRotating = !this.isRotating;
            if (this.isRotating) {
                this.isScaling = false;
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
            } else if (event.ctrlKey) {
                // start rotating
                this.isRotating = true;
                this.rotationStartPos = { x, y };
                this.rotationStartAngle = Math.atan2(y - this.overlayPosition.y, x - this.overlayPosition.x);
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

                if (event.shiftKey) {
                    const scaleRatio = Math.max(scaleRatioX, scaleRatioY);
                    this.overlaySize.width = this.scalingStartSize.width + scaleRatio * this.overlayImage.width;
                    this.overlaySize.height = this.scalingStartSize.height + scaleRatio * this.overlayImage.height;
                } else {
                    this.overlaySize.width = this.scalingStartSize.width + scaleRatioX * this.overlayImage.width;
                    this.overlaySize.height = this.scalingStartSize.height + scaleRatioY * this.overlayImage.height;
                }

                this.drawCanvas();
            } else if (this.isRotating && this.overlayImage) {
                const angle = Math.atan2(y - (this.overlayPosition.y + this.overlaySize.height / 2), x - (this.overlayPosition.x + this.overlaySize.width / 2));
                const rotationDelta = angle - this.rotationStartAngle;

                // Adjust the rotation sensitivity
                const rotationScalingFactor = 0.01;

                // Cap the rotation speed to the maximum value
                this.overlayRotation += rotationDelta * rotationScalingFactor;

                // Define a maximum rotation speed (experiment with different values)
                const maxRotationSpeed = 5;

                // Cap the rotation speed
                this.overlayRotation = Math.min(this.overlayRotation, maxRotationSpeed);

                // Normalize the rotation to keep it within the range [0, 2π]
                this.overlayRotation = (this.overlayRotation + 2 * Math.PI) % (2 * Math.PI);

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
            this.isRotating = false;
        },
        handleOverlayTouchStart(e) {
            const touch = e.touches[0];
            if (e.touches.length === 1) {
                // Single touch for moving the overlay
                this.handleOverlayMouseDown(touch);
            } else if (e.touches.length === 2) {
                // Two touches for scaling or rotating the overlay
                this.handlePinchStart(e);
            }
        },
        handleOverlayTouchMove(e) {
            const touch = e.touches[0];
            if (e.touches.length === 1) {
                // Single touch for moving the overlay
                this.handleOverlayMouseMove(touch);

                // If scaling or rotating is active, turn them off
                if (this.isScaling || this.isRotating) {
                    this.isScaling = false;
                    this.isRotating = false;
                }
            } else if (e.touches.length === 2) {
                // Two touches for scaling the overlay
                this.handlePinchMove(e);
            }
        },
        handleOverlayTouchEnd(e) {
            if (e.touches.length === 0) {
                // No touches for ending scaling
                this.handleOverlayMouseUp();

                // If scaling or rotating is active, turn them off
                if (this.isScaling || this.isRotating) {
                    this.isScaling = false;
                    this.isRotating = false;
                }
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

            if (this.isScaling) {
                // Scaling is active
                this.overlaySize.width = this.pinchStartSize.width * scaleRatio;
                this.overlaySize.height = this.pinchStartSize.height * scaleRatio;
                this.drawCanvas();
            } else if (this.isRotating) {
                // Rotating is active (you can add your rotation logic here)
                const angle = Math.atan2(touch2.clientY - touch1.clientY, touch2.clientX - touch1.clientX);
                const rotationDelta = angle - this.rotationStartAngle;

                // Add your rotation logic here

                // Draw canvas
                this.drawCanvas();
            }
        },
        getDistance(point1, point2) {
            const dx = point1.clientX - point2.clientX;
            const dy = point1.clientY - point2.clientY;
            return Math.sqrt(dx * dx + dy * dy);
        },
        clearCanvas() {
            const canvas = this.$refs.canvas;
            this.context.clearRect(0, 0, canvas.width, canvas.height);
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
        handleReset() {
            const canvas = this.$refs.canvas;
            const context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);

            const img = new Image();
            img.onload = () => {
                context.drawImage(img, 0, 0);
            };

            img.src = this.imageData;

            fetch(`${process.env.VUE_APP_SERVER_URL}/clear-db`, {
                method: "POST",
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Database cleared successfully:", data);
                })
                .catch((error) => {
                    console.error("Error clearing database:", error);
                });

            this.changesApplied = false;
            this.appliedImageData = null;
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
        handleShare() {
            const canvas = this.$refs.canvas;

            const tempCanvas = document.createElement("canvas");
            const tempContext = tempCanvas.getContext("2d");
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            tempContext.drawImage(canvas, 0, 0);

            // Convert the temporary canvas to a data URL (base64-encoded image)
            const imageDataURL = tempCanvas.toDataURL("image/jpeg");

            // Use the Web Share API to share the image
            if (navigator.share) {
                navigator.share({
                title: 'My Edited Image',
                files: [new File([this.dataURLtoBlob(imageDataURL)], 'rs_image.jpg')],
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing:', error));
            } else {
                console.log('Web Share API not supported');
                // implement fallback logic
            }
        },
    }
}
</script>

<style>

#upload-card {
    display: flex;
    flex-direction: column;
    gap: 1rem
}

#upload-card button{
    align-self: center;
}

#upload-icon {
    color: var(--gold)
}

#installation-help {
    background-color: var(--white);
    margin: 25px 15px;
    border-radius: 25px;
    padding: 5px 15px;
    font-size: 15px;
    text-align: left;
}

#installation-help h2 {
    text-align: center;
}

@media (min-width: 600px) {
    #installation-help {
        width: 60vw;
        margin: 25px auto;
    }
}

canvas {
    height: auto;
    width: 70vw;
    margin-top: 20px;
}

@media (min-width: 500px) {
    canvas {
        width: 50vw;
    }
}

@media (min-width: 820px) {
    canvas {
        width: 33vw;
    }
}

.edit-buttons {
    display: flex;
    gap: 0.8em;
    flex-wrap: wrap;
    justify-content: center;
    padding: 5px;
    margin: 15px;
}

.edit-button {
    background-color: var(--gold);
    color: var(--black);
    border: none;
    font-size: 20px;
    padding: 10px;
}

.edit-button-secondary {
    background-color: white;
    color: var(--gold);
    border: 3px solid var(--gold);
    font-size: 17code px;
    padding: 10px;
}

.button-input > input {
    margin: 0 15px;
}

.overlay-options {
    display: flex;
    justify-content: center;
    gap: 1em;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

.overlay-options > * {
    flex-shrink: 0;
    max-width: 150px;
    border: 1px solid rgb(92, 91, 91);
    border-radius: 20px;
    padding: 7px;
}

#upload-overlay-button {
    margin-bottom: 20px;
}

.overlay-submenu-button {
    display: block;
    background-color: var(--black);
    color: var(--white);
    border: none;
    font-size: 18px;
    padding: 8px;
    width: 40vw;
    margin: 5px auto;
}

/* 
ensures that child elements of buttons do not prevent button click events from firing 
https://css-tricks.com/slightly-careful-sub-elements-clickable-things/
*/
button > * {
    pointer-events: none;
}

</style>