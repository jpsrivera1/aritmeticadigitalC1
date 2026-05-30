/* ═══════════════════════════════════════════════════════════
   Aritmetica Digital C1 — Lógica Interactiva
   Demo: Explicación paso a paso + Ejercicios con figuras 3D
═══════════════════════════════════════════════════════════ */

'use strict';

// ─── Estado global ────────────────────────────────────────
let currentOp       = 'suma';
let currentExercise = null;
let currentStepIdx  = 0;
let score           = 0;
let exerciseCount   = 1;
let exerciseSteps   = [];

// ─── Banco de ejercicios ──────────────────────────────────
const EXERCISES = {
  suma: [
    { a: 2, b: 3 }, { a: 4, b: 3 }, { a: 5, b: 4 },
    { a: 1, b: 7 }, { a: 3, b: 6 }, { a: 6, b: 2 },
    { a: 4, b: 5 }, { a: 7, b: 1 }
  ],
  resta: [
    { a: 7, b: 3 }, { a: 9, b: 4 }, { a: 8, b: 5 },
    { a: 6, b: 2 }, { a: 10, b: 7 }, { a: 5, b: 1 },
    { a: 8, b: 3 }, { a: 9, b: 6 }
  ],
  multiplicacion: [
    { a: 2, b: 3 }, { a: 3, b: 4 }, { a: 2, b: 5 },
    { a: 4, b: 2 }, { a: 3, b: 3 }, { a: 5, b: 2 },
    { a: 2, b: 6 }, { a: 3, b: 2 }
  ],
  division: [
    { a: 6, b: 2 }, { a: 8, b: 4 }, { a: 9, b: 3 },
    { a: 10, b: 5 }, { a: 12, b: 4 }, { a: 6, b: 3 },
    { a: 8, b: 2 }, { a: 15, b: 5 }
  ]
};

// Iconos para representar objetos en los pasos
const ICONS = {
  suma:           '⭐',
  resta:          '🍎',
  multiplicacion: '🔵',
  division:       '🍬'
};

// Etiquetas de operación
const OP_LABELS = {
  suma:           { sym: '+',  label: 'SUMA',           verb: 'más' },
  resta:          { sym: '−',  label: 'RESTA',          verb: 'menos' },
  multiplicacion: { sym: '×',  label: 'MULTIPLICACIÓN', verb: 'por' },
  division:       { sym: '÷',  label: 'DIVISIÓN',       verb: 'entre' }
};

// ─── Figuras 3D (SVG) ─────────────────────────────────────
const SHAPES = ['cubo', 'esfera', 'piramide', 'cilindro', 'cono'];

function getShapeSVG(type) {
  switch (type) {
    case 'cubo':
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="25,45 75,45 75,90 25,90" fill="#a8d400"/>
        <polygon points="5,25 55,25 75,45 25,45" fill="#c5f000"/>
        <polygon points="75,45 95,25 95,70 75,90" fill="#7faf00"/>
      </svg>`;
    case 'esfera':
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="54" r="42" fill="#d4a017"/>
        <circle cx="36" cy="38" r="13" fill="#f5c518" opacity="0.55"/>
      </svg>`;
    case 'piramide':
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,8 5,92 95,92" fill="#2d5b8a"/>
        <polygon points="50,8 95,92 72,92" fill="#1b3a5c"/>
        <ellipse cx="50" cy="92" rx="45" ry="10" fill="#163050"/>
      </svg>`;
    case 'cilindro':
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="22" y="30" width="56" height="52" fill="#a8d400"/>
        <ellipse cx="50" cy="30" rx="28" ry="10" fill="#c5f000"/>
        <ellipse cx="50" cy="82" rx="28" ry="10" fill="#7faf00"/>
      </svg>`;
    case 'cono':
      return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,8 5,92 95,92" fill="#d4a017"/>
        <polygon points="50,8 95,92 72,92" fill="#b88a10"/>
        <ellipse cx="50" cy="92" rx="45" ry="10" fill="#9a7010"/>
      </svg>`;
    default:
      return '';
  }
}

function getShapeName(type) {
  const names = {
    cubo: 'Cubo', esfera: 'Esfera', piramide: 'Pirámide',
    cilindro: 'Cilindro', cono: 'Cono'
  };
  return names[type] || type;
}

// ─── Generación de pasos de explicación ──────────────────
function generateSteps(op, a, b) {
  const icon    = ICONS[op];
  const result  = computeResult(op, a, b);
  const steps   = [];

  const repeat = (char, n) => Array(n).fill(char).join(' ');

  switch (op) {
    case 'suma':
      steps.push({
        title: `Paso 1 — Tenemos ${a} ${icon}`,
        visual: repeat(icon, a),
        desc: `Empezamos con ${a} objetos.`
      });
      steps.push({
        title: `Paso 2 — Agregamos ${b} ${icon} más`,
        visual: repeat(icon, b),
        desc: `La suma significa añadir ${b} objetos más a los que ya teníamos.`
      });
      steps.push({
        title: `Paso 3 — Contamos todo junto`,
        visual: repeat(icon, result),
        desc: `Contamos todos juntos: ${Array.from({length: result}, (_, i) => i + 1).join(' · ')}`
      });
      steps.push({
        title: `✅ Resultado`,
        visual: '',
        desc: '',
        result: `${a} + ${b} = ${result}`
      });
      break;

    case 'resta':
      steps.push({
        title: `Paso 1 — Tenemos ${a} ${icon}`,
        visual: repeat(icon, a),
        desc: `Empezamos con ${a} objetos.`
      });
      steps.push({
        title: `Paso 2 — Quitamos ${b} ${icon}`,
        visual: repeat('❌', b) + '  ' + repeat(icon, a - b),
        desc: `La resta significa quitar ${b} objetos de los que teníamos.`
      });
      steps.push({
        title: `Paso 3 — ¿Cuántos quedan?`,
        visual: repeat(icon, result),
        desc: `Después de quitar, nos quedan ${result} objetos.`
      });
      steps.push({
        title: `✅ Resultado`,
        visual: '',
        desc: '',
        result: `${a} − ${b} = ${result}`
      });
      break;

    case 'multiplicacion':
      steps.push({
        title: `Paso 1 — Multiplicar es sumar grupos iguales`,
        visual: '',
        desc: `${a} × ${b} significa tener ${a} grupos de ${b} elementos cada uno.`
      });
      {
        const grupos = Array.from({length: a}, () => `[ ${repeat(icon, b)} ]`).join('  ');
        steps.push({
          title: `Paso 2 — Formamos ${a} grupos de ${b}`,
          visual: grupos,
          desc: `Cada grupo tiene ${b} ${icon}. Tenemos ${a} grupos.`
        });
      }
      steps.push({
        title: `Paso 3 — Sumamos todos los grupos`,
        visual: repeat(icon, result),
        desc: `${Array.from({length: a}, () => b).join(' + ')} = ${result}`
      });
      steps.push({
        title: `✅ Resultado`,
        visual: '',
        desc: '',
        result: `${a} × ${b} = ${result}`
      });
      break;

    case 'division':
      steps.push({
        title: `Paso 1 — Dividir es repartir en partes iguales`,
        visual: repeat(icon, a),
        desc: `Tenemos ${a} objetos que vamos a repartir en ${b} grupos iguales.`
      });
      {
        const perGroup = result;
        const grupos   = Array.from({length: b}, (_, i) => `Grupo ${i + 1}: [ ${repeat(icon, perGroup)} ]`).join('\n');
        steps.push({
          title: `Paso 2 — Repartimos en ${b} grupos`,
          visual: grupos,
          desc: `Distribuimos los ${a} objetos equitativamente.`
        });
      }
      steps.push({
        title: `Paso 3 — ¿Cuántos hay en cada grupo?`,
        visual: repeat(icon, result),
        desc: `Cada grupo quedó con exactamente ${result} objetos.`
      });
      steps.push({
        title: `✅ Resultado`,
        visual: '',
        desc: '',
        result: `${a} ÷ ${b} = ${result}`
      });
      break;
  }

  return steps;
}

// ─── Calcular resultado ──────────────────────────────────
function computeResult(op, a, b) {
  switch (op) {
    case 'suma':           return a + b;
    case 'resta':          return a - b;
    case 'multiplicacion': return a * b;
    case 'division':       return Math.round(a / b);
  }
}

// ─── Generar opciones de figuras ─────────────────────────
function generateOptions(correctResult) {
  const wrong = generateWrongAnswers(correctResult, 2);
  const values = [correctResult, ...wrong];

  // Barajar
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  // Asignar figuras diferentes
  const shuffledShapes = [...SHAPES].sort(() => Math.random() - .5);

  return values.map((val, idx) => ({
    value:   val,
    shape:   shuffledShapes[idx % shuffledShapes.length],
    correct: val === correctResult
  }));
}

function generateWrongAnswers(correct, count) {
  const candidates = new Set();
  let delta = 1;
  while (candidates.size < count) {
    if (correct + delta > 0)  candidates.add(correct + delta);
    if (candidates.size < count && correct - delta > 0 && correct - delta !== correct)
      candidates.add(correct - delta);
    delta++;
    if (delta > 20) break; // seguridad
  }
  return [...candidates].slice(0, count);
}

// ─── Selección de operación ──────────────────────────────
function selectOp(op, btn) {
  currentOp = op;
  exerciseCount = 1;
  score = 0;

  document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  updateScoreDisplay();
  loadExercise();
}

// ─── Cargar ejercicio ────────────────────────────────────
function loadExercise() {
  const bank = EXERCISES[currentOp];
  const idx  = Math.floor(Math.random() * bank.length);
  currentExercise = { ...bank[idx] };
  currentExercise.result = computeResult(currentOp, currentExercise.a, currentExercise.b);

  exerciseSteps  = generateSteps(currentOp, currentExercise.a, currentExercise.b);
  currentStepIdx = 0;

  const info = OP_LABELS[currentOp];

  // Actualizar ecuación principal
  document.getElementById('eq-a').textContent  = currentExercise.a;
  document.getElementById('eq-op').textContent = info.sym;
  document.getElementById('eq-b').textContent  = currentExercise.b;
  document.getElementById('ex-type-badge').textContent = info.label;

  // Actualizar mini-ecuaciones
  ['mini-a','sm-a'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = currentExercise.a;
  });
  ['mini-op','sm-op'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = info.sym;
  });
  ['mini-b','sm-b'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = currentExercise.b;
  });

  document.getElementById('exercise-counter').textContent = `Ejercicio ${exerciseCount}`;

  showStep('step-problem');
}

// ─── Mostrar paso activo ─────────────────────────────────
function showStep(stepId) {
  ['step-problem', 'step-explanation', 'step-exercise'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(stepId);
  if (target) {
    target.classList.remove('hidden');
    target.style.animation = 'none';
    void target.offsetWidth;
    target.style.animation = '';
  }
}

// ─── Iniciar explicación ─────────────────────────────────
function startExplanation() {
  currentStepIdx = 0;
  renderStep();
  buildDots();
  showStep('step-explanation');
}

function renderStep() {
  const step    = exerciseSteps[currentStepIdx];
  const total   = exerciseSteps.length;
  const counter = document.getElementById('step-counter');
  const content = document.getElementById('step-content-area');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  if (counter) counter.textContent = `Paso ${currentStepIdx + 1} de ${total}`;

  // Construir HTML del paso
  let html = `<div class="step-item">
    <div class="step-title">${step.title}</div>`;

  if (step.visual) {
    html += `<div class="step-visual">${step.visual.replace(/\n/g, '<br>')}</div>`;
  }

  if (step.desc) {
    html += `<div class="step-desc">${step.desc}</div>`;
  }

  if (step.result) {
    html += `<div class="step-result">${step.result} ✅</div>`;
  }

  html += '</div>';

  if (content) content.innerHTML = html;

  // Botón anterior
  if (btnPrev) btnPrev.disabled = currentStepIdx === 0;

  // Botón siguiente — en el último paso, mostrar "Resolver"
  if (btnNext) {
    if (currentStepIdx === total - 1) {
      btnNext.textContent   = '🎯 ¡Resolver Ejercicio!';
      btnNext.classList.add('btn-solve');
      btnNext.onclick       = showExerciseStep;
    } else {
      btnNext.textContent   = 'Siguiente →';
      btnNext.classList.remove('btn-solve');
      btnNext.onclick       = nextStep;
    }
  }

  updateDots();
}

// ─── Navegación de pasos ─────────────────────────────────
function nextStep() {
  if (currentStepIdx < exerciseSteps.length - 1) {
    currentStepIdx++;
    renderStep();
  }
}

function prevStep() {
  if (currentStepIdx > 0) {
    currentStepIdx--;
    renderStep();
  }
}

// ─── Puntos de progreso ──────────────────────────────────
function buildDots() {
  const container = document.getElementById('step-dots');
  if (!container) return;
  container.innerHTML = exerciseSteps
    .map((_, i) => `<div class="dot${i === 0 ? ' active' : ''}"></div>`)
    .join('');
}

function updateDots() {
  const dots = document.querySelectorAll('#step-dots .dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentStepIdx);
  });
}

// ─── Mostrar ejercicio con figuras ───────────────────────
function showExerciseStep() {
  const options  = generateOptions(currentExercise.result);
  const container = document.getElementById('figures-row');
  const feedback  = document.getElementById('feedback-area');
  const nextWrap  = document.getElementById('next-wrap');

  if (feedback) feedback.innerHTML = '';
  if (nextWrap) nextWrap.style.display = 'none';

  if (!container) return;

  container.innerHTML = options.map((opt, idx) => `
    <div class="figure-option" id="fig-opt-${idx}" onclick="checkAnswer(${idx}, ${opt.correct})">
      ${getShapeSVG(opt.shape)}
      <div class="figure-value">${opt.value}</div>
      <div style="font-size:.72rem;color:rgba(255,255,255,.45);font-weight:700;margin-top:2px;">
        ${getShapeName(opt.shape)}
      </div>
    </div>
  `).join('');

  showStep('step-exercise');
}

// ─── Comprobar respuesta ─────────────────────────────────
function checkAnswer(idx, isCorrect) {
  const feedback = document.getElementById('feedback-area');
  const nextWrap = document.getElementById('next-wrap');

  // Deshabilitar todos los botones
  document.querySelectorAll('.figure-option').forEach(el => {
    el.classList.add('disabled-opt');
  });

  const selected = document.getElementById(`fig-opt-${idx}`);

  if (isCorrect) {
    selected.classList.add('correct');
    score += 10;
    updateScoreDisplay();
    if (feedback) {
      feedback.innerHTML = `<span class="feedback-correct">¡Correcto! +10 ⭐</span>`;
    }
  } else {
    selected.classList.add('wrong');
    // Resaltar la correcta
    document.querySelectorAll('.figure-option').forEach(el => {
      const val  = parseInt(el.querySelector('.figure-value').textContent, 10);
      if (val === currentExercise.result) el.classList.add('correct');
    });
    if (feedback) {
      feedback.innerHTML = `<span class="feedback-wrong">¡Inténtalo de nuevo la próxima vez! 💪</span>`;
    }
  }

  if (nextWrap) nextWrap.style.display = 'block';
}

// ─── Siguiente ejercicio ─────────────────────────────────
function loadNextExercise() {
  exerciseCount++;
  loadExercise();
}

// ─── Actualizar marcador ─────────────────────────────────
function updateScoreDisplay() {
  const el = document.getElementById('score-display');
  if (el) el.textContent = `${score} ⭐`;
}

// ─── Scroll suave ────────────────────────────────────────
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ─── Navbar responsive ──────────────────────────────────
function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Cerrar al hacer clic en un enlace
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // Añadir sombra al hacer scroll
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 4px 20px rgba(0,0,0,.35)'
        : 'none';
    }
  }, { passive: true });
}

// ─── Slideshow de fondo del Hero ────────────────────────
function initHeroSlideshow() {
  const slides = document.querySelectorAll('#hero-slideshow .slide');
  if (!slides.length) return;

  let current = 0;

  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 4000);
}

// ─── Inicialización ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlideshow();
  loadExercise();
});
