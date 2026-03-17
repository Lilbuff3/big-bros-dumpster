// -----------------------------
// Config (replace with real values)
// -----------------------------
const BUSINESS = {
    phoneDisplay: "559-495-8034",
    phoneTel: "+15594958034",
    smsNumber: "+15594958034",
    email: "will@bigbrosdumpster.com",
    googleReviewUrl: "https://g.page/r/CXZ1QsLG5e_dEBM/review"
};

// -----------------------------
// Helpers
// -----------------------------
const _qS = (sel, root = document) => root.querySelector(sel);
const _qSA = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setBusinessLinks() {
    const phoneText = BUSINESS.phoneDisplay;
    const tel = `tel:${BUSINESS.phoneTel}`;
    const sms = `sms:${BUSINESS.smsNumber}?&body=${encodeURIComponent('Hi Big Bros — I need a dumpster quote. ZIP: ')}`;

    ["topPhone", "callCta", "callSide", "callSticky", "modalCall"].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.href = tel; }
    });
    ["textCta", "textSide", "textSticky", "textCta2", "modalText"].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.href = sms; }
    });
    // Update visible phone text instances
    const reviewBtn = document.getElementById("googleReviewBtn");
    if (reviewBtn) { reviewBtn.href = BUSINESS.googleReviewUrl; }
}

// -----------------------------
// Mobile menu
// -----------------------------
const menuBtn = _qS("#menuBtn");
const mobileMenu = _qS("#mobileMenu");
if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        const open = mobileMenu.classList.toggle("hidden") === false;
        menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // Close on link tap
    _qSA("a,button", mobileMenu).forEach(el => {
        el.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
}

// -----------------------------
// Quote modal
// -----------------------------
const quoteModal = _qS("#quoteModal");
function openModal() { quoteModal?.classList.remove("hidden"); }
function closeModal() { quoteModal?.classList.add("hidden"); }

_qS("#openQuote")?.addEventListener("click", openModal);
_qS("#openQuoteMobile")?.addEventListener("click", openModal);
_qS("#quoteSticky")?.addEventListener("click", openModal);
_qSA('[data-close]', quoteModal || document).forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
_qS("#modalGo")?.addEventListener("click", () => {
    closeModal();
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('zip')?.focus(), 450);
});

// Scroll quote
_qS("#scrollQuote")?.addEventListener("click", () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('zip')?.focus(), 450);
});

// -----------------------------
// Quote wizard
// -----------------------------
const stepLabel = _qS("#stepLabel");
const stepNum = _qS("#stepNum");
const progress = _qS("#progress");
const nextBtn = _qS("#nextBtn");
const toStep4 = _qS("#toStep4");
const form = _qS("#quoteForm");

const steps = _qSA(".step");
let step = 1;

const stepNames = { 1: "Location", 2: "Size", 3: "Details", 4: "Send" };

// Service ZIP hints (not exhaustive)
const coreZips = new Set([
    // Fresno
    "93701", "93702", "93703", "93704", "93705", "93706", "93710", "93711", "93720", "93721", "93722", "93723", "93725", "93726", "93727", "93728", "93730",
    // Clovis
    "93611", "93612", "93619"
]);

function showStep(n) {
    step = n;
    steps.forEach(s => s.classList.toggle('hidden', Number(s.dataset.step) !== step));
    if (stepNum) stepNum.textContent = String(step);
    if (stepLabel) stepLabel.textContent = stepNames[step] || "";
    if (progress) progress.style.width = `${(step / 4) * 100}%`;
    if (nextBtn) {
        nextBtn.classList.toggle('hidden', step >= 3);
    }
}

