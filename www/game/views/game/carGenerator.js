import {Probability} from 'www/libs/probability';
import {valuesSetIntoPercetages} from 'www/utils/probability';

const getTrace = (config) => {
  const probablityArray = valuesSetIntoPercetages(config.traces.map((element) => element.probability));
  let randomizedTrace;
  const probablityConfig = config.traces.map((element, index) => {
    return {
      p: probablityArray[index],
      f: () => {
        randomizedTrace = element.name;
      }
    };
  });
  const probabilitilized = new Probability(probablityConfig);

  probabilitilized();

  return randomizedTrace;
};

const getCarIndex = (config) => {
  const probablityArray = valuesSetIntoPercetages(config.cars.map((element) => element.probability));
  let randomizedCarIndex;
  const probablityConfig = config.cars.map((element, index) => {
    return {
      p: probablityArray[index],
      f: () => {
        randomizedCarIndex = index;
      }
    };
  });
  const probabilitilized = new Probability(probablityConfig);

  probabilitilized();

  return randomizedCarIndex;
};

const getCar = (config, carIndex) => {
  return config.cars[carIndex];
};

const getSpeed = (context, config, carIndex) => {
  const speedRange = getCar(config, carIndex).speed;

  return context.rnd.integerInRange(speedRange[0], speedRange[1]);
};

export const carGenerate = (context, config) => {
  const traceId = getTrace(config);
  const carIndex = getCarIndex(config);
	const car = context.cars.create(
		context.roadPaths.points[traceId].x[0],
		context.roadPaths.points[traceId].y[0],
		getCar(config, carIndex).type
	);

	car.anchor.set(0.5);
	context.physics.arcade.enable(car);

	car.data.distance = 0;
	car.data.speed = getSpeed(context, config, carIndex);
	car.data.pathIndex = traceId;
}