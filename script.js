// Calculator state
let display = document.getElementById('display');
let currentInput = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    currentInput = digit;
    waitingForSecondOperand = false;
  } else {
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }
  updateDisplay();
}

function inputDecimal(dot) {
  if (waitingForSecondOperand) {
    currentInput = '0.';
    waitingForSecondOperand = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes(dot)) {
    currentInput += dot;
  }
  updateDisplay();
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentInput);
  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }
  if (firstOperand === null && !isNaN(inputValue)) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation(operator, firstOperand, inputValue);
    if (result !== undefined) {
      currentInput = String(result);
      firstOperand = result;
      updateDisplay();
    }
  }
  operator = nextOperator;
  waitingForSecondOperand = true;
}

function performCalculation(operator, first, second) {
  switch (operator) {
    case 'add': return first + second;
    case 'subtract': return first - second;
    case 'multiply': return first * second;
    case 'divide': return second === 0 ? 'Error' : first / second;
  }
}

function resetCalculator() {
  currentInput = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function backspace() {
  if (waitingForSecondOperand) return;
  if (currentInput.length === 1) {
    currentInput = '0';
  } else {
    currentInput = currentInput.slice(0, -1);
  }
  updateDisplay();
}

function updateDisplay() {
  display.textContent = currentInput;
}

const buttons = document.querySelector('.buttons');
buttons.addEventListener('click', event => {
  const target = event.target;
  if (!target.matches('button')) return;

  // Animate button press
  target.classList.add('pressed');
  setTimeout(() => target.classList.remove('pressed'), 100);

  if (target.dataset.number) {
    if (target.dataset.number === '.') {
      inputDecimal('.');
    } else {
      inputDigit(target.dataset.number);
    }
  } else if (target.dataset.action) {
    switch (target.dataset.action) {
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        handleOperator(target.dataset.action);
        break;
      case 'equals':
        handleOperator(null);
        operator = null;
        firstOperand = null;
        waitingForSecondOperand = false;
        break;
      case 'clear':
        resetCalculator();
        break;
      case 'backspace':
        backspace();
        break;
    }
  }
});

// Initialize
updateDisplay();
