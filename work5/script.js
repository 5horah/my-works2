(function(){
    const article = document.querySelector('.article--drawer');
    const drawerCtn = article.querySelector('.drawer__ctn');
    const dimmed = article.querySelector('.dimmed');
    const drawerButton = article.querySelector('button');
    const openClass = "is-open";
    const aniClass = "has-easing";

    const viewHeight = document.documentElement.getBoundingClientRect().height/2;
    
    // Initialize movement tracking variables
    let startY = 0;
    let moveY = 0;
    let isMouseMove = false;

    drawerButton.addEventListener("click", function(e){
        article.classList.add(openClass);     
        drawerCtn.classList.add(aniClass);
    });

    dimmed.addEventListener("click", function(e){
        article.classList.remove(openClass);
    });

    drawerCtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        drawerCtn.classList.remove(aniClass);
        startY = e.offsetY;
        isMouseMove = true;
    });

    drawerCtn.addEventListener('mousemove', (e) => {
        e.preventDefault();

        if (isMouseMove) {
            moveY = e.offsetY || 0; // Ensure moveY always has a value
            article.style.setProperty('--drawer-ctn-y', `${moveY}px`);
        }
    });

    drawerCtn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        drawerCtn.classList.add(aniClass);
        
        if (isMouseMove) {
            isMouseMove = false;

            if(viewHeight > (moveY || 0)){ // Add null check
                article.style.setProperty('--drawer-ctn-y', "0%");
            } else {
                article.classList.remove(openClass);
                article.style.setProperty('--drawer-ctn-y', "0%");
            }
        }
    });

    function getTouchPos(e) {
        if (!e.touches || !e.touches[0]) return { y: 0 }; // Add error handling
        return {
            y: e.touches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
        }
    } 

    drawerCtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        drawerCtn.classList.remove(aniClass);
        const { y } = getTouchPos(e);
        startY = y;
    });

    drawerCtn.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const { y } = getTouchPos(e);
        moveY = y;
        
        const diffY = moveY - startY;
        if(diffY > 0){
            article.style.setProperty('--drawer-ctn-y', `${diffY}px`);
        }
    });

    drawerCtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        drawerCtn.classList.add(aniClass);
        
        if(viewHeight > (moveY || 0)){ // Add null check
            article.style.setProperty('--drawer-ctn-y', "0%");
        } else {
            article.classList.remove(openClass);
            article.style.setProperty('--drawer-ctn-y', "0%");
        }
    });
})();