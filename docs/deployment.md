# Деплой

## Инфраструктура

| Параметр | Значение |
|---|---|
| Сервер | 81.26.187.166 (Ubuntu 24.04) |
| SSH-пользователь | iefimtimofeev |
| SSH-ключ | `/Users/efim/tools/ssh-keys/key-apr26.pem` |
| Домен | nilesnisad.ru |
| Приложение на сервере | `/var/www/nilesnisad/` |
| Порт приложения | 3001 |
| Процесс-менеджер | PM2 (имя: `nilesnisad`) |
| Веб-сервер | Nginx (reverse proxy) |
| SSL | Certbot (Let's Encrypt) — активировать когда DNS пропагируется |
| Node.js на сервере | v20.20.2 |

## CI/CD

GitHub Actions (`.github/workflows/deploy.yml`). При пуше в `main`:

1. Checkout + `npm ci`
2. `npm run build` (standalone output)
3. rsync трёх директорий на сервер:
   - `.next/standalone/` -> `/var/www/nilesnisad/`
   - `.next/static/` -> `/var/www/nilesnisad/.next/static/`
   - `public/` -> `/var/www/nilesnisad/public/`
4. `pm2 restart nilesnisad`

GitHub Secret `SSH_KEY` содержит приватный ключ `key-apr26.pem`.

## Ручные команды

```bash
# SSH на сервер
ssh -i ~/tools/ssh-keys/key-apr26.pem iefimtimofeev@81.26.187.166

# Логи приложения
pm2 logs nilesnisad

# Перезапуск
pm2 restart nilesnisad

# Статус
pm2 status
```

## SSL (выполнить когда DNS пропагируется)

```bash
sudo certbot certonly --webroot -w /var/www/certbot -d nilesnisad.ru -d www.nilesnisad.ru --non-interactive --agree-tos -m efimt74@gmail.com
```

После получения сертификата — добавить HTTPS-блок в nginx конфиг `/etc/nginx/sites-available/nilesnisad`.
