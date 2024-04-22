export interface PremierSeason {
  id: string;
  championship_event_id: string;
  championship_points_required: number;
  starts_at: Date;
  ends_at: Date;
  enrollment_starts_at: Date;
  enrollment_ends_at: Date;
  events: PremierSeasonEvent[];
}

export interface PremierSeasonEvent {
  id: string;
  type: EventType;
  starts_at: Date;
  ends_at: Date;
  conference_schedules: ConferenceSchedule[];
  map_selection: MapSelection;
  points_required_to_participate: number;
}

export interface ConferenceSchedule {
  conference: Conference;
  starts_at: Date;
  ends_at: Date;
}

export enum Conference {
  EuCentralEast = "EU_CENTRAL_EAST",
  EuMiddleEast = "EU_MIDDLE_EAST",
  EuTurkey = "EU_TURKEY",
  EuWest = "EU_WEST",
}

export interface MapSelection {
  type: MapSelectionType;
  maps: ValorantMap[];
}

export interface ValorantMap {
  name: string;
  id: string;
}

export enum MapSelectionType {
  Pickban = "PICKBAN",
  Random = "RANDOM",
}

export enum EventType {
  League = "LEAGUE",
  Tournament = "TOURNAMENT",
}
