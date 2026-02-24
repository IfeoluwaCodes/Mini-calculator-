
let currentOperand = '0';
let ans = 0;
let angleMode = 'deg';
let isInverse = false;

const currentOperandElement = document.getElementById('currentOperand');
const previousOperandElement = document.getElementById('previousOperand');

function updateDisplay() {
    currentOperandElement.innerText = currentOperand;
}

function appendNumber(value) {
    if (currentOperand === '0') currentOperand = '';
    currentOperand += value;
    updateDisplay();
}

function appendOperator(op) {
    if (op === '×') op = '*';
    if (op === '÷') op = '/';
    if (op === '^') op = '**';
    if (op === 'exp') op = 'e';
    currentOperand += op;
    updateDisplay();
}

function clearEntry() {
    currentOperand = '0';
    updateDisplay();
}

function clearAll() {
    currentOperand = '0';
    previousOperandElement.innerText = '';
    updateDisplay();
}

function getAns() {
    currentOperand = ans.toString();
    updateDisplay();
}

function setMode(mode) {
    angleMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === mode) {
            btn.classList.add('active');
        }
    });
}

function toggleInverse() {
    isInverse = !isInverse;
}

function toRadians(val) {
    return angleMode === 'deg' ? val * Math.PI / 180 : val;
}

function toDegrees(val) {
    return angleMode === 'deg' ? val * 180 / Math.PI : val;
}

function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
}

function calculateFunction(func) {
    try {
        let value = evaluateExpression(currentOperand);
        let result;

        switch(func) {
            case 'sin':
                result = isInverse ? toDegrees(Math.asin(value)) : Math.sin(toRadians(value));
                break;
            case 'cos':
                result = isInverse ? toDegrees(Math.acos(value)) : Math.cos(toRadians(value));
                break;
            case 'tan':
                result = isInverse ? toDegrees(Math.atan(value)) : Math.tan(toRadians(value));
                break;
            case 'ln':
                if (value <= 0) throw "Invalid input";
                result = isInverse ? Math.exp(value) : Math.log(value);
                break;
            case 'log':
                if (value <= 0) throw "Invalid input";
                result = isInverse ? 10 ** value : Math.log10(value);
                break;
            case 'sqrt':
                if (value < 0) throw "Invalid input";
                result = Math.sqrt(value);
                break;
            case 'x²':
                result = value ** 2;
                break;
            case '!':
                result = factorial(value);
                break;
        }

        if (!isFinite(result)) throw "Math Error";

        currentOperand = result.toString();
        ans = result;
        isInverse = false;
        updateDisplay();

    } catch {
        alert("Invalid Input");
    }
}

function evaluateExpression(expression) {
    expression = expression
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/√/g, 'Math.sqrt')
        .replace(/\^/g, '**')
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/%/g, '/100');

    return Function('"use strict";return (' + expression + ')')();
}

function calculate() {
    try {
        let result = evaluateExpression(currentOperand);
        if (!isFinite(result)) throw "Error";
        currentOperand = result.toString();
        ans = result;
        updateDisplay();
    } catch {
        alert("Invalid Expression");
    }
}

/* Keyboard Support */
document.addEventListener('keydown', (e) => {
    if (!isNaN(e.key)) appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (['+', '-', '*', '/', '(', ')'].includes(e.key)) appendNumber(e.key);
    if (e.key === 'Enter') calculate();
    if (e.key === 'Backspace') {
        currentOperand = currentOperand.slice(0, -1) || '0';
        updateDisplay();
    }
    if (e.key === 'Escape') clearAll();
});

updateDisplay();
