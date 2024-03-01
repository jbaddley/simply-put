export interface ICell {
  id: string;
  letter: string;
  used: boolean;
  word?: string;
  mysteryUsed?: boolean;
  wordIndex?: number;
  letterIndex?: number;
  color: string;
  originalWord?: string;
}

export interface IBox {
  text: string;
  index: number;
  found: boolean;
  color: string;
  originalWord: string;
}

export interface IStartEnd {
  x: number;
  y: number;
}

export const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#F033FF",
  "#FF3388",
  "#33FFC5",
  "#FFC733",
  "#C733FF",
  "#33FF8D",
  "#8D33FF",
  "#FF8D33",
  "#3CFF33",
  "#33A7FF",
  "#A733FF",
  "#FF33A7",
  "#FF5733",
  "#57FF33",
  "#3357FF",
  "#F033FF",
  "#88FF33",
  "#33FF57",
  "#FF3388",
  "#33C5FF",
  "#C7FF33",
  "#33FFC7",
  "#FFC733",
  "#8DFF33",
  "#33FF8D",
  "#FF8D33",
  "#3C33FF",
  "#33A7FF",
  "#A7FF33",
  "#FF33A7",
  "#FF5733",
  "#57FF33",
  "#3378FF",
  "#F078FF",
  "#78FF33",
  "#33FF78",
  "#FF7833",
];

class WSGenerator {
  gridSize: number;
  gridArr: ICell[][];
  directions: number[];
  wordList: IBox[];
  alreadyFound: string[];
  startBox: IStartEnd | null;
  endBox: IStartEnd | null;
  alphabets: string[];
  mysteryPhrase?: string;
  wordsFound: string[];
  lettersLeft: number;

  constructor({ words, gridSize, mysteryPhrase }: { words: string[]; gridSize?: number; mysteryPhrase?: string }) {
    this.gridSize = gridSize;
    this.mysteryPhrase = mysteryPhrase.split(" ").join("");
    this.gridArr = [];
    this.directions = [-4, -3, -2, -1, 1, 2, 3, 4];
    this.wordList = [...words]
      .sort((a, b) => (a.length > b.length ? -1 : 1))
      .map((item, i) => ({
        text: item.split(" ").join(""),
        originalWord: item,
        index: i,
        color: "white",
        found: false,
      }));
    this.alreadyFound = [];
    this.startBox = null;
    this.endBox = null;
    this.alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    this.setGridSize();
    this.initGrid();
  }

  get keyedList() {
    return [...this.wordList].sort((a, b) => (a.originalWord < b.originalWord ? -1 : 1));
  }

  getRandomRow(): number {
    return Math.floor(Math.random() * this.gridSize);
  }

  getRandomColumn(): number {
    return Math.floor(Math.random() * this.gridSize);
  }

  getRandomDirection(): number {
    return this.directions[Math.floor(Math.random() * this.directions.length)];
  }

  setGridSize(): void {
    const min = this.wordList.reduce((p, c) => {
      return p > c.text.length ? p : c.text.length;
    }, this.gridSize);

    this.gridSize = min;
  }

  initGrid(): void {
    let maxAttempts = 10000;
    let attempts = 0;
    while (attempts < maxAttempts) {
      let grid: ICell[][] = [];
      for (let i = 0; i < this.gridSize; i++) {
        grid[i] = [];
        for (let j = 0; j < this.gridSize; j++) {
          grid[i][j] = { id: `${i + 1}-cell-${j + 1}`, letter: "$$", used: false, color: "white" }; // Adjusted to fit ICell
        }
      }
      this.gridArr = grid;
      const placed = this.wordList.filter((word, i) => this.populateWord(word.text, i, word.originalWord));
      this.wordsFound = placed.map((p) => p.originalWord);
      this.lettersLeft = this.populateUnusedBoxes();
      if (this.wordsFound.length !== this.wordList.length || !this.lettersLeft) {
        attempts++;
        this.gridSize++;
      } else {
        break;
      }
    }
  }

  isPlacable(word: string, start: IStartEnd, direction: number): boolean {
    let i = 0;
    let currI = start.x;
    let currJ = start.y;
    const wordLength = word.length;

    while (i < wordLength) {
      // Check boundaries
      if (currI < 0 || currI >= this.gridSize || currJ < 0 || currJ >= this.gridSize) {
        return false;
      }

      // Check if the cell is either empty or matches the current letter
      const cell = this.gridArr[currI][currJ];
      if (cell.letter !== "$$" && cell.letter !== word[i]) {
        return false;
      }

      // Move to the next cell in the specified direction
      switch (direction) {
        case -1:
          currJ -= 1;
          break;
        case 1:
          currJ += 1;
          break;
        case -2:
          currI -= 1;
          break;
        case 2:
          currI += 1;
          break;
        case -3:
          currI -= 1;
          currJ -= 1;
          break;
        case 3:
          currI += 1;
          currJ += 1;
          break;
        case -4:
          currI -= 1;
          currJ += 1;
          break;
        case 4:
          currI += 1;
          currJ -= 1;
          break;
      }

      i++;
    }

    return true;
  }

