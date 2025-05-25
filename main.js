// بيانات الذكاء الاصطناعي
const aiData = {
    "categories": [
        {
            "name": "الذكاء الاصطناعي التوليدي",
            "description": "تقنيات متقدمة لتوليد المحتوى الإبداعي والنصوص والصور",
            "icon": "fa-brain",
            "details": `<h3>المميزات:</h3>
                       <ul>
                           <li>توليد نصوص ذكية</li>
                           <li>إنشاء صور إبداعية</li>
                           <li>تطوير محتوى تفاعلي</li>
                       </ul>`,
            "trends": ["GPT-4", "DALL-E", "Stable Diffusion"]
        },
        {
            "name": "التعليم التلقائي",
            "description": "في المستقبل، سيتعلم الذكاء الاصطناعي تلقائيًا عبر التفاعل المستمر مع البشر والبيئة",
            "icon": "fa-cube",
            "details": `<h3>المميزات:</h3>
                       <ul>
                           <li>نماذج ثلاثية الأبعاد متقدمة</li>
                           <li>تحريك ذكي للكائنات</li>
                           <li>تطبيقات الواقع المعزز</li>
                       </ul>`,
            "trends": ["3D AI", "VR/AR", "Deep Learning"]
        },
        {
            "name": "الرؤية الحاسوبية",
            "description": "تقنيات متطورة لفهم وتحليل الصور والفيديو",
            "icon": "fa-eye",
            "details": `<h3>التطبيقات:</h3>
                       <ul>
                           <li>التعرف على الوجوه</li>
                           <li>تحليل المشاهد</li>
                           <li>تتبع الحركة</li>
                       </ul>`,
            "trends": ["Object Detection", "Face Recognition", "Scene Analysis"]
        }
    ]
};

// المشهد ثلاثي الأبعاد المحسن للهواتف
let scene, camera, renderer;
let cube;
let isAnimating = true;

function initFutureScene() {
    const container = document.getElementById('future-3d-container');
    if (!container) return;

    // إعداد المشهد
    scene = new THREE.Scene();

    // إعداد الكاميرا
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;

    // إعداد المصير
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // إنشاء المكعب
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshPhongMaterial({
        color: 0x00f7ff,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        specular: 0x4444ff,
        shininess: 60
    });

    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // إضافة الإضاءة
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // إضافة مستمعي الأحداث
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('touchstart', onTouchStart, false);
    container.addEventListener('touchmove', onTouchMove, false);
    container.addEventListener('touchend', onTouchEnd, false);

    // بدء الحركة
    animate();
}

function onWindowResize() {
    const container = document.getElementById('future-3d-container');
    if (!container || !camera || !renderer) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

let touchX, touchY;

function onTouchStart(event) {
    event.preventDefault();
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
}

function onTouchMove(event) {
    if (!event.touches.length) return;

    event.preventDefault();
    
    const deltaX = event.touches[0].clientX - touchX;
    const deltaY = event.touches[0].clientY - touchY;

    cube.rotation.y += deltaX * 0.005;
    cube.rotation.x += deltaY * 0.005;

    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
}

function onTouchEnd() {
    // يمكن إضافة أي منطق إضافي هنا
}

function animate() {
    requestAnimationFrame(animate);

    if (isAnimating) {
        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;
    }

    renderer.render(scene, camera);
}

// التعامل مع البطاقات وعرض المحتوى
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('ai-cards-container');
    if (!container) return;

    // إضافة البطاقات
    aiData.categories.forEach((category, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        card.innerHTML = `
            <div class="card-icon">
                <i class="fas ${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
            <div class="card-details" style="display: none;">
                ${category.details}
            </div>
            <div class="card-trends">
                ${category.trends.map(trend => `
                    <span class="trend-tag" style="
                        display: inline-block;
                        padding: 0.3rem 0.8rem;
                        margin: 0.2rem;
                        background: rgba(0, 247, 255, 0.1);
                        border-radius: 15px;
                        font-size: 0.9rem;
                        color: var(--primary-color);
                    ">${trend}</span>
                `).join('')}
            </div>
        `;

        // إضافة تأثير الظهور التدريجي
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);

        // إضافة تفاعل النقر
        card.addEventListener('click', function() {
            const details = this.querySelector('.card-details');
            if (details) {
                if (details.style.display === 'none') {
                    details.style.display = 'block';
                    details.style.animation = 'slideDown 0.3s ease';
                } else {
                    details.style.display = 'none';
                }
            }
        });

        container.appendChild(card);
    });

    // إضافة تأثيرات التمرير
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });

    // تهيئة المشهد ثلاثي الأبعاد
    if (typeof initFutureScene === 'function') {
        initFutureScene();
    }
});
