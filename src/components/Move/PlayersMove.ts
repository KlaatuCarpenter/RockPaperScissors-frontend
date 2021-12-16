import { BigNumber } from "@ethersproject/bignumber"


export type ChoiceObserver = (choice: number) => void
export type OpponentObserver = (opponent: string) => void
export type WagerObserver = (wager: BigNumber) => void
export type GameObserver = (finished: boolean) => void

export class PlayersChoice {
    private observers: ChoiceObserver[] = []

    public attach(observer: ChoiceObserver) {
        this.observers.push(observer)
    }

    public update(newChoice: number) {
        this.notify(newChoice)
    }

    private notify(choice: number) {
        this.observers.forEach(observer => observer(choice))
    }
}

export class PlayersWager {
    private observers: WagerObserver[] = []

    public attach(observer: WagerObserver) {
        this.observers.push(observer)
    }

    public update(newWager: BigNumber) {
        this.notify(newWager)
    }

    private notify(wager: BigNumber) {
        this.observers.forEach(observer => observer(wager))
    }
}

export class PlayersOpponent {
    private observers: OpponentObserver[] = []

    public attach(observer: OpponentObserver) {
        this.observers.push(observer)
    }

    public update(newOpponent: string) {
        this.notify(newOpponent)
    }

    private notify(opponent: string) {
        this.observers.forEach(observer => observer(opponent))
    }
}


export class GameFinished {
    private observers: GameObserver[] = []

    public attach(observer: GameObserver) {
        this.observers.push(observer)
    }

    public update(newGameSatus: boolean) {
        this.notify(newGameSatus)
    }

    private notify(gameStatus: boolean) {
        this.observers.forEach(observer => observer(gameStatus))
    }
}

const playersOpponent = new PlayersOpponent()
const playersChoice = new PlayersChoice()
const playersWager = new PlayersWager()
const gameFinished = new GameFinished()

export { playersChoice, playersWager, playersOpponent, gameFinished }