function validateZip() {
    const zip = String(_qS("#zip")?.value || "").trim();
    const status = _qS("#zipStatus");
    if (!status) return true;

    if (zip.length === 0) {
        status.classList.add('hidden');
        status.textContent = "";
        return false;
    }

    if (!/^\d{5}$/.test(zip)) {
        status.classList.remove('hidden');
        status.className = "mt-3 border border-zinc-800 bg-black/30 p-3 text-sm text-zinc-300";
        status.textContent = lang === 'es' ? "Ingresa un ZIP de 5 dígitos." : "Enter a 5-digit ZIP.";
        return false;
    }

    const isCore = coreZips.has(zip);
    status.classList.remove('hidden');
    status.className = isCore
        ? "mt-3 border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200"
        : "mt-3 border border-[var(--orange)]/40 bg-[var(--orange)]/10 p-3 text-sm text-zinc-100";

    status.textContent = isCore
        ? (lang === 'es' ? "Dentro de zona principal (Fresno/Clovis)." : "Within core service area (Fresno/Clovis).")
        : (lang === 'es' ? "Fuera de zona principal — confirmamos disponibilidad por texto/llamada." : "Outside core area — we’ll confirm availability by text/call.");

    return true;
}

function requireField(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    const val = (el.value || "").trim();
    if (!val) {
        el.classList.add("border-[var(--orange)]");
        setTimeout(() => el.classList.remove("border-[var(--orange)]"), 700);
        el.focus?.();
        return false;
    }
    return true;
}

function buildSummary() {
    const zip = _qS("#zip")?.value?.trim() || "";
    const size = _qS("#size")?.value || "";
    const debris = _qS("#debris")?.value || "";
    const date = _qS("#date")?.value || "";
    const placement = _qS("#placement")?.value || "";
    const name = _qS("#name")?.value?.trim() || "";
    const phone = _qS("#phone")?.value?.trim() || "";
    const notes = _qS("#notes")?.value?.trim() || "";

    const lines = [
        `ZIP: ${zip}`,
        `Size: ${size ? size + ' yard' : ''}`,
        `Debris: ${debris}`,
        `Needed: ${date || 'ASAP'}`,
        `Placement: ${placement}`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        notes ? `Notes: ${notes}` : ""
    ].filter(Boolean);

    const summaryText = lines.join("\n");
    const summaryEl = _qS("#summary");
    if (summaryEl) summaryEl.textContent = summaryText;
    return summaryText;
}

function setSizeAndAdvance(val) {
    _qS("#size").value = val;
    showStep(3);
}

function setDebris(val) {
    _qS("#debris").value = val;
    // Stay on step 3; user can set date/placement then next
    _qSA(".debrisBtn").forEach(b => b.classList.remove("border-[var(--orange)]", "text-[var(--orange)]"));
    const btn = _qS(`.debrisBtn[data-value="${CSS.escape(val)}"]`);
    btn?.classList.add("border-[var(--orange)]", "text-[var(--orange)]");
}

// Step nav
nextBtn?.addEventListener('click', () => {
    if (step === 1) {
        if (!validateZip() || !requireField('zip')) return;
        showStep(2);
    } else if (step === 2) {
        if (!requireField('size')) return;
        showStep(3);
    }
});

toStep4?.addEventListener('click', () => {
    if (!requireField('debris')) return;
    showStep(4);
    buildSummary();
});

_qSA("[data-prev]").forEach(btn => btn.addEventListener('click', () => {
    showStep(Math.max(1, step - 1));
}));

// ZIP live check
_qS("#zip")?.addEventListener('input', validateZip);

// Size buttons
_qSA(".sizeBtn").forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-value');
        _qS("#size").value = val;
        _qSA(".sizeBtn").forEach(b => b.classList.remove("border-[var(--orange)]"));
        btn.classList.add("border-[var(--orange)]");
        showStep(3);
    });
});

// Debris buttons
_qSA(".debrisBtn").forEach(btn => {
    btn.addEventListener('click', () => {
        setDebris(btn.getAttribute('data-value'));
    });
});

// Cards select -> prefill and jump to quote
_qSA("[data-size-pick]").forEach(btn => {
    btn.addEventListener('click', () => {
        const val = btn.getAttribute('data-size-pick');
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        showStep(1);
        setTimeout(() => {
            showStep(2);
            _qS("#size").value = val;
            showStep(3);
        }, 450);
    });
});

_qS("#select20")?.addEventListener('click', () => {
    const val = _qS("#select20").dataset.size || "14";
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showStep(2);
    _qS("#size").value = val;
    showStep(3);
});

