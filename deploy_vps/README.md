# Despliegue en VPS con Docker, dominio publico y Certbot

Esta carpeta contiene los ficheros para publicar la app Angular SSR en una VPS. La app corre dentro de Docker en `127.0.0.1:4000` y Nginx, instalado en la VPS, publica el dominio con HTTPS usando Certbot.

## Ficheros incluidos

- `Dockerfile`: construye la app Angular y ejecuta el servidor SSR con Node.
- `docker-compose.yml`: levanta el contenedor de la web en el puerto local `4000`.
- `nginx/lj-public-web.conf`: configuracion de Nginx para proxy inverso y certificado Let's Encrypt.

## 1. Preparar DNS

En el proveedor del dominio, crea estos registros apuntando a la IP publica de la VPS:

```txt
A     tudominio.com       IP_DE_LA_VPS
A     www.tudominio.com   IP_DE_LA_VPS
```

Espera a que propaguen antes de pedir el certificado.

## 2. Instalar dependencias en la VPS

Ejemplo para Ubuntu/Debian:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
sudo systemctl enable --now docker nginx
```

Abre el firewall si lo usas:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 3. Subir el proyecto a la VPS

Clona el repositorio o copia la carpeta del proyecto:

```bash
git clone TU_REPOSITORIO lj-public-web
cd lj-public-web
```

Si lo subes por `scp`/SFTP, entra igualmente en la raiz del proyecto, donde estan `package.json`, `angular.json` y esta carpeta `deploy_vps`.

## 4. Construir y arrancar Docker

Desde la raiz del proyecto:

```bash
docker compose -f deploy_vps/docker-compose.yml up -d --build
docker compose -f deploy_vps/docker-compose.yml ps
```

Comprueba que la app responde localmente en la VPS:

```bash
curl -I http://127.0.0.1:4000
```

## 5. Configurar Nginx

Copia la configuracion de ejemplo:

```bash
sudo cp deploy_vps/nginx/lj-public-web.conf /etc/nginx/sites-available/lj-public-web.conf
sudo ln -s /etc/nginx/sites-available/lj-public-web.conf /etc/nginx/sites-enabled/lj-public-web.conf
```

Edita el fichero y cambia `example.com` y `www.example.com` por tu dominio real:

```bash
sudo nano /etc/nginx/sites-available/lj-public-web.conf
```

Antes de tener certificado, deja temporalmente solo el bloque de `server` de puerto `80`, o comenta el bloque `443`, porque Nginx no arrancara si las rutas de `/etc/letsencrypt/live/...` todavia no existen.

Valida y recarga:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Crear certificado con Certbot

Ejecuta Certbot con tu dominio real:

```bash
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

Certbot puede modificar el fichero de Nginx para activar HTTPS automaticamente. Cuando termine:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Comprueba la renovacion automatica:

```bash
sudo certbot renew --dry-run
```

## 7. Actualizar la app

Cuando haya cambios nuevos:

```bash
git pull
docker compose -f deploy_vps/docker-compose.yml up -d --build
docker image prune -f
```

## 8. Comandos utiles

Ver logs:

```bash
docker compose -f deploy_vps/docker-compose.yml logs -f web
```

Reiniciar:

```bash
docker compose -f deploy_vps/docker-compose.yml restart web
```

Parar:

```bash
docker compose -f deploy_vps/docker-compose.yml down
```

## 9. Notas del proyecto

- El build actual genera una app Angular SSR porque `angular.json` tiene `outputMode: "server"` y `ssr.entry: "src/server.ts"`.
- El servidor Node escucha en `PORT`, con valor por defecto `4000`.
- La API de produccion esta configurada en `src/environments/environments.prod.ts` como `https://api-v2.ljconstrutic.com/v1`.
- Si el dominio final de la web no es el mismo que la API, revisa CORS en la API.
- Para que el build Docker no dependa de llamadas remotas durante SSR, las cargas iniciales de sesion, idiomas y componentes se ejecutan solo en navegador.
- El build puede mostrar un warning de presupuesto por el bundle inicial, pero no impide desplegar mientras no supere el `maximumError` configurado en `angular.json`.
