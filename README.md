# ElectronPassManger

**ElectronPassManger** — это простой и удобный инструмент для безопасного хранения и управления вашими паролями. Разработанный с использованием **ElectronJS**, **React** и **TypeScript**, этот менеджер предлагает интуитивно понятный интерфейс. Пароли сохраняются локально в зашифрованном виде.

![Electron.js](https://img.shields.io/badge/Electron.js-47848F?style=for-the-badge&logo=electron&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Ant Design](https://img.shields.io/badge/Ant%20Design-0170FE?style=for-the-badge&logo=antdesign&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

### Основные возможности:

Приложение имеет три основные вкладки:
  - **Добавить пароль**: Добавление новых учетных записей и паролей.
  - **Рабочие**: Список учетных записей и паролей связанных с работой.
  - **Личные**: Список учетных записей и паролей для личного использования.

Так же можно генерировать пароли с помощью **встроенного генератора паролей**.

### Установка

Для установки всех зависимостей выполните следующую команду в терминале:

```bash
$ npm install
```

Для настройки базы данных (Prisma):

```bash
$ npx prisma migrate dev --name init
```

### Запуск в режиме разработки

```bash
$ npm run dev
```

### Сборка

```bash
# Для windows
$ npm run build:win

# Для macOS
$ npm run build:mac

# Для Linux
$ npm run build:linux
```
