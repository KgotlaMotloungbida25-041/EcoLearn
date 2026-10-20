/* =========================================================
   EcoLearn — script.js  (vanilla JavaScript only)
   Sections: 1 Data | 2 Helpers | 3 Storage | 4 Theme/Nav |
             5 Learn | 6 Daily tip | 7 Game | 8 Calendar |
             9 Quiz | 10 Dashboard | 11 Init
   ========================================================= */
"use strict";

/* =========================================================
   1. DATA (kept separate from rendering code)
   To customise the site, edit the arrays in this section.
   ========================================================= */
const STORAGE_KEY = "ecolearn.progress.v1";
const THEME_KEY = "ecolearn.theme";
const POINTS_PER_CORRECT = 10;   // quiz points for each correct answer
const GAME_POINTS = 10;          // game points for each correct answer
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// ---- The 5 Rs ----
const FIVE_RS = [
  { icon: "🚫", title: "Refuse", text: "Say no to products and packaging you do not need before they become waste.", example: "Politely decline a free plastic bag or a flyer you will not read." },
  { icon: "📉", title: "Reduce", text: "Use and buy less, so there is less to throw away in the first place.", example: "Buy only the food you will eat and choose items with less packaging." },
  { icon: "🔁", title: "Reuse", text: "Use things again, for the same purpose, instead of throwing them away after one use.", example: "Refill a water bottle or use both sides of a sheet of paper." },
  { icon: "🎨", title: "Repurpose", text: "Give an item a new job when it can no longer do its original one.", example: "Turn a clean glass jar into a pencil holder or a seed pot." },
  { icon: "♻", title: "Recycle", text: "Sort suitable materials so they can be processed into new products.", example: "Place clean, accepted paper, metal or plastic in the correct recycling bin." }
];

// ---- Types of waste ----
const WASTE_TYPES = [
  { icon: "🍌", name: "Organic waste", examples: "Fruit and vegetable peelings, leftover food, garden clippings.", handling: "Compost where facilities exist, or use a food-waste or garden-waste collection. Keep it out of recycling bins." },
  { icon: "📰", name: "Paper and cardboard", examples: "Newspapers, notebooks, office paper, cardboard boxes.", handling: "Keep it clean and dry, flatten boxes, and place it in paper recycling. Food-soiled paper is often not accepted." },
  { icon: "🥤", name: "Plastic", examples: "Drink bottles, food containers, plastic bags and wrappers.", handling: "Check which plastic types your local provider accepts. Rinse containers if required. Plastic bags and films often need special drop-off points." },
  { icon: "🫙", name: "Glass", examples: "Jars and bottles.", handling: "Empty and rinse jars and bottles, then use glass recycling bins or bottle banks. Window glass, mirrors and cookware are usually handled differently." },
  { icon: "🥫", name: "Metal", examples: "Aluminium drink cans, steel food cans, metal lids.", handling: "Empty and rinse, then place in metal or mixed recycling according to local rules." },
  { icon: "📱", name: "Electronic waste", examples: "Old phones, chargers, laptops, cables, headphones.", handling: "Do not put it in general bins. Use e-waste collection points, retailer take-back schemes, or repair and donate it if it still works." },
  { icon: "🧪", name: "Hazardous household waste", examples: "Batteries, paint, cleaning chemicals, light bulbs, aerosol cans with contents.", handling: "Never pour down drains or put in regular bins. Take it to a household hazardous waste collection point or follow your local provider's instructions." }
];

// ---- Why it matters ----
const BENEFITS = [
  { icon: "🌫", title: "Reduces pollution", text: "Proper disposal keeps litter and harmful substances out of soil, air and water." },
  { icon: "🌲", title: "Conserves natural resources", text: "Reusing and recycling materials reduces the need to extract and process new ones." },
  { icon: "🐢", title: "Protects wildlife", text: "Less litter means fewer animals eating or becoming tangled in discarded items." },
  { icon: "⛰", title: "Reduces landfill waste", text: "Diverting reusable, recyclable and compostable items leaves less material to bury." },
  { icon: "🏫", title: "Supports cleaner learning spaces", text: "Well-managed waste keeps classrooms, campuses and neighbourhoods pleasant to use." },
  { icon: "🛒", title: "Encourages responsible consumption", text: "Thinking about what happens to products after use leads to wiser buying choices." }
];

// ---- Practical student tips (with ids for saving completion) ----
const STUDENT_TIPS = [
  { id: "tip-bottle", icon: "🚰", title: "Carry a reusable water bottle", text: "Refill it at school, university or home instead of buying single-use bottles." },
  { id: "tip-bags", icon: "🛍", title: "Use reusable shopping bags", text: "Keep a foldable bag in your backpack so you are always ready." },
  { id: "tip-plastics", icon: "🥡", title: "Avoid unnecessary single-use plastics", text: "Say no to extra straws, cutlery and wrappers when you do not need them." },
  { id: "tip-notebooks", icon: "📓", title: "Reuse notebooks", text: "Use leftover blank pages for rough work before buying a new notebook." },
  { id: "tip-print", icon: "🖨", title: "Print only when necessary", text: "Read on screen when you can, and print double-sided when you must." },
  { id: "tip-separate", icon: "🗂", title: "Separate recyclable materials", text: "Sort paper, plastic, metal and glass using the bins available to you." },
  { id: "tip-digital", icon: "💻", title: "Use digital notes where practical", text: "Typed notes and shared documents can replace some paper handouts." },
  { id: "tip-clean", icon: "🧹", title: "Keep classrooms and campus spaces clean", text: "Put litter in a bin and tidy up shared spaces after you use them." },
  { id: "tip-activity", icon: "🤝", title: "Organise a school recycling activity", text: "Team up with classmates to run a collection day or a sorting station." },
  { id: "tip-compost", icon: "🌱", title: "Compost suitable food scraps", text: "Where composting facilities exist, add fruit and vegetable scraps instead of binning them." }
];

