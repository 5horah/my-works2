const viewerStates = new Map();
const make360Viewer = ($target)=>{
    // 상태 관리를 위한 변수들
    let isDragging = false;
    let dragStartX = 0;
    let currentFrame = 0;
    let beforeSection = 0;
    let canvas = null;
    let ctx = null;
    const images = [];
    const frameCount = parseInt($target.dataset.viewerNum);
    function renderFrame() {
        // Check if context exists
        if (!ctx || !images[currentFrame]) return;
        const img = images[currentFrame];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const backgroundColor = getComputedStyle($target).getPropertyValue('--viewer-background').trim();
        ctx.fillStyle = backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const scale = Math.min(canvas.width / img.height, canvas.height / img.width);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
    function setupCanvas() {
        if (!canvas) return;
        const rect = $target.getBoundingClientRect();
        canvas.width = rect.width || 300;
        canvas.height = rect.height || 300;
        ctx = canvas.getContext('2d', {
            alpha: false
        });
        ctx.imageSmoothingEnabled = true;
    }
    async function loadImages() {
        await setupCanvas();
        const frameCountPad = parseInt($target.dataset.viewerNumPad);
        const baseImageUrl = $target.dataset.viewerImage;
        const extension = $target.dataset.viewerImageExtension;
        // Create loading UI outside canvas
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'viewer-loading';
        loadingDiv.textContent = 'Loading images...';
        $target.insertBefore(loadingDiv, canvas);
        // Hide canvas during loading
        canvas.style.visibility = 'hidden';
        try {
            const imageBuffer = new Array(frameCount);
            const promises = Array.from({
                length: frameCount
            }, (_, i)=>{
                return new Promise((resolve, reject)=>{
                    const img = new Image();
                    const paddedIndex = String(i + 1).padStart(frameCountPad, '0');
                    const imageUrl = `${baseImageUrl}${paddedIndex}.${extension}`;
                    img.onload = ()=>{
                        imageBuffer[i] = img;
                        loadingDiv.textContent = `Loading... ${Math.round((i + 1) / frameCount * 100)}%`;
                        resolve();
                    };
                    img.onerror = (error)=>reject(new Error(`Failed to load image: ${imageUrl}`));
                    img.src = imageUrl;
                });
            });
            await Promise.all(promises);
            // Copy buffer to images array at once
            images.splice(0, images.length, ...imageBuffer);
            loadingDiv.remove();
            canvas.style.visibility = 'visible';
            if (ctx) renderFrame();
        } catch (error) {
            console.error('Image loading failed:', error);
            loadingDiv.textContent = 'Failed to load images';
        }
    }
    function updateFrame(moveDistance) {
        // 원래 섹션 값 구하기
        const oneSection = canvas.width / frameCount;
        const tempSection = Math.floor(Math.abs(moveDistance) / oneSection);
        // 현재 섹션 계산
        const nowSection = moveDistance < 0 ? ((beforeSection + tempSection) % frameCount + frameCount) % frameCount : ((beforeSection - tempSection) % frameCount + frameCount) % frameCount;
        if (currentFrame !== nowSection) {
            currentFrame = nowSection;
            renderFrame();
        }
        console.log("\uB4DC\uB798\uADF8 \uC911>", {
            \uC6C0\uC9C1\uC778\uAC70\uB9AC: moveDistance,
            \uC784\uC2DC\uC139\uC158: tempSection,
            \uD604\uC7AC\uC139\uC158: nowSection,
            \uC774\uC804\uC139\uC158: beforeSection
        });
    }
    // 마우스 이벤트 핸들러
    function mouseStart(e) {
        isDragging = true;
        dragStartX = e.clientX;
        console.log("\uB9C8\uC6B0\uC2A4 \uC2DC\uC791! x\uC88C\uD45C:", dragStartX, "\uC774\uC804\uC139\uC158:", beforeSection);
    }
    function mouseMove(e) {
        if (!isDragging) return;
        const moveDistance = e.clientX - dragStartX;
        updateFrame(moveDistance);
    }
    // 터치 이벤트 핸들러
    function touchStart(e) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        console.log("\uB9C8\uC6B0\uC2A4 \uC2DC\uC791! x\uC88C\uD45C:", dragStartX, "\uC774\uC804\uC139\uC158:", beforeSection);
    }
    function touchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        e.stopPropagation();
        const moveDistance = e.touches[0].clientX - dragStartX;
        updateFrame(moveDistance);
    }
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        beforeSection = currentFrame;
        console.log("\uB05D! \uB9C8\uC9C0\uB9C9\uC139\uC158:", beforeSection);
    }
    function addEvents() {
        canvas.addEventListener('mousedown', mouseStart);
        canvas.addEventListener('touchstart', touchStart, {
            passive: false
        });
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', touchMove, {
            passive: false
        });
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);
        window.addEventListener('mouseleave', dragEnd);
    }
    function removeEvents() {
        canvas.removeEventListener('mousedown', mouseStart);
        canvas.removeEventListener('touchstart', touchStart);
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', touchMove);
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchend', dragEnd);
        window.removeEventListener('mouseleave', dragEnd);
    }
    // 초기화
    function init() {
        $target.innerHTML = '';
        canvas = document.createElement('canvas');
        $target.appendChild(canvas);
        setupCanvas();
        loadImages().catch(console.error);
        addEvents();
        // Store cleanup function
        $target._viewer = {
            renderFrame,
            cleanup: ()=>{
                removeEvents();
                viewerStates.delete($target);
            }
        };
    }
    init();
    return removeEvents;
};
// 360도 뷰어 시작
const start360Viewer = ()=>{
    const $viewers = document.querySelectorAll("[data-product-viewer]");
    $viewers.forEach(($viewer)=>make360Viewer($viewer));
};
// 탭 기능 만들기
const makeTabComponent = ($container)=>{
    // 필요한 변수들 선언
    const events = new Map(); // 이벤트 모아두기
    // 탭 요소들 찾기
    const $tabButtons = $container.querySelectorAll('[data-tab-button]');
    const $tabContents = $container.querySelectorAll('[data-tab-content]');
    // 시작할 때 활성화할 탭 찾기
    function getStartTab() {
        return $container.getAttribute('data-active-tab') || '0';
    }
    // 탭 상태 업데이트하기
    function updateTab(selectedId) {
        // 버튼들 상태 변경
        $tabButtons.forEach(($button)=>{
            const isActive = $button.getAttribute('data-tab-button') === selectedId;
            $button.setAttribute('aria-selected', isActive.toString());
            $button.setAttribute('data-active', isActive.toString());
        });
        // 내용들 상태 변경
        $tabContents.forEach(($content)=>{
            const isActive = $content.getAttribute('data-tab-content') === selectedId;
            $content.setAttribute('data-active', isActive.toString());
        });
        // 컨테이너에도 현재 탭 표시
        $container.setAttribute('data-active-tab', selectedId);
    }
    // 처음 시작할 때 설정하기
    function setup() {
        // 기본 상태 설정
        updateTab(getStartTab());
        // 접근성 속성 추가
        $container.setAttribute('role', 'tablist');
        $tabButtons.forEach(($button)=>{
            $button.setAttribute('role', 'tab');
            $button.setAttribute('aria-selected', 'false');
        });
        $tabContents.forEach(($content)=>{
            $content.setAttribute('role', 'tabpanel');
        });
        // 탭 버튼 클릭 이벤트
        $tabButtons.forEach(($button)=>{
            const clickHandler = ()=>{
                const index = $button.getAttribute('data-tab-button');
                updateTab(index);
                if ($button.id) history.replaceState(null, '', `#${$button.id}`);
            };
            $button.addEventListener('click', clickHandler);
            events.set($button, clickHandler);
        });
    }
    // 정리하기
    function cleanup() {
        // 이벤트 정리
        events.forEach((handler, element)=>{
            element.removeEventListener('click', handler);
        });
        events.clear();
    }
    // 시작!
    setup();
    // 정리하는 함수 돌려주기
    return cleanup;
};
// 페이지에서 탭 시작하기
const startTabs = ()=>{
    // 이전에 있던 탭 정리하기
    if (window.tabCleanups) window.tabCleanups.forEach((cleanup)=>cleanup());
    // 탭 컨테이너 찾아서 새로 시작하기
    const $containers = document.querySelectorAll('[data-tab-container]');
    const cleanups = Array.from($containers).map(($container)=>makeTabComponent($container));
    // 나중에 정리할 수 있게 저장해두기
    window.tabCleanups = cleanups;
    return cleanups;
};
// 페이지 로드되면 시작!
window.addEventListener('load', ()=>{
    startTabs();
    start360Viewer();
    // 탭 버튼에 360 뷰어 재시작 이벤트 추가
    document.querySelectorAll('[data-tab-button]').forEach((button)=>{
        button.addEventListener('click', ()=>{
            start360Viewer();
        });
    });
});

//# sourceMappingURL=index.bfba8c4b.js.map
