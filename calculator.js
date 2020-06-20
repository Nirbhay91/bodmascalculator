// +++++++++++++++++ //
// Sample Test Cases //
// +++++++++++++++++ //
// 10+20-30+40*5/2+10/5
// 10*20-30/40/5+2-10*5*9
// 10*20-30/40*5/2-10*5*0
// 10+20-30+40*5/2+10*5/5
// 10*20-30/40*5/2-10*5-87*2+115*111
// 10+20-30+40*5/(2+10*5)*5
// 10+20-(30+40)*5/2+(10*5)/5+(6+9)
// 10+20-(30+40*(10+10))*5/2+(10*5)/5+(6+9)
// 10+20-((30+40)*(10+10))*5/2+(10*5)/5+(6+9)
// ((14+11)+15*16-(13+10*11)+(10+10-(10*2)))
// 10+20-((30+40)*10+(10+(10*5))+10)
// 10+20-((30+40)*10+(10+(10*5+9)+9))+10
// 10+20-((30+40)*10+(10+(10+5))+10/(5*(10+10)))*5/2+(10*5)/5+(6+9+78/7)
// (10+20)-((30+40)*10+(10+(10+5)-(5+5))+(10/(5*(10+10)))*5/2+(10*5)/5+(6+9+78/7))

/// 10*(20-30/2)+40*5+2-(10*5+9)-(87*2+115*111)
/// 10*(20-30/2)+40*5+2-(10*5+9)*1-(87*2+115*111)
// console.log(eval(10*(20-30/2)+40*5+2-(10*5+9)-(87*2+115*111)))

function append(text) {
    document.getElementById("equation").value += text
}

function clearEquation() {
    document.getElementById("equation").value = ""
    document.getElementById("result").value = ""
}

function backspace(text) {
    document.getElementById("equation").value = text.substring(0, text.length - 1)
}

function startEvaluation(equation) {

    console.log(eval(equation))

    // var equation = prompt("Enter the equation")

    // Creating empty arrays for storing
    // brackets, operators, operands
    var brackets = []
    var operators = []
    var operands = []
    var operandString = ""


    for (var index = 0, operatorIndex = 0, bracketIndex = 0; index < equation.length; index++) {

        // Checking for operators
        if (equation.charAt(index) == '+'
            || equation.charAt(index) == '-'
            || equation.charAt(index) == '*'
            || equation.charAt(index) == '/') {

            // Below condition is to deal with (a+b)+(c+d) this part of equation
            if (equation.charAt(index - 1) == ')' && equation.charAt(index + 1) == '(') {
                operators[operatorIndex++] = "*"
                brackets[bracketIndex++] = null
                brackets[bracketIndex++] = null
                operators[operatorIndex++] = equation.charAt(index)
                operandString += " 1 "
            }
            // Fetching operators and storing into operators[] array
            else {
                operators[operatorIndex++] = equation.charAt(index)
                brackets[bracketIndex++] = null

                operandString += " "
            }
        }
        // Fetching brackets and storing into brackets[] array
        else if (equation.charAt(index) == '(' || equation.charAt(index) == ')') {
            brackets[bracketIndex++] = equation.charAt(index)
            operators[operatorIndex++] = null
        }
        // Fetching operand digits and storing into operandString
        else {
            operandString += equation.charAt(index)
        }
    }

    // Temp array of operands for further processing
    // before storing operands into operands[] array
    operandsTemp = operandString.split(" ")

    // Storing operands into operands[] array
    for (var index = 0, indexOperand = 0; index < operators.length; index++) {
        if (brackets[index] == null) {
            operands[index] = Number(operandsTemp[indexOperand++])
        }
        else {
            operands[index] = null
        }
    }
    operands[operands.length] = Number(operandsTemp[indexOperand])



    console.log(brackets)
    console.log(operators)
    console.log(operands)


    // Result variables
    var result = 0
    var finalResult = 0

    // Checking if brackets are present in the equation or not
    if (brackets.length > 0) {

        for (var index = 0; index < brackets.length; index++) {

            // Checking for occurance of closing bracket
            // and then searching for its corresponding
            // opening bracket by reverse traversing
            // and then evaluating that particular bracket equation
            // PROCESSES NESTED BRACKETS AS WELL
            if (brackets[index] == ')') {
                var indexBracketEnd = index
                for (var indexBracket = indexBracketEnd; indexBracket >= 0; indexBracket--) {
                    if (brackets[indexBracket] == '(') {
                        var indexBracketStart = indexBracket
                        evaluate(indexBracketStart, indexBracketEnd, operators, operands)
                        brackets[indexBracketStart] = null
                        brackets[indexBracketEnd] = null
                        break
                    }
                }
                console.log(brackets)
            }
        }
    }



    // This will evaluate remaining equation (without brackets)
    // after processing brackets (if available)
    finalResult = evaluate(0, operators.length, operators, operands)


    // FINAL RESULT
    console.log(`FINAL RESULT = ${finalResult}`)

    document.getElementById('result').value = finalResult
}