// Lead persistence (save to localStorage)
function saveProgress() {
    const data = {
        zip: _qS("#zip")?.value || "",
        size: _qS("#size")?.value || "",
        debris: _qS("#debris")?.value || "",
        date: _qS("#date")?.value || "",
        placement: _qS("#placement")?.value || "",
        name: _qS("#name")?.value || "",
        phone: _qS("#phone")?.value || "",
        notes: _qS("#notes")?.value || ""
    };
    localStorage.setItem('bigBrosLead', JSON.stringify(data));
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('bigBrosLead');
        if (!saved) return;
        const data = JSON.parse(saved);
        if (data.zip) _qS("#zip").value = data.zip;
        if (data.size) _qS("#size").value = data.size;
        if (data.debris) setDebris(data.debris);
        if (data.date) _qS("#date").value = data.date;
        if (data.placement) _qS("#placement").value = data.placement;
        if (data.name) _qS("#name").value = data.name;
        if (data.phone) _qS("#phone").value = data.phone;
        if (data.notes) _qS("#notes").value = data.notes;
        validateZip();
    } catch (e) { console.warn("Persistence failed", e); }
}

// Keep summary updated and save progress
["zip", "size", "debris", "date", "placement", "name", "phone", "notes"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    ['input', 'change'].forEach(evt => {
        el.addEventListener(evt, () => {
            if (step === 4) buildSummary();
            saveProgress();
        });
    });
});

// Copy summary
_qS("#copyBtn")?.addEventListener('click', async () => {
    const text = buildSummary();
    try {
        await navigator.clipboard.writeText(text);
        const btn = _qS("#copyBtn");
        const old = btn.textContent;
        btn.textContent = lang === 'es' ? "Copiado" : "Copied";
        setTimeout(() => btn.textContent = old, 900);
    } catch (e) {
        alert(lang === 'es' ? "No se pudo copiar." : "Copy failed.");
    }
});

// Submit -> prefer SMS (mobile) else email
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!requireField('zip') || !requireField('size') || !requireField('debris')) {
        showStep(1);
        return;
    }
    const summary = buildSummary();
    const msg = `Big Bros Dumpster Quote Request\n${summary}`;
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
        window.location.href = `sms:${BUSINESS.smsNumber}?&body=${encodeURIComponent(msg)}`;
    } else {
        window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent('Dumpster Quote Request')}&body=${encodeURIComponent(msg)}`;
    }
});

// -----------------------------
// Language toggle
// -----------------------------
document.getElementById('langBtn')?.addEventListener('click', () => {
    lang = (lang === 'en') ? 'es' : 'en'; // Relies on 'lang' from i18n.js
    applyLang(); // Relies on 'applyLang' from i18n.js
    validateZip();
    if (step === 4) buildSummary();
});

// -----------------------------
// SMS Feature Logic
// -----------------------------
function setupSmsFeature() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const smsLinks = _qSA("#textCtaHero, #fabSms, #textSticky, #textCta, #textCta2, #textSide");
    const smsModal = _qS("#smsModal");
    const closeBtn = _qS("#closeSmsModal");
    const qrImage = _qS("#smsQrCode");
    
    const smsBody = encodeURIComponent("Hi Big Bros, I need a dumpster quote. ZIP: ");
    const smsHref = `sms:${BUSINESS.smsNumber}?&body=${smsBody}`;
    
    // Set QR code (using api.qrserver.com)
    if (qrImage) {
        const qrContent = encodeURIComponent(`SMSTO:${BUSINESS.smsNumber}:Hi Big Bros, I need a dumpster quote. ZIP: `);
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrContent}`;
    }

    smsLinks.forEach(link => {
        if (!link) return;
        
        if (isMobile) {
            link.href = smsHref;
        } else {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                smsModal?.classList.remove('hidden');
            });
        }
    });

    closeBtn?.addEventListener('click', () => smsModal?.classList.add('hidden'));
    smsModal?.addEventListener('click', (e) => {
        if (e.target === smsModal) smsModal.classList.add('hidden');
    });
}

