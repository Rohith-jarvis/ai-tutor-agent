import json
import logging
from typing import Dict, Any, List
from config import settings
from services.prompt_templates import (
    TEACHING_SYSTEM_PROMPT,
    CODE_EXPLAINER_PROMPT,
    QUIZ_GENERATOR_PROMPT,
    NOTES_GENERATOR_PROMPT,
    DOUBT_SOLVER_PROMPT,
    RECOMMENDATION_PROMPT
)

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.client = None
        
        if self.api_key:
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Failed to initialize OpenAI client: {e}")

    def chat_tutor(self, message: str, subject: str = "General", level: str = "Intermediate") -> Dict[str, Any]:
        """Interactive AI Tutor multi-turn chat response"""
        if self.client:
            try:
                system_msg = TEACHING_SYSTEM_PROMPT.format(level=level)
                user_msg = f"Subject: {subject}\nStudent Question/Topic: {message}"
                
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": system_msg},
                        {"role": "user", "content": user_msg}
                    ],
                    temperature=0.7
                )
                reply = response.choices[0].message.content
                return {"reply": reply, "code_snippet": None, "diagram": None}
            except Exception as e:
                logger.error(f"OpenAI chat failed: {e}")
                # Fallthrough to mock

        # Mock Fallback Response
        reply = (
            f"### Tutor Response ({level} level) - {subject}\n\n"
            f"Great question about **{message}**! Let's break this down simply:\n\n"
            f"1. **Core Concept**: In {subject}, {message} is a foundational concept. Think of it as a blueprint or building block that allows your program to manage logic and structure efficiently.\n\n"
            f"2. **Real-world Analogy**: Imagine a library catalog system where every book has a call number. {message} functions similarly by organizing data for quick retrieval.\n\n"
            f"3. **Example Code**:\n```python\n# Practical example of {message}\ndef demonstrate_concept():\n    data = ['step1', 'step2', 'step3']\n    for item in data:\n        print(f'Processing {message}: {item}')\n\ndemonstrate_concept()\n```\n\n"
            f"4. **Line-by-Line**: Line 2 defines the function, line 3 initializes sample items, line 4 iterates through them, and line 5 prints the execution.\n\n"
            f"💡 *Tip*: Try running this in the Coding Practice tab or ask me to generate a quick quiz on this topic!"
        )
        return {"reply": reply, "code_snippet": None, "diagram": None}

    def generate_quiz(self, subject: str, topic: str, num_questions: int, difficulty: str, question_type: str) -> List[Dict[str, Any]]:
        """Generates dynamic quiz questions via AI or fallback template"""
        if self.client:
            try:
                prompt = QUIZ_GENERATOR_PROMPT.format(
                    num_questions=num_questions,
                    difficulty=difficulty,
                    question_type=question_type,
                    subject=subject,
                    topic=topic
                )
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.5
                )
                content = response.choices[0].message.content.strip()
                if content.startswith("```json"):
                    content = content.replace("```json", "").replace("```", "").strip()
                questions = json.loads(content)
                return questions
            except Exception as e:
                logger.error(f"Quiz generation failed: {e}")
                # Fallthrough to fallback

        # Fallback Mock Quiz Questions
        return [
            {
                "question": f"What is the primary function of {topic or subject} in programming?",
                "options": [
                    "A) To manage memory allocated to data structures",
                    "B) To define execution rules and logical statements",
                    "C) To connect directly to backend databases without code",
                    "D) To render HTML pages directly on client side"
                ],
                "answer": "B) To define execution rules and logical statements",
                "explanation": f"In {subject}, the main role of {topic or subject} is establishing clear logical rules and control flow.",
                "difficulty": difficulty,
                "question_type": question_type
            },
            {
                "question": f"Which of the following is a key characteristic of {subject}?",
                "options": [
                    "A) Strict syntax requirements for variables",
                    "B) Automatic hardware assembly conversion",
                    "C) Portability and structured modular design",
                    "D) Inability to handle loop iterations"
                ],
                "answer": "C) Portability and structured modular design",
                "explanation": f"{subject} emphasizes structured, modular code that can be reused across different program modules.",
                "difficulty": difficulty,
                "question_type": question_type
            },
            {
                "question": f"What will be the outcome of an unhandled exception or syntax error in {subject}?",
                "options": [
                    "A) Program completes silently without output",
                    "B) Execution halts with a runtime or compile error trace",
                    "C) Operating system automatically fixes the mistake",
                    "D) Computer restarts automatically"
                ],
                "answer": "B) Execution halts with a runtime or compile error trace",
                "explanation": "Unhandled exceptions interrupt execution and print stack traces indicating the fault location.",
                "difficulty": difficulty,
                "question_type": question_type
            }
        ]

    def generate_notes(self, topic: str, subject: str, detail_level: str = "Standard") -> Dict[str, Any]:
        """Generates structured notes and flashcards"""
        if self.client:
            try:
                prompt = NOTES_GENERATOR_PROMPT.format(topic=topic, subject=subject)
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.6
                )
                content = response.choices[0].message.content
                return {
                    "topic": topic,
                    "subject": subject,
                    "notes_markdown": content,
                    "flashcards": [
                        {"front": f"What is {topic}?", "back": f"A key mechanism in {subject} used to structure logic and manage data."},
                        {"front": f"Key advantage of {topic}", "back": "Improves code reusability, modularity, and readability."}
                    ]
                }
            except Exception as e:
                logger.error(f"Notes generation failed: {e}")

        # Fallback Mock Notes
        markdown = (
            f"# Study Notes: {topic} ({subject})\n\n"
            f"## Executive Summary\n"
            f"**{topic}** is a core component of **{subject}**. Mastering this topic ensures you can build reliable, high-performance applications.\n\n"
            f"## Key Takeaways\n"
            f"- **Definition**: The structural pattern in {subject} that organizes program state.\n"
            f"- **Best Practice**: Always maintain clear separation of concerns when implementing {topic}.\n"
            f"- **Performance**: Efficient usage reduces memory overhead and improves execution speed.\n\n"
            f"## Code Example\n"
            f"```\n// Sample implementation of {topic}\nvoid execute() {{\n    print('Mastering {topic} in {subject}');\n}}\n```\n"
        )
        return {
            "topic": topic,
            "subject": subject,
            "notes_markdown": markdown,
            "flashcards": [
                {"front": f"What is {topic}?", "back": f"A core pattern in {subject} that organizes program logic."},
                {"front": f"Why is {topic} important?", "back": "It ensures code reusability and clean architecture."}
            ]
        }

    def solve_doubt(self, question: str, subject: str) -> Dict[str, Any]:
        """Provides instant doubt resolution with explanation & diagram"""
        if self.client:
            try:
                prompt = DOUBT_SOLVER_PROMPT.format(question=question, subject=subject)
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.5
                )
                return {"solution": response.choices[0].message.content}
            except Exception as e:
                logger.error(f"Doubt solving failed: {e}")

        solution = (
            f"### Doubt Resolution for {subject}\n\n"
            f"**Your Question**: \"{question}\"\n\n"
            f"**Detailed Solution**:\n"
            f"1. **Understanding the Root**: In {subject}, this issue typically occurs due to confusion around execution order or syntax rules.\n"
            f"2. **Step-by-Step Fix**:\n"
            f"   - Check variable scope and declarations.\n"
            f"   - Ensure all open brackets/blocks are properly closed.\n"
            f"   - Verify return types match function signatures.\n\n"
            f"**Visual Diagram**:\n"
            f"```\n[Input Data] ---> [ {question} Handler ] ---> [ Output / Result ]\n                         |\n                         v\n                  [ Validated State ]\n```\n\n"
            f"**Pro Tip**: Try testing small isolated code snippets to isolate edge cases!"
        )
        return {"solution": solution}

    def get_recommendations(self, completed_subjects: list, weak_topics: list, avg_score: float, streak: int) -> List[str]:
        """Synthesizes AI study recommendations"""
        if self.client:
            try:
                prompt = RECOMMENDATION_PROMPT.format(
                    completed_subjects=", ".join(completed_subjects) if completed_subjects else "None",
                    weak_topics=", ".join(weak_topics) if weak_topics else "None",
                    avg_score=avg_score,
                    streak=streak
                )
                response = self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7
                )
                recs = [r.strip("- ") for r in response.choices[0].message.content.split("\n") if r.strip()]
                return recs[:4]
            except Exception as e:
                logger.error(f"Recommendations failed: {e}")

        # Default recommendations
        recs = []
        if weak_topics:
            recs.append(f"Revise weak topic: '{weak_topics[0]}' to improve quiz scores above {avg_score}%.")
        else:
            recs.append("Start Chapter 1 of 'Data Structures & Algorithms' to strengthen technical fundamentals.")
        
        recs.append("Complete today's coding practice challenge in Python or Java.")
        recs.append("Generate a quick 5-question MCQ quiz on Operating Systems concepts.")
        recs.append(f"Maintain your {streak}-day learning streak by spending 15 minutes in AI Tutor Chat.")
        return recs

ai_service = AIService()