// Evaluation of equation by using BOAD MASS method
function evaluate(indexStart, indexEnd, operators, operands) {

    // First evaluating MULTIPLICATION and DIVISION
    for (var index = indexStart; index < indexEnd; index++) {

        var indexFirstOperand = index
        var indexNextOperand = index + 1
        var indexNextOperator = index

        if (operators[indexNextOperator] == null) {
            for (var indexNext = indexNextOperator + 1; indexNext < operators.length; indexNext++) {
                if (operators[indexNext] != null) {
                    indexNextOperator = indexNext
                    indexFirstOperand = indexNext
                    indexNextOperand = indexNext + 1
                    index = indexNext - 1
                    break
                }
            }
        }

        if (operands[indexNextOperand] == null) {
            for (var indexNext = indexNextOperand + 1; indexNext < operands.length; indexNext++) {
                if (operands[indexNext] != null) {
                    indexNextOperand = indexNext
                    index = indexNext - 1
                    break
                }
            }
        }

        // MULTIPLICATION 
        if (operators[indexNextOperator] == '*') {
            result = operands[indexFirstOperand] * operands[indexNextOperand]

            operands[indexNextOperand] = result
            operands[indexFirstOperand] = null
            operators[indexNextOperator] = null
            finalResult = result
            result = 0

            console.log(operands)
            console.log(operators)
        }
        // DIVISION
        else if (operators[indexNextOperator] == '/') {
            result = operands[indexFirstOperand] / operands[indexNextOperand]

            operands[indexNextOperand] = result
            operands[indexFirstOperand] = null
            operators[indexNextOperator] = null
            finalResult = result
            result = 0

            console.log(operands)
            console.log(operators)
        }
    }

    // Next evaluating ADDITION and SUBSTRACTION
    for (var index = indexStart; index < indexEnd; index++) {

        var indexFirstOperand = index
        var indexNextOperand = index + 1
        var indexNextOperator = index

        if (operators[indexNextOperator] == null) {
            for (var indexNext = indexNextOperator + 1; indexNext < operators.length; indexNext++) {
                if (operators[indexNext] != null) {
                    indexNextOperator = indexNext
                    indexFirstOperand = indexNext
                    indexNextOperand = indexNext + 1
                    index = indexNext - 1
                    break
                }
            }
        }

        if (operands[indexNextOperand] == null) {
            for (var indexNext = indexNextOperand + 1; indexNext < operands.length; indexNext++) {
                if (operands[indexNext] != null) {
                    indexNextOperand = indexNext
                    index = indexNext - 1
                    break
                }
            }
        }

        // ADDITION 
        if (operators[indexNextOperator] == '+') {
            result = operands[indexFirstOperand] + operands[indexNextOperand]

            operands[indexNextOperand] = result
            operands[indexFirstOperand] = null
            operators[indexNextOperator] = null
            finalResult = result
            result = 0

            console.log(operands)
            console.log(operators)
        }
        // SUBSTRACTION
        else if (operators[indexNextOperator] == '-') {
            result = operands[indexFirstOperand] - operands[indexNextOperand]

            operands[indexNextOperand] = result
            operands[indexFirstOperand] = null
            operators[indexNextOperator] = null
            finalResult = result
            result = 0

            console.log(operands)
            console.log(operators)
        }
    }

    // Returning FINAL RESULT
    return finalResult
}