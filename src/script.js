let adjustValueInterval = null
let clockInterval = null
const resumeObject = {}

function initTheClock () {
  const initClock = document.querySelector('#initClock')
  const startTime = new Date()
  initClock.innerHTML = startTime.toLocaleString()

  return startTime
}

function getDuration (startTime) {
  const dateNow = new Date()
  const duration = document.querySelector('#duration')
  const minutes = parseInt(Math.ceil(dateNow - startTime) / 1000 / 60)
  const minutesPlural = minutes === 1 ? 'minuto' : 'minutos'
  duration.innerHTML = `${minutes} ${minutesPlural}`

  if (minutes >= 60) {
    const hours = parseInt(minutes / 60)
    const hourPlural = hours === 1 ? 'hora' : 'horas'

    const normalizeMinutes = minutes - 60 * hours
    const normalizeMinutesPlural =
      normalizeMinutes === 1 ? 'minuto' : 'minutos'

    duration.innerHTML = `${hours} ${hourPlural} e ${normalizeMinutes} ${normalizeMinutesPlural}`
  }
}

function adjustValue (average, startTime) {
  const cost = document.querySelector('#cost')
  const actualValue = parseFloat(cost.innerHTML)
  const newValue = actualValue + average

  cost.innerHTML = newValue.toFixed(2)

  getDuration(startTime)
}

function clock () {
  const dateNow = new Date()
  const actualClock = document.querySelector('#actualClock')

  actualClock.innerHTML = dateNow.toLocaleString()
}

function erase () {
  const cost = document.querySelector('#cost')
  cost.innerHTML = 0.0

  const resumeSalaries = document.querySelector('#resumeSalaries')
  resumeSalaries.style.display = 'none'

  const resumeAverage = document.querySelector('#resumeAverage')
  resumeAverage.style.display = 'none'

  clearInterval(adjustValueInterval)
  clearInterval(clockInterval)
}

function getSalaryPerMinute (salary) {
  const salaryPerDay = salary / 30
  const salaryPerHour = salaryPerDay / 8
  const salaryPerMinute = salaryPerHour / 60
  return salaryPerMinute
}

function toggleForm () {
  const blockOrNone = element => {
    const display = window.getComputedStyle(element, null).display
    return display === 'block' ? 'none' : 'block'
  }

  const elements = ['formStart', 'formStop', 'boxMeeting']

  elements.forEach(element => {
    const selector = document.querySelector(`#${element}`)
    selector.style.display = blockOrNone(selector)
  })
}

function initMeetSalary (salaries) {
  erase()

  const average =
    salaries.reduce((total, salary) => {
      const salaryPerMinute = getSalaryPerMinute(salary)
      return salaryPerMinute + total
    }, 0) / salaries.length

  const startTime = initTheClock()
  adjustValue(average, startTime)
  clock()
  toggleForm()

  adjustValueInterval = setInterval(() => {
    adjustValue(average, startTime)
  }, 60000)

  clockInterval = setInterval(() => {
    clock()
  }, 1000)
}

function initMeetAverage (salary) {
  erase()
  const average = getSalaryPerMinute(salary)
  const startTime = initTheClock()
  adjustValue(average, startTime)
  clock()
  toggleForm()
}

const registrationOptions = document.querySelectorAll(
  'input[name="registrationOption"]'
)
registrationOptions.forEach(option => {
  option.addEventListener('change', e => {
    const divsOptions = document.querySelectorAll('.registrationBox')
    divsOptions.forEach(div => {
      div.style.display = 'none'
    })

    let value = e.target.value
    value = value.charAt(0).toUpperCase() + value.slice(1)
    const div = document.querySelector(`#registration${value}`)
    div.style.display = 'block'

    console.log(value)
    resumeObject.registrationOption = value
  })
})

const addSalary = document.querySelector('#addSalary')
addSalary.addEventListener('click', () => {
  const salariesBox = document.querySelector('#salariesBox')

  const label = document.createElement('label')

  const span = document.createElement('span')
  span.innerHTML = 'R$ '

  const input = document.createElement('input')
  input.setAttribute('type', 'number')
  input.setAttribute('name', 'salaries[]')
  input.setAttribute('placeholder', '0.00')

  const a = document.createElement('a')
  a.setAttribute('href', 'javascript:void(0)')
  a.innerHTML = '&times;'
  a.addEventListener('click', e => {
    e.preventDefault()
    e.target.parentNode.remove()
  })

  label.appendChild(span)
  label.appendChild(input)
  label.appendChild(a)

  salariesBox.appendChild(label)
})

const startSalary = document.querySelector('#startSalary')
startSalary.addEventListener('click', () => {
  const inputSalaries = [
    ...document.querySelectorAll('input[name="salaries[]"]')
  ]

  const salaries = inputSalaries
    .map(inputSalary => {
      return inputSalary.value
    })
    .filter(salary => {
      return salary !== ''
    })

  const alert = document.querySelector('#alert')

  if (salaries.length < 2) {
    alert.innerHTML =
      'Eu preciso de ao menos dois salários válidos para iniciar uma reunião :)'
    alert.style.display = 'block'
    return
  }

  alert.innerHTML = ''
  alert.style.display = 'none'
  initMeetSalary(salaries)

  const currency = document.querySelector('#currency').innerText
  resumeObject.salaries = salaries
    .map(salary => {
      return `${currency} ${salary}`
    })
    .join('\n')
})

const startAverage = document.querySelector('#startAverage')
startAverage.addEventListener('click', () => {
  const salary = document.querySelector('input[name="salaryAverage"]')
  initMeetAverage(salary.value)
  resumeObject.average = salary.value
})

const stopMeet = document.querySelector('#stopMeet')
stopMeet.addEventListener('click', () => {
  console.log(resumeObject.registrationOption)
  const registrationOption = resumeObject.registrationOption || 'Salaries'
  const registrationOptionText =
    registrationOption === 'Salaries' ? 'Salários' : 'Média Salarial'

  const salaries = resumeObject.salaries
  const average = resumeObject.average

  const currency = document.querySelector('#currency').innerText
  const cost = document.querySelector('#cost').innerText
  const initClock = document.querySelector('#initClock').innerText
  const duration = document.querySelector('#duration').innerText

  erase()
  toggleForm()

  document.querySelector(
    '#resumeRegistrationOption > dd'
  ).innerText = registrationOptionText

  console.log(registrationOption)
  document.querySelector(`#resume${registrationOption}`).style.display =
    'block'
  document.querySelector('#resumeSalaries > dd').innerText = salaries
  document.querySelector(
    '#resumeAverage > dd'
  ).innerText = `${currency} ${average}`

  document.querySelector('#resumeCost > dd').innerText = `${currency} ${cost}`
  document.querySelector('#resumeCost > dd').innerText = `${currency} ${cost}`
  document.querySelector('#resumeCost > dd').innerText = `${currency} ${cost}`
  document.querySelector('#resumeInitClock > dd').innerText = initClock
  document.querySelector('#resumeDuration > dd').innerText = duration
  document.querySelector('#resume').style.display = 'block'
})
