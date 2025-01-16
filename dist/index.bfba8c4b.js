// 360도 이미지 보기 기능 만들기
const make360Viewer = ($target)=>{
    // 필요한 변수들 선언
    let isDragging = false; // 드래그 중인지 체크
    let dragStartX = 0; // 드래그 시작한 x좌표
    let beforeSection = parseInt($target.style.getPropertyValue('--current-section')) || 0; // 이전 섹션값
    // 드래그 영역 계산하기
    const frameCount = parseInt($target.dataset.viewerNum);
    const containerWidth = $target.clientWidth; // 컨테이너 너비
    const oneSection = containerWidth / frameCount; // 한 섹션당 너비
    // 드래그할 때 섹션 업데이트하기
    function updateFrame(moveDistance) {
        // 원래 섹션 값 구하기
        const tempSection = Math.floor(Math.abs(moveDistance) / oneSection);
        // 현재 섹션 계산하기
        let nowSection;
        function mod(n, m) {
            return (n % m + m) % m;
        }
        if (moveDistance < 0) nowSection = mod(beforeSection + tempSection, frameCount);
        else nowSection = mod(beforeSection - tempSection, frameCount);
        console.log("\uB4DC\uB798\uADF8 \uC911>", {
            \uC6C0\uC9C1\uC778\uAC70\uB9AC: moveDistance,
            \uC784\uC2DC\uC139\uC158: tempSection,
            \uD604\uC7AC\uC139\uC158: nowSection,
            \uC774\uC804\uC139\uC158: beforeSection
        });
        // CSS 변수 업데이트
        $target.style.setProperty('--current-section', nowSection);
    }
    // 마우스 이벤트
    function mouseStart(e) {
        isDragging = true;
        dragStartX = e.clientX;
        console.log("\uB9C8\uC6B0\uC2A4 \uC2DC\uC791! x\uC88C\uD45C:", dragStartX, "\uC774\uC804\uC139\uC158:", beforeSection);
    }
    function mouseMove(e) {
        if (!isDragging) return;
        const nowX = e.clientX;
        const moveDistance = nowX - dragStartX;
        updateFrame(moveDistance);
    }
    // 터치 이벤트
    function touchStart(e) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        console.log("\uD130\uCE58 \uC2DC\uC791! x\uC88C\uD45C:", dragStartX, "\uC774\uC804\uC139\uC158:", beforeSection);
    }
    function touchMove(e) {
        if (!isDragging) return;
        e.preventDefault(); // 스크롤 막기
        const nowX = e.touches[0].clientX;
        const moveDistance = nowX - dragStartX;
        updateFrame(moveDistance);
    }
    // 드래그 끝났을 때
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        beforeSection = parseInt($target.style.getPropertyValue('--current-section')) || 0;
        console.log("\uB05D! \uB9C8\uC9C0\uB9C9\uC139\uC158:", beforeSection);
    }
    // 이벤트 달기
    function addEvents() {
        $target.addEventListener('mousedown', mouseStart);
        $target.addEventListener('touchstart', touchStart, {
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
    // 이벤트 제거하기
    function removeEvents() {
        $target.removeEventListener('mousedown', mouseStart);
        $target.removeEventListener('touchstart', touchStart, {
            passive: false
        });
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', touchMove, {
            passive: false
        });
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchend', dragEnd);
        window.removeEventListener('mouseleave', dragEnd);
    }
    // 시작할 때 이벤트 달기
    addEvents();
    // 나중에 이벤트 제거할 수 있게 함수 돌려주기
    return removeEvents;
};
// 페이지 시작하면 실행할 함수
const start360Viewer = ()=>{
    const $viewers = document.querySelectorAll("[data-product-viewer]");
    const cleanups = [];
    $viewers.forEach(($viewer)=>{
        const frameCount = parseInt($viewer.dataset.viewerNum);
        const frameCountPad = parseInt($viewer.dataset.viewerNumPad);
        const baseImageUrl = $viewer.dataset.viewerImage;
        const extension = $viewer.dataset.viewerImageExtension;
        const productImage = $viewer.querySelector('[data-product-images]');
        // 초기 상태에서 이미지 컨테이너 숨기기
        productImage.style.display = 'none';
        // 로딩 상태 표시
        const loadingDiv = document.createElement('div');
        loadingDiv.textContent = 'Loading images...';
        loadingDiv.className = 'viewer-loading';
        loadingDiv.style.position = 'absolute';
        loadingDiv.style.top = '50%';
        loadingDiv.style.left = '50%';
        loadingDiv.style.transform = 'translate(-50%, -50%)';
        $viewer.appendChild(loadingDiv);
        // 이미지 프리로드 Promise 배열 생성
        const imagePromises = [];
        for(let i = 1; i <= frameCount; i++){
            const frameNum = String(i).padStart(frameCountPad, '0');
            const img = document.createElement('img');
            const imageLoadPromise = new Promise((resolve, reject)=>{
                img.onload = ()=>{
                    img.alt = ``;
                    img.dataset.frame = frameNum;
                    productImage.appendChild(img);
                    resolve();
                };
                img.onerror = ()=>reject(`Failed to load image ${frameNum}`);
            });
            img.src = `${baseImageUrl}${frameNum}.${extension}`;
            imagePromises.push(imageLoadPromise);
        }
        // 모든 이미지가 로드되면 360도 뷰어 초기화
        Promise.all(imagePromises).then(()=>{
            // 로딩 표시 제거
            loadingDiv.remove();
            // 이미지 컨테이너 표시 및 로딩 완료 클래스 추가
            productImage.style.display = '';
            $viewer.classList.add('viewer-loaded');
            // CSS 변수 설정
            $viewer.style.setProperty('--move-value', 100 / frameCount + '%');
            $viewer.style.setProperty('--move', '0');
            $viewer.style.setProperty('--current-section', '0');
            $viewer.style.setProperty('--view-num', frameCount);
            // 360 기능 적용
            const cleanup = make360Viewer($viewer);
            cleanups.push(cleanup);
            console.log("\uBDF0\uC5B4 \uC124\uC815 \uC644\uB8CC!", $viewer, "\uD504\uB808\uC784:", frameCount);
        }).catch((error)=>{
            console.error("\uC774\uBBF8\uC9C0 \uB85C\uB4DC \uC911 \uC624\uB958 \uBC1C\uC0DD:", error);
            loadingDiv.textContent = 'Error loading images. Please try again.';
            loadingDiv.classList.add('viewer-error');
        });
    });
    // 화면 크기 바뀔 때 처리
    let resizeTimer;
    window.addEventListener('resize', ()=>{
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(()=>{
            console.log("\uD654\uBA74 \uD06C\uAE30 \uBC14\uB01C! \uB2E4\uC2DC \uC124\uC815\uD558\uAE30");
            cleanups.forEach((cleanup)=>cleanup());
            cleanups.length = 0;
            $viewers.forEach(($viewer)=>{
                const cleanup = make360Viewer($viewer);
                cleanups.push(cleanup);
            });
        }, 150);
    });
};
// 페이지 로드되면 시작!
window.addEventListener('load', start360Viewer);

//# sourceMappingURL=index.bfba8c4b.js.map
