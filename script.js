class Calculator {
  constructor(previousOperandTextElement, currentOperandTextElement) {
    this.previousOperandTextElement = previousOperandTextElement;
    this.currentOperandTextElement = currentOperandTextElement;
    this.readyToReset = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '';
    this.previousOperand = '';
    this.operation = undefined;
    this.readyToReset = false;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    this.readyToReset = false;
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.operation === '√') return;
    this.currentOperand = this.currentOperand.toString() + number.toString();
  }

 makeNumberNegative() {
   if (this.currentOperand[0] === '-') {
    this.currentOperand = this.currentOperand.substr(1);
   } else {
    this.currentOperand = '-' + this.currentOperand.toString();
   }
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '' && this.previousOperand !== '') {
      this.compute();
    }

    this.operation = operation;

    this.previousOperand = this.currentOperand;
    this.currentOperand = '';
  }

  compute() {
    let computation;
    let prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || (isNaN(current) && this.operation !== '√')) return;
    switch (this.operation) {
      case '+':
        computation = prev + current;
        break
      case '-':
        computation = prev - current;
        break
      case '*':
        computation = prev * current;
        break
      case '÷':
        if (current === 0) {
          computation = NaN;
          span.appendChild(errorMessage);
        } else {
          computation = prev / current;
        }
        break
      case '^':
        if (prev.toString()[0] === '-') {
          prev = prev.toString().substr(1);
          computation = -Math.pow(prev, current);
        } else {
          computation = Math.pow(prev, current);
        }
        break;
      default:
        return;
    }
    this.readyToReset = true;
    computation = Number(computation.toFixed(14));
    this.currentOperand = computation;
    this.operation = undefined;
    this.previousOperand = '';
  }

  computeSqrt() {
    
    let computation;
    let prev = parseFloat(this.previousOperand);
    let current = parseFloat(this.currentOperand);

    if (isNaN(current)) return;

    if(current.toString()[0] === '-') {
      span.appendChild(errorMessage);
      computation = Math.sqrt(current);

      this.readyToReset = true;
      computation = Number(computation.toFixed(14));
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = '';

    } else if (isNaN(prev)) {
      computation = Math.sqrt(current);

      this.readyToReset = true;
      computation = Number(computation.toFixed(14));
      this.currentOperand = computation;
      this.operation = undefined;
      this.previousOperand = '';
    } else {
      computation = Math.sqrt(current);
      this.currentOperand = computation;
    }
  }

  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandTextElement.innerText =
      this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandTextElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandTextElement.innerText = '';
    }
  }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const minusPlusButton = document.querySelector('[data-minus-plus]');


const sqrtButton = document.querySelector('[data-sqrt]');

const span = document.querySelector('.error-message');
const errorMessage = document.createElement('span');
errorMessage.innerText = 'error';

const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

numberButtons.forEach(button => {
  button.addEventListener("click", () => {

    if(calculator.previousOperand === "" &&
    calculator.currentOperand !== "" &&
  calculator.readyToReset) {
        calculator.currentOperand = "";
        calculator.readyToReset = false;
    }
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();

    if (span.innerHTML === '<span>error</span>') {
      span.removeChild(errorMessage);
    }
  })
})


operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.innerText === 'xy') {
      calculator.chooseOperation('^');
    } else {
      calculator.chooseOperation(button.innerText);
    }
    
    calculator.updateDisplay();
    if (span.innerHTML === '<span>error</span>') {
      span.removeChild(errorMessage);
    }
  })
})

equalsButton.addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
})

sqrtButton.addEventListener('click', button => {
  calculator.computeSqrt();
  calculator.updateDisplay();
})

allClearButton.addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
  if (span.innerHTML === '<span>error</span>') {
    span.removeChild(errorMessage);
  }
})

deleteButton.addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
  if (span.innerHTML === '<span>error</span>') {
    span.removeChild(errorMessage);
  }
})

minusPlusButton.addEventListener('click', button => {
  calculator.makeNumberNegative();
  calculator.updateDisplay();
  if (span.innerHTML === '<span>error</span>') {
    span.removeChild(errorMessage);
  }
})