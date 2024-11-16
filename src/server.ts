import { Config } from './config';

function welcome(name: string) {
  // console.log('Welcome to the game', name, Config.PORT);
  return {
    message: `Welcome to the game ${name}`,
    port: Config.PORT,
  };
}

welcome('jhon');
