class Token {
    constructor(color, column, row) {
        this.color = color
        this.column = column
        this.row = row
    }
}

class Grid {
    constructor() {
        this.size = { columns: 7, rows: 6 }
        this.tokens = this.empty()
    }

    empty = () => {
        const columns = []
        for (let i = 0; i < this.size.columns; i ++) {
            columns[i] = []
            for (let j = 0; j < this.size.rows; j ++) {
                columns[i].push(null)
            }
        }
        return columns
    }

    addToken(token, column) {
        let row = this.tokens[column].reverse().findIndex(token => token === null)
        row = this.size.rows - row - 1
        if (row !== -1) {
            token.column=column
            token.row=row
            this.tokens[column][row] = token
        }
    }

    canAddToken(column) {
        return this.tokens[column].findIndex(t => t === null) !== -1
    }
}

class GameManager {
    constructor() {
        this.grid = new Grid()
        this.player = 'red'
    }

    addToken(column) {
        if (this.grid.canAddToken(column)) {
            const token = new Token(this.player, column, 0)
            this.grid.addToken(token, column)
            this.player = this.player === 'red' ? 'yellow' : 'red'
        }
    }
}

