# Día a día

Tu calendario personal: gastos, ingresos, viajes, sitios, cuentas, el tiempo y los eventos de Teruel. Funciona en el móvil sin depender de Claude:

- **El tiempo** se actualiza solo cada vez que abres la app (Open-Meteo, gratis y sin clave).
- **Los eventos de Teruel** los busca GitHub cada mañana con Gemini y la app los descarga sola.
- **Gemini** ubica los sitios en el mapa y resume tus viajes.
- **Tus datos** se guardan en tu móvil. Con «Guardar copia» los llevas a otro móvil.

---

## 1. Ponerla en marcha (solo una vez)

Lo más cómodo es hacerlo desde un ordenador.

1. **Crea una cuenta** en [github.com](https://github.com) si no tienes.
2. **Crea un repositorio nuevo**: botón «New», nombre `dia-a-dia`, marca **Public** y no añadas nada más. Pulsa «Create repository».
3. **Sube los archivos**: descomprime el zip y, en la página del repositorio, pulsa «uploading an existing file». Arrastra **todo el contenido de la carpeta**, incluida la carpeta `.github` (en Mac, pulsa Cmd + Mayús + . para ver las carpetas ocultas). Abajo, pulsa «Commit changes».
4. **Activa la web**: Settings → Pages → en «Source» elige «Deploy from a branch», rama `main` y carpeta `/ (root)` → Save. En uno o dos minutos la app estará en `https://TU-USUARIO.github.io/dia-a-dia/`.
5. **Clave de Gemini para los eventos**: crea una gratis en [aistudio.google.com/apikey](https://aistudio.google.com/apikey). En GitHub: Settings → Secrets and variables → Actions → «New repository secret». Nombre: `GEMINI_API_KEY`. Valor: tu clave.
6. **Primera búsqueda de eventos**: pestaña Actions → «Eventos de Teruel» → «Run workflow». A partir de ahí se repite sola cada mañana.

## 2. Instalarla en el móvil

**Como app de Android (APK).** Cada vez que subes cambios, GitHub fabrica el APK solo (tarda unos 10 minutos; lo ves en la pestaña Actions, «Crear APK»). Cuando termine:

1. Abre en el móvil `https://github.com/TU-USUARIO/dia-a-dia/releases/latest`.
2. Toca `dia-a-dia.apk` para descargarlo.
3. Ábrelo. Android te pedirá permiso para instalar apps de esta fuente: acéptalo e instala.

**Como app web.** Abre `https://TU-USUARIO.github.io/dia-a-dia/` en Chrome → menú ⋮ → «Añadir a pantalla de inicio». Funciona igual, pero sin widget.

## 3. Primeros pasos en la app

- **Gemini**: toca la rueda ⚙ junto al año → pega tu clave de Gemini → «Probar» → «Guardar». La clave solo se guarda en tu móvil.
- **Pasar tus datos desde la versión de Claude**: en la app de Claude, pestaña Resumen → «Guardar copia». En la app nueva: ⚙ → «Importar copia» y elige ese archivo.

## 4. Copias de seguridad y cambio de móvil

- ⚙ → «Guardar copia» crea un archivo `.zip` con todos tus apuntes y fotos. Guárdalo fuera del móvil (Drive, correo…).
- En el móvil nuevo: instala la app, ⚙ → «Importar copia» y elige el archivo.
- Los vídeos de los viajes no van en la copia (pesan mucho): se vuelven a crear con un toque.
- Si desinstalas la app, se borran sus datos. Haz una copia antes.

## 5. El widget

Solo en la versión APK. Mantén pulsado un hueco del escritorio → Widgets → «Día a día» → arrástralo.
Muestra la fecha, el tiempo (o el del destino si estás de viaje), lo que tienes hoy y mañana, y lo gastado hoy.

- **Se actualiza solo:** el tiempo se pone al día cada media hora aunque no abras la app, y el día cambia solo a medianoche. Tus apuntes se pasan al widget cada vez que abres la app.
- **Fondo:** en ⚙ → Widget eliges transparente, semitransparente o negro.
- Si el tiempo deja de actualizarse, ve a Ajustes del móvil → Aplicaciones → Día a día → Batería y elige «Sin restricciones».

**Cómo hacer más widgets.** El widget está en `android/`:

- `java/HoyWidget.java`: lee los textos y los pinta.
- `java/WeatherRefresh.java`: actualiza el tiempo en segundo plano.
- `res/layout/widget_hoy.xml`: el diseño (colores, tamaños, cuántas líneas).
- `res/xml/widget_hoy_info.xml`: tamaño inicial y cada cuánto se refresca.
- En `index.html`, la función `updateWidget()` prepara los textos de los próximos 7 días.

Para un widget nuevo (por ejemplo, «Cuentas» con tu patrimonio) se copian esos tres archivos con otro nombre, se añade su `<receiver>` en `android/patch_manifest.py` y se prepara su texto en `updateWidget()`.

## 6. Pestaña «Más»

- **Cuentas** y **Recibos** (suscripciones y pagos fijos: cuánto pagas al mes y al año).
- **Coche:** repostajes, consumo (L/100 km), coste por km y las **gasolineras más baratas** de la provincia, que GitHub descarga cada hora del Ministerio (tarea «Gasolineras»).
- **Precios:** escanea un ticket con la cámara; Gemini apunta el gasto y guarda el precio de cada producto en cada tienda.
- **Personas y regalos:** fichas con cumpleaños, gustos, tallas e ideas de regalo (también con IA). «Yo» es tu lista de deseos, que puedes compartir.
- **Caducidades:** DNI, pasaporte, ITV, seguros… con aviso antes de que caduquen. No guardes números de documentos.
- **Ocio:** pelis, series y libros vistos con tu nota, pendientes y recomendaciones de Gemini.
- **Maletas:** una lista por viaje, que puedes rellenar tú o pedir a Gemini.

- **Pregúntale a tu app:** arriba en «Más». Escribe cualquier pregunta sobre tus datos y Gemini responde.

**Otras novedades:** foto en la ficha de cada persona; «Para ti» en la vista Teruel (eventos elegidos según tus gustos, con aviso la víspera); viajes al extranjero con la moneda del destino y cambio a euros automático; sitios pendientes en Sitios y en el mapa; e informe anual en PDF y Excel desde Resumen → Año.

**Avisos:** en ⚙ → Avisos los activas y eliges de qué quieres que te avise (eventos, tareas, recibos, caducidades, cumpleaños, viajes y el resumen del domingo).


## Cómo está organizada

Abajo hay cinco botones: **Hoy** (tu resumen del día), **Agenda** (calendario, tareas, eventos fijos, grupos y caducidades), **＋** (apuntar cualquier cosa, también por voz), **Dinero** (resumen, cuentas, recibos, precios y coche) y **Lugares** (mapa, sitios y viajes). Personas, Ocio, Partituras y Ajustes están al final de Hoy.

## Novedades: voz, correo, compartir y más

- **Apunta día:** un segundo icono en el móvil. «Ok Google, abre Apunta día» y dicta: gastos, eventos, tareas, recordatorios («recuérdame mañana a las 9…»), sitios con su gasto y su nota, canciones para Spotify, partituras o «borra lo último». También desde el panel de ajustes rápidos y el botón 🎙 de los widgets.
- **Widgets:** Hoy, Calendario (el mes con los días marcados) y Tareas.
- **Por revisar:** lo que llega del correo, de las capturas de Trade Republic y de lo que compartes con la app.
- **Eventos fijos:** lo que se repite cada semana; solo aparece al entrar en el día.
- **Partituras:** búsqueda en IMSLP de obras para piano solo, con la mejor edición descargable.
- **Correo:** el script `correo/Codigo.gs` va en script.google.com (ver las instrucciones dentro del archivo).

## 7. Actualizar la app

**No hace falta reinstalar el APK.** La app del móvil se carga desde tu web de GitHub Pages: cuando cambias `index.html` en GitHub, la próxima vez que abras la app con internet ya tendrás la versión nueva (puede tardar unos minutos en llegar). Sin conexión, abre la última versión que descargó.

Solo hace falta instalar un APK nuevo si cambia la parte de Android (el widget, los permisos o el icono). En ese caso GitHub lo fabrica solo y lo publica en Releases; instálalo encima del anterior y tus datos se mantienen.

La primera vez que abras la app necesita internet para descargarse.

## 8. Si algo falla

- **El APK o los eventos no se crean**: pestaña Actions → abre la ejecución en rojo → copia el error y pásaselo a Claude.
- **No salen eventos**: revisa que el secreto `GEMINI_API_KEY` existe y lanza «Eventos de Teruel» a mano.
- **No salen gasolineras**: lanza «Gasolineras» a mano en la pestaña Actions y mira si da error.
- **Gemini da error en la app**: ⚙ → «Probar». Si el modelo deja de existir, cambia `gemini-flash-latest` por el que recomiende Google.

## Qué hay en cada archivo

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app entera |
| `eventos.json` | Los eventos de Teruel (lo actualiza GitHub cada mañana) |
| `scripts/eventos.mjs` | El buscador de eventos con Gemini |
| `scripts/gasolineras.mjs`, `.github/workflows/gasolineras.yml` | Descarga los precios de las gasolineras cada hora |
| `.github/workflows/eventos.yml` | Lanza la búsqueda cada mañana |
| `.github/workflows/apk.yml` | Fabrica el APK |
| `android/` | Widget, permisos y firma del APK |
| `capacitor/` | Configuración para convertir la web en app de Android |
| `sw.js`, `manifest.webmanifest`, `icons/` | Para instalarla como app web y que abra sin conexión |
| `offline.html` | Pantalla que sale si abres la app por primera vez sin internet |
| `vendor/` | Librerías del mapa y de las copias |

El repositorio es público, pero **solo contiene el código y los eventos de Teruel**. Tus apuntes, fotos y claves se quedan en tu móvil.
