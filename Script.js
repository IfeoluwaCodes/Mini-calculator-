        let currentOperand = '0';
        let previousOperand = '';
        let operation = undefined;
        let shouldResetScreen = false;
        let ans = 0;
        let isInverse = false;
        let angleMode = 'deg'; // 'deg' or 'rad'

        const currentOperandElement = document.getElementById('currentOperand');
        const previousOperandElement = document.getElementById('previousOperand');

        function updateDisplay() {
            currentOperandElement.innerText = currentOperand;
            if (operation != null) {
                previousOperandElement.innerText = `${previousOperand} ${operation}`;
            } else {
                previousOperandElement.innerText = previousOperand;
            }
        }

        function appendNumber(number) {
            if (shouldResetScreen) {
                currentOperand = '';
                shouldResetScreen = false;
            }
            if (number === 'π') {
                currentOperand = Math.PI.toString();
            } else if (number === 'e') {
                currentOperand = Math.E.toString();
            } else {
                if (currentOperand === '0' && number !== '.') {
                    currentOperand = number.toString();
                } else {
                    currentOperand += number.toString();
                }
            }
            updateDisplay();
        }

        function appendOperator(op) {
            if (currentOperand === '') return;
            if (previousOperand !== '') {
                calculate();
            }
            operation = op;
            previousOperand = currentOperand;
            currentOperand = '';
            updateDisplay();
        }

        function calculate() {
            let computation;
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            
            if (isNaN(prev) || isNaN(current)) return;
            
            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '×':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        alert("Cannot divide by zero!");
                        return;
                    }
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                case '^':
                    computation = Math.pow(prev, current);
                    break;
                case 'exp':
                    computation = prev * Math.pow(10, current);
                    break;
                default:
                    return;
            }
            
            currentOperand = computation.toString();
            operation = undefined;
            previousOperand = '';
            ans = computation;
            shouldResetScreen = true;
            updateDisplay();
        }

        function calculateFunction(func) {
            let value = parseFloat(currentOperand);
            if (isNaN(value)) return;
            
            let result;
            let toRad = angleMode === 'deg' ? Math.PI / 180 : 1;
            let toDeg = angleMode === 'deg' ? 180 / Math.PI : 1;
            
            switch(func) {
                case 'sin':
                    result = isInverse ? Math.asin(value) * toDeg : Math.sin(value * toRad);
                    break;
                case 'cos':
                    result = isInverse ? Math.acos(value) * toDeg : Math.cos(value * toRad);
                    break;
                case 'tan':
                    result = isInverse ? Math.atan(value) * toDeg : Math.tan(value * toRad);
                    break;
                case 'ln':
                    result = isInverse ? Math.exp(value) : Math.log(value);
                    break;
                case 'log':
                    result = isInverse ? Math.pow(10, value) : Math.log10(value);
                    break;
                case 'sqrt':
                    result = Math.sqrt(value);
                    break;
                case 'x²':
                    result = Math.pow(value, 2);
                    break;
                case '!':
                    result = factorial(value);
                    break;
            }
            
            if (isInverse && ['sin', 'cos', 'tan'].includes(func)) {
                isInverse = false;
                updateInverseButtons();
            }
            
            currentOperand = result.toString();
            ans = result;
            shouldResetScreen = true;
            updateDisplay();
        }

        function factorial(n) {
            if (n < 0) return NaN;
            if (n === 0 || n === 1) return 1;
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            return result;
        }

        function toggleInverse() {
            isInverse = !isInverse;
            updateInverseButtons();
        }

        function updateInverseButtons() {
            const buttons = document.querySelectorAll('.btn-scientific');
            buttons.forEach(btn => {
                if (btn.innerText === 'sin') btn.innerText = isInverse ? 'sin⁻¹' : 'sin';
                if (btn.innerText === 'cos') btn.innerText = isInverse ? 'cos⁻¹' : 'cos';
                if (btn.innerText === 'tan') btn.innerText = isInverse ? 'tan⁻¹' : 'tan';
                if (btn.innerText === 'ln') btn.innerText = isInverse ? 'eˣ' : 'ln';
                if (btn.innerText === 'log') btn.innerText = isInverse ? '10ˣ' : 'log';
            });
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

        function getAns() {
            currentOperand = ans.toString();
            shouldResetScreen = true;
            updateDisplay();
        }

        function clearEntry() {
            currentOperand = '0';
            updateDisplay();
        }

        function clearAll() {
            currentOperand = '0';
            previousOperand = '';
            operation = undefined;
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
            if (e.key === '.') appendNumber('.');
            if (e.key === '+') appendOperator('+');
            if (e.key === '-') appendOperator('-');
            if (e.key === '*') appendOperator('×');
            if (e.key === '/') appendOperator('÷');
            if (e.key === '%') appendOperator('%');
            if (e.key === '^') appendOperator('^');
            if (e.key === 'Enter' || e.key === '=') calculate();
            if (e.key === 'Escape') clearAll();
            if (e.key === 'Backspace') {
                currentOperand = currentOperand.slice(0, -1) || '0';
                updateDisplay();
            }
            if (e.key === '(') appendNumber('(');
            if (e.key === ')') appendNumber(')');
        });

        // Initialize
        updateDisplay();
