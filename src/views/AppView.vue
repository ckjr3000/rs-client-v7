<template>
    <div v-if="isLoading" class="processing-overlay">
      <p>Loading...</p>
    </div>
    <div v-if="showChangesModal" id="changes-applied-modal">
      <p>Changes Applied!</p>
    </div>
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
    <div class="web-share-fallback">
        <div class="share">
            <h2>Share image</h2>
            <button>social link</button>
            <button>social link</button>
            <button>social link</button>
            <button id="close-share-modal">Close</button>
        </div>
    </div>
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
                On android devices, open the menu in the top right corner of your broswer and select 'Install app'. 
            </p>
            <h3>
                iOS
            </h3>
            <p>
                On an iOS device, tap the share button either at the bottom of the page, or next to the url (depends on the browser you are using), and select 'Add to home screen'.
            </p>
        </div>
    </div>
    <!-- edit buttons -->
    <div v-if="uploadedImageUrl">
        <button id="discard-button" class="edit-button-secondary" @click="handleDiscard">Discard</button>
        <div class="edit-buttons">
                <button v-if="editValue > 1 || editType === 'glitch' || editType === 'overlay'" @click="handleApplyChanges" class="edit-button-secondary">Apply Changes</button>
                <button v-if="changesApplied >= 2" @click="handleUndo" class="edit-button-secondary">Undo</button>
                <button v-if="appliedImageData" @click="handleReset" class="edit-button-secondary">Reset Image</button>
                <button v-if="changesApplied > 0" @click="handleSave" class="edit-button-secondary">Save Image</button>
                <!-- <button v-if="changesApplied > 0" @click="handleShare" id="shareButton" class="edit-button-secondary">Share Image</button> -->
        </div>
        <div class="edit-buttons">
            <div class="button-input">
                <button value="blur" @click="handleEditSelect" class="edit-button">Blur</button>
                <input v-if="editType === 'blur'" type="range" min="1" max="20" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="pixelation" @click="handleEditSelect" class="edit-button">Pixelation</button>
                <input v-if="editType === 'pixelation'" type="range" min="1" max="20" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="hue" @click="handleEditSelect" class="edit-button">Hue</button>
                <input v-if="editType === 'hue'" type="range" min="1" max="360" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="brightness" @click="handleEditSelect" class="edit-button">Brightness</button>
                <input v-if="editType === 'brightness'" type="range" min="1" max="5" step="0.2" defaultValue="0" @change="handleValueChange">
            </div>

            <div class="button-input">
                <button value="saturation" @click="handleEditSelect" class="edit-button">Saturation</button>
                <input v-if="editType === 'saturation'" type="range" min="1" max="10" step="0.5" defaultValue="0" @change="handleValueChange">
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
            :class="{ 'selected-overlay': overlay.id === selectedOverlayId }"
            >
        </div>

        <button 
            value="pose"
            class="overlay-submenu-button"
            @click="toggleOverlaySubmenu">
            Pose 
            <font-awesome-icon v-if="!togglePose" icon="fa-solid fa-chevron-down"/>
            <font-awesome-icon v-else icon="fa-solid fa-chevron-up"/>
        </button>
        <div v-if="togglePose" class="overlay-options">
            <img
            v-for="overlay in overlayPoseOptions"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            :class="{ 'selected-overlay': overlay.id === selectedOverlayId }"
            />
        </div>

        <button 
            value="frames"
            class="overlay-submenu-button"
            @click="toggleOverlaySubmenu">
            Frames 
            <font-awesome-icon v-if="!toggleFrames" icon="fa-solid fa-chevron-down"/>
            <font-awesome-icon v-else icon="fa-solid fa-chevron-up"/>
        </button>
        <div v-if="toggleFrames" class="overlay-options">
            <img
            v-for="overlay in overlayFramesOptions"
            :key="overlay.id"
            :src="overlay.src"
            @click="selectOverlay(overlay)"
            :class="{ 'selected-overlay': overlay.id === selectedOverlayId }"
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
            :class="{ 'selected-overlay': overlay.id === selectedOverlayId }"
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
            :class="{ 'selected-overlay': overlay.id === selectedOverlayId }"
            />
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
            :class="{ 'selected-overlay': overlay.id === selectedOverlayId }"
            />
        </div>
    </div>
    <Footer />
</template>

<script>
import { resizeImage } from '../assets/js/resize.js'
import { glitchImage } from '../assets/js/glitch'
import Footer from '../components/Footer.vue'


