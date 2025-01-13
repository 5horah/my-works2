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
        if (moveDistance < 0) {
            // 오른쪽으로 드래그
            nowSection = ((beforeSection + tempSection) + frameCount) % frameCount;
        } else {
            // 왼쪽으로 드래그
            nowSection = ((beforeSection - tempSection) + frameCount) % frameCount;
        }
        
        // 음수 나오면 안되니까 한번 더 보정
        nowSection = (nowSection + frameCount) % frameCount;
        
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
    // data-product-viewer 있는거 전부 찾기
    const $viewers = document.querySelectorAll("[data-product-viewer]");
    const cleanups = [];  // 이벤트 제거 함수 모아두기

    // 찾은거 하나씩 처리하기
    $viewers.forEach(($viewer) => {
        const frameCount = parseInt($viewer.dataset.viewerNum);
        
        // CSS 변수 설정
        $viewer.style.setProperty('--move-value', 100/frameCount + '%');
        $viewer.style.setProperty('--move', '0');
        $viewer.style.setProperty('--current-section', '0');
        $viewer.style.setProperty('--view-num', frameCount);
        
        // 360 기능 적용하고 이벤트 제거 함수 저장
        const cleanup = make360Viewer($viewer);
        cleanups.push(cleanup);
        
        console.log('뷰어 설정 완료!', $viewer, '프레임:', frameCount);
    });

    // 화면 크기 바뀔 때 처리
    let resizeTimer;
    window.addEventListener('resize', () => {
        // 화면 바뀔때마다 실행하면 버벅이니까 좀 기다렸다가 한번만 실행
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log('화면 크기 바뀜! 다시 설정하기');
            
            // 이벤트 다 제거하고
            cleanups.forEach(cleanup => cleanup());
            cleanups.length = 0;
            
            // 다시 설정하기
            $viewers.forEach(($viewer) => {
                const cleanup = make360Viewer($viewer);
                cleanups.push(cleanup);
            });
        }, 150);  // 0.15초 기다렸다가 실행
    });
}

// 페이지 로드되면 시작!
window.addEventListener('load', start360Viewer);