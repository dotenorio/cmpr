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

function erase () {
  const float = document.querySelector('#float')
  float.innerHTML = 0.0
}

function getSalaryPerMinute (salary) {
  const salaryPerDay = salary / 30
  const salaryPerHour = salaryPerDay / 8
  const salaryPerMinute = salaryPerHour / 60
  return salaryPerMinute
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
}

function initMeetAverage (salary) {
  erase()
  const average = getSalaryPerMinute(salary)
  const startTime = initTheClock()
  adjustValue(average, startTime)
  clock()
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
})

const startAverage = document.querySelector('#startAverage')
startAverage.addEventListener('click', () => {
  const salary = document.querySelector('input[name="salaryAverage"]')
  initMeetAverage(salary.value)
})
