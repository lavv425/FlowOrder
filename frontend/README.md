#### Frontend

### Prerequisites

- Node.js and npm installed.

1. **Install Dependencies**:
   Navigate to the `/frontend/` directory and run:

   ```bash
   npm install
   ```

2. **Update Configuration (If Necessary)**:

   - Modify `/Frontend/src/Constants/Endpoints.tsx` to set the correct `BASE_URL` for the Routify backend.
     Example:
     ```typescript
     export const BASE_URL = "http://127.0.0.1:8080/api";
     ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
