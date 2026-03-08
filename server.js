// ══════════════════════════════════════════════════════
//  Backend simple — Portfolio Mouhamed Moustapha Ba
//  Node.js + Express · Données stockées en JSON local
//  Lancer : node server.js
// ══════════════════════════════════════════════════════

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DB = path.join(__dirname, 'db.json');

// ── Middleware ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // sert index.html et admin.html

// ── Initialisation de la base de données ───────────
const defaultDB = {
    hero: {
        title: "Créer des expériences<br>numériques <em>uniques</em>",
        subtitle: "Portfolio de Mohamed Moustapha Ba",
        years: "2+",
        image: "./profile.jpeg"
    },
    about: {
        text1: "Je suis Mohamed Moustapha Ba, développeur full stack junior avec plus de 2 ans d'expérience dans la création de sites web et d'applications pour des clients du monde entier.",
        text2: "Je crois en la création de solutions qui ne sont pas seulement belles, mais qui résolvent aussi de vrais problèmes commerciaux et apportent de la valeur aux utilisateurs."
    },
    nav: [
        { label: "Accueil", href: "#home" },
        { label: "À propos", href: "#about" },
        { label: "Projets", href: "#projects" },
        { label: "Témoignages", href: "#testimonials" },
        { label: "Contact", href: "#contact" }
    ],
    skills: [
        { name: "Design UI/UX", level: 95 },
        { name: "HTML/CSS", level: 98 },
        { name: "JavaScript", level: 90 },
        { name: "React", level: 85 },
        { name: "Figma", level: 92 },
        { name: "Design Réactif", level: 96 }
    ],
    projects: [
        { title: "Plateforme E-commerce", category: "Web Design & Développement", image: "https://picsum.photos/600/400?random=201", alt: "E-commerce", description: "Une plateforme e-commerce entièrement réactive.", link: "#" },
        { title: "App Santé & Bien-être", category: "UI/UX App Mobile", image: "https://picsum.photos/600/400?random=202", alt: "App Santé", description: "Design centré sur l'utilisateur.", link: "#" },
        { title: "Site Web d'Entreprise", category: "Refonte de Site Web", image: "https://picsum.photos/600/400?random=203", alt: "Site Entreprise", description: "Refonte complète axée sur l'identité de marque.", link: "#" },
        { title: "Blog de Voyage", category: "Développement Web", image: "https://picsum.photos/600/400?random=204", alt: "Blog Voyage", description: "CMS personnalisé et design réactif.", link: "#" },
        { title: "Tableau de Bord SaaS", category: "Design UI", image: "https://picsum.photos/600/400?random=205", alt: "SaaS", description: "Tableau de bord complexe avec visualisation de données.", link: "#" },
        { title: "Site Portfolio", category: "Web Design", image: "https://picsum.photos/600/400?random=206", alt: "Portfolio", description: "Design de portfolio minimaliste.", link: "#" }
    ],
    testimonials: [
        { name: "Sarah Johnson", role: "Directrice Marketing, TechCorp", image: "https://picsum.photos/100?random=301", content: "Mouhamed a complètement transformé notre site web. Le nouveau design a augmenté notre taux de conversion de 40%." },
        { name: "Michael Chen", role: "CEO, StartupXYZ", image: "https://picsum.photos/100?random=302", content: "Travailler avec Mouhamed a changé la donne. Son attention aux détails a dépassé nos attentes." },
        { name: "Emma Rodriguez", role: "Directrice Créative, DesignStudio", image: "https://picsum.photos/100?random=303", content: "La capacité de Mouhamed à traduire des exigences complexes en designs magnifiques est exceptionnelle." }
    ],
    "footer-links": [
        { label: "Politique de confidentialité", href: "#privacy" },
        { label: "Conditions d'utilisation", href: "#terms" },
        { label: "Politique de cookies", href: "#cookies" }
    ],
    messages: []
};

function readDB() {
    if (!fs.existsSync(DB)) {
        fs.writeFileSync(DB, JSON.stringify(defaultDB, null, 2));
        return defaultDB;
    }
    return JSON.parse(fs.readFileSync(DB, 'utf8'));
}
function writeDB(data) {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// ── Routes GET ─────────────────────────────────────
const keys = ['hero', 'about', 'nav', 'skills', 'projects', 'testimonials', 'footer-links', 'messages'];

keys.forEach(key => {
    app.get(`/api/${key}`, (req, res) => {
        const db = readDB();
        res.json(db[key] ?? null);
    });
});

// ── Routes PUT (mise à jour complète d'une section) ─
keys.forEach(key => {
    app.put(`/api/${key}`, (req, res) => {
        const db = readDB();
        db[key] = req.body;
        writeDB(db);
        res.json({ ok: true, data: db[key] });
    });
});

// ── Route POST messages (formulaire contact) ───────
app.post('/api/messages', (req, res) => {
    const db = readDB();
    const msg = {
        id: Date.now(),
        name: req.body.name || '',
        email: req.body.email || '',
        subject: req.body.subject || '',
        message: req.body.message || '',
        date: new Date().toISOString(),
        read: false
    };
    db.messages.push(msg);
    writeDB(db);
    console.log(`📩 New message from ${msg.name} <${msg.email}>`);
    res.json({ ok: true, id: msg.id });
});

// ── Route DELETE message individuel ───────────────
app.delete('/api/messages/:id', (req, res) => {
    const db = readDB();
    db.messages = db.messages.filter(m => m.id !== parseInt(req.params.id));
    writeDB(db);
    res.json({ ok: true });
});

// ── Démarrage ──────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🟢  Portfolio backend running on http://localhost:${PORT}`);
    console.log(`📁  Portfolio : http://localhost:${PORT}/index.html`);
    console.log(`⚙️   Admin     : http://localhost:${PORT}/admin.html`);
    console.log(`💾  Database  : ${DB}\n`);
});
