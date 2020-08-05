
let output = []; //То, что выводится в дисплей
let input = document.getElementsByClassName("button"); //То, что вводится с клавиатуры калькулятора


for (let part of input) {
    part.onclick = () => {  //При нажатии на копошки...
        if (output.length === 0 && isNaN(part.innerHTML) && part.innerHTML !== "-") {
            return;
        }
        function point(output) {
            let output2 = output.join("");
            let output3 = output2.split("+" || "-" || "x" || "÷");
            return output3[output3.length-1].includes(".");
        }
        if (part.innerHTML === "." && (point(output))){
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



