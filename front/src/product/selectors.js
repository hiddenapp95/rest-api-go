import interview, {interviewProperties} from "./model";
import NAME from "./constants";
import {valueIsOfType} from "../utils/utils";

export const getSectionLabel = (state) => interview[interviewProperties[state[NAME].interviewPropertyIndex]].label;

export const getSectionProperties = (state) => interview[interviewProperties[state[NAME].interviewPropertyIndex]].properties;

export const getSectionPropertyValues = (state) => state[NAME].interview[interviewProperties[state[NAME].interviewPropertyIndex]];

export const isLastSection = (state) => state[NAME].interviewPropertyIndex >= (Object.keys(state[NAME].interview).length-1);

export const isFirstSection = (state) => state[NAME].interviewPropertyIndex <= 0;

export const isLoading = (state) => state[NAME].requesting ;

export const getInterviews = (state) => state[NAME].matchingFilterInterviews;
