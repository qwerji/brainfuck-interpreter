const brainfuckInterpreter = (() => {

    function Cell() {
        this.value = 0
        this.next = null
        this.prev = null
    }

    Cell.prototype['>'] = function() {
        if (debug) console.log('Forwards')
        if(!this.next) {
            if (debug) console.log('Adding New Cell')
            this.next = new Cell()
            this.next.prev = this
        }
        return this.next
    }
    Cell.prototype['<'] = function() {
        if (debug) console.log('Backwards')
        if(!this.prev) {
            if (debug) console.log('Adding New Cell')
            this.prev = new Cell()
            this.prev.next = this
        }
        return this.prev
    }
    Cell.prototype['+'] = function() {
        if (debug) console.log('Increment')
        this.value++
        if (this.value > 255) {
            this.value = 0
        }
        return this
    }
    Cell.prototype['-'] = function() {
        if (debug) console.log('Decrement')
        this.value--
        if (this.value < 0) {
            this.value = 255
        }
        return this 
    }
    Cell.prototype[','] = function(input) {
        this.value = input.text.charCodeAt(input.i++)
        if (debug) console.log('Value from input:', input.text[input.i-1], ': ', this.value)
        return this
    }
    Cell.prototype['.'] = function() {
        if (debug) console.log('Printing ASCII')
        print += String.fromCharCode(this.value)
        return this
    }

    function Loop(start) {
        this.start = start
        this.end = null
    }

    let print = ''

    function brainfuck(code='', input='') {

        let loops = [], currentCell = new Cell()
        input = { i: 0, text: input }
        for (let i = 0; i < code.length; i++) {
            let char = code[i]
            if (debug) console.log('----- New Character:', char, 'at', i, '-----')
            if (currentCell[char]) {
                if (debug) console.log('- Cell Operation -')
                currentCell = currentCell[char](input)
            } else if (char === '[') {
                if (debug) console.log('- Start of loop -')
                const loop = loops.find(loop => loop.start === i)
                if (currentCell.value <= 0 && loop) {
                    if (debug) console.log('Loop is complete, jumping to end')
                    i = loops.pop().end
                } else if (!loop) {
                    if (debug) console.log('Creating new loop')
                    loops.push(new Loop(i))
                }
            } else if (char === ']') {
                if (debug) console.log('- End of loop -')
                const lastLoop = loops[loops.length-1]
                if (lastLoop.end === null) {
                    if (debug) console.log('Setting loop end value')
                    lastLoop.end = i
                }
                if (currentCell.value <= 0) {
                    if (debug) console.log('Loop is complete, moving on')
                    i = loops.pop().end
                } else {
                    if (debug) console.log('Loop continuing back to beginning')
                    i = lastLoop.start
                }
            }
        }
        if (debug) console.log('Done')
        if (code.includes('.')) console.log(print)
        return currentCell
    }
    
    const debug = false

    return brainfuck

})()

brainfuckInterpreter(
    `++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>++.>+.+++++++..+++.<<++.>+++++++++++++++.>.+++.------.--------.<<+.<.`
)