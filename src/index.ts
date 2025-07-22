import { createInterface } from "readline/promises";

enum Choice {
  Rock,
  Paper,
  Scissors,
}

enum Result {
  Win,
  Lose,
  Draw,
}

const CHOICES = [Choice.Rock, Choice.Scissors, Choice.Paper];

// ask user for input
async function prompt(query: string) {
  const readline = createInterface(process.stdin, process.stdout);
  const answer = await readline.question(query);
  readline.close();
  return answer.trim();
}

// play RPS between player and computer -> Win, Lose or Draw
function playMatch(playerChoice: Choice, computerChoice: Choice): Result {
  const winningChoices = {
    [Choice.Rock]: Choice.Scissors,
    [Choice.Paper]: Choice.Rock,
    [Choice.Scissors]: Choice.Paper,
  };

  if (playerChoice === computerChoice) {
    return Result.Draw;
  }

  return computerChoice === winningChoices[playerChoice]
    ? Result.Win
    : Result.Lose;
}

// prompt user for game mode (p/c)
async function selectGameMode(): Promise<string> {
  let input = "";
  let message = "";

  message += "p - Player vs Computer\n";
  message += "c - Computer vs Computer\n";
  console.log(message);

  do {
    input = (await prompt("Select a game mode:\n> ")).trim();
  } while (!["p", "c"].includes(input));

  return input;
}

// prompt user for player mode actinos (r/p/s/q)
async function selectPlayerModeActions(): Promise<string> {
  let input = "";
  let message = "";

  message += "r - Rock\n";
  message += "p - Paper\n";
  message += "s - Scissors\n";
  message += "q - Quit\n";
  console.log(message);

  do {
    input = (await prompt("Select an action:\n> ")).trim();
  } while (!["r", "p", "s", "q"].includes(input));

  return input;
}

// prompt user for player mode actinos (p/q)
async function selectComputerModeActions(): Promise<string> {
  let message = "";
  message += "p - Play Again\n";
  message += "q - Quit\n";
  console.log(message);

  let input = (await prompt("Select an action:\n> ")).trim();
  while (!["p", "q"].includes(input)) {
    input = await prompt("Select an action:\n> ");
  }
  return input;
}

// get random choice
function getRandomChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

async function main() {
  console.clear();

  // select game mode and exit on invalid input
  const gameMode = await selectGameMode();
  if (!["p", "c"].includes(gameMode)) return;

  // set game mode
  const isPlayerMode = gameMode === "p";

  let playerChoice: Choice;
  let computerChoice: Choice = getRandomChoice();

  const choices = {
    r: Choice.Rock,
    p: Choice.Paper,
    s: Choice.Scissors,
  };

  console.clear();
  while (true) {
    // prompt different actions based on player mode
    const action = isPlayerMode
      ? await selectPlayerModeActions()
      : await selectComputerModeActions();

    // exit if 'q' is selected
    if (action === "q") return;

    // set player choice based on selected player mode
    playerChoice = isPlayerMode
      ? choices[action as "r" | "p" | "s"]
      : getRandomChoice();

    console.clear();

    // log choices to console
    console.log(`You chose      : ${Choice[playerChoice]}`);
    console.log(`Computer chose : ${Choice[computerChoice]}`);

    // play RPS
    const result = playMatch(playerChoice, computerChoice);

    // log results to console
    if (result === Result.Draw) {
      console.log("\nDraw! 🤝\n");
    } else if (result === Result.Win) {
      console.log("\nYou Win! 🎉\n");
    } else {
      console.log("\nYou Lose! 😫\n");
    }

    console.log("-----------------------------------\n");
  }
}

main();
