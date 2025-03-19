const G = 0.1; // Gravitationskonstante

// Gravitationszentrum (Stern) holen
const star = document.querySelector('.star');
const starRect = star.getBoundingClientRect();
const starPosition = {
    x: starRect.left + starRect.width / 2,
    y: starRect.top + starRect.height / 2,
    mass: 1000 // Masse des Sterns
};

const bodiesContainer = document.querySelector('.bodies--container');
const celestialBodies = [];
const maxBodies = 6; // Maximale Anzahl von Himmelskörpern

// Minimale Distanz zwischen Himmelskörpern, ab der Kräfte nicht mehr wirken
const minDistance = 30;

// Celestial Body Klasse
class CelestialBody {
    constructor(x, y, vx, vy, mass) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.element = document.createElement('div');
        this.element.classList.add('celestial-body');
        bodiesContainer.appendChild(this.element);
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    // Berechnet die Gravitationskraft zwischen diesem Himmelskörper und einem anderen
    applyGravitationalForce(otherBody) {
        let dx = otherBody.x - this.x;
        let dy = otherBody.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Wenn der Abstand kleiner als der minimale Abstand ist, ignorieren wir die Interaktion
        if (distance < minDistance) return;

        let force = G * this.mass * otherBody.mass / (distance * distance);

        // Die Gravitationskraft abmildern, wenn der Abstand klein wird (Weichheit)
        if (distance < 100) {
            force *= 0.5; // Reduziere die Kraft bei kleineren Entfernungen
        }

        // Berechnung der Beschleunigung
        let ax = force * dx / (this.mass * distance);
        let ay = force * dy / (this.mass * distance);

        // Geschwindigkeit durch Beschleunigung aktualisieren
        this.vx += ax;
        this.vy += ay;
    }

    // Berechnet die Wechselwirkung mit dem Stern
    applyGravitationalForceFromStar() {
        let dx = starPosition.x - this.x;
        let dy = starPosition.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy); // Abstand zum Stern
        let force = G * starPosition.mass * this.mass / (distance * distance); // Gravitationskraft

        // Berechnung der Beschleunigung
        let ax = force * dx / (this.mass * distance);
        let ay = force * dy / (this.mass * distance);

        // Geschwindigkeit aktualisieren
        this.vx += ax;
        this.vy += ay;
    }

    // Himmelskörper-Position aktualisieren
    update() {
        // Zuerst die Wechselwirkung mit dem Stern anwenden
        this.applyGravitationalForceFromStar();

        // Dann die Wechselwirkungen mit allen anderen Himmelskörpern anwenden
        for (let otherBody of celestialBodies) {
            if (otherBody !== this) {
                this.applyGravitationalForce(otherBody);
            }
        }

        // Position basierend auf der Geschwindigkeit aktualisieren
        this.x += this.vx;
        this.y += this.vy;

        // Update der Position im DOM
        this.updatePosition();
    }
}

// Himmelskörper spawnen
function spawnCelestialBody() {
    if (celestialBodies.length >= maxBodies) return;

    // Zufällige Startposition außerhalb des Containers
    let angle = Math.random() * Math.PI * 2; // Zufälliger Winkel
    let distance = 200 + Math.random() * 300; // Zufälliger Abstand zum Stern
    let x = starPosition.x + Math.cos(angle) * distance;
    let y = starPosition.y + Math.sin(angle) * distance;

    // Geschwindigkeit berechnen, damit der Himmelskörper auf einer Umlaufbahn bleibt
    let orbitalSpeed = Math.sqrt(G * starPosition.mass / distance); // Orbitalgeschwindigkeit
    let vx = -Math.sin(angle) * orbitalSpeed;
    let vy = Math.cos(angle) * orbitalSpeed;

    let mass = 10; // Masse des Himmelskörpers
    celestialBodies.push(new CelestialBody(x, y, vx, vy, mass));
}

// Animationsloop
function animate() {
    for (let body of celestialBodies) {
        body.update();
    }

    requestAnimationFrame(animate);
}

// Initiale Himmelskörper spawnen
for (let i = 0; i < maxBodies; i++) {
    spawnCelestialBody();
}

animate();
