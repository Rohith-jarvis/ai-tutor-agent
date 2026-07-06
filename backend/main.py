import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine, SessionLocal
from config import settings
from auth import get_password_hash
from models import Student, Subject, Lesson, Quiz, CodingProblem

# Routers
from routers import auth, subjects, quizzes, ai, coding, progress, study_plan, pdf, admin

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("tutor_backend")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for AI Personal Tutor Agent"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(subjects.router, prefix=settings.API_V1_STR)
app.include_router(quizzes.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(coding.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
app.include_router(study_plan.router, prefix=settings.API_V1_STR)
app.include_router(pdf.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to AI Personal Tutor Agent API",
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs"
    }

def seed_initial_data():
    """Seeds database with initial admin, demo student, subjects, lessons, and coding problems"""
    db = SessionLocal()
    try:
        # 1. Admin Student & Demo Student
        admin_student = db.query(Student).filter(Student.email == "admin@tutor.ai").first()
        if not admin_student:
            admin_user = Student(
                name="Admin Instructor",
                email="admin@tutor.ai",
                hashed_password=get_password_hash("admin123"),
                is_admin=True,
                streak_days=10
            )
            db.add(admin_user)

        demo_student = db.query(Student).filter(Student.email == "demo@tutor.ai").first()
        if not demo_student:
            demo_user = Student(
                name="Alex Rivers (Student)",
                email="demo@tutor.ai",
                hashed_password=get_password_hash("password123"),
                is_admin=False,
                streak_days=5
            )
            db.add(demo_user)
        
        db.commit()

        # 2. Subjects List (13 Required Subjects)
        subjects_data = [
            {
                "title": "Java",
                "category": "Programming Languages",
                "icon": "Coffee",
                "description": "Object-oriented programming language widely used in enterprise software and Android development.",
                "lessons": [
                    {
                        "title": "Introduction to Java & JVM Architecture",
                        "chapter": "Chapter 1: Fundamentals",
                        "content": "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. The Java Virtual Machine (JVM) executes Java bytecode.",
                        "examples": "class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, AI Tutor!\");\n    }\n}",
                        "exercises": "Write a Java program to print the sum of two integers passed as arguments."
                    },
                    {
                        "title": "Object-Oriented Programming (OOP) Principles",
                        "chapter": "Chapter 2: OOP Concepts",
                        "content": "OOP in Java rests on four core pillars: Encapsulation, Inheritance, Polymorphism, and Abstraction.",
                        "examples": "class Animal {\n    void sound() { System.out.println(\"Animal sound\"); }\n}\nclass Dog extends Animal {\n    void sound() { System.out.println(\"Bark\"); }\n}",
                        "exercises": "Create a Car class inheriting from Vehicle and override the drive() method."
                    }
                ]
            },
            {
                "title": "Python",
                "category": "Programming Languages",
                "icon": "Code",
                "description": "High-level, interpreted programming language known for readable syntax, AI/ML libraries, and web development.",
                "lessons": [
                    {
                        "title": "Python Basics & Data Types",
                        "chapter": "Chapter 1: Core Syntax",
                        "content": "Python supports dynamic typing, lists, tuples, dictionaries, and sets. Whitespace indentation defines code blocks.",
                        "examples": "name = 'AI Tutor'\nscores = [95, 88, 92]\nstudent = {'name': name, 'avg': sum(scores)/len(scores)}\nprint(student)",
                        "exercises": "Write a Python function to reverse a list without using built-in methods."
                    },
                    {
                        "title": "List Comprehensions & Lambdas",
                        "chapter": "Chapter 2: Advanced Syntax",
                        "content": "List comprehensions offer a concise way to create lists based on existing iterables.",
                        "examples": "squares = [x**2 for x in range(10) if x % 2 == 0]\nprint(squares)",
                        "exercises": "Create a list comprehension that filters words longer than 5 letters."
                    }
                ]
            },
            {
                "title": "C Programming",
                "category": "Programming Languages",
                "icon": "Cpu",
                "description": "Foundational procedural programming language featuring low-level memory access and efficient pointer operations.",
                "lessons": [
                    {
                        "title": "Pointers and Memory Allocation",
                        "chapter": "Chapter 1: Memory & Pointers",
                        "content": "A pointer is a variable that stores the memory address of another variable. Dynamic memory allocation uses malloc(), calloc(), and free().",
                        "examples": "#include <stdio.h>\n#include <stdlib.h>\nint main() {\n    int *ptr = (int*) malloc(sizeof(int));\n    *ptr = 42;\n    printf(\"%d\", *ptr);\n    free(ptr);\n    return 0;\n}",
                        "exercises": "Write a C function to swap two integers using pointers."
                    }
                ]
            },
            {
                "title": "Data Structures",
                "category": "Computer Science Core",
                "icon": "Layers",
                "description": "Essential data organization patterns including Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, and Hash Tables.",
                "lessons": [
                    {
                        "title": "Singly & Doubly Linked Lists",
                        "chapter": "Chapter 1: Linear Data Structures",
                        "content": "A Linked List is a linear data structure where elements are not stored at contiguous memory locations. Each node points to the next node.",
                        "examples": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None",
                        "exercises": "Implement a function to detect a cycle in a linked list using Floyd's algorithm."
                    }
                ]
            },
            {
                "title": "HTML",
                "category": "Web Development",
                "icon": "FileCode",
                "description": "HyperText Markup Language - standard markup language for creating web pages and web applications.",
                "lessons": [
                    {
                        "title": "Semantic HTML5 & Accessibility",
                        "chapter": "Chapter 1: Web Foundation",
                        "content": "Semantic HTML tags like <header>, <nav>, <main>, <article>, and <footer> convey meaning to both browsers and assistive technologies.",
                        "examples": "<article>\n  <h2>Learning HTML5</h2>\n  <p>Semantic tags improve SEO and accessibility.</p>\n</article>",
                        "exercises": "Build a responsive accessible form with aria-labels and valid HTML5 inputs."
                    }
                ]
            },
            {
                "title": "CSS",
                "category": "Web Development",
                "icon": "Palette",
                "description": "Cascading Style Sheets - layout, Flexbox, CSS Grid, animations, and modern responsive UI design.",
                "lessons": [
                    {
                        "title": "CSS Flexbox & Grid Layout System",
                        "chapter": "Chapter 1: Modern Layouts",
                        "content": "Flexbox provides 1D layout capabilities while CSS Grid offers complete 2D layout control across columns and rows.",
                        "examples": ".container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n}",
                        "exercises": "Design a responsive 3-column pricing card layout using Flexbox."
                    }
                ]
            },
            {
                "title": "JavaScript",
                "category": "Web Development",
                "icon": "Zap",
                "description": "Modern ECMAScript, Async/Await, Promises, DOM Manipulation, and Frontend Framework fundamentals.",
                "lessons": [
                    {
                        "title": "Promises, Async/Await & Event Loop",
                        "chapter": "Chapter 1: Asynchronous JS",
                        "content": "JavaScript runs on a single-threaded event loop. Promises handle asynchronous operations cleanly without callback hell.",
                        "examples": "async function fetchData() {\n  try {\n    const res = await fetch('https://api.example.com/data');\n    const json = await res.json();\n    console.log(json);\n  } catch (err) {\n    console.error(err);\n  }\n}",
                        "exercises": "Write a function using Promise.all to fetch data from 3 endpoints simultaneously."
                    }
                ]
            },
            {
                "title": "SQL",
                "category": "Databases",
                "icon": "Database",
                "description": "Structured Query Language - SELECT queries, JOINs, Group By, Subqueries, Indexes, and Transactions.",
                "lessons": [
                    {
                        "title": "Advanced Joins & Aggregate Functions",
                        "chapter": "Chapter 1: Data Retrieval",
                        "content": "SQL JOINs combine rows from two or more tables based on a related column between them (INNER, LEFT, RIGHT, FULL OUTER).",
                        "examples": "SELECT s.name, AVG(p.score) as avg_score\nFROM students s\nJOIN progresses p ON s.id = p.student_id\nGROUP BY s.id\nHAVING avg_score > 80;",
                        "exercises": "Write a query to find the top 3 highest scoring students in each subject."
                    }
                ]
            },
            {
                "title": "DBMS",
                "category": "Databases",
                "icon": "HardDrive",
                "description": "Database Management Systems - Relational Algebra, ER Diagrams, Normalization (1NF to BCNF), and ACID properties.",
                "lessons": [
                    {
                        "title": "Database Normalization & ACID Properties",
                        "chapter": "Chapter 1: Database Theory",
                        "content": "Normalization minimizes data redundancy. ACID (Atomicity, Consistency, Isolation, Durability) guarantees reliable database transaction processing.",
                        "examples": "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
                        "exercises": "Convert an unnormalized table structure into Third Normal Form (3NF)."
                    }
                ]
            },
            {
                "title": "Operating System",
                "category": "Computer Science Core",
                "icon": "Monitor",
                "description": "OS Principles - Processes, Threads, CPU Scheduling, Deadlocks, Virtual Memory, and File Systems.",
                "lessons": [
                    {
                        "title": "Process Management & Deadlocks",
                        "chapter": "Chapter 1: OS Architecture",
                        "content": "A process is a program in execution. Deadlock happens when processes are unable to proceed because each is waiting for resources held by another.",
                        "examples": "Banker's Algorithm is used for deadlock avoidance in OS resource allocation.",
                        "exercises": "Calculate average waiting time for Round Robin CPU scheduling given time quantum = 2ms."
                    }
                ]
            },
            {
                "title": "Computer Networks",
                "category": "Computer Science Core",
                "icon": "Network",
                "description": "OSI & TCP/IP Model, Subnetting, HTTP/HTTPS, DNS, Routing Protocols, and Network Security.",
                "lessons": [
                    {
                        "title": "TCP/IP 4-Layer & OSI 7-Layer Models",
                        "chapter": "Chapter 1: Network Layers",
                        "content": "The OSI model consists of Physical, Data Link, Network, Transport, Session, Presentation, and Application layers.",
                        "examples": "HTTP runs on Application layer, TCP runs on Transport layer, IP runs on Network layer.",
                        "exercises": "Explain the TCP 3-way handshake process (SYN, SYN-ACK, ACK)."
                    }
                ]
            },
            {
                "title": "Aptitude",
                "category": "Career & Aptitude",
                "icon": "Award",
                "description": "Quantitative Aptitude, Logical Reasoning, Time & Work, Permutations, Probability, and Data Interpretation.",
                "lessons": [
                    {
                        "title": "Speed, Distance & Time Shortcuts",
                        "chapter": "Chapter 1: Quantitative Aptitude",
                        "content": "Average Speed = 2XY / (X + Y) when equal distances are covered at speeds X and Y.",
                        "examples": "A car travels at 60 km/h going and 40 km/h returning. Average speed = (2 * 60 * 40)/(60 + 40) = 48 km/h.",
                        "exercises": "Solve: Two trains moving in opposite directions cross each other in 12 seconds."
                    }
                ]
            },
            {
                "title": "Interview Preparation",
                "category": "Career & Aptitude",
                "icon": "UserCheck",
                "description": "System Design, Behavioral Interview STAR method, Coding Interview Patterns, and Resume Preparation.",
                "lessons": [
                    {
                        "title": "System Design Fundamentals: Load Balancers & Caching",
                        "chapter": "Chapter 1: High Level Design",
                        "content": "System design evaluates scalable architecture components like Reverse Proxies, Load Balancers, Redis Caching, DB Sharding, and Message Queues.",
                        "examples": "Cache-Aside pattern: Read from Cache first. If Cache Miss -> Query Database -> Write to Cache -> Return response.",
                        "exercises": "Design a URL shortener system like Bitly handling 10M daily requests."
                    }
                ]
            }
        ]

        for s_data in subjects_data:
            subj = db.query(Subject).filter(Subject.title == s_data["title"]).first()
            if not subj:
                subj = Subject(
                    title=s_data["title"],
                    category=s_data["category"],
                    icon=s_data["icon"],
                    description=s_data["description"]
                )
                db.add(subj)
                db.commit()
                db.refresh(subj)

                for idx, l_data in enumerate(s_data["lessons"]):
                    lesson = Lesson(
                        subject_id=subj.id,
                        title=l_data["title"],
                        chapter=l_data["chapter"],
                        content=l_data["content"],
                        examples=l_data["examples"],
                        exercises=l_data["exercises"],
                        order=idx + 1
                    )
                    db.add(lesson)

        db.commit()

        # 3. Initial Coding Problems
        if db.query(CodingProblem).count() == 0:
            probs = [
                CodingProblem(
                    title="Two Sum Problem",
                    language="Python",
                    difficulty="Easy",
                    problem_statement="Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.",
                    sample_input="nums = [2, 7, 11, 15], target = 9",
                    sample_output="[0, 1]",
                    hints="Use a hash map to store seen numbers and their indices.",
                    solution_code="def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
                    explanation="By iterating once through the list and keeping track of compliments in a dictionary, we reduce time complexity from O(N^2) to O(N)."
                ),
                CodingProblem(
                    title="Reverse a String in Java",
                    language="Java",
                    difficulty="Easy",
                    problem_statement="Write a Java method to reverse a given string in-place or using a StringBuilder.",
                    sample_input="\"AI Tutor\"",
                    sample_output="\"rotuT IA\"",
                    hints="StringBuilder has a reverse() method, or use a two-pointer technique on character array.",
                    solution_code="public class Solution {\n    public static String reverseString(str) {\n        return new StringBuilder(str).reverse().toString();\n    }\n}",
                    explanation="StringBuilder's reverse() method efficiently modifies character order in O(N) time."
                ),
                CodingProblem(
                    title="Find Maximum Element in C",
                    language="C",
                    difficulty="Medium",
                    problem_statement="Write a C function to find the maximum element in an integer array of size N.",
                    sample_input="arr = {12, 45, 67, 23, 89, 34}, N = 6",
                    sample_output="89",
                    hints="Initialize max variable with the first element and iterate through the array.",
                    solution_code="#include <stdio.stdio.h>\nint findMax(int arr[], int n) {\n    int max = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > max) max = arr[i];\n    }\n    return max;\n}",
                    explanation="Compares each element against current max value in linear time O(N)."
                )
            ]
            db.add_all(probs)
            db.commit()

        logger.info("Database initialized and initial seed data created successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

# Seed database on startup
seed_initial_data()
