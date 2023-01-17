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
        for (let i = 0; i < this.size.rows; i ++) {
            columns[i] = []
            for (let j = 0; j < this.size.columns; j ++) {
                columns[i].push(null)
            }
        }
        return columns
    }

    addToken(token, column) {
        let row = this.tokens[column].reverse().findIndex(t => t === null)
        row = this.size.y - row - 1
        if (row !== -1) {
            this.tokens[column][row] = token
        }
    }

    canAddToken(column) {
        return this.tokens[column].findIndex(t => t === null) !== -1
    }
}
