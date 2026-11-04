# EduConnect Architecture Specification

## 1. System Overview & Strict Three-Tier Separation

EduConnect is engineered on a strict three-tier architecture ensuring logical and physical separation between Presentation, Business Logic, and Data Persistence.

```mermaid
graph TD
    subgraph "Tier 1: Presentation Layer (React + Vite + TypeScript)"
        UI[Tailwind CSS & UI/UX Pro Max]
        SPA[React 18 SPA / React Router v6]
        STATE[TanStack Query & React Context]
        CHARTS[Recharts Telemetry & Radar]
    end

    subgraph "Tier 2: Application / Logic Layer (Node.js + Express + TypeScript)"
        API[Express REST API & SSE Gateway]
        MW[Security Middleware: Helmet, CORS, Rate Limit, RBAC, Zod]
        CTRL[Controllers Layer]
        SERV[Services: Auth, ExamEngine, RAG Chatbot, Newsletter]
        REPO[Repository Pattern Layer]
        CRON[Background Tasks: node-cron Scheduler & Nodemailer]
    end

    subgraph "Tier 3: Data Layer (Prisma ORM + PostgreSQL / SQLite)"
        ORM[Prisma Schema & Migrations Engine]
        DB[(Relational DB: Users, Exams, MCQs, Attempts, Jobs, Resources, Audit)]
    end

    SPA -->|HTTPS / REST & SSE Stream| API
    API --> MW --> CTRL --> SERV --> REPO
    REPO -->|Type-Safe Queries| ORM
    ORM --> DB
    CRON -->|Async Jobs| SERV
```

### Architectural Tenets
1. **Zero Direct DB Access from Client:** The client never has database credentials or direct connections; all queries and mutations flow through Tier 2 endpoints.
2. **Layered Decoupling:** Tier 2 follows `Routes -> Middleware -> Controllers -> Services -> Repositories`. Business rules (e.g. negative marking penalties, peer percentile computation, domain allowlist enforcement) reside exclusively in the Services layer.
3. **Protected AI Gateway:** The LLM API key (Gemini / Claude / OpenAI) is stored strictly on the server in environment variables. All prompt engineering, vector/lexical retrieval (RAG), and content moderation occur server-side before streaming text to Tier 1 via Server-Sent Events (SSE).

---

## 2. Authentication & Authorization Lifecycle

EduConnect implements passwordless **Google OAuth 2.0** verification and issues short-lived JWT access tokens paired with refresh tokens.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Client as Tier 1 (Client)
    participant Server as Tier 2 (Server)
    participant Google as Google Identity Services
    participant DB as Tier 3 (Database)

    Student->>Client: Click "Sign in with Google" / One-Click Demo
    Client->>Google: Authenticate & receive Google ID Token (Credential)
    Client->>Server: POST /api/auth/google { credential }
    Server->>Google: Verify ID Token signature & claims (google-auth-library)
    Server->>Server: Validate institutional email domain (ALLOWED_EMAIL_DOMAINS)
    Server->>DB: Find or create User & StudentProfile
    Server->>Server: Issue signed JWT Access Token + httpOnly Refresh Cookie
    Server-->>Client: 200 OK { user, accessToken }
    Client->>Client: Store access token in memory / AuthContext
    alt First Time Student
        Client->>Client: Render OnboardingModal (Branch, Year, USN, Target Roles)
        Client->>Server: POST /api/students/onboarding
        Server->>DB: Update StudentProfile
    end
    Client->>Client: Navigate to /dashboard
