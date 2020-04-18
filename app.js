const Slimbot = require('slimbot')
const telegramBot = new Slimbot(process.env.BOT_TOKEN)
const password = process.env.PASSWORD

let keyBoards = []
const memberList = []

telegramBot.on('message', msg => {
  const { cmd, data } = getData(msg.text)
  switch (cmd) {
    case '/start':
      if (data !== password) {
        return telegramBot.sendMessage(msg.chat.id, 'password fail')
      }
      joinMember(msg.chat.id, msg.from.first_name)
      telegramBot.sendMessage(msg.chat.id, `歡迎 ${msg.from.first_name} 加入租借服務`)
      break

    case '/initKeyBoard':
      if (checkData(msg.text) === false) {
        return telegramBot.sendMessage(msg.chat.id, 'json format error')
      }
      if (checkAuthority(msg.chat.id, msg.from.first_name) === false) {
        return telegramBot.sendMessage(msg.chat.id, 'authorization fail')
      }
      // 更新KeyBoards
      keyBoards = JSON.parse(data)
      sendKeyBoard(msg.chat.id, 'Keyboard setting completed')
      break

    case '/member':
      if (checkAuthority(msg.chat.id, msg.from.first_name) === false) {
        return telegramBot.sendMessage(msg.chat.id, 'authorization fail')
      }
      var m = '目前會員:\n'
      memberList.forEach((member) => {
        m += member.userName + '\n'
      })
      telegramBot.sendMessage(msg.chat.id, m)
      break

    // 刪除
    case '/deleteMember':
      break

    default:
      if (checkAuthority(msg.chat.id, msg.from.first_name) === false) {
        return telegramBot.sendMessage(msg.chat.id, 'authorization fail')
      }
      var message = getMessage(data, msg.from.id, msg.from.first_name)
      memberList.forEach((member) => {
        sendKeyBoard(member.userID, message)
      })
      break
  }
})

telegramBot.startPolling()

/**
 * 驗證資料正確性
 *
 * @param {string} msg
 */
function checkData (msg) {
  const messages = msg.split('::')
  if (messages.length !== 2) {
    return false
  }

  try {
    JSON.parse(messages[1])
    return true
  } catch (e) {
    return false
  }
}

/**
 * 取得資料
 *
 * @param {string} msg
 */
function getData (msg) {
  const messages = msg.split('::')
  return {
    cmd: (messages.length === 2) ? messages[0] : '',
    data: (messages.length === 2) ? messages[1] : messages[0]
  }
}

/**
 * 傳送訊息與keyboard
 *
 * @param {string} chatID
 * @param {string} text
 */
function sendKeyBoard (chatID, text, keyBoard) {
  telegramBot.sendMessage(
    chatID,
    text,
    {
      reply_markup: JSON.stringify({
        keyboard: getKeyboard(),
        resize_keyboard: false,
        one_time_keyboard: false
      })
    }
  )
}

/**
 * 加入成員
 *
 * @param {number} chatID 使用者ID
 * @param {string} firstName 使用者名稱
 */
function joinMember (chatID, firstName) {
  const memberExist = Object.keys(memberList).find(id => memberList[id].userID === chatID)
  if (memberExist === undefined) {
    memberList.push({ userID: chatID, userName: firstName })
  }
}

/**
 * 檢查是否有權限
 *
 * @param {number} chatID 使用者ID
 * @param {string} firstName 使用者名稱
 */
function checkAuthority (chatID, firstName) {
  const memberExist = Object.keys(memberList).find(id => memberList[id].userID === chatID)
  return memberExist !== undefined
}

/**
 * 取得訊息
 * @param {object} msg telegram訊息物件
 */
function getMessage (msg, fromID, fromFirstName) {
  let message = ''
  Object.keys(keyBoards).forEach(group => {
    Object.keys(keyBoards[group]).forEach(name => {
      if (msg === undefined || msg.indexOf(name) === -1) {
        return
      }

      if (keyBoards[group][name].userID === '') {
        keyBoards[group][name].usage = true
        keyBoards[group][name].userID = fromID
        keyBoards[group][name].userName = fromFirstName
        message = `「${name}」已被 ${fromFirstName} 使用中`
        return
      }

      if (keyBoards[group][name].userID === fromID) {
        keyBoards[group][name].usage = !(keyBoards[group][name].usage)
        keyBoards[group][name].userID = (keyBoards[group][name].usage) ? fromID : ''
        keyBoards[group][name].userName = (keyBoards[group][name].usage) ? fromFirstName : ''
        message = (keyBoards[group][name].usage)
          ? `「${name}」已被 ${fromFirstName} 使用中`
          : `「${name}」已歸還`
        return
      }
      message = `${fromFirstName} 想要使用「${name}」請問 ${keyBoards[group][name].userName} 願不願意借一下?`
    })
  })
  return message
}

/**
 * 取得鍵盤
 */
function getKeyboard () {
  const keyboardArray = []
  Object.keys(keyBoards).forEach((group) => {
    const rows = []
    Object.keys(keyBoards[group]).forEach((name) => {
      if (keyBoards[group][name].usage) {
        rows.push(`✅${name} (${keyBoards[group][name].userName})`)
      } else {
        rows.push(name)
      }
    })
    keyboardArray.push(rows)
  })
  return keyboardArray
}
