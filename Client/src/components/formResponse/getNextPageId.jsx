/**
 * Determine the next pageId based on conditions
 * @param {string} currentPageId - Current page id
 * @param {Array} responses - User responses from redux
 * @param {Array} allPages - Full questions data (API response)
 * @returns {string | null} - next pageId or null if no page found
 */
export const getNextPageId = (currentPageId, responses, allPages) => {
  // Find current page from API pages
  const currentPage = allPages.find((p) => p._id === currentPageId);
  if (!currentPage) return null;

  // Flatten questions: handle sections with elements as well
  const allQuestions = [];
  currentPage.questions.forEach((q) => {
    if (q.sectionId && Array.isArray(q.elements)) {
      allQuestions.push(...q.elements); // Push elements as questions
    } else {
      allQuestions.push(q);
    }
  });

  // Filter only questions that have conditions
  const conditionalQuestions = allQuestions.filter((q) => q.conditions);

  if (conditionalQuestions.length === 0) {
    // No conditions: go to the next page in order
    const currentIndex = allPages.findIndex((p) => p._id === currentPageId);
    return allPages[currentIndex + 1]?._id || null;
  }

  // Evaluate all conditions: ALL must be true
  let allTrue = true;
  let truePageId = null;
  let falsePageId = null;

  for (const q of conditionalQuestions) {
    const { questionId, trueAnswer, truePage, falsePage } = q.conditions;
    truePageId = truePage;
    falsePageId = falsePage;

    // Find the user's response for this question
    const userResponse = responses.find(
      (r) => r.qId === questionId || r.elId === questionId
    )?.response;

    if (q.type === "checkbox" && Array.isArray(userResponse)) {
      // Check if at least one matches trueAnswer
      if (!userResponse.includes(trueAnswer)) {
        allTrue = false;
        break;
      }
    } else {
      // Direct comparison for single value
      if (userResponse !== trueAnswer) {
        allTrue = false;
        break;
      }
    }
  }

  return allTrue ? truePageId : falsePageId;
};
