export type CollabStep = {
  stepType: string;
  from: number;
  to: number;
  slice: Record<string, unknown>;
};

export type CollabPostBody = {
  version: number;
  steps: CollabStep[];
  clientID: number;
  clientIDs?: number[];
};
