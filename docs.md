# Úvod
## Motivace


## Srovnání s konkurenčními řešeními 

# Dokumentace
## Instalace
Aplikaci lze provozovat dvěma způsoby. Jedním ze způsobů je instalace APK aplikace, určena pro Android. Toto APK zahrnuje všechnu základní funkcionalitu, za předpokladu, že je dotyčné zařízení dostatečně vybavené (viz. minimální podmínky). V případě nevhodného zařízení lze aplikaci provozovat ve formě služby běžící na serveru.

### Minimální požadavky
 - Tablet
 - USB tiskárna

### Doporučené požadavky
 - Raspberry Pi 
 - Monitor pro Raspberry Pi
 - Tablet / počítač pro rozhraní prodavače
 - USB Tiskárna

### TL;DR
 - koupit Raspberry Pi, dále jen RPi
 - upravit `utils/config.txt`
 - zkopírovat všechny soubory z `utils/` do SD karty pro RPi
 - zapojit RPi do sítě a do konzole napsat `sudo /boot/install.sh`
 - v prohlížeči otevřít `http://[ip adresa RPi]/` nebo nainstalovat APK pro Android

### Instalace serveru
#### Pro Raspberry Pi
Pro Raspberry Pi je připravený instalační skript. Stačí nakopírovat všechny soubory ze složky `utils/` do kořenové složky SD karty operačního systému a doplnit promněné v souboru `utils/config.txt`.

Po nabootování je pak třeba do konzole napsat:
`sudo /boot/install.sh`

Aplikace se nainstaluje jako služba běžící na pozadí a po instalaci se počítač automaticky restartuje.

### Manuální instalace
Pro instalaci aplikace je nutné nainstalovat následující závislosti. 

 - python2
 - python-pygame
 - node.js

Předpokládá se, že jsou na systému již nainstalovány. Instalace serveru je pak dokončena zadáním příkazu ve složce `server/`

`nwpos/server/$ npm install --production`

## Instalace APK
Balíčky pro instalaci se nacházejí ve složce `android/build` 

Jelikož není APK k dispozici na Play Store, musí se APK instalovat pomocí `sideloadingu`. APK se nakopíruje do zařízení a instalace je spuštěna otevřením APK ve správci souborů. Je možné, že bude nutné vypnout ověřování původu APK pro úspěšnou instalaci.

{Obrázek Zabezpečení}

## Návod k použití

{Obrázek rozhraní}

