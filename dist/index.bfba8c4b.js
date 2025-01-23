//이미지 캐싱 및 로딩
const imageCache = new Map();
const loadImage = async (url)=>{
    if (imageCache.has(url)) return imageCache.get(url);
    const img = await new Promise((resolve, reject)=>{
        const image = new Image();
        image.onload = ()=>resolve(image);
        image.onerror = reject;
        image.src = url;
    });
    imageCache.set(url, img);
    return img;
};
class Viewer360 {
    constructor(target){
        this.target = target;
        this.images = [];
        this.currentFrame = 0;
        this.previousSection = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.config = {
            numFrames: parseInt(target.dataset.viewerNum || "0"),
            numPadding: parseInt(target.dataset.viewerNumPad || "0"),
            baseImageUrl: target.dataset.viewerImage || "",
            imageExtension: target.dataset.viewerImageExtension || "",
            backgroundColor: getComputedStyle(target).getPropertyValue("--viewer-background").trim() || "#ffffff"
        };
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d", {
            alpha: false
        });
        this.init();
    }
    async init() {
        this.target.innerHTML = "";
        this.target.appendChild(this.canvas);
        this.setupCanvas();
        await this.loadImages();
        this.bindEvents();
        this.setupResizeHandler();
    }
    setupCanvas() {
        const rect = this.target.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.ctx.imageSmoothingEnabled = true;
        this.renderFrame();
    }
    async loadImages() {
        const loadingDiv = this.createLoadingUI();
        try {
            await Promise.all(Array.from({
                length: this.config.numFrames
            }, (_, i)=>this.loadSingleImage(i, loadingDiv)));
            loadingDiv.remove();
            this.target.classList.add("viewer-loaded");
            this.renderFrame();
        } catch (error) {
            console.error("Failed to load images:", error);
        }
    }
    async loadSingleImage(index, loadingDiv) {
        const url = `${this.config.baseImageUrl}${String(index + 1).padStart(this.config.numPadding, "0")}.${this.config.imageExtension}`;
        const img = await loadImage(url);
        this.images[index] = img;
        if (loadingDiv) loadingDiv.textContent = `Loading... ${Math.round((index + 1) / this.config.numFrames * 100)}%`;
        return img;
    }
    createLoadingUI() {
        const div = document.createElement("div");
        div.className = "viewer-loading";
        div.textContent = "Loading images...";
        this.target.appendChild(div);
        return div;
    }
    renderFrame() {
        if (!this.images[this.currentFrame]) return;
        const img = this.images[this.currentFrame];
        const { canvas, ctx } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = this.config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
    updateFrame(moveDistance) {
        const sectionWidth = this.canvas.width / this.config.numFrames;
        const tempSection = Math.floor(Math.abs(moveDistance) / sectionWidth);
        const currentSection = moveDistance < 0 ? ((this.previousSection + tempSection) % this.config.numFrames + this.config.numFrames) % this.config.numFrames : ((this.previousSection - tempSection) % this.config.numFrames + this.config.numFrames) % this.config.numFrames;
        if (this.currentFrame !== currentSection) {
            this.currentFrame = currentSection;
            this.renderFrame();
        }
    }
    handleDragStart = (e)=>{
        this.isDragging = true;
        this.dragStartX = e.clientX;
    };
    handleTouchStart = (e)=>{
        this.isDragging = true;
        this.dragStartX = e.touches[0].clientX;
    };
    handleDragMove = (e)=>{
        if (!this.isDragging) return;
        this.updateFrame(e.clientX - this.dragStartX);
    };
    handleTouchMove = (e)=>{
        if (!this.isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        this.updateFrame(e.touches[0].clientX - this.dragStartX);
    };
    handleDragEnd = ()=>{
        if (!this.isDragging) return;
        this.isDragging = false;
        this.previousSection = this.currentFrame;
    };
    bindEvents() {
        this.canvas.addEventListener("mousedown", this.handleDragStart);
        this.canvas.addEventListener("touchstart", this.handleTouchStart);
        window.addEventListener("mousemove", this.handleDragMove);
        window.addEventListener("touchmove", this.handleTouchMove);
        window.addEventListener("mouseup", this.handleDragEnd);
        window.addEventListener("touchend", this.handleDragEnd);
        window.addEventListener("mouseleave", this.handleDragEnd);
    }
    setupResizeHandler() {
        let resizeTimer;
        window.addEventListener("resize", ()=>{
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(()=>this.setupCanvas(), 150);
        });
    }
    destroy() {
        this.canvas.removeEventListener("mousedown", this.handleDragStart);
        this.canvas.removeEventListener("touchstart", this.handleTouchStart);
        window.removeEventListener("mousemove", this.handleDragMove);
        window.removeEventListener("touchmove", this.handleTouchMove);
        window.removeEventListener("mouseup", this.handleDragEnd);
        window.removeEventListener("touchend", this.handleDragEnd);
        window.removeEventListener("mouseleave", this.handleDragEnd);
    }
}
class TabComponent {
    constructor(container){
        this.container = container;
        this.events = new Map();
        this.buttons = container.querySelectorAll("[data-tab-button]");
        this.contents = container.querySelectorAll("[data-tab-content]");
        this.init();
    }
    init() {
        this.setupAccessibility();
        this.updateTab(this.container.getAttribute("data-active-tab") || "0");
        this.bindEvents();
    }
    setupAccessibility() {
        this.container.setAttribute("role", "tablist");
        this.buttons.forEach((button)=>{
            button.setAttribute("role", "tab");
            button.setAttribute("aria-selected", "false");
        });
        this.contents.forEach((content)=>{
            content.setAttribute("role", "tabpanel");
        });
    }
    updateTab(selectedId) {
        this.buttons.forEach((button)=>{
            const isActive = button.getAttribute("data-tab-button") === selectedId;
            button.setAttribute("aria-selected", String(isActive));
            button.setAttribute("data-active", String(isActive));
        });
        this.contents.forEach((content)=>{
            const isActive = content.getAttribute("data-tab-content") === selectedId;
            content.setAttribute("data-active", String(isActive));
        });
        this.container.setAttribute("data-active-tab", selectedId);
    }
    bindEvents() {
        this.buttons.forEach((button)=>{
            const handler = ()=>{
                const index = button.getAttribute("data-tab-button");
                this.updateTab(index);
                if (button.id) history.replaceState(null, "", `#${button.id}`);
            };
            button.addEventListener("click", handler);
            this.events.set(button, handler);
        });
    }
    destroy() {
        this.events.forEach((handler, element)=>{
            element.removeEventListener("click", handler);
        });
        this.events.clear();
    }
}
const initializeViewers = ()=>Array.from(document.querySelectorAll("[data-product-viewer]")).map((element)=>new Viewer360(element));
const initializeTabs = ()=>Array.from(document.querySelectorAll("[data-tab-container]")).map((element)=>new TabComponent(element));
window.addEventListener("load", ()=>{
    const viewers = initializeViewers();
    initializeTabs();
    const activeTab = document.querySelector('[data-tab-content][data-active="true"]');
    if (activeTab) new Viewer360(activeTab.querySelector("[data-product-viewer]"));
    document.querySelectorAll("[data-tab-button]").forEach((button)=>{
        button.addEventListener("click", ()=>{
            viewers.forEach((viewer)=>viewer.destroy());
            initializeViewers();
        });
    });
});

//# sourceMappingURL=index.bfba8c4b.js.map
