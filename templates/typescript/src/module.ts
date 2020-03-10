/**
 * Adds two numbers together
 * @arg {CognigyScript} `number1` The first number
 * @arg {CognigyScript} `number2` The second number
 * @arg {CognigyScript} `store` Where to store the result
 * @arg {Boolean} `stopOnError` Whether to stop on error or continue
 */
async function add(cognigy: any, args: any) {
    const { number1, number2, store, stopOnError } = args;
    try {
        const num1 = Number(number1);
        const num2 = Number(number2);
        const sum = num1 + num2;

        // write the result into the context at the specified destination
        cognigy.context.getFullContext()[store] = sum;
    } catch (error) {
        // Stop the Flow if 'stopOnError' is set
        if (stopOnError)
            throw error;

        // write the error into the context at the specified destination
        cognigy.context.getFullContext()[store] = {
            error: error
        }
    }

    return cognigy;
}

export { add }
