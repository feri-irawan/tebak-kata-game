class TebakKata {
  /**
   * Constructor
   * @param {string} inputContainer
   * @param {{data: object[], healts: number, clueContainer: string, progressContainer: string, healtsContainer: string, startNum: number, countDown: number, countDownContainer: string, nextDelay: number}} options
   */
  constructor(
    inputContainer,
    {
      data,
      clueContainer,
      healts,
      progressContainer,
      healtsContainer,
      startNum,
      countDown,
      countDownContainer,
      nextDelay
    }
  ) {
    this.inputContainer = document.querySelector(inputContainer)
    this.data = data
    this.clue = ''
    this.clueContainer = document.querySelector(clueContainer)
    this.answer = ''
    this.healts = healts
    this.progressContainer = document.querySelector(progressContainer)
    this.healtsContainer = document.querySelector(healtsContainer)
    this.startNum = startNum - 1
    this.countDown = countDown
    this.countDownContainer = document.querySelector(countDownContainer)
    this.nextDelay = nextDelay

    this.setKata()
    this.createClue()
    this.createInput()
    this.checkInputValue()
    this.healtsCheck()
  }

  /**
   * Set soal
   */
  setKata() {
    const { clue, answer } = this.data[this.startNum]

    this.clue = clue
    this.answer = answer
  }

  /**
   * Menampilkan clue
   */
  createClue() {
    this.clueContainer.innerHTML = this.clue
  }

  /**
   * Membuat input
   */
  createInput() {
    const inputs = this.answer
      .split('')
      .map(() => `<input type="text" maxlength="1" />`)
      .join('')

    this.inputContainer.innerHTML = inputs
    this.inputs = this.inputContainer.childNodes
  }

  checkInputValue() {
    const inputs = this.inputs

    inputs.forEach((input, i) => {
      input.onkeyup = (event) => {
        // Batasi tombol keyboard
        if (!this.enabledKeyboard(event)) return

        // Cek jawaban masing-masing input
        this.checkAnswer(input, i)

        // progess message
        this.progress()

        // Nyawa
        this.healtsCheck()
      }
    })
  }

  /**
   * Batasi keyboard
   */
  enabledKeyboard(event) {
    const { keyCode } = event

    // Daftar keyCode yang diperbolehkan
    const numberKeyCode = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57] // 0 - 9
    const alphabetKeyCode = [
      65, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
      84, 85, 86, 87, 88, 89, 90
    ] // a - z

    const whiteList = [numberKeyCode, alphabetKeyCode].flat()

    return whiteList.includes(keyCode) ? true : false
  }

  /**
   * Mengecek jawaban input
   * @param {HTMLInputElement} input
   * @param {number} i
   * @returns
   */
  checkAnswer(input, i) {
    const v = input.value.toLowerCase()
    const inputs = this.inputs

    // Jika value input lebih dari 1
    if (v.length > 1) {
      input.value = v[0]
      return
    }

    if (v === this.answer[i].toLowerCase()) {
      // Jika benar
      input.classList.remove('wrong')
      input.classList.add('correct')
    } else {
      // Jika salah
      input.classList.remove('correct')
      input.classList.add('wrong')
      this.healts--
    }

    // Disable input jika input telah diisi
    input.setAttribute('disabled', '')

    // Pindah ke input berikutnya
    if (i !== inputs.length - 1) inputs[i + 1].focus()
  }

  /**
   * Menampilkan progress
   */
  progress() {
    const inputContainer = this.inputContainer
    const progressContainer = this.progressContainer
    const corrects = inputContainer.querySelectorAll('.correct').length
    const wrongs = inputContainer.querySelectorAll('.wrong').length

    progressContainer.style.display = 'block'

    let message

    // Jika ada benar dan tidak ada salah
    if (corrects && !wrongs) {
      progressContainer.style.color = '#44ff00'

      // Jika benar 1
      if (corrects === 1) {
        message = 'Benar!'
      }

      // Jika benar 2
      if (corrects === 2) {
        message = 'Mantap!'
      }

      // Jika benar > 2 dan <= 1/2 dari jumlah input
      if (corrects > 2 && corrects <= Math.round(this.inputs.length / 2)) {
        message = 'Luar biasa!'
      }

      // Jika benar > 1/2 dan < dari jumlah input
      if (
        corrects >= Math.round(this.inputs.length / 2) &&
        corrects < this.inputs.length
      ) {
        message = 'Amazing!!'
      }

      // Jika benar semua
      if (corrects === this.inputs.length) {
        message = 'Wow, benar semua!'
      }
    }

    // Jika ada salah
    if (wrongs) {
      progressContainer.style.color = 'currentColor'
      message = `${corrects} huruf benar, ${wrongs} huruf salah`

      // Jika salah semua
      if (wrongs === this.inputs.length) {
        progressContainer.style.color = '#ff4558'
        message = 'Yah, salah semua 😭'
      }
    }

    // Jika semua input telah terisi
    if ((corrects + wrongs) === this.inputs.length) {
      // Lanjut ke kata berikutnya (soal berikutnya)
      this.nextKata()
    }

    // Menampilkan progress
    progressContainer.innerHTML = message
  }

  /**
   * Cek nyawa
   * @returns {number} nyawa tersisa
   */
  healtsCheck() {
    const healtsContainer = this.healtsContainer

    const healts = Array(this.healts)
      .fill(null)
      .map(() => `<span>❤️</span>`)
      .join('')

    healtsContainer.innerHTML = healts

    if (!this.healts) {
      this.clueContainer.style.display = 'none'
      this.inputContainer.style.display = 'none'
      this.progressContainer.style.display = 'none'

      const gameOver = document.createElement('div')
      gameOver.classList.add('game-over')
      gameOver.innerHTML = 'Game Over!'
      this.inputContainer.after(gameOver)
    }
  }

  /**
   * Soal berikutnya
   * @returns
   */
  nextKata() {
    this.startNum++
    const nextIndex = this.startNum
    const data = this.data

    this.countDown = 5000

    // Jika nextIndex < jumlah soal
    if (nextIndex < data.length) {
      setTimeout(() => {
        this.displayCountDown()

        const result = data[nextIndex]

        this.clue = result.clue
        this.answer = result.answer

        this.createClue()
        this.createInput()
        this.checkInputValue()
        this.healtsCheck()
        return
      }, this.nextDelay)
    }

    // Jika nextIndex === jumlah soal, maka jangan next
    if (data.length === nextIndex) {
      const gameEnded = document.createElement('div')
      gameEnded.classList.add('game-ended')
      gameEnded.innerHTML = 'Tamat!'
      this.progressContainer.after(gameEnded)
    }
  }

  displayCountDown() {
    const countDownContainer = this.countDownContainer
    countDownContainer.style.display = 'flex'

    let i = this.countDown / 1000
    countDownContainer.innerHTML = i--

    const interval = setInterval(() => {
      countDownContainer.innerHTML = i--
    }, 1000)

    setTimeout(() => {
      countDownContainer.style.display = 'none'
      clearInterval(interval)
      i = this.countDown / 1000
    }, this.countDown)
  }
}

// Init
; (async () => {
  const level = 1
  const data = await fetch(`/kata/${level}.json`).then((res) => res.json())

  const game = new TebakKata('#inputContainer', {
    data,
    startNum: 1,
    clueContainer: '#clueContainer',
    healts: 3,
    healtsContainer: '#healtsContainer',
    progressContainer: '#progressContainer',
    countDown: 5000,
    countDownContainer: '#countDownContainer',
    nextDelay: 2000
  })
})()
