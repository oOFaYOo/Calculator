let output = []; //То, что выводится в дисплей
let input = document.getElementsByClassName("button"); //То, что вводится с клавиатуры калькулятора
let buttonEquals = document.querySelector(".equals"); //Кнопка "равно"

for (let part of input) {
    part.onclick = () => {  //При нажатии на копошки...
        if (output.length === 0 && isNaN(part.innerHTML) && part.innerHTML !== "-") {  //Позваляет начать строку с цифры или со знака минус
            return;
        }

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
        output.push(part.innerHTML); //Сохраняем значения в "вывод на дисплей"
        document.getElementById("input").innerHTML = output.join(""); //Выводим
    }
}

document.getElementById("clean").onclick = () => {    //Очистка дисплея
    document.getElementById("input").innerHTML = null;
    output = [];
};


buttonEquals.onclick = () => equals (output); //Действие по нажатию "равно"

function equals(output){       //Функция для "равно"
    output = joinNumbers(output);
    output = convertToRPN(output);
    output = RPN(output);
    document.getElementById("input").innerHTML = output;
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
    for(let i = 0; i < output.length-1; i++){
        if((output[i] === "x" || output[i] === "÷") && output[i + 1]!== "+" && output[i + 1]!== "-" && output[i + 1]!== "x" && output[i + 1]!== "÷"){
            let value = output[i];
            output[i] = output[i + 1];
            output[i + 1] = value;
        }
    }

    let newOutput = [];
    a: for (let i = 0; i < output.length - 1; i++){
        let current = output[i];
           if (current === "+" || current === "-"){
               for ( let j = i + 1; j < output.length; j++){
                   if (output[j]==="+" || output[j]==="-"){
                       i = j-1;
                       break;
                   }
                   newOutput.push(output[j]);
                   if (j === output.length - 1)
                   {
                       newOutput.push(current);
                       break a;
                   }
               }
           }
           newOutput.push(current);
       }
    return newOutput;
}

function RPN (output){
    let signs = {
        "+": function (a, b) { return a + b},
        "-": function (a, b) { return b - a},
        "x": function (a, b) { return a * b},
        "÷": function (a, b) { return b / a}
    };

let someArr = [];

for (let part of output){
    if(part in signs){
       someArr.push(signs[part] (someArr.pop(), someArr.pop()));
    }
    someArr.push(part)
}
return someArr;
}