export default {
    components: { Footer },
    data(){
        return {
            isMobileOrTablet: this.detectMobileOrTablet(),
            sessionId: null,
            uploadedImageUrl: null,
            showCanvas: false,
            isLoading: false,
            editType: null,
            editValue: 0,
            imageData: null,
            appliedImageData: null,
            currentVersionIndex: -1,
            changesApplied: 0,
            showChangesModal: false,
            toggleMasks: false,
            toggleFrames: false,
            toggleStickers: false,
            toggleTexture: false,
            togglePose: false,
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
                {
                    id: 10,
                    src: require('@/assets/overlays/masks/10.png')
                },
                {
                    id: 11,
                    src: require('@/assets/overlays/masks/11.png')
                },
                {
                    id: 12,
                    src: require('@/assets/overlays/masks/12.png')
                },
                {
                    id: 13,
                    src: require('@/assets/overlays/masks/13.png')
                },
            ],
            overlayPoseOptions: [
                {
                    id: 14,
                    src: require('@/assets/overlays/pose/1.png')
                },
                {
                    id: 15,
                    src: require('@/assets/overlays/pose/2.png')
                },
                {
                    id: 16,
                    src: require('@/assets/overlays/pose/3.png')
                },
                {
                    id: 17,
                    src: require('@/assets/overlays/pose/4.png')
                },
                {
                    id: 18,
                    src: require('@/assets/overlays/pose/5.png')
                },
                {
                    id: 19,
                    src: require('@/assets/overlays/pose/6.png')
                },
                {
                    id: 20,
                    src: require('@/assets/overlays/pose/7.png')
                },
                {
                    id: 21,
                    src: require('@/assets/overlays/pose/8.png')
                },
                {
                    id: 22,
                    src: require('@/assets/overlays/pose/9.png')
                },
                {
                    id: 23,
                    src: require('@/assets/overlays/pose/10.png')
                },
                {
                    id: 24,
                    src: require('@/assets/overlays/pose/11.png')
                },
            ],
            overlayStickerOptions: [
                {
                    id: 25,
                    src: require('@/assets/overlays/stickers/1.png')
                },
                {
                    id: 26,
                    src: require('@/assets/overlays/stickers/2.png')
                },
                {
                    id: 27,
                    src: require('@/assets/overlays/stickers/3.png')
                },
                {
                    id: 28,
                    src: require('@/assets/overlays/stickers/4.png')
                },
                {
                    id: 29,
                    src: require('@/assets/overlays/stickers/5.png')
                },
                {
                    id: 30,
                    src: require('@/assets/overlays/stickers/6.png')
                },
                {
                    id: 31,
                    src: require('@/assets/overlays/stickers/7.png')
                },
                {
                    id: 32,
                    src: require('@/assets/overlays/stickers/8.png')
                },
                {
                    id: 33,
                    src: require('@/assets/overlays/stickers/9.png')
                },
                {
                    id: 34,
                    src: require('@/assets/overlays/stickers/10.png')
                },
                {
                    id: 35,
                    src: require('@/assets/overlays/stickers/11.png')
                },
                {
                    id: 36,
                    src: require('@/assets/overlays/stickers/12.png')
                },
                {
                    id: 37,
                    src: require('@/assets/overlays/stickers/13.png')
                },
                {
                    id: 38,
                    src: require('@/assets/overlays/stickers/14.png')
                },
                {
                    id: 39,
                    src: require('@/assets/overlays/stickers/15.png')
                },
            ],
            overlayTextureOptions: [
                {
                    id: 40,
                    src: require('@/assets/overlays/texture/1.png')
                },
                {
                    id: 41,
                    src: require('@/assets/overlays/texture/2.png')
                },
                {
                    id: 42,
                    src: require('@/assets/overlays/texture/3.png')
                },
                {
                    id: 43,
                    src: require('@/assets/overlays/texture/4.png')
                },
                {
                    id: 44,
                    src: require('@/assets/overlays/texture/5.png')
                },
                {
                    id: 45,
                    src: require('@/assets/overlays/texture/6.png')
                },
                {
                    id: 46,
                    src: require('@/assets/overlays/texture/7.png')
                },
                {
                    id: 47,
                    src: require('@/assets/overlays/texture/8.png')
                },
                {
                    id: 48,
                    src: require('@/assets/overlays/texture/9.png')
                },
                {
                    id: 49,
                    src: require('@/assets/overlays/texture/10.png')
                },
                {
                    id: 50,
                    src: require('@/assets/overlays/texture/11.png')
                },
                {
                    id: 51,
                    src: require('@/assets/overlays/texture/12.png')
                },
                {
                    id: 52,
                    src: require('@/assets/overlays/texture/13.png')
                },
                {
                    id: 53,
                    src: require('@/assets/overlays/texture/14.png')
                },
                {
                    id: 54,
                    src: require('@/assets/overlays/texture/15.png')
                },
                {
                    id: 55,
                    src: require('@/assets/overlays/texture/16.png')
                },
                {
                    id: 56,
                    src: require('@/assets/overlays/texture/17.png')
                },
                {
                    id: 57,
                    src: require('@/assets/overlays/texture/18.png')
                },
            ],
            overlayFramesOptions: [
                {
                    id: 58,
                    src: require('@/assets/overlays/frames/1.png')
                },
                {
                    id: 59,
                    src: require('@/assets/overlays/frames/2.png')
                },
                {
                    id: 60,
                    src: require('@/assets/overlays/frames/3.png')
                },
                {
                    id: 61,
                    src: require('@/assets/overlays/frames/4.png')
                },
                {
                    id: 62,
                    src: require('@/assets/overlays/frames/5.png')
                },
                {
                    id: 63,
                    src: require('@/assets/overlays/frames/6.png')
                },
                {
                    id: 64,
                    src: require('@/assets/overlays/frames/7.png')
                },
                {
                    id: 65,
                    src: require('@/assets/overlays/frames/8.png')
                },
                {
                    id: 66,
                    src: require('@/assets/overlays/frames/9.png')
                },
                {
                    id: 67,
                    src: require('@/assets/overlays/frames/10.png')
                },
                {
                    id: 68,
                    src: require('@/assets/overlays/frames/11.png')
                },
                {
                    id: 69,
                    src: require('@/assets/overlays/frames/12.png')
                },
                {
                    id: 70,
                    src: require('@/assets/overlays/frames/13.png')
                },
                {
                    id: 71,
                    src: require('@/assets/overlays/frames/14.png')
                },
                {
                    id: 72,
                    src: require('@/assets/overlays/frames/15.png')
                },
                {
                    id: 73,
                    src: require('@/assets/overlays/frames/16.png')
                },
                {
                    id: 74,
                    src: require('@/assets/overlays/frames/17.png')
                },
                {
                    id: 75,
                    src: require('@/assets/overlays/frames/18.png')
                },
            ],
            userOverlayUploads: [],
            isOverlaySelected: false,
            selectedOverlayId: 0,
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
            this.isLoading = true;

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
                            this.isLoading = false;
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
            this.editValue = 1;
            this.updateCanvas();
        },
        handleValueChange(e){
            const editValue = e.target.value;
            this.editValue = editValue;
            this.isLoading = true;

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
                this.isLoading = false;
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
                if (value === 'pose') {
                    this.togglePose = !this.togglePose;
                } else if (value === 'masks') {
                    this.toggleMasks = !this.toggleMasks;
                } else if (value === 'texture') {
                    this.toggleTexture = !this.toggleTexture;
                } else if (value === 'stickers') {
                    this.toggleStickers = !this.toggleStickers;
                } else if (value === 'frames') {
                    this.toggleFrames = !this.toggleFrames;
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
            this.selectedOverlayId = overlay.id;
            this.drawCanvas();
            this.isScaling = false;
            this.scalingStartPos = { x: 0, y: 0 };
            this.isRotating = false;
        },
        uploadOverlay(e) {
            const file = e.target.files[0];

            resizeImage(file, 1080, 1080, (resizedBlob) => {
                const reader = new FileReader();
                let idStart = 77 + this.userOverlayUploads.length;

                reader.onload = (event) => {
                    const dataUrl = event.target.result;

                    const overlayObject = {
                        id: idStart + 1,
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

            if (this.changesApplied > 0) {
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

            this.changesApplied++;
            this.showChangesModal = true;
            setTimeout(()=>{
                this.showChangesModal = false;
            }, 1000)
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
            if (this.currentVersionIndex > 0 || this.changesApplied >= 2) {
                const newIndex = this.currentVersionIndex +- 1;
                this.$nextTick(
                    this.getVersion(newIndex)
                );
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

            this.changesApplied = 0;
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
            link.download = "rs_image";
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

            const shareOverlay = document.getElementsByClassName('web-share-fallback');
            const shareModal = document.getElementsByClassName('share');
            shareOverlay[0].classList.add('show-share');
            shareModal[0].classList.add('show-share');

            const shareButton = document.getElementById('close-share-modal');
            shareButton.addEventListener('click', () => {
                shareOverlay[0].classList.remove('show-share');
                shareModal[0].classList.remove('show-share');
            })
        },
        handleDiscard(){
            location.reload();
        }
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
    touch-action: none;
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

.selected-overlay {
  border: 2px solid #ff0000; /* Change this to your desired border color */
}

.processing-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.7);
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
  }

.web-share-fallback {
    opacity: 1;
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,.5);
}

.web-share-fallback, .share {
    display: none;
}

.show-share {
    display: block;
}

.share {
    position: absolute;
    left: 0;
    right: 0;
    top: 30%;
    margin: auto;
    width: 50%;
    z-index: 1;
    padding: 1em;
    background: white;
}

.share h2 {
    margin: 0;
}

.share button {
    border: none;
    padding: .8em 1.2em;
    width: 32%;
    cursor: pointer;
    margin: 3em 0.2em 0.2em 0.2em;
}

#changes-applied-modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(255, 255, 255, 0.7);
    padding: 10px;
    border-radius: 5px;
    font-weight: bold;
}

#discard-button {
    margin-top: 10px;
}

/* 
ensures that child elements of buttons do not prevent button click events from firing 
https://css-tricks.com/slightly-careful-sub-elements-clickable-things/
*/
.overlay-submenu-button > * {
    pointer-events: none;
}

</style>