  placeWord(word: string, start: IStartEnd, direction: number, originalWord?: string, wordIndex?: number): void {
    let i = 0;
    let currI = start.x;
    let currJ = start.y;
    const wordLength = word.length;

    while (i < wordLength) {
      // Place the letter in the cell
      this.gridArr[currI][currJ] = {
        letter: word[i],
        id: `${currI + 1}-cell-${currJ + 1}`,
        used: true,
        word,
        wordIndex,
        originalWord,
        color: colors[wordIndex],
        letterIndex: i,
      };

      const index = this.wordList.findIndex((w) => w.originalWord === originalWord);
      this.wordList[index].color = colors[wordIndex];

      // Move to the next cell in the specified direction
      switch (direction) {
        case -1:
          currJ -= 1;
          break;
        case 1:
          currJ += 1;
          break;
        case -2:
          currI -= 1;
          break;
        case 2:
          currI += 1;
          break;
        case -3:
          currI -= 1;
          currJ -= 1;
          break;
        case 3:
          currI += 1;
          currJ += 1;
          break;
        case -4:
          currI -= 1;
          currJ += 1;
          break;
        case 4:
          currI += 1;
          currJ -= 1;
          break;
      }

      i++;
    }
  }

  populateWord(word: string, wordIndex?: number, originalWord?: string): boolean {
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loops
    let placed = false;
    while (attempts < maxAttempts) {
      const start: IStartEnd = {
        x: this.getRandomRow(),
        y: this.getRandomColumn(),
      };
      const direction = this.getRandomDirection();

      if (this.isPlacable(word, start, direction)) {
        this.placeWord(word, start, direction, originalWord, wordIndex);
        placed = true;
        break;
      }

      attempts++;
    }
    console.error(`Failed to place the word "${word}" after ${maxAttempts} attempts.`);
    return placed;
  }

  populateUnusedBoxes(): number {
    const mystery = this.mysteryPhrase?.split("");
    let left = 0;
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        if (this.gridArr[i][j].letter === "$$") {
          const m = mystery?.shift();
          if (m) {
            this.gridArr[i][j] = {
              letter: m,
              id: `${i + 1}-cell-${j + 1}`,
              used: false,
              mysteryUsed: true,
              color: "white",
            };
          } else {
            this.gridArr[i][j] = {
              letter: this.alphabets[Math.floor(Math.random() * this.alphabets.length)],
              id: `${i + 1}-cell-${j + 1}`,
              used: false,
              color: "white",
            };
            left++;
          }
        }
      }
    }
    return left;
  }

  getDirection(startObj: IStartEnd, endObj: IStartEnd): number {
    if (startObj.x === endObj.x) {
      return endObj.y > startObj.y ? 1 : -1; // Horizontal right or left
    } else if (startObj.y === endObj.y) {
      return endObj.x > startObj.x ? 2 : -2; // Vertical down or up
    } else if (Math.abs(endObj.x - startObj.x) === Math.abs(endObj.y - startObj.y)) {
      if (endObj.x > startObj.x) {
        return endObj.y > startObj.y ? 3 : -4; // Diagonal down-right or up-left
      } else {
        return endObj.y > startObj.y ? 4 : -3; // Diagonal down-left or up-right
      }
    }
    return 0; // No direction or invalid
  }

  getStringBetweenPoints(startBox: IStartEnd, endBox: IStartEnd): { str: string; ids: number[][] } {
    const direction = this.getDirection(startBox, endBox);
    let str = "";
    let ids: number[][] = [];
    let currX = startBox.x;
    let currY = startBox.y;

    while (true) {
      // Check if we've reached the end point
      if (currX === endBox.x && currY === endBox.y) {
        str += this.gridArr[currX][currY].letter;
        ids.push([currX, currY]);
        break;
      }

      // Append current cell's letter and ID
      str += this.gridArr[currX][currY].letter;
      ids.push([currX, currY]);

      // Move to next cell
      switch (direction) {
        case -1:
          currY -= 1;
          break;
        case 1:
          currY += 1;
          break;
        case -2:
          currX -= 1;
          break;
        case 2:
          currX += 1;
          break;
        case -3:
          currX -= 1;
          currY -= 1;
          break;
        case 3:
          currX += 1;
          currY += 1;
          break;
        case -4:
          currX -= 1;
          currY += 1;
          break;
        case 4:
          currX += 1;
          currY -= 1;
          break;
      }
    }

    return { str, ids };
  }

  TestString(testStr: string): { found: boolean; str?: string; match: boolean } {
    const str = testStr.toUpperCase();
    const reverseStr = str.split("").reverse().join("");
    const matched = this.matchString(str);
    const reverseMatched = this.matchString(reverseStr);
    const matchFound = this.isAlreadyFound(str);
    const reverseMatchFound = this.isAlreadyFound(reverseStr);

    if (matched && !matchFound) {
      return { found: false, str: testStr, match: true };
    } else if (reverseMatched && !reverseMatchFound) {
      return { found: false, str: reverseStr, match: true };
    } else if (matchFound || reverseMatchFound) {
      return { found: true, match: false };
    } else {
      return { found: false, match: false };
    }
  }

  isAlreadyFound(str: string): boolean {
    const upperStr = str.toUpperCase();
    return this.alreadyFound.some((foundStr) => foundStr.toUpperCase() === upperStr);
  }

  matchString(str: string): boolean {
    const upperStr = str.toUpperCase();
    return this.wordList.some((word) => word.text.toUpperCase() === upperStr);
  }

  getBoxById(id: string): IStartEnd & ICell {
    const parts = id.split("-cell-");
    const rowIndex = parseInt(parts[0], 10) - 1; // Convert back to 0-based index
    const columnIndex = parseInt(parts[1], 10) - 1; // Convert back to 0-based index
    const cell = this.gridArr[rowIndex][columnIndex];
    return {
      x: rowIndex,
      y: columnIndex,
      ...cell,
    };
  }

  get rowCount() {
    return this.gridArr.length;
  }

  get colCount() {
    return this.gridArr?.[0]?.length || 20;
  }
}

export default WSGenerator;
