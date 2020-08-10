//CR(ZarkariaDia): НА дисплей
let output = []; //То, что выводится в дисплей
//CR(ZarkariaDia): Тогда уж не input. buttons больше подходит по смыслу.
let input = document.getElementsByClassName("button"); //То, что вводится с клавиатуры калькулятора
let buttonEquals = document.querySelector(".equals"); //Кнопка "равно"

//CR(ZarkariaDia): Логика навешивания обработчиков на кнопки довольно крупная. Можно вынести в отдельную функцию.
for (let part of input) {
    //CR(ZarkariaDia): Вместо part больше подходит button
    part.onclick = () => {  //При нажатии на копошки...
        if (output.length === 0 && isNaN(part.innerHTML) && part.innerHTML !== "-") {  //Позваляет начать строку с цифры или со знака минус
            return;
        }

        //CR(ZarkariaDia): Функция в середине логики. Должна быть в конце.
        //CR(ZarkariaDia): Имя функции -- глагол.
        function point(output) {  //Отображение точки
            let outputToString = output.join("");
            let outputString = "";
            for (let char of outputToString) {
                if (char === "x" || char === "+" || char === "-" || char === "÷") {
                    char = " ";
                }
                outputString = outputString + char;
            }
            output = outputString.split(" ");
            return output[output.length - 1].includes(".");
        }

        if (part.innerHTML === "." && (point(output))) {
            return;
        }
        if (isNaN(output[output.length - 1]) && part.classList.contains("sign")) { //Не дает писать два знака подряд
            output.pop();
        }
        //CR(ZarkariaDia): Раз output -- глобальная переменная, то эта логика легко выносится в функцию Refresh
        output.push(part.innerHTML); //Сохраняем значения в "вывод на дисплей"
        //CR(ZarkariaDia): Зачем снова запрашивать элемент input, если мы это уже делали во второй строчке скрипта?
        document.getElementById("input").innerHTML = output.join(""); //Выводим
    }
}

//CR(ZarkariaDia): buttonClean можно получить заранее по аналогии с buttonEquals
document.getElementById("clean").onclick = () => {    //Очистка дисплея
    //CR(ZarkariaDia): input уже получали
    document.getElementById("input").innerHTML = null;
    output = [];
};

//CR(ZarkariaDia): Код, который будет отрабатывать сразу при открытии страницы (вне функций), и код, сгруппированный по функциям, принято разделять. Например все функции переместить вниз.
buttonEquals.onclick = () => equals(output); //Действие по нажатию "равно"

//CR(ZarkariaDia): Имя функции должно быть глаголом. <Сделать><Что-либо>
function equals(output) {       //Функция для "равно"
    output = joinNumbers(output);
    output = convertToRPN(output);
    output = RPN(output);
    document.getElementById("input").innerHTML = output.join("");
}

function joinNumbers(output) {
    let outputToString = output.join("");
    let outputString = "";
    for (let char of outputToString) {
        if (char === "x" || char === "+" || char === "-" || char === "÷") {
            char = " " + `${char}` + " ";
        }
        outputString = outputString + char;
    }
    return outputString.split(" ");
}

function convertToRPN(output) {
    for (let i = 0; i < output.length - 1; i++) {
        if ((output[i] === "x" || output[i] === "÷") && output[i + 1] !== "+" && output[i + 1] !== "-" && output[i + 1] !== "x" && output[i + 1] !== "÷") {
            let value = output[i];
            output[i] = output[i + 1];
            output[i + 1] = value;
        }
    }

    let newOutput = [];
    a: for (let i = 0; i < output.length - 1; i++) {
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
            result.push(signs[part](+(result.pop()), +(result.pop())));
        } else {
            result.push(part);
        }
    }
    return result;
}
