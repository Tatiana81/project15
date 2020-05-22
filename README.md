## Проектная работа № 15 Яндекс.Практикум

### Содержание
1. [Структура проекта](#structure)
2. [Этапы установки](#install)
3. [Конфигурационные файлы проекта](#config)
4. [Используемые модули](#modules)
5. [Версия](#version)
6. [Ссылка](#link)
7. [Автор](#author)


<a name='#structure'></a>
### Структура проекта
    ./routes - папка, содержащая роуты для обработки запросов пользователей
    ./controllers - папка с контроллерами
    ./models - папка, содержащая схемы mongodb
    ./middlewarez - папка, содержащая скрипт авторизации
    ./errors - папка, содержащая скрипты ошибок


<a name='#install'></a>
### Этапы установки
    Клонировать репозиторий

    git clone https://github.com/Tatiana81/YP-project13.git

    Установить пакеты, указанные в разделе Используемые модули, с помощью npm install
    
    Запустить сервер pm2 start app.js
    
    Использовать программу типа Postman для отправки и получения ответов

<a name='config'></a>
### Конфигурационные файлы проекта:

    package.json – общие настройки npm, включая скрипты запуска, точку входа, установленные модули
    
    .eslintrc - параметры настройки ESLint
    
    .editorconfig - парметры настройки редактора

    app.js - точка входа. Скрипт, который запускается при старте сервера


<a name='modules'></a>
### Используемые модули
    bcryptjs: 2.4.3,
    body-parser: 1.19.0,
    celebrate: 12.1.1,
    cookie-parser: 1.4.5,
    dotenv: 8.2.0,
    express: 4.17.1,
    express-winston: 4.0.3,
    joi: 14.3.1,
    jsonwebtoken: 8.5.1,
    mongoose: 5.9.9,
    nodemon: 2.0.2,
    validator: 13.0.0,
    winston: 3.2.1,
    eslint: 6.8.0,
    eslint-config-airbnb-base: 14.1.0,
    eslint-plugin-import: 2.20.2

<a name='version'></a>
### Версия: 1.0.0

<a name='link'></a>
### Ссылка на адрес страницы: https://tatiana81.github.io/project15/

<a name='author'></a>
### Автор: Суроева Татьяна
