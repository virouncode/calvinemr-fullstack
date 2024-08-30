**CALVIN EMR (Electronic Medical Records)**

Calvin EMR is a SaaS platform designed to help practitioners efficiently manage patient medical records and appointments within a medical clinic.

**Key Features:**
- Calendar
- EMR Management
- Messaging
- Faxing
- SMS Sending
- AI Assistant
- Billing Generation
- Comprehensive Patient Chart Export (PDF or XML)
- Prescription Assistance with Medication Templates
- Patient Portal
- Admin Portal with Dashboard

The application features a React/Vite frontend and a Node/Express backend, deployed on Heroku. The database, which stores clinic and patient data, is managed by Xano, a no-code, HIPAA-compliant backend/ORM platform that automatically generates CRUD endpoints.

Each clinic is provided with a unique app and a separate database.

**To start the reference app:**
1. Clone the repository: `git clone https://github.com/virouncode/calvinemr-fullstack.git`
2. Navigate to the project directory.
3. Run the following commands:
   ```bash
   pnpm install
   cd client
   pnpm install
   cd ../server
   pnpm install
   cd ..
   pnpm start
   ```
4. Open your web browser and go to: `http://localhost:5173`
5. Log in using the following credentials:
   - **As a staff member:**
     - Email: `staffguest@calvinemr.com`
     - Password: `Staffguest1@`
     - PIN: `1234`
   - **As a patient:**
     - Email: `patientguest@calvinemr.com`
     - Password: `Patientguest2@`
     - PIN: `1234`
