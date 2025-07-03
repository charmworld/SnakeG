class SnakeGame {
  constructor() {
    this.canvas = document.getElementById("gameCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.overlay = document.getElementById("gameOverlay")
    this.startButton = document.getElementById("startButton")
    this.restartButton = document.getElementById("restartButton")
    this.scoreElement = document.getElementById("score")
    this.highScoreElement = document.getElementById("highScore")
    this.overlayTitle = document.getElementById("overlayTitle")
    this.overlayMessage = document.getElementById("overlayMessage")

    // Game settings
    this.gridSize = 20
    this.tileCount = this.canvas.width / this.gridSize

    // Game state
    this.snake = [{ x: 10, y: 10 }]
    this.food = {}
    this.dx = 0
    this.dy = 0
    this.score = 0
    this.gameRunning = false
    this.gameLoop = null

    // Load high score
    this.highScore = localStorage.getItem("snakeHighScore") || 0
    this.highScoreElement.textContent = this.highScore

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.generateFood()
    this.adjustCanvasSize()
  }

  setupEventListeners() {
    // Start/Restart buttons
    this.startButton.addEventListener("click", () => this.startGame())
    this.restartButton.addEventListener("click", () => this.startGame())

    // Keyboard controls
    document.addEventListener("keydown", (e) => this.handleKeyPress(e))

    // Mobile controls
    const mobileButtons = document.querySelectorAll(".mobile-btn")
    mobileButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const direction = button.getAttribute("data-direction")
        this.handleMobileControl(direction)
      })
    })

    // Prevent scrolling on mobile when using controls
    document.addEventListener("touchstart", (e) => {
      if (e.target.classList.contains("mobile-btn")) {
        e.preventDefault()
      }
    })

     // Resize handler
    window.addEventListener("resize", () => this.adjustCanvasSize())
  }

  adjustCanvasSize() {
    const container = this.canvas.parentElement
    const maxWidth = Math.min(400, container.clientWidth - 40)
    const size = Math.floor(maxWidth / this.gridSize) * this.gridSize

    this.canvas.width = size
    this.canvas.height = size
    this.tileCount = size / this.gridSize

    // Adjust snake and food positions if they're out of bounds
    if (this.snake[0].x >= this.tileCount) this.snake[0].x = this.tileCount - 1
    if (this.snake[0].y >= this.tileCount) this.snake[0].y = this.tileCount - 1
    if (this.food.x >= this.tileCount || this.food.y >= this.tileCount) {
      this.generateFood()
    }
  }

  startGame() {
    // Reset game state
    this.snake = [{ x: Math.floor(this.tileCount / 2), y: Math.floor(this.tileCount / 2) }]
    this.dx = 0
    this.dy = 0
    this.score = 0
    this.scoreElement.textContent = this.score
    this.gameRunning = true

    // Hide overlay
    this.overlay.style.display = "none"

    // Generate new food
    this.generateFood()

    // Start game loop
    if (this.gameLoop) clearInterval(this.gameLoop)
    this.gameLoop = setInterval(() => this.update(), 150)
  }

  handleKeyPress(e) {
    if (!this.gameRunning) return

    const key = e.key.toLowerCase()

    // Prevent reverse direction
    switch (key) {
      case "arrowup":
      case "w":
        if (this.dy !== 1) {
          this.dx = 0
          this.dy = -1
        }
        break
      case "arrowdown":
      case "s":
        if (this.dy !== -1) {
          this.dx = 0
          this.dy = 1
        }
        break
      case "arrowleft":
      case "a":
        if (this.dx !== 1) {
          this.dx = -1
          this.dy = 0
        }
        break
      case "arrowright":
      case "d":
        if (this.dx !== -1) {
          this.dx = 1
          this.dy = 0
        }
        break
    }

    e.preventDefault()
  }

  handleMobileControl(direction) {
    if (!this.gameRunning) return

    switch (direction) {
      case "up":
        if (this.dy !== 1) {
          this.dx = 0
          this.dy = -1
        }
        break
      case "down":
        if (this.dy !== -1) {
          this.dx = 0
          this.dy = 1
        }
        break
      case "left":
        if (this.dx !== 1) {
          this.dx = -1
          this.dy = 0
        }
        break
      case "right":
        if (this.dx !== -1) {
          this.dx = 1
          this.dy = 0
        }
        break
    }
  }

  update() {
    if (!this.gameRunning) return

    this.moveSnake()

    if (this.checkCollision()) {
      this.gameOver()
      return
    }

    if (this.checkFoodCollision()) {
      this.eatFood()
    }

    this.draw()
  }

  moveSnake() {
    const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy }
    this.snake.unshift(head)

    // Remove tail if no food was eaten
    if (!this.checkFoodCollision()) {
      this.snake.pop()
    }
  }

  checkCollision() {
    const head = this.snake[0]

    // Wall collision
    if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
      return true
    }

    // Self collision
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        return true
      }
    }

    return false
  }

  checkFoodCollision() {
    const head = this.snake[0]
    return head.x === this.food.x && head.y === this.food.y
  }

  eatFood() {
    this.score += 10
    this.scoreElement.textContent = this.score

    // Update high score
    if (this.score > this.highScore) {
      this.highScore = this.score
      this.highScoreElement.textContent = this.highScore
      localStorage.setItem("snakeHighScore", this.highScore)
    }
}
  }