// ---- Daily tips (one is picked per calendar day) ----
const DAILY_TIPS = [
  "Bring a reusable bottle instead of buying bottled water.",
  "Avoid printing documents when a digital version is enough.",
  "Reuse paper for rough notes when appropriate.",
  "Separate your waste according to your local recycling rules.",
  "Donate or repair usable items instead of discarding them.",
  "Carry a reusable bag so you do not need a new one at the shop.",
  "Plan your meals so less food goes to waste.",
  "Check whether a container needs rinsing before you recycle it.",
  "Say no to single-use cutlery when you have your own.",
  "Take old batteries and electronics to a proper collection point.",
  "Borrow or share items you only need once, such as books or tools.",
  "Use both sides of the paper before recycling it.",
  "Pick up three pieces of litter you see and place them in a bin.",
  "Choose products with less packaging when you have the option."
];

// ---- Eco Calendar events ----
// rule.month is 0-based (0 = January ... 11 = December).
// rule types:
//   "fixed"      -> same day every year (month + day)
//   "nthWeekday" -> e.g. first Monday of a month (month + weekday [0=Sun..6=Sat] + nth)
// approximate:true means the real date changes each year and is only ESTIMATED here.
const ECO_EVENTS = [
  {
    id: "wetlands", icon: "🦆", name: "World Wetlands Day", rule: { type: "fixed", month: 1, day: 2 }, ruleText: "Every year on 2 February",
    significance: "Wetlands clean water, store floodwater and shelter wildlife. Litter and pollution can damage them.",
    activity: "Pick up litter near a local drain, stream or pond and find out which wetlands are near you."
  },
  {
    id: "zerowaste", icon: "🗑", name: "International Day of Zero Waste", rule: { type: "fixed", month: 2, day: 30 }, ruleText: "Every year on 30 March",
    significance: "A United Nations day that promotes waste prevention and more responsible consumption and production.",
    activity: "Do a one-day “zero waste” challenge: bring your own bottle, bag and lunch container."
  },
  {
    id: "earth", icon: "🌍", name: "Earth Day", rule: { type: "fixed", month: 3, day: 22 }, ruleText: "Every year on 22 April",
    significance: "A global day for environmental action and awareness of how people can protect the planet.",
    activity: "Plan a campus cleanup or start a recycling campaign at your school."
  },
  {
    id: "environment", icon: "🌿", name: "World Environment Day", rule: { type: "fixed", month: 5, day: 5 }, ruleText: "Every year on 5 June",
    significance: "The United Nations' main day for encouraging environmental awareness and action.",
    activity: "Plant a tree or seedling, or run an awareness poster competition in your class."
  },
  {
    id: "cleanup", icon: "🧤", name: "World Cleanup Day", rule: { type: "nthWeekday", month: 8, weekday: 6, nth: 3 }, ruleText: "Date changes each year (usually in September)", approximate: true,
    significance: "A worldwide volunteer effort to clean up litter and raise awareness of waste.",
    activity: "Join or organise a litter-pick on your campus or in your neighbourhood.",
    note: "Estimated as the third Saturday of September, which matches recent years. Confirm the official date at worldcleanupday.org and update this event if it differs."
  },
  {
    id: "cleanair", icon: "🌤", name: "International Day of Clean Air for Blue Skies", rule: { type: "fixed", month: 8, day: 7 }, ruleText: "Every year on 7 September",
    significance: "Highlights the importance of clean air for health and the environment. Burning waste is one source of air pollution.",
    activity: "Walk, cycle or share a ride to school for the day, and never burn rubbish."
  },
  {
    id: "habitat", icon: "🏘", name: "World Habitat Day", rule: { type: "nthWeekday", month: 9, weekday: 1, nth: 1 }, ruleText: "First Monday of October",
    significance: "Reflects on the state of towns and cities and everyone's right to adequate shelter. Clean, well-managed neighbourhoods are part of this.",
    activity: "Map the waste bins on your campus and suggest where more are needed."
  },
  {
    id: "recycles", icon: "♻", name: "America Recycles Day", rule: { type: "fixed", month: 10, day: 15 }, ruleText: "Every year on 15 November",
    significance: "An annual day in the United States that encourages people to recycle and buy recycled products.",
    activity: "Check which items your local recycling programme accepts and make a poster for your class.",
    note: "Mainly observed in the United States, but students anywhere can join in."
  }
];

// ---- Waste sorting game ----
const WASTE_CATEGORIES = ["Organic waste", "Paper and cardboard", "Plastic", "Glass", "Metal", "Electronic waste", "Hazardous waste"];

const WASTE_ITEMS = [
  { emoji: "🍼", name: "Plastic bottle", category: "Plastic", explanation: "Clean plastic bottles are commonly recycled.", local: "Which plastic types are accepted, and whether caps stay on, varies by location." },
  { emoji: "🍌", name: "Banana peel", category: "Organic waste", explanation: "Fruit peel is food waste that can be composted where facilities exist." },
  { emoji: "📰", name: "Newspaper", category: "Paper and cardboard", explanation: "Clean, dry newspaper is normally collected for paper recycling." },
  { emoji: "🥫", name: "Aluminium drink can", category: "Metal", explanation: "Aluminium cans are metal and can be recycled again and again." },
  { emoji: "📱", name: "Broken electronic device", category: "Electronic waste", explanation: "Electronics should go to an e-waste collection point or take-back scheme, not a general bin." },
  { emoji: "🫙", name: "Glass jar", category: "Glass", explanation: "Empty glass jars can be recycled in glass collection.", local: "Some areas need lids removed or colours separated, so check your local rules." },
  { emoji: "🔋", name: "Used batteries", category: "Hazardous waste", explanation: "Batteries contain materials that should not go in general waste. Use a battery drop-off point." },
  { emoji: "📦", name: "Clean cardboard box", category: "Paper and cardboard", explanation: "Flattened, clean and dry cardboard is widely recycled." },
  { emoji: "🎨", name: "Leftover paint tin", category: "Hazardous waste", explanation: "Paint with contents is household hazardous waste and needs a special collection point." },
  { emoji: "🥫", name: "Empty steel food can", category: "Metal", explanation: "Steel food cans are metal. Empty and rinse them first, if your local rules ask for this." },
  { emoji: "🍎", name: "Apple core", category: "Organic waste", explanation: "Fruit scraps are organic waste. Compost them or use a food-waste collection if available." },
  { emoji: "🔌", name: "Broken phone charger", category: "Electronic waste", explanation: "Cables and chargers are electronic waste. Take them to an e-waste drop-off." },
  { emoji: "🛍", name: "Plastic shopping bag", category: "Plastic", explanation: "Plastic bags are plastic, but they are handled differently from bottles.", local: "Many kerbside programmes do not accept them. Some shops have drop-off points. Reusing them is better." }
];

