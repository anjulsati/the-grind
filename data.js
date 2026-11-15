/* ============================================================
   CU Prep OS — data layer (v2)
   20-week (5-month) placement plan + dev track
   + momentum days Nov 16 -> Dec 7
   ============================================================ */

(function () {
  "use strict";

  var LC = "https://leetcode.com/problems/";
  function yt(q) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q); }
  function P(title, slug, diff) { return { title: title, url: LC + slug + "/", diff: diff }; }
  function T(label, q) { return { label: label, url: yt(q) }; }

  var MOMENTUM_START = "2026-11-16";
  var MOMENTUM_END = "2026-12-07";
  var PLAN_START = "2026-12-08";
  var PLACEMENT_SEASON = "2027-08-01";

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
     PART 1 — MOMENTUM: Nov 16 -> Dec 7  (35 min/day, endsems)
     ============================================================ */
  var mProblems = [
    P("Two Sum", "two-sum", "E"),
    P("Palindrome Number", "palindrome-number", "E"),
    P("Roman to Integer", "roman-to-integer", "E"),
    P("Longest Common Prefix", "longest-common-prefix", "E"),
    P("Valid Parentheses", "valid-parentheses", "E"),
    P("Merge Two Sorted Lists", "merge-two-sorted-lists", "E"),
    P("Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "E"),
    P("Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "E"),
    P("Majority Element", "majority-element", "E"),
    P("Move Zeroes", "move-zeroes", "E"),
    P("Plus One", "plus-one", "E"),
    P("Sqrt(x)", "sqrtx", "E"),
    P("Climbing Stairs", "climbing-stairs", "E"),
    P("Single Number", "single-number", "E"),
    P("Missing Number", "missing-number", "E"),
    P("Contains Duplicate", "contains-duplicate", "E"),
    P("Valid Anagram", "valid-anagram", "E"),
    P("Intersection of Two Arrays", "intersection-of-two-arrays", "E"),
    P("Reverse String", "reverse-string", "E"),
    P("Fizz Buzz", "fizz-buzz", "E"),
    P("Number of 1 Bits", "number-of-1-bits", "E"),
    P("Power of Two", "power-of-two", "E")
  ];

  var mConcepts = [
    ["Big-O in 10 minutes", "big o notation explained in 10 minutes"],
    ["How arrays sit in memory", "how arrays work in memory java"],
    ["ArrayList internals", "java arraylist internal implementation"],
    ["Two pointers technique", "two pointers technique explained coding interview"],
    ["Sliding window technique", "sliding window technique explained"],
    ["HashMap basics", "java hashmap explained for beginners"],
    ["HashMap vs HashSet", "hashmap vs hashset in java difference"],
    ["String immutability", "java string immutability explained"],
    ["StringBuilder vs String", "stringbuilder vs string java"],
    ["Recursion & the call stack", "recursion call stack explained beginners"],
    ["Stack vs queue", "stack vs queue data structure explained"],
    ["Linked lists", "linked list data structure explained beginners"],
    ["Binary search intuition", "binary search intuition explained"],
    ["Trees: first principles", "binary tree basics terminology"],
    ["HTTP requests in practice", "http request response explained beginners"],
    ["SQL: SELECT & WHERE", "sql select where tutorial"],
    ["SQL joins", "sql joins explained beginners"],
    ["DBMS normalization", "dbms normalization 1nf 2nf 3nf"],
    ["Database indexes", "database index explained"],
    ["Process vs thread", "process vs thread operating system"],
    ["What happens when you type a URL", "what happens when you type a url http"],
    ["OOP: the four pillars", "oop four pillars explained java"]
  ];

  var mDev = [
    "Python: check python3 --version. If missing, install it. Write hello.py and run it.",
    "Python basics: list, dict, tuple. Write 20 lines that use all three.",
    "Comprehensions and f-strings: rewrite yesterday's loop as a comprehension.",
    "Functions: default args, *args, **kwargs. Write one of each.",
    "Create a venv, activate it, pip install requests python-dotenv.",
    "Read a JSON file with json.load and print three fields.",
    "requests: GET a public API, print the status code and one field.",
    "Put your key in .env, load it with python-dotenv. Never hardcode keys.",
    "Get a free LLM API key (Google AI Studio or OpenRouter). Store it in .env.",
    "First LLM call from Python. Print the reply and the token usage.",
    "Tokens and cost: count tokens in 500 words, estimate the cost of 1000 calls.",
    "System vs user prompt: same question, three different system prompts.",
    "Temperature: run one prompt at 0 and at 1. Notice the difference.",
    "Ask for JSON, parse it with json.loads. Handle a failure with try/except.",
    "Pydantic: validate that JSON into a model. Watch a bad field get rejected.",
    "Tool calling: write one tool schema (name, description, JSON params).",
    "Embeddings: embed 3 sentences, compute cosine similarity in numpy.",
    "Chunking: split a 2-page text into 300-word chunks with overlap.",
    "Chroma: add 5 chunks, query once, print the top 2 results.",
    "RAG in 30 lines: retrieve 3 chunks, stuff them in a prompt, answer.",
    "FastAPI: /health and /chat running on localhost. Test in the browser.",
    "Write your AI learning notes in plan.md and commit. Tomorrow the real plan starts."
  ];

  var momentumDays = [];
  var mCount = diffDays(MOMENTUM_START, MOMENTUM_END) + 1;
  for (var i = 0; i < mCount; i++) {
    var md = addDaysISO(MOMENTUM_START, i);
    momentumDays.push({
      n: i + 1,
      date: md,
      title: "Momentum day " + (i + 1) + "/22 · " + (i < 11 ? "endsems" : "endsems, final stretch"),
      time: "35 min",
      items: [
        {
          id: md + "-p", type: "dsa",
          title: mProblems[i].title, url: mProblems[i].url, diff: mProblems[i].diff,
          hint: "10 minutes. Can't crack it? Read the solution and write it once from memory. Done is the goal."
        },
        {
          id: md + "-c", type: "theory",
          title: mConcepts[i][0], url: yt(mConcepts[i][1]),
          hint: "10 minutes at 1.5x. Three lines in your notes afterwards."
        },
        {
          id: md + "-d", type: "ai",
          title: mDev[i],
          hint: "10 minutes. This is setup work — it makes December painless."
        },
        {
          id: md + "-e", type: "review",
          title: "One page of revision for tomorrow's paper",
          hint: "Exams win. If a paper is tomorrow morning, skip the first three tasks entirely."
        }
      ]
    });
  }

  /* ============================================================
     PART 2 — 20-WEEK PLAN
     ============================================================ */
  function W(n, theme, cs, csTopics, problems, stretch, dev, career, project) {
    return {
      n: n, theme: theme, cs: cs, csTopics: csTopics, problems: problems,
      stretch: stretch, dev: dev, career: career, project: project
    };
  }

  /* shorthand */
  function cs6(a, b, c, d, e, f) { return [a, b, c, d, e, f]; }

  var WEEKS = [
    /* ---------------- PHASE A: foundations ---------------- */
    W(1, "Arrays I — the core patterns", "DBMS",
      cs6(
        ["ER model: entities, attributes, relations", "er model dbms entities relationships"],
        ["Keys: primary, foreign, candidate, composite", "types of keys in dbms"],
        ["Normalization 1NF → 3NF", "dbms normalization 1nf 2nf 3nf"],
        ["BCNF and when to denormalize", "bcnf normalization dbms"],
        ["Indexes and B+ trees", "dbms indexing b+ tree"],
        ["Transactions and ACID", "acid properties dbms transactions"]
      ),
      [P("Two Sum", "two-sum", "E"), P("Best Time to Buy and Sell Stock", "best-time-to-buy-and-sell-stock", "E"),
       P("Remove Duplicates from Sorted Array", "remove-duplicates-from-sorted-array", "E"), P("Move Zeroes", "move-zeroes", "E"),
       P("Majority Element", "majority-element", "E"), P("Maximum Subarray", "maximum-subarray", "M"),
       P("Rotate Array", "rotate-array", "M"), P("Merge Sorted Array", "merge-sorted-array", "E"),
       P("Missing Number", "missing-number", "E"), P("Single Number", "single-number", "E"),
       P("Product of Array Except Self", "product-of-array-except-self", "M"), P("Find All Numbers Disappeared in an Array", "find-all-numbers-disappeared-in-an-array", "E")],
      P("Subarray Sum Divisible by K", "subarray-sum-divisible-by-k", "M"),
      ["Terminal: cd, ls, mkdir, pwd, touch — 5 minutes of muscle memory",
       "Git: init, status, add, commit, log. Commit a Hello.java",
       "GitHub: create repo, push first commit, write README"],
      ["Create GitHub account + profile README with one honest line",
       "Write plan.md, paste this plan in it, commit"],
      null),

    W(2, "Arrays II + hashing", "DBMS",
      cs6(
        ["Isolation levels and the anomalies they fix", "transaction isolation levels dbms"],
        ["Joins: inner, left, right, self", "sql joins inner left self join"],
        ["GROUP BY, HAVING and aggregates", "sql group by having aggregate functions"],
        ["Subqueries and CTEs", "sql subqueries and cte"],
        ["SQL vs NoSQL — when to pick which", "sql vs nosql when to use"],
        ["Query optimization basics", "sql query optimization basics explain"]
      ),
      [P("Two Sum II — Input Array Is Sorted", "two-sum-ii-input-array-is-sorted", "M"), P("Container With Most Water", "container-with-most-water", "M"),
       P("Sort Colors", "sort-colors", "M"), P("3Sum", "3sum", "M"),
       P("Group Anagrams", "group-anagrams", "M"), P("Longest Consecutive Sequence", "longest-consecutive-sequence", "M"),
       P("Contains Duplicate", "contains-duplicate", "E"), P("Valid Anagram", "valid-anagram", "E"),
       P("Intersection of Two Arrays II", "intersection-of-two-arrays-ii", "E"), P("Set Matrix Zeroes", "set-matrix-zeroes", "M"),
       P("Spiral Matrix", "spiral-matrix", "M"), P("Rotate Image", "rotate-image", "M")],
      P("First Missing Positive", "first-missing-positive", "H"),
      ["Git branching: checkout -b, merge back. Do it twice",
       "Create a merge conflict on purpose, then resolve it",
       "Write a README with headings, code blocks, and one screenshot"],
      ["Resume v1 — plain text, 1 page, no design",
       "LinkedIn: headline, about (3 lines), education, skills"],
      null),

    W(3, "Sliding window + strings", "SQL practice",
      cs6(
        ["LeetCode SQL 50 — easy set (10 queries)", "leetcode sql 50 easy solutions"],
        ["SQL 50 — join set", "leetcode sql 50 joins solutions"],
        ["SQL 50 — aggregation set", "leetcode sql 50 aggregation solutions"],
        ["ORDER BY, LIMIT, date functions", "sql order by limit date functions"],
        ["Window functions: ROW_NUMBER, RANK, LEAD", "sql window functions row_number rank"],
        ["SQL 50 — window function set", "leetcode sql 50 window functions solutions"]
      ),
      [P("Longest Substring Without Repeating Characters", "longest-substring-without-repeating-characters", "M"), P("Longest Repeating Character Replacement", "longest-repeating-character-replacement", "M"),
       P("Minimum Size Subarray Sum", "minimum-size-subarray-sum", "M"), P("Permutation in String", "permutation-in-string", "M"),
       P("Find All Anagrams in a String", "find-all-anagrams-in-a-string", "M"), P("Fruit Into Baskets", "fruit-into-baskets", "M"),
       P("Valid Palindrome", "valid-palindrome", "E"), P("Valid Palindrome II", "valid-palindrome-ii", "E"),
       P("Reverse Words in a String", "reverse-words-in-a-string", "M"), P("Longest Common Prefix", "longest-common-prefix", "E"),
       P("Roman to Integer", "roman-to-integer", "E"), P("Integer to Roman", "integer-to-roman", "M")],
      P("String Compression", "string-compression", "M"),
      ["HTML: one-page profile with headings, list, image, link",
       "CSS: flexbox layout — header, main, footer",
       "DevTools: inspect, edit CSS live, check the console"],
      ["Register on TCS NextStep, Infosys, Wipro career portals",
       "Join Unstop and complete your profile"],
      null),

    W(4, "Sorting + binary search", "SQL practice",
      cs6(
        ["SQL 50 — subquery set", "leetcode sql 50 subqueries solutions"],
        ["SQL 50 — advanced set (finish)", "leetcode sql 50 all solutions"],
        ["EXPLAIN and reading a query plan", "mysql explain query plan"],
        ["Composite and covering indexes", "composite index covering index sql"],
        ["The N+1 query problem", "n+1 query problem orm"],
        ["SQL revision — redo your 5 worst queries", "sql interview questions practice"]
      ),
      [P("Sort an Array", "sort-an-array", "M"), P("Kth Largest Element in an Array", "kth-largest-element-in-an-array", "M"),
       P("Merge Intervals", "merge-intervals", "M"), P("Insert Interval", "insert-interval", "M"),
       P("Binary Search", "binary-search", "E"), P("Search Insert Position", "search-insert-position", "E"),
       P("First Bad Version", "first-bad-version", "E"), P("Squares of a Sorted Array", "squares-of-a-sorted-array", "E"),
       P("Search in Rotated Sorted Array", "search-in-rotated-sorted-array", "M"), P("Find Minimum in Rotated Sorted Array", "find-minimum-in-rotated-sorted-array", "M"),
       P("Find First and Last Position of Element in Sorted Array", "find-first-and-last-position-of-element-in-sorted-array", "M"), P("Single Element in a Sorted Array", "single-element-in-a-sorted-array", "M")],
      P("Median of Two Sorted Arrays", "median-of-two-sorted-arrays", "H"),
      ["JavaScript: variables, functions, arrays, objects — 20 lines",
       "DOM: a button that changes text on click",
       "fetch(): call a public API and render 3 items on the page"],
      ["CHECKPOINT 1 — 3 problems in 90 minutes, no editorials",
       "Fix the two weakest topics the test exposed. Nothing else."],
      null),

    W(5, "Binary search on answer", "Operating Systems",
      cs6(
        ["Process vs thread", "process vs thread operating system"],
        ["Process states and context switching", "process states context switching os"],
        ["CPU scheduling: FCFS, SJF, Round Robin", "cpu scheduling algorithms fcfs sjf round robin"],
        ["Synchronization: mutex vs semaphore", "mutex vs semaphore operating system"],
        ["Deadlock — the four conditions", "deadlock four necessary conditions os"],
        ["Banker's algorithm", "bankers algorithm deadlock avoidance"]
      ),
      [P("Koko Eating Bananas", "koko-eating-bananas", "M"), P("Capacity to Ship Packages Within D Days", "capacity-to-ship-packages-within-d-days", "M"),
       P("Split Array Largest Sum", "split-array-largest-sum", "H"), P("Find the Duplicate Number", "find-the-duplicate-number", "M"),
       P("Sqrt(x)", "sqrtx", "E"), P("Valid Perfect Square", "valid-perfect-square", "E"),
       P("Pow(x, n)", "powx-n", "M"), P("Search a 2D Matrix", "search-a-2d-matrix", "M"),
       P("Search a 2D Matrix II", "search-a-2d-matrix-ii", "M"), P("Add Binary", "add-binary", "E"),
       P("Multiply Strings", "multiply-strings", "M"), P("Count and Say", "count-and-say", "M")],
      P("Divide Two Integers", "divide-two-integers", "M"),
      ["Java revision: classes, interfaces, ArrayList, HashMap",
       "Streams and lambdas: filter / map / collect on objects",
       "Maven: create a project, mvn package, understand target/"],
      ["Get a senior to sanity-check your project idea in 15 minutes",
       "Create the repo + README skeleton"],
      "SPEC — 1-page doc, hand-drawn ER diagram, 5 endpoints listed. Stack: Spring Boot + MySQL + Postman. No code yet."),

    W(6, "Recursion & backtracking", "Operating Systems",
      cs6(
        ["Paging vs segmentation", "paging vs segmentation os"],
        ["Virtual memory", "virtual memory os explained"],
        ["Page replacement: FIFO, LRU, optimal", "page replacement algorithms lru fifo"],
        ["Thrashing", "thrashing operating system"],
        ["File systems basics", "file system basics os"],
        ["System calls, fork and exec", "system calls fork exec os"]
      ),
      [P("Climbing Stairs", "climbing-stairs", "E"), P("Subsets", "subsets", "M"),
       P("Permutations", "permutations", "M"), P("Combination Sum", "combination-sum", "M"),
       P("Generate Parentheses", "generate-parentheses", "M"), P("Letter Combinations of a Phone Number", "letter-combinations-of-a-phone-number", "M"),
       P("Palindrome Partitioning", "palindrome-partitioning", "M"), P("Subsets II", "subsets-ii", "M"),
       P("Combination Sum II", "combination-sum-ii", "M"), P("Word Search", "word-search", "M"),
       P("Restore IP Addresses", "restore-ip-addresses", "M"), P("N-Queens", "n-queens", "H")],
      P("Word Search II", "word-search-ii", "H"),
      ["Spring Initializr: generate, run, hit localhost:8080",
       "First REST controller: GET /hello returning JSON",
       "Postman: test the endpoint, save it in a collection"],
      ["Book your first Pramp mock — 45 min, awkward, do it",
       "Attend any CU aptitude/training session running this month"],
      "SKELETON — the app runs, /health returns JSON, MySQL connected, one table created."),

    W(7, "Linked lists", "Computer Networks",
      cs6(
        ["OSI vs TCP/IP model", "osi model vs tcp ip model"],
        ["TCP vs UDP", "tcp vs udp difference"],
        ["TCP three-way handshake", "tcp three way handshake"],
        ["HTTP vs HTTPS and TLS", "http vs https tls handshake"],
        ["DNS resolution step by step", "how dns works step by step"],
        ["What happens when you type a URL", "what happens when you type a url in browser"]
      ),
      [P("Reverse Linked List", "reverse-linked-list", "E"), P("Merge Two Sorted Lists", "merge-two-sorted-lists", "E"),
       P("Linked List Cycle", "linked-list-cycle", "E"), P("Middle of the Linked List", "middle-of-the-linked-list", "E"),
       P("Remove Nth Node From End of List", "remove-nth-node-from-end-of-list", "M"), P("Linked List Cycle II", "linked-list-cycle-ii", "M"),
       P("Add Two Numbers", "add-two-numbers", "M"), P("Reorder List", "reorder-list", "M"),
       P("Palindrome Linked List", "palindrome-linked-list", "E"), P("Intersection of Two Linked Lists", "intersection-of-two-linked-lists", "E"),
       P("Odd Even Linked List", "odd-even-linked-list", "M"), P("Copy List with Random Pointer", "copy-list-with-random-pointer", "M")],
      P("LRU Cache", "lru-cache", "M"),
      ["Spring Data JPA: entity + repository + MySQL connection",
       "DTO vs entity: create a response DTO",
       "CRUD: implement create + list endpoints, test in Postman"],
      ["Resume v2 — add the project, one bullet per feature",
       "Ask 2 placed seniors what their rounds actually were"],
      "CORE CRUD — create / read / update / delete with validation and sane status codes."),

    W(8, "Stacks & queues", "Computer Networks",
      cs6(
        ["HTTP methods and status codes", "http methods status codes explained"],
        ["Cookies vs sessions vs JWT", "cookies vs sessions vs jwt"],
        ["REST API design principles", "rest api design best practices"],
        ["CORS — what it actually blocks", "cors explained web"],
        ["Load balancing", "load balancer explained"],
        ["CDN and cache-control headers", "cdn and cache control headers"]
      ),
      [P("Valid Parentheses", "valid-parentheses", "E"), P("Min Stack", "min-stack", "M"),
       P("Implement Queue using Stacks", "implement-queue-using-stacks", "E"), P("Implement Stack using Queues", "implement-stack-using-queues", "E"),
       P("Evaluate Reverse Polish Notation", "evaluate-reverse-polish-notation", "M"), P("Daily Temperatures", "daily-temperatures", "M"),
       P("Next Greater Element I", "next-greater-element-i", "E"), P("Next Greater Element II", "next-greater-element-ii", "M"),
       P("Asteroid Collision", "asteroid-collision", "M"), P("Car Fleet", "car-fleet", "M"),
       P("Remove K Digits", "remove-k-digits", "M"), P("Decode String", "decode-string", "M")],
      P("Largest Rectangle in Histogram", "largest-rectangle-in-histogram", "H"),
      ["Validation: @Valid + constraints, return 400 on bad input",
       "@ControllerAdvice: one global handler, clean JSON errors",
       "Pagination + sorting with Pageable on your list endpoint"],
      ["CHECKPOINT 2 — 3 problems in 90 min + 10 CS questions out loud",
       "Send 5 applications this week — 5, not 5 drafts"],
      "HARDEN — pagination, sorting, error handling, DTOs everywhere, no stack traces leaking."),

    W(9, "Trees I", "OOP + Java",
      cs6(
        ["The four pillars, with real examples", "oop four pillars explained java"],
        ["Abstract class vs interface", "abstract class vs interface java"],
        ["Overloading vs overriding", "method overloading vs overriding java"],
        ["SOLID principles", "solid principles explained java"],
        ["Composition over inheritance", "composition over inheritance explained"],
        ["UML class diagram basics", "uml class diagram basics"]
      ),
      [P("Binary Tree Inorder Traversal", "binary-tree-inorder-traversal", "E"), P("Maximum Depth of Binary Tree", "maximum-depth-of-binary-tree", "E"),
       P("Same Tree", "same-tree", "E"), P("Invert Binary Tree", "invert-binary-tree", "E"),
       P("Balanced Binary Tree", "balanced-binary-tree", "E"), P("Diameter of Binary Tree", "diameter-of-binary-tree", "E"),
       P("Binary Tree Level Order Traversal", "binary-tree-level-order-traversal", "M"), P("Binary Tree Right Side View", "binary-tree-right-side-view", "M"),
       P("Binary Tree Zigzag Level Order Traversal", "binary-tree-zigzag-level-order-traversal", "M"), P("Minimum Depth of Binary Tree", "minimum-depth-of-binary-tree", "E"),
       P("Path Sum", "path-sum", "E"), P("Symmetric Tree", "symmetric-tree", "E")],
      P("Serialize and Deserialize Binary Tree", "serialize-and-deserialize-binary-tree", "H"),
      ["Spring Security: add it, understand the filter chain",
       "JWT: signup + login endpoints returning a token",
       "Role-based access with @PreAuthorize on one endpoint"],
      ["5 LinkedIn referral DMs to CU alumni — one line + repo link",
       "Aptitude: 2 × 30 min on IndiaBix (quant + logical)"],
      "AUTH — JWT signup/login, roles, protected routes, hashed passwords."),

    W(10, "Trees II + BST", "OOP + Java",
      cs6(
        ["ArrayList internals", "java arraylist internal working"],
        ["HashMap internals — the interview favourite", "java hashmap internal working interview"],
        ["String pool and immutability", "java string pool immutability"],
        ["equals() and hashCode() contract", "java equals hashcode contract"],
        ["Checked vs unchecked exceptions", "checked vs unchecked exceptions java"],
        ["Garbage collection basics", "java garbage collection explained"]
      ),
      [P("Validate Binary Search Tree", "validate-binary-search-tree", "M"), P("Kth Smallest Element in a BST", "kth-smallest-element-in-a-bst", "M"),
       P("Lowest Common Ancestor of a BST", "lowest-common-ancestor-of-a-binary-search-tree", "E"), P("Lowest Common Ancestor of a Binary Tree", "lowest-common-ancestor-of-a-binary-tree", "M"),
       P("Construct Binary Tree from Preorder and Inorder Traversal", "construct-binary-tree-from-preorder-and-inorder-traversal", "M"), P("Binary Tree Maximum Path Sum", "binary-tree-maximum-path-sum", "H"),
       P("Sum Root to Leaf Numbers", "sum-root-to-leaf-numbers", "M"), P("Flatten Binary Tree to Linked List", "flatten-binary-tree-to-linked-list", "M"),
       P("Binary Search Tree Iterator", "binary-search-tree-iterator", "M"), P("Delete Node in a BST", "delete-node-in-a-bst", "M"),
       P("Insert into a Binary Search Tree", "insert-into-a-binary-search-tree", "M"), P("Convert Sorted Array to Binary Search Tree", "convert-sorted-array-to-binary-search-tree", "E")],
      P("Binary Tree Cameras", "binary-tree-cameras", "H"),
      ["Logging: SLF4J at info/debug, log the request and response",
       "Profiles: application-dev vs application-prod",
       "Lombok: remove boilerplate, know what it generates"],
      ["Aptitude: 2 sessions (IndiaBix + PrepInsta patterns)",
       "Resume v3 — every bullet gets a number"],
      "OBSERVABILITY — logging, profiles, config, delete dead code."),

    /* ---------------- PHASE B: depth ---------------- */
    W(11, "Heaps", "DBMS advanced",
      cs6(
        ["Sharding vs partitioning", "database sharding vs partitioning"],
        ["Replication and read replicas", "database replication master slave"],
        ["CAP theorem", "cap theorem explained"],
        ["ORM vs raw SQL — the tradeoff", "orm vs raw sql performance"],
        ["Connection pooling", "database connection pooling explained"],
        ["Design a schema for a real feature", "database schema design interview"]
      ),
      [P("Top K Frequent Elements", "top-k-frequent-elements", "M"), P("Top K Frequent Words", "top-k-frequent-words", "M"),
       P("K Closest Points to Origin", "k-closest-points-to-origin", "M"), P("Last Stone Weight", "last-stone-weight", "E"),
       P("Sort Characters By Frequency", "sort-characters-by-frequency", "M"), P("Kth Smallest Element in a Sorted Matrix", "kth-smallest-element-in-a-sorted-matrix", "M"),
       P("Reorganize String", "reorganize-string", "M"), P("Task Scheduler", "task-scheduler", "M"),
       P("Merge k Sorted Lists", "merge-k-sorted-lists", "H"), P("Find Median from Data Stream", "find-median-from-data-stream", "H"),
       P("Furthest Building You Can Reach", "furthest-building-you-can-reach", "M"), P("Single-Threaded CPU", "single-threaded-cpu", "M")],
      P("IPO", "ipo", "H"),
      ["JUnit 5: three unit tests for a service method",
       "Mockito: mock a repository in a service test",
       "MockMvc: one integration test hitting your controller"],
      ["Deploy project to a live URL; put the link in README",
       "Send 10 applications this week"],
      "TESTS — 5 unit tests + 1 integration test. Coverage doesn't matter; confidence does."),

    W(12, "Greedy", "OS + Linux in practice",
      cs6(
        ["Linux commands every developer needs", "essential linux commands developers"],
        ["File permissions and chmod", "linux file permissions chmod"],
        ["ps, top, lsof, kill — find and stop a process", "linux ps top lsof kill commands"],
        ["Race conditions in real code", "race condition example java"],
        ["Java threads: the basics", "java threads tutorial basics"],
        ["Memory leaks and profiling", "java memory leak profiling"]
      ),
      [P("Jump Game", "jump-game", "M"), P("Jump Game II", "jump-game-ii", "M"),
       P("Gas Station", "gas-station", "M"), P("Partition Labels", "partition-labels", "M"),
       P("Non-overlapping Intervals", "non-overlapping-intervals", "M"), P("Minimum Number of Arrows to Burst Balloons", "minimum-number-of-arrows-to-burst-balloons", "M"),
       P("Queue Reconstruction by Height", "queue-reconstruction-by-height", "M"), P("Candy", "candy", "H"),
       P("Best Time to Buy and Sell Stock II", "best-time-to-buy-and-sell-stock-ii", "M"), P("Maximum Product Subarray", "maximum-product-subarray", "M"),
       P("Can Place Flowers", "can-place-flowers", "E"), P("Lemonade Change", "lemonade-change", "E")],
      P("Assign Cookies", "assign-cookies", "E"),
      ["mvn clean package, then run the jar with java -jar",
       "GitHub Actions: run tests on every push",
       "Env vars + PORT: make the app configurable, redeploy"],
      ["CHECKPOINT 3 — 3 problems in 90 min + 1 mock",
       "Aptitude 2x this week; 10 applications"],
      "DEPLOY — live URL, env vars, CI on push, README has a demo GIF."),

    W(13, "Graphs I", "Networking for backend",
      cs6(
        ["REST vs GraphQL", "rest vs graphql"],
        ["WebSockets vs polling", "websockets vs polling"],
        ["Idempotency and safe retries", "idempotency in rest apis"],
        ["Rate limiting algorithms", "rate limiting algorithms"],
        ["Reverse proxy vs forward proxy", "reverse proxy vs forward proxy"],
        ["TLS handshake in detail", "tls handshake explained"]
      ),
      [P("Number of Islands", "number-of-islands", "M"), P("Max Area of Island", "max-area-of-island", "M"),
       P("Clone Graph", "clone-graph", "M"), P("Rotting Oranges", "rotting-oranges", "M"),
       P("Number of Provinces", "number-of-provinces", "M"), P("Surrounded Regions", "surrounded-regions", "M"),
       P("Pacific Atlantic Water Flow", "pacific-atlantic-water-flow", "M"), P("Course Schedule", "course-schedule", "M"),
       P("Course Schedule II", "course-schedule-ii", "M"), P("Find Eventual Safe States", "find-eventual-safe-states", "M"),
       P("Redundant Connection", "redundant-connection", "M"), P("Network Delay Time", "network-delay-time", "M")],
      P("Word Ladder", "word-ladder", "H"),
      ["Dockerfile for the Spring Boot app; build and run the image",
       "docker-compose: app + MySQL together with volumes",
       "Nginx reverse proxy in front of the app (optional, great to explain)"],
      ["10 applications; 1 mock interview",
       "Write down 3 bugs you fixed and how — interview gold"],
      "DOCKER — Dockerfile + compose. Be able to explain it in one paragraph."),

    W(14, "Graphs II", "Low-level design",
      cs6(
        ["SOLID in real code, not slides", "solid principles real code example"],
        ["Strategy pattern", "strategy design pattern java"],
        ["Factory pattern", "factory design pattern java"],
        ["Observer pattern", "observer design pattern java"],
        ["Singleton and Builder", "singleton builder pattern java"],
        ["Design a parking lot (LLD)", "parking lot low level design"]
      ),
      [P("Is Graph Bipartite?", "is-graph-bipartite", "M"), P("Possible Bipartition", "possible-bipartition", "M"),
       P("Keys and Rooms", "keys-and-rooms", "M"), P("All Paths From Source to Target", "all-paths-from-source-to-target", "M"),
       P("01 Matrix", "01-matrix", "M"), P("Shortest Path in Binary Matrix", "shortest-path-in-binary-matrix", "M"),
       P("Reorder Routes to Make All Paths Lead to the City Zero", "reorder-routes-to-make-all-paths-lead-to-the-city-zero", "M"), P("Accounts Merge", "accounts-merge", "M"),
       P("Min Cost to Connect All Points", "min-cost-to-connect-all-points", "M"), P("Cheapest Flights Within K Stops", "cheapest-flights-within-k-stops", "M"),
       P("Path with Maximum Probability", "path-with-maximum-probability", "M"), P("Critical Connections in a Network", "critical-connections-in-a-network", "H")],
      P("Word Ladder II", "word-ladder-ii", "H"),
      ["Redis basics: cache one endpoint with Spring Cache",
       "@Scheduled: a daily job that logs a summary",
       "@Async: move a slow task off the request thread"],
      ["10 applications; 1 mock; research 5 target companies properly",
       "Prepare 3 project stories: problem → design → tradeoff → what you'd change"],
      "FEATURE 3 — caching or a scheduled job. Measure before/after."),

    W(15, "Dynamic programming I", "High-level design basics",
      cs6(
        ["Scaling from 0 to millions of users", "system design basics scaling"],
        ["Caching strategies (cache-aside, write-through)", "caching strategies system design"],
        ["Message queues", "message queue system design"],
        ["Consistent hashing", "consistent hashing explained"],
        ["Design a URL shortener", "design url shortener system design"],
        ["Design a rate limiter", "design rate limiter system design"]
      ),
      [P("Fibonacci Number", "fibonacci-number", "E"), P("Min Cost Climbing Stairs", "min-cost-climbing-stairs", "E"),
       P("House Robber", "house-robber", "M"), P("House Robber II", "house-robber-ii", "M"),
       P("Coin Change", "coin-change", "M"), P("Coin Change II", "coin-change-ii", "M"),
       P("Unique Paths", "unique-paths", "M"), P("Unique Paths II", "unique-paths-ii", "M"),
       P("Longest Increasing Subsequence", "longest-increasing-subsequence", "M"), P("Word Break", "word-break", "M"),
       P("Decode Ways", "decode-ways", "M"), P("Partition Equal Subset Sum", "partition-equal-subset-sum", "M")],
      P("Target Sum", "target-sum", "M"),
      ["File upload endpoint + serve the file back",
       "Rate limiting with Bucket4j on one endpoint",
       "API versioning + one consistent error envelope"],
      ["10 applications; 1 mock",
       "Aptitude: 2 sessions — service-company tests are next semester"],
      "POLISH — Swagger docs, rate limiting, architecture diagram you drew yourself."),

    W(16, "Dynamic programming II", "Revision: DBMS + OS",
      cs6(
        ["DBMS rapid fire 1 — normalization, keys, indexes", "dbms interview questions freshers"],
        ["DBMS rapid fire 2 — transactions, ACID, isolation", "dbms transactions interview questions"],
        ["DBMS rapid fire 3 — SQL queries, joins, optimisation", "sql interview questions answers"],
        ["OS rapid fire 1 — process, thread, scheduling", "operating system interview questions freshers"],
        ["OS rapid fire 2 — deadlock, synchronization", "deadlock interview questions os"],
        ["OS rapid fire 3 — memory, paging, virtual memory", "paging virtual memory interview questions"]
      ),
      [P("Longest Common Subsequence", "longest-common-subsequence", "M"), P("Edit Distance", "edit-distance", "M"),
       P("Longest Palindromic Subsequence", "longest-palindromic-subsequence", "M"), P("Perfect Squares", "perfect-squares", "M"),
       P("Integer Break", "integer-break", "M"), P("Triangle", "triangle", "M"),
       P("Minimum Path Sum", "minimum-path-sum", "M"), P("Maximal Square", "maximal-square", "M"),
       P("Longest Increasing Path in a Matrix", "longest-increasing-path-in-a-matrix", "H"), P("Best Time to Buy and Sell Stock with Cooldown", "best-time-to-buy-and-sell-stock-with-cooldown", "M"),
       P("Distinct Subsequences", "distinct-subsequences", "H"), P("House Robber III", "house-robber-iii", "M")],
      P("Regular Expression Matching", "regular-expression-matching", "H"),
      ["Project 2: pick a smaller idea, spec it in 30 minutes",
       "Project 2: build the core endpoint",
       "Project 2: connect the DB and deploy the skeleton early"],
      ["CHECKPOINT 4 — full mock loop: DSA + CS + project",
       "15 applications this week"],
      "PROJECT 2 — start a second, smaller service. Two live projects > one perfect one."),

    W(17, "Tries, bits & math", "Revision: CN + OOP",
      cs6(
        ["CN rapid fire 1 — OSI, TCP/UDP, handshake", "computer networks interview questions freshers"],
        ["CN rapid fire 2 — HTTP, DNS, status codes", "http dns interview questions"],
        ["CN rapid fire 3 — HTTPS, CORS, load balancing", "https cors load balancing interview"],
        ["OOP rapid fire 1 — pillars, interface vs abstract", "oop interview questions java"],
        ["OOP rapid fire 2 — collections internals", "java collections interview questions"],
        ["OOP rapid fire 3 — exceptions, equals/hashCode, GC", "java exceptions equals hashcode interview questions"]
      ),
      [P("Implement Trie (Prefix Tree)", "implement-trie-prefix-tree", "M"), P("Design Add and Search Words Data Structure", "design-add-and-search-words-data-structure", "M"),
       P("Replace Words", "replace-words", "M"), P("Reverse Bits", "reverse-bits", "E"),
       P("Counting Bits", "counting-bits", "E"), P("Single Number II", "single-number-ii", "M"),
       P("Single Number III", "single-number-iii", "M"), P("Power of Two", "power-of-two", "E"),
       P("Count Primes", "count-primes", "M"), P("Happy Number", "happy-number", "E"),
       P("Excel Sheet Column Number", "excel-sheet-column-number", "E"), P("Reverse Integer", "reverse-integer", "M")],
      P("Maximum XOR of Two Numbers in an Array", "maximum-xor-of-two-numbers-in-an-array", "M"),
      ["Project 2: finish features + tests",
       "Project 2: deploy + README + demo GIF",
       "Record a 2-minute demo video of both projects"],
      ["15 applications; 2 mocks",
       "HR prep: tell me about yourself, why this company, strengths, weakness, 5-year plan"],
      "SHIP BOTH — both projects live, both with READMEs and demo GIFs.")
  ];

  /* ============================================================
     PART 3 — WEEKS 18-20: sprint / proof
     ============================================================ */
  var SPRINTS = [
    {
      n: 18, theme: "Repair week — fix what the tests exposed", cs: "Weak topics",
      days: [
        { t: "Repair: arrays, hashing, two pointers", i: [
          { type: "review", title: "Re-solve 6 problems from these topics — cold, timed", hint: "Pick the ones you got wrong, not the ones that felt good." },
          { type: "theory", title: "Rewrite your 10 weakest DBMS answers in your own words", hint: "3 lines each. No copy-paste." },
          { type: "dev", title: "Add an eval suite to your agent: 15 golden Q&A pairs, run before every change", hint: "No eval, no product. This is what separates you from every other AI project on GitHub." }
        ]},
        { t: "Repair: strings, binary search", i: [
          { type: "review", title: "Re-solve 6 problems from these topics — cold", hint: "If it takes 2 minutes because you memorised it, pick another." },
          { type: "theory", title: "Compress every CS topic into a 1-page cheat sheet", hint: "If you can't fit it on a page, you don't understand it yet." },
          { type: "career", title: "Send 15 applications" }
        ]},
        { t: "Repair: linked list, stack, queue", i: [
          { type: "review", title: "Re-solve 6 problems from these topics — cold" },
          { type: "theory", title: "Rewrite your weakest OS answers" },
          { type: "dev", title: "Break your own agent: 10 adversarial prompts (injection, off-topic, tool misuse), patch 3" }
        ]},
        { t: "Repair: trees and BST", i: [
          { type: "review", title: "Re-solve 6 tree problems — cold" },
          { type: "career", title: "Book 2 mocks for next week and 1 for this week" },
          { type: "dev", title: "Refactor the retrieval layer; measure hit-rate before and after" }
        ]},
        { t: "Repair: heaps, greedy", i: [
          { type: "review", title: "Re-solve 6 problems from these topics — cold" },
          { type: "theory", title: "Rewrite your weakest CN answers" },
          { type: "career", title: "Update resume with both projects + live links" }
        ]},
        { t: "Repair: graphs and DP", i: [
          { type: "review", title: "Re-solve 6 graph/DP problems — cold" },
          { type: "theory", title: "Explain Docker, JWT and indexing out loud in 2 minutes each", hint: "Record yourself. It's the fastest way to find the gaps." },
          { type: "career", title: "10 more applications" }
        ]},
        { t: "Timed test + week review", i: [
          { type: "review", title: "Full mock test: 3 unseen problems, 90 minutes, no help" },
          { type: "review", title: "Log what broke and schedule the repair for week 19" }
        ]}
      ]
    },
    {
      n: 19, theme: "Mock marathon — 5 interviews in 7 days", cs: "Interview mode",
      days: [
        { t: "Mock 1 — DSA focus", i: [
          { type: "career", title: "Mock interview #1 (Pramp or a senior)" },
          { type: "review", title: "Re-solve the 2 problems you fumbled, immediately" },
          { type: "dev", title: "Rehearse the AI project walkthrough: problem, design, evals, failure modes", hint: "3 minutes, no notes, recorded." }
        ]},
        { t: "Mock 2 — CS fundamentals", i: [
          { type: "career", title: "Mock interview #2 — ask them to grill you on DBMS/OS/CN" },
          { type: "theory", title: "Answer 20 rapid-fire questions out loud, no notes" }
        ]},
        { t: "Mock 3 — project deep dive", i: [
          { type: "career", title: "Mock #3: they only ask about your project for 30 minutes" },
          { type: "project", title: "Write your project story: problem → design → tradeoff → what I'd change" }
        ]},
        { t: "Mock 4 — HR round", i: [
          { type: "career", title: "Mock #4: HR only. Tell me about yourself, weakness, why us" },
          { type: "career", title: "Write final answers to the 5 standard HR questions" }
        ]},
        { t: "Mock 5 — full loop", i: [
          { type: "career", title: "Mock #5: one full loop, end to end" },
          { type: "career", title: "20 applications" }
        ]},
        { t: "Gap fixing", i: [
          { type: "review", title: "Fix the top 3 gaps the mocks exposed — nothing else" },
          { type: "theory", title: "Re-read your own cheat sheets; you'll spot 5 wrong things" }
        ]},
        { t: "Rest and review", i: [
          { type: "review", title: "Write your mock-interview retrospective in plan.md" }
        ]}
      ]
    },
    {
      n: 20, theme: "Ship it — portfolio, contests, handoff", cs: "Final polish",
      days: [
        { t: "Portfolio day", i: [
          { type: "career", title: "Resume v4 — 1 page, both projects, live links, numbers" },
          { type: "dev", title: "GitHub profile README + pinned AI projects, each with its eval score" },
          { type: "career", title: "LinkedIn featured section: both live demos" }
        ]},
        { t: "Contest day", i: [
          { type: "review", title: "Two timed contests back to back (90 min each)" },
          { type: "review", title: "Upsolve the 2 problems you couldn't finish" }
        ]},
        { t: "Project audit", i: [
          { type: "project", title: "Both links work, both READMEs complete, both have a demo GIF" },
          { type: "project", title: "Open each project cold and try to break it — fix one thing" }
        ]},
        { t: "Volume day", i: [
          { type: "career", title: "20 applications + 5 referral DMs" },
          { type: "career", title: "Follow up on every application older than 10 days" }
        ]},
        { t: "Handoff day", i: [
          { type: "career", title: "Write your Phase 3 plan (May → Aug): DP depth, 2 mocks/week, 10 apps/week" },
          { type: "theory", title: "Pick the 3 CS topics you're still weakest at and schedule them" }
        ]},
        { t: "Final mock", i: [
          { type: "career", title: "One final full mock — you should feel the difference from week 1" }
        ]},
        { t: "Done", i: [
          { type: "review", title: "12-week retrospective is now a 20-week one. Write it. Then take a day off." }
        ]}
      ]
    }
  ];

  /* ---------- build 140 plan days ---------- */
  var planDays = [];
  var dayCounter = 0;

  WEEKS.forEach(function (w) {
    var weekStart = addDaysISO(PLAN_START, (w.n - 1) * 7);
    for (var d = 0; d < 7; d++) {
      var date = addDaysISO(weekStart, d);
      dayCounter++;
      var items = [];

      if (d < 6) {
        var p1 = w.problems[d * 2];
        var p2 = w.problems[d * 2 + 1];

        items.push({
          id: date + "-p1", type: "dsa", title: p1.title, url: p1.url, diff: p1.diff,
          hint: "45 min alone → 20 min learning → rewrite from scratch, editor closed."
        });
        if (p2) items.push({
          id: date + "-p2", type: "dsa", title: p2.title, url: p2.url, diff: p2.diff,
          hint: "Second problem. Past 45 minutes? Read the solution. Don't burn the day."
        });

        var ct = w.csTopics[d];
        if (ct) items.push({
          id: date + "-cs", type: "theory",
          title: w.cs + " — " + ct[0], url: yt(ct[1]),
          hint: "30 min. Then write 5 lines in your own words. Reading is not studying."
        });

        if ((d === 0 || d === 2 || d === 4) && w.dev[Math.floor(d / 2)]) {
          items.push({ id: date + "-dev", type: "dev", title: w.dev[Math.floor(d / 2)], hint: "45 min. Commit and push before you sleep." });
        }
        if (d === 3 && w.project) {
          items.push({ id: date + "-proj", type: "project", title: w.project, hint: "60–90 min. This is the thing that gets you shortlisted when DSA is equal." });
        }
        if ((d === 1 || d === 5) && w.career[d === 1 ? 0 : 1]) {
          items.push({ id: date + "-car", type: "career", title: w.career[d === 1 ? 0 : 1], hint: "15–20 min. Don't skip these — they're the difference between prepared and placed." });
        }
      } else {
        var first3 = w.problems.slice(0, 3).map(function (p) { return p.title; }).join(" · ");
        items.push({
          id: date + "-r1", type: "review",
          title: "Re-solve 3 problems from this week — cold, no hints",
          hint: first3
        });
        if (w.stretch) items.push({
          id: date + "-st", type: "stretch", title: w.stretch.title, url: w.stretch.url, diff: w.stretch.diff,
          hint: "Optional but recommended. 30 minutes of struggle beats 3 easy wins."
        });
        items.push({
          id: date + "-r2", type: "review",
          title: "Weekly review: 3 lines in plan.md — what clicked, what didn't, what I redo",
          hint: "10 minutes. Highest-ROI habit on this whole site."
        });
      }

      planDays.push({
        n: dayCounter, week: w.n, date: date,
        title: "Week " + w.n + " · " + w.theme,
        time: d === 6 ? "~2h" : "~2h 45m",
        revision: d === 6,
        items: items
      });
    }
  });

  SPRINTS.forEach(function (s) {
    var weekStart = addDaysISO(PLAN_START, (s.n - 1) * 7);
    for (var d = 0; d < 7; d++) {
      var date = addDaysISO(weekStart, d);
      dayCounter++;
      var day = s.days[d];
      planDays.push({
        n: dayCounter, week: s.n, date: date,
        title: "Week " + s.n + " · " + day.t,
        time: "~3h",
        revision: d === 6,
        sprint: true,
        items: day.i.map(function (it, k) {
          return {
            id: date + "-s" + k, type: it.type, title: it.title,
            url: it.url || null, diff: it.diff || null, hint: it.hint || null
          };
        })
      });
    }
  });

  /* ============================================================
     DEV TRACK
     ============================================================ */
  var DEV = {
    thesis: "Agentic AI is hireable — but only when you can show a system that runs, an eval that proves it works, and a deployed endpoint somebody else can call. Prompt wrappers get filtered out in round one. <b>Agents + retrieval + evals + a live API</b> is the shape that gets interviews.",
    why: [
      ["Why Python, not Java, for this", "Every model SDK, vector DB and agent framework is Python-first. Keep Java for DSA and SDE interviews; use Python for AI. Two languages is normal, not a problem."],
      ["Why build the ReAct loop by hand first", "Anyone can drag nodes in LangGraph. Interviewers ask what happens between tool call 1 and 2 — the loop, the state, the stopping condition. Build it raw in week 10 and the framework becomes obvious."],
      ["Why evals are the whole game", "A demo and a product differ by one thing: can you measure it. A golden dataset plus LLM-as-judge plus a regression run before every deploy is the strongest signal that you've shipped AI seriously."],
      ["Why deploy early", "A live URL with a working agent beats a notebook every time. Deploy in week 12, not week 20."],
      ["Why guardrails matter", "Prompt injection, tool misuse, PII leakage and cost blowups are the real failure modes. Talking about them credibly puts you above almost every other fresher."],
      ["Why RAG before fine-tuning", "RAG fixes knowledge, fine-tuning fixes behaviour. 95% of fresher AI project problems are actually RAG problems. Fine-tuning is a week-18 topic, not a week-3 one."]
    ],
    skip: [
      "Training a model from scratch. You're not being hired as a researcher; you're hired to ship.",
      "Fine-tuning before you can build one working RAG pipeline end to end.",
      "Collecting eight agent frameworks. The raw SDK plus LangGraph is enough.",
      "Prompt engineering courses. You learn prompting by breaking prompts, not watching slides.",
      "AI Twitter. It will make you feel behind and teach you nothing.",
      "Blockchain / Web3 / AR detours.",
      "Paid bootcamps. Everything in this plan is free."
    ],
    stack: ["Python 3.12", "FastAPI", "Pydantic", "OpenAI / Anthropic / Gemini SDK", "LangGraph", "Chroma / pgvector", "Langfuse", "Docker", "Redis", "GitHub Actions", "Render / Railway"],
    projects: [
      { name: "P1 — agentic RAG assistant (weeks 5-13)", d: "Documents in, retrieval, 3 tools (search / calculator / database), citations, guardrails, an eval suite, FastAPI plus a minimal UI, deployed. This is your 30-minute interview." },
      { name: "P2 — domain agent + eval report (weeks 16-17)", d: "A narrow agent for one job, with a 30-case eval set and a score you can quote out loud. Proves P1 was not a one-off." }
    ]
  };

  var DEV_WEEKS = [
    [1, "Python for a Java dev: types, dicts, comprehensions, venv", "Three small scripts that actually run"],
    [2, "Files, JSON, HTTP, .env, .gitignore for Python", "A CLI that calls a public API and prints clean output"],
    [3, "Your first LLM call: messages, tokens, streaming, cost", "A script that answers a question and reports token usage"],
    [4, "Prompting + structured output (Pydantic)", "The model returns JSON that validates, every time"],
    [5, "Embeddings + cosine similarity from scratch", "Semantic search over 20 sentences, no library magic"],
    [6, "Chunking and document loading", "A chunker for 3 file types, with overlap"],
    [7, "Vector DB: Chroma or pgvector, metadata filters", "Top-k retrieval with filtering that works"],
    [8, "Retrieval quality: hybrid search, reranking, citations", "A measured hit-rate improvement you can defend"],
    [9, "Tool / function calling with JSON schemas", "One tool the model reliably chooses to use"],
    [10, "Build the ReAct loop by hand, no framework", "An agent with 3 tools and a hard stop condition"],
    [11, "LangGraph: state, nodes, edges, conditional routing", "The same agent, rebuilt as a graph"],
    [12, "Memory, human-in-the-loop, then deploy P1", "A live agent URL you can send to anyone"],
    [13, "FastAPI properly: async, streaming, background tasks", "A production-shaped API, not a toy endpoint"],
    [14, "Evals: golden set, LLM-as-judge, tracing", "A scoreboard that runs on every change"],
    [15, "Guardrails: injection, PII, tool sandboxing, cost caps", "An attack report you wrote yourself"],
    [16, "Docker + GitHub Actions + start P2", "One command brings it up; tests run on push"],
    [17, "P2: finish, deploy, write the eval report", "Two live projects, two scorecards"],
    [18, "Break your own agent on purpose", "10 adversarial cases, 3 fixed, documented"],
    [19, "AI-assisted development, honestly", "You can explain every line an assistant wrote"],
    [20, "Portfolio: README, numbers, demo video", "A recruiter understands you in 90 seconds"]
  ];

  /* ============================================================
     CS / RESOURCES / RULES / MILESTONES
     ============================================================ */
  var CS = [
    {
      name: "DBMS + SQL", when: "Weeks 1–4, revised in 11 and 16",
      topics: ["ER model & keys", "Normalization 1NF–BCNF", "Indexes & B+ trees", "Transactions & ACID", "Isolation levels", "Joins", "GROUP BY / HAVING", "Subqueries & CTEs", "Window functions", "Sharding vs partitioning", "Replication", "CAP", "N+1 problem", "Connection pooling"],
      links: [
        { label: "Gate Smashers — DBMS", url: yt("gate smashers dbms full course") },
        { label: "LeetCode SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/" },
        { label: "SQLBolt", url: "https://sqlbolt.com/" },
        { label: "GfG DBMS", url: "https://www.geeksforgeeks.org/dbms/" }
      ]
    },
    {
      name: "Operating Systems", when: "Weeks 5–6, revised in 12 and 16",
      topics: ["Process vs thread", "States & context switch", "Scheduling (FCFS/SJF/RR)", "Mutex vs semaphore", "Deadlock + Banker's", "Paging vs segmentation", "Virtual memory", "Page replacement", "Thrashing", "File systems", "System calls, fork/exec", "Race conditions", "Memory leaks"],
      links: [
        { label: "Gate Smashers — OS", url: yt("gate smashers operating system full course") },
        { label: "GfG OS", url: "https://www.geeksforgeeks.org/operating-systems/" }
      ]
    },
    {
      name: "Computer Networks", when: "Weeks 7–8, revised in 13 and 17",
      topics: ["OSI vs TCP/IP", "TCP vs UDP", "3-way handshake", "HTTP vs HTTPS / TLS", "DNS", "URL lifecycle", "Methods & status codes", "Cookies/sessions/JWT", "REST principles", "CORS", "Load balancing", "CDN & caching", "WebSockets", "Idempotency", "Rate limiting"],
      links: [
        { label: "Gate Smashers — CN", url: yt("gate smashers computer networks full course") },
        { label: "GfG CN", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
        { label: "MDN HTTP status codes", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" }
      ]
    },
    {
      name: "OOP + Java internals", when: "Weeks 9–10, revised in 17",
      topics: ["4 pillars with examples", "Abstract vs interface", "Overloading vs overriding", "SOLID", "Composition vs inheritance", "UML basics", "ArrayList internals", "HashMap internals", "String pool", "equals/hashCode", "Exceptions", "Generics", "GC basics", "Threads basics"],
      links: [
        { label: "Java Brains — OOP", url: yt("java brains object oriented programming") },
        { label: "Collections internals", url: yt("java collections framework internals interview") },
        { label: "Baeldung", url: "https://www.baeldung.com/" }
      ]
    },
    {
      name: "LLD + HLD basics", when: "Weeks 14–15 (+ week 18 in code)",
      topics: ["Strategy", "Factory", "Observer", "Singleton & Builder", "Parking lot LLD", "Load balancer", "Caching strategies", "Message queues", "Consistent hashing", "URL shortener", "Rate limiter design", "CAP in practice"],
      links: [
        { label: "Design patterns in Java", url: yt("design patterns java tutorial") },
        { label: "System design basics", url: yt("system design basics for beginners") },
        { label: "ByteByteGo", url: "https://bytebytego.com/" }
      ]
    },
    {
      name: "AI / LLM fundamentals", when: "Weeks 3-17, and in every AI interview",
      topics: ["Tokens and context windows", "Transformer intuition (not the math)", "Embeddings and cosine similarity", "RAG vs fine-tuning", "Why hallucination happens", "Tool / function calling", "ReAct and agent loops", "Evals and LLM-as-judge", "Prompt injection", "Latency vs cost tradeoffs", "Vector DB indexing", "Guardrails", "MCP basics"],
      links: [
        { label: "What is RAG", url: yt("what is retrieval augmented generation explained") },
        { label: "Transformers, intuitively", url: yt("transformers explained intuition no math") },
        { label: "ReAct explained", url: yt("react agent paper explained") },
        { label: "LLM evals", url: yt("how to evaluate llm applications evals") },
        { label: "Prompt injection", url: yt("prompt injection explained llm security") }
      ]
    }
  ];

  var RESOURCES = [
    { group: "DSA — one sheet, no switching",
      items: [
        { label: "Striver A2Z", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", note: "Free, Java code, follows this plan's order." },
        { label: "NeetCode 150", url: "https://neetcode.io/practice", note: "Only when stuck on a pattern. Best explanations." },
        { label: "LeetCode", url: "https://leetcode.com/problemset/", note: "Where you submit. Free tier is enough." }
      ] },
    { group: "CS fundamentals",
      items: [
        { label: "Gate Smashers", url: yt("gate smashers dbms os cn full course"), note: "Fastest path to interview-grade OS/DBMS/CN in India." },
        { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/", note: "Reference, not a course." },
        { label: "SQLBolt", url: "https://sqlbolt.com/", note: "Interactive SQL in ~2 hours. Do it before SQL 50." },
        { label: "LeetCode SQL 50", url: "https://leetcode.com/studyplan/top-sql-50/" }
      ] },
    { group: "Dev — the backend stack",
      items: [
        { label: "Spring Initializr", url: "https://start.spring.io/", note: "Generate a project in 30 seconds." },
        { label: "Spring Guides", url: "https://spring.io/guides", note: "Official, short, correct. Skip random playlists." },
        { label: "Baeldung", url: "https://www.baeldung.com/", note: "The reference for every Spring/JPA question you'll have." },
        { label: "Docker docs — get started", url: "https://docs.docker.com/get-started/", note: "Two hours here is worth a resume line." },
        { label: "Render", url: "https://render.com/", note: "Free deploy for Spring Boot. Sleeps when idle — warm it before interviews." },
        { label: "Railway", url: "https://railway.app/", note: "Alternative, with a MySQL add-on." }
      ] },
    { group: "Aptitude — TCS / Infosys / Accenture / Wipro",
      items: [
        { label: "IndiaBix", url: "https://www.indiabix.com/", note: "Pattern-matched to NQT." },
        { label: "PrepInsta", url: "https://prepinsta.com/", note: "Company-wise previous papers. Very accurate." }
      ] },
    { group: "Applying",
      items: [
        { label: "Unstop", url: "https://unstop.com/", note: "Highest conversion for Indian students." },
        { label: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/", note: "Use it for referrals, not blind applies." },
        { label: "Wellfound", url: "https://wellfound.com/", note: "Startups — your most realistic summer internship source." },
        { label: "Internshala", url: "https://internshala.com/", note: "Volume spray. Low quality, but volume." },
        { label: "Naukri", url: "https://www.naukri.com/", note: "Set fresher alerts." },
        { label: "Cuvette", url: "https://cuvette.tech/", note: "Fresher-focused." }
      ] },
    { group: "Company portals — register early, windows close silently",
      items: [
        { label: "TCS NextStep", url: "https://nextstep.tcs.com/" },
        { label: "Infosys Careers", url: "https://career.infosys.com/" },
        { label: "Wipro Careers", url: "https://careers.wipro.com/" },
        { label: "Accenture India", url: "https://www.accenture.com/in-en/careers" },
        { label: "Cognizant Careers", url: "https://careers.cognizant.com/global/en" },
        { label: "Capgemini India", url: "https://www.capgemini.com/in-en/careers/" }
      ] },
    { group: "Mocks",
      items: [
        { label: "Pramp", url: "https://www.pramp.com/", note: "Free peer mocks. Do 10+ before the real thing." },
        { label: "Excalidraw", url: "https://excalidraw.com/", note: "For LLD/HLD diagrams in mocks." }
      ] }
  ];

  var RULES = [
    "One sheet, one language, one stack. Switching plans is the #1 killer.",
    "45 min alone → 20 min learning → rewrite from scratch. Every problem.",
    "After week 6, revision beats new problems. 200 revised > 400 forgotten.",
    "Deploy in week 12, not week 20. A live link changes how people read your resume.",
    "5–10 applications every week from week 8. Volume with a quality floor.",
    "A collapsed day = do the smallest version (one easy problem). Never zero.",
    "CGPA floor 7.5, zero active backlogs. You have 7.65 — don't waste it.",
    "Speak English out loud 10 min/day. Good coders fail HR rounds here constantly.",
    "Don't buy a course. Everything on this site is free and better."
  ];

  var MILESTONES = [
    { when: "Week 4 · early Jan", checks: ["~48 problems", "Easy in ≤20 min, medium with a hint", "DBMS + SQL solid", "Git + HTML/CSS/JS basics", "Resume v1 live", "First 3 portals registered"] },
    { when: "Week 8 · early Feb", checks: ["~96 problems", "OS + CN solid", "Project CRUD deployed", "Resume v2 with project", "5 applications/week started", "1 mock done"] },
    { when: "Week 12 · early Mar", checks: ["~144 problems", "All 4 CS subjects", "JWT auth + tests", "Live URL", "Aptitude started", "10 applications/week"] },
    { when: "Week 16 · early Apr", checks: ["~192 problems", "DP + graphs solid", "Two projects live", "Docker + CI", "LLD basics", "15 applications/week"] },
    { when: "Week 20 · late Apr", checks: ["~210 problems, 60+ re-solved cold", "5+ mocks done", "Portfolio + demo video", "40+ applications", "HR answers written", "Phase 3 plan ready"] }
  ];

  window.CUDATA = {
    MOMENTUM_START: MOMENTUM_START, MOMENTUM_END: MOMENTUM_END,
    PLAN_START: PLAN_START, PLACEMENT_SEASON: PLACEMENT_SEASON,
    momentumDays: momentumDays,
    planDays: planDays,
    WEEKS: WEEKS, SPRINTS: SPRINTS,
    CS: CS, DEV: DEV, DEV_WEEKS: DEV_WEEKS,
    RESOURCES: RESOURCES, RULES: RULES, MILESTONES: MILESTONES,
    addDaysISO: addDaysISO, diffDays: diffDays
  };
})();