// -----------------------------
// Booking Calendar Widget
// -----------------------------
const SQUARE_BOOKING_URL = "https://square.site/book/REPLACE_WITH_YOUR_SQUARE_BOOKING_ID/big-bros-dumpster";

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let selectedBookingDate = null;
let selectedBookingTime = null;
let selectedBookingSize = null;

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function renderCalendar() {
    const calendarMonth = document.getElementById('calendarMonth');
    const calendarDays = document.getElementById('calendarDays');
    if (!calendarMonth || !calendarDays) return;

    calendarMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    calendarDays.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'p-3';
        calendarDays.appendChild(empty);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(currentYear, currentMonth, day);
        const isPast = dateObj < today;
        const isToday = dateObj.getTime() === today.getTime();
        const isSelected = selectedBookingDate &&
            dateObj.getDate() === selectedBookingDate.getDate() &&
            dateObj.getMonth() === selectedBookingDate.getMonth() &&
            dateObj.getFullYear() === selectedBookingDate.getFullYear();

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = day;
        btn.className = `p-3 text-center font-bold transition ${isPast
            ? 'text-zinc-700 cursor-not-allowed'
            : isSelected
                ? 'bg-[var(--orange)] text-black border border-[var(--orange)]'
                : isToday
                    ? 'border border-[var(--orange)] hover:bg-[var(--orange)] hover:text-black'
                    : 'border border-zinc-800 hover:border-[var(--orange)] bg-black'
            }`;

        if (!isPast) {
            btn.addEventListener('click', () => selectDate(dateObj));
        }

        calendarDays.appendChild(btn);
    }
}

function selectDate(date) {
    selectedBookingDate = date;
    const selectedDateEl = document.getElementById('selectedDate');
    if (selectedDateEl) {
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        selectedDateEl.textContent = date.toLocaleDateString('en-US', options);
    }
    renderCalendar();
    updateBookNowBtn();
}

// Time slot selection
document.querySelectorAll('.timeSlot').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.timeSlot').forEach(b => {
            b.classList.remove('border-[var(--orange)]', 'text-[var(--orange)]');
        });
        btn.classList.add('border-[var(--orange)]', 'text-[var(--orange)]');
        selectedBookingTime = btn.getAttribute('data-time');
        updateBookNowBtn();
    });
});

// Size selection for booking
document.querySelectorAll('.bookingSizeBtn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.bookingSizeBtn').forEach(b => {
            b.classList.remove('border-[var(--orange)]');
        });
        btn.classList.add('border-[var(--orange)]');
        selectedBookingSize = btn.getAttribute('data-size');
        updateBookNowBtn();
    });
});

function updateBookNowBtn() {
    const btn = document.getElementById('bookNowBtn');
    if (!btn) return;

    if (selectedBookingDate && selectedBookingTime && selectedBookingSize) {
        const dateStr = selectedBookingDate.toISOString().split('T')[0];
        // Build Square booking URL with parameters (adjust based on your Square setup)
        btn.href = `${SQUARE_BOOKING_URL}?date=${dateStr}&time=${selectedBookingTime}&size=${selectedBookingSize}`;
        btn.classList.remove('opacity-50', 'pointer-events-none');
        btn.textContent = `Book ${selectedBookingSize} Yard • ${selectedBookingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} @ ${formatTime(selectedBookingTime)}`;
    } else {
        btn.href = '#';
        btn.classList.add('opacity-50', 'pointer-events-none');
        btn.textContent = 'Select date, time & size to book';
    }
}

function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
}

// Month navigation
document.getElementById('prevMonth')?.addEventListener('click', () => {
    const today = new Date();
    if (currentYear > today.getFullYear() || (currentYear === today.getFullYear() && currentMonth > today.getMonth())) {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    }
});

document.getElementById('nextMonth')?.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// -----------------------------
// Final Init
// -----------------------------
document.getElementById('year').textContent = new Date().getFullYear();
applyLang();
showStep(1);
setBusinessLinks();
loadProgress();
renderCalendar();
updateBookNowBtn();
setupSmsFeature();
