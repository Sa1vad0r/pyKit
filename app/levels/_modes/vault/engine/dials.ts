export interface Round {
  code: number[]; // the code you are given (and must match)
  offsets: number[]; // where each dial starts
  steps: number[]; // how far each dial jumps every second
}

const rand = (n: number) => Math.floor(Math.random() * n);

export function makeRound(dials: number, stepSizes: number[]): Round {
  return {
    code: Array.from({ length: dials }, () => rand(10)),
    offsets: Array.from({ length: dials }, () => rand(10)),
    steps: Array.from({ length: dials }, () => stepSizes[rand(stepSizes.length)]),
  };
}

/** The digits showing on the keypad at a given second. Locked dials freeze on the code digit. */
export function keysAt(round: Round, tick: number, locked: boolean[]): number[] {
  return round.code.map((c, i) => (locked[i] ? c : (round.offsets[i] + round.steps[i] * tick) % 10));
}
