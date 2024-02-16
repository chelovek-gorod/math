'use strict';
 
const divHp = document.getElementById('hp')
const divScore = document.getElementById('score')
const divTask = document.getElementById('task')
const divTime = document.getElementById('time')
const input = document.getElementById('input')
const button = document.getElementById('button')
button.onclick = getAnswer

let hp = 100
divHp.innerText = `HP = ${hp}`
let score = 0
divScore.innerText = `Очки: ${score}`
divTime.innerText = 0

let timeStamp = 0.0

const question = {
    integers: 2,
    signsList: ['+', '-', '*'],
    counter: 0,
    answer: 0,
    score: 0,
    time: 0,
}
alert('Начинаем!')
input.focus()
nextQuestion()

// 2 * 7 * 4 + 9
// 0 + 14

function nextQuestion() {
    input.value = ''
    question.score = 0

    let integers = []
    for (let i = 0; i < question.integers; i++) {
        integers.push( Math.ceil( Math.random() * 9 ) )
    }
    let signs = []
    for (let i = 1; i < question.integers; i++) {
        let signIndex = Math.floor( Math.random() * question.signsList.length )
        let sign = question.signsList[ signIndex ]
        signs.push( sign )
        question.score += (sign === '*') ? 2 : 1
    }

    question.counter++
    if (question.counter === question.integers) {
        question.counter = 0
        question.integers++
    }

    // show question
    divTask.innerText = integers[0]
    for (let i = 0; i < signs.length; i++) {
        divTask.innerText += ' ' + signs[i] + ' ' + integers[i + 1]
    }

    // check multiply
    for (let i = 0; i < signs.length; i++) {
        if (signs[i] === '*') {
            integers[i + 1] *= integers[i]
            integers[i] = 0
            signs[i] = '+'
        }
    }

    // check rest
    question.answer = integers[0]
    for (let i = 0; i < signs.length; i++) {
        if (signs[i] === '-' && integers[i + 1] === 0) {
            integers[i + 1] = integers[i]
            signs[i + 1] = '-'
        } else {
            question.answer += (signs[i] === '+') ? integers[i + 1] : -integers[i + 1]
        }
    }

    input.focus()
    question.time = question.score * 1000 * 3
    timeStamp = performance.now()
    requestAnimationFrame(timer)
}

function getAnswer() {
    if (question.time <= 0) return

    if (+input.value === question.answer) {
        let qTime = question.score * 3
        let aTime = qTime - (question.time / 1000) //.toFixed(1)
        let timeDescription = `\nНа вопрос давалось ${qTime} секунд\nвы справились за ${aTime.toFixed(1)}\n`
        let combo = Math.floor( qTime / aTime )
        if (combo > 1) question.score *= combo
        alert(`Точно!${timeDescription}\n+ ${question.score} очков!${(combo > 1) ? '\nКОМБО X ' + combo : ''}`)

        score += question.score
        divScore.innerText = `Очки: ${score}`
    } else {
        alert(`Нет! Правильный ответ: ${question.answer}`)
        hp -= question.score
        divHp.innerText = `HP = ${hp}`
    }
    if (hp > 0) nextQuestion()
    else alert(`Вы продули...`)
}

function timer(timeOut) {
    let delta = timeOut - timeStamp
    timeStamp = timeOut

    question.time -= delta
    if (question.time > 0) {
        divTime.innerText = (question.time / 1000).toFixed(1)
        requestAnimationFrame(timer)
    } else {
        question.time = 0
        divTime.innerText = question.time.toFixed(1)

        alert(`Время вышло!\nПравильный ответ: ${question.answer}`)
        hp -= question.score
        divHp.innerText = `HP = ${hp}`
        if (hp > 0) nextQuestion()
        else alert(`Вы продули...`)
    }
}

addEventListener('keypress', getKey)
function getKey(event) {
    if (event.key === 'Enter') getAnswer()
}