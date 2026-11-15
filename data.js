/* ============================================================
   CU Prep OS v3 — one continuous timeline
   Week 1 = Mon 16 Nov 2026 (endsems) ... Week 22 = 18 Apr 2027
   Every problem appears exactly once across the whole plan.
   ============================================================ */

(function () {
  "use strict";

  var LC = "https://leetcode.com/problems/";
  var WEEK1 = "2026-11-16";
  var PLACEMENT_SEASON = "2027-08-01";

  function yt(q) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q); }
  function P(title, slug, diff) { return { title: title, url: LC + slug + "/", diff: diff }; }
  function C(label, q) { return { label: label, url: yt(q) }; }

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
      stretch: P("Subarray Sum Equals K", "subarray-sum-equals-k", "M"),
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
      stretch: P("Minimum Window Substring", "minimum-window-substring", "H"),
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
      stretch: P("Spiral Matrix II", "spiral-matrix-ii", "M"),
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
      stretch: P("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "H"),
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
      stretch: P("Kth Smallest Element in a Sorted Matrix", "kth-smallest-element-in-a-sorted-matrix", "M"),
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
      stretch: P("Word Search II", "word-search-ii", "H"),
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
      stretch: P("Merge k Sorted Lists", "merge-k-sorted-lists", "H"),
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
      stretch: P("Sum of Subarray Minimums", "sum-of-subarray-minimums", "M"),
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
      stretch: P("Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "H"),
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
      stretch: P("Binary Tree Cameras", "binary-tree-cameras", "H"),
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
      stretch: P("IPO", "ipo", "H"),
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
      stretch: P("Assign Cookies", "assign-cookies", "E"),
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
      stretch: P("Word Ladder", "word-ladder", "H"),
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
      stretch: P("Word Ladder II", "word-ladder-ii", "H"),
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
      stretch: P("Target Sum", "target-sum", "M"),
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
      stretch: P("Regular Expression Matching", "regular-expression-matching", "H"),
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

    /* ---------------- SPRINT ---------------- */
    {
      n: 20, mode: "sprint", theme: "Repair week · fix what the checkpoints exposed",
      goal: "No new topics. Re-solve what you got wrong.",
      cs: "Answer bank",
      days: [
        { t: "Repair: arrays, hashing, two pointers", items: [
          { type: "review", title: "Re-solve 6 problems you got wrong in weeks 4-5 — cold", hint: "Deliberate repeats. If it takes 2 minutes because you memorised it, pick another." },
          { type: "theory", title: "Rewrite your 10 weakest DBMS answers in your own words", hint: "3 lines each. No copy-paste." }
        ]},
        { t: "Repair: sliding window, strings", items: [
          { type: "review", title: "Re-solve 6 problems from weeks 5-6 — cold" },
          { type: "career", title: "20 applications" }
        ]},
        { t: "Repair: binary search, matrices", items: [
          { type: "review", title: "Re-solve 6 problems from weeks 7-8 — cold" },
          { type: "theory", title: "Rewrite your weakest OS answers" }
        ]},
        { t: "Repair: recursion, linked lists", items: [
          { type: "review", title: "Re-solve 6 problems from weeks 9-10 — cold" },
          { type: "dev", title: "Fix the 3 weakest links in your eval score" }
        ]},
        { t: "Repair: stacks, trees", items: [
          { type: "review", title: "Re-solve 6 problems from weeks 11-13 — cold" },
          { type: "theory", title: "Rewrite your weakest CN answers" }
        ]},
        { t: "Repair: heaps, greedy, graphs", items: [
          { type: "review", title: "Re-solve 6 problems from weeks 14-17 — cold" },
          { type: "career", title: "Update resume with both projects + eval numbers" }
        ]},
        { t: "Timed test", items: [
          { type: "review", title: "Full mock test: 3 unseen problems, 90 min, no help" },
          { type: "review", title: "Log what broke; schedule the repair" }
        ]}
      ]
    },
    {
      n: 21, mode: "sprint", theme: "Mock marathon · five interviews in seven days",
      goal: "Enough reps that the real interview feels familiar.",
      cs: "Interview mode",
      days: [
        { t: "Mock 1 — DSA", items: [
          { type: "career", title: "Mock interview #1 (Pramp or a senior)" },
          { type: "review", title: "Re-solve the 2 you fumbled, immediately" }
        ]},
        { t: "Mock 2 — CS fundamentals", items: [
          { type: "career", title: "Mock #2 — ask them to grill DBMS / OS / CN" },
          { type: "theory", title: "20 rapid-fire questions out loud, no notes" }
        ]},
        { t: "Mock 3 — project deep dive", items: [
          { type: "career", title: "Mock #3: 30 minutes only about your agent" },
          { type: "dev", title: "Write the project story: problem, design, evals, failure modes" }
        ]},
        { t: "Mock 4 — HR round", items: [
          { type: "career", title: "Mock #4: HR only" },
          { type: "career", title: "Final answers to the 5 standard HR questions" }
        ]},
        { t: "Mock 5 — full loop", items: [
          { type: "career", title: "Mock #5: one full loop, end to end" },
          { type: "career", title: "20 applications" }
        ]},
        { t: "Gap fixing", items: [
          { type: "review", title: "Fix the top 3 gaps the mocks exposed — nothing else" }
        ]},
        { t: "Rest and review", items: [
          { type: "review", title: "Write the mock retrospective in plan.md" }
        ]}
      ]
    },
    {
      n: 22, mode: "sprint", theme: "Ship it · portfolio, contests, handoff",
      goal: "Everything a recruiter needs to say yes, in one place.",
      cs: "Final polish",
      days: [
        { t: "Portfolio", items: [
          { type: "career", title: "Resume v5 — 1 page, both projects, live links, numbers" },
          { type: "dev", title: "GitHub profile README + pinned AI projects with eval scores" },
          { type: "career", title: "LinkedIn featured: both live demos" }
        ]},
        { t: "Contest day", items: [
          { type: "review", title: "Two timed contests back to back (90 min each)" },
          { type: "review", title: "Upsolve the 2 you couldn't finish" }
        ]},
        { t: "Project audit", items: [
          { type: "dev", title: "Both links work, both READMEs complete, both have a demo GIF" },
          { type: "dev", title: "Try to break your own agent cold — fix one thing" }
        ]},
        { t: "Volume", items: [
          { type: "career", title: "25 applications + 5 referral DMs" },
          { type: "career", title: "Follow up on everything older than 10 days" }
        ]},
        { t: "Handoff", items: [
          { type: "career", title: "Write Phase 3 (May → Aug): DP depth, 2 mocks/week, 10 apps/week" }
        ]},
        { t: "Final mock", items: [
          { type: "career", title: "One final full mock — feel the difference from week 4" }
        ]},
        { t: "Done", items: [
          { type: "review", title: "Write the 22-week retrospective. Then take a day off." }
        ]}
      ]
    }
  ];

  /* ============================================================
     BUILD DAYS
     ============================================================ */
  var DAYS = [];
  var dayN = 0;

  WEEKS.forEach(function (w) {
    var start = addDaysISO(WEEK1, (w.n - 1) * 7);

    for (var d = 0; d < 7; d++) {
      var date = addDaysISO(start, d);
      dayN++;
      var items = [];
      var meta = { n: dayN, week: w.n, date: date, idx: d };

      if (w.mode === "exam") {
        var p = w.problems[d];
        var c = w.csTopics[d];
        items.push({
          id: date + "-p", type: "dsa",
          title: p.title, url: p.url, diff: p.diff,
          hint: "10 minutes. Can't crack it? Read the solution, write it once from memory, move on."
        });
        items.push({
          id: date + "-c", type: "theory",
          title: w.cs + " — " + c.label, url: c.url,
          hint: "10 minutes at 1.5x, then 3 lines in your notes."
        });
        items.push({
          id: date + "-ai", type: "ai",
          title: w.ai[d],
          hint: "15 minutes. Setup and first steps only — no rabbit holes during exams."
        });
        items.push({
          id: date + "-ex", type: "review",
          title: "One page of revision for tomorrow's paper",
          hint: "Exams come first. Blank day? Do this one and let the rest go."
        });
        meta.title = "Day " + (d + 1) + " · light";
        meta.time = "40 min";
        meta.light = true;
      }

      else if (w.mode === "transition") {
        if (d === 0) {
          items.push({
            id: date + "-exam", type: "review",
            title: "Last exam today — nothing else is required",
            hint: "Come back tomorrow. The 5-month block starts Dec 8."
          });
          items.push({
            id: date + "-p", type: "dsa",
            title: w.problems[0].title, url: w.problems[0].url, diff: w.problems[0].diff,
            hint: "Only if you have the energy. 10 minutes."
          });
          meta.title = "Last exam · optional";
          meta.time = "10 min";
          meta.light = true;
        } else if (d < 6) {
          var i0 = 1 + (d - 1) * 2;
          items.push({
            id: date + "-p1", type: "dsa",
            title: w.problems[i0].title, url: w.problems[i0].url, diff: w.problems[i0].diff,
            hint: "45 min alone, 20 min learning, then rewrite it with the editor closed."
          });
          items.push({
            id: date + "-p2", type: "dsa",
            title: w.problems[i0 + 1].title, url: w.problems[i0 + 1].url, diff: w.problems[i0 + 1].diff,
            hint: "Second one. Past 45 minutes, read the solution."
          });
          var ct0 = w.csTopics[(d - 1) % w.csTopics.length];
          items.push({
            id: date + "-cs", type: "theory",
            title: w.cs + " — " + ct0.label, url: ct0.url,
            hint: "30 minutes, then 5 lines in your own words."
          });
          if (d === 2) items.push({ id: date + "-proj", type: "project", title: w.project, hint: "60-90 min." });
          if (d === 1) items.push({ id: date + "-car", type: "career", title: w.career[0] });
          if (d === 5) items.push({ id: date + "-car2", type: "career", title: w.career[1] });
          meta.title = "Day " + d + " · full block";
          meta.time = "2h 45m";
        } else {
          items.push({
            id: date + "-r1", type: "review",
            title: "Re-solve 3 of this week's problems — cold",
            hint: w.problems.slice(0, 3).map(function (x) { return x.title; }).join(" · ")
          });
          if (w.stretch) items.push({
            id: date + "-st", type: "stretch", title: w.stretch.title, url: w.stretch.url, diff: w.stretch.diff,
            hint: "Optional. 30 minutes of struggle beats 3 easy wins."
          });
          items.push({ id: date + "-r2", type: "review", title: "Weekly review: 3 lines in plan.md" });
          meta.title = "Revision day";
          meta.time = "~2h";
          meta.revision = true;
        }
      }

      else if (w.mode === "normal") {
        if (d < 6) {
          var a = w.problems[d * 2], b = w.problems[d * 2 + 1];
          items.push({
            id: date + "-p1", type: "dsa", title: a.title, url: a.url, diff: a.diff,
            hint: "45 min alone, 20 min learning, rewrite with the editor closed."
          });
          items.push({
            id: date + "-p2", type: "dsa", title: b.title, url: b.url, diff: b.diff,
            hint: "Second one. Don't burn the day on one problem."
          });
          var ct = w.csTopics[d];
          items.push({
            id: date + "-cs", type: "theory", title: w.cs + " — " + ct.label, url: ct.url,
            hint: "30 min. Then close the tab and say it out loud in 60 seconds."
          });
          if (d === 0 || d === 2 || d === 4) {
            items.push({ id: date + "-ai", type: "dev", title: w.ai[Math.floor(d / 2)], hint: "45 min. Commit and push before you sleep." });
          }
          if (d === 3) items.push({ id: date + "-proj", type: "project", title: w.project, hint: "60-90 min." });
          if (d === 1) items.push({ id: date + "-c1", type: "career", title: w.career[0] });
          if (d === 5) items.push({ id: date + "-c2", type: "career", title: w.career[1] });
          meta.title = "Day " + (d + 1);
          meta.time = "2h 45m";
        } else {
          items.push({
            id: date + "-r1", type: "review",
            title: "Re-solve 3 problems from this week — cold, no hints",
            hint: w.problems.slice(0, 3).map(function (x) { return x.title; }).join(" · ")
          });
          if (w.stretch) items.push({
            id: date + "-st", type: "stretch", title: w.stretch.title, url: w.stretch.url, diff: w.stretch.diff,
            hint: "Optional but recommended."
          });
          items.push({ id: date + "-r2", type: "review", title: "Weekly review: 3 lines in plan.md — what clicked, what didn't, what I redo" });
          meta.title = "Revision day";
          meta.time = "~2h";
          meta.revision = true;
        }
      }

      else {
        var day = w.days[d];
        items = day.items.map(function (it, k) {
          return { id: date + "-s" + k, type: it.type, title: it.title, url: it.url || null, diff: it.diff || null, hint: it.hint || null };
        });
        meta.title = day.t;
        meta.time = "~3h";
      }

      meta.items = items;
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
  var CS = [
    { name: "DBMS + SQL", weeks: "W4-7, 14",
      topics: ["ER model & keys", "Normalization 1NF-BCNF", "Indexes & B+ trees", "Transactions & ACID", "Isolation levels", "Joins", "GROUP BY / HAVING", "Subqueries & CTEs", "Window functions", "SQL 50", "EXPLAIN plans", "N+1", "Sharding vs partitioning", "Replication", "CAP", "Connection pooling"],
      links: [C("Gate Smashers DBMS", "gate smashers dbms full course"), C("SQLBolt", "sqlbolt interactive sql tutorial"), C("GfG DBMS", "geeksforgeeks dbms tutorial")] },
    { name: "Operating Systems", weeks: "W8-9, revised W20",
      topics: ["Process vs thread", "States & context switch", "Scheduling", "Mutex vs semaphore", "Deadlock + Banker's", "Paging vs segmentation", "Virtual memory", "Page replacement", "Thrashing", "File systems", "fork / exec"],
      links: [C("Gate Smashers OS", "gate smashers operating system full course"), C("GfG OS", "geeksforgeeks operating system tutorial")] },
    { name: "Computer Networks", weeks: "W10-11, 16",
      topics: ["OSI vs TCP/IP", "TCP vs UDP", "3-way handshake", "HTTP vs HTTPS / TLS", "DNS", "URL lifecycle", "Status codes", "Cookies vs JWT", "REST", "CORS", "Load balancing", "CDN & caching", "WebSockets", "Idempotency", "Rate limiting"],
      links: [C("Gate Smashers CN", "gate smashers computer networks full course"), C("MDN HTTP", "mdn http overview")] },
    { name: "OOP + Java internals", weeks: "W12-13, revised W20",
      topics: ["4 pillars", "Abstract vs interface", "Overloading vs overriding", "SOLID", "Composition vs inheritance", "ArrayList internals", "HashMap internals", "String pool", "equals/hashCode", "Exceptions", "GC basics"],
      links: [C("Java Brains OOP", "java brains object oriented programming"), C("Collections internals", "java collections framework internals interview")] },
    { name: "AI / LLM fundamentals", weeks: "W17, every AI interview",
      topics: ["Tokens & context", "Transformer intuition", "Embeddings", "RAG vs fine-tuning", "Hallucination", "Tool calling", "ReAct loops", "Evals & LLM-as-judge", "Prompt injection", "Latency vs cost", "Vector indexing", "Guardrails"],
      links: [C("What is RAG", "what is retrieval augmented generation explained"), C("Transformers intuitively", "transformers explained intuition no math"), C("LLM evals", "how to evaluate llm applications evals"), C("Prompt injection", "prompt injection explained llm security")] },
    { name: "LLD + HLD", weeks: "W18-19",
      topics: ["SOLID in code", "Strategy", "Factory", "Observer", "Singleton & Builder", "Parking lot LLD", "Scaling basics", "Caching", "Message queues", "Consistent hashing", "URL shortener", "Rate limiter"],
      links: [C("Design patterns", "design patterns java tutorial"), C("System design basics", "system design basics for beginners")] }
  ];

  var AI = {
    thesis: "Agentic AI is hireable only when you can show <b>a system that runs, an eval that proves it works, and a deployed endpoint someone else can call</b>. Prompt wrappers get filtered out in round one. Agents + retrieval + evals + a live API is the shape that gets interviews.",
    reality: "At CU most drives are SDE and service roles. AI fresher openings are fewer and mostly off-campus. So DSA and CS stay exactly where they are — this is your differentiator and your startup route, not a replacement for the coding round. Java for DSA, Python for AI.",
    stack: ["Python 3.12", "FastAPI", "Pydantic", "OpenAI / Anthropic / Gemini SDK", "LangGraph", "Chroma / pgvector", "Langfuse", "Docker", "GitHub Actions", "Render / Railway"],
    skip: [
      "Training a model from scratch. You're hired to ship, not to research.",
      "Fine-tuning before one RAG pipeline works end to end.",
      "Collecting eight agent frameworks. The raw SDK + LangGraph is enough.",
      "Prompt-engineering courses. You learn this by breaking prompts.",
      "AI Twitter. It teaches you nothing and makes you feel late.",
      "Blockchain / Web3 / AR detours.",
      "Paid bootcamps."
    ],
    projects: [
      { name: "P1 · agentic RAG assistant (W5-12)", d: "Documents in, retrieval with citations, 3 tools, guardrails, an eval suite, FastAPI + UI, deployed. Your 30-minute interview." },
      { name: "P2 · domain agent + eval report (W17-18)", d: "A narrow agent for one job, 30-case eval set, a score you can quote. Proves P1 wasn't luck." }
    ]
  };

  var RESOURCES = [
    { group: "DSA — one sheet, no switching",
      items: [
        { label: "Striver A2Z", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", note: "Free, Java code, same order as this plan." },
        { label: "NeetCode 150", url: "https://neetcode.io/practice", note: "Only when stuck on a pattern." },
        { label: "LeetCode", url: "https://leetcode.com/problemset/" }
      ] },
    { group: "CS fundamentals",
      items: [
        { label: "Gate Smashers", url: yt("gate smashers dbms os cn full course"), note: "Fastest route to interview-grade OS/DBMS/CN." },
        { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/", note: "Reference, not a course." },
        { label: "SQLBolt", url: "https://sqlbolt.com/" },
        { label: "LeetCode SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/" }
      ] },
    { group: "AI stack",
      items: [
        { label: "OpenAI docs", url: "https://platform.openai.com/docs", note: "Read the tool-calling page properly, twice." },
        { label: "Anthropic docs", url: "https://docs.anthropic.com/", note: "Best writing on agents and tool use." },
        { label: "LangGraph docs", url: "https://langchain-ai.github.io/langgraph/", note: "Use it after you build the loop by hand." },
        { label: "Chroma", url: "https://docs.trychroma.com/", note: "Fastest vector DB to learn on." },
        { label: "pgvector", url: "https://github.com/pgvector/pgvector", note: "The one that shows up in real jobs." },
        { label: "Langfuse", url: "https://langfuse.com/", note: "Tracing + evals, free tier." },
        { label: "FastAPI docs", url: "https://fastapi.tiangolo.com/" }
      ] },
    { group: "Aptitude",
      items: [
        { label: "IndiaBix", url: "https://www.indiabix.com/", note: "Pattern-matched to TCS NQT." },
        { label: "PrepInsta", url: "https://prepinsta.com/", note: "Company-wise previous papers." }
      ] },
    { group: "Applying",
      items: [
        { label: "Unstop", url: "https://unstop.com/", note: "Highest conversion for Indian students." },
        { label: "Wellfound", url: "https://wellfound.com/", note: "AI startups — your most realistic route." },
        { label: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/", note: "Use it for referrals, not blind applies." },
        { label: "Cuvette", url: "https://cuvette.tech/" },
        { label: "Naukri", url: "https://www.naukri.com/" },
        { label: "Internshala", url: "https://internshala.com/" }
      ] },
    { group: "Company portals — register early",
      items: [
        { label: "TCS NextStep", url: "https://nextstep.tcs.com/" },
        { label: "Infosys", url: "https://career.infosys.com/" },
        { label: "Wipro", url: "https://careers.wipro.com/" },
        { label: "Accenture", url: "https://www.accenture.com/in-en/careers" },
        { label: "Cognizant", url: "https://careers.cognizant.com/global/en" },
        { label: "Capgemini", url: "https://www.capgemini.com/in-en/careers/" }
      ] },
    { group: "Mocks",
      items: [
        { label: "Pramp", url: "https://www.pramp.com/", note: "Free peer mocks. Do 10+." },
        { label: "Excalidraw", url: "https://excalidraw.com/", note: "For LLD/HLD diagrams." }
      ] }
  ];

  var RULES = [
    "One sheet, one language, one stack. Switching plans is the #1 killer.",
    "45 min alone → 20 min learning → rewrite from scratch. Every problem.",
    "After week 8, revision beats new problems.",
    "Deploy P1 in week 12, not week 22.",
    "Exam weeks are 40 minutes. That's the whole promise — no guilt, no catching up later.",
    "A collapsed day = one easy problem. Never zero.",
    "CGPA floor 7.5, zero backlogs. You have 7.65 — don't waste it.",
    "Every problem in this plan appears once. Repeats are labelled 're-solve' on purpose.",
    "Speak English out loud 10 min/day. Good coders fail HR rounds here constantly."
  ];

  var MILESTONES = [
    { when: "Week 3 · Dec 6", checks: ["21 easy problems done", "Python + first LLM call working", "Exams still passed", "Zero burnout"] },
    { when: "Week 9 · Jan 10", checks: ["~90 problems", "DBMS + SQL solid", "P1 retrieval working with a hit-rate number", "Resume v2 live", "First mock done"] },
    { when: "Week 14 · Feb 21", checks: ["~150 problems", "OS + CN done", "P1 deployed with an eval suite", "10 applications/week", "3 mocks"] },
    { when: "Week 19 · Mar 21", checks: ["~215 problems", "DP + graphs + tries done", "P2 deployed + eval report", "Docker + CI", "4 checkpoints passed"] },
    { when: "Week 22 · Apr 18", checks: ["5 mocks done", "Portfolio + demo video", "40+ applications", "HR answers written", "Phase 3 plan ready"] }
  ];

  window.CUDATA = {
    WEEK1: WEEK1, PLACEMENT_SEASON: PLACEMENT_SEASON,
    WEEKS: WEEKS, DAYS: DAYS,
    CS: CS, AI: AI, RESOURCES: RESOURCES, RULES: RULES, MILESTONES: MILESTONES,
    addDaysISO: addDaysISO, diffDays: diffDays, monthOf: monthOf
  };
})();
