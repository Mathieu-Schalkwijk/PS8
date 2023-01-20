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

class Player {
    constructor(color) {
        this.color = color
    }
}

class UIUpdater {
    constructor() {
        this.grid = new Grid()
        this.player = new Player('red')
        this.token = new Token(this.player.color, 0, 0)
        this.tokenContainer = document.querySelector('.token-container')
    }

    addToken = (column) => {
        if (this.grid.canAddToken(column)) {
            this.grid.addToken(this.token, column)
            this.updateUI()
        }
    }

    updateUI = () => {
        const grid = document.getElementById('grid')
        grid.innerHTML = ''
        for (let i = 0; i < this.grid.size.rows; i ++) {
            for (let j = 0; j < this.grid.size.columns; j ++) {
                const token = this.grid.tokens[j][i]
                const cell = document.createElement('div')
                cell.classList.add('cell')
                if (token) {
                    cell.classList.add(token.color)
                }
                grid.appendChild(cell)
            }
        }
    }

    /**
     * Adds a token to the token container
     * @param token {Token} The token to add
     */
    addToken(token) {
        const tokenElement = document.createElement('div')
        tokenElement.classList.add('token')
        tokenElement.classList.add(token.color)
        tokenElement.classList.add(`token-position-${token.row+1}-${token.column+1}`)
        this.tokenContainer.appendChild(tokenElement)
    }
}

class KeyboardInputManager {
    constructor() {
        this.listeners = []
        document.addEventListener('keydown', this.onKeyDown)
    }

    onKeyDown = (event) => {
        if (event.keyCode >= 49 && event.keyCode <= 56) {
            this.listeners.forEach(listener => listener(event.keyCode - 49))
        }
    }

    subscribe(listener) {
        this.listeners.push(listener)
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener)
    }
}

class GameManager {
    constructor(updater, inputManager) {
        this.grid = new Grid()
        this.players = [new Player('red'), new Player('yellow')]
        this.currentPlayer = this.players[0]
        this.updater = updater
        this.inputManager = inputManager
    }

    addToken(player, column) {
        if (this.grid.canAddToken(column) && player === this.currentPlayer) {
            const token = new Token(this.currentPlayer.color, column, 0)
            this.grid.addToken(token, column)
            this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0]
        }
    }
}

function runApplication() {
    new GameManager(new UIUpdater(), new KeyboardInputManager())
}

runApplication()