// ---- Quiz questions (answer = index of the correct option) ----
const QUIZ_QUESTIONS = [
  { q: "Which of the 5 Rs means saying no to unnecessary items and packaging?", options: ["Recycle", "Refuse", "Repurpose", "Reuse"], answer: 1, explanation: "Refuse comes first: avoiding something unneeded prevents waste before it exists." },
  { q: "Turning an empty glass jar into a pencil holder is an example of which R?", options: ["Repurpose", "Refuse", "Recycle", "Reduce"], answer: 0, explanation: "Repurposing gives an item a new use rather than sending it to be processed." },
  { q: "Refilling a water bottle instead of buying a new one each day is an example of:", options: ["Recycling", "Composting", "Reusing", "Landfilling"], answer: 2, explanation: "Reuse means using the same item again for the same purpose." },
  { q: "Which item is most suitable for composting where facilities exist?", options: ["Vegetable peelings", "A plastic bottle", "A used battery", "A glass jar"], answer: 0, explanation: "Fruit and vegetable scraps are organic waste that can break down into compost." },
  { q: "Why should used batteries not go in the general rubbish bin?", options: ["They are too heavy", "They are hazardous waste", "They are made of paper", "They cannot be collected"], answer: 1, explanation: "Batteries contain materials that can harm people and the environment if disposed of carelessly." },
  { q: "If you are unsure whether an item can be recycled, what should you do first?", options: ["Put it in any recycling bin", "Burn it", "Check your school's or local provider's guidelines", "Bury it"], answer: 2, explanation: "Recycling rules differ by location, so local guidelines are the best source." },
  { q: "Which habit best helps reduce single-use plastic?", options: ["Buying a new bottle daily", "Carrying a reusable bottle", "Using extra plastic bags", "Choosing more packaging"], answer: 1, explanation: "A reusable bottle replaces many single-use bottles over time." },
  { q: "What is the best way to dispose of an old broken phone?", options: ["General rubbish bin", "Compost heap", "An e-waste collection point or take-back scheme", "Glass recycling bin"], answer: 2, explanation: "Electronic waste needs specialist handling so materials can be recovered and harmful parts managed." },
  { q: "Why might you be asked to empty and rinse food containers before recycling?", options: ["Food residue can contaminate recyclable materials", "It makes them heavier", "It changes their colour", "Rinsing is never needed"], answer: 0, explanation: "Leftover food can spoil other recyclables, although the exact rules depend on your local provider." },
  { q: "How does reducing waste help with landfill?", options: ["It makes landfills larger", "It means less material needs to be buried", "It has no effect", "It only helps in cities"], answer: 1, explanation: "Waste that is avoided, reused, recycled or composted does not need to be sent to landfill." },
  { q: "On which date is World Environment Day observed each year?", options: ["22 April", "30 March", "15 November", "5 June"], answer: 3, explanation: "World Environment Day is on 5 June. Earth Day is on 22 April." },
  { q: "Earth Day is observed on:", options: ["2 February", "22 April", "7 September", "5 June"], answer: 1, explanation: "Earth Day falls on 22 April every year." },
  { q: "The International Day of Zero Waste is observed on:", options: ["30 March", "5 June", "22 April", "2 February"], answer: 0, explanation: "30 March is the UN's International Day of Zero Waste." },
  { q: "Which of these is generally suitable for paper recycling?", options: ["A greasy food wrapper", "A clean, dry newspaper", "A used tissue", "A broken mirror"], answer: 1, explanation: "Clean, dry paper can usually be recycled. Food-soiled or tissue paper often cannot." },
  { q: "How can litter harm wildlife?", options: ["Animals may swallow it or become tangled in it", "It makes animals grow faster", "It has no effect on animals", "It only affects plants"], answer: 0, explanation: "Animals can mistake litter for food or get trapped, which can injure or kill them." },
  { q: "Which action is the best example of 'Reduce'?", options: ["Throwing away a half-used notebook", "Buying only what you will actually use", "Burning rubbish", "Buying items with extra packaging"], answer: 1, explanation: "Reducing means consuming less so that less waste is created." },
  { q: "Which of the following counts as hazardous household waste?", options: ["Newspaper", "Banana peel", "Leftover paint", "Cardboard box"], answer: 2, explanation: "Paint and many chemicals need a hazardous waste collection point." },
  { q: "What can happen if litter is dropped near a drain?", options: ["It disappears harmlessly", "It can be washed into waterways", "It turns into compost", "It becomes a new product"], answer: 1, explanation: "Drains often lead to rivers and seas, so litter can travel and pollute water." }
];

// ---- Achievement levels (sorted by min percent; no gaps or overlaps) ----
// A student gets the highest level whose "min" is <= their percentage.
const ACHIEVEMENTS = [
  { min: 0, name: "Eco Beginner", message: "Every expert starts somewhere. Review the Learn section and try again!" },
  { min: 40, name: "Green Learner", message: "You are learning fast. Keep exploring the waste guide to boost your score." },
  { min: 60, name: "Eco Enthusiast", message: "Great work! You know plenty about caring for the environment." },
  { min: 80, name: "Sustainability Champion", message: "Excellent! You clearly understand waste management well." },
  { min: 100, name: "Eco Master", message: "Perfect score! You are a true Eco Master. Share what you know with others!" }
];

