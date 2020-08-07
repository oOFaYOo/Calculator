// let output = []; //То, что выводится в дисплей
// let input = document.getElementsByClassName("button"); //То, что вводится с клавиатуры калькулятора
// let buttonEquals = document.querySelector(".equals"); //Кнопка "равно"
//
// for (let part of input) {
//     part.onclick = () => {  //При нажатии на копошки...
//         if (output.length === 0 && isNaN(part.innerHTML) && part.innerHTML !== "-") {  //Позваляет начать строку с цифры или со знака минус
//             return;
//         }
//
//         function point(output) {  //Отображение точки
//             let outputToString = output.join("");
//             let outputToArr = outputToString.split("+" || "-" || "x" || "÷");
//             return outputToArr[outputToArr.length - 1].includes(".");
//         }
//
//         if (part.innerHTML === "." && (point(output))) {
//             return;
//         }
//         if (isNaN(output[output.length - 1]) && part.classList.contains("sign")) { //Не дает писать два знака подряд
//             output.pop();
//         }
//         output.push(part.innerHTML); //Сохраняем значения в "вывод на дисплей"
//         document.getElementById("input").innerHTML = output.join(""); //Выводим
//     }
// }
//
// document.getElementById("clean").onclick = () => {    //Очистка дисплея
//     document.getElementById("input").innerHTML = null;
//     output = [];
// };


// buttonEquals.onclick = equals (output);

function equals(output){
    output = joinNumbers(output);
    output = convertToRPN(output);

}

function joinNumbers(output) {
    let outputToString = output.join("");
    let outputString = "";
    for (let char of outputToString) {
        if (char === "x" || "+" || "-" || "÷") {
            char = " " + `${char}` + " ";
        }
        outputString = outputString + char;
    }
    return outputString.split(" ");
}

function convertToRPN(output) {
    for(let i = 0; i < output.length; i++){
        if(output[i] === "x" || "÷" && output[i + 1]!== "+" || "-" || "x" || "÷"){
            let value = output[i];
            output[i] = output[i + 1];
            output[i + 1] = value;
        }
    }
    let outputToString = output.join("");
    let outputString = "";
    for (let char of outputToString) {
        if (char === "+" || "-") {
            char = " " + `${char}` + " ";
        }
        outputString = outputString + char;
    }
    output = outputString.split(" ");
    for(let i = 0; i < output.length; i++){
        if(output[i] === "-" || "+" && output[i + 1]!== "+" || "-"){
            let value = output[i];
            output[i] = output[i + 1];
            output[i + 1] = value;
        }
    }
    output = joinNumbers(output);
    return output;
}