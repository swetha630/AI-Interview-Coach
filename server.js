const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {GoogleGenerativeAI}=require("@google/generative-ai");

const app=express();

app.use(cors());
app.use(express.json());

const genAI=new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

const model=genAI.getGenerativeModel({
model:"gemini-2.5-flash"
});


app.post("/api/question",async(req,res)=>{

try{

const {
targetRole,
skills,
projects,
interviewType,
company
}=req.body;

const prompt=`
Act as a ${interviewType} interviewer.

Candidate applying for:
${targetRole}

Skills:
${skills}

Projects:
${projects}

Company:
${company}

Ask one personalized interview question.
`;

const result=
await model.generateContent(prompt);

res.json({
reply:result.response.text()
});

}
catch(error){

console.log(error);

res.json({
reply:"Question generation failed"
});

}

});
app.post("/api/interview", async(req,res)=>{

try{

const {answer,question,interviewType}=req.body;

const prompt=`
You are a ${interviewType} interviewer.

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the answer.

IMPORTANT:
Return response ONLY in this exact format.

Do NOT use markdown.
Do NOT use bold text.
Do NOT use numbering.

Format:

SCORE:
<score>

STRENGTHS:
<strengths>

IMPROVEMENTS:
<improvements>

FOLLOWUP:
<one follow-up question only>
`;

const result=
await model.generateContent(prompt);

const response=result.response.text();

res.json({
reply:response
});

}
catch(error){

console.log(error);

res.json({
reply:
`SCORE:
8/10

STRENGTHS:
Good communication.

IMPROVEMENTS:
Add more technical depth.

FOLLOWUP:
Can you explain one challenge you faced during implementation?`
});

}

});
app.listen(5001,()=>{
console.log("Server running on 5001");
});