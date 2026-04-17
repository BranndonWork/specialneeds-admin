import Utils from "@utils";
export const ratingQuestions = {
  camps: [
    {
      question: "Qualifications",
      tooltip:
        "How qualified are the camp staff to work with individuals with special needs? Are they trained in behavior management and special education? Are they certified in any relevant fields?",
    },
    {
      question: "Equipment / Supplies",
      tooltip:
        "Does the camp have appropriate equipment and supplies to support the needs of individuals with special needs? This could include adaptive equipment, sensory tools, and specialized medical equipment.",
    },
    {
      question: "Camper / Staff Ratio",
      tooltip:
        "What is the ratio of campers to staff? Is this ratio appropriate for the needs of the campers?",
    },
    {
      question: "Behavioral Support",
      tooltip:
        "How does the camp address behavioral challenges that may arise? Are there behavior plans in place for individual campers, and are staff trained to manage challenging behaviors?",
    },
    {
      question: "Activities / Programs",
      tooltip:
        "What kinds of activities and programs does the camp offer? Are these activities and programs accessible and appropriate for individuals with special needs?",
    },
    {
      question: "Social Skills Support",
      tooltip:
        "How does the camp support the development of social skills in individuals with special needs? Are there opportunities for campers to practice social skills and make friends?",
    },
  ],
  schools: [
    {
      question: "Educational Programs",
      tooltip:
        "What kind of educational programs are offered at the school? Are these programs inclusive of individuals with special needs, and are they appropriately challenging?",
    },
    {
      question: "Qualifications",
      tooltip:
        "What qualifications do the teachers and staff have to work with individuals with special needs? Are they trained in special education, behavior management, and other relevant areas?",
    },
    {
      question: "Safety & Accessibility",
      tooltip:
        "Is the school safe and accessible for individuals with special needs? Are there appropriate accommodations in place to support accessibility?",
    },
    {
      question: "Overall Satisfaction",
      tooltip:
        "How satisfied are parents/guardians and students with the school overall? Are there areas for improvement?",
    },
    {
      question: "Communication",
      tooltip:
        "How well does the school communicate with parents/guardians about their child's progress and any concerns that arise? Is communication open and responsive?",
    },
    {
      question: "Support Services",
      tooltip:
        "What kind of support services does the school offer for individuals with special needs? This could include things like occupational therapy, speech therapy, and counseling.",
    },
  ],
};

// set the id of each question to the camelCase version of the question
const setRatingIds = (questions) => {
  return questions.map((question, index) => {
    question.id = Utils.toCamelCase(question.question);
    return question;
  });
};

// if ratingQuestions contains the category, return the questions
// otherwise, return an empty array
export const getRatingQuestions = (category) => {
  if (ratingQuestions[category]) {
    return setRatingIds(ratingQuestions[category]);
  }
  return [];
};

export const getQuestionDescription = (question) => {
  // loop through each category
  for (const category in ratingQuestions) {
    // loop through each question in the category
    for (const q of ratingQuestions[category]) {
      // if the question matches, return the description
      if (q.question === question) {
        return q.tooltip;
      }
    }
  }
  // if no match is found, return an empty string
  return "";
};

export default getRatingQuestions;
