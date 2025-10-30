# 📚 Räkna med Alicia ✨

Ett roligt och interaktivt multiplikationsspel för barn på svenska!

## Beskrivning

"Räkna med Alicia" är ett pedagogiskt spel som hjälper barn att öva på sina multiplikationstabeller på ett engagerande och uppmuntrande sätt. Spelet har en färgglad design med animationer och omedelbar feedback för att hålla barn motiverade medan de lär sig.

## Funktioner

### Två Spellägen

**🎮 Spelläge** - Testa dina kunskaper!
- 3 liv (hjärtan) - spelet slutar efter tre fel
- Bygg din längsta rad med rätta svar i följd
- Spara din bästa rad mellan sessioner
- Spännande utmaning med press

**📖 Övningsläge** - Lär dig i lugn och ro!
- Inget tryck - inga liv att förlora
- Välj specifik multiplikationstabell att öva (1-10) eller blandade
- Mästarnivå: Få 5 rätt i rad för att behärska en tabell
- Visa referenstabell när du behöver hjälp
- Spåra din precision och framsteg
- Markera behärskade tabeller med stjärnor

### Spelmekanik
- **Multiplikationsövningar**: Fokus på multiplikationstabellerna 1-10
- **Svarsval**: Fyra svarsalternativ i ett 2×2 rutnät
- **Intelligenta felaktiga svar**: Trovärdiga alternativ som utmanar

### Visuell Design
- **Barnvänlig estetik**: Runda hörn och lekfull typografi
- **Dubbla färgteman**:
  - Spelläge: Lila/blå färgschema (energiskt och spännande)
  - Övningsläge: Grön/turkos färgschema (lugnande och fokuserat)
- **Animationer**:
  - Pulserande effekt för rätta svar
  - Skakande effekt för felaktiga svar
  - Hjärtan som tonar bort när liv förloras
  - Mjuka övergångar mellan lägen
- **Responsiv**: Fungerar på dator, surfplatta och mobil

### Feedback-system
- **Omedelbar visuell feedback**: Grönt för rätt, rött för fel
- **Uppmuntrande meddelanden**: Positiva svenska fraser efter varje rätt svar
- **Visa rätt svar**: När spelaren gissar fel visas det korrekta svaret
- **Anpassade slutmeddelanden**: Baserade på prestationen

## Hur man spelar

### Kom igång
1. Öppna `index.html` i din webbläsare
2. Välj ditt läge:
   - **Spela Spel** - För att utmana dig själv
   - **Öva Tabeller** - För att lära dig i din egen takt

### Spelläge
1. Du får 3 hjärtan (liv)
2. Svara på multiplikationsproblem
3. Rätt svar ökar din rad
4. Fel svar kostar ett hjärta
5. Försök att slå din bästa rad!
6. Efter tre fel visas ditt resultat

### Övningsläge
1. Välj en specifik multiplikationstabell (1-10) eller "Blandade"
2. Öva utan press - inga liv att förlora
3. Få 5 rätt svar i rad för att behärska tabellen
4. Klicka på "📋 Visa tabell" för att se referenstabellen
5. Spåra din precision och framsteg
6. Behärskade tabeller markeras med en stjärna
7. Byt tabell eller prova spelläget när du vill

## Teknisk information

### Filstruktur
```
matte-med-alicia/
├── index.html      # HTML-struktur
├── styles.css      # Styling och animationer
├── script.js       # Spellogik
└── README.md       # Dokumentation
```

### Teknologier
- **HTML5**: Semantisk struktur
- **CSS3**: Flexbox, Grid, animationer och media queries
- **Vanilla JavaScript**:
  - localStorage för att spara bästa rad
  - DOM-manipulation
  - Event listeners
  - Fisher-Yates shuffle för slumpmässiga svar

### Viktiga funktioner

**Kärnlogik:**
- `generateProblem()`: Skapar nya multiplikationsproblem (anpassas efter valt läge)
- `generateAnswers()`: Genererar trovärdiga felaktiga svar
- `handleAnswer()`: Validerar spelarens svar
- `showGameOver()`: Visar slutskärmen med anpassade meddelanden

**Lägeshantering:**
- `startMode()`: Startar valt läge (spel eller övning)
- `setupGameMode()` / `setupPracticeMode()`: Konfigurerar UI för respektive läge
- `showModeMenu()`: Visar huvudmenyn för lägesval

**Övningsläge:**
- `renderTableGrid()`: Visar tabellval med mästarnivå-indikatorer
- `updatePracticeStats()`: Uppdaterar sessionsstatistik (precision, svarade, rad)
- `showReferenceTable()`: Visar referenstabell med aktuellt problem markerat
- `showMasteryModal()`: Celebrerar när 5 rätt i rad uppnåtts

**Datalagring:**
- Spelläge: Bästa rad sparas i localStorage
- Övningsläge: Mästarnivå för varje tabell sparas i localStorage

## Deployment

### GitHub Pages
1. Pusha koden till ett GitHub-repo
2. Gå till Settings → Pages
3. Välj main branch som källa
4. Din spel kommer att vara live på `https://[användarnamn].github.io/[repo-namn]`

### Lokal testning
Öppna helt enkelt `index.html` i din webbläsare. Ingen server behövs!

## Anpassningar

### Ändra svårighetsgrad
I `script.js`, ändra raderna i `generateProblem()`:
```javascript
const num1 = randomInt(1, 10);  // Ändra intervallet här
const num2 = randomInt(1, 10);  // Ändra intervallet här
```

### Ändra antal liv
I `index.html` och `script.js`, lägg till/ta bort hjärtan och uppdatera strikes-logiken.

### Anpassa färger
I `styles.css`, ändra färgvärdena i CSS-variablerna och gradienterna.

## Framtida förbättringar

### Planerade funktioner
- **Progressiva ledtrådar**: Hjälpsystem med visuella representationer
- **Tidsbegränsning**: Valfri timer för extra utmaning
- **Ljudeffekter**: Celebrerande ljud och bakgrundsmusik
- **Fler operationer**: Addition, subtraktion, division
- **Svårighetsanpassning**: Dynamisk svårighet baserad på prestation
- **Flerspelarläge**: Tävla mot en vän
- **Föräldrainställningar**: Dashboard för att följa barnets framsteg

### Föreslagna förbättringar för övningsläge
- Visuella representationer (prickgrupper för multiplikation)
- "Försök igen"-knapp direkt efter fel svar
- Detaljerad felanalys (vilka problem är svårast)
- Anpassade övningsset från föräldrar/lärare

## Licens
MIT License - se LICENSE-filen för detaljer.

## Utvecklad med ❤️ för unga matteentusiaster!