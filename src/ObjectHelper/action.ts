import { Action, ActionPriority, ActionState } from "./types";

export default {
  create: (): Action => {
    return {
      workLog: [],
      dateOfCompletion: null,
      dd: {
        type: null,
        uuid: null,
      },
      ddo: {
        uuid: null,
      },
      degreeOfCompletion: 0,
      dueDate: null,
      description: "",
      followup: false,
      overdue: false,
      priority: ActionPriority.normal,
      responsible: {
        uuid: null
      },
      source: "",
      startDate: null,
      state: ActionState.notStarted,
      title: "",
      tracker: null,
      workflow: null
    };
  },
  compare: {
    priority: (a: ActionPriority, b: ActionPriority) => {
      if (a === ActionPriority.high && b !== ActionPriority.high) {
        return 1;
      } else if (a === ActionPriority.normal) {
        if (b === ActionPriority.high) {
          return -1;
        } else if (b === ActionPriority.low) {
          return 1;
        } else {
          return 0;
        }
      } else if (a === ActionPriority.low && b !== ActionPriority.low) {
        return -1;
      }
    },
  },
};
