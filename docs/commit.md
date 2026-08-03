# Правила коммитов

## Автор

Все коммиты от имени:
```
Efim Timofeev <efimt74@gmail.com>
```

**Без Co-Authored-By, без упоминания AI/Claude/Copilot.** Никогда.

## Формат

Conventional commits, английский:

```
feat: add product card component
fix: correct price formatting for ruble
refactor: extract search logic into hook
docs: update deployment guide
chore: bump next.js to 16.3
```

- Первая строка < 70 символов, lowercase, без точки в конце.
- Пустая строка, потом body если нужно пояснение.
- Без эмодзи.

## Что коммитить

- Атомарные коммиты: одна логическая единица изменений.
- Не смешивать feat + refactor + fix в одном коммите.

## Что НЕ коммитить

- `.env`, секреты, ключи, токены.
- `node_modules/`, `.next/`, `dist/`.
- `console.log`, TODO-хаки, временный код.
- Большие бинарники (>1MB) без необходимости.
