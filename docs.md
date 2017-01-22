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

## Redux

## React

# Backend
Server, čili backend, byl navržen v tomto projektu tak, aby sloužil jako substituent pro nedostupnou funkcionalitu v prohlížeči nebo pro funkce, které se budou pravidelně obměňovat (správa dat, konektivita s EET).  

## mDNS 
mDNS, neboli multicast DNA, je technologie, která umožňuje najít servery a jejich IP adresy na lokální síti, aniž by na lokální síti běžel plnohodnotný DNS server. Pro provoz není třeba žádná konfigurace ze strany správce sítě. Stačí službu jenom spustit a klienti budou schopni automaticky objevit server a adresu serveru. Tato technologije je známá taky jako Apple Bonjour, nebo Network Service Discovery.

Serverová implementaci mDNS je vyřešena importem knihovny `bonjour`, psána čistě v JavaScriptu. Vyhneme se instalaci Avahi daemonu a kompilaci nativních knihoven. Navíc funguje na všech platformách stejně. Před použitím bylo však třeba doimplementovat některé části specifikace mDNS, aby byla služba objevitelná na Androidu. 

Pro klientskou Android aplikaci bylo nutné importovat knihovnu `jmdns`, která obsahuje modernější implementaci mDNS oproti zabudovanému Android NSD. Během testování se nativní NSD často zasekával a bylo nutné restartovat zařízení pro znovu objevení služby.

## ESC/POS tiskárny

## EET a propojení se státní správou

## Databáze
NoSQL databáze