// ---- Self-tracking checklist ----
const CHECKLIST_ITEMS = [
  { id: "chk-bottle", label: "I carried a reusable water bottle." },
  { id: "chk-packaging", label: "I avoided unnecessary packaging." },
  { id: "chk-separate", label: "I separated recyclable materials correctly." },
  { id: "chk-reuse", label: "I reused an item instead of discarding it." },
  { id: "chk-activity", label: "I participated in an environmental activity." }
];

/* =========================================================
   2. HELPERS
   ========================================================= */
function $(id) { return document.getElementById(id); }

// Create an element safely (uses textContent, never innerHTML)
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// Fisher-Yates shuffle that returns a new array
function shuffle(arr) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startOfDay(date) { return new Date(date.getFullYear(), date.getMonth(), date.getDate()); }

function pad(n) { return String(n).padStart(2, "0"); }

// "2026-10-20" — used for the daily tip and its completion id
function dateKey(date) { return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()); }

function formatDate(date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

function formatPercent(p) { return String(Math.round(p * 10) / 10); }

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Find the achievement for a percentage (0-100)
function getAchievement(percent) {
  let result = ACHIEVEMENTS[0];
  ACHIEVEMENTS.forEach(function (a) { if (percent >= a.min) result = a; });
  return result;
}

// Dev safety net: warn in the console if data is malformed
function validateData() {
  QUIZ_QUESTIONS.forEach(function (item, i) {
    if (!item.q || !Array.isArray(item.options) || item.options.length !== 4 ||
      !Number.isInteger(item.answer) || item.answer < 0 || item.answer > 3 || !item.explanation) {
      console.error("Quiz question " + (i + 1) + " is malformed.");
    }
  });
  WASTE_ITEMS.forEach(function (item) {
    if (WASTE_CATEGORIES.indexOf(item.category) === -1) console.error("Unknown waste category for: " + item.name);
  });
}

/* =========================================================
   3. STORAGE (saveProgress / loadProgress)
   ========================================================= */
let storageWorks = true;

function defaultProgress() {
  return {
    totalPoints: 0,        // lifetime quiz points (added once per completed quiz)
    bestScore: 0,          // best single-quiz score in points
    bestPercent: 0,        // best single-quiz percentage
    quizzesCompleted: 0,
    level: "",             // name of best achievement level
    savedEvents: [],       // event ids
    tipsDone: [],          // tip ids (practical tips + "daily-YYYY-MM-DD")
    checklist: {},         // { checklistId: true }
    gameBest: 0            // best score in the sorting game
  };
}

function safeNumber(value) {
  return (typeof value === "number" && isFinite(value) && value >= 0) ? value : 0;
}

function safeStringArray(value) {
  return Array.isArray(value) ? value.filter(function (v) { return typeof v === "string"; }) : [];
}

// Read saved data and fix anything missing or invalid
function loadProgress() {
  const fresh = defaultProgress();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fresh;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return fresh;
    fresh.totalPoints = safeNumber(data.totalPoints);
    fresh.bestScore = safeNumber(data.bestScore);
    fresh.bestPercent = Math.min(100, safeNumber(data.bestPercent));
    fresh.quizzesCompleted = Math.floor(safeNumber(data.quizzesCompleted));
    fresh.level = typeof data.level === "string" ? data.level : "";
    fresh.savedEvents = safeStringArray(data.savedEvents);
    fresh.tipsDone = safeStringArray(data.tipsDone);
    fresh.gameBest = safeNumber(data.gameBest);
    if (data.checklist && typeof data.checklist === "object" && !Array.isArray(data.checklist)) {
      Object.keys(data.checklist).forEach(function (key) {
        if (data.checklist[key] === true) fresh.checklist[key] = true;
      });
    }
  } catch (err) {
    storageWorks = false;
    console.warn("Could not read saved progress:", err);
  }
  return fresh;
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    storageWorks = false;
    console.warn("Could not save progress:", err);
  }
}

let progress = loadProgress();

/* =========================================================
   4. THEME & NAVIGATION
   ========================================================= */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const dark = theme === "dark";
  const btn = $("theme-toggle");
  btn.setAttribute("aria-pressed", String(dark));
  btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  $("theme-icon").textContent = dark ? "☀" : "☾";
}

function toggleDarkMode() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
}

function loadTheme() {
  let theme = null;
  try { theme = localStorage.getItem(THEME_KEY); } catch (err) { /* ignore */ }
  if (theme !== "dark" && theme !== "light") {
    theme = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  applyTheme(theme);
}

function setMenuOpen(open) {
  $("nav-list").classList.toggle("open", open);
  const btn = $("menu-toggle");
  btn.setAttribute("aria-expanded", String(open));
  btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

// Highlight the nav link of the section currently in view
function setupActiveNav() {
  const links = document.querySelectorAll(".nav-link");
  const map = {};
  links.forEach(function (link) { map[link.getAttribute("href").slice(1)] = link; });
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && map[entry.target.id]) {
        links.forEach(function (l) { l.classList.remove("active"); l.removeAttribute("aria-current"); });
        map[entry.target.id].classList.add("active");
        map[entry.target.id].setAttribute("aria-current", "true");
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  Object.keys(map).forEach(function (id) {
    const section = $(id);
    if (section) observer.observe(section);
  });
}

// If an external image fails, swap it for a friendly emoji panel
function setupImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    function useFallback() {
      if (!img.parentNode) return;
      const box = el("div", "img-fallback", img.getAttribute("data-fallback"));
      box.setAttribute("role", "img");
      box.setAttribute("aria-label", img.alt);
      img.replaceWith(box);
    }
    img.addEventListener("error", useFallback, { once: true });
    if (img.complete && img.naturalWidth === 0) useFallback();
  });
}

/* =========================================================
   5. LEARN SECTION RENDERING
   ========================================================= */
