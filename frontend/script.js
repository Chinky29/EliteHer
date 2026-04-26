/* ============================================================
   CycleAI — script.js
   Vanilla JavaScript — all interactive features
   Integrated with Flask Backend
   ============================================================ */

"use strict";

const API_BASE_URL = 'http://127.0.0.1:5000/api';
const USER_ID = 'demo_user';

async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, options);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error(`Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

/* ============================================================
   1. NAVBAR — hamburger menu + scroll shadow + section toggle
============================================================ */
const hamburger  = document.getElementById("hamburger");
const navLinks   = document.getElementById("navLinks");
const navbar     = document.getElementById("navbar");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("active");
});

// Close nav when a link is clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", (e) => {
    navLinks.classList.remove("open");
    
    // Get target section ID from href
    const href = link.getAttribute("href");
    if (href.startsWith("#")) {
      e.preventDefault();
      const sectionId = href.substring(1);
      showSection(sectionId);
    }
  });
});

// Navbar buttons (Track Now, etc)
document.querySelectorAll(".btn-nav").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const href = btn.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const sectionId = href.substring(1);
      showSection(sectionId);
    }
  });
});

// Hero buttons (Get Started, Explore Features)
document.querySelectorAll(".btn-primary, .btn-ghost").forEach(btn => {
  if (btn.getAttribute("href") && btn.getAttribute("href").startsWith("#")) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const href = btn.getAttribute("href");
      const sectionId = href.substring(1);
      showSection(sectionId);
    });
  }
});

// Function to show/hide sections
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll("#problem, #users, #limitations, #approach, #features, #dashboard").forEach(s => {
    s.classList.remove("show");
  });
  
  // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
      target.classList.add("show");
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Animate cards when section appears
      setTimeout(() => animateSectionCards(), 50);
      
      // Re-init dashboard elements
      if (sectionId === "dashboard") {
        setTimeout(() => {
          renderNotifications();
          renderLogList();
          renderTrendChart(); // Ensure chart renders when dashboard is shown
        }, 100);
      }
    }
}

// Add shadow on scroll
window.addEventListener("scroll", () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? "0 4px 30px rgba(0,0,0,0.5)"
    : "none";
});


/* ============================================================
   2. ANIMATE SECTION WHEN SHOWN
============================================================ */
function animateSectionCards() {
  document.querySelectorAll(".show .problem-card, .show .user-card, .show .limit-card, .show .feature-card").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    el.style.animationDelay = (i * 100) + "ms";
    
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, i * 100);
  });
}


/* ============================================================
   3. DASHBOARD TAB SYSTEM
============================================================ */
function initDashboardTabs() {
  const dashTabs   = document.querySelectorAll(".dash-tab");
  const dashPanels = document.querySelectorAll(".dash-panel");

  dashTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      dashTabs.forEach(t => t.classList.remove("active"));
      dashPanels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById("tab-" + target).classList.add("active");

      // Lazy initialise panels
      setTimeout(() => {
        if (target === "calendar")       renderCalendar();
        if (target === "trend")          renderTrendChart();
        if (target === "notifications")  renderNotifications();
      }, 50);
    });
  });
}

// Initialize on load
window.addEventListener("load", () => initDashboardTabs());


/* ============================================================
   4. CYCLE LOG FORM
============================================================ */

// --- Symptom chip toggle ---
document.getElementById("symptomChips").querySelectorAll(".symp-chip").forEach(chip => {
  chip.addEventListener("click", () => chip.classList.toggle("selected"));
});

// Storage for logged entries (session-level array)
let cycleLogs = [];

// Persist and render
async function fetchLogs() {
  try {
    const data = await apiRequest(`/cycles/${USER_ID}`);
    cycleLogs = data.cycles || [];
    renderLogList();
  } catch (error) {
    console.error("Failed to fetch logs:", error);
  }
}

function renderLogList() {
  const listEl = document.getElementById("logList");
  if (cycleLogs.length === 0) {
    listEl.innerHTML = '<div class="log-empty">No logs yet. Start tracking above!</div>';
    return;
  }
  listEl.innerHTML = cycleLogs
    .slice()
    .map(log => `
      <div class="log-entry">
        <div class="log-entry-date">📅 ${log.start_date} → ${log.end_date || "ongoing"}</div>
        <div class="log-entry-flow">Flow Intensity: <strong>${log.flow_intensity}</strong> &nbsp;|&nbsp; Cycle Length: <strong>${log.cycle_length ? log.cycle_length + " days" : "—"}</strong></div>
        <div class="log-entry-syms">
          ${log.acne_score > 0 ? '<span class="log-sym-tag">Acne</span>' : ''}
          ${log.stress_level > 0 ? '<span class="log-sym-tag">Stress</span>' : ''}
          ${log.mood_swings > 0 ? '<span class="log-sym-tag">Mood Swings</span>' : ''}
          ${log.hair_loss > 0 ? '<span class="log-sym-tag">Hair Loss</span>' : ''}
          ${log.weight_gain > 0 ? '<span class="log-sym-tag">Weight Gain</span>' : ''}
        </div>
      </div>
    `).join("");
}

// Initial render
fetchLogs();

// Save log
document.getElementById("logCycleBtn").addEventListener("click", async () => {
  const start  = document.getElementById("startDate").value;
  const end    = document.getElementById("endDate").value;
  const flow   = document.getElementById("flowIntensity").value;
  const age    = document.getElementById("userAge").value;
  const notes  = document.getElementById("cycleNotes").value.trim();
  const syms   = [...document.querySelectorAll(".symp-chip.selected")].map(c => c.dataset.sym);

  if (!start) {
    alert("Please select a period start date.");
    return;
  }

  if (!age) {
    alert("Please enter your age.");
    return;
  }

  // Map flow intensity string to numeric
  const flowMap = { 'light': 1, 'moderate': 2, 'heavy': 3, 'very-heavy': 4 };
  
  // Find prev_start from the last log
  const prev_start = cycleLogs.length > 0 ? cycleLogs[0].start_date : null;

  const payload = {
    user_id: USER_ID,
    start_date: start,
    end_date: end,
    prev_start: prev_start,
    flow_intensity: flowMap[flow] || 2,
    acne_score: syms.includes('acne') ? 5 : 0,
    stress_level: syms.includes('fatigue') ? 5 : 0,
    mood_swings: syms.includes('mood-swings') ? 5 : 0,
    weight_gain: syms.includes('weight-gain') ? 1.5 : 0,
    hair_loss: syms.includes('hair-loss') ? 1 : 0,
    age: parseInt(age)
  };

  try {
    await apiRequest('/log-cycle', 'POST', payload);
    await fetchLogs();

    // Trigger a notification
    addNotification({
      type: "info",
      icon: "📝",
      title: "Cycle Logged",
      msg: `Logged cycle starting ${start}. Keep tracking for better predictions!`,
    });

    // Clear form
    document.getElementById("clearFormBtn").click();

    // Show success flash
    const btn = document.getElementById("logCycleBtn");
    const orig = btn.textContent;
    btn.textContent = "✓ Saved!";
    btn.style.background = "linear-gradient(135deg, #4ade80, #22d3ee)";
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = "";
    }, 2000);
  } catch (error) {
    alert("Failed to save log entry. Is the backend running?");
  }
});

// Clear form
document.getElementById("clearFormBtn").addEventListener("click", () => {
  document.getElementById("startDate").value     = "";
  document.getElementById("endDate").value       = "";
  document.getElementById("flowIntensity").value = "";
  document.getElementById("cycleLength").value   = "";
  document.getElementById("cycleNotes").value    = "";
  document.querySelectorAll(".symp-chip.selected").forEach(c => c.classList.remove("selected"));
});


/* ============================================================
   5. CALENDAR VIEW
============================================================ */
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth(); // 0-indexed

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function renderCalendar() {
  const grid    = document.getElementById("calGrid");
  const heading = document.getElementById("calMonthYear");
  const today   = new Date();

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  heading.textContent = new Date(calYear, calMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Determine marked days from logs (very simplified: mark start days)
  const periodDays = new Set();
  cycleLogs.forEach(log => {
    if (!log.start) return;
    const s = new Date(log.start);
    if (s.getFullYear() === calYear && s.getMonth() === calMonth) {
      // Mark 5 days of period
      for (let d = 0; d < 5; d++) {
        periodDays.add(s.getDate() + d);
      }
    }
  });

  // Predict next period (last log + cycle length)
  const predictedDays = new Set();
  if (cycleLogs.length > 0) {
    const lastLog   = cycleLogs[cycleLogs.length - 1];
    const cycleLen  = parseInt(lastLog.cycle) || 28;
    const lastStart = new Date(lastLog.start);
    const nextStart = new Date(lastStart);
    nextStart.setDate(nextStart.getDate() + cycleLen);
    if (nextStart.getFullYear() === calYear && nextStart.getMonth() === calMonth) {
      for (let d = 0; d < 5; d++) predictedDays.add(nextStart.getDate() + d);
    }
  } else {
    // Demo: predict next period around day 14 from today
    const demo = today.getDate() + 14;
    for (let d = demo; d < demo + 5; d++) predictedDays.add(d);
  }

  // Fertile window (approx ovulation ≈ 14 days before next period)
  const fertileDays = new Set();
  const demoOvDay = 14;
  for (let d = demoOvDay - 2; d <= demoOvDay + 2; d++) fertileDays.add(d);

  // Build grid HTML
  let html = DAY_NAMES.map(d => `<div class="cal-day-name">${d}</div>`).join("");

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

  for (let day = 1; day <= daysInMonth; day++) {
    let classes = "cal-day";
    if (
      day === today.getDate() &&
      calMonth === today.getMonth() &&
      calYear === today.getFullYear()
    ) classes += " today";
    else if (periodDays.has(day))    classes += " period";
    else if (predictedDays.has(day)) classes += " predicted";
    else if (fertileDays.has(day))   classes += " fertile";

    html += `<div class="${classes}">${day}</div>`;
  }

  grid.innerHTML = html;
}

document.getElementById("calPrev").addEventListener("click", () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});
document.getElementById("calNext").addEventListener("click", () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});


/* ============================================================
   6. RISK SCORE CALCULATOR
============================================================ */
document.getElementById("calcRiskBtn").addEventListener("click", async () => {
  const fields = ["irregular", "acne", "weight", "family", "hair"];
  const age = document.getElementById("riskAge").value;
  const answers = {};
  let allAnswered = true;

  if (!age) {
    alert("Please enter your age.");
    return;
  }

  fields.forEach(name => {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected) {
      answers[name] = selected.value === "2" ? 1 : 0; // Map 2 (Yes) to 1, others to 0
    } else {
      allAnswered = false;
    }
  });

  if (!allAnswered) {
    alert("Please answer all questions to get your risk score.");
    return;
  }

  // Map frontend questions to backend expected fields
  // Backend expects: cycle_length, gap_variation, flow_intensity, acne_score, stress_level, weight_gain, mood_swings, hair_loss, age
  
  const payload = {
    age: parseInt(age),
    weight_gain: answers.weight * 5, // Map binary to scale
    hair_loss: answers.hair * 3,
    acne_score: answers.acne * 5,
    cycle_length: answers.irregular === 1 ? 40 : 28, // Map irregular to high cycle length
    gap_variation: answers.irregular === 1 ? 15 : 2,
    flow_intensity: 2,
    stress_level: 3,
    mood_swings: 3
  };

  try {
    const data = await apiRequest('/predict', 'POST', payload);
    const pct = Math.round(data.confidence);
    const level = data.risk_level;
    const color = level === "High" ? "#f87171" : (level === "Medium" ? "#facc15" : "#4ade80");
    const advice = level === "High" 
      ? "Multiple PCOD risk indicators detected. We strongly recommend seeing a gynaecologist for a full evaluation including ultrasound."
      : (level === "Medium" ? "Some indicators suggest a moderate PCOD risk. Consider consulting a gynaecologist for a hormonal evaluation." : "Your responses indicate a low PCOD risk. Keep tracking your cycle and maintain a healthy lifestyle.");
    
    const actions = level === "High"
      ? ["See a gynaecologist this week", "Request pelvic ultrasound & hormone panel", "Discuss Metformin or lifestyle protocols", "Log all symptoms daily"]
      : (level === "Medium" ? ["Book a gynaecology consultation", "Get hormonal panel blood test", "Reduce processed sugar", "Track symptoms consistently"] : ["Continue regular cycle tracking", "Maintain balanced diet & exercise", "Schedule annual check-up"]);

    if (level === "High") {
      addNotification({
        type: "alert",
        icon: "⚠️",
        title: "High PCOD Risk Detected",
        msg: "Your assessment indicates a high risk. Please consult a healthcare professional.",
      });
    }

    const dashArray = `${(pct / 100) * 314} 314`;

    document.getElementById("riskResult").innerHTML = `
      <div class="risk-score-display">
        <div class="rsd-ring">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="10"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke="${color}" stroke-width="10"
              stroke-linecap="round"
              stroke-dasharray="${dashArray}"
              stroke-dashoffset="-30"
              style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dasharray 1s ease"/>
          </svg>
          <div class="rsd-inner">
            <span class="rsd-score" style="color:${color}">${pct}%</span>
            <span class="rsd-label">Risk Score</span>
          </div>
        </div>
        <div class="rsd-level" style="color:${color}">${level} Risk</div>
        <p class="rsd-advice">${advice}</p>
        <div class="rsd-actions">
          ${actions.map(a => `<div class="rsd-action-item">${a}</div>`).join("")}
        </div>
      </div>
    `;
  } catch (error) {
    alert("Risk calculation failed. Please try again.");
  }
});


/* ============================================================
   7. TREND CHART (Canvas)
============================================================ */
let chartRendered = false;

async function renderTrendChart() {
  try {
    const data = await apiRequest(`/insights/${USER_ID}`);
    const cycleTrend = data.cycle_trend;
    
    const months = cycleTrend.dates || ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"];
    const cycleLengths = cycleTrend.lengths || [28, 31, 27, 33, 29, 35, 28, 32];
    const avgLine = 28;

    const canvas = document.getElementById("cycleChart");
    const ctx    = canvas.getContext("2d");

    // Responsive canvas size
    const parent = canvas.parentElement;
    canvas.width  = parent.offsetWidth;
    canvas.height = 240;

    const W = canvas.width;
    const H = canvas.height;
    const padL = 50, padR = 20, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const minVal = 20, maxVal = 40;
    const xStep = chartW / (months.length - 1);

    function toX(i)   { return padL + i * xStep; }
    function toY(val) { return padT + chartH - ((val - minVal) / (maxVal - minVal)) * chartH; }

    // Background
    ctx.clearRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let v = minVal; v <= maxVal; v += 5) {
      const y = toY(v);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(W - padR, y);
      ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.font = "11px DM Sans, sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(v + "d", padL - 6, y + 4);
    }

    // Average line (dashed)
    ctx.strokeStyle = "rgba(250,204,21,0.4)";
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padL, toY(avgLine));
    ctx.lineTo(W - padR, toY(avgLine));
    ctx.stroke();
    ctx.setLineDash([]);

    // Area gradient
    const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
    grad.addColorStop(0, "rgba(255,107,157,0.25)");
    grad.addColorStop(1, "rgba(196,77,255,0.0)");

    ctx.beginPath();
    ctx.moveTo(toX(0), toY(cycleLengths[0]));
    cycleLengths.forEach((val, i) => {
      if (i > 0) ctx.lineTo(toX(i), toY(val));
    });
    ctx.lineTo(toX(cycleLengths.length - 1), H - padB + padT);
    ctx.lineTo(toX(0), H - padB + padT);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(cycleLengths[0]));
    cycleLengths.forEach((val, i) => {
      if (i > 0) {
        const cpX = (toX(i - 1) + toX(i)) / 2;
        ctx.bezierCurveTo(cpX, toY(cycleLengths[i - 1]), cpX, toY(val), toX(i), toY(val));
      }
    });
    ctx.strokeStyle = "#ff6b9d";
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    // Data points
    cycleLengths.forEach((val, i) => {
      ctx.beginPath();
      ctx.arc(toX(i), toY(val), 5, 0, Math.PI * 2);
      ctx.fillStyle   = "#ff6b9d";
      ctx.fill();
      ctx.strokeStyle = "#080c14";
      ctx.lineWidth   = 2;
      ctx.stroke();
    });

    // Month labels
    ctx.fillStyle  = "rgba(255,255,255,0.35)";
    ctx.font       = "11px DM Sans, sans-serif";
    ctx.textAlign  = "center";
    months.forEach((m, i) => ctx.fillText(m, toX(i), H - 8));

    // Render symptom frequency bars
    const symData = [
      { label: "Acne",      pct: Math.round((data.avg_acne || 0) * 10) }, // acne_score is 0-10, so * 10 = 100%
      { label: "Mood Swings", pct: Math.round((data.avg_mood || 0) * 10) },
      { label: "Stress",    pct: Math.round((data.avg_stress || 0) * 10) },
      { label: "Weight Gain", pct: Math.round((data.avg_weight || 0) * 6.6) }, // weight_gain is ~0-15
      { label: "Hair Loss",    pct: Math.round((data.avg_hair || 0) * 20) }, // hair_loss is ~0-5
    ];

    const barsEl = document.getElementById("symptomBars");
    barsEl.innerHTML = symData.map(s => `
      <div class="sym-bar-row">
        <span class="sym-bar-label">${s.label}</span>
        <div class="sym-bar-track">
          <div class="sym-bar-fill" style="width:0%" data-pct="${s.pct}"></div>
        </div>
        <span class="sym-bar-pct">${s.pct}%</span>
      </div>
    `).join("");

    // Animate bars after short delay
    setTimeout(() => {
      barsEl.querySelectorAll(".sym-bar-fill").forEach(bar => {
        bar.style.width = bar.dataset.pct + "%";
      });
    }, 100);
  } catch (error) {
    console.error("Failed to render trend chart:", error);
  }
}


/* ============================================================
   8. SMART NOTIFICATIONS
============================================================ */
let notifications = [];

const DEMO_NOTIFS = [
  {
    type: "info",
    icon: "📅",
    title: "Period Due Soon",
    msg: "Your next period is predicted to start in 3 days. Stock up on essentials!",
  },
  {
    type: "warning",
    icon: "⚡",
    title: "Cycle Irregularity Detected",
    msg: "Your last 3 cycles have varied by more than 7 days. Consider consulting a doctor.",
  },
  {
    type: "alert",
    icon: "🔬",
    title: "Symptom Pattern Alert",
    msg: "Recurring acne + hair loss + irregular cycles detected — key PCOD indicators. Book a check-up.",
  },
  {
    type: "info",
    icon: "💊",
    title: "Fertile Window",
    msg: "You may be entering your fertile window. Track any symptoms carefully.",
  },
  {
    type: "warning",
    icon: "📈",
    title: "Elevated Risk Score",
    msg: "Your PCOD risk score has risen to Medium. Review your recent logs.",
  },
];

let demoNotifIndex = 0;

function addNotification(notif) {
  const id = Date.now();
  notifications.unshift({ ...notif, id, time: "Just now" });
  if (document.getElementById("tab-notifications").classList.contains("active")) {
    renderNotifications();
  }
  updateNotifBadge();
}

function updateNotifBadge() {
  const count = notifications.length;
  document.getElementById("notifCount").textContent =
    count + (count === 1 ? " active" : " active");
}

async function renderNotifications() {
  const list = document.getElementById("notifList");

  try {
    const data = await apiRequest(`/insights/${USER_ID}`);
    if (data.notification) {
      // Add server-side notification if it's new
      const exists = notifications.some(n => n.msg === data.notification.msg);
      if (!exists) {
        addNotification({
          type: data.notification.type || "info",
          icon: data.notification.icon || "🔔",
          title: data.notification.title || "Health Alert",
          msg: data.notification.msg,
        });
      }
    }
  } catch (error) {
    console.error("Failed to fetch notification insights:", error);
  }

  if (notifications.length === 0) {
    list.innerHTML = `<div class="log-empty">No alerts yet. They'll appear here when generated.</div>`;
    return;
  }

  list.innerHTML = notifications.map(n => `
    <div class="notif-item ${n.type}" data-id="${n.id}">
      <div class="notif-icon">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-msg">${n.msg}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      <button class="notif-dismiss" onclick="dismissNotif(${n.id})">×</button>
    </div>
  `).join("");

  updateNotifBadge();
}

// Expose to onclick
window.dismissNotif = function (id) {
  notifications = notifications.filter(n => n.id !== id);
  renderNotifications();
};

// Simulate new alert button
document.getElementById("addDemoNotif").addEventListener("click", () => {
  const notif = DEMO_NOTIFS[demoNotifIndex % DEMO_NOTIFS.length];
  demoNotifIndex++;
  addNotification(notif);
  renderNotifications();
});

// Seed 2 initial demo notifications
setTimeout(() => {
  addNotification(DEMO_NOTIFS[0]);
  addNotification(DEMO_NOTIFS[2]);
}, 500);


/* ============================================================
   9. SMOOTH SCROLL for all anchor links
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});


/* ============================================================
   10. HERO RING — animated count-up on load
============================================================ */
window.addEventListener("load", () => {
  // Animate hero stats numbers
  document.querySelectorAll(".stat-num, .sb-num").forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(10px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  setTimeout(() => {
    document.querySelectorAll(".stat-num, .sb-num").forEach((el, i) => {
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, i * 150);
    });
  }, 600);
});
