import Tiles from "@cod/minecraft/src/tiles/tile-green@1.png";
import { Game, Scene, Types } from "phaser";

class MainScene extends Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("tiles", Tiles);
  }

  create() {
    const mapData = new Phaser.Tilemaps.MapData({
      width: 10,
      height: 10,
      tileWidth: 64,
      tileHeight: 32,
      orientation: Phaser.Tilemaps.Orientation.ISOMETRIC,
      format: Phaser.Tilemaps.Formats.ARRAY_2D,
    });
  }
}

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "game",
  backgroundColor: "#fff",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [MainScene],
};

export default new Game(config);