```

### Role-Based Access Control (RBAC) Matrix

| Endpoint Route Group | STUDENT | FACULTY | ADMIN | Notes |
| :--- | :---: | :---: | :---: | :--- |
| `GET /api/exams` | ✅ | ✅ | ✅ | Browse published exams |
| `POST /api/exams/:id/start` | ✅ | ✅ | ✅ | Initialize timed exam attempt |
| `PUT /api/exams/attempts/:id/sync` | ✅ | ❌ | ❌ | Auto-save answer selection |
| `POST /api/exams/attempts/:id/submit` | ✅ | ❌ | ❌ | Calculate final score & percentile |
| `GET /api/jobs` | ✅ | ✅ | ✅ | List verified campus drives |
| `POST /api/jobs/:id/report` | ✅ | ✅ | ✅ | Flag broken application links |
| `POST /api/chat/stream` | ✅ | ✅ | ✅ | SSE streaming placement assistant |
| `POST /api/admin/exams` | ❌ | ✅ | ✅ | Author new aptitude modules |
| `POST /api/admin/exams/:id/bulk-csv` | ❌ | ✅ | ✅ | Bulk import MCQs via CSV |
| `POST /api/admin/jobs` | ❌ | ✅ | ✅ | Post and verify job listings |
| `POST /api/admin/newsletters/:id/publish`| ❌ | ❌ | ✅ | Trigger broadcast & email dispatch |
| `GET /api/admin/audit-logs` | ❌ | ❌ | ✅ | Tamper-evident audit log review |
| `GET /api/admin/reports/cohort-export` | ❌ | ✅ | ✅ | Export CSV report of cohort results |

---

## 3. Exam Engine & Auto-Save Synchronization

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Room as ExamRoomPage
    participant API as ExamController & Service
    participant Repo as AttemptRepository
    participant DB as SQLite / PostgreSQL

    Student->>Room: Select Exam & Review Instructions
    Room->>API: POST /api/exams/:id/start
    API->>Repo: Check existing in-progress attempt or create new
    Repo->>DB: INSERT Attempt (status: IN_PROGRESS)
    API-->>Room: Return Attempt details & questions with shuffled order
    Room->>Room: Start countdown timer & palette initialized
    loop Every Answer Selection
        Student->>Room: Select option / Mark for Review
        Room->>API: PUT /api/exams/attempts/:id/sync { questionId, selectedOptionId, isMarkedForReview }
        API->>DB: UPSERT AttemptAnswer (Silent auto-save)
    end
    Student->>Room: Click "Submit Final Exam" or Timer Reaches 00:00
    Room->>API: POST /api/exams/attempts/:id/submit
    API->>API: Compute raw marks, negative penalties (-0.25), accuracy %, percentile
    API->>DB: UPDATE Attempt status: COMPLETED, submittedAt: NOW
    API-->>Room: 200 OK with computed attempt breakdown
    Room->>Room: Redirect to /exams/attempts/:id/review
```

---

## 4. Placement Chatbot RAG Orchestration

```mermaid
flowchart TD
    UserQuery["Student sends query: 'How do I solve Time and Work questions?'"] --> Filter["Guardrails Filter: Is this placement / career related?"]
    Filter -- No --> Reject["Politely decline: 'I specialize strictly in campus placements...'"]
    Filter -- Yes --> RAG["RAG Context Retriever"]
    RAG --> DocSearch["Fetch top 3 relevant Study Materials & Formula Guides"]
    RAG --> ExamSearch["Fetch relevant Aptitude Exam Modules"]
    DocSearch --> Prompt["Compose System Prompt with Grounded Portal Context"]
    ExamSearch --> Prompt
    Prompt --> LLM["Call Backend LLM Gateway (Gemini API)"]
    LLM --> Stream["Server-Sent Events (SSE) Stream to Frontend"]
    Stream --> ClientTypewriter["CampusPrep AI Typewriter View with Resource Citations"]
```

---

## 5. Background Scheduler & Email Service

1. **node-cron Jobs:**
   - **Weekly Newsletter Dispatch (`0 9 * * 1`):** Every Monday at 09:00 AM UTC, scans for scheduled newsletters and dispatches formatted HTML emails via Nodemailer to all opted-in students.
   - **Job Link Health Checker (`0 2 * * *`):** Daily at 02:00 AM UTC, performs HTTP HEAD requests on external job application links. Broken links are flagged as `isExpired = true` and alerted to administrators.
2. **Email Provider Integration:**
   - Pre-configured for standard SMTP (Nodemailer) and compatible with Resend, SendGrid, and AWS SES via environment variables.

---

## 6. Database Entity-Relationship Summary

The data tier comprises 19 relational models:
- **Identity & Profiles:** `User`, `StudentProfile`
- **Aptitude System:** `Exam`, `Question`, `QuestionOption`, `Attempt`, `AttemptAnswer`
- **Career & Jobs:** `JobListing`, `JobBookmark`, `JobReport`
- **Learning Content:** `StudyMaterial`, `MaterialBookmark`, `MaterialProgress`
- **Communications:** `Newsletter`, `NewsletterSubscription`, `Notification`
- **AI Mentorship:** `ChatSession`, `ChatMessage`
- **Governance:** `AuditLog`
