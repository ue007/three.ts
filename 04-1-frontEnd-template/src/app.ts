import * as THREE from 'three';
import './style.css';

export type AppOptionType = {
  id: string;
};

/**
 * 引擎主入口
 *
 * @classdesc
 *
 * @example
 *  let app = new App({
 *
 * });
 * @class
 * @category
 * @extends {maptalks.CanvasLayer}
 * @param {AppOptionType} options - options defined in [options]{@link App#options}
 */
export default class App {
  options: AppOptionType;

  constructor(options?: AppOptionType) {
    this.options = options;
    console.log(THREE);
    console.log(this.options);
  }
}
