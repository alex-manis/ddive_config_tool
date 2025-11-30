# Развертывание Frontend на GitHub Pages

## Настройка API URL

Frontend автоматически определяет, использовать ли production API или localhost:

- **Production** (GitHub Pages): `https://config-tool-backend.onrender.com/api`
- **Development** (localhost): `http://localhost:3001/api`

## Ручная настройка API URL

Если нужно изменить API URL, отредактируйте `public/index.html`:

```html
<script>
  window.API_BASE_URL = "https://your-custom-api-url.com/api";
</script>
<script type="module" src="client/app.js"></script>
```

Или измените `PRODUCTION_API_URL` в `src/utils/constants.ts`.

## Развертывание на GitHub Pages

1. **Соберите проект:**
   ```bash
   npm run build
   ```

2. **Закоммитьте и запушьте:**
   ```bash
   git add .
   git commit -m "Build for production"
   git push
   ```

3. **Настройте GitHub Pages:**
   - Зайдите в Settings → Pages
   - Source: выберите папку `public` или branch с папкой `public`
   - Сохраните

4. **Проверьте CORS на бэкенде:**
   - Убедитесь, что URL вашего GitHub Pages добавлен в `ALLOWED_ORIGINS` на Render
   - Или добавьте его в код бэкенда

## Проверка после развертывания

1. Откройте ваш GitHub Pages URL
2. Откройте консоль браузера (F12)
3. Проверьте, что запросы к API проходят успешно
4. Если видите CORS ошибку - проверьте настройки на Render

## Структура для GitHub Pages

GitHub Pages должен раздавать папку `public/`:
- `public/index.html` - главная страница
- `public/client/` - скомпилированный JavaScript
- `public/assets/` - изображения и ресурсы
- `public/styles.css` - стили


