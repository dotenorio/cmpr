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
  const float = document.querySelector('#float')
  const actualValue = parseFloat(float.innerHTML)
  const newValue = actualValue + average

  float.innerHTML = newValue.toFixed(2)

  getDuration(startTime)

  setTimeout(() => {
    adjustValue(average, startTime)
  }, 60000)
}

function clock () {
  const dateNow = new Date()
  const actualClock = document.querySelector('#actualClock')

  actualClock.innerHTML = dateNow.toLocaleString()

  setTimeout(() => {
    clock()
  }, 1000)
}

function initMeet (salaries) {
  const average =
    salaries.reduce((total, salary) => {
      const salaryPerDay = salary / 30
      const salaryPerHour = salaryPerDay / 8
      const salaryPerMinute = salaryPerHour / 60
      return salaryPerMinute + total
    }, 0) / salaries.length

  const startTime = initTheClock()
  adjustValue(average, startTime)
  clock()
}

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

  label.appendChild(span)
  label.appendChild(input)
  salariesBox.appendChild(label)
})

const start = document.querySelector('#start')
start.addEventListener('click', () => {
  const inputSalaries = document.querySelectorAll('input[name="salaries[]"]')
  const salaries = [...inputSalaries].map(inputSalary => {
    return inputSalary.value
  })
  initMeet(salaries)
})
