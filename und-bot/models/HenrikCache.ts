import { RequestManager } from "../utils";
import { PremierTeamModel } from "./PremierTeamModel";
import { ValorantPlayerModel } from "./ValorantPlayerModel";
import axios from "axios";
import { apiTransformDates, PremierSeason } from "../utils";

class HenrikCache {
  teams: Map<string, PremierTeamModel> = new Map();
  players: Map<string, ValorantPlayerModel> = new Map();

  private _seasons?: PremierSeason[];
  lasSeasonsUpdate = 0;

  manager = new RequestManager(30, 70 * 1000);

  getTeam(name: string, tag: string) {
    let team = this.teams.get(`${name}#${tag}`);
    if (team) return team;
    team = new PremierTeamModel(this.manager, name, tag);
    this.teams.set(`${name}#${tag}`, team);
    return team;
  }

  getPlayer(name: string, tag: string) {
    let player = this.players.get(`${name}#${tag}`);
    if (player) return player;
    player = new ValorantPlayerModel(this.manager, name, tag);
    this.players.set(`${name}#${tag}`, player);
    return player;
  }

  async getSeasons({ update } = { update: false }) {
    if (
      !(update || this.lasSeasonsUpdate + 3600 * 24 * 1000 * 7 > Date.now()) &&
      this._seasons
    )
      return this._seasons;
    const { data } = await axios.get(
      `https://api.henrikdev.xyz/valorant/v1/premier/seasons/eu`
    );
    if (data.status != 200) {
      throw new Error(data.errors);
    } else {
      this._seasons = apiTransformDates(data.data);
    }
    this.lasSeasonsUpdate = Date.now();
    return this._seasons;
  }
}

const cache = new HenrikCache();

export default cache;
