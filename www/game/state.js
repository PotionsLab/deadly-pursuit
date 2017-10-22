import {STAGE} from "./consts/stage";

export const state = {
   gameState: STAGE.NOT_STARTED,
   level: 0,
   tileSpeed: 10,
   lastObjectDistance: 0,
   counter: {
        coins: 0,
        distance: 0,
        speed: 30
    }
};