function renderFiveRs() {
  const grid = $("rs-grid");
  grid.textContent = "";
  FIVE_RS.forEach(function (r) {
    const card = el("article", "card r-card");
    card.append(el("div", "card-icon", r.icon), el("h3", "", r.title), el("p", "", r.text), el("p", "example", "Example: " + r.example));
    grid.append(card);
  });
}

function renderBenefits() {
  const list = $("benefits-grid");
  list.textContent = "";
  BENEFITS.forEach(function (b) {
    const row = el("div", "benefit");
    const body = el("div");
    body.append(el("h4", "", b.title), el("p", "", b.text));
    row.append(el("span", "benefit-icon", b.icon), body);
    list.append(row);
  });
}

function renderWasteTypes() {
  const list = $("waste-types-list");
  list.textContent = "";
  WASTE_TYPES.forEach(function (type) {
    const details = el("details", "waste-type");
    const summary = el("summary");
    summary.append(el("span", "", type.icon), el("span", "", type.name));
    const body = el("div", "waste-type-body");
    const p1 = el("p"); p1.append(el("strong", "", "Examples: "), document.createTextNode(type.examples));
    const p2 = el("p"); p2.append(el("strong", "", "How to handle it: "), document.createTextNode(type.handling));
    body.append(p1, p2);
    details.append(summary, body);
    list.append(details);
  });
}

function renderStudentTips() {
  const grid = $("tips-grid");
  grid.textContent = "";
  STUDENT_TIPS.forEach(function (tip) {
    const done = progress.tipsDone.includes(tip.id);
    const card = el("article", "card tip-card" + (done ? " done" : ""));
    const btn = el("button", "btn btn-small " + (done ? "btn-primary" : "btn-outline"), done ? "✓ Done" : "Mark as done");
    btn.type = "button";
    btn.dataset.tipId = tip.id;
    btn.setAttribute("aria-pressed", String(done));
    btn.setAttribute("aria-label", (done ? "Unmark tip as done: " : "Mark tip as done: ") + tip.title);
    card.append(el("div", "card-icon", tip.icon), el("h3", "", tip.title), el("p", "", tip.text), btn);
    grid.append(card);
  });
  const count = STUDENT_TIPS.filter(function (t) { return progress.tipsDone.includes(t.id); }).length;
  $("tips-summary").textContent = count + " of " + STUDENT_TIPS.length + " tips marked as done";
}

// Add or remove a tip id from the completed list
function toggleTipDone(tipId) {
  const index = progress.tipsDone.indexOf(tipId);
  if (index === -1) progress.tipsDone.push(tipId);
  else progress.tipsDone.splice(index, 1);
  saveProgress();
}

function handleTipGridClick(event) {
  const btn = event.target.closest("button[data-tip-id]");
  if (!btn) return;
  const id = btn.dataset.tipId;
  toggleTipDone(id);
  renderStudentTips();
  updateDashboard();
  const again = document.querySelector('button[data-tip-id="' + id + '"]');
  if (again) again.focus();
}

/* =========================================================
   6. DAILY TIP
   ========================================================= */
// Same tip all day: the index depends only on the local calendar date
function getDailyTip(date) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY);
  return DAILY_TIPS[day % DAILY_TIPS.length];
}

function renderDailyTip() {
  const today = new Date();
  const id = "daily-" + dateKey(today);
  const done = progress.tipsDone.includes(id);
  $("daily-tip-date").textContent = today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  $("daily-tip-text").textContent = getDailyTip(today);
  const btn = $("daily-tip-btn");
  btn.textContent = done ? "✓ Done today" : "Mark as done";
  btn.setAttribute("aria-pressed", String(done));
}

function handleDailyTipClick() {
  toggleTipDone("daily-" + dateKey(new Date()));
  renderDailyTip();
  updateDashboard();
}

/* =========================================================
   7. WASTE SORTING GAME  ("Where Does It Go?")
   ========================================================= */
const game = { order: [], index: 0, score: 0, answered: false, finished: false, choices: [] };

// Start or restart the game
function renderWasteSortingGame() {
  game.order = shuffle(WASTE_ITEMS);
  game.index = 0;
  game.score = 0;
  game.answered = false;
  game.finished = false;
  $("game-play").hidden = false;
  $("game-result").hidden = true;
  showGameItem();
}

function showGameItem() {
  const item = game.order[game.index];
  game.answered = false;
  // Four choices: the right category plus three random wrong ones, shuffled
  const wrong = shuffle(WASTE_CATEGORIES.filter(function (c) { return c !== item.category; })).slice(0, 3);
  game.choices = shuffle([item.category].concat(wrong));

  $("game-progress").textContent = "Item " + (game.index + 1) + " of " + game.order.length;
  $("game-emoji").textContent = item.emoji;
  $("game-name").textContent = item.name;
  $("game-score").textContent = game.score;
  $("game-best").textContent = progress.gameBest;

  const options = $("game-options");
  options.textContent = "";
  game.choices.forEach(function (choice) {
    const btn = el("button", "option-btn", choice);
    btn.type = "button";
    btn.dataset.choice = choice;
    options.append(btn);
  });
  const feedback = $("game-feedback");
  feedback.hidden = true;
  feedback.textContent = "";
  $("game-next").hidden = true;
}

function checkWasteAnswer(choice) {
  if (game.finished || game.answered) return; // blocks double scoring
  game.answered = true;
  const item = game.order[game.index];
  const correct = choice === item.category;
  if (correct) game.score += GAME_POINTS;

  document.querySelectorAll("#game-options .option-btn").forEach(function (btn) {
    btn.disabled = true;
    if (btn.dataset.choice === item.category) btn.classList.add("correct");
    else if (btn.dataset.choice === choice) btn.classList.add("incorrect");
  });

  const feedback = $("game-feedback");
  feedback.textContent = "";
  feedback.className = "feedback " + (correct ? "good" : "bad");
  feedback.append(el("p", "", correct ? "Correct! +" + GAME_POINTS + " points." : "Not quite. The best answer is: " + item.category + "."));
  feedback.append(el("p", "", item.explanation));
  if (item.local) feedback.append(el("p", "", "📍 Local rules vary: " + item.local));
  feedback.hidden = false;

  $("game-score").textContent = game.score;
  const next = $("game-next");
  next.textContent = game.index === game.order.length - 1 ? "See results" : "Next item";
  next.hidden = false;
  next.focus();
}

