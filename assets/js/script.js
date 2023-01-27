class Token {
    constructor(color, column, row) {
        this.color = color
        this.column = column
        this.row = row
    }
}

class Grid {
    constructor(uiUpdater) {
        this.size = {columns: 7, rows: 6}
        this.tokens = this.empty()
        this.uiUpdater = uiUpdater
    }

    empty = () => {
        const columns = []
        for (let i = 0; i < this.size.columns; i++) {
            columns[i] = []
            for (let j = 0; j < this.size.rows; j++) {
                columns[i].push(null)
            }
        }
        return columns
    }

    /**
     * Add a token to the grid without verifying if the column is full
     * Call the uiupdater
     * Call the ckeckForWin
     * @param token
     * @param column
     */
    addToken(token, column) {
        let row = this.size.rows - 1
        while (this.tokens[column][row] !== null) {
            row--
        }
        if (row !== -1) {
            token.column = column
            token.row = row
            this.tokens[column][row] = token
            this.uiUpdater.addToken(token)
            if (this.checkForWin(token)) {
                console.log(token.color + ' wins!')
            }
            if (this.checkForDraw()) {
                console.log('Draw!')
            }
        } else {
            console.error('Cannot add token to column', column)
        }
    }

    /**
     * Check if the column is not full
     * @param column
     * @returns {boolean}
     */
    canAddToken(column) {
        //TODO: check all cases
        return this.tokens[column][0] === null;
    }

    checkForDraw() {
        for (let i = 0; i < this.size.columns; i++) {
            if (this.canAddToken(i)) {
                return false
            }
        }
        return true
    }

    /**
     * Check if the given token is part of a winning combination
     * @param token the token we just added
     * @returns {boolean} if the token complete a 4-in-a-row
     */
    checkForWin(token) {
        const color = token.color
        const directions = [
            { x: 1, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: -1 }
        ]
        for (const direction of directions) {
            const count = this.checkDirection(token, direction)
            if (count >= 4) {
                return true
            }
        }
        return false
    }

    /**
     * Check the number of tokens in a given direction
     * @param token the token we just added
     * @param direction x and y unit values
     * @returns {number} the number of consecutive tokens in the given direction
     */
    checkDirection(token, direction) {
        let color = token.color
        let count = 0
        let x = token.column
        let y = token.row
        while (x >= 0 && x < this.size.columns && y >= 0 && y < this.size.rows && this.tokens[x][y] && this.tokens[x][y].color === color) {
            count ++
            x += direction.x
            y += direction.y
        }
        x = token.column - direction.x
        y = token.row - direction.y
        while (x >= 0 && x < this.size.columns && y >= 0 && y < this.size.rows && this.tokens[x][y] && this.tokens[x][y].color === color) {
            count ++
            x -= direction.x
            y -= direction.y
        }
        return count
    }

}

class Player {
    constructor(color) {
        this.color = color
    }
}

class UIUpdater {
    constructor() {
        this.tokenContainer = document.querySelector('.token-container')
    }

    /**
     * Adds a token to the token container
     * @param token {Token} The token to add
     */
    addToken(token) {
        const tokenElement = document.createElement('div')
        tokenElement.classList.add('token')
        tokenElement.classList.add('column-choice')
        tokenElement.classList.add('token-' + token.color)
        let columnDiv = this.tokenContainer.children[token.column]
        columnDiv.appendChild(tokenElement)
        setTimeout(() => {
            tokenElement.classList.remove('column-choice')
            tokenElement.classList.add('regular')
        }, 100)
    }
}

class InputManager {
    constructor(grid) {
        this.grid = grid
        this.columns = document.querySelectorAll('.column')
        this.columns.forEach((column, i) => {
            column.addEventListener('click', () => {
                this.grid.addToken(new Token('red', i, 0), i)
                console.log("hello")
            })
        })
    }

}

class GameManager {
    constructor(updater, inputManager, grid, player1, player2) {
        this.grid = grid
        this.grid.updater = updater
        this.players = [player1, player2]
        this.currentPlayer = this.players[0]
        this.inputManager = inputManager
    }

    addToken(player, column) {
        const token = new Token(this.currentPlayer.color, column, 0)
        this.grid.addToken(token, column)
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0]
    }

    start() {
        console.log('Starting game')
        this.columns = document.querySelectorAll('.choice')
        this.columns.forEach((column, i) => {
            column.addEventListener('click', () => {
                if (this.grid.canAddToken(i)) {
                    this.addToken(this.currentPlayer, i)
                }
            })
        })
    }

}

function runApplication() {
    const uiUpdater = new UIUpdater()
    const grid = new Grid(uiUpdater)
    const inputManager = new InputManager(grid)
    const player1 = new Player('red')
    const player2 = new Player('yellow')
    const gameManager = new GameManager(uiUpdater, inputManager, grid, player1, player2)
    gameManager.start()
}

runApplication()

