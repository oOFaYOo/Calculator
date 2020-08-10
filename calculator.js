
let output = []; //То, что выводится на дисплей в "display"
let buttons = document.getElementsByClassName("button"); //То, что вводится с клавиатуры калькулятора
let buttonEquals = document.querySelector(".equals"); //Кнопка "равно"
let buttonClean = document.getElementById("clean");
let input = document.getElementById("input");

buttonClean.onclick = () => {    //Очистка дисплея
    input.innerHTML = null;
    output = [];
};

for (let button of buttons) {
    button.onclick = () => {  //При нажатии на копошки...
        if (output.length === 0 && isNaN(+(button.innerHTML)) && button.innerHTML !== "-") {  //Позваляет начать строку с цифры или со знака минус
            return;
        }
        if (button.innerHTML === "." && (checkExistingPoint())) {
            return;
        }
        if(output.length === 1 && isNaN(output[output.length - 1]) && button.classList.contains("sign")){
            return;
        }
        if (isNaN(output[output.length - 1]) && button.classList.contains("sign")) { //Не дает писать два знака подряд
            output.pop();
        }

        output.push(button.innerHTML); //Сохраняем значения в "вывод на дисплей"
        input.innerHTML = output.join(""); //Выводим

        function checkExistingPoint() {  //Отображение точки
            let joinedStr = output.join("");
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
}

buttonEquals.onclick = () => calculate(output); //Действие по нажатию "равно"
//CR(ZarkariaDia): БАГ: сейчас можно ввести выражение не до конца и нажать на equals, например 2x
//CR(ZarkariaDia): БАГ: после нажатия =, при начале ввода знаков, на дисплей возарвщается старое выражение
//CR(ZarkariaDia): Тут тоже непонятно, почему output подается на вход. Аргумент может называться внутрикак угодно.
function calculate(output) {       //Функция для "равно"
    output = joinNumbers(output);
    output = convertToRPN(output);
    output = RPN(output);
    //CR(ZarkariaDia): Уже получали этот элемент.
    input.innerHTML = output.join("");
}

function joinNumbers(output) {
    //CR(ZarkariaDia): Выше уже была подобная логика. Можно вынести в отдельную фукнкцию.
    //CR(ZarkariaDia): Про именование переменных те же самые замечания.
    let outputToString = output.join("");
    let outputString = "";
    for (let char of outputToString) {
        if (char === "x" || char === "+" || char === "-" || char === "÷") {
            //CR(ZarkariaDia): Тут нет смысла ипользовать интерполяцию (обратные ковычки). Можно просто прибавить char как есть.
            char = " " + `${char}` + " ";
        }
        outputString = outputString + char;
    }
    return outputString.split(" ");
}

function convertToRPN(output) {
    //CR(ZarkariaDia): Название аргумента.
    for (let i = 0; i < output.length - 1; i++) {
        if ((output[i] === "x" || output[i] === "÷") && output[i + 1] !== "+" && output[i + 1] !== "-" && output[i + 1] !== "x" && output[i + 1] !== "÷") {
            let value = output[i];
            output[i] = output[i + 1];
            output[i + 1] = value;
        }
    }

    //CR(ZarkariaDia): Вот если бы аргумент не назывался output не нужно было бы изворачиваться со словом new
    let newOutput = [];

    //CR(ZarkariaDia): Название метки можно сделать более содержательным.
    a: for (let i = 0; i < output.length; i++) {
        let current = output[i];
        if (current === "+" || current === "-") {
            for (let j = i + 1; j < output.length; j++) {
                if (output[j] === "+" || output[j] === "-") {
                    i = j - 1;
                    break;
                }
                newOutput.push(output[j]);
                if (j === output.length - 1) {
                    newOutput.push(current);
                    break a;
                }
            }
        }
        newOutput.push(current);
    }
    return newOutput;
}

//CR(ZarkariaDia): Имя функции -- глагол.
function RPN(output) {
    //CR(ZarkariaDia): Этот объект будет создаваться каждый раз при вызове функции. Можно обойтись без этого, если вынести его наружу.
    //CR(ZarkariaDia): Также можно привыкать делать переменные, которые менять не требуется, const.
    //CR(ZarkariaDia): Ну и да. неочевидно, что аргументы к операции применяются с измененным порядком. Легко набажить.
    let signs = {
        "+": function (a, b) {
            return b + a
        },
        "-": function (a, b) {
            return b - a
        },
        "x": function (a, b) {
            return b * a
        },
        "÷": function (a, b) {
            return b / a
        }
    };

    let result = [];

    for (let part of output) {
        if (part in signs) {
            //CR(ZarkariaDia): Можно вытащить элементы массива заранее и передать в явно правильном порядке.
            result.push(signs[part](+(result.pop()), +(result.pop())));
        } else {
            result.push(part);
        }
    }
    //CR(ZarkariaDia): Кажется, что по смыслу результатом работы этой функции всегда должно быть число, а не массив.
    return result;
}