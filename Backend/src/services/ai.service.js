const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function invokeGeminiAi() {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: "Hello Gemini! Explain what is an interview.",
    });

    console.log(response.text);
}

const interviewReportSchema = z.object({
    matchScore: z
        .number()
        .describe(
            "A score between 0 and 100 indicating how well the candidate's profile matches the job description."
        ),

    technicalQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The technical question that can be asked in the interview."),

                intention: z
                    .string()
                    .describe("The intention of the interviewer behind asking this question."),

                answer: z
                    .string()
                    .describe(
                        "How to answer this question, what points to cover, and what approach to take."
                    ),
            })
        )
        .describe(
            "Technical interview questions along with their intention and ideal answers."
        ),

    behavioralQuestions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe("The behavioral interview question."),

                intention: z
                    .string()
                    .describe("The intention of the interviewer behind asking this question."),

                answer: z
                    .string()
                    .describe(
                        "How the candidate should answer this behavioral question."
                    ),
            })
        )
        .describe(
            "Behavioral interview questions along with their intention and ideal answers."
        ),

    skillGaps: z
        .array(
            z.object({
                skill: z
                    .string()
                    .describe("The skill which the candidate is lacking."),

                severity: z
                    .enum(["low", "medium", "high"])
                    .describe(
                        "The severity of this skill gap, i.e. how important this skill is for the job."
                    ),
            })
        )
        .describe(
            "List of skill gaps in the candidate's profile along with their severity."
        ),

    preparationPlan: z
        .array(
            z.object({
                day: z
                    .number()
                    .describe(
                        "The day number in the preparation plan, starting from 1."
                    ),

                focus: z
                    .string()
                    .describe(
                        "The main focus of this day in the preparation plan."
                    ),

                tasks: z
                    .array(z.string())
                    .describe(
                        "List of tasks to be completed on this day."
                    ),
            })
        )
        .describe(
            "A day-wise preparation plan for the candidate."
        ),

    title: z
        .string()
        .describe(
            "The title of the job for which the interview report is generated."
        ),
});

async function generateInterviewReport({
    resume,
    resumeText,
    selfDescription,
    jobDescription,
}) {
    const resumeContent = resumeText || resume;
    const prompt = `
Generate an interview report for a candidate with the following details:

Resume:
${resumeContent}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return only valid JSON.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseJsonSchema: zodToJsonSchema(interviewReportSchema),
        },
    });

    return JSON.parse(response.text);
}

module.exports = {
    invokeGeminiAi,
    generateInterviewReport,
};
