# GREEN-API Chat

Тестовое задание: SPA на React + TypeScript для отправки и получения текстовых сообщений через GREEN-API (мессенджер MAX).

## Стек

- React 18, TypeScript 5.5, Vite 5
- React Router v6
- Zustand (+ persist, sessionStorage для токена)
- Axios
- Tailwind CSS, PostCSS, Autoprefixer
- ESLint, Prettier, Vitest
- Feature-Sliced Design (луковичная архитектура)
- DI-контейнер через интерфейс `IGreenApiClient`

## Архитектура

Слои: `app → pages → widgets → features → entities → shared`.  
Каждый слой зависит только от слоёв ниже.  
Бизнес-логика (`features`, `entities`) не знает о конкретном HTTP-клиенте — только об интерфейсе.  
Конкретная реализация `GreenApiClient` создаётся DI-контейнером и кэшируется по `idInstance + apiTokenInstance`.

## Запуск

```bash
cp .env.example .env
npm install
npm run dev