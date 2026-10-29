/* GDScript Hero — funzioni UI isolate dalla logica di salvataggio e dal motore Godot. */
(function () {
    'use strict';
    if (!window.App) return;
    const app = window.App;
    const icons = {
        '🤖': '<rect x="4" y="7" width="16" height="14" rx="4"/><path d="M12 3v4M9 3h6"/><path d="M8 13h.01M16 13h.01M8 17h8"/>',
        '🧙': '<path d="m12 2 8 16H4zM4 18h16M8 21h8"/><path d="M10 12h.01M15 13h.01"/>',
        '⚔️': '<path d="m4 4 16 16M20 4 4 20M8 16l-3 3m11-11 3-3"/><path d="m4 9 5-5m6 16 5-5"/>',
        '👾': '<path d="M6 5h12v3h3v10h-3v3H6v-3H3V8h3zM8 11h.01M16 11h.01M9 16h6"/>',
        '🐱': '<path d="M4 8 5 3l5 3h4l5-3 1 5v8a8 8 0 0 1-16 0zM9 13h.01M15 13h.01M12 15v2m-3 0 3 1 3-1"/>',
        '🦊': '<path d="M2 6 8 8l4-3 4 3 6-2-3 11-7 5-7-5zM8 14h.01M16 14h.01M12 18v2"/>',
        '🐉': '<path d="M3 19c6 0 4-8 9-9l4-6 3 4-2 4 4 4-3 5H9M11 10l-2-5-4 3M14 14h.01"/>',
        '🚀': '<path d="M12 3c5 4 6 10 6 14l-6 4-6-4c0-4 1-10 6-14zM9 10h6M6 17l-3 3m15-3 3 3M12 20v3"/>'
    };
    const svgIcon = (key) => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (icons[key] || icons['🤖']) + '</svg>';
    const outlineIcon = (kind) => '<svg class="ui-icon ui-icon-sm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (kind === 'hint' ? '<path d="M9 18h6m-5 3h4M9 15c-1.5-1.5-3-3.1-3-5a6 6 0 0 1 12 0c0 2-1.5 3.6-3 5l-.5 3h-5z"/>' : '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>') + '</svg>';

    function paintProfileAvatar() {
        const avatar = app.state?.profile?.avatar || '🤖';
        const nav = document.getElementById('nav-profile-avatar');
        if (nav) { nav.innerHTML = svgIcon(avatar); nav.style.boxShadow = 'none'; }
        const preview = document.getElementById('profile-avatar-display');
        if (preview) { preview.innerHTML = svgIcon(avatar); preview.style.boxShadow = 'none'; }
    }
    function paintAvatarChoices() {
        document.querySelectorAll('.avatar-option[data-avatar]').forEach(button => {
            if (button.dataset.gdhIconReady) return;
            button.innerHTML = svgIcon(button.dataset.avatar);
            button.dataset.gdhIconReady = 'true';
            button.setAttribute('aria-label', 'Avatar ' + ({'🤖':'robot','🧙':'mago','⚔️':'spade','👾':'creatura','🐱':'gatto','🦊':'volpe','🐉':'drago','🚀':'razzo'}[button.dataset.avatar] || 'profilo'));
        });
    }
    function promoteToButton(node) {
        if (!node || node.tagName === 'BUTTON') return node;
        const button = document.createElement('button');
        for (const attr of Array.from(node.attributes)) button.setAttribute(attr.name, attr.value);
        button.type = 'button';
        while (node.firstChild) button.appendChild(node.firstChild);
        node.replaceWith(button);
        return button;
    }
    function decorateExercise() {
        document.querySelectorAll('#view-exercise .coddy-hint-trigger').forEach(node => {
            const button = promoteToButton(node);
            button?.setAttribute('aria-label', 'Mostra suggerimento');
        });
        document.querySelectorAll('#view-exercise .hint-icon, #view-exercise .coddy-bulb-icon, #view-exercise .hints-header-icon, #view-exercise .explain-robot-icon').forEach(el => {
            el.innerHTML = outlineIcon('hint');
        });
        const expected = document.getElementById('expected-output-pre');
        if (expected?.textContent.trim() === '// Nessun output richiesto') expected.textContent = 'Nessun output richiesto.';
        const actual = document.getElementById('real-output-pre');
        if (actual && actual.textContent.trim().startsWith('// Clicca su')) actual.textContent = 'Premi «Verifica il codice» per eseguire.';
    }
    function syncEditorHeight() {
        const editor = document.getElementById('code-editor');
        const view = document.getElementById('view-exercise');
        if (!editor || !view) return;
        const rows = (editor.value || '').split('\n').length;
        const mobile = window.matchMedia('(max-width:820px)').matches;
        const min = mobile ? 255 : 280;
        const max = mobile ? 390 : 520;
        view.style.setProperty('--gdh-editor-height', Math.max(min, Math.min(max, rows * 22 + 95)) + 'px');
    }
    const originalAuthUI = app.updateAuthUI;
    app.updateAuthUI = function () {
        const result = originalAuthUI.apply(this, arguments);
        // L'implementazione esistente azzera textContent: ridisegniamo l'icona SVG.
        const icon = document.getElementById('nav-auth-icon');
        if (icon) icon.innerHTML = '<path d="M8 17a5 5 0 0 1 0-10 6 6 0 0 1 11 3 3.5 3.5 0 0 1-1 7H8z"/>';
        return result;
    };
    const originalApplyProfile = app.applyProfileUI;
    app.applyProfileUI = function () { const value = originalApplyProfile.apply(this, arguments); paintProfileAvatar(); return value; };
    const originalProfilePreview = app.updateProfilePreviewCard;
    app.updateProfilePreviewCard = function () { const value = originalProfilePreview.apply(this, arguments); paintProfileAvatar(); return value; };

    const originalBindHints = app.bindStandardHintEvents;
    app.bindStandardHintEvents = function () {
        const toggle = promoteToButton(document.getElementById('btn-toggle-hint'));
        if (toggle) { toggle.setAttribute('aria-controls','hint-box'); toggle.setAttribute('aria-expanded','false'); }
        const result = originalBindHints.apply(this, arguments);
        toggle?.addEventListener('click', () => {
            requestAnimationFrame(() => toggle.setAttribute('aria-expanded', String(!document.getElementById('hint-box')?.classList.contains('hidden'))));
        });
        return result;
    };
    const originalOpenLesson = app.openLesson;
    app.openLesson = function () {
        const value = originalOpenLesson.apply(this, arguments);
        decorateExercise();
        syncEditorHeight();
        return value;
    };
    const originalLineNumbers = app.updateLineNumbers;
    app.updateLineNumbers = function () { const value = originalLineNumbers.apply(this, arguments); syncEditorHeight(); return value; };

    const originalVisibility = app.updateExerciseToolsVisibility;
    app.updateExerciseToolsVisibility = function (lesson) {
        if (!lesson) return;
        const withTree = !!lesson.hasNodeTree || (Array.isArray(lesson.initialNodes) && lesson.initialNodes.length > 0);
        // Quando la lezione introduce i nodi, entrambi gli strumenti sono visibili per default.
        const actual = withTree && this.state.manualToolsOverride !== 'hidden'
            ? Object.assign({}, lesson, {hasNodeTree:true,has2DViewport:true}) : lesson;
        return originalVisibility.call(this, actual);
    };
    const originalNav = app.updateNavSelection;
    app.updateNavSelection = function (view) { return originalNav.call(this, view === 'exercise' ? 'roadmap' : view); };

    const originalPracticeProgress = app.renderPracticeProgress;
    app.renderPracticeProgress = function (lesson, task, index) {
        const result = originalPracticeProgress.apply(this, arguments);
        const next = document.getElementById('lesson-practice-next');
        if (next) {
            const finished = !!task && this.getLessonPracticeRecord(lesson)?.completed.includes(task.key);
            next.classList.toggle('hidden', !finished);
            next.disabled = !finished;
            const tasks = window.LessonPractice?.tasksFor(lesson) || [];
            const last = tasks.length > 0 && index === tasks.length - 1;
            next.dataset.gdhLast = String(last);
            next.textContent = last ? 'Torna alla mappa' : 'Prossimo compito';
        }
        return result;
    };
    const originalResetFeedback = app.resetExerciseFeedback;
    app.resetExerciseFeedback = function () {
        const result = originalResetFeedback.apply(this, arguments);
        document.getElementById('exercise-primary-feedback')?.classList.add('hidden');
        const details = document.getElementById('exercise-test-details');
        if (details) details.hidden = true;
        const count = document.getElementById('exercise-test-count');
        if (count) count.textContent = '';
        return result;
    };
    const originalRunAndValidate = app.runAndValidate;
    app.runAndValidate = async function () {
        const result = await originalRunAndValidate.apply(this, arguments);
        document.querySelectorAll('#test-results-view .test-row .test-icon').forEach(el => {
            const passed = el.closest('.test-row')?.classList.contains('passed');
            el.innerHTML = passed ? outlineIcon('ok') : '<svg class="ui-icon ui-icon-sm" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/></svg>';
        });
        return result;
    };
    const originalShowFeedback = app.showExerciseFeedback;
    app.showExerciseFeedback = function () {
        const details = document.getElementById('exercise-test-details');
        if (details) details.hidden = false;
        return originalShowFeedback.apply(this, arguments);
    };
    const dateLabel = (element, style) => {
        if (element) element.textContent = new Date().toLocaleDateString('it-IT', {weekday:style,day:'numeric',month:'short'});
    };
    const originalSidebar = app.renderSidebarDailyQuests;
    app.renderSidebarDailyQuests = function () {
        const result = originalSidebar.apply(this, arguments);
        dateLabel(document.getElementById('sidebar-today-date'), 'short');
        return result;
    };
    const originalQuestsModal = app.openQuestsModal;
    app.openQuestsModal = function () {
        const result = originalQuestsModal.apply(this, arguments);
        dateLabel(document.getElementById('quests-today-date'), 'long');
        return result;
    };
    // Le tappe del tour riguardano solo pulsanti visibili nella navbar.
    if (Array.isArray(app.siteTourSteps)) app.siteTourSteps = app.siteTourSteps.filter(step => step.desktop !== '#nav-editor-btn' && step.desktop !== '#nav-stats-btn');

    const originalBind = app.bindEvents;
    app.bindEvents = function () {
        const result = originalBind.apply(this, arguments);
        const trigger = document.getElementById('btn-open-user-menu');
        const menu = document.getElementById('user-menu');
        const close = (restore = false) => {
            if (!menu || menu.classList.contains('hidden')) return;
            menu.classList.add('hidden');
            trigger?.setAttribute('aria-expanded','false');
            if (restore) trigger?.focus();
        };
        if (trigger && menu) {
            trigger.addEventListener('click', event => {
                event.stopPropagation();
                const shouldOpen = menu.classList.contains('hidden');
                if (shouldOpen) this.closeLevelPopover();
                menu.classList.toggle('hidden', !shouldOpen);
                trigger.setAttribute('aria-expanded', String(shouldOpen));
            });
            document.getElementById('btn-menu-profile')?.addEventListener('click', () => this.openProfileModal());
            menu.querySelectorAll('button').forEach(button => button.addEventListener('click', () => close()));
            document.addEventListener('click', event => {
                if (!event.target.closest('#user-menu, #btn-open-user-menu')) close();
            });
            document.addEventListener('keydown', event => {
                if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
                    event.preventDefault();
                    close(true);
                }
            });
            document.getElementById('btn-open-profile')?.addEventListener('click', () => close());
        }
        const next = document.getElementById('lesson-practice-next');
        // Il listener originale naviga fra i compiti: intercettiamo solo l'ultimo.
        next?.addEventListener('click', event => {
            if (next.dataset.gdhLast === 'true' && !next.disabled) {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.showRoadmap();
            }
        }, true);
        paintAvatarChoices();
        return result;
    };
    const originalInit = app.init;
    app.init = function () {
        const result = originalInit.apply(this, arguments);
        let lastDay = this.getTodayISO();
        const refreshDay = () => {
            const today = this.getTodayISO();
            if (today !== lastDay) {
                lastDay = today;
                this.checkDailyQuestsReset();
                this.updateQuestsBadge();
                this.renderSidebarDailyQuests();
                dateLabel(document.getElementById('quests-today-date'),'long');
            }
        };
        // Il timer e il ritorno sulla scheda gestiscono anche il passaggio locale della mezzanotte.
        window.setInterval(refreshDay, 30000);
        document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshDay(); });
        paintAvatarChoices();
        paintProfileAvatar();
        decorateExercise();
        return result;
    };
})();
