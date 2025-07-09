FakeStatusRTC

FakeStatusRTC — это десктопное приложение на базе Electron, позволяющее создавать и отправлять кастомный Discord Rich Presence статус через интерфейс. Приложение взаимодействует с Discord API с помощью библиотеки pypresence (Python), управляя статусом в реальном времени.
📦 Возможности

    Ввод параметров для Discord RPC:

        App ID

        Details

        Large Image и текст к нему

        Small Image и текст к нему

    Запуск и остановка RPC-сессии

    Индикация состояния подключения

    Быстрый переход на GitHub репозиторий проекта

🧱 Стек технологий

    Frontend/UI: HTML, CSS, JavaScript

    Backend-интеграция: Electron (с использованием ipcRenderer)

    Discord Integration: Python + pypresence

🖥️ Скриншот

Скриншот интерфейса <!-- Добавь скрин, если есть -->
🚀 Установка и запуск
1. Установи зависимости

npm install
pip install pypresence

2. Запусти приложение
В режиме разработки

npm start

Убедись, что у тебя установлен Python и доступна библиотека pypresence.
3. Структура проекта

project-root/
├── CSS/
│   ├── style.css
│   ├── followButton.css
│   ├── SumBut.css
│   └── DisHeader.css
├── JS/
│   ├── SendData.js         # Основная логика взаимодействия с формой и Electron
│   └── OpenGit.js          # Кнопка перехода на GitHub
├── index.html              # Главный интерфейс
├── main.js                 # Точка входа Electron
├── python/
│   └── rpc_client.py       # Работа с Discord через pypresence
└── README.md

🧠 Как это работает

    Пользователь вводит данные в форму.

    Нажимает Submit.

    Данные отправляются через ipcRenderer в главный процесс.

    Главный процесс запускает Python скрипт, который устанавливает соединение с Discord через pypresence.

    Индикатор соединения меняет цвет в зависимости от успеха.

⚠️ Важные замечания

    Discord должен быть запущен на компьютере.

    App ID и изображения должны быть заранее добавлены в Discord Developer Portal.

    При закрытии окна соединение будет автоматически разорвано.

💻 Пример запуска Python части отдельно

cd python/
python rpc_client.py

🧑‍💻 Контрибьютинг

Приветствуются идеи, багрепорты и пулл-реквесты! Просто нажми на кнопку "View on GitHub" в приложении или перейди по ссылке ниже.