function nextWasteItem() {
  if (!game.answered) return;
  if (game.index < game.order.length - 1) {
    game.index++;
    showGameItem();
  } else {
    finishWasteGame();
  }
}

function finishWasteGame() {
  game.finished = true;
  const max = game.order.length * GAME_POINTS;
  if (game.score > progress.gameBest) { progress.gameBest = game.score; saveProgress(); }
  $("game-best").textContent = progress.gameBest;
  $("game-play").hidden = true;
  $("game-result").hidden = false;
  $("game-result-text").textContent = "You scored " + game.score + " out of " + max + " points. Remember: always check your local recycling rules.";
}

/* =========================================================
   8. ECO CALENDAR
   ========================================================= */
// Date of the n-th given weekday in a month (weekday 0=Sun ... 6=Sat)
function nthWeekdayOfMonth(year, month, weekday, nth) {
  const first = new Date(year, month, 1);
  const offset = (7 + weekday - first.getDay()) % 7;
  return new Date(year, month, 1 + offset + (nth - 1) * 7);
}

// Date of an event in a given year, following its rule
function eventDateInYear(event, year) {
  const rule = event.rule;
  if (rule.type === "fixed") return new Date(year, rule.month, rule.day);
  return nthWeekdayOfMonth(year, rule.month, rule.weekday, rule.nth);
}

// Next occurrence (today counts) and days remaining
function calculateNextEcoEvent(event, today) {
  const now = startOfDay(today || new Date());
  let date = eventDateInYear(event, now.getFullYear());
  if (date < now) date = eventDateInYear(event, now.getFullYear() + 1); // rolls over to next year
  const daysUntil = Math.round((date - now) / MS_PER_DAY);
  return { event: event, date: date, daysUntil: daysUntil, isToday: daysUntil === 0 };
}

function getUpcomingEvents() {
  const now = new Date();
  return ECO_EVENTS.map(function (e) { return calculateNextEcoEvent(e, now); })
    .sort(function (a, b) { return a.daysUntil - b.daysUntil; });
}

function countdownText(info) {
  if (info.isToday) return "Today!";
  if (info.daysUntil === 1) return "Tomorrow";
  return "In " + info.daysUntil + " days";
}

function renderEcoEvents() {
  const upcoming = getUpcomingEvents();
  const grid = $("eco-events-grid");
  grid.textContent = "";

  upcoming.forEach(function (info) {
    const ev = info.event;
    const saved = progress.savedEvents.includes(ev.id);
    const card = el("article", "card event-card" + (info.isToday ? " is-today" : ""));

    const top = el("div", "event-top");
    top.append(el("span", "event-icon", ev.icon), el("span", "countdown", countdownText(info)));

    const dateText = formatDate(info.date) + (ev.approximate ? " (estimated)" : "");
    card.append(top, el("h3", "", ev.name), el("p", "event-date", dateText), el("p", "muted", ev.ruleText), el("p", "", ev.significance));
    if (ev.note) card.append(el("p", "event-note", ev.note));
    card.append(el("p", "event-activity", "💡 Try this: " + ev.activity));

    const btn = el("button", "btn btn-small save-btn " + (saved ? "btn-primary" : "btn-outline"), saved ? "★ Saved" : "☆ Save event");
    btn.type = "button";
    btn.dataset.eventId = ev.id;
    btn.setAttribute("aria-pressed", String(saved));
    btn.setAttribute("aria-label", (saved ? "Remove from my eco events: " : "Save to my eco events: ") + ev.name);
    card.append(btn);
    grid.append(card);
  });

  renderMyEvents(upcoming);
  renderEcoBanner(upcoming);
}

// Banner for the next upcoming event
function renderEcoBanner(upcoming) {
  const list = upcoming || getUpcomingEvents();
  const next = list[0];
  const banner = $("eco-banner");
  if (!next || bannerDismissed) { banner.hidden = true; return; }
  const ev = next.event;
  let text;
  if (next.isToday) text = ev.name + " is today! " + ev.activity;
  else if (next.daysUntil === 1) text = ev.name + " is tomorrow! " + ev.activity;
  else text = ev.name + " is coming up in " + next.daysUntil + " days! " + ev.activity;
  if (ev.approximate) text += " (Date estimated — check the official date.)";
  $("eco-banner-text").textContent = text;
  banner.classList.toggle("is-today", next.isToday);
  banner.hidden = false;
}

function renderMyEvents(upcoming) {
  const list = upcoming || getUpcomingEvents();
  const saved = list.filter(function (i) { return progress.savedEvents.includes(i.event.id); });
  const ul = $("my-events-list");
  ul.textContent = "";
  $("my-events-empty").hidden = saved.length > 0;
  saved.forEach(function (info) {
    const li = el("li");
    const infoBox = el("div", "saved-info");
    infoBox.append(el("strong", "", info.event.icon + " " + info.event.name),
      el("small", "", formatDate(info.date) + (info.event.approximate ? " (estimated)" : "") + " · " + countdownText(info)));
    const remove = el("button", "btn btn-small btn-outline", "Remove");
    remove.type = "button";
    remove.dataset.removeEvent = info.event.id;
    remove.setAttribute("aria-label", "Remove " + info.event.name + " from my eco events");
    li.append(infoBox, remove);
    ul.append(li);
  });
}

function toggleSavedEvent(id) {
  const index = progress.savedEvents.indexOf(id);
  if (index === -1) progress.savedEvents.push(id);
  else progress.savedEvents.splice(index, 1);
  saveProgress();
}

