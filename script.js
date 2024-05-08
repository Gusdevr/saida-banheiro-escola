const nameInput = document.getElementById('name-input')
const startButton = document.getElementById('start-button')
const counterDisplay = document.getElementById('counter-display')
const nameDisplay = document.getElementById('name-display')
const usageDisplay = document.getElementById('usage-display')

let timer = null
let startTime = null
let userName = ''
let usageCount = {}

// onde guardo o estado
if (localStorage.getItem('usageCount')) {
    usageCount = JSON.parse(localStorage.getItem('usageCount'))
}

startButton.addEventListener('click', () => {
    userName = nameInput.value.trim()
    if (userName) {
        startTimer()
        nameDisplay.textContent = `Olá ${userName}, autorizado(a) pelo professor !`
        updateUsageCount()
    }
});

function startTimer() {
    startTime = new Date().getTime()
    timer = setInterval(() => {
        const currentTime = new Date().getTime()
        const timeElapsed = currentTime - startTime
        const minutes = Math.floor(timeElapsed / 60000)
        const seconds = Math.floor((timeElapsed % 60000) / 1000)
        counterDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        if (timeElapsed >= 180000) {
            clearInterval(timer)
            timer = null
            counterDisplay.textContent = '00:00'
            updateUsageCount()
        }
    }, 1000)
}

function updateUsageCount() {
    if (!usageCount[userName]) {
        usageCount[userName] = { count: 1, lastUsed: new Date().toLocaleString() }
    } else {
        usageCount[userName].count++
        usageCount[userName].lastUsed = new Date().toLocaleString()
    }
    localStorage.setItem('usageCount', JSON.stringify(usageCount))
    usageDisplay.textContent = `Você usou o contador ${usageCount[userName].count} vez(es). Última vez usado em ${usageCount[userName].lastUsed}`
}

// parte para resetar o contador
setInterval(() => {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    Object.keys(usageCount).forEach((userName) => {
        if (new Date(usageCount[userName].lastUsed) < yesterday) {
            delete usageCount[userName]
        }
    })
    localStorage.setItem('usageCount', JSON.stringify(usageCount))
}, 24 * 60 * 60 * 1000)