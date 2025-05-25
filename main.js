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
        // حركة أكثر تعقيدًا للمكعب
        const time = Date.now() * 0.001;
        cube.rotation.x = Math.sin(time) * 0.3;
        cube.rotation.y += 0.005;
        cube.position.y = Math.sin(time) * 0.2;
        
        // تأثير النبض
        cube.scale.x = 1 + Math.sin(time * 2) * 0.1;
        cube.scale.y = 1 + Math.sin(time * 2) * 0.1;
        cube.scale.z = 1 + Math.sin(time * 2) * 0.1;
    }

    renderer.render(scene, camera);
}

// التعامل مع البطاقات وعرض المحتوى
// محرك التأثيرات المتقدمة
class EffectEngine {
    constructor() {
        this.effects = [];
        this.isRunning = false;
        this.lastTime = 0;
    }

    addEffect(effect) {
        this.effects.push(effect);
        if (!this.isRunning) {
            this.start();
        }
    }

    removeEffect(effect) {
        const index = this.effects.indexOf(effect);
        if (index !== -1) {
            this.effects.splice(index, 1);
        }
        if (this.effects.length === 0) {
            this.stop();
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame(this.update.bind(this));
        }
    }

    stop() {
        this.isRunning = false;
    }

    update(currentTime) {
        if (!this.isRunning) return;

        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.update(deltaTime);
            if (effect.isDone) {
                this.effects.splice(i, 1);
            }
        }

        if (this.effects.length > 0) {
            requestAnimationFrame(this.update.bind(this));
        } else {
            this.isRunning = false;
        }
    }
}

const effectEngine = new EffectEngine();

// تأثير الجسيمات المتقدم
class ParticleEffect {
    constructor(element, options = {}) {
        this.element = element;
        this.particles = [];
        this.particleCount = options.count || 15;
        this.duration = options.duration || 2;
        this.colors = options.colors || ['var(--primary-color)', 'var(--secondary-color)'];
        this.minSize = options.minSize || 3;
        this.maxSize = options.maxSize || 8;
        this.minSpeed = options.minSpeed || 30;
        this.maxSpeed = options.maxSpeed || 100;
        this.gravity = options.gravity || 50;
        this.friction = options.friction || 0.95;
        this.container = document.createElement('div');
        this.container.className = 'particle-container';
        this.container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 10;
        `;
        this.element.style.position = 'relative';
        this.element.appendChild(this.container);
        this.isDone = false;
        this.elapsedTime = 0;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            const size = this.minSize + Math.random() * (this.maxSize - this.minSize);
            const color = this.colors[Math.floor(Math.random() * this.colors.length)];
            
            particle.className = 'ai-particle';
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                opacity: 0.8;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            // موقع عشوائي داخل العنصر
            const rect = this.element.getBoundingClientRect();
            const x = Math.random() * rect.width;
            const y = Math.random() * rect.height;
            
            // سرعة عشوائية
            const angle = Math.random() * Math.PI * 2;
            const speed = this.minSpeed + Math.random() * (this.maxSpeed - this.minSpeed);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            this.container.appendChild(particle);
            
            this.particles.push({
                element: particle,
                x, y, vx, vy,
                size,
                life: 1.0
            });
        }
    }

    update(deltaTime) {
        this.elapsedTime += deltaTime;
        
        if (this.elapsedTime >= this.duration) {
            this.isDone = true;
            this.container.remove();
            return;
        }
        
        for (const particle of this.particles) {
            // تحديث السرعة والموقع
            particle.vy += this.gravity * deltaTime; // الجاذبية
            particle.vx *= this.friction;
            particle.vy *= this.friction;
            
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // تحديث العمر
            particle.life = Math.max(0, 1 - (this.elapsedTime / this.duration));
            
            // تحديث العنصر
            particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) scale(${particle.life})`;
            particle.element.style.opacity = particle.life.toFixed(2);
        }
    }
}

// تأثير الجسيمات للذكاء الاصطناعي
function createParticleEffect(element) {
    const particles = [];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'ai-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            transition: all 0.6s ease;
        `;
        element.appendChild(particle);
        particles.push(particle);
    }

    function animateParticles() {
        particles.forEach((particle, index) => {
            const angle = (index / particleCount) * Math.PI * 2;
            const radius = 30;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = '0.6';
            
            setTimeout(() => {
                particle.style.transform = `translate(${x * 2}px, ${y * 2}px)`;
                particle.style.opacity = '0';
            }, 300);
        });
    }

    return animateParticles;
}

// تأثيرات الهولوجرام
function createHologramEffect(element) {
    const hologram = document.createElement('div');
    hologram.className = 'hologram-effect';
    hologram.style.cssText = `
        position: absolute;
        inset: -10px;
        border: 2px solid var(--primary-color);
        border-radius: inherit;
        opacity: 0;
        transform: scale(1.1);
        pointer-events: none;
        transition: all 0.3s ease;
    `;
    element.appendChild(hologram);

    return {
        show: () => {
            hologram.style.opacity = '0.5';
            hologram.style.transform = 'scale(1)';
        },
        hide: () => {
            hologram.style.opacity = '0';
            hologram.style.transform = 'scale(1.1)';
        }
    };
}

// تأثير الزر السائل
class LiquidButtonEffect {
    constructor(button) {
        this.button = button;
        this.ripples = [];
        this.isActive = false;
        this.setup();
    }

    setup() {
        this.button.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.button.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.button.addEventListener('click', this.onClick.bind(this));
    }

    onMouseEnter() {
        this.isActive = true;
        this.createRipple(0.5);
    }

    onMouseLeave() {
        this.isActive = false;
    }

    onClick(e) {
        const rect = this.button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.createRippleAt(x, y, 1.0);
        
        // إضافة تأثير الجسيمات عند النقر
        effectEngine.addEffect(new ParticleEffect(this.button.closest('.feature-card'), {
            count: 30,
            duration: 1.5,
            minSpeed: 50,
            maxSpeed: 150,
            gravity: 30
        }));
    }

    createRipple(intensity = 1.0) {
        const ripple = document.createElement('div');
        ripple.className = 'liquid-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, ${0.3 * intensity});
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple ${1.5 * intensity}s ease-out forwards;
            pointer-events: none;
        `;
        this.button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1500 * intensity);
    }

    createRippleAt(x, y, intensity = 1.0) {
        const ripple = document.createElement('div');
        ripple.className = 'liquid-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: ${y}px;
            left: ${x}px;
            width: 5px;
            height: 5px;
            background: rgba(255, 255, 255, ${0.5 * intensity});
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple ${1.5 * intensity}s ease-out forwards;
            pointer-events: none;
        `;
        this.button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 1500 * intensity);
    }
}

// تأثير الشبكة العصبية
class NeuralNetworkEffect {
    constructor(container) {
        this.container = container;
        this.nodes = [];
        this.connections = [];
        this.nodeCount = 10;
        this.setup();
    }

    setup() {
        // إنشاء العقد
        for (let i = 0; i < this.nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            node.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: var(--primary-color);
                border-radius: 50%;
                box-shadow: 0 0 10px var(--primary-color);
                opacity: 0.7;
                transition: all 0.3s ease;
            `;
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            node.style.left = `${x}%`;
            node.style.top = `${y}%`;
            
            this.container.appendChild(node);
            this.nodes.push({ element: node, x, y });
        }
        
        // إنشاء الروابط
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                if (Math.random() > 0.7) continue; // إنشاء بعض الروابط فقط
                
                const connection = document.createElement('div');
                connection.className = 'neural-connection';
                connection.style.cssText = `
                    position: absolute;
                    height: 1px;
                    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                    transform-origin: left center;
                    opacity: 0.3;
                    transition: opacity 0.5s ease;
                `;
                
                this.container.appendChild(connection);
                this.connections.push({
                    element: connection,
                    from: i,
                    to: j,
                    pulseDelay: Math.random() * 3
                });
            }
        }
        
        this.updateConnections();
        this.animate();
    }

    updateConnections() {
        this.connections.forEach(conn => {
            const fromNode = this.nodes[conn.from];
            const toNode = this.nodes[conn.to];
            
            const dx = toNode.x - fromNode.x;
            const dy = toNode.y - fromNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            
            conn.element.style.width = `${distance}%`;
            conn.element.style.left = `${fromNode.x}%`;
            conn.element.style.top = `${fromNode.y}%`;
            conn.element.style.transform = `rotate(${angle}deg)`;
        });
    }

    animate() {
        const now = Date.now() / 1000;
        
        // نبض الروابط
        this.connections.forEach(conn => {
            const pulse = Math.sin((now + conn.pulseDelay) * 2) * 0.5 + 0.5;
            conn.element.style.opacity = 0.1 + pulse * 0.3;
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('ai-cards-container');
    if (!container) return;
    
    // إنشاء تأثير الشبكة العصبية
    const neuralContainer = document.querySelector('.neural-network');
    if (neuralContainer) {
        new NeuralNetworkEffect(neuralContainer);
    }

    // تهيئة تأثيرات الذكاء الاصطناعي
    document.querySelectorAll('.feature-card').forEach(card => {
        const particleAnimation = createParticleEffect(card);
        const hologram = createHologramEffect(card);

        card.addEventListener('mouseenter', () => {
            particleAnimation();
            hologram.show();
            
            // إضافة تأثير متقدم عند التحويم
            const progressFill = card.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '100%';
            }
        });

        card.addEventListener('mouseleave', () => {
            hologram.hide();
            
            // إعادة تعيين شريط التقدم
            const progressFill = card.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = '0';
            }
        });
        
        // إضافة تأثير النقر
        card.addEventListener('click', () => {
            effectEngine.addEffect(new ParticleEffect(card, {
                count: 20,
                duration: 1.5
            }));
        });
    });
    
    // إضافة تأثيرات الزر السائل
    document.querySelectorAll('.liquid-button').forEach(button => {
        new LiquidButtonEffect(button);
    });

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

    // إضافة تأثيرات التمرير مع تأثيرات الذكاء الاصطناعي
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                
                // إضافة تأثير الظهور المتقدم
                const card = entry.target;
                card.style.transform = 'perspective(1000px) rotateX(0) translateY(0)';
                card.style.opacity = '1';
                
                // تشغيل تأثير الجسيمات عند الظهور
                setTimeout(() => {
                    const particleAnimation = createParticleEffect(card);
                    particleAnimation();
                }, 300);
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
