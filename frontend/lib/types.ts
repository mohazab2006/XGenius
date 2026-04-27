export type MatchPrediction = {
  team_a: string;
  team_b: string;
  probabilities: {
    team_a_win: number;
    draw: number;
    team_b_win: number;
  };
  expected_goals: {
    team_a_xg: number;
    team_b_xg: number;
  };
  explanation: string;
};

export type TeamProbabilities = {
  p_reach_round_of_16: number;
  p_reach_quarterfinals: number;
  p_reach_semifinals: number;
  p_reach_final: number;
  p_winner: number;
};

export type TeamRow = {
  team: string;
  probabilities: TeamProbabilities;
};

export type TournamentResult = {
  tournament: string;
  n_simulations: number;
  random_seed_used: number;
  bracket: { r16: string; knockout_tie: string };
  teams: TeamRow[];
};

export type TeamProbsResult = {
  n_simulations: number;
  random_seed_used: number;
  teams: TeamRow[];
};

export type ApiError = { message: string; status?: number };
