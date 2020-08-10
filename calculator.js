let output = []; //То, что выводится на дисплей в "display"
let buttons = document.getElementsByClassName("button"); //То, что вводится с клавиатуры калькулятора
let buttonEquals = document.querySelector(".equals"); //Кнопка "равно"
let buttonClean = document.getElementById("clean"); //Кнопка "очистить"
let display = document.getElementById("input");

const signs = {
    "+": function (a, b) {
        return a + b;
    },
    "-": function (a, b) {
        return a - b;
    },
    "x": function (a, b) {
        return a * b;
    },
    "÷": function (a, b) {
        return a / b;
    }
};

buttonClean.onclick = () => {    //Очистка дисплея
    display.innerHTML = null;
    output = [];
};

for (let button of buttons) {
    button.onclick = () => handleButtonAction(button);
}

buttonEquals.onclick = () => calculate(output); //Действие по нажатию "равно"

function calculate(expression) {       //Функция для "равно"
    if (!isNaN(expression[expression.length - 1])) {
        let joinedExpression = joinNumbers(expression);
        let rpnExpression = convertToRPN(joinedExpression);
        display.innerHTML = calculateRPN(rpnExpression);
        output = [];
    } else {
        alert("Finish the expression");
    }
}

function joinNumbers(input) {
    let joinedStr = input.join("");
    let resultStr = "";
    for (let char of joinedStr) {
        if (char === "x" || char === "+" || char === "-" || char === "÷") {
            char = " " + char + " ";
        }
        resultStr = resultStr + char;
    }
    return resultStr.split(" ");
}

function convertToRPN(input) {
    for (let i = 0; i < input.length - 1; i++) {
        if ((input[i] === "x" || input[i] === "÷") && input[i + 1] !== "+" && input[i + 1] !== "-" && input[i + 1] !== "x" && input[i + 1] !== "÷") {
            let value = input[i];
            input[i] = input[i + 1];
            input[i + 1] = value;
        }
    }

    let result = [];

    loop: for (let i = 0; i < input.length; i++) {
        let current = input[i];
        if (current === "+" || current === "-") {
            for (let j = i + 1; j < input.length; j++) {
                if (input[j] === "+" || input[j] === "-") {
                    i = j - 1;
                    break;
                }
                result.push(input[j]);
                if (j === input.length - 1) {
                    result.push(current);
                    break loop;
                }
            }
        }
        result.push(current);
    }
    return result;
}

function calculateRPN(input) {

    let result = [];

    for (let part of input) {
        if (part in signs) {
            let b = +(result.pop());
            let a = +(result.pop());
            result.push(signs[part](a, b));
        } else {
            result.push(part);
        }
    }
    return result.join("");
}

function handleButtonAction(button) {
    if (output.length === 0 && isNaN(+(button.innerHTML)) && button.innerHTML !== "-") {  //Позваляет начать строку с цифры или со знака минус
        return;
    }
    if (button.innerHTML === "." && (checkExistingPoint(output))) {
        return;
    }
    if (output.length === 1 && isNaN(output[output.length - 1]) && button.classList.contains("sign")) {
        return;
    }
    if (isNaN(output[output.length - 1]) && button.classList.contains("sign")) { //Не дает писать два знака подряд
        output.pop();
    }

    output.push(button.innerHTML); //Сохраняем значения в "вывод на дисплей"
    display.innerHTML = output.join(""); //Выводим

    function checkExistingPoint(input) {  //Отображение точки
        let joinedStr = input.join("");
        let resultStr = "";

        for (let char of joinedStr) {
            if (char === "x" || char === "+" || char === "-" || char === "÷") {
                char = " ";
            }
            resultStr = resultStr + char;
        }

        let result = resultStr.split(" ");
        return result[result.length - 1].includes(".");
    }
}