# Jak to funguje
Celá aplikace byla napsána v JavaScriptu, přesněji ES2016. Díky JavaScriptu můžeme provozovat aplikaci na virtuálně všech platformách, aniž by bylo třeba napsat pro každou platformu nativní variantu. Jedním z požadavků bylo napsat aplikaci, která bude primárně běžet na prohlížeči, proto jsem vynechal velké all-in-one frameworky, které jsou přímo navržené pro tvorbu mobilních aplikací, jako Xamarin nebo Apache Cordova. Tyto frameworky buď vyžadují vlastní runtime pro běh aplikace (C# a CLR) nebo se odkazují na knihovny, které nejsou k dispozici v prohlížeči (Apache Cordova). JavaScript je ideálním (a jediným) jazykem pro psaní webových aplikací. 

# Frontend
Psát aplikace v čistém JavaScriptu se v dlouhodobém horizontu nevyplatí, kód se časem hromadí a jeho správa je s časem čím dál tím více náročnější. Rozhodl jsem se použít nějaký framework, který by usnadnil strukturu projektu a tvorbu UI.

## ECMAScript 2016, Babel a Webpack
ECMAScript 6, dále jen ES6, je nová verze JavaScriptu, následovník verze ECMAScript 5. Přináší do jazyka upravený syntax a nové metody u primitivních typů, polí a objektů. Specifikace ES6 se průběžně mění a implementuje v moderních prohlížečích. Celou specifikaci a jejich stav implementace můžeme najít na stránce http://kangax.github.io. 

Jelikož je podpora ES6 (aspoň v roce 2016-17) stále kolísává, rozhodl jsem se použít Babel. Jedná se o transpiler, který převádí nový syntax ES6 do starších verzí ECMAScriptu pro větší podporu. 

Spolu s Babelem ještě používám Webpack, který usnadňuje kompilaci a vývoj javascriptových aplikací. Tento nástroj můžeme chápat jako MSBUILD pro C# nebo jako Gradle pro Android / Java aplikace. Spolu s ostatními moduly nám Webpack umožňuje live-reload (automatické obnovení při změnách), hot-reload (výměna částí kódů za běhu) a minifikace či uglifikace kódu. 

## Redux
Redux je knihovna, která byla použita pro psaní business logic, čili části kódu, které se nestarají o vykreslení rozhraní. Sama o sobě se jedná o minimální knihovnu, jde spíše o strukturu business logiky. 

Na stránkách můžeme najít, že se jedná o "kontejner stavů." Musíme si nejprve vysvětlit, co vlastně stav aplikace je. Stav aplikace je podoba aplikace se všemi změnami v určitém čase. Zahrnuje, CSS třídy, HTML, ale i globální proměnné apod. V běžné JavaScriptové aplikaci tento "aplikační stav" měníme několika způsoby
	
	- změnou CSS tříd (document.queryElement("a").toggleClass("trida"))
	- změna HTML obsahu: (document.queryElement("p").innerHTML = "obsah"),
	- změnou globálních promněných (window.localStorage.set("vnitřní promněná"))

Z toho důvodu se pak data nepředvídatelně mění na různých místech. Testování takovéto aplikace je složitější a pokryje většinou pouze uživatelské rozhraní. 

Použitím Redux zredukujeme počet zdrojů změn na jeden - na jediný zdroj pravdy. Zdrojem této pravdy je tzv. "kontejner," dále jen "store." Tento zdroj obsahuje všechny data, které aplikace potřebuje pro svůj chod. Data aplikace čte pouze ze store. Data vyjadřují aktuální stav aplikace a stejné data musí uvést aplikaci vždy do stejného stavu. Aplikace se stává předvídatelnou a máme pod kontrolou celý stav a chod aplikace - máme předvídatelný stav ("predicatble state"). 

Díky tomu je ladění aplikace velice jednoduché, všechny zmněy pocházejí pouze z jednoho zdroje, stačí nám pouze ladit samotný zdroj aplikace: store. Také testování je snadné, jelikož můžeme z principu předpokládat, že náš store bude vždy odpovídat stavu aplikace, můžeme testovat i bez prohlížeče. Zároveň můžeme implementovat funkce, které obvykle považujeme za obtížne, jako funkci "Vrátit zpět," ukládání stavu a obnovení stavu aplikace při restartu nebo vykreslení aplikace na serveru.

Abychom se vyvarovali nepředvídatelným změnám v aplikaci, je store v základu pouze read-only. Jediným způsobem, jak změnit náš store, je za pomocí tzv. "akce." Akce je prostý JavaScriptový objekt, který popisující změnu. 

```javascript
let action = (number) => {
	return { type: "set", number: number }
}
```

Samotné změny jsou prováděny pomocí "reducerů." Tyto reducery jsou prosté funkce, které vezmou předchozí stav, aplikují akci a vrátí stav nový. Čekají uvnitř store, než zavoláme `store.dispatch(akce)`, který zavolá náš `reducer.`

```javascript
let initialState = 0 //počáteční stav, při inicializaci
let reducer = function(state = initialState, action) {
	if (action.type === "set") { //pokud máme akci 
		return action.number //vrátíme nový stav
	} 

	//další funkce

	return state // všechny akce provedeny, vrátíme nový stav
}
```
Jednotlivé stavy musí být immutable, tj. nemá žádnou metodu, která je schopna změnit nastavenou hodnotu. Tím tyto stavy jsou na sobě nezávislé a jsou předvídatelné, nazávisí na předchozích stavech. Z principu jsou primitivní typy immutable. Pro pole a objekty musíme používat syntaxi ES6, abychom zajistili tuto vlastnost.

```javascript
//počáteční stav, při inicializaci
let initialState = {
	list: [],
	number: 0
} 

let reducer = function(state = initialState, action) {
	if (action.type === "set") {
		// vytváříme nový objekt a překopírujeme všechny prvky z předchozího stavu + aplikování akcí
		return Object.assign({}, state, { number: action.number })
	} else if (action.type === "add") { //vložení do pole 
		// spread operátor z ES6, vytváříme nové pole
		return Object.assign({}, state, { list: [...state.list, action.number] })
	} 

	return state // všechny akce provedeny, vrátíme nový stav
}
```

Nakonec inicializujeme store pomocí `createStore()`, budeme volat její funkci `dispatch()`, který zavolá všechny reducery s akcí. Změny ve storu můžeme odposlouchávat pomocí `subscribe`, jehož argument se zavolá při každé změně storu. Celý obsah storu získáme voláním funkce `getStore()`.

Na konec vkládám celou ukázku:


```javascript
import redux from "redux"

//počáteční stav, při inicializaci
let initialState = {
	list: [],
	number: 0
} 

let set = (number) => {
	return { type: "set", number: number }
}

let add = (item) => {
	return { type: "add", number: number }
}

let reducer = function(state = initialState, action) {
	if (action.type === "set") {
		// vytváříme nový objekt a překopírujeme všechny prvky z předchozího stavu + aplikování akcí
		return Object.assign({}, state, { number: action.number })
	} else if (action.type === "add") { //vložení do pole 
		// spread operátor z ES6, vytváříme nové pole
		return Object.assign({}, state, { list: [...state.list, action.number] })
	} 

	return state // všechny akce provedeny, vrátíme nový stav
}

let store = redux.createStore(reducer)
store.subscribe(() => {
	console.log(store.getStore()) // Výsledek { list: [1], number: 5 }
})

store.dispatch(add(1))
store.dispatch(set(5))
```

## React

# Backend
Server, čili backend, byl navržen v tomto projektu tak, aby sloužil jako substituent pro nedostupnou funkcionalitu v prohlížeči nebo pro funkce, které se budou pravidelně obměňovat (správa dat, konektivita s EET).  

## mDNS 
mDNS, neboli multicast DNA, je technologie, která umožňuje najít servery a jejich IP adresy na lokální síti, aniž by na lokální síti běžel plnohodnotný DNS server. Pro provoz není třeba žádná konfigurace ze strany správce sítě. Stačí službu jenom spustit a klienti budou schopni automaticky objevit server a adresu serveru. Tato technologije je známá taky jako Apple Bonjour, nebo Network Service Discovery.

Serverová implementaci mDNS je vyřešena importem knihovny `bonjour`, psána čistě v JavaScriptu. Vyhneme se instalaci Avahi daemonu a kompilaci nativních knihoven. Navíc funguje na všech platformách stejně. Před použitím bylo však třeba doimplementovat některé části specifikace mDNS, aby byla služba objevitelná na Androidu. 

Pro klientskou Android aplikaci bylo nutné importovat knihovnu `jmdns`, která obsahuje modernější implementaci mDNS oproti zabudovanému Android NSD. Během testování se nativní NSD často zasekával a bylo nutné restartovat zařízení pro znovu objezvení služby.

## ESC/POS tiskárny

## EET a propojení se státní správou

## Databáze

NoSQL databáze