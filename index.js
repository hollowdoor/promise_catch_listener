var stacktraceParser = require('stacktrace-parser');

/*
git remote add origin https://github.com/hollowdoor/promise_catch_listener.git
git push -u origin master
*/

module.exports = function createErrorEnvironment(options){
    var opts = {};
    opts.on = typeof options.on === 'boolean' ? options.on : true;
    opts.rethrow = options.rethrow || true;
    opts.showStack = typeof options.showStack === 'boolean'? options.showStack : true;
    opts.chalk = options.chalk || null;

    return function createCatcher(value, options){
        options = options || {};
        options.on = typeof options.on === 'boolean' ? options.on : opts.on;
        options.rethrow = options.rethrow || opts.rethrow;
        options.showStack = typeof options.showStack === 'boolean'? options.showStack : opts.showStack;

        return function onError(error){
            var message = '', lines;

            if(opts.on){

                if(options.showStack && typeof error.stack !== 'undefined'){
                    lines = stacktraceParser.parse(error.stack);

                    if(opts.chalk){
                        message = lines.reduce(useColors(opts.chalk), '');
                    }else{
                        message = lines.reduce(usePlain(), '');
                    }
                }

                message = ' {\n' + message + '}';

                if(opts.chalk){
                    message = opts.chalk.red(
                        (error.name ? error.name + ' ' : '') + error.message) + message;
                }else{
                    message = error.message + message;
                    message = (error.name ? error.name + ': ' : '') + message;
                }

                if(!opts.rethrow){
                    throw new Error(message);
                }

                console.log(message);

            }

            message = null;
            lines = null;
            error = null;

            if(typeof value === 'function'){
                return value(e);
            }

            return value;

        };
    };
};

function useColors(chalk){
    return function filterLines(last, line, index){
        if(!line) return '';
        line.lineNumber = line.lineNumber ? chalk.green('line# '+line.lineNumber) : '';
        line.column =  chalk.green(' col# '+ line.column + ' ');
        line.file = line.file ? 'in ' + chalk.bold(line.file) : '';
        line.methodName = line.methodName ? ' -- ' + line.methodName : '';
        return last + composeMessage(line, index) + '\n';
    };
}

function usePlain(){
    return function filterLines(last, line, index){
        if(!line) return '';
        line.lineNumber = line.lineNumber ? 'line# '+line.lineNumber : '';
        line.column = line.column ? 'col# '+ line.column : '';
        line.file = line.file ? 'in '+line.file : '';
        line.methodName = line.methodName ? ' -- ' + line.methodName : '';
        return last + composeMessage(line, index) + '\n';
    };
}

function composeMessage(line, index){
    index = index + 1;
    if(!line) return '';
    var message = ' ';

    message += line.lineNumber;
    message += line.column;

    message += line.file;
    message += line.methodName;

    if(!message.length){
        return '';
    }

    return ' ' + index + message;
}
