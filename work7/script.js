// 360도 이미지 보기 기능 만들기
const make360Viewer = ($target) => {
    // 필요한 변수들 선언
    let isDragging = false;  // 드래그 중인지 체크
    let dragStartX = 0;      // 드래그 시작한 x좌표
    let beforeSection = parseInt($target.style.getPropertyValue('--current-section')) || 0; // 이전 섹션값
    
    // 드래그 영역 계산하기
    const frameCount = parseInt($target.dataset.viewerNum);  
    const containerWidth = $target.clientWidth;              // 컨테이너 너비
    const oneSection = containerWidth / frameCount;          // 한 섹션당 너비
    
    
    // 드래그할 때 섹션 업데이트하기
    function updateFrame(moveDistance) {
        // 원래 섹션 값 구하기
        const tempSection = Math.floor(Math.abs(moveDistance) / oneSection);
        
        // 현재 섹션 계산하기
        let nowSection;
        function mod(n, m) {
            return ((n % m) + m) % m;
        }
        if (moveDistance < 0) {
            nowSection = mod((beforeSection + tempSection), frameCount);
        } else {
            nowSection = mod((beforeSection - tempSection), frameCount);
        }
        
        console.log('드래그 중>', {
            움직인거리: moveDistance,
            임시섹션: tempSection,
            현재섹션: nowSection,
            이전섹션: beforeSection
        });
        
        // CSS 변수 업데이트
        $target.style.setProperty('--current-section', nowSection);
    }
    
    // 마우스 이벤트
    function mouseStart(e) {
        isDragging = true;
        dragStartX = e.clientX;
        console.log('마우스 시작! x좌표:', dragStartX, '이전섹션:', beforeSection);
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
        console.log('터치 시작! x좌표:', dragStartX, '이전섹션:', beforeSection);
    }
    
    function touchMove(e) {
        if (!isDragging) return;
        e.preventDefault();  // 스크롤 막기
        
        const nowX = e.touches[0].clientX;
        const moveDistance = nowX - dragStartX;
        updateFrame(moveDistance);
    }
    
    // 드래그 끝났을 때
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        beforeSection = parseInt($target.style.getPropertyValue('--current-section')) || 0;
        console.log('끝! 마지막섹션:', beforeSection);
    }
    
    // 이벤트 달기
    function addEvents() {
        $target.addEventListener('mousedown', mouseStart);
        $target.addEventListener('touchstart', touchStart, { passive: false });
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('touchmove', touchMove, { passive: false });
        window.addEventListener('mouseup', dragEnd);
        window.addEventListener('touchend', dragEnd);
        window.addEventListener('mouseleave', dragEnd);
    }
    
    // 이벤트 제거하기
    function removeEvents() {
        $target.removeEventListener('mousedown', mouseStart);
        $target.removeEventListener('touchstart', touchStart, { passive: false });
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('touchmove', touchMove, { passive: false });
        window.removeEventListener('mouseup', dragEnd);
        window.removeEventListener('touchend', dragEnd);
        window.removeEventListener('mouseleave', dragEnd);
    }
    
    // 시작할 때 이벤트 달기
    addEvents();
    
    // 나중에 이벤트 제거할 수 있게 함수 돌려주기
    return removeEvents;
}

