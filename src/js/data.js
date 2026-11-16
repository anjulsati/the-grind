/* ============================================================
   The Grind — one continuous timeline
   Week 1 = Mon 16 Nov 2026 (endsems) ... Week 23 = 26 Apr 2027
   Every problem appears exactly once across the whole plan.
   ============================================================ */

(function () {
  "use strict";

  var LC = "https://leetcode.com/problems/";
  var WEEK1 = "2026-11-16";
  var PLACEMENT_SEASON = "2027-08-01";

  /* exact videos, resolved and verified via YouTube oEmbed */
  var V = {
    "abstract class vs interface java": ["qZEFslUVfx0", "Java Tutorial: Abstract Classes Vs Interfaces", "CodeWithHarry"],
    "acid properties dbms transactions": ["-GS0OxFJsYQ", "Lec-88: ACID Properties of a Transaction | Database Management System", "Gate Smashers"],
    "bankers algorithm deadlock avoidance": ["7gMLNiEz3nw", "L-4.5: Deadlock Avoidance Banker's Algorithm with Example |With English Subtitles", "Gate Smashers"],
    "bcnf normalization dbms": ["mf_PbWPo7VM", "Lec-30: Boyce Codd Normal Form #BCNF #DBMS #Normalization with best examples", "Gate Smashers"],
    "big o notation explained in 10 minutes": ["XMUe3zFhM5c", "Learn Big O notation in 6 minutes 📈", "Bro Code"],
    "binary search intuition explained": ["y6SG0rE6nn4", "Coding Interview Patterns - Binary Search | 8 different problems in a single video", "Nikhil Lohia"],
    "binary tree basics terminology": ["I_JuQ5ayPmc", "L-3.12: Introduction to Trees (Binary Tree, Almost Complete Binary Tree, Full BT, Complete BT, BST)", "Gate Smashers"],
    "caching strategies system design": ["2zIFUqTx_TU", "5 Caching Strategies | System Design Interview | Cache Aside, Read through, Write through | Patterns", "SoftwareDude"],
    "cap theorem explained": ["BHqjEjzAicA", "CAP Theorem Simplified", "ByteByteGo"],
    "cdn and cache control headers": ["Leack-toB4c", "Cache-Control Headers: Browser Caching Explained", "DebugBear"],
    "checked vs unchecked exceptions java": ["bCPClyGsVhc", "Checked vs. Unchecked Exceptions in Java Tutorial - What's The Difference?", "Coding with John"],
    "composite index covering index sql": ["BxAj3bl00-o", "SQL Indexes (Visually Explained) | Clustered vs Nonclustered | #SQL Course 35", "Data with Baraa"],
    "composition over inheritance explained": ["HNzP1aLAffM", "Composition over Inheritance Explained using Retro Games!", "Metaphorically Speaking"],
    "consistent hashing explained": ["UF9Iqmg94tk", "Consistent Hashing | Algorithms You Should Know #1", "ByteByteGo"],
    "cookies vs sessions vs jwt": ["QzntvHz23tw", "Token vs Session Authentication | Authentication Explained!!!", "Piyush Garg"],
    "cors explained web": ["4KHiSt0oLJ0", "CORS in 100 Seconds", "Fireship"],
    "cpu scheduling algorithms fcfs sjf round robin": ["pPAKs7tT8sw", "CPU Scheduling Algorithms (FCFS, SJF, Round Robin) | Learn Coding", "Learn Coding"],
    "database connection pooling explained": ["y3oAiv4hfIo", "Why 1000 Connections Crash Postgres | Connection Pooling & PgBouncer Explained", "Chai aur Code"],
    "database index explained": ["b3bBGEzi4lg", "Interview: How Database Indexing Works🌳", "KodeKloud"],
    "database replication master slave": ["fsZA4K0E3kQ", "Database Replication Explained (Replication Lag, Sync vs Async) | System Design with Microsoft SWE", "Mayank Joshi"],
    "database schema design interview": ["zHEEKq6GJq0", "Database design interview questions | Database Mock Interview", "Design Strong"],
    "database sharding vs partitioning": ["feyeQfLNT_8", "Lec-11: Database Partitioning vs Sharding | System Design with Real Life Examples", "Gate Smashers"],
    "dbms indexing b+ tree": ["aZjYr87r1b8", "10.2  B Trees and B+ Trees. How they are useful in Databases", "Abdul Bari"],
    "dbms normalization 1nf 2nf 3nf": ["EGEwkad_llA", "Lec-33: All Normal Forms with Real life examples | 1NF 2NF 3NF BCNF 4NF 5NF | All in One", "Gate Smashers"],
    "deadlock four necessary conditions os": ["rWFH6PLOIEI", "L-4.1: DEADLOCK concept | Example | Necessary condition | Operating System", "Gate Smashers"],
    "design patterns java tutorial": ["WycvzYFRF6U", "Java Design Patterns Overview | Creational, Structural & Behavioral", "The Curious Coder"],
    "design rate limiter system design": ["MIJFyUPG4Z4", "Design a Distributed Rate Limiter w/ a Ex-Meta Staff Engineer: System Design Breakdown", "Hello Interview"],
    "design url shortener system design": ["9csfoQK2T8g", "URL shortener system design in Hindi | Tinyurl system design in Hindi | Bitly system design in Hindi", "Engineering Digest"],
    "embeddings cosine similarity explained": ["e9U0QAFbfLI", "Cosine Similarity, Clearly Explained!!!", "StatQuest with Josh Starmer"],
    "er model dbms entities relationships": ["GBjLgU1WZvo", "What is ER Diagram? full Explanation | ER Model in DBMS | #dbms #erdiagram", "Learn Coding"],
    "essential linux commands developers": ["bUXuZbU6tYw", "Linux for Beginners: Your Ultimate Guide to Mastering Linux in 2024", "Engineering Digest"],
    "factory design pattern java": ["dMK4TbG29fk", "Factory Design Pattern | Simple, Factory Method & Abstract Factory with Real-Life Examples", "Coder Army"],
    "file system basics os": ["0LtuQhNFFe0", "L-7.1: File System in Operating System | Windows, Linux, Unix, Android etc.", "Gate Smashers"],
    "gate smashers computer networks full course": ["JFF2vJaN0Cw", "Lec-1: Computer Networks and Security Full Syllabus for GATE, UGC NET,DSSSB,NIELIT & University exam", "Gate Smashers"],
    "gate smashers dbms full course": ["kBdlM6hNDAE", "Lec-1: DBMS Syllabus for GATE, UGCNET, NIELIT, DSSSB etc.| Full DBMS for College/University Students", "Gate Smashers"],
    "gate smashers dbms os cn full course": ["kBdlM6hNDAE", "Lec-1: DBMS Syllabus for GATE, UGCNET, NIELIT, DSSSB etc.| Full DBMS for College/University Students", "Gate Smashers"],
    "gate smashers operating system full course": ["bkSWJJZNgf8", "Lec-0:Operating System Syllabus Discussion for all College/University & Competitive exams (GATE,NET)", "Gate Smashers"],
    "geeksforgeeks dbms tutorial": ["Le8efR0xTdg", "Introduction to DBMS | Database Management System for Beginners | GeeksforGeeks School", "GeeksforGeeks School"],
    "geeksforgeeks operating system tutorial": ["mBBJBF-e5As", "Operating System Lecture 01 | GATE + Semester | Introduction & Backdrop (CS & IT)", "GeeksforGeeks GATE English"],
    "hashmap vs hashset in java difference": ["bGw2-Pdg_78", "Coding Interview Patterns - HashSet and HashMap", "Nikhil Lohia"],
    "how arrays work in memory java": ["Qg73uiG9b6A", "How Arrays work in Java | Heap, Contiguous Storage, Random Access | Java Full Course #10", "Coder Army"],
    "how dns works step by step": ["mpQZVYPuDGU", "How a DNS Server (Domain Name System) works.", "PowerCert Animated Videos"],
    "how to evaluate llm applications evals": ["cNF_MO82Qew", "Introduction to LLM Evaluations – Model Evals vs Application Evals | CampusX", "CampusX"],
    "http methods status codes explained": ["qmpUfWN7hh4", "HTTP Status Codes Explained In 5 Minutes", "ByteByteGo"],
    "http vs https tls handshake": ["j9QmMEWmcfo", "SSL, TLS, HTTPS Explained", "ByteByteGo"],
    "idempotency in rest apis": ["t99NvIazD68", "Idempotency in APIs: you should be aware of this!", "Software Developer Diaries"],
    "java arraylist internal implementation": ["jSlmXcE7g7A", "How ArrayList works internally in java | Internal working of ArrayList in java", "KK JavaTutorials"],
    "java arraylist internal working": ["_8-PxGSwnFE", "ArrayList Explained: Master Java's Dynamic Arrays in Minutes!", "Engineering Digest"],
    "java brains object oriented programming": ["BSVKUk58K6U", "OOP 1 | Introduction & Concepts - Classes, Objects, Constructors, Keywords", "Kunal Kushwaha"],
    "java collections framework internals interview": ["3TsmcLZ0WMo", "50+ Real & Tricky Java Collection Framework Interview Questions (2–7 Yrs Experience)", "GenZ Career"],
    "java equals hashcode contract": ["CpVALR9HeTE", "02. Equals and HashCode Contract & Different Variations", "Ankit Wasankar"],
    "java garbage collection explained": ["b2HSqC0RGsM", "Java Heap Memory Deep Dive | Garbage Collection Algorithms Explained | Java Full Course #46", "Coder Army"],
    "java hashmap explained for beginners": ["H62Jfv1DJlU", "Map and HashMap in Java - Full Tutorial", "Coding with John"],
    "java hashmap internal working interview": ["1CJbB6SzjVw", "How HashMap Internally Works in Java With Animation | Popular Java Interview QA | Java Techie", "Java Techie"],
    "java memory leak profiling": ["AHLkbqcVLvY", "Analyze JVM Memory using JVisual VM | Memory Leak | Heap & Thread Dump | Profiling | Java Techie", "Java Techie"],
    "java string immutability explained": ["JjIewPuyexA", "#35 Mutable vs Immutable String in Java", "Telusko"],
    "java string pool immutability": ["Ay4lG9bHkOw", "String Immutability & String Pool Explained with Examples | Java Interview Guide", "CodeSnippet by Chetan"],
    "java threads tutorial basics": ["091vJWjl1A4", "Multithreading Basics: CPU, Core, Program, Process, Thread & much more", "Engineering Digest"],
    "leetcode sql 50 aggregation solutions": ["SvJLXj05cow", "Group By and Having Clause in SQL | SQL Tutorial in Hindi 9", "Rishabh Mishra"],
    "leetcode sql 50 all solutions": ["YdoR3bGAEx4", "Complete SQL Interview Questions in One Shot | Placement Revision | Structured Query Language", "Gate Smashers"],
    "leetcode sql 50 easy solutions": ["nYmoQ4r0DVw", "Solve 70 SQL Questions in 3 hrs | Ultimate SQL Practice | Master SQL", "Build with Akshit"],
    "leetcode sql 50 joins solutions": ["xkYpNfpmbGY", "SQL Joins - Beginner to PRO Masterclass with 10 Examples", "Chandoo"],
    "leetcode sql 50 subqueries solutions": ["nJIEIzF7tDw", "Subquery in SQL | Correlated Subquery + Complete SQL Subqueries Tutorial", "techTFQ"],
    "leetcode sql 50 window functions solutions": ["S1do1EeA7ng", "SQL Window Function with Example- RANK, DENSE RANK, ROW NUMBER, LEAD/LAG | SQL Tutorial in Hindi 14", "Rishabh Mishra"],
    "linked list data structure explained beginners": ["oAja8-Ulz6o", "Introduction to Linked List | Data Structures & Algorithms | Java Placement Course", "Apna College"],
    "linux file permissions chmod": ["4p2zkY8Q-LQ", "Linux File Permissions For Beginners [HINDI] | Linux CHMOD Command", "M Prashant"],
    "linux ps top lsof kill commands": ["BAwkW0o7SlM", "How to Stop a Process in Linux! | kill Command", "DeployGrid"],
    "load balancer explained": ["TavIqNcnwSA", "Lec-3: Load Balancer in System Design", "Gate Smashers"],
    "mdn http overview": ["ZwpXyHmu42M", "Learn Web Development - Overview", "Jeff Scott Ranken Technical College"],
    "message queue system design": ["sKXCTtGdxWo", "Lec-13: Message Queue System | System Design", "Gate Smashers"],
    "method overloading vs overriding java": ["ryDeTfmSY_o", "Java OVERLOADING vs OVERRIDING. Object Oriented Java tutorial. #16", "Smartherd"],
    "mutex vs semaphore operating system": ["iwJt6hqWfTE", "Mutex vs Semaphore Explained | Concurrency in a Nutshell", "Nutshell"],
    "mysql explain query plan": ["xAZrlhpqw54", "From Slow to Fast: Optimize Your SQL Queries Efficiently | Explain Plan", "Manish Sharma"],
    "n+1 query problem orm": ["A5lprEaWAbQ", "What is N+1 Query Problem (JPA/ORM)", "Yeshendra Dhaker"],
    "observer design pattern java": ["Jpmp4GY8r3Q", "Observer Design Pattern Explained | Real-Life Use Case + Code Example", "Coder Army"],
    "oop four pillars explained java": ["bSrm9RXwBaI", "Java OOPs in One Shot | Object Oriented Programming | Java Language | Placement Course", "Apna College"],
    "orm vs raw sql performance": ["Q7KH9bouXIE", "Should you use raw SQL or ORM?", "Atomic Code"],
    "osi model vs tcp ip model": ["ZOLkWBVMcwU", "11 What Makes OSI and TCP/IP Models Different? Discover the Key Layers", "Chai aur Code"],
    "page replacement algorithms lru fifo": ["8rcUs5RutX0", "L-5.22: Page Replacement Introduction | FIFO Page Replacement algorithm | Operating System", "Gate Smashers"],
    "paging vs segmentation os": ["dz9Tk6KCMlQ", "L-5.17: Segmentation Vs Paging | Segmentation Working | Operating system", "Gate Smashers"],
    "parking lot low level design": ["NU16qSPUmus", "🚗  Parking Lot Design | System Design + LLD + Full Code Implementation", "codeWithAryan"],
    "process states context switching os": ["2dJdHMpCLIg", "L-1.5: Process States in Operating System| Schedulers(Long term,Short term,Medium term)", "Gate Smashers"],
    "process vs thread operating system": ["ITc09gOrqZk", "L-1.11: Process Vs Threads in Operating System", "Gate Smashers"],
    "prompt injection explained llm security": ["jrHRe9lSqqA", "What Is a Prompt Injection Attack?", "IBM Technology"],
    "race condition example java": ["7eV4nib3Cm8", "#89 Race Condition in Java", "Telusko"],
    "rag vs fine tuning when to use": ["00Q0G84kq3M", "RAG vs. Fine Tuning", "IBM Technology"],
    "rate limiting algorithms": ["mQCJJqUfn9Y", "Five Rate Limiting Algorithms ~ Key Concepts in System Design", "Hello Byte"],
    "recursion call stack explained beginners": ["0KE7vhtdfI8", "What Is Recursion in Programming? Base Case, Recursive Case and the Call Stack 🔁", "KnowIt"],
    "rest api design best practices": ["7nm1pYuKAhY", "Deep Dive into REST API Design and Implementation Best Practices", "Software Developer Diaries"],
    "rest vs graphql": ["PTfZcN20fro", "GraphQL vs REST: Which is Better for APIs?", "IBM Technology"],
    "reverse proxy vs forward proxy": ["fe3TP8Momzw", "Lec-5: Forward proxy vs Reverse proxy | System Design", "Gate Smashers"],
    "singleton builder pattern java": ["tSZn4wkBIu8", "The Singleton Pattern Explained and Implemented in Java | Creational Design Patterns | Geekific", "Geekific"],
    "sliding window technique explained": ["uqGxFk0cEdI", "Lec-12: Sliding Window 🪟 Technique | Data Structure", "Gate Smashers"],
    "solid principles explained java": ["vF9dPveOEyo", "SOLID Principles in System Design | Complete Explanation", "Gate Smashers"],
    "solid principles real code example": ["UsNl8kcU4UA", "SOLID Design Principles | Complete Guide with Code Examples", "Coder Army"],
    "sql group by having aggregate functions": ["SvJLXj05cow", "Group By and Having Clause in SQL | SQL Tutorial in Hindi 9", "Rishabh Mishra"],
    "sql interview questions practice": ["YdoR3bGAEx4", "Complete SQL Interview Questions in One Shot | Placement Revision | Structured Query Language", "Gate Smashers"],
    "sql joins explained beginners": ["H6988OpZKTU", "Complete SQL JOINS For Beginners | SQL JOIN Queries with Examples | SQL Tutorial in Hindi 11", "Rishabh Mishra"],
    "sql joins inner left self join": ["V3xjmBi1QQE", "SQL SELF JOIN | UNION & UNION ALL in SQL | SQL Tutorial in Hindi 12", "Rishabh Mishra"],
    "sql order by limit date functions": ["wfBSPELt8Rg", "↕️ SQL ORDER BY, LIMIT & OFFSET: Sorting & Pagination | Free SQL Class, Session 8", "theshiraverse"],
    "sql query optimization basics explain": ["xAZrlhpqw54", "From Slow to Fast: Optimize Your SQL Queries Efficiently | Explain Plan", "Manish Sharma"],
    "sql select where tutorial": ["eiLqDeDp7Oc", "SELECT Statement & WHERE Clause with Example | Operators in SQL | SQL Tutorial in Hindi 5", "Rishabh Mishra"],
    "sql subqueries and cte": ["LJC8277LONg", "SQL WITH Clause | Clearly Explained | CTEs vs Subqueries vs Temp Tables | Recursive CTEs", "Maven Analytics"],
    "sql vs nosql when to use": ["VLgchU0iLxY", "SQL vs NoSQL: Which One Should You Use?", "Gate Smashers"],
    "sql window functions row_number rank": ["rIcB4zMYMas", "SQL Window Functions | Clearly Explained | PARTITION BY, ORDER BY, ROW_NUMBER, RANK, DENSE_RANK", "Maven Analytics"],
    "sqlbolt interactive sql tutorial": ["JSwX1NlpG_Q", "🚀 SQL Lesson 18: Dropping Tables in SQL | SQL Tutorial for Beginners", "Learning with Cinthya"],
    "stack vs queue data structure explained": ["6qjTUfTafsY", "How Stacks and Queues Work (Data Structures)", "Shaurya Rastogi"],
    "strategy design pattern java": ["PpKvPrl_gRg", "Strategy Design Pattern Explained with Real-World Example | Design Patterns in LLD", "Coder Army"],
    "stringbuilder vs string java": ["HvpUTLSt5XM", "Java String vs StringBuilder vs StringBuffer: Best Practices & Performance", "Engineering Digest"],
    "system calls fork exec os": ["ixq5cpdEO2Q", "L-1.8: Fork System call with Example | Fork() system call questions", "Gate Smashers"],
    "system design basics for beginners": ["SE2KF-vxvS0", "System Design for Beginners (2026)", "KodeKloud"],
    "system design basics scaling": ["xpDnVSmNFX0", "System Design BASICS: Horizontal vs. Vertical Scaling", "Gaurav Sen"],
    "tcp three way handshake": ["xkP8iBAdgck", "18 Unveiling TCP 3-Way Handshake: The Backbone of Reliable Connections", "Chai aur Code"],
    "tcp vs udp difference": ["jJyXpMmXJI0", "Lec-77: TCP vs UDP differences in hindi", "Gate Smashers"],
    "thrashing operating system": ["IyWaK8pbN6A", "L-5.16: What is Thrashing | Operating System", "Gate Smashers"],
    "tls handshake explained": ["EBh6emvhUNw", "SSL / TLS Handshake Explained For DevOps Engineers in Hindi", "TrainWithShubham"],
    "tokens context window llm explained": ["-QVoIxEpFkM", "What is a Context Window? Unlocking LLM Secrets", "IBM Technology"],
    "tool calling react agent explained": ["G-usuTzmZE4", "Function calling vs Tool calling vs MCP in AI Agents", "Prateek Singh"],
    "transaction isolation levels dbms": ["-gxyut1VLcs", "Isolation Levels in Database Management Systems", "Edredo for Learners"],
    "transformers explained intuition no math": ["eMlx5fFNoYc", "Attention in transformers, step-by-step | Deep Learning Chapter 6", "3Blue1Brown"],
    "two pointers technique explained coding interview": ["MQmUVokbTrs", "Coding Interview Patterns - Two Pointers", "Nikhil Lohia"],
    "types of keys in dbms": ["RRUeFwuJ39Q", "L2.4 Keys in DBMS | Super Key, Candidate Key, Primary Key, Alternate Key, Foreign Key, Composite Key", "Shanu Kuttan CSE Classes"],
    "uml class diagram basics": ["HuL9EMx8NQo", "Class Diagram in UML | Banking System (Real Life example) | Software Engineering", "Gate Smashers"],
    "virtual memory os explained": ["-L14WZbcWX4", "Virtual Memory in Operating System Explained 🔥 | Complete Concept + Examples | handwritten Notes", "Code Hacker"],
    "websockets vs polling": ["WS352jTTkPU", "WebSockets vs Polling vs Server Sent Events", "Piyush Garg"],
    "what happens when you type a url http": ["AlkDbnbv7dk", "What happens when you type a URL into your browser?", "ByteByteGo"],
    "what happens when you type a url in browser": ["AlkDbnbv7dk", "What happens when you type a URL into your browser?", "ByteByteGo"],
    "what is retrieval augmented generation explained": ["T-D1OfcDW1M", "What is Retrieval-Augmented Generation (RAG)?", "IBM Technology"],
    "what is a database explained simply": ["hRulZhTtUTg", "What is a Database?", "IBM Technology"],
    "database tables rows and columns explained": ["VRylLmD7LBA", "3. SQL Tables, Rows and Columns Explained for Beginners | SQL Tutorial", "ProgramGuru"],
    "primary key vs foreign key dbms": ["Tp37HXfekNo", "Lec-10: What is Primary Key in DBMS | Primary Key with Examples in Hindi", "Gate Smashers"],
    "what is sql explained for beginners": ["UOJZTqA5Loc", "What is SQL? Future Career Scope & Resources", "Apna College"],
    "client server model explained": ["a5CgfS0Y4Uc", "Client Server Architecture in detail", "Learn Then Code"],
    "what is a process in operating system": ["B0Uq9Mjz4gM", "What is Process in Operating System in Hindi | Operating System - 08", "CS Engineering Gyan"],
    "threads in operating system explained": ["ITc09gOrqZk", "L-1.11: Process Vs Threads in Operating System", "Gate Smashers"],
    "cpu scheduling introduction operating system": ["EWkQl0n0w5M", "Introduction to CPU Scheduling", "Neso Academy"],
    "http protocol explained for beginners": ["qgZiUvV41TI", "HTTP crash course | http Methods | http headers", "Chai aur Code"],
    "dns explained simply": ["mpQZVYPuDGU", "How a DNS Server (Domain Name System) works.", "PowerCert Animated Videos"],
    "what is an operating system introduction gate smashers": ["bkSWJJZNgf8", "Lec-0:Operating System Syllabus Discussion for all College/University & Competitive exams (GATE,NET)", "Gate Smashers"],
    "virtual memory in os gate smashers": ["o2_iCzS9-ZQ", "L-5.19: Virtual Memory | Page fault | Significance of virtual memory | Operating System", "Gate Smashers"]
  };

  var SITES = {
    "sqlbolt interactive sql tutorial": "https://sqlbolt.com/",
    "mdn http overview": "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview",
    "geeksforgeeks dbms tutorial": "https://www.geeksforgeeks.org/dbms/",
    "geeksforgeeks operating system tutorial": "https://www.geeksforgeeks.org/operating-systems/"
  };
  function yt(q) {
    var v = V[q];
    return v ? "https://www.youtube.com/watch?v=" + v[0]
             : "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  }
  function P(title, slug, diff) { return { title: title, url: LC + slug + "/", diff: diff }; }
  function C(label, q) {
    if (SITES[q]) return { label: label, url: SITES[q], vtitle: "", vauthor: "" };
    var v = V[q] || [];
    return { label: label, url: yt(q), vtitle: v[1] || "", vauthor: v[2] || "" };
  }

  function addDaysISO(iso, n) {
    var d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + n);
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }
  function diffDays(a, b) {
    return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
  }

  /* ============================================================
     WEEKS
     mode: "exam"       -> 7 light days (1 problem + 1 concept + 1 AI task)
           "transition" -> day 1 light (last exam), 5 full days, 1 revision
           "normal"     -> 6 full days (2 problems each) + 1 revision
           "sprint"     -> explicit days
     ============================================================ */
  var WEEKS = [

    /* ---------------- EXAM WINDOW ---------------- */
    {
      n: 1, mode: "exam", theme: "Exam window · arrays without pressure",
      conceptsInDsa: true,
      csExtra: [C("What is a database?", "what is a database explained simply"), C("Tables, rows, columns", "database tables rows and columns explained"), C("Primary key vs foreign key", "primary key vs foreign key dbms"), C("What is SQL?", "what is sql explained for beginners"), C("SELECT and WHERE", "sql select where tutorial"), C("What is an operating system?", "what is an operating system introduction gate smashers"), C("Client and server", "client server model explained")],
      pattern: "Arrays — the language of every interview",
      pre: { url: "https://www.youtube.com/watch?v=n60Dn0UsbEk", vtitle: "Introduction to Arrays and ArrayList in Java", vauthor: "Kunal Kushwaha" },
      goal: "Stay warm, not productive. 40 min a day, nothing more.",
      note: "Endsems are on. One easy problem, one short concept, one tiny AI task. If a paper is tomorrow, skip everything except the last line.",
      cs: "Java collections & complexity",
      csTopics: [
        C("Big-O in 10 minutes", "big o notation explained in 10 minutes"),
        C("How arrays sit in memory", "how arrays work in memory java"),
        C("ArrayList internals", "java arraylist internal implementation"),
        C("Two pointers technique", "two pointers technique explained coding interview"),
        C("Sliding window technique", "sliding window technique explained"),
        C("HashMap basics", "java hashmap explained for beginners"),
        C("HashMap vs HashSet", "hashmap vs hashset in java difference")
      ],
      problems: [
        P("Two Sum", "two-sum", "E"),
        P("Palindrome Number", "palindrome-number", "E"),
        P("Roman to Integer", "roman-to-integer", "E"),
        P("Longest Common Prefix", "longest-common-prefix", "E"),
        P("Valid Parentheses", "valid-parentheses", "E"),
        P("Merge Two Sorted Lists", "merge-two-sorted-lists", "E"),
        P("Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "E")
      ],
      ai: [
        "Check python3 --version. Write hello.py and run it.",
        "Python: list, dict, tuple — 20 lines using all three.",
        "Comprehensions and f-strings — rewrite yesterday's loop.",
        "Functions: default args, *args, **kwargs.",
        "venv + pip install requests python-dotenv.",
        "Read a JSON file with json.load, print three fields.",
        "requests: GET a public API, print status + one field."
      ]
    },
    {
      n: 2, mode: "exam", theme: "Exam window · strings and recursion intuition",
      conceptsInDsa: true,
      csExtra: [C("What is a process?", "what is a process in operating system"), C("Process vs thread", "process vs thread operating system"), C("CPU scheduling: intro", "cpu scheduling introduction operating system"), C("Virtual memory", "virtual memory in os gate smashers"), C("What is HTTP?", "http protocol explained for beginners"), C("What is DNS?", "dns explained simply"), C("TCP vs UDP", "tcp vs udp difference")],
      pattern: "Strings and two pointers",
      pre: { url: "https://www.youtube.com/watch?v=QzZ7nmouLTI", vtitle: "Two Pointers in 7 minutes | LeetCode Pattern", vauthor: "AlgoMasterIO" },
      goal: "Still 40 min. The streak is the deliverable.",
      note: "Same deal. Exams first. If you do nothing else, do the easy problem so week 4 doesn't feel like starting over.",
      cs: "Strings, recursion & complexity",
      csTopics: [
        C("String immutability", "java string immutability explained"),
        C("StringBuilder vs String", "stringbuilder vs string java"),
        C("Recursion & the call stack", "recursion call stack explained beginners"),
        C("Stack vs queue", "stack vs queue data structure explained"),
        C("Linked lists", "linked list data structure explained beginners"),
        C("Binary search intuition", "binary search intuition explained"),
        C("Trees: first principles", "binary tree basics terminology")
      ],
      problems: [
        P("Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "E"),
        P("Majority Element", "majority-element", "E"),
        P("Move Zeroes", "move-zeroes", "E"),
        P("Plus One", "plus-one", "E"),
        P("Sqrt(x)", "sqrtx", "E"),
        P("Climbing Stairs", "climbing-stairs", "E"),
        P("Single Number", "single-number", "E")
      ],
      ai: [
        "Put your key in .env, load it with python-dotenv.",
        "Get a free LLM key (Google AI Studio or OpenRouter).",
        "First LLM call from Python — print reply + token usage.",
        "Tokens and cost: estimate 1000 calls.",
        "System vs user prompt: one question, three system prompts.",
        "Temperature: same prompt at 0 and at 1.",
        "Ask for JSON, parse it, handle failure with try/except."
      ]
    },
    {
      n: 3, mode: "exam", theme: "Exam window · bits and SQL basics",
      pattern: "Bits, arrays and clean traversal",
      pre: { url: "https://www.youtube.com/watch?v=qQd-ViW7bfk", vtitle: "L1. Introduction to Bit Manipulation | 1's 2's Compliment | Bit Operators", vauthor: "take U forward" },
      goal: "Last exam week. Then the real thing starts.",
      note: "Last exam is Dec 7. Keep it at 40 min — do not start the full plan early, you'll burn the exam.",
      cs: "SQL basics & OS intuition",
      csTopics: [
        C("SQL: SELECT & WHERE", "sql select where tutorial"),
        C("SQL joins", "sql joins explained beginners"),
        C("DBMS normalization", "dbms normalization 1nf 2nf 3nf"),
        C("Database indexes", "database index explained"),
        C("Process vs thread", "process vs thread operating system"),
        C("What happens when you type a URL", "what happens when you type a url http"),
        C("OOP: the four pillars", "oop four pillars explained java")
      ],
      problems: [
        P("Missing Number", "missing-number", "E"),
        P("Contains Duplicate", "contains-duplicate", "E"),
        P("Valid Anagram", "valid-anagram", "E"),
        P("Intersection of Two Arrays", "intersection-of-two-arrays", "E"),
        P("Reverse String", "reverse-string", "E"),
        P("Fizz Buzz", "fizz-buzz", "E"),
        P("Number of 1 Bits", "number-of-1-bits", "E")
      ],
      ai: [
        "Pydantic: validate the JSON into a model.",
        "Tool calling: write one tool schema (name, params).",
        "Embeddings: embed 3 sentences, cosine similarity in numpy.",
        "Chunking: split a text into 300-word chunks with overlap.",
        "Chroma: add 5 chunks, query, print top 2.",
        "RAG in 30 lines: retrieve 3 chunks, then answer.",
        "FastAPI: /health and /chat on localhost."
      ]
    },

    /* ---------------- FULL PLAN ---------------- */
    {
      n: 4, mode: "transition", theme: "Arrays II · the real plan starts",
      pattern: "Arrays II — the patterns that repeat",
      pre: { url: "https://www.youtube.com/watch?v=mV3wrLBbuuE", vtitle: "Time and Space Complexity COMPLETE Tutorial - What is Big O?", vauthor: "Kunal Kushwaha" },
      goal: "Dec 7 is your last paper. Dec 8 you start for real.",
      note: "Monday is your last exam — do only the light task. From Tuesday the full 2h 45m block begins. This is the week the rest of the plan depends on.",
      cs: "DBMS core",
      csTopics: [
        C("ER model: entities, attributes, relations", "er model dbms entities relationships"),
        C("Keys: primary, foreign, candidate", "types of keys in dbms"),
        C("Normalization 1NF to 3NF", "dbms normalization 1nf 2nf 3nf"),
        C("BCNF and when to denormalize", "bcnf normalization dbms"),
        C("Indexes and B+ trees", "dbms indexing b+ tree"),
        C("Transactions and ACID", "acid properties dbms transactions")
      ],
      problems: [
        P("Valid Palindrome", "valid-palindrome", "E"),
        P("Maximum Subarray", "maximum-subarray", "M"),
        P("Rotate Array", "rotate-array", "M"),
        P("Merge Sorted Array", "merge-sorted-array", "E"),
        P("Product of Array Except Self", "product-of-array-except-self", "M"),
        P("Find All Numbers Disappeared in an Array", "find-all-numbers-disappeared-in-an-array", "E"),
        P("Two Sum II — Input Array Is Sorted", "two-sum-ii-input-array-is-sorted", "M"),
        P("Container With Most Water", "container-with-most-water", "M"),
        P("Sort Colors", "sort-colors", "M"),
        P("3Sum", "3sum", "M"),
        P("Group Anagrams", "group-anagrams", "M")
      ],
      stretch: [P("Subarray Sum Equals K", "subarray-sum-equals-k", "M"), P("Majority Element II", "majority-element-ii", "M")],
      ai: [
        "Python for AI: project layout, type hints, one async function.",
        "Install the SDK you picked (openai / anthropic / google-genai).",
        "Move your test calls into a proper script with a main()."
      ],
      career: [
        "Create the project repo + README skeleton",
        "Book a mock on Pramp for week 6"
      ],
      project: "SPEC — 1 page: problem, 5 endpoints, the agent loop you'll build, and how you'll evaluate it."
    },
    {
      n: 5, mode: "normal", theme: "Hashing · prefix sums · sliding window",
      pattern: "Hashing, prefix sums, sliding window",
      pre: { url: "https://www.youtube.com/watch?v=9kdHxplyl5I", vtitle: "L1. Introduction to Sliding Window and 2 Pointers | Templates | Patterns", vauthor: "take U forward" },
      goal: "Prefix sums and hash maps stop being tricks and become habits.",
      cs: "DBMS: transactions & queries",
      csTopics: [
        C("Isolation levels and anomalies", "transaction isolation levels dbms"),
        C("Joins: inner, left, right, self", "sql joins inner left self join"),
        C("GROUP BY, HAVING, aggregates", "sql group by having aggregate functions"),
        C("Subqueries and CTEs", "sql subqueries and cte"),
        C("SQL vs NoSQL", "sql vs nosql when to use"),
        C("Query optimization basics", "sql query optimization basics explain")
      ],
      problems: [
        P("Longest Consecutive Sequence", "longest-consecutive-sequence", "M"),
        P("Subarray Sum Divisible by K", "subarray-sum-divisible-by-k", "M"),
        P("First Missing Positive", "first-missing-positive", "H"),
        P("Happy Number", "happy-number", "E"),
        P("Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "M"),
        P("Longest Repeating Character Replacement", "longest-repeating-character-replacement", "M"),
        P("Minimum Size Subarray Sum", "minimum-size-subarray-sum", "M"),
        P("Permutation in String", "permutation-in-string", "M"),
        P("Find All Anagrams in a String", "find-all-anagrams-in-a-string", "M"),
        P("Fruit Into Baskets", "fruit-into-baskets", "M"),
        P("Valid Palindrome II", "valid-palindrome-ii", "E"),
        P("Reverse Words in a String", "reverse-words-in-a-string", "M")
      ],
      stretch: [P("Minimum Window Substring", "minimum-window-substring", "H"), P("Count Number of Nice Subarrays", "count-number-of-nice-subarrays", "M")],
      ai: [
        "LLM API properly: streaming responses to the terminal.",
        "Add retries + timeouts + a token/cost counter.",
        "Write a small wrapper you'll reuse all year."
      ],
      career: [
        "Resume v1 — 1 page, plain text, no design",
        "Register on TCS NextStep + Infosys + Wipro portals"
      ],
      project: "SKELETON — repo runs, one endpoint returns a model reply, .env wired, nothing leaks."
    },
    {
      n: 6, mode: "normal", theme: "Strings, matrices, and clean traversal",
      pattern: "Strings and matrix traversal",
      pre: { url: "https://www.youtube.com/watch?v=18Zt5I4S45o", vtitle: "2D Arrays | Java Complete Placement Course | Lecture 11", vauthor: "Apna College" },
      goal: "Matrix problems stop scaring you.",
      cs: "SQL practice",
      csTopics: [
        C("LeetCode SQL 50 — easy set", "leetcode sql 50 easy solutions"),
        C("SQL 50 — joins set", "leetcode sql 50 joins solutions"),
        C("SQL 50 — aggregation set", "leetcode sql 50 aggregation solutions"),
        C("ORDER BY, LIMIT, date functions", "sql order by limit date functions"),
        C("Window functions: ROW_NUMBER, RANK", "sql window functions row_number rank"),
        C("SQL 50 — window function set", "leetcode sql 50 window functions solutions")
      ],
      problems: [
        P("Integer to Roman", "integer-to-roman", "M"),
        P("Add Binary", "add-binary", "E"),
        P("String Compression", "string-compression", "M"),
        P("Multiply Strings", "multiply-strings", "M"),
        P("Count and Say", "count-and-say", "M"),
        P("Find the Index of the First Occurrence in a String", "find-the-index-of-the-first-occurrence-in-a-string", "E"),
        P("Longest Palindromic Substring", "longest-palindromic-substring", "M"),
        P("Set Matrix Zeroes", "set-matrix-zeroes", "M"),
        P("Spiral Matrix", "spiral-matrix", "M"),
        P("Rotate Image", "rotate-image", "M"),
        P("Search a 2D Matrix", "search-a-2d-matrix", "M"),
        P("Search a 2D Matrix II", "search-a-2d-matrix-ii", "M")
      ],
      stretch: [P("Spiral Matrix II", "spiral-matrix-ii", "M"), P("Diagonal Traverse", "diagonal-traverse", "M")],
      ai: [
        "Structured output: force JSON with a Pydantic schema.",
        "Tool schemas: define 3 tools your agent will own.",
        "Make the model choose a tool and validate the call."
      ],
      career: [
        "LinkedIn: headline, about, skills, project pinned",
        "First Pramp mock this week (45 min, it will be bad)"
      ],
      project: "FIRST LLM ENDPOINT — POST /ask returns a model answer with token usage in the response."
    },
    {
      n: 7, mode: "normal", theme: "Sorting & binary search",
      pattern: "Sorting and binary search",
      pre: { url: "https://www.youtube.com/watch?v=f6UU7V3szVw", vtitle: "Binary Search Algorithm - Theory + Code", vauthor: "Kunal Kushwaha" },
      goal: "You can write binary search without thinking about off-by-one.",
      cs: "SQL: plans and indexes",
      csTopics: [
        C("SQL 50 — subquery set", "leetcode sql 50 subqueries solutions"),
        C("SQL 50 — finish the list", "leetcode sql 50 all solutions"),
        C("EXPLAIN and reading a query plan", "mysql explain query plan"),
        C("Composite and covering indexes", "composite index covering index sql"),
        C("The N+1 query problem", "n+1 query problem orm"),
        C("Redo your 5 worst queries", "sql interview questions practice")
      ],
      problems: [
        P("Sort an Array", "sort-an-array", "M"),
        P("Kth Largest Element in an Array", "kth-largest-element-in-an-array", "M"),
        P("Merge Intervals", "merge-intervals", "M"),
        P("Insert Interval", "insert-interval", "M"),
        P("Binary Search", "binary-search", "E"),
        P("Search Insert Position", "search-insert-position", "E"),
        P("First Bad Version", "first-bad-version", "E"),
        P("Squares of a Sorted Array", "squares-of-a-sorted-array", "E"),
        P("Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "M"),
        P("Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "M"),
        P("Find First and Last Position of Element in Sorted Array", "find-first-and-last-position-of-element-in-sorted-array", "M"),
        P("Single Element in a Sorted Array", "single-element-in-a-sorted-array", "M")
      ],
      stretch: [P("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "H"), P("Successful Pairs of Spells and Potions", "successful-pairs-of-spells-and-potions", "M")],
      ai: [
        "Embeddings: build a small pipeline, not a one-liner.",
        "Store vectors with metadata in one function.",
        "Write the cosine similarity yourself once, then use the library."
      ],
      career: [
        "CHECKPOINT 1 — 3 problems in 90 min, no editorials",
        "Fix the two weakest topics this week"
      ],
      project: "INGESTION — point it at 3 documents, chunk them, store embeddings, prove retrieval returns the right chunk."
    },
    {
      n: 8, mode: "normal", theme: "Binary search on answer",
      pattern: "Binary search on the answer space",
      pre: { url: "https://www.youtube.com/watch?v=qyfekrNni90", vtitle: "BS-12. Koko Eating Bananas", vauthor: "take U forward" },
      goal: "You can spot 'binary search on the answer' in under 2 minutes.",
      cs: "Operating Systems I",
      csTopics: [
        C("Process vs thread", "process vs thread operating system"),
        C("Process states and context switching", "process states context switching os"),
        C("CPU scheduling: FCFS, SJF, RR", "cpu scheduling algorithms fcfs sjf round robin"),
        C("Mutex vs semaphore", "mutex vs semaphore operating system"),
        C("Deadlock — four conditions", "deadlock four necessary conditions os"),
        C("Banker's algorithm", "bankers algorithm deadlock avoidance")
      ],
      problems: [
        P("Koko Eating Bananas", "koko-eating-bananas", "M"),
        P("Capacity to Ship Packages Within D Days", "capacity-to-ship-packages-within-d-days", "M"),
        P("Split Array Largest Sum", "split-array-largest-sum", "H"),
        P("Find the Duplicate Number", "find-the-duplicate-number", "M"),
        P("Valid Perfect Square", "valid-perfect-square", "E"),
        P("Pow(x, n)", "powx-n", "M"),
        P("Divide Two Integers", "divide-two-integers", "M"),
        P("Find Peak Element", "find-peak-element", "M"),
        P("Peak Index in a Mountain Array", "peak-index-in-a-mountain-array", "M"),
        P("Guess Number Higher or Lower", "guess-number-higher-or-lower", "E"),
        P("Intersection of Two Arrays II", "intersection-of-two-arrays-ii", "E"),
        P("Two Sum Less Than K", "two-sum-less-than-k", "E")
      ],
      stretch: [P("Kth Smallest Element in a Sorted Matrix", "kth-smallest-element-in-a-sorted-matrix", "M"), P("Minimum Number of Days to Make m Bouquets", "minimum-number-of-days-to-make-m-bouquets", "M")],
      ai: [
        "Vector DB: Chroma or pgvector, insert + query with filters.",
        "Metadata filtering: only search the docs that matter.",
        "Measure retrieval hit-rate on 10 questions."
      ],
      career: [
        "Resume v2 — add the AI project with one number",
        "Send 5 applications"
      ],
      project: "RETRIEVAL — top-k with metadata filters, and a hit-rate number you can quote."
    },
    {
      n: 9, mode: "normal", theme: "Recursion & backtracking",
      pattern: "Recursion and backtracking",
      pre: { url: "https://www.youtube.com/watch?v=kHi1DUhp9kM", vtitle: "Recursion Introduction and Identification", vauthor: "Aditya Verma" },
      goal: "You can write the backtracking template from memory.",
      cs: "Operating Systems II",
      csTopics: [
        C("Paging vs segmentation", "paging vs segmentation os"),
        C("Virtual memory", "virtual memory os explained"),
        C("Page replacement: FIFO, LRU", "page replacement algorithms lru fifo"),
        C("Thrashing", "thrashing operating system"),
        C("File systems basics", "file system basics os"),
        C("System calls, fork and exec", "system calls fork exec os")
      ],
      problems: [
        P("Subsets", "subsets", "M"),
        P("Permutations", "permutations", "M"),
        P("Combination Sum", "combination-sum", "M"),
        P("Generate Parentheses", "generate-parentheses", "M"),
        P("Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "M"),
        P("Palindrome Partitioning", "palindrome-partitioning", "M"),
        P("Subsets II", "subsets-ii", "M"),
        P("Combination Sum II", "combination-sum-ii", "M"),
        P("Combinations", "combinations", "M"),
        P("Word Search", "word-search", "M"),
        P("Restore IP Addresses", "restore-ip-addresses", "M"),
        P("N-Queens", "n-queens", "H")
      ],
      stretch: [P("Word Search II", "word-search-ii", "H"), P("Sudoku Solver", "sudoku-solver", "H")],
      ai: [
        "Retrieval quality: add reranking and citations.",
        "Hybrid search: keyword + vector, then merge.",
        "Show before/after scores in your README."
      ],
      career: [
        "5 referral DMs to CU alumni (one line + repo)",
        "Aptitude: 2 sessions on IndiaBix"
      ],
      project: "RETRIEVAL QUALITY — citations in the answer, and a measured improvement over week 8."
    },
    {
      n: 10, mode: "normal", theme: "Linked lists",
      pattern: "Linked lists and pointers",
      pre: { url: "https://www.youtube.com/watch?v=58YbpRDc4yw", vtitle: "Linked List Tutorial - Singly + Doubly + Circular (Theory + Code + Implementation)", vauthor: "Kunal Kushwaha" },
      goal: "Pointers stop being scary. Floyd's algorithm is yours.",
      cs: "Computer Networks I",
      csTopics: [
        C("OSI vs TCP/IP model", "osi model vs tcp ip model"),
        C("TCP vs UDP", "tcp vs udp difference"),
        C("TCP three-way handshake", "tcp three way handshake"),
        C("HTTP vs HTTPS and TLS", "http vs https tls handshake"),
        C("DNS resolution step by step", "how dns works step by step"),
        C("What happens when you type a URL", "what happens when you type a url in browser")
      ],
      problems: [
        P("Reverse Linked List", "reverse-linked-list", "E"),
        P("Linked List Cycle", "linked-list-cycle", "E"),
        P("Middle of the Linked List", "middle-of-the-linked-list", "E"),
        P("Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "M"),
        P("Linked List Cycle II", "linked-list-cycle-ii", "M"),
        P("Add Two Numbers", "add-two-numbers", "M"),
        P("Reorder List", "reorder-list", "M"),
        P("Palindrome Linked List", "palindrome-linked-list", "E"),
        P("Intersection of Two Linked Lists", "intersection-of-two-linked-lists", "E"),
        P("Odd Even Linked List", "odd-even-linked-list", "M"),
        P("Copy List with Random Pointer", "copy-list-with-random-pointer", "M"),
        P("LRU Cache", "lru-cache", "M")
      ],
      stretch: [P("Merge k Sorted Lists", "merge-k-sorted-lists", "H"), P("Remove Duplicates from Sorted List", "remove-duplicates-from-sorted-list", "E")],
      ai: [
        "Tool calling for real: 2 tools that hit live data.",
        "Build the ReAct loop by hand — think, act, observe, stop.",
        "Add a hard iteration cap so it can't loop forever."
      ],
      career: [
        "Resume v3 — every bullet gets a number",
        "10 applications this week"
      ],
      project: "TOOLS + LOOP — your agent autonomously picks between 2-3 tools and stops cleanly."
    },
    {
      n: 11, mode: "normal", theme: "Stacks & queues",
      pattern: "Stacks, queues and the monotonic stack",
      pre: { url: "https://www.youtube.com/watch?v=P1bAPZg5uaE", vtitle: "1 Stack Introduction And Identification", vauthor: "Aditya Verma" },
      goal: "Monotonic stack becomes an obvious tool, not a trick.",
      cs: "Computer Networks II",
      csTopics: [
        C("HTTP methods and status codes", "http methods status codes explained"),
        C("Cookies vs sessions vs JWT", "cookies vs sessions vs jwt"),
        C("REST API design principles", "rest api design best practices"),
        C("CORS — what it actually blocks", "cors explained web"),
        C("Load balancing", "load balancer explained"),
        C("CDN and cache-control headers", "cdn and cache control headers")
      ],
      problems: [
        P("Min Stack", "min-stack", "M"),
        P("Implement Queue using Stacks", "implement-queue-using-stacks", "E"),
        P("Implement Stack using Queues", "implement-stack-using-queues", "E"),
        P("Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "M"),
        P("Daily Temperatures", "daily-temperatures", "M"),
        P("Next Greater Element I", "next-greater-element-i", "E"),
        P("Next Greater Element II", "next-greater-element-ii", "M"),
        P("Asteroid Collision", "asteroid-collision", "M"),
        P("Car Fleet", "car-fleet", "M"),
        P("Remove K Digits", "remove-k-digits", "M"),
        P("Decode String", "decode-string", "M"),
        P("Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "H")
      ],
      stretch: [P("Sum of Subarray Minimums", "sum-of-subarray-minimums", "M"), P("Trapping Rain Water", "trapping-rain-water", "H")],
      ai: [
        "LangGraph: rebuild the same agent as a graph.",
        "Add a conditional edge and a checkpoint/memory.",
        "Compare: what did the framework hide from you?"
      ],
      career: [
        "CHECKPOINT 2 — 3 problems + 10 CS questions out loud",
        "10 applications"
      ],
      project: "GRAPH AGENT — state, nodes, conditional routing, and memory across turns."
    },
    {
      n: 12, mode: "normal", theme: "Trees I",
      pattern: "Trees and recursion on trees",
      pre: { url: "https://www.youtube.com/watch?v=_ANrF3FJm7I", vtitle: "L1. Introduction to Trees | Types of Trees", vauthor: "take U forward" },
      goal: "Recursion on trees feels natural.",
      cs: "OOP + Java",
      csTopics: [
        C("The four pillars, with real examples", "oop four pillars explained java"),
        C("Abstract class vs interface", "abstract class vs interface java"),
        C("Overloading vs overriding", "method overloading vs overriding java"),
        C("SOLID principles", "solid principles explained java"),
        C("Composition over inheritance", "composition over inheritance explained"),
        C("UML class diagram basics", "uml class diagram basics")
      ],
      problems: [
        P("Binary Tree Inorder Traversal", "binary-tree-inorder-traversal", "E"),
        P("Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "E"),
        P("Same Tree", "same-tree", "E"),
        P("Invert Binary Tree", "invert-binary-tree", "E"),
        P("Balanced Binary Tree", "balanced-binary-tree", "E"),
        P("Diameter of Binary Tree", "diameter-of-binary-tree", "E"),
        P("Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "M"),
        P("Binary Tree Right Side View", "binary-tree-right-side-view", "M"),
        P("Binary Tree Zigzag Level Order Traversal", "binary-tree-zigzag-level-order-traversal", "M"),
        P("Minimum Depth of Binary Tree", "minimum-depth-of-binary-tree", "E"),
        P("Path Sum", "path-sum", "E"),
        P("Symmetric Tree", "symmetric-tree", "E")
      ],
      stretch: [P("Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "H"), P("Binary Tree Postorder Traversal", "binary-tree-postorder-traversal", "E")],
      ai: [
        "Memory + human-in-the-loop: pause before a risky action.",
        "Add a confirmation step before any tool that writes.",
        "Deploy P1 — live URL on Render or Railway."
      ],
      career: [
        "Aptitude: 2 sessions",
        "10 applications"
      ],
      project: "DEPLOY P1 — live agent URL, warm it up, put the link everywhere."
    },
    {
      n: 13, mode: "normal", theme: "Trees II & BST",
      pattern: "BSTs and tree invariants",
      pre: { url: "https://www.youtube.com/watch?v=qAeitQWjNNg", vtitle: "Binary Search Trees | BST in One Video | Java Placement Course | Data Structures & Algorithms", vauthor: "Apna College" },
      goal: "BST invariants and LCA are automatic.",
      cs: "Java internals",
      csTopics: [
        C("ArrayList internals", "java arraylist internal working"),
        C("HashMap internals", "java hashmap internal working interview"),
        C("String pool and immutability", "java string pool immutability"),
        C("equals() and hashCode() contract", "java equals hashcode contract"),
        C("Checked vs unchecked exceptions", "checked vs unchecked exceptions java"),
        C("Garbage collection basics", "java garbage collection explained")
      ],
      problems: [
        P("Validate Binary Search Tree", "validate-binary-search-tree", "M"),
        P("Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "M"),
        P("Lowest Common Ancestor of a BST", "lowest-common-ancestor-of-a-binary-search-tree", "E"),
        P("Lowest Common Ancestor of a Binary Tree", "lowest-common-ancestor-of-a-binary-tree", "M"),
        P("Construct Binary Tree from Preorder and Inorder", "construct-binary-tree-from-preorder-and-inorder-traversal", "M"),
        P("Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "H"),
        P("Sum Root to Leaf Numbers", "sum-root-to-leaf-numbers", "M"),
        P("Flatten Binary Tree to Linked List", "flatten-binary-tree-to-linked-list", "M"),
        P("Binary Search Tree Iterator", "binary-search-tree-iterator", "M"),
        P("Delete Node in a BST", "delete-node-in-a-bst", "M"),
        P("Insert into a Binary Search Tree", "insert-into-a-binary-search-tree", "M"),
        P("Convert Sorted Array to Binary Search Tree", "convert-sorted-array-to-binary-search-tree", "E")
      ],
      stretch: [P("Binary Tree Cameras", "binary-tree-cameras", "H"), P("Two Sum IV — Input is a BST", "two-sum-iv-input-is-a-bst", "E")],
      ai: [
        "FastAPI in production shape: async, streaming, background tasks.",
        "Return streaming responses from the agent to the client.",
        "Add request IDs and structured logs."
      ],
      career: [
        "Resume v4 — project section rewritten for AI roles",
        "10 applications"
      ],
      project: "PRODUCTION API — streaming responses, structured logs, sane error contract."
    },
    {
      n: 14, mode: "normal", theme: "Heaps & priority queues",
      pattern: "Heaps and priority queues",
      pre: { url: "https://www.youtube.com/watch?v=HqPJF2L5h9U", vtitle: "2.6.3 Heap - Heap Sort - Heapify - Priority Queues", vauthor: "Abdul Bari" },
      goal: "You reach for a heap without hesitating.",
      cs: "DBMS advanced",
      csTopics: [
        C("Sharding vs partitioning", "database sharding vs partitioning"),
        C("Replication and read replicas", "database replication master slave"),
        C("CAP theorem", "cap theorem explained"),
        C("ORM vs raw SQL", "orm vs raw sql performance"),
        C("Connection pooling", "database connection pooling explained"),
        C("Design a schema for a real feature", "database schema design interview")
      ],
      problems: [
        P("Top K Frequent Elements", "top-k-frequent-elements", "M"),
        P("Top K Frequent Words", "top-k-frequent-words", "M"),
        P("K Closest Points to Origin", "k-closest-points-to-origin", "M"),
        P("Last Stone Weight", "last-stone-weight", "E"),
        P("Sort Characters By Frequency", "sort-characters-by-frequency", "M"),
        P("Reorganize String", "reorganize-string", "M"),
        P("Task Scheduler", "task-scheduler", "M"),
        P("Find Median from Data Stream", "find-median-from-data-stream", "H"),
        P("Furthest Building You Can Reach", "furthest-building-you-can-reach", "M"),
        P("Single-Threaded CPU", "single-threaded-cpu", "M"),
        P("Kth Largest Element in a Stream", "kth-largest-element-in-a-stream", "E"),
        P("Seat Reservation Manager", "seat-reservation-manager", "M")
      ],
      stretch: [P("IPO", "ipo", "H"), P("Sliding Window Maximum", "sliding-window-maximum", "H")],
      ai: [
        "Evals: write 20 golden Q&A pairs.",
        "LLM-as-judge: score answers against the golden set.",
        "Wire the eval run to one command."
      ],
      career: [
        "CHECKPOINT 3 — 3 problems + 1 mock",
        "15 applications"
      ],
      project: "EVAL SUITE — a scoreboard with a number, run before every change from now on."
    },
    {
      n: 15, mode: "normal", theme: "Greedy",
      pattern: "Greedy and interval problems",
      pre: { url: "https://www.youtube.com/watch?v=DIX2p7vb9co", vtitle: "L1. Assign Cookies | Greedy Algorithm Playlist", vauthor: "take U forward" },
      goal: "You can argue why greedy is valid, not just code it.",
      cs: "Linux & systems in practice",
      csTopics: [
        C("Linux commands every dev needs", "essential linux commands developers"),
        C("File permissions and chmod", "linux file permissions chmod"),
        C("ps, top, lsof, kill", "linux ps top lsof kill commands"),
        C("Race conditions in real code", "race condition example java"),
        C("Java threads: basics", "java threads tutorial basics"),
        C("Memory leaks and profiling", "java memory leak profiling")
      ],
      problems: [
        P("Jump Game", "jump-game", "M"),
        P("Jump Game II", "jump-game-ii", "M"),
        P("Gas Station", "gas-station", "M"),
        P("Partition Labels", "partition-labels", "M"),
        P("Non-overlapping Intervals", "non-overlapping-intervals", "M"),
        P("Minimum Number of Arrows to Burst Balloons", "minimum-number-of-arrows-to-burst-balloons", "M"),
        P("Queue Reconstruction by Height", "queue-reconstruction-by-height", "M"),
        P("Candy", "candy", "H"),
        P("Best Time to Buy and Sell Stock II", "best-time-to-buy-and-sell-stock-ii", "M"),
        P("Maximum Product Subarray", "maximum-product-subarray", "M"),
        P("Can Place Flowers", "can-place-flowers", "E"),
        P("Lemonade Change", "lemonade-change", "E")
      ],
      stretch: [P("Assign Cookies", "assign-cookies", "E"), P("Two City Scheduling", "two-city-scheduling", "M")],
      ai: [
        "Guardrails: block prompt injection with 3 test attacks.",
        "PII redaction before anything hits the model.",
        "A cost cap per request, configured not hardcoded."
      ],
      career: [
        "15 applications",
        "Aptitude: 2 sessions"
      ],
      project: "GUARDRAILS — an attack report: what you tried, what got through, what you fixed."
    },
    {
      n: 16, mode: "normal", theme: "Graphs I",
      pattern: "Graphs: BFS, DFS, grids",
      pre: { url: "https://www.youtube.com/watch?v=M3_pLsDdeuU", vtitle: "G-1. Introduction to Graph | Types | Different Conventions Used", vauthor: "take U forward" },
      goal: "BFS/DFS on a grid or a graph is reflex.",
      cs: "Backend networking",
      csTopics: [
        C("REST vs GraphQL", "rest vs graphql"),
        C("WebSockets vs polling", "websockets vs polling"),
        C("Idempotency and safe retries", "idempotency in rest apis"),
        C("Rate limiting algorithms", "rate limiting algorithms"),
        C("Reverse proxy vs forward proxy", "reverse proxy vs forward proxy"),
        C("TLS handshake in detail", "tls handshake explained")
      ],
      problems: [
        P("Number of Islands", "number-of-islands", "M"),
        P("Max Area of Island", "max-area-of-island", "M"),
        P("Clone Graph", "clone-graph", "M"),
        P("Rotting Oranges", "rotting-oranges", "M"),
        P("Number of Provinces", "number-of-provinces", "M"),
        P("Surrounded Regions", "surrounded-regions", "M"),
        P("Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "M"),
        P("Course Schedule", "course-schedule", "M"),
        P("Course Schedule II", "course-schedule-ii", "M"),
        P("Find Eventual Safe States", "find-eventual-safe-states", "M"),
        P("Redundant Connection", "redundant-connection", "M"),
        P("Network Delay Time", "network-delay-time", "M")
      ],
      stretch: [P("Word Ladder", "word-ladder", "H"), P("Flood Fill", "flood-fill", "E")],
      ai: [
        "Docker: Dockerfile for the agent + one command to run.",
        "docker-compose: app + vector DB together.",
        "GitHub Actions: eval suite on every push."
      ],
      career: [
        "CHECKPOINT 4 — full mock loop: DSA + CS + project",
        "15 applications"
      ],
      project: "SHIP IT — Docker + CI, and a second project spec on one page."
    },
    {
      n: 17, mode: "normal", theme: "Graphs II",
      pattern: "Graphs: topo sort, union-find, shortest path",
      pre: { url: "https://www.youtube.com/watch?v=5lZ0iJMrUMk", vtitle: "G-21. Topological Sort Algorithm | DFS", vauthor: "take U forward" },
      goal: "Topological order, union-find and shortest path are familiar.",
      cs: "AI / LLM fundamentals",
      csTopics: [
        C("Tokens and context windows", "tokens context window llm explained"),
        C("Embeddings and cosine similarity", "embeddings cosine similarity explained"),
        C("RAG vs fine-tuning", "rag vs fine tuning when to use"),
        C("Tool calling and ReAct", "tool calling react agent explained"),
        C("Evals and LLM-as-judge", "how to evaluate llm applications evals"),
        C("Prompt injection", "prompt injection explained llm security")
      ],
      problems: [
        P("Is Graph Bipartite?", "is-graph-bipartite", "M"),
        P("Possible Bipartition", "possible-bipartition", "M"),
        P("Keys and Rooms", "keys-and-rooms", "M"),
        P("All Paths From Source to Target", "all-paths-from-source-to-target", "M"),
        P("01 Matrix", "01-matrix", "M"),
        P("Shortest Path in Binary Matrix", "shortest-path-in-binary-matrix", "M"),
        P("Reorder Routes to Make All Paths Lead to the City Zero", "reorder-routes-to-make-all-paths-lead-to-the-city-zero", "M"),
        P("Accounts Merge", "accounts-merge", "M"),
        P("Min Cost to Connect All Points", "min-cost-to-connect-all-points", "M"),
        P("Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "M"),
        P("Path with Maximum Probability", "path-with-maximum-probability", "M"),
        P("Critical Connections in a Network", "critical-connections-in-a-network", "H")
      ],
      stretch: [P("Word Ladder II", "word-ladder-ii", "H"), P("Island Perimeter", "island-perimeter", "E")],
      ai: [
        "P2: pick a narrow domain, write the spec in 30 minutes.",
        "P2: build the core loop and deploy the skeleton early.",
        "P2: define the 30-case eval set before the features."
      ],
      career: [
        "15 applications",
        "Write your 3 project stories: problem, design, tradeoff, what you'd change"
      ],
      project: "P2 START — narrow agent, deployed skeleton by Sunday."
    },
    {
      n: 18, mode: "normal", theme: "Dynamic programming I",
      pattern: "Dynamic programming I",
      pre: { url: "https://www.youtube.com/watch?v=nqowUJzG-iM", vtitle: "Dynamic Programming | Introduction", vauthor: "Aditya Verma" },
      goal: "You stop being afraid of DP and start recognising states.",
      cs: "Low-level design",
      csTopics: [
        C("SOLID in real code", "solid principles real code example"),
        C("Strategy pattern", "strategy design pattern java"),
        C("Factory pattern", "factory design pattern java"),
        C("Observer pattern", "observer design pattern java"),
        C("Singleton and Builder", "singleton builder pattern java"),
        C("Design a parking lot (LLD)", "parking lot low level design")
      ],
      problems: [
        P("Fibonacci Number", "fibonacci-number", "E"),
        P("Min Cost Climbing Stairs", "min-cost-climbing-stairs", "E"),
        P("House Robber", "house-robber", "M"),
        P("House Robber II", "house-robber-ii", "M"),
        P("Coin Change", "coin-change", "M"),
        P("Coin Change II", "coin-change-ii", "M"),
        P("Unique Paths", "unique-paths", "M"),
        P("Unique Paths II", "unique-paths-ii", "M"),
        P("Longest Increasing Subsequence", "longest-increasing-subsequence", "M"),
        P("Word Break", "word-break", "M"),
        P("Decode Ways", "decode-ways", "M"),
        P("Partition Equal Subset Sum", "partition-equal-subset-sum", "M")
      ],
      stretch: [P("Target Sum", "target-sum", "M"), P("Delete and Earn", "delete-and-earn", "M")],
      ai: [
        "P2: finish the features.",
        "P2: run the eval set, fix the 3 worst failures.",
        "Write the eval report with numbers."
      ],
      career: [
        "15 applications",
        "2 mocks this week"
      ],
      project: "P2 SHIPPED — deployed, README with the eval score, demo GIF."
    },
    {
      n: 19, mode: "normal", theme: "Dynamic programming II, tries & bits",
      pattern: "Dynamic programming II, tries, bits",
      pre: { url: "https://www.youtube.com/watch?v=tyB0ztf0DNY", vtitle: "DP 1. Introduction to Dynamic Programming | Memoization | Tabulation | Space Optimization Techniques", vauthor: "take U forward" },
      goal: "DP patterns (knapsack, LCS, grid) are all one family now.",
      cs: "High-level design basics",
      csTopics: [
        C("Scaling from 0 to millions", "system design basics scaling"),
        C("Caching strategies", "caching strategies system design"),
        C("Message queues", "message queue system design"),
        C("Consistent hashing", "consistent hashing explained"),
        C("Design a URL shortener", "design url shortener system design"),
        C("Design a rate limiter", "design rate limiter system design")
      ],
      problems: [
        P("Longest Common Subsequence", "longest-common-subsequence", "M"),
        P("Edit Distance", "edit-distance", "M"),
        P("Longest Palindromic Subsequence", "longest-palindromic-subsequence", "M"),
        P("Perfect Squares", "perfect-squares", "M"),
        P("Integer Break", "integer-break", "M"),
        P("Triangle", "triangle", "M"),
        P("Minimum Path Sum", "minimum-path-sum", "M"),
        P("Maximal Square", "maximal-square", "M"),
        P("Longest Increasing Path in a Matrix", "longest-increasing-path-in-a-matrix", "H"),
        P("Best Time to Buy and Sell Stock with Cooldown", "best-time-to-buy-and-sell-stock-with-cooldown", "M"),
        P("Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "M"),
        P("Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "M")
      ],
      stretch: [P("Regular Expression Matching", "regular-expression-matching", "H"), P("Concatenated Words", "concatenated-words", "H")],
      ai: [
        "Red-team your own agent: 15 adversarial prompts.",
        "Patch the 5 that worked; document each fix.",
        "Record a 2-minute demo of both projects."
      ],
      career: [
        "20 applications",
        "2 mocks"
      ],
      project: "PORTFOLIO — READMEs with numbers, demo video, GitHub profile updated."
    },
    {
      n: 20, mode: "normal", theme: "FAANG hard — arrays & strings",
      goal: "The follow-up questions, not the intros.",
      pattern: "FAANG hard — arrays & strings",
      cs: "DSA",
      learn: [
        { t: "Learn first — Longest valid parentheses", v: "D190eYUIpUU", a: "codestorywithMIK", h: "Watch this first, then the problems below." },
        null,
        { t: "Learn first — Sliding window maximum", v: "xCZgxYEXnnk", a: "codestorywithMIK", h: "Watch this first, then the problems below." },
        { t: "Learn first — Minimum window substring", v: "jSto0O4u0kk", a: "NeetCode", h: "Watch this first, then the problems below." },
        { t: "Learn first — Palindromic substrings", v: "thI-pdfWdNw", a: "NeetCode", h: "Watch this first, then the problems below." },
        { t: "Learn first — Product of array except self", v: "bNvGTIo2a8U", a: "NeetCode", h: "Watch this first, then the problems below." }
      ],
      problems: [
        P("Longest Valid Parentheses", "longest-valid-parentheses", "H"),
        P("Minimum Remove to Make Valid Parentheses", "minimum-remove-to-make-valid-parentheses", "M"),
        P("Longest Duplicate Substring", "longest-duplicate-substring", "H"),
        P("Basic Calculator II", "basic-calculator-ii", "M"),
        P("Palindromic Substrings", "palindromic-substrings", "M"),
        P("Remove Duplicate Letters", "remove-duplicate-letters", "H"),
        P("Trapping Rain Water II", "trapping-rain-water-ii", "H"),
        P("Course Schedule III", "course-schedule-iii", "H"),
        P("Maximum Swap", "maximum-swap", "M"),
        P("Word Break II", "word-break-ii", "H"),
        P("Recover Binary Search Tree", "recover-binary-search-tree", "M"),
        P("Populating Next Right Pointers in Each Node", "populating-next-right-pointers-in-each-node", "M")
      ]
    },
    {
      n: 21, mode: "normal", theme: "FAANG hard — graphs & design",
      goal: "Bitmask BFS, weighted union find, design classics.",
      pattern: "FAANG hard — graphs & design",
      cs: "DSA",
      learn: [
        { t: "Learn first — Open the lock", v: "vtxETRvR9JY", a: "Coding Decoded", h: "Watch this first, then the problems below." },
        { t: "Learn first — Evaluate division", v: "9XXry-MZQso", a: "The Coachable Dev", h: "Watch this first, then the problems below." },
        { t: "Learn first — Bus routes", v: "Wah6MwcLC7c", a: "codestorywithMIK", h: "Watch this first, then the problems below." },
        { t: "Learn first — Longest cycle in a graph", v: "8-NzFYbn1Jk", a: "NeetCode", h: "Watch this first, then the problems below." },
        { t: "Learn first — Maximum frequency stack", v: "Z6idIicFDOE", a: "NeetCode", h: "Watch this first, then the problems below." },
        { t: "Learn first — Sliding window median", v: "VtAPAwEXEyw", a: "NeetCodeIO", h: "Watch this first, then the problems below." }
      ],
      problems: [
        P("Open the Lock", "open-the-lock", "M"),
        P("Evaluate Division", "evaluate-division", "M"),
        P("Bus Routes", "bus-routes", "H"),
        P("Longest Cycle in a Graph", "longest-cycle-in-a-graph", "H"),
        P("Maximum Frequency Stack", "maximum-frequency-stack", "H"),
        P("Sliding Window Median", "sliding-window-median", "H"),
        P("Shortest Path Visiting All Nodes", "shortest-path-visiting-all-nodes", "H"),
        P("Basic Calculator", "basic-calculator", "H"),
        P("Integer to English Words", "integer-to-english-words", "H"),
        P("Minimum Cost for Tickets", "minimum-cost-for-tickets", "M"),
        P("Number of Matching Subsequences", "number-of-matching-subsequences", "M"),
        P("Convert Sorted List to Binary Search Tree", "convert-sorted-list-to-binary-search-tree", "M")
      ]
    },
    {
      n: 22, mode: "normal", theme: "FAANG hard — DP beyond the basics",
      goal: "Interval DP, state machines, knapsack variants.",
      pattern: "FAANG hard — DP beyond the basics",
      cs: "DSA",
      learn: [
        { t: "Learn first — Burst balloons", v: "VFskby7lUbw", a: "NeetCode", h: "Watch this first, then the problems below." },
        { t: "Learn first — Interleaving string", v: "3Rw3p9LrgvE", a: "NeetCode", h: "Watch this first, then the problems below." },
        { t: "Learn first — Stock III", v: "SFJGgz_VpxE", a: "Nikhil Lohia", h: "Watch this first, then the problems below." },
        { t: "Learn first — Word break II", v: "QgLKdluDo08", a: "NeetCodeIO", h: "Watch this first, then the problems below." },
        { t: "Learn first — Russian doll envelopes", v: "3fF1r5nhQX4", a: "Techdose", h: "Watch this first, then the problems below." },
        { t: "Learn first — Minimum cost for tickets", v: "oZ_xAIGCXw4", a: "CodeHelp - by Babbar", h: "Watch this first, then the problems below." }
      ],
      problems: [
        P("Burst Balloons", "burst-balloons", "H"),
        P("Interleaving String", "interleaving-string", "M"),
        P("Best Time to Buy and Sell Stock III", "best-time-to-buy-and-sell-stock-iii", "H"),
        P("All Nodes Distance K in Binary Tree", "all-nodes-distance-k-in-binary-tree", "M"),
        P("Russian Doll Envelopes", "russian-doll-envelopes", "H"),
        P("Cherry Pickup", "cherry-pickup", "H"),
        P("Best Time to Buy and Sell Stock IV", "best-time-to-buy-and-sell-stock-iv", "H"),
        P("Maximum Score from Performing Multiplication Operations", "maximum-score-from-performing-multiplication-operations", "H"),
        P("Minimum Insertion Steps to Make a String Palindrome", "minimum-insertion-steps-to-make-a-string-palindrome", "H"),
        P("Minimum Cost to Cut a Stick", "minimum-cost-to-cut-a-stick", "H"),
        P("Longest String Chain", "longest-string-chain", "M"),
        P("Distinct Subsequences II", "distinct-subsequences-ii", "H")
      ]
    },
    {
      n: 23, mode: "normal", theme: "FAANG mixed — timed, cold, out loud",
      goal: "The last week: everything, under time.",
      pattern: "FAANG mixed — timed, cold, out loud",
      cs: "DSA",
      learn: [
        { t: "Learn first — Integer to English words", v: "9FLpWWJ987w", a: "codestorywithMIK", h: "Watch this first, then the problems below." },
        { t: "Learn first — Basic calculator", v: "gW7hNe9bdII", a: "codestorywithMIK", h: "Watch this first, then the problems below." },
        { t: "Learn first — Shortest path visiting all nodes", v: "GwqxnD3Zmbk", a: "Nitesh Nanda", h: "Watch this first, then the problems below." },
        { t: "Learn first — Minimum knight moves", v: "YMIuMTGGGuU", a: "NeetCodeIO", h: "Watch this first, then the problems below." },
        { t: "Learn first — Longest arithmetic subsequence", v: "4UDbKVWGccY", a: "NeetCodeIO", h: "Watch this first, then the problems below." },
        { t: "Learn first — Delete and earn", v: "Y8jBvz0vQyY", a: "NeetCode", h: "Watch this first, then the problems below." }
      ],
      problems: [
        P("House Robber III", "house-robber-iii", "M"),
        P("Guess Number Higher or Lower II", "guess-number-higher-or-lower-ii", "H"),
        P("Minimum ASCII Delete Sum for Two Strings", "minimum-ascii-delete-sum-for-two-strings", "H"),
        P("Minimum Knight Moves", "minimum-knight-moves", "M"),
        P("Longest Arithmetic Subsequence", "longest-arithmetic-subsequence", "M"),
        P("Number of Longest Increasing Subsequence", "number-of-longest-increasing-subsequence", "M"),
        P("Combination Sum IV", "combination-sum-iv", "M"),
        P("Cherry Pickup II", "cherry-pickup-ii", "H"),
        P("Minimum Falling Path Sum II", "minimum-falling-path-sum-ii", "M"),
        P("Maximum Alternating Subsequence Sum", "maximum-alternating-subsequence-sum", "M"),
        P("Longest Arithmetic Subsequence of Given Difference", "longest-arithmetic-subsequence-of-given-difference", "M"),
        P("Number of Dice Rolls With Target Sum", "number-of-dice-rolls-with-target-sum", "M")
      ]
    }
  ];


  /* per-day learning material: video/article BEFORE the day's problems */
  var LEARN = {
    "3": [{ t: "Learn first — Missing number — XOR", v: "WnPLSRLSANE", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Contains duplicate — hashing", v: "3OamzN90kPg", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Valid anagram — frequency count", v: "rpZ3RRinBRM", a: "Engineering Digest", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Intersection of two arrays — sets", v: "rqPu9ZvLdi0", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Reverse string — two pointers", v: "MQmUVokbTrs", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Fizz buzz — loops & modulo", v: "XMUe3zFhM5c", a: "Bro Code", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Number of 1 bits — counting bits", v: "I475waWiTK4", a: "Pepcoding", h: "Watch or read this first, then that day's problems below." }],
    "4": [null, { t: "Learn first — Kadane's algorithm", v: "9IZYqostl2M", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Product of array except self", v: "9IZYqostl2M", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Two Sum II — sorted two pointers", v: "Qa3FoGAcVdk", a: "ShashCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Container with most water", v: "EbkMABpP52U", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — 3Sum — sort + two pointers", v: "MQmUVokbTrs", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, null],
    "5": [{ t: "Learn first — Longest consecutive sequence", v: "Q1BMW04YMWA", a: "Code with RSV", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — First missing positive", v: "McMC744R3SQ", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Longest substring without repeating", v: "U2ppEzBaMck", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Minimum size subarray sum", v: "xBZfV0OBmLY", a: "Engineering Digest", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Find all anagrams — fixed window", v: "egPDpu26q0M", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Valid palindrome II — skip one", v: "MQmUVokbTrs", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, null],
    "6": [{ t: "Learn first — Integer to Roman — mapping", v: "ohBNdSJyLh8", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — String compression — run length", v: "cAB15h6-sWA", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Count and Say — simulation", v: "JjIewPuyexA", a: "Telusko", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Longest palindromic substring", v: "5MS14_6rSa8", a: "RisingBrain", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Spiral matrix — boundaries", v: "BJnMZNwUk1M", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Search a 2D matrix — binary search", v: "JXU4Akft7yk", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, null],
    "7": [{ t: "Learn first — Merge sort — implement it", v: "cQDtOBTy7_Y", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Merge intervals — sorting first", v: "44H3cEC2fFM", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Binary search — the template", v: "TbbSJrY5GqQ", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Squares of sorted array", v: "fikdT0AI5z4", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Search in rotated sorted array", v: "U8XENwh8Oy8", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — First and last position", v: "jpuDyt-ruFc", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, null],
    "8": [{ t: "Learn first — Koko eating bananas", v: "U2SozAs9RzA", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Split array largest sum", v: "thUd_WJn6wk", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Pow(x,n) — fast power", v: "l0YC3876qxg", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Find peak element", v: "cXxmbemS6XM", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Peak index mountain array", v: "RjxD6UXGlhc", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Intersection of two arrays II", v: "1UdCmHJPpks", a: "Priyanshi Porwal", h: "Watch or read this first, then that day's problems below." }, null],
    "9": [{ t: "Learn first — Subsets — pick or skip", v: "REOH22Xwdkk", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Combination sum — reuse allowed", v: "GBKI9VSKdGg", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Letter combinations — choices", v: "vgnhZzw-kfU", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Subsets II / Combination Sum II — dedupe", v: "rSA3t6BDDwg", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Word search — grid backtrack", v: "pfiQ_PS1g8E", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — N-Queens — the classic", v: "BdSJnIdR-4s", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, null],
    "10": [{ t: "Learn first — Reverse + cycle", v: "t7YaoQOFXzk", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Middle — slow & fast", v: "A2_ldqM4QcY", a: "NeetCodeIO", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Add two numbers — carry", v: "XmRrGzR6udg", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Reorder list — split & merge", v: "S5bfdUTrKLM", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Intersection of two lists", v: "oAja8-Ulz6o", a: "Apna College", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Copy list with random pointer", v: "8ze7Zopdsaw", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, null],
    "11": [{ t: "Learn first — Min stack — design", v: "wHDm-N2m2XY", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Reverse polish — stack", v: "wKbDy5FWksE", a: "RisingBrain", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Daily temperatures — monotonic", v: "cTBiBSnjO3c", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Asteroid collision — stack", v: "LN7KjRszjk4", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Remove k digits — monotonic", v: "jmbuRzYPGrg", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Largest rectangle — the boss", v: "Bzat9vgD0fs", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, null],
    "12": [{ t: "Learn first — Inorder traversal — recursion + stack", v: "I_JuQ5ayPmc", a: "Gate Smashers", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Invert & same tree", v: "OnSn2XEQ4MY", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Diameter — height trick", v: "Rezetez59Nk", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Level order — BFS", v: "EoAsWbO7sqg", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Zigzag & right view", v: "BnOjzXe6J-Y", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Path sum — recursion", v: "2PmdWpXv3Y4", a: "CTO Bhaiya", h: "Watch or read this first, then that day's problems below." }, null],
    "13": [{ t: "Learn first — Validate BST — bounds", v: "f-sj7I5oXEI", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — LCA of a BST", v: "oX5D0uKOMck", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Build tree from traversals", v: "Z9zF0gLnuvM", a: "CS Engineering Gyan", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Flatten to linked list", v: "_x-YRLHP0t0", a: "RisingBrain", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — BST iterator — controlled recursion", v: "D2jMcmxU4bs", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Sorted array → balanced BST", v: "0s6sCjs_4g0", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, null],
    "14": [{ t: "Learn first — Top K frequent", v: "GLw4WbJdYLw", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — K closest points", v: "rI2EBUEMfTk", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Sort characters by frequency", v: "zPB7j1TMTDM", a: "ShashCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Task scheduler — greedy + heap", v: "QDsFBLGL9MM", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Merge k sorted lists", v: "zPB7j1TMTDM", a: "ShashCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Median from data stream", v: "6dDWBamCLyk", a: "CodeLucky", h: "Watch or read this first, then that day's problems below." }, null],
    "15": [{ t: "Learn first — Jump game — reachability", v: "tZAa_jJ3SwQ", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Gas station — greedy proof", v: "lJwbPZGo05A", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Non-overlapping intervals", v: "HDHQ8lAWakY", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Candy — two passes", v: "ZGxqqjljpUI", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Maximum product subarray", v: "hnswaLJvr6g", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Can place flowers", v: "ZGxqqjljpUI", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, null],
    "16": [{ t: "Learn first — Number of islands — DFS", v: "AME6baBpswY", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Rotting oranges — multi-BFS", v: "RmXo5SWkhCs", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Number of provinces — union find", v: "ZGr5nX-Gi6Y", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Course schedule — detect cycle", v: "37cJ38HadM4", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Course schedule II — build order", v: "WAOfKpxYHR8", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Network delay — Dijkstra", v: "WAOfKpxYHR8", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, null],
    "17": [{ t: "Learn first — Bipartite — 2-coloring", v: "-vu34sct1g8", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Keys and rooms — reachability", v: "4hDdUPhckYE", a: "CheatCode Ninja", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — 01 matrix — multi-source BFS", v: "gu2MD0mpy9w", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Accounts merge — union find", v: "FMwpt_aQOGw", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Cheapest flights — Bellman Ford", v: "5eIK3zUdYmE", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Critical connections — bridges", v: "6h1SucBNxgc", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, null],
    "18": [{ t: "Learn first — Min cost climbing — intro DP", v: "KwItlcfF9vE", a: "Shradha Khapra", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — House robber — take or skip", v: "73r3KWiEvyk", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Coin change — unbounded", v: "H9bfqozjoqs", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Unique paths — grid DP", v: "IlEsdxuD4lY", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Longest increasing subsequence", v: "ekcwMsSIzVc", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Partition equal subset — knapsack", v: "7win3dcgo3k", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, null],
    "19": [{ t: "Learn first — Longest common subsequence", v: "jHGgXV27qtk", a: "Jenny's Lectures CS IT", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Longest palindromic subsequence", v: "6i_T5kkfv4A", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Minimum path sum — grid DP", v: "pGMsrvt0fpk", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Maximal square", v: "--x7q3PTT_c", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Stock with cooldown — state DP", v: "IGIe46xw3YY", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Implement trie", v: "oobqoCJlHA0", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, null]
,
    "20": [{ t: "Learn first — Longest valid parentheses — stack", v: "uLP67Zh8bxk", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Reverse nodes in k-group", v: "1UOPsfP85V4", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Shortest palindrome — KMP", v: "5DACQK9kud0", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Minimum window subsequence", v: "xBZfV0OBmLY", a: "Engineering Digest", h: "Sliding window at its hardest — the same pattern as minimum size subarray sum, pushed further. Then the problems below." }, { t: "Learn first — Minimum remove to make valid parentheses", v: "54m6kYA9QFE", a: "RisingBrain", h: "Watch or read this first, then that day's problems below." }],
    "21": [{ t: "Learn first — Burst balloons — interval DP", v: "VFskby7lUbw", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Interleaving string — 2D DP", v: "3Rw3p9LrgvE", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Stock III — two transactions", v: "SFJGgz_VpxE", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Word break II — backtrack + memo", v: "QgLKdluDo08", a: "NeetCodeIO", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Russian doll envelopes — LIS", v: "3fF1r5nhQX4", a: "Techdose", h: "Watch or read this first, then that day's problems below." }],
    "22": [{ t: "Learn first — Open the lock — BFS", v: "vtxETRvR9JY", a: "Coding Decoded", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Shortest path visiting all nodes — bitmask", v: "GwqxnD3Zmbk", a: "Nitesh Nanda", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Evaluate division — weighted union find", v: "9XXry-MZQso", a: "The Coachable Dev", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Max points on a line — hashing", v: "Bb9lOXUOnFw", a: "NeetCodeIO", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Maximal rectangle — the boss", v: "ttVu6G7Ayik", a: "take U forward", h: "Watch or read this first, then that day's problems below." }],
    "23": [{ t: "Learn first — Stock IV — k transactions", v: "ym8NIk7ws7I", a: "Nikhil Lohia", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Recover BST — Morris", v: "ZWGW7FminDM", a: "take U forward", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Maximum frequency stack — design", v: "Z6idIicFDOE", a: "NeetCode", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Integer to English words", v: "9FLpWWJ987w", a: "codestorywithMIK", h: "Watch or read this first, then that day's problems below." }, { t: "Learn first — Minimum cost for tickets — DP", v: "oZ_xAIGCXw4", a: "CodeHelp - by Babbar", h: "Watch or read this first, then that day's problems below." }]  };

  /* ============================================================
     BUILD DAYS
     ============================================================ */
  var DAYS = [];
  var dayN = 0;

  function trackFor(it) {
    var t = it.type, t2 = (it.title || "").toLowerCase();
    if (t === "dsa" || t === "stretch" || t === "watch") return "dsa";
    if (t === "theory") return "cs";
    if (t === "dev" || t === "ai" || t === "project" || t === "career") return "dev";
    if (t === "review") {
      if (t2.indexOf("re-solve") >= 0 || t2.indexOf("timed") >= 0 || t2.indexOf("mock test") >= 0 ||
          t2.indexOf("contest") >= 0 || t2.indexOf("upsolve") >= 0) return "dsa";
      if (t2.indexOf("revision for tomorrow") >= 0 || t2.indexOf("answers in your own words") >= 0 ||
          t2.indexOf("cheat sheet") >= 0 || t2.indexOf("answer bank") >= 0 || t2.indexOf("rapid-fire") >= 0) return "cs";
      return "dsa";
    }
    return "dsa";
  }

  function watchItem(w, hint) {
    return {
      type: "watch", track: "dsa",
      title: "Watch first — " + w.pre.vtitle,
      url: w.pre.url, vauthor: w.pre.vauthor,
      hint: hint || "Pattern primer for the week. Watch it before the problems, then code along later if needed."
    };
  }

  WEEKS.forEach(function (w) {
    var start = addDaysISO(WEEK1, (w.n - 1) * 7);
    var timedWeek = w.n >= 10;

    for (var d = 0; d < 7; d++) {
      var date = addDaysISO(start, d);
      dayN++;
      var items = [];
      var meta = { n: dayN, week: w.n, date: date, idx: d };

      function prob(i, hint) {
        var p = w.problems[i];
        return { id: date + "-p" + i, type: "dsa", track: "dsa", title: p.title, url: p.url, diff: p.diff, hint: hint };
      }
      function csItem(i, hint) {
        var c = w.csTopics[i];
        return { type: "theory", track: "cs", title: w.cs + " — " + c.label, url: c.url, vtitle: c.vtitle, vauthor: c.vauthor, hint: hint };
      }
      var FULL = "45 min alone, 20 min learning, then rewrite it with the editor closed.";
      var FULL2 = "Second problem. Past 45 minutes, read the solution — don't burn the day.";

      if (w.mode === "exam") {
        var ep = w.problems[d], ec = w.csTopics[d];
        items.push({ id: date + "-p", type: "dsa", track: "dsa", title: ep.title, url: ep.url, diff: ep.diff,
          hint: "10 minutes. Can't crack it? Read the solution, write it once from memory, move on." });
        items.push({ id: date + "-c", type: "theory", track: w.conceptsInDsa ? "dsa" : "cs",
          title: w.cs + " — " + ec.label, url: ec.url, vtitle: ec.vtitle, vauthor: ec.vauthor,
          hint: "10 minutes at 1.5x, then 3 lines in your notes." });
        meta.title = "Day " + (d + 1) + " · light";
        meta.time = "20 min";
        meta.light = true;
      }

      else if (w.mode === "transition") {
        if (d === 0) {
          items.push({ id: date + "-exam", type: "review", track: "dev", title: "Last exam today — nothing else is required",
            hint: "Come back tomorrow. The FAANG block starts Dec 8." });
          items.push(prob(0, "Only if you have the energy. 10 minutes."));
          meta.title = "Last exam · optional"; meta.time = "10 min"; meta.light = true;
        } else if (d < 6) {
          var ti = 1 + (d - 1) * 2;
          items.push(prob(ti, FULL)); items.push(prob(ti + 1, FULL2));
          items.push(csItem((d - 1) % w.csTopics.length, "30 minutes, then 5 lines in your own words."));
          meta.title = "Day " + d; meta.time = "2h 45m";
        } else {
          items.push({ id: date + "-r1", type: "review", title: "Re-solve 3 of this week's problems — cold",
            hint: w.problems.slice(0, 3).map(function (x) { return x.title; }).join(" · ") });
          (w.stretch || []).forEach(function (sp, k) {
            items.push({ id: date + "-st" + k, type: "stretch", track: "dsa", title: sp.title, url: sp.url, diff: sp.diff, hint: "Optional. 30 minutes of struggle beats 3 easy wins." });
          });
          items.push({ id: date + "-r2", type: "review", track: "dsa", title: "Weekly review: 3 lines in plan.md" });
          meta.title = "Revision day"; meta.time = "~3h"; meta.revision = true;
        }
      }

      else if (w.mode === "normal") {
        if (d < 6) {
          items.push(prob(d * 2, FULL)); items.push(prob(d * 2 + 1, FULL2));

          meta.title = "Day " + (d + 1); meta.time = "2h 45m";
        } else {
          items.push({
            id: date + "-r1", type: "review", track: "dsa",
            title: timedWeek ? "OA simulation — 2 unseen mediums, 60 min, no help" : "Re-solve 3 problems from this week — cold, no hints",
            hint: timedWeek
              ? "This is the FAANG online-assessment format. Timer on, editor bare, talk out loud. Then re-solve 2 old ones."
              : w.problems.slice(0, 3).map(function (x) { return x.title; }).join(" · ")
          });
          (w.stretch || []).forEach(function (sp, k) {
            items.push({ id: date + "-st" + k, type: "stretch", track: "dsa", title: sp.title, url: sp.url, diff: sp.diff,
              hint: k === 0 ? "Optional FAANG-level stretch." : "Optional. Attempt, don't solve." });
          });
          items.push({ id: date + "-r2", type: "review", track: "dsa", title: "Weekly review: 3 lines in plan.md — what clicked, what didn't, what I redo" });
          meta.title = timedWeek ? "Revision + timed set" : "Revision day";
          meta.time = "~3h"; meta.revision = true;
        }
      }

      else {
        var day = w.days[d];
        items = day.items.map(function (it, k) {
          var o = { id: date + "-s" + k, type: it.type, title: it.title, url: it.url || null, diff: it.diff || null, hint: it.hint || null };
          o.track = trackFor(o);
          return o;
        });
        meta.title = day.t; meta.time = "~3h";
      }

      meta.items = items.map(function (it) { it.track = it.track || trackFor(it); return it; });
      DAYS.push(meta);
    }
  });

  /* week month label */
  function monthOf(isoDate) {
    return new Date(isoDate + "T00:00:00").toLocaleDateString("en-IN", { month: "short" });
  }

  /* ============================================================
     REFERENCE CONTENT
     ============================================================ */



  /* ============================================================
     THE FAANG BAR
     ============================================================ */


  var RULES = [
    "45 min alone → 20 min learning → rewrite from scratch. Every problem.",
    "FAANG bar: easy under 15 min, medium under 30 min — cold, out loud.",
    "Attempt 2 hards a week. Not solve. Attempt.",
    "From week 10, every week ends with a timed set. It is the OA, rehearsed.",
    "Revision beats new problems after week 8. 244 revised beats 400 forgotten.",
    "Every problem appears once. Repeats are labelled re-solve, on purpose.",
    "A collapsed day = one easy problem. Never zero.",
    "One sheet: Striver A2Z to learn, NeetCode 150 to revise.",
    "Don't buy a course. Everything here is free."
  ];


  window.CUDATA = {
    WEEK1: WEEK1, PLACEMENT_SEASON: PLACEMENT_SEASON,
    WEEKS: WEEKS, DAYS: DAYS,
    RULES: RULES, LEARN: LEARN,
    addDaysISO: addDaysISO, diffDays: diffDays, monthOf: monthOf
  };
})();
