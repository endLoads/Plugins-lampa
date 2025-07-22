// Lampa Ultimate Modular Plugin
(function () {
    'use strict';

    // Глобальный объект плагина
    const LampaUltimate = {
        version: '1.0.0',
        modules: {}, // Зарегистрированные модули
        settings: {}, // Глобальные настройки
        profiles: {}, // Профили настроек
        activeProfile: 'default',
        // Регистрация модуля
        registerModule(name, module) {
            this.modules[name] = module;
        },
        // Получить активные модули
        getActiveModules() {
            return Object.values(this.modules).filter(m => m.enabled);
        },
        // Сохранить настройки
        saveSettings() {
            localStorage.setItem('lampa_ultimate_settings', JSON.stringify(this.settings));
        },
        // Загрузить настройки
        loadSettings() {
            const s = localStorage.getItem('lampa_ultimate_settings');
            if (s) this.settings = JSON.parse(s);
        },
        // Сохранить профиль
        saveProfile(name) {
            this.profiles[name] = JSON.parse(JSON.stringify(this.settings));
            localStorage.setItem('lampa_ultimate_profiles', JSON.stringify(this.profiles));
        },
        // Загрузить профиль
        loadProfile(name) {
            if (this.profiles[name]) {
                this.settings = JSON.parse(JSON.stringify(this.profiles[name]));
                this.activeProfile = name;
                this.saveSettings();
            }
        },
        // Инициализация
        init() {
            this.loadSettings();
            this.loadProfiles();
            this.renderMenu();
            // Инициализация модулей
            Object.values(this.modules).forEach(m => m.init && m.init());
        },
        // Загрузить профили
        loadProfiles() {
            const p = localStorage.getItem('lampa_ultimate_profiles');
            if (p) this.profiles = JSON.parse(p);
        },
        // Рендер меню настроек
        renderMenu() {
            // TODO: Реализовать красивое адаптивное меню с вкладками, drag&drop, профилями и настройками модулей
            // Пока что простая заглушка
            if (window.Lampa && Lampa.SettingsApi) {
                Lampa.SettingsApi.addComponent({
                    component: 'lampa_ultimate',
                    name: 'Ultimate Modular',
                    icon: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00dbde"/><text x="12" y="17" text-anchor="middle" font-size="10" fill="#fff">ULT</text></svg>'
                });
                Lampa.SettingsApi.addParam({
                    component: 'lampa_ultimate',
                    param: {
                        name: 'open_menu',
                        type: 'trigger',
                        default: false
                    },
                    field: {
                        name: 'Открыть меню Ultimate',
                        description: 'Настройте интерфейс, модули, профили и внешний вид'
                    },
                    onChange: () => {
                        // TODO: Открыть кастомное меню плагина
                        alert('Ultimate Modular: меню в разработке!');
                    }
                });
            }
        }
    };

    // --- UI: Базовый рендер меню с вкладками и настройками модулей ---
    LampaUltimate.renderCustomMenu = function() {
        // Удаляем старое меню, если оно есть
        let old = document.getElementById('lampa-ultimate-menu');
        if (old) old.remove();

        // Создаём контейнер меню
        let menu = document.createElement('div');
        menu.id = 'lampa-ultimate-menu';
        menu.style = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:99999;background:rgba(10,10,30,0.98);color:#fff;overflow:auto;padding:0;margin:0;font-family:sans-serif;';

        // Заголовок и кнопка закрытия
        let header = document.createElement('div');
        header.style = 'display:flex;align-items:center;justify-content:space-between;padding:20px 30px 10px 30px;font-size:2em;font-weight:bold;';
        header.innerHTML = '<span>Ultimate Modular</span>' +
            '<button id="lampa-ultimate-close" style="font-size:1.5em;background:none;border:none;color:#fff;cursor:pointer;">×</button>';
        menu.appendChild(header);

        // Вкладки
        let tabs = [
            {id:'main', label:'Главное'},
            {id:'modules', label:'Модули'},
            {id:'profiles', label:'Профили'},
            {id:'appearance', label:'Внешний вид'},
            {id:'analytics', label:'Аналитика'},
            {id:'experiments', label:'Эксперименты'}
        ];
        let tabsBar = document.createElement('div');
        tabsBar.style = 'display:flex;gap:20px;padding:0 30px 10px 30px;border-bottom:1px solid #333;';
        tabsBar.id = 'lampa-ultimate-tabs';
        tabs.forEach(tab => {
            let btn = document.createElement('button');
            btn.textContent = tab.label;
            btn.dataset.tab = tab.id;
            btn.style = 'background:none;border:none;color:#fff;font-size:1.1em;padding:10px 0 8px 0;cursor:pointer;';
            btn.onclick = () => renderTab(tab.id);
            tabsBar.appendChild(btn);
        });
        menu.appendChild(tabsBar);

        // Контент вкладки
        let content = document.createElement('div');
        content.id = 'lampa-ultimate-content';
        content.style = 'padding:20px 30px;min-height:60vh;';
        menu.appendChild(content);

        // Добавляем меню в body
        document.body.appendChild(menu);

        // Закрытие меню
        document.getElementById('lampa-ultimate-close').onclick = () => menu.remove();

        // Рендер первой вкладки
        renderTab('main');

        // --- Внутренняя функция рендера вкладки ---
        function renderTab(tabId) {
            // Сброс активной вкладки
            Array.from(tabsBar.children).forEach(btn => btn.style.borderBottom = 'none');
            let activeBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === tabId);
            if (activeBtn) activeBtn.style.borderBottom = '2px solid #00dbde';
            // Контент
            if (tabId === 'main') {
                content.innerHTML = `<h2>Ultimate Modular для Lampa</h2>
                <p>Добро пожаловать! Здесь вы можете гибко настраивать интерфейс, модули, профили и внешний вид Lampa.</p>
                <ul>
                  <li>Включайте и выключайте модули</li>
                  <li>Меняйте порядок и внешний вид</li>
                  <li>Сохраняйте профили настроек</li>
                  <li>Используйте быстрые фильтры и аналитику</li>
                </ul>`;
            } else if (tabId === 'modules') {
                // Список модулей с переключателями
                let html = '<h3>Модули</h3><ul style="list-style:none;padding:0;">';
                Object.entries(LampaUltimate.modules).forEach(([key, mod]) => {
                    html += `<li style="margin-bottom:10px;">
                        <label style="display:flex;align-items:center;gap:10px;">
                            <input type="checkbox" data-mod="${key}" ${mod.enabled ? 'checked' : ''} style="width:20px;height:20px;">
                            <span style="font-size:1.1em;">${mod.name}</span>
                        </label>
                    </li>`;
                });
                html += '</ul>';
                content.innerHTML = html;
                // Переключатели модулей
                content.querySelectorAll('input[type=checkbox][data-mod]').forEach(chk => {
                    chk.onchange = function() {
                        let mod = chk.dataset.mod;
                        LampaUltimate.modules[mod].enabled = chk.checked;
                        LampaUltimate.saveSettings();
                    };
                });
            } else if (tabId === 'profiles') {
                // Профили: список, выбор, сохранение, загрузка
                let html = `<h3>Профили</h3>
                <div>Текущий профиль: <b>${LampaUltimate.activeProfile}</b></div>
                <button id="lampa-ultimate-save-profile" style="margin:10px 0;">Сохранить текущий профиль</button>
                <ul style="list-style:none;padding:0;">`;
                Object.keys(LampaUltimate.profiles).forEach(name => {
                    html += `<li style="margin-bottom:8px;">
                        <button data-profile="${name}" style="margin-right:10px;">Загрузить</button>
                        <span>${name}</span>
                    </li>`;
                });
                html += '</ul>';
                content.innerHTML = html;
                // Сохранить профиль
                content.querySelector('#lampa-ultimate-save-profile').onclick = function() {
                    let name = prompt('Введите имя профиля:');
                    if (name) {
                        LampaUltimate.saveProfile(name);
                        renderTab('profiles');
                    }
                };
                // Загрузить профиль
                content.querySelectorAll('button[data-profile]').forEach(btn => {
                    btn.onclick = function() {
                        let name = btn.dataset.profile;
                        LampaUltimate.loadProfile(name);
                        renderTab('profiles');
                    };
                });
            } else if (tabId === 'appearance') {
                content.innerHTML = `<h3>Внешний вид</h3>
                <p>Настройки тем, размеров, стиля кнопок и иконок появятся здесь.</p>`;
            } else if (tabId === 'analytics') {
                content.innerHTML = `<h3>Аналитика</h3>
                <p>Здесь будет статистика по просмотрам, жанрам, времени и т.д.</p>`;
            } else if (tabId === 'experiments') {
                content.innerHTML = `<h3>Эксперименты</h3>
                <p>Включайте новые функции для теста!</p>`;
            }
        }
    };

    // --- Переопределяем onChange для кнопки меню ---
    LampaUltimate.renderMenu = function() {
        if (window.Lampa && Lampa.SettingsApi) {
            Lampa.SettingsApi.addComponent({
                component: 'lampa_ultimate',
                name: 'Ultimate Modular',
                icon: '<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00dbde"/><text x="12" y="17" text-anchor="middle" font-size="10" fill="#fff">ULT</text></svg>'
            });
            Lampa.SettingsApi.addParam({
                component: 'lampa_ultimate',
                param: {
                    name: 'open_menu',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: 'Открыть меню Ultimate',
                    description: 'Настройте интерфейс, модули, профили и внешний вид'
                },
                onChange: () => {
                    LampaUltimate.renderCustomMenu();
                }
            });
        }
    };

    // --- Модуль "Бейджи качества и серий" ---
    LampaUltimate.modules.badges = Object.assign(LampaUltimate.modules.badges, {
        style: 'color', // color | minimal | icon
        show: 'both',   // quality | episodes | both | none
        init() {
            // Добавляем настройки во вкладки
            LampaUltimate.settings.badges = LampaUltimate.settings.badges || {
                style: 'color',
                show: 'both'
            };
            this.style = LampaUltimate.settings.badges.style;
            this.show = LampaUltimate.settings.badges.show;

            // Патчим рендер карточек Lampa (универсально для всех источников)
            const origRender = window.Lampa && Lampa.Card && Lampa.Card.render;
            if (origRender && !Lampa.Card._ultimatePatched) {
                Lampa.Card.render = function(cardData, ...args) {
                    let el = origRender.call(this, cardData, ...args);
                    setTimeout(() => {
                        try {
                            if (!el) return;
                            // Удаляем старые бейджи
                            el.querySelectorAll('.ultimate-badge').forEach(b => b.remove());
                            // Получаем качество и серии
                            let quality = cardData.quality || cardData.Quality || '';
                            let episodes = '';
                            if (cardData.number_of_episodes && cardData.number_of_seasons) {
                                episodes = `${cardData.number_of_episodes}/${cardData.number_of_seasons}`;
                            } else if (cardData.episodes) {
                                episodes = cardData.episodes;
                            }
                            // Показываем бейджи по настройкам
                            if (LampaUltimate.modules.badges.enabled && LampaUltimate.settings.badges.show !== 'none') {
                                if ((LampaUltimate.settings.badges.show === 'quality' || LampaUltimate.settings.badges.show === 'both') && quality) {
                                    let badge = document.createElement('div');
                                    badge.className = 'ultimate-badge ultimate-badge-quality';
                                    badge.style = badgeStyle(LampaUltimate.settings.badges.style, 'quality');
                                    badge.textContent = quality;
                                    el.appendChild(badge);
                                }
                                if ((LampaUltimate.settings.badges.show === 'episodes' || LampaUltimate.settings.badges.show === 'both') && episodes) {
                                    let badge = document.createElement('div');
                                    badge.className = 'ultimate-badge ultimate-badge-episodes';
                                    badge.style = badgeStyle(LampaUltimate.settings.badges.style, 'episodes');
                                    badge.textContent = episodes;
                                    el.appendChild(badge);
                                }
                            }
                        } catch(e) {}
                    }, 0);
                    return el;
                };
                Lampa.Card._ultimatePatched = true;
            }
            // Вспомогательная функция для стиля бейджа
            function badgeStyle(style, type) {
                if (style === 'color') {
                    return `position:absolute;top:${type==='quality'?8:36}px;right:8px;background:linear-gradient(90deg,#00dbde,#fc00ff);color:#fff;padding:2px 8px;border-radius:8px;font-size:1em;font-weight:bold;z-index:10;`;
                } else if (style === 'minimal') {
                    return `position:absolute;top:${type==='quality'?8:36}px;right:8px;background:#222;color:#fff;padding:2px 8px;border-radius:8px;font-size:1em;z-index:10;`;
                } else if (style === 'icon') {
                    return `position:absolute;top:${type==='quality'?8:36}px;right:8px;background:#fff;color:#00dbde;padding:2px 8px;border-radius:8px;font-size:1em;z-index:10;display:flex;align-items:center;gap:4px;`;
                }
                return '';
            }
        }
    });

    // --- Модуль "Оригинальные логотипы" ---
    LampaUltimate.modules.logos = Object.assign(LampaUltimate.modules.logos, {
        style: 'color', // color | mono | outline
        fallback: 'poster', // poster | title
        cache: {},
        init() {
            LampaUltimate.settings.logos = LampaUltimate.settings.logos || {
                style: 'color',
                fallback: 'poster'
            };
            this.style = LampaUltimate.settings.logos.style;
            this.fallback = LampaUltimate.settings.logos.fallback;
            this.cache = {};

            // Патчим рендер карточек для логотипов
            const origRender = window.Lampa && Lampa.Card && Lampa.Card.render;
            if (origRender && !Lampa.Card._ultimateLogoPatched) {
                Lampa.Card.render = function(cardData, ...args) {
                    let el = origRender.call(this, cardData, ...args);
                    setTimeout(() => {
                        try {
                            if (!el) return;
                            // Удаляем старые лого
                            el.querySelectorAll('.ultimate-logo').forEach(b => b.remove());
                            // Получаем путь к лого
                            let logoUrl = '';
                            if (cardData.logo_path) {
                                logoUrl = getLogoUrl(cardData.logo_path);
                            } else if (cardData.logos && cardData.logos.length) {
                                logoUrl = getLogoUrl(cardData.logos[0]);
                            }
                            // Если есть лого — показываем
                            if (LampaUltimate.modules.logos.enabled && logoUrl) {
                                let img = document.createElement('img');
                                img.className = 'ultimate-logo';
                                img.src = logoUrl;
                                img.alt = 'logo';
                                img.style = logoStyle(LampaUltimate.settings.logos.style);
                                img.onload = () => img.style.opacity = 1;
                                img.onerror = () => img.remove();
                                el.appendChild(img);
                                LampaUltimate.modules.logos.cache[logoUrl] = true;
                            } else if (LampaUltimate.modules.logos.enabled) {
                                // Fallback: постер или название
                                if (LampaUltimate.settings.logos.fallback === 'poster' && cardData.poster_path) {
                                    // Уже есть постер — ничего не делаем
                                } else if (LampaUltimate.settings.logos.fallback === 'title' && cardData.title) {
                                    let div = document.createElement('div');
                                    div.className = 'ultimate-logo';
                                    div.textContent = cardData.title;
                                    div.style = logoStyle(LampaUltimate.settings.logos.style) + 'font-size:1.2em;font-weight:bold;letter-spacing:1px;';
                                    el.appendChild(div);
                                }
                            }
                        } catch(e) {}
                    }, 0);
                    return el;
                };
                Lampa.Card._ultimateLogoPatched = true;
            }
            // Вспомогательная функция для url
            function getLogoUrl(path) {
                if (!path) return '';
                if (/^https?:/.test(path)) return path;
                // TMDB CDN
                return 'https://image.tmdb.org/t/p/original' + path;
            }
            // Вспомогательная функция для стиля
            function logoStyle(style) {
                let base = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);max-width:70%;max-height:40%;opacity:0.95;z-index:12;pointer-events:none;transition:opacity 0.2s;';
                if (style === 'color') return base + '';
                if (style === 'mono') return base + 'filter: grayscale(1) contrast(1.5);';
                if (style === 'outline') return base + 'filter: grayscale(1) brightness(2) drop-shadow(0 0 2px #fff);';
                return base;
            }
        }
    });

    // --- Модуль "VPN Checker" ---
    LampaUltimate.modules.vpn = Object.assign(LampaUltimate.modules.vpn, {
        mode: 'detailed', // detailed | short
        enabled: false,
        lastResult: null,
        lastCheck: 0,
        cacheTtl: 10 * 60 * 1000, // 10 минут
        indicator: null,
        init() {
            LampaUltimate.settings.vpn = LampaUltimate.settings.vpn || {
                enabled: false,
                mode: 'detailed'
            };
            this.enabled = LampaUltimate.settings.vpn.enabled;
            this.mode = LampaUltimate.settings.vpn.mode;
            // Если включено — запускаем проверку
            if (this.enabled) this.checkAndRender();
        },
        checkAndRender(force) {
            if (!this.enabled) return this.removeIndicator();
            let now = Date.now();
            if (!force && this.lastResult && (now - this.lastCheck < this.cacheTtl)) {
                this.renderIndicator(this.lastResult);
                return;
            }
            this.renderIndicator({status:'loading'});
            this.checkVPN().then(res => {
                this.lastResult = res;
                this.lastCheck = Date.now();
                this.renderIndicator(res);
            }).catch(() => {
                this.renderIndicator({status:'error'});
            });
        },
        async checkVPN() {
            // Пробуем несколько API по очереди
            let apis = [
                async () => {
                    let r = await fetch('https://ip-api.io/json/');
                    let d = await r.json();
                    return {
                        status: d.security && (d.security.is_vpn || d.security.is_proxy || d.security.is_tor) ? 'vpn' : 'ok',
                        country: d.country_name,
                        city: d.city,
                        asn: d.asn,
                        org: d.org,
                        ip: d.ip,
                        details: d.security
                    };
                },
                async () => {
                    let r = await fetch('https://ipinfo.io/json');
                    let d = await r.json();
                    return {
                        status: d.privacy && (d.privacy.vpn || d.privacy.proxy || d.privacy.tor) ? 'vpn' : 'ok',
                        country: d.country,
                        city: d.city,
                        asn: d.org,
                        org: d.org,
                        ip: d.ip,
                        details: d.privacy
                    };
                },
                async () => {
                    let r = await fetch('https://vpnapi.io/api/?ip=&key=free');
                    let d = await r.json();
                    return {
                        status: d.security && (d.security.vpn || d.security.proxy || d.security.tor) ? 'vpn' : 'ok',
                        country: d.location && d.location.country,
                        city: d.location && d.location.city,
                        asn: d.network && d.network.autonomous_system_number,
                        org: d.network && d.network.organization,
                        ip: d.ip,
                        details: d.security
                    };
                }
            ];
            for (let api of apis) {
                try {
                    let res = await api();
                    if (res && res.status) return res;
                } catch(e) {}
            }
            return {status:'error'};
        },
        renderIndicator(res) {
            this.removeIndicator();
            let ind = document.createElement('div');
            ind.id = 'lampa-ultimate-vpn-indicator';
            ind.style = 'position:fixed;bottom:24px;right:24px;z-index:999999;background:rgba(20,20,40,0.95);color:#fff;padding:12px 20px;border-radius:16px;box-shadow:0 2px 12px #0008;font-size:1.1em;display:flex;align-items:center;gap:12px;cursor:pointer;user-select:none;transition:opacity 0.2s;';
            let icon = '';
            let color = '#00dbde';
            if (res.status === 'loading') {
                icon = '⏳';
                color = '#aaa';
            } else if (res.status === 'ok') {
                icon = '🟢';
                color = '#00dbde';
            } else if (res.status === 'vpn') {
                icon = '🔴';
                color = '#fc00ff';
            } else {
                icon = '⚠️';
                color = '#ffb300';
            }
            ind.innerHTML = `<span style="font-size:1.5em;">${icon}</span><span>${this.mode==='detailed'?this.statusText(res):this.shortText(res)}</span>`;
            ind.style.border = `2px solid ${color}`;
            // Клик — показать подробности
            ind.onclick = () => {
                if (this.mode === 'detailed' && res.status && res.status !== 'loading') {
                    alert(this.detailedInfo(res));
                } else {
                    this.checkAndRender(true);
                }
            };
            document.body.appendChild(ind);
            this.indicator = ind;
        },
        removeIndicator() {
            if (this.indicator) this.indicator.remove();
            this.indicator = null;
        },
        statusText(res) {
            if (res.status === 'loading') return 'Проверка VPN...';
            if (res.status === 'ok') return 'VPN не обнаружен';
            if (res.status === 'vpn') return 'Обнаружен VPN/Proxy/TOR!';
            return 'Ошибка проверки VPN';
        },
        shortText(res) {
            if (res.status === 'loading') return 'Проверка...';
            if (res.status === 'ok') return 'VPN: нет';
            if (res.status === 'vpn') return 'VPN: да!';
            return 'VPN: ?';
        },
        detailedInfo(res) {
            if (!res || !res.status) return 'Нет данных';
            return `IP: ${res.ip||'-'}\nСтрана: ${res.country||'-'}\nГород: ${res.city||'-'}\nПровайдер: ${res.org||'-'}\nASN: ${res.asn||'-'}\nVPN/Proxy/TOR: ${res.status==='vpn'?'ДА':'нет'}\n\n${res.details?JSON.stringify(res.details,null,2):''}`;
        }
    });

    // --- Модуль "Скрытие просмотренных" и быстрые фильтры ---
    LampaUltimate.modules.hideWatched = {
        enabled: false,
        onlyNew: false,
        name: 'Скрытие просмотренных',
        init() {
            LampaUltimate.settings.hideWatched = LampaUltimate.settings.hideWatched || {
                enabled: false,
                onlyNew: false
            };
            this.enabled = LampaUltimate.settings.hideWatched.enabled;
            this.onlyNew = LampaUltimate.settings.hideWatched.onlyNew;
            // Патчим рендер списков
            const origRenderList = window.Lampa && Lampa.List && Lampa.List.render;
            if (origRenderList && !Lampa.List._ultimatePatched) {
                Lampa.List.render = function(items, ...args) {
                    let filtered = items;
                    if (LampaUltimate.modules.hideWatched.enabled) {
                        filtered = filtered.filter(card => !isWatched(card));
                    }
                    if (LampaUltimate.modules.hideWatched.onlyNew) {
                        filtered = filtered.filter(card => isNew(card));
                    }
                    return origRenderList.call(this, filtered, ...args);
                };
                Lampa.List._ultimatePatched = true;
            }
            // Быстрый фильтр на главном экране
            setTimeout(() => {
                if (!document.getElementById('ultimate-filter-btn')) {
                    let btn = document.createElement('button');
                    btn.id = 'ultimate-filter-btn';
                    btn.textContent = this.onlyNew ? 'Показать все' : 'Только новые';
                    btn.style = 'position:fixed;top:24px;right:24px;z-index:999999;background:#00dbde;color:#fff;padding:10px 18px;border-radius:12px;font-size:1.1em;box-shadow:0 2px 12px #0008;cursor:pointer;user-select:none;';
                    btn.onclick = () => {
                        LampaUltimate.modules.hideWatched.onlyNew = !LampaUltimate.modules.hideWatched.onlyNew;
                        LampaUltimate.settings.hideWatched.onlyNew = LampaUltimate.modules.hideWatched.onlyNew;
                        btn.textContent = LampaUltimate.modules.hideWatched.onlyNew ? 'Показать все' : 'Только новые';
                        LampaUltimate.saveSettings();
                        // Перерисовать списки
                        if (window.Lampa && Lampa.List && Lampa.List.render) {
                            // Триггерим обновление (можно оптимизировать)
                            let ev = new Event('ultimate-filter-update');
                            document.dispatchEvent(ev);
                        }
                    };
                    document.body.appendChild(btn);
                }
            }, 1000);
            // Вспомогательные функции
            function isWatched(card) {
                // Универсальная проверка (можно доработать под вашу структуру)
                return card.watched === true || card.is_watched === true || card.progress === 1 || card.seen === true;
            }
            function isNew(card) {
                // Новое — если не просмотрено и дата релиза не старше 30 дней
                if (isWatched(card)) return false;
                if (card.release_date) {
                    let d = new Date(card.release_date);
                    let now = new Date();
                    return (now - d) < 30*24*60*60*1000;
                }
                return true;
            }
        }
    };

    // --- Модуль "Расширенные фильтры и сортировка" ---
    LampaUltimate.modules.filters = {
        enabled: true,
        name: 'Фильтры и сортировка',
        filters: {
            quality: '',
            genre: '',
            country: '',
            year: '',
            source: '',
            watched: '', // all | watched | unwatched
        },
        sort: 'date', // date | popularity | alpha | custom
        search: '',
        init() {
            LampaUltimate.settings.filters = LampaUltimate.settings.filters || {
                filters: {
                    quality: '', genre: '', country: '', year: '', source: '', watched: ''
                },
                sort: 'date',
                search: ''
            };
            this.filters = Object.assign({}, LampaUltimate.settings.filters.filters);
            this.sort = LampaUltimate.settings.filters.sort;
            this.search = LampaUltimate.settings.filters.search;
            // Патчим рендер списков
            const origRenderList = window.Lampa && Lampa.List && Lampa.List.render;
            if (origRenderList && !Lampa.List._ultimateFilterPatched) {
                Lampa.List.render = function(items, ...args) {
                    let filtered = items;
                    // Фильтрация
                    let f = LampaUltimate.modules.filters.filters;
                    if (f.quality) filtered = filtered.filter(card => (card.quality||'').toLowerCase().includes(f.quality));
                    if (f.genre) filtered = filtered.filter(card => (card.genre_ids||[]).includes(f.genre) || (card.genres||[]).includes(f.genre));
                    if (f.country) filtered = filtered.filter(card => (card.country||'').toLowerCase().includes(f.country));
                    if (f.year) filtered = filtered.filter(card => (card.release_date||'').startsWith(f.year));
                    if (f.source) filtered = filtered.filter(card => (card.source||'').toLowerCase().includes(f.source));
                    if (f.watched === 'watched') filtered = filtered.filter(card => isWatched(card));
                    if (f.watched === 'unwatched') filtered = filtered.filter(card => !isWatched(card));
                    // Поиск
                    let s = (LampaUltimate.modules.filters.search||'').toLowerCase();
                    if (s) filtered = filtered.filter(card => {
                        return (card.title||'').toLowerCase().includes(s) ||
                            (card.original_title||'').toLowerCase().includes(s) ||
                            (card.name||'').toLowerCase().includes(s) ||
                            (card.actors||'').toLowerCase().includes(s) ||
                            (card.genres||[]).join(',').toLowerCase().includes(s);
                    });
                    // Сортировка
                    let sort = LampaUltimate.modules.filters.sort;
                    if (sort === 'date') filtered = filtered.sort((a,b) => (b.release_date||'').localeCompare(a.release_date||''));
                    if (sort === 'popularity') filtered = filtered.sort((a,b) => (b.popularity||0)-(a.popularity||0));
                    if (sort === 'alpha') filtered = filtered.sort((a,b) => (a.title||'').localeCompare(b.title||''));
                    // custom — не реализовано (можно добавить drag&drop)
                    return origRenderList.call(this, filtered, ...args);
                };
                Lampa.List._ultimateFilterPatched = true;
            }
            // Быстрый UI-фильтр и поиск на главном экране
            setTimeout(() => {
                if (!document.getElementById('ultimate-search-bar')) {
                    let bar = document.createElement('div');
                    bar.id = 'ultimate-search-bar';
                    bar.style = 'position:fixed;top:70px;left:50%;transform:translateX(-50%);z-index:999999;background:#222;color:#fff;padding:8px 18px;border-radius:12px;font-size:1.1em;box-shadow:0 2px 12px #0008;display:flex;gap:10px;align-items:center;';
                    bar.innerHTML = `
                        <input id="ultimate-search-input" type="text" placeholder="Поиск..." style="font-size:1em;padding:4px 10px;border-radius:6px;border:none;outline:none;">
                        <select id="ultimate-sort-select">
                            <option value="date">По дате</option>
                            <option value="popularity">По популярности</option>
                            <option value="alpha">По алфавиту</option>
                        </select>
                        <button id="ultimate-clear-search" style="background:#00dbde;color:#fff;border:none;border-radius:6px;padding:4px 10px;">×</button>
                    `;
                    document.body.appendChild(bar);
                    let input = bar.querySelector('#ultimate-search-input');
                    let sortSel = bar.querySelector('#ultimate-sort-select');
                    let clearBtn = bar.querySelector('#ultimate-clear-search');
                    input.value = LampaUltimate.modules.filters.search;
                    sortSel.value = LampaUltimate.modules.filters.sort;
                    input.oninput = function() {
                        LampaUltimate.modules.filters.search = input.value;
                        LampaUltimate.settings.filters.search = input.value;
                        LampaUltimate.saveSettings();
                        let ev = new Event('ultimate-filter-update');
                        document.dispatchEvent(ev);
                    };
                    sortSel.onchange = function() {
                        LampaUltimate.modules.filters.sort = sortSel.value;
                        LampaUltimate.settings.filters.sort = sortSel.value;
                        LampaUltimate.saveSettings();
                        let ev = new Event('ultimate-filter-update');
                        document.dispatchEvent(ev);
                    };
                    clearBtn.onclick = function() {
                        input.value = '';
                        LampaUltimate.modules.filters.search = '';
                        LampaUltimate.settings.filters.search = '';
                        LampaUltimate.saveSettings();
                        let ev = new Event('ultimate-filter-update');
                        document.dispatchEvent(ev);
                    };
                }
            }, 1000);
            // Вспомогательная функция
            function isWatched(card) {
                return card.watched === true || card.is_watched === true || card.progress === 1 || card.seen === true;
            }
        }
    };

    // --- Добавляем настройки фильтров и сортировки в меню ---
    const origRenderTabFilters = LampaUltimate.renderCustomMenu;
    LampaUltimate.renderCustomMenu = function() {
        origRenderTabFilters.call(this);
        // Добавляем настройки во вкладку "Модули"
        let content = document.getElementById('lampa-ultimate-content');
        let tabsBar = document.getElementById('lampa-ultimate-tabs');
        if (!content || !tabsBar) return;
        let modulesBtn = Array.from(tabsBar.children).find(btn => btn.dataset.tab === 'modules');
        if (modulesBtn) {
            modulesBtn.onclick = function() {
                // Перерисовываем стандартную вкладку
                let html = '<h3>Модули</h3><ul style="list-style:none;padding:0;">';
                Object.entries(LampaUltimate.modules).forEach(([key, mod]) => {
                    html += `<li style="margin-bottom:10px;">
                        <label style="display:flex;align-items:center;gap:10px;">
                            <input type="checkbox" data-mod="${key}" ${mod.enabled ? 'checked' : ''} style="width:20px;height:20px;">
                            <span style="font-size:1.1em;">${mod.name}</span>
                        </label>`;
                    if (key === 'filters') {
                        html += `<div style="margin-left:30px;margin-top:5px;display:flex;flex-wrap:wrap;gap:10px;">
                            <label>Качество: <input id="filter-quality" type="text" value="${mod.filters.quality||''}" style="width:80px;"></label>
                            <label>Жанр: <input id="filter-genre" type="text" value="${mod.filters.genre||''}" style="width:80px;"></label>
                            <label>Страна: <input id="filter-country" type="text" value="${mod.filters.country||''}" style="width:80px;"></label>
                            <label>Год: <input id="filter-year" type="text" value="${mod.filters.year||''}" style="width:60px;"></label>
                            <label>Источник: <input id="filter-source" type="text" value="${mod.filters.source||''}" style="width:80px;"></label>
                            <label>Статус: <select id="filter-watched">
                                <option value="">Все</option>
                                <option value="watched" ${mod.filters.watched==='watched'?'selected':''}>Просмотренные</option>
                                <option value="unwatched" ${mod.filters.watched==='unwatched'?'selected':''}>Непросмотренные</option>
                            </select></label>
                        </div>`;
                        html += `<div style="margin-left:30px;margin-top:5px;">
                            <label>Сортировка:
                                <select id="filter-sort">
                                    <option value="date" ${mod.sort==='date'?'selected':''}>По дате</option>
                                    <option value="popularity" ${mod.sort==='popularity'?'selected':''}>По популярности</option>
                                    <option value="alpha" ${mod.sort==='alpha'?'selected':''}>По алфавиту</option>
                                </select>
                            </label>
                        </div>`;
                    }
                    html += '</li>';
                });
                html += '</ul>';
                content.innerHTML = html;
                // Переключатели модулей
                content.querySelectorAll('input[type=checkbox][data-mod]').forEach(chk => {
                    chk.onchange = function() {
                        let mod = chk.dataset.mod;
                        LampaUltimate.modules[mod].enabled = chk.checked;
                        LampaUltimate.saveSettings();
                    };
                });
                // Настройки фильтров
                let q = content.querySelector('#filter-quality');
                let g = content.querySelector('#filter-genre');
                let c = content.querySelector('#filter-country');
                let y = content.querySelector('#filter-year');
                let s = content.querySelector('#filter-source');
                let w = content.querySelector('#filter-watched');
                let sortSel = content.querySelector('#filter-sort');
                if (q) q.oninput = function() { LampaUltimate.modules.filters.filters.quality = q.value.toLowerCase(); LampaUltimate.settings.filters.filters.quality = q.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (g) g.oninput = function() { LampaUltimate.modules.filters.filters.genre = g.value.toLowerCase(); LampaUltimate.settings.filters.filters.genre = g.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (c) c.oninput = function() { LampaUltimate.modules.filters.filters.country = c.value.toLowerCase(); LampaUltimate.settings.filters.filters.country = c.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (y) y.oninput = function() { LampaUltimate.modules.filters.filters.year = y.value; LampaUltimate.settings.filters.filters.year = y.value; LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (s) s.oninput = function() { LampaUltimate.modules.filters.filters.source = s.value.toLowerCase(); LampaUltimate.settings.filters.filters.source = s.value.toLowerCase(); LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (w) w.onchange = function() { LampaUltimate.modules.filters.filters.watched = w.value; LampaUltimate.settings.filters.filters.watched = w.value; LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
                if (sortSel) sortSel.onchange = function() { LampaUltimate.modules.filters.sort = sortSel.value; LampaUltimate.settings.filters.sort = sortSel.value; LampaUltimate.saveSettings(); let ev = new Event('ultimate-filter-update'); document.dispatchEvent(ev); };
            };
        }
    };

    // Пример заглушки модуля (реализовать каждый модуль отдельно)
    LampaUltimate.registerModule('badges', {
        enabled: true,
        name: 'Бейджи качества и серий',
        init() {
            // TODO: Реализовать рендер бейджей на карточках
        }
    });
    LampaUltimate.registerModule('logos', {
        enabled: true,
        name: 'Оригинальные логотипы',
        init() {
            // TODO: Реализовать автоматическое получение и отображение логотипов
        }
    });
    LampaUltimate.registerModule('vpn', {
        enabled: false,
        name: 'VPN Checker',
        init() {
            // TODO: Реализовать проверку VPN с мульти-API и визуализацией
        }
    });
    // ... другие модули по аналогии

    // Автоинициализация при загрузке
    setTimeout(() => LampaUltimate.init(), 1000);

    // Экспорт для отладки
    window.LampaUltimate = LampaUltimate;
})();