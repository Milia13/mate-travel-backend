# Mate & Travel

Plataforma para conectar viajeros y encontrar compañeros de ruta en Argentina. 

## 🚀 Cómo hacer andar el proyecto

Para correr el proyecto en tu computadora de forma local, seguí estos pasos:

### 1. Requisitos previos
- Necesitás tener instalado **Node.js**.
- Necesitás tener **MongoDB** corriendo en tu computadora (por defecto en `mongodb://127.0.0.1:27017`).

### 2. Instalación de dependencias
Abrí una terminal en la carpeta `backend` e instalá las librerías necesarias ejecutando:
```bash
cd backend
npm install
```

### 3. Poblar la base de datos (Seed)
Para tener usuarios con los que interactuar y poder probar la aplicación, preparamos un script que crea 10 perfiles automáticamente. En la carpeta `backend`, ejecutá:
```bash
node seed.js
```
*(Si ejecutás esto más de una vez, simplemente te avisará que los usuarios ya existen).*

### 4. Levantar el servidor
Una vez instaladas las dependencias y poblada la base de datos, levantá el servidor principal que maneja la API, los WebSockets del chat y sirve los archivos del frontend:
```bash
node app.js
```
Vas a ver un mensaje indicando que el servidor está corriendo.

### 5. Acceder a la aplicación
Abrí tu navegador web e ingresá a:
**http://localhost:3000**


---

## 👥 Credenciales de Prueba (Perfiles Semilla)

Al ejecutar `node seed.js`, se crearon 10 perfiles con diferentes estilos de viaje. Podés iniciar sesión con cualquiera de ellos para probar la aplicación desde distintas perspectivas (o usar distintos navegadores a la vez para probar el chat en vivo).

**La contraseña para TODOS los perfiles es:** `mate1234`

### Lista de correos disponibles:
1. `tomas@mate.com` (Mochilero, aventurero)
2. `sofia@mate.com` (Confort, medio)
3. `martin@mate.com` (Camping, mochilero)
4. `caro@mate.com` (Cultural, económico)
5. `juan@mate.com` (Relax, premium)
6. `lucia@mate.com` (Social, playa)
7. `nico@mate.com` (Deportes extremos)
8. `valentina@mate.com` (Vinos, gourmet)
9. `ana@mate.com` (Cultural, historia)
10. `felipe@mate.com` (Social, idiomas)

---
*Desarrollado para facilitar encuentros y aventuras por Argentina.*
