# Telegram Bot Rental Board

![demo](/doc/demo.jpg)

## Docker Build
```
docker build . -t telegram-bot-rental-board:latest
```
## Docker image save to tar
```
docker save telegram-bot-rental-board:latest > telegram-bot-rental-board.tar
```
## Docker image save to gz
```
docker save telegram-bot-rental-board:latest | gzip telegram-bot-rental-board.gz
```
## Docker 載入 
```
docker load < telegram-bot-rental-board.gz
```
## Run Docker
```
docker run -d -e BOT_TOKEN="bot金鑰" -e PASSWORD="加入機器人通關密碼" telegram-bot-rental-board:latest
```

## 使用方法

1. 啟動機器人
```
/start::加入機器人通關密碼
```

2. 初始化鍵盤
```
/initKeyBoard::[
    {
        "iPhone 7": {
            "usage": false,
            "userID": "",
            "userName": ""
        },
        "iPhone 8": {
            "usage": false,
            "userID": "",
            "userName": ""
        },
        "iPhone X": {
            "usage": false,
            "userID": "",
            "userName": ""
        }
    },
    {
        "iPhone 11": {
            "usage": false,
            "userID": "",
            "userName": ""
        },
        "iPhone SE2": {
            "usage": false,
            "userID": "",
            "userName": ""
        }
    }
]
```

3. 即可點選鍵盤使用租借功能
