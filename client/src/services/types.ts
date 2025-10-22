export type CollabStep = {
  from: number;
  to: number;
  slice: {
    content: {
      text: string;
      type: string;
    }[];
  };
  stepType: string;
};

export type CollabData = {
  steps: CollabStep[];
  clientIDs: number[];
  version: number;
};
