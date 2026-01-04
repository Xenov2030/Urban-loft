/**
 * URBAN LOFT - LEGACY EDITION
 * Motor de Experiencia y Lógica de Negocio
 */

const PropertyManager = {
    db: [],
    generate() {
        const names = ["Neon", "Obsidian", "Crystal", "Titanium", "Marble", "Velvet", "Skyline", "Azure", "Platinum", "Oasis"];
        const types = ["Penthouse", "Loft", "Studio", "Suite"];
        const amenitiesList = ["Gym", "Pool", "Pet"];
        for (let i = 1; i <= 40; i++) {
            this.db.push({
                id: i,
                name: `${names[i % 10]} ${types[i % 4]} ${i}`,
                cat: i % 3 === 0 ? "Penthouse" : (i % 2 === 0 ? "Loft" : "Estudio"),
                price: 240 + (i * 12),
                score: 88 + (i % 12),
                amenities: amenitiesList.filter(() => Math.random() > 0.4),
                img: `https://picsum.photos/id/${i + 20}/800/600`
            });
        }
    }
};

const UI = {
    lastScroll: 0,
    init() {
        PropertyManager.generate();
        this.initCursor();
        this.render(PropertyManager.db);
        this.initSmartHeader();
        this.initFilterLogic();
        this.initEditorialReveal();
        this.initAudioDynamics();
        this.initInsta();
    },

    initCursor() {
        const dot = document.querySelector('.cursor-dot');
        const out = document.querySelector('.cursor-outline');
        window.addEventListener('mousemove', e => {
            dot.style.top = out.style.top = e.clientY + 'px';
            dot.style.left = out.style.left = e.clientX + 'px';
        });
    },

    initSmartHeader() {
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');

            if (currentScroll > this.lastScroll && currentScroll > 300) header.classList.add('hidden');
            else header.classList.remove('hidden');
            this.lastScroll = currentScroll;
        });
    },

    render(data) {
        const grid = document.getElementById('property-grid');
        if(!grid) return;
        grid.innerHTML = data.map(p => `
            <div class="property-card-gold">
                <div class="card-img-wrapper"><img src="${p.img}" loading="lazy"></div>
                <div class="card-content" style="padding: 20px;">
                    <h3 style="font-weight: 300; font-size: 1.1rem;">${p.name}</h3>
                    <p style="color: #00f2ff; margin: 8px 0; font-size: 0.9rem;">$${p.price} / noche</p>
                    <button class="tab-luxe active" style="width: 100%; cursor: pointer; padding: 10px; font-size: 0.75rem;" onclick="UI.openModal(${p.id})">VER DETALLES</button>
                </div>
            </div>
        `).join('');
    },

    initFilterLogic() {
        const slider = document.getElementById('price-slider');
        if(slider) {
            slider.addEventListener('input', (e) => {
                document.getElementById('range-val').innerText = `$${e.target.value}`;
                this.applyFilters();
            });
        }
        document.querySelectorAll('.tab-luxe').forEach(tab => {
            tab.onclick = () => {
                const currentActive = document.querySelector('.tabs-luxury .tab-luxe.active');
                if(currentActive) currentActive.classList.remove('active');
                tab.classList.add('active');
                this.applyFilters();
            };
        });
        document.querySelectorAll('.check-gold input').forEach(c => c.onchange = () => this.applyFilters());
    },

    applyFilters() {
        const price = document.getElementById('price-slider').value;
        const activeTab = document.querySelector('.tabs-luxury .tab-luxe.active');
        const cat = activeTab ? activeTab.dataset.category : 'all';
        const filtered = PropertyManager.db.filter(p => (cat === 'all' || p.cat === cat) && p.price <= price);
        this.render(filtered);
    },

    openModal(id) {
        const p = PropertyManager.db.find(x => x.id === id);
        this.setAudioState(true);
        const details = document.getElementById('modal-details');
        if(!details) return;

        details.innerHTML = `
            <img src="${p.img}" style="width: 100%; border-radius: 20px; margin-bottom: 20px;">
            <div style="padding: 10px 0;">
                <div class="luxury-score-badge" style="color:var(--accent); font-size: 0.8rem; margin-bottom: 10px;">
                    Luxury Score: ${p.score}% Gold Standard ⓘ
                </div>
                <h2 style="font-weight: 200; font-size: 2.5rem; letter-spacing: -1px; margin-bottom: 15px;">${p.name}</h2>
                
                <div class="map-deep-night" style="height: 160px; background: #080808; margin: 20px 0; border-radius: 12px; border: 1px solid var(--accent); position: relative; overflow: hidden;">
                    <div class="pulsing-pin" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 12px; height: 12px; background: var(--accent); border-radius: 50%; box-shadow: 0 0 15px var(--accent);"></div>
                </div>

                <p style="opacity: 0.6; line-height: 1.6; font-weight: 300; margin-bottom: 20px;">
                    Este activo de categoría ${p.cat} está disponible para reserva inmediata bajo los estándares de Urban Loft.
                </p>

                <button class="btn-confirm-reserva" onclick="UI.handleBookingRedirection()">
                    RESERVAR AHORA
                </button>
            </div>
        `;
        document.getElementById('modal-container').style.display = 'flex';
    },

    handleBookingRedirection() {
        window.closeModal();
        setTimeout(() => {
            const contactSection = document.getElementById('contactanos');
            if(contactSection) {
                window.scrollTo({
                    top: contactSection.offsetTop - 80,
                    behavior: 'smooth'
                });
                const firstInput = document.querySelector('#editorial-form input');
                if(firstInput) firstInput.focus();
            }
        }, 400);
    },

    initAudioDynamics() {
        const music = document.getElementById('ambient-music');
        if(!music) return;
        music.volume = 0.15;
        const toggle = document.getElementById('music-toggle');
        if(toggle) {
            toggle.onclick = () => {
                if(music.paused) music.play();
                else music.pause();
            };
        }
    },

    setAudioState(lower) {
        const music = document.getElementById('ambient-music');
        if(music) music.volume = lower ? 0.05 : 0.15;
    },

    initEditorialReveal() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if(e.isIntersecting) e.target.style.opacity = "1"; });
        }, { threshold: 0.5 });
        document.querySelectorAll('.editorial-text p, .reveal').forEach(p => observer.observe(p));
    },

    initInsta() {
        const feed = document.getElementById('insta-feed');
        if(feed) {
            feed.innerHTML = [20, 21, 22, 23].map(id => `<img src="https://picsum.photos/id/${id}/300/300" class="insta-img">`).join('');
        }
    }
};

// --- EXPOSICIÓN GLOBAL PARA BOTONES ---
window.UI = UI;

window.closeModal = () => {
    UI.setAudioState(false);
    document.getElementById('modal-container').style.display = 'none';
};

// --- INICIO ---
document.addEventListener('DOMContentLoaded', () => UI.init());