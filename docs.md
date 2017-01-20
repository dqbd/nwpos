# Úvod
 - 

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

# Jak to funguje
Celá aplikace byla napsána čistě v JavaScriptu se syntaxí ES6. Toto bylo čistě uvědomilé rozhodnutí, jelikož chceme, aby aplikace běžela na co nejvíce platforem, aniž by se musela psát pro každou platformu zvlášť. 

### Srovnání JS s ostatními platformami
Před vývojem aplikace bylo provedeno srovnání všech vývojařských platforem, které umožňují psát multiplatforní aplikace. 