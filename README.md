# Salina

**The Operating System for Student Organizations.**

Salina solves the "Pipeline Problem" for student organizations. It replaces fragmented Google Forms and spreadsheets with a unified, configurable SaaS platform for recruitment, membership management, and internal operations.

## The Problem

Student organizations struggle to manage recruitment data. Distinct workflows (mass registration vs. strict officer screening) are forced into rigid tools. This results in lost applicants and fragmented records.

## The Solution: 3 Core Modules

### 1. The Gate (Recruitment Engine)

* **Dynamic Pipelines:** Defined via JSON configuration.
* **White-Label Forms:** UI adapts to tenant branding (colors, logos).
* **Automated Transitions:** Applicants move from "Guest" to "Member" upon acceptance.

### 2. The Roster (Member Management)

* **Live Database:** Replaces static Excel sheets.
* **Role-Based Access:** Distinguishes between Officers, Members, and Advisers.
* **Digital ID:** Generates QR codes for member verification.

### 3. The Pulse (Internal Operations)

* **Private Feed:** Internal announcements and engagement (powered by Supabase RLS).
* **Event Check-ins:** QR scanning for attendance tracking.
* **Analytics:** Real-time visibility on member activity.

---

## Tech Stack

* **Frontend:** React / Next.js
* **Backend:** Supabase (Auth, Database, Realtime)
* **Styling:** Tailwind CSS
* **Origin:** Mirror of [Tambayan](https://github.com/kemdav/Tambayan)

## Local Development

1. **Clone the repository**

    ```bash
    git clone [https://github.com/YOUR_USERNAME/Salina.git](https://github.com/YOUR_USERNAME/Salina.git)
    cd Salina
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
    Create a `.env.local` file. Add your distinct Supabase credentials. **Do not use the Tambayan keys.**

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
    ```

4. **Run the server**

    ```bash
    npm run dev
    ```

## License

Proprietary. All rights reserved.
