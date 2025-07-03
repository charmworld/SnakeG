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