// 페이지 시작하면 실행할 함수
const start360Viewer = () => {
    const $viewers = document.querySelectorAll("[data-product-viewer]");
    const cleanups = [];

    $viewers.forEach(($viewer) => {
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

        for (let i = 1; i <= frameCount; i++) {
            const frameNum = String(i).padStart(frameCountPad, '0');
            const img = document.createElement('img');
            
            const imageLoadPromise = new Promise((resolve, reject) => {
                img.onload = () => {
                    img.alt = ``;
                    img.dataset.frame = frameNum;
                    productImage.appendChild(img);
                    resolve();
                };
                img.onerror = () => reject(`Failed to load image ${frameNum}`);
            });

            img.src = `${baseImageUrl}${frameNum}.${extension}`;
            imagePromises.push(imageLoadPromise);
        }

        // 모든 이미지가 로드되면 360도 뷰어 초기화
        Promise.all(imagePromises)
            .then(() => {
                // 로딩 표시 제거
                loadingDiv.remove();
                
                // 이미지 컨테이너 표시 및 로딩 완료 클래스 추가
                productImage.style.display = '';
                $viewer.classList.add('viewer-loaded');

                // CSS 변수 설정
                $viewer.style.setProperty('--move-value', 100/frameCount + '%');
                $viewer.style.setProperty('--move', '0');
                $viewer.style.setProperty('--current-section', '0');
                $viewer.style.setProperty('--view-num', frameCount);

                // 360 기능 적용
                const cleanup = make360Viewer($viewer);
                cleanups.push(cleanup);
                
                console.log('뷰어 설정 완료!', $viewer, '프레임:', frameCount);
            })
            .catch(error => {
                console.error('이미지 로드 중 오류 발생:', error);
                loadingDiv.textContent = 'Error loading images. Please try again.';
                loadingDiv.classList.add('viewer-error');
            });
    });

    // 화면 크기 바뀔 때 처리
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log('화면 크기 바뀜! 다시 설정하기');
            
            cleanups.forEach(cleanup => cleanup());
            cleanups.length = 0;
            
            $viewers.forEach(($viewer) => {
                const cleanup = make360Viewer($viewer);
                cleanups.push(cleanup);
            });
        }, 150);
    });
}

// 탭 기능 만들기
const makeTabComponent = ($container) => {
    // 필요한 변수들 선언
    const events = new Map();  // 이벤트 모아두기
    
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
        $tabButtons.forEach(($button) => {
            const isActive = $button.getAttribute('data-tab-button') === selectedId;
            $button.setAttribute('aria-selected', isActive.toString());
            $button.setAttribute('data-active', isActive.toString());
        });
        
        // 내용들 상태 변경
        $tabContents.forEach(($content) => {
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
        $tabButtons.forEach(($button) => {
            $button.setAttribute('role', 'tab');
            $button.setAttribute('aria-selected', 'false');
        });
        $tabContents.forEach(($content) => {
            $content.setAttribute('role', 'tabpanel');
        });
        
        // 탭 버튼 클릭 이벤트
        $tabButtons.forEach(($button) => {
            const clickHandler = () => {
                const index = $button.getAttribute('data-tab-button');
                updateTab(index);
                if ($button.id) {
                    history.replaceState(null, '', `#${$button.id}`);
                }

            };
            
            $button.addEventListener('click', clickHandler);
            events.set($button, clickHandler);
        });
        
    }
    
    // 정리하기
    function cleanup() {
        
        // 이벤트 정리
        events.forEach((handler, element) => {
            if (element === window) {
                element.removeEventListener('hashchange', handler);
            } else {
                element.removeEventListener('click', handler);
            }
        });
        events.clear();
    }
    
    // 시작!
    setup();
    
    // 정리하는 함수 돌려주기
    return cleanup;
}

// 페이지에서 탭 시작하기
const startTabs = () => {
    // 이전에 있던 탭 정리하기
    if (window.tabCleanups) {
        window.tabCleanups.forEach(cleanup => cleanup());
    }
    
    // 탭 컨테이너 찾아서 새로 시작하기
    const $containers = document.querySelectorAll('[data-tab-container]');
    const cleanups = Array.from($containers).map(
        ($container) => makeTabComponent($container)
    );
    
    // 나중에 정리할 수 있게 저장해두기
    window.tabCleanups = cleanups;
    return cleanups;

};

// 페이지 로드되면 시작!
window.addEventListener('load', () => {
    startTabs();
    
    start360Viewer();
    
    // 탭 버튼에 360 뷰어 재시작 이벤트 추가
    document.querySelectorAll('[data-tab-button]').forEach(button => {
        button.addEventListener('click', () => {
            start360Viewer();
        });
    });
});