function handleEventGridClick(event) {
  const btn = event.target.closest("button[data-event-id]");
  if (!btn) return;
  const id = btn.dataset.eventId;
  toggleSavedEvent(id);
  renderEcoEvents();
  updateDashboard();
  const again = document.querySelector('.save-btn[data-event-id="' + id + '"]');
  if (again) again.focus();
}

function handleMyEventsClick(event) {
  const btn = event.target.closest("button[data-remove-event]");
  if (!btn) return;
  const id = btn.dataset.removeEvent;
  if (progress.savedEvents.includes(id)) toggleSavedEvent(id);
  renderEcoEvents();
  updateDashboard();
}

let bannerDismissed = false;
let lastDateKey = dateKey(new Date());

// Refresh date-based content if the day changes while the page is open
function refreshIfNewDay() {
  const key = dateKey(new Date());
  if (key !== lastDateKey) {
    lastDateKey = key;
    renderEcoEvents();
    renderDailyTip();
    updateDashboard();
  }
}

/* =========================================================
   9. QUIZ  ("Eco Champion Challenge")
   ========================================================= */
const quiz = { items: [], index: 0, correctCount: 0, answered: false, active: false, finished: false };

function maxQuizPoints(totalQuestions) { return totalQuestions * POINTS_PER_CORRECT; }

// Begin a fresh attempt: shuffle questions AND answer order, reset attempt state
function startQuiz() {
  quiz.items = shuffle(QUIZ_QUESTIONS).map(function (item) {
    const opts = item.options.map(function (text, i) { return { text: text, correct: i === item.answer }; });
    return { q: item.q, explanation: item.explanation, options: shuffle(opts) };
  });
  quiz.index = 0;
  quiz.correctCount = 0;
  quiz.answered = false;
  quiz.active = true;
  quiz.finished = false;
  $("quiz-intro").hidden = true;
  $("quiz-results").hidden = true;
  $("quiz-play").hidden = false;
  displayQuestion();
}

function displayQuestion() {
  const item = quiz.items[quiz.index];
  const total = quiz.items.length;
  quiz.answered = false;

  $("quiz-progress-text").textContent = "Question " + (quiz.index + 1) + " of " + total;
  const pct = Math.round((quiz.index / total) * 100);
  $("quiz-progress-bar").style.width = pct + "%";
  $("quiz-progress-track").setAttribute("aria-valuenow", String(pct));
  $("quiz-score").textContent = quiz.correctCount * POINTS_PER_CORRECT;
  $("quiz-question").textContent = item.q;

  const box = $("quiz-options");
  box.textContent = "";
  item.options.forEach(function (opt, i) {
    const btn = el("button", "option-btn");
    btn.type = "button";
    btn.dataset.optionIndex = String(i);
    btn.append(el("span", "opt-letter", String.fromCharCode(65 + i)), el("span", "", opt.text));
    box.append(btn);
  });

  const feedback = $("quiz-feedback");
  feedback.hidden = true;
  feedback.textContent = "";
  $("quiz-next").hidden = true;
  $("quiz-question").focus({ preventScroll: true });
}

// Only the first click on a question counts
function submitAnswer(optionIndex) {
  if (!quiz.active || quiz.answered) return;
  const item = quiz.items[quiz.index];
  const chosen = item.options[optionIndex];
  if (!chosen) return;
  quiz.answered = true;
  if (chosen.correct) quiz.correctCount++;

  document.querySelectorAll("#quiz-options .option-btn").forEach(function (btn, i) {
    btn.disabled = true;
    if (i === optionIndex) btn.classList.add("selected");
    if (item.options[i].correct) btn.classList.add("correct");
    else if (i === optionIndex) btn.classList.add("incorrect");
  });

  const feedback = $("quiz-feedback");
  feedback.textContent = "";
  feedback.className = "feedback " + (chosen.correct ? "good" : "bad");
  feedback.append(el("p", "", chosen.correct ? "Correct! +" + POINTS_PER_CORRECT + " points." : "Incorrect. +0 points."));
  feedback.append(el("p", "", item.explanation));
  feedback.hidden = false;

  $("quiz-score").textContent = quiz.correctCount * POINTS_PER_CORRECT;
  const next = $("quiz-next");
  next.textContent = quiz.index === quiz.items.length - 1 ? "See Results" : "Next Question";
  next.hidden = false;
  next.focus();
}

function nextQuestion() {
  if (!quiz.active || !quiz.answered) return;
  if (quiz.index < quiz.items.length - 1) {
    quiz.index++;
    displayQuestion();
  } else {
    showQuizResults();
  }
}

// Score for the current attempt
function calculateQuizScore() {
  const total = quiz.items.length;
  const correct = quiz.correctCount;
  return {
    correct: correct,
    total: total,
    points: correct * POINTS_PER_CORRECT,
    maxPoints: maxQuizPoints(total),
    percent: total > 0 ? (correct * 100) / total : 0
  };
}

// Runs once per attempt: the "finished" flag stops points being added twice
function showQuizResults() {
  if (quiz.finished) return;
  quiz.finished = true;
  quiz.active = false;

  const result = calculateQuizScore();
  const achievement = getAchievement(result.percent);

  progress.totalPoints += result.points;
  progress.quizzesCompleted += 1;
  if (result.points > progress.bestScore) progress.bestScore = result.points;
  if (result.percent > progress.bestPercent) progress.bestPercent = result.percent;
  progress.level = getAchievement(progress.bestPercent).name;
  saveProgress();

  $("quiz-play").hidden = true;
  $("quiz-results").hidden = false;
  $("result-level").textContent = achievement.name;
  $("result-message").textContent = "You answered " + result.correct + " of " + result.total + " correctly (" +
    formatPercent(result.percent) + "%). " + achievement.message;
  $("result-score").textContent = result.points + " / " + result.maxPoints;
  $("result-correct").textContent = result.correct + " / " + result.total;
  $("result-total").textContent = progress.totalPoints;
  updateDashboard();
}

// Leave a quiz early: nothing is saved and no points are awarded
function quitQuiz() {
  quiz.active = false;
  quiz.finished = false;
  $("quiz-play").hidden = true;
  $("quiz-results").hidden = true;
  $("quiz-intro").hidden = false;
}

function renderQuizIntro() {
  const total = QUIZ_QUESTIONS.length;
  $("quiz-intro-info").textContent = total + " multiple-choice questions · up to " + maxQuizPoints(total) + " points per attempt";
}

/* =========================================================
   10. DASHBOARD
   ========================================================= */
function getLevelProgress() {
  if (progress.quizzesCompleted === 0) {
    return { percent: 0, label: "Complete the quiz once to earn your first achievement level." };
  }
  const best = progress.bestPercent;
  const current = getAchievement(best);
  const next = ACHIEVEMENTS.find(function (a) { return a.min > best; });
  if (!next) return { percent: 100, label: "You have reached the highest level: " + current.name + "!" };
  const span = next.min - current.min;
  const pct = span > 0 ? ((best - current.min) / span) * 100 : 0;
  return {
    percent: Math.max(0, Math.min(100, pct)),
    label: "Best result: " + formatPercent(best) + "%. Score at least " + next.min + "% to reach " + next.name + "."
  };
}

function renderChecklist() {
  const box = $("checklist");
  box.textContent = "";
  CHECKLIST_ITEMS.forEach(function (item) {
    const label = el("label", "check-item");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.checkId = item.id;
    input.checked = progress.checklist[item.id] === true;
    label.append(input, el("span", "", item.label));
    box.append(label);
  });
}

function handleChecklistChange(event) {
  const input = event.target.closest("input[data-check-id]");
  if (!input) return;
  if (input.checked) progress.checklist[input.dataset.checkId] = true;
  else delete progress.checklist[input.dataset.checkId];
  saveProgress();
}

function updateDashboard() {
  $("prog-points").textContent = progress.totalPoints;
  $("prog-best").textContent = progress.bestScore;
  $("prog-completed").textContent = progress.quizzesCompleted;
  $("prog-level").textContent = progress.quizzesCompleted > 0 && progress.level ? progress.level : "None yet";
  $("prog-events").textContent = progress.savedEvents.length;
  $("prog-tips").textContent = progress.tipsDone.length;

  const lp = getLevelProgress();
  $("level-bar").style.width = lp.percent + "%";
  $("level-progress-track").setAttribute("aria-valuenow", String(Math.round(lp.percent)));
  $("level-bar-label").textContent = lp.label;
  $("storage-warning").hidden = storageWorks;
}

// Reset flow with an in-page confirmation step
function showResetConfirm() {
  $("reset-confirm").hidden = false;
  $("reset-btn").hidden = true;
  $("reset-no").focus();
}

function hideResetConfirm() {
  $("reset-confirm").hidden = true;
  $("reset-btn").hidden = false;
  $("reset-btn").focus();
}

function resetProgress() {
  progress = defaultProgress();
  saveProgress();
  quitQuiz();
  hideResetConfirm();
  renderStudentTips();
  renderDailyTip();
  renderEcoEvents();
  renderChecklist();
  renderWasteSortingGame();
  updateDashboard();
}

/* =========================================================
   11. INIT — all listeners are attached exactly once
   ========================================================= */
function init() {
  validateData();
  loadTheme();

  // Static counts for the hero
  $("stat-tips").textContent = STUDENT_TIPS.length;
  $("stat-events").textContent = ECO_EVENTS.length;
  $("stat-questions").textContent = QUIZ_QUESTIONS.length;
  $("footer-year").textContent = new Date().getFullYear();

  // Render content
  renderFiveRs();
  renderBenefits();
  renderWasteTypes();
  renderStudentTips();
  renderDailyTip();
  renderEcoEvents();
  renderWasteSortingGame();
  renderQuizIntro();
  renderChecklist();
  updateDashboard();
  setupActiveNav();
  setupImageFallbacks();

  // Header
  $("theme-toggle").addEventListener("click", toggleDarkMode);
  $("menu-toggle").addEventListener("click", function () {
    setMenuOpen($("menu-toggle").getAttribute("aria-expanded") !== "true");
  });
  document.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", function () { setMenuOpen(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenuOpen(false);
  });
  $("eco-banner-close").addEventListener("click", function () {
    bannerDismissed = true;
    $("eco-banner").hidden = true;
  });

  // Tips
  $("tips-grid").addEventListener("click", handleTipGridClick);
  $("daily-tip-btn").addEventListener("click", handleDailyTipClick);

  // Game
  $("game-options").addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-choice]");
    if (btn) checkWasteAnswer(btn.dataset.choice);
  });
  $("game-next").addEventListener("click", nextWasteItem);
  $("game-restart").addEventListener("click", renderWasteSortingGame);

  // Calendar
  $("eco-events-grid").addEventListener("click", handleEventGridClick);
  $("my-events-list").addEventListener("click", handleMyEventsClick);

  // Quiz
  $("quiz-start").addEventListener("click", startQuiz);
  $("quiz-options").addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-option-index]");
    if (btn) submitAnswer(Number(btn.dataset.optionIndex));
  });
  $("quiz-next").addEventListener("click", nextQuestion);
  $("quiz-quit").addEventListener("click", quitQuiz);
  $("quiz-restart").addEventListener("click", startQuiz);

  // Dashboard
  $("checklist").addEventListener("change", handleChecklistChange);
  $("reset-btn").addEventListener("click", showResetConfirm);
  $("reset-no").addEventListener("click", hideResetConfirm);
  $("reset-yes").addEventListener("click", resetProgress);

  // Footer
  $("back-to-top").addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    $("site-header").focus && $("logo-focus-target");
  });

  // Keep date-based content fresh if the page stays open past midnight
  setInterval(refreshIfNewDay, 60 * 1000);
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) refreshIfNewDay();
  });
}

init();