class LoadingScreen {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainContent = document.getElementById('main-content');
        this.progressBar = document.getElementById('loading-progress');
        this.percentageText = document.getElementById('loading-percentage');
        this.factText = document.getElementById('loading-fact');
        
        this.currentProgress = 0;
        this.targetProgress = 0;
        
        this.facts = [
            "🌧️ Simulating realistic rainfall patterns...",
            "⚡ Charging atmospheric conditions...",
            "🌍 Mapping 195 countries across the globe...",
            "🌤️ Synchronizing weather satellites...",
            "💨 Analyzing wind currents and jet streams...",
            "🌡️ Calibrating temperature sensors...",
            "☁️ Generating cloud formations...",
            "🌊 Monitoring ocean temperatures...",
            "🗺️ Rendering interactive world maps...",
            "📡 Connecting to meteorological stations..."
        ];
        
        this.currentFactIndex = 0;
        this.rainSplashes = [];
    }
    
    init() {
        this.createEnhancedRain();
        this.startRainSplashes();
        this.startLoading();
        this.rotateFacts();
        this.addThunderSound();
    }
    
    createEnhancedRain() {
        const particlesContainer = document.querySelector('.loading-particles');
        const numberOfDrops = 80; 

        for (let i = 0; i < numberOfDrops; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-layer';

            const leftPosition = Math.random() * 100;
            drop.style.left = leftPosition + '%';

            const height = Math.random() * 60 + 60; 
            drop.style.height = height + 'px';

            const speed = Math.random() * 0.4 + 0.5; 
            const thickness = speed < 0.7 ? 2.5 : 2;
            drop.style.width = thickness + 'px';
            drop.style.animationDuration = speed + 's';

            drop.style.animationDelay = (Math.random() * 2) + 's';
            
            const opacity = Math.random() * 0.4 + 0.5; 
            drop.style.opacity = opacity;

            if (Math.random() > 0.5) {
                drop.style.filter = 'blur(0.6px)';
            }
            
            particlesContainer.appendChild(drop);
        }
    }
    
    startRainSplashes() {
        setInterval(() => {
            if (Math.random() > 0.3) {
                this.createSplash();
            }
        }, 150);
    }
    
    createSplash() {
        const particlesContainer = document.querySelector('.loading-particles');
        const splash = document.createElement('div');
        splash.className = 'rain-splash';
        
        // Random position
        splash.style.left = Math.random() * 100 + '%';
        splash.style.bottom = Math.random() * 10 + '%';
        
        particlesContainer.appendChild(splash);
        

        setTimeout(() => {
            splash.remove();
        }, 400);
    }
    
    addThunderSound() {

        setInterval(() => {
            if (Math.random() > 0.85) { // 15% chance
                const particles = document.querySelector('.loading-particles');
                particles.style.filter = 'brightness(1.3)';
                
                setTimeout(() => {
                    particles.style.filter = 'brightness(1)';
                }, 100);
            }
        }, 3000);
    }
    
    startLoading() {

        const loadingSteps = [
            { progress: 15, delay: 400 },
            { progress: 35, delay: 600 },
            { progress: 55, delay: 500 },
            { progress: 75, delay: 700 },
            { progress: 90, delay: 500 },
            { progress: 100, delay: 600 }
        ];
        
        let totalDelay = 0;
        
        loadingSteps.forEach(step => {
            totalDelay += step.delay;
            setTimeout(() => {
                this.updateProgress(step.progress);
            }, totalDelay);
        });
        

        setTimeout(() => {
            this.completeLoading();
        }, totalDelay + 1000);
    }
    
    updateProgress(target) {
        this.targetProgress = target;
        this.animateProgress();
    }
    
    animateProgress() {
        if (this.currentProgress < this.targetProgress) {
            this.currentProgress += 1;
            this.progressBar.style.width = this.currentProgress + '%';
            this.percentageText.textContent = this.currentProgress + '%';
            
            requestAnimationFrame(() => this.animateProgress());
        }
    }
    
    rotateFacts() {
        this.factText.textContent = this.facts[this.currentFactIndex];
        
        this.factInterval = setInterval(() => {
            this.currentFactIndex = (this.currentFactIndex + 1) % this.facts.length;
            
            this.factText.style.transition = 'opacity 0.3s ease';
            this.factText.style.opacity = '0';
            
            setTimeout(() => {
                this.factText.textContent = this.facts[this.currentFactIndex];
                this.factText.style.opacity = '1';
            }, 300);
        }, 3000);
    }
    
    completeLoading() {
        clearInterval(this.factInterval);
        
        this.loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loader = new LoadingScreen();
    loader.init();
});

window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            window.location.href = 'home.html';
        }
    }, 6000);
});
