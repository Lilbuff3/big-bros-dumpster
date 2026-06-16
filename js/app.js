// -----------------------------
// Config (replace with real values)
// -----------------------------
const BUSINESS = {
    phoneDisplay: "(559) 495-8034",
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
    ["textCta", "textSide", "textSticky", "modalText"].forEach(id => {
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
    const sizeEl = _qS("#size");
    if (sizeEl) sizeEl.value = val;
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
    const val = _qS("#select20")?.dataset.size || "14";
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    showStep(2);
    const sizeEl = _qS("#size");
    if (sizeEl) sizeEl.value = val;
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
        notes: _qS("#notes")?.value || "",
        savedAt: Date.now()
    };
    localStorage.setItem('bigBrosLead', JSON.stringify(data));
}

function loadProgress() {
    try {
        const saved = localStorage.getItem('bigBrosLead');
        if (!saved) return;
        const data = JSON.parse(saved);
        const EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - (data.savedAt || 0) > EXPIRY_MS) {
            localStorage.removeItem('bigBrosLead');
            return;
        }
        const set = (sel, val) => { const el = _qS(sel); if (el && val) el.value = val; };
        set("#zip", data.zip);
        set("#size", data.size);
        if (data.debris) setDebris(data.debris);
        set("#date", data.date);
        set("#placement", data.placement);
        set("#name", data.name);
        set("#phone", data.phone);
        set("#notes", data.notes);
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
        const btn = _qS("#copyBtn");
        const old = btn.textContent;
        btn.textContent = lang === 'es' ? "Error al copiar" : "Copy failed";
        btn.classList.add("border-red-500", "text-red-400");
        setTimeout(() => { btn.textContent = old; btn.classList.remove("border-red-500", "text-red-400"); }, 1500);
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

document.getElementById('langBtnMobile')?.addEventListener('click', () => {
    lang = (lang === 'en') ? 'es' : 'en';
    applyLang();
    validateZip();
    if (step === 4) buildSummary();
});

// -----------------------------
// SMS Feature Logic
// -----------------------------
function setupSmsFeature() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const smsLinks = _qSA("#textCtaHero, #fabSms, #textSticky, #textCta, #textSide");
    const smsModal = _qS("#smsModal");
    const closeBtn = _qS("#closeSmsModal");
    const qrImage = _qS("#smsQrCode");
    
    const smsBody = encodeURIComponent("Hi Big Bros, I need a dumpster quote. ZIP: ");
    const smsHref = `sms:${BUSINESS.smsNumber}?&body=${smsBody}`;
    
    // Set QR code (using api.qrserver.com)
    if (qrImage && !qrImage.dataset.customSms) {
        const qrContent = encodeURIComponent(`SMSTO:${BUSINESS.smsNumber}:Hi Big Bros, I need a dumpster quote. ZIP: `);
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrContent}`;
        qrImage.classList.remove('hidden');
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
// Booking Calendar Interactivity
// -----------------------------
function setupCalendar() {
    const calendarMonth = _qS("#calendarMonth");
    const calendarDays = _qS("#calendarDays");
    const prevMonthBtn = _qS("#prevMonth");
    const nextMonthBtn = _qS("#nextMonth");
    const selectedDateLabel = _qS("#selectedDate");
    const timeSlots = _qSA("#timeSlots .timeSlot");
    const bookingSizeBtns = _qSA(".bookingSizeBtn");
    const bookingDebrisSelect = _qS("#bookingDebris");
    const bookNowBtn = _qS("#bookNowBtn");
    const smsModal = _qS("#smsModal");
    const qrImage = _qS("#smsQrCode");

    if (!calendarDays || !bookNowBtn) return; // Exit if no calendar on page

    let displayedMonth = new Date();
    let selectedDate = null;
    let selectedTimeSlot = null;
    let selectedSize = null;
    let selectedDebris = bookingDebrisSelect?.value || "Household Junk";

    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    function renderCalendar() {
        const year = displayedMonth.getFullYear();
        const month = displayedMonth.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update Header Month/Year
        if (calendarMonth) {
            calendarMonth.textContent = displayedMonth.toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', {
                month: 'long',
                year: 'numeric'
            });
        }

        // Disable Prev Month if displayedMonth is current month
        if (prevMonthBtn) {
            const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
            prevMonthBtn.disabled = isCurrentMonth;
            prevMonthBtn.style.opacity = isCurrentMonth ? "0.4" : "1";
            prevMonthBtn.style.cursor = isCurrentMonth ? "not-allowed" : "pointer";
        }

        // Clear Days
        calendarDays.innerHTML = "";

        // First day of the month (0 = Sunday, 1 = Monday, etc.)
        const firstDayIndex = new Date(year, month, 1).getDay();
        const daysInMonth = getDaysInMonth(year, month);

        // Render Empty cells for padding
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement("div");
            calendarDays.appendChild(emptyCell);
        }

        // Render Day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(year, month, day);
            const isPast = cellDate < today;
            const isSelected = selectedDate && cellDate.toDateString() === selectedDate.toDateString();

            const cell = document.createElement("button");
            cell.type = "button";
            cell.textContent = String(day);
            cell.className = "p-3 border border-zinc-800/40 text-center text-sm transition font-bold select-none cursor-pointer rounded-lg";

            if (isPast) {
                cell.className = "p-3 text-zinc-600 text-center text-sm cursor-not-allowed select-none opacity-40";
                cell.disabled = true;
            } else if (isSelected) {
                cell.className = "p-3 bg-[var(--orange)] text-black font-black text-center text-sm rounded-lg";
            } else {
                cell.className = "p-3 border border-zinc-800/40 hover:border-[var(--orange)] hover:text-[var(--orange)] text-center text-sm transition font-bold cursor-pointer rounded-lg";
                cell.addEventListener("click", () => {
                    selectedDate = cellDate;
                    renderCalendar();
                    updateSelectedDateLabel();
                    updateSmsLink();
                });
            }

            calendarDays.appendChild(cell);
        }
    }

    function updateSelectedDateLabel() {
        if (!selectedDateLabel) return;
        if (selectedDate) {
            selectedDateLabel.textContent = selectedDate.toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            selectedDateLabel.classList.remove('text-zinc-500');
            selectedDateLabel.classList.add('text-white');
        } else {
            selectedDateLabel.textContent = lang === 'es' ? "Seleccione una fecha" : "Select a date";
            selectedDateLabel.classList.remove('text-white');
            selectedDateLabel.classList.add('text-zinc-500');
        }
    }

    function updateSmsLink() {
        if (!selectedDate) {
            bookNowBtn.href = "#";
            return;
        }

        const dateStr = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = selectedTimeSlot ? selectedTimeSlot : "(choose time)";
        const sizeStr = selectedSize ? `${selectedSize}yd` : "(choose size)";
        
        let msg = `Hi Big Bros — I want to check availability for a dumpster drop-off:\n`;
        msg += `Date: ${dateStr}\n`;
        msg += `Time slot: ${timeStr}\n`;
        msg += `Size: ${sizeStr}\n`;
        msg += `Debris: ${selectedDebris}`;

        const smsHref = `sms:${BUSINESS.smsNumber}?&body=${encodeURIComponent(msg)}`;
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (isMobile) {
            bookNowBtn.href = smsHref;
            bookNowBtn.removeAttribute('target');
        } else {
            bookNowBtn.href = "#";
            // Set dynamic QR code generation
            if (qrImage) {
                qrImage.dataset.customSms = "true";
                const qrContent = encodeURIComponent(`SMSTO:${BUSINESS.smsNumber}:${msg}`);
                qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrContent}`;
                qrImage.classList.remove('hidden');
            }
        }
    }

    // Month Navigation Listeners
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener("click", () => {
            displayedMonth.setMonth(displayedMonth.getMonth() - 1);
            renderCalendar();
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener("click", () => {
            displayedMonth.setMonth(displayedMonth.getMonth() + 1);
            renderCalendar();
        });
    }

    // Time Slot Click Listeners
    timeSlots.forEach(slot => {
        slot.addEventListener("click", () => {
            timeSlots.forEach(s => s.classList.remove("bg-[var(--orange)]", "text-black", "border-[var(--orange)]"));
            slot.classList.add("bg-[var(--orange)]", "text-black", "border-[var(--orange)]");
            selectedTimeSlot = slot.getAttribute("data-time") || slot.textContent;
            // Format time for user display if needed
            updateSmsLink();
        });
    });

    // Dumpster Size Buttons
    bookingSizeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            bookingSizeBtns.forEach(b => b.classList.remove("border-[var(--orange)]", "text-[var(--orange)]"));
            btn.classList.add("border-[var(--orange)]", "text-[var(--orange)]");
            selectedSize = btn.getAttribute("data-size");
            updateSmsLink();
        });
    });

    // Debris Select
    if (bookingDebrisSelect) {
        bookingDebrisSelect.addEventListener("change", (e) => {
            selectedDebris = e.target.value;
            updateSmsLink();
        });
    }

    // Book Now Click (Validation on Desktop fallback)
    bookNowBtn.addEventListener("click", (e) => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        
        if (!selectedDate) {
            e.preventDefault();
            alert(lang === 'es' ? "Por favor, seleccione una fecha en el calendario." : "Please select a date on the calendar.");
            calendarDays.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (!selectedTimeSlot) {
            e.preventDefault();
            alert(lang === 'es' ? "Por favor, elija un horario de entrega." : "Please choose a delivery time slot.");
            _qS("#timeSlots")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (!selectedSize) {
            e.preventDefault();
            alert(lang === 'es' ? "Por favor, elija el tamaño del contenedor." : "Please choose a dumpster size.");
            _qS(".bookingSizeBtn")?.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

        if (!isMobile) {
            e.preventDefault();
            smsModal?.classList.remove('hidden');
        }
    });

    // Initial render
    renderCalendar();
    updateSelectedDateLabel();
    updateSmsLink();
}

// -----------------------------
// Final Init
// -----------------------------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
applyLang();
showStep(1);
setBusinessLinks();
loadProgress();
setupSmsFeature();
setupCalendar();

