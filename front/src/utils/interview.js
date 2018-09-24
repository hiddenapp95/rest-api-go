const interviewsKey = "interviews";

export const addInterview = (interview) => {
    let interviews = getValueFromKey(interviewsKey);
    if(!interviews)
        interviews = [];
    interviews.push(interview);
    setKeyValue(interviewsKey,interviews);
};

export const deleteInterview = (index) => {
    let interviews = getValueFromKey(interviewsKey);

    if(!interviews || interviews.length>=index)
        throw errors.defaultError;

    interviews.splice(index, 1);
    setKeyValue(interviewsKey,interviews);
};

export const updateInterview = (index,interview) => {
    let interviews = getValueFromKey(interviewsKey);

    if(!interviews || interviews.length>=index)
        throw errors.defaultError;

    interviews[index] = interview;
    setKeyValue(interviews);
};