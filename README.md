
FakeStatusRTC

FakeStatusRTC — это десктопное приложение на базе Electron, которое позволяет настроить и отправить кастомный Discord Rich Presence статус с помощью удобного графического интерфейса. Работает «из коробки»: Python и все зависимости уже включены в сборку.
🧰 Возможности

    Отправка кастомного Discord RPC-статуса с полями:

        App ID

        Details

        Large Image и его описание (tooltip)

        Small Image и его описание

    Статус обновляется в реальном времени

    Кнопка отключения и автоматическое завершение при закрытии окна

    Индикация подключения

    Быстрый переход на GitHub-репозиторий проекта

🚀 Как начать

Просто:

    Скачай установщик или portable-версию из релизов

    Запусти приложение

    ✅ Не требуется установка Python — всё включено в сборку.

🧪 Как создать Discord-приложение

Чтобы статус работал, нужно создать своё приложение в Discord Developer Portal:

    Перейди в Discord Developer Portal

    Нажми "New Application", придумай название и нажми "Create"

    Перейди в раздел Rich Presence > Art Assets

    Загрузите изображения:

        Одно или несколько Large Images

        Одно или несколько Small Images

    Запомни:

        Client ID — это и есть App ID (вводится в интерфейсе FakeStatusRTC)

        Имена изображений чувствительны к регистру

    Убедись, что Discord запущен на том же компьютере

    💡 Rich Presence отображается всем пользователям, как обычная активность. Не только тебе.

📁 Структура проекта

project-root/
├── CSS/                   # Стили
├── JS/                    # JS-логика интерфейса и связи с Python
├── python/                # Обработка Discord RPC через pypresence
├── index.html             # UI
├── main.js                # Главный процесс Electron
└── package.json           # Конфигурация Electron

📸 Скриншот

Приложение:

    [{E4A0F1E8-F1A1-42D7-8A7D-BA9AE3C7D5E0}](https://github.com/user-attachments/assets/d9051bdf-15ae-43da-b074-a3a961a461df)

Результат работы

    [Uploading {C5D70453-75CE-4CAF-972B-EC4B0B95A3E9}.png…]()


🔗 Ссылки

    Discord Developer Portal - https://discord.com/developers/applications
    Документация pypresence - 
