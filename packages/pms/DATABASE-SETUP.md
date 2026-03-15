# PMS Database Configuration Guide

## Current Setup: SQLite (Local Development)

Your PMS is configured with **SQLite** for local development, which requires no additional setup beyond Python.

### Quick Start

```bash
cd packages/pms
python -m venv venv

# Windows
venv\Scripts\activate.bat

# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database (already done)
flask db upgrade

# Start the application
python app.py
```

The PMS will be available at: `http://localhost:5000`

### Database File

- **Location**: `packages/pms/sandbox_pms.db`
- **Size**: ~270 KB (SQLite file-based database)
- **Backup**: Simply copy the `.db` file to backup your data

## Configuration Files

### `.env` - Local Development Settings
```
DATABASE_URL=sqlite:///sandbox_pms.db
APP_ENV=development
ADMIN_EMAIL=admin@sandbox.local
ADMIN_PASSWORD=admin@123
```

Edit `.env` to customize settings:
- Admin credentials
- Email configuration (SMTP)
- Security settings
- Session timeouts

## Database Schema

The SQLite database includes complete schema for:

- **Phase 2**: Data layer & operating data
  - Users, roles, permissions (RBAC)
  - Rooms, room types, housekeeping statuses
  - Rate rules, inventory management
  
- **Phase 3**: Staff authentication & authorization
  - User sessions, password reset tokens
  - MFA factors and recovery codes
  - Activity logging and audit trails
  
- **Phase 4**: Public booking flow
  - Guests, reservations
  - Reservation holds and review queues
  - Cancellation and modification requests
  
- **Phase 5-12**: Full operational features
  - Staff reservations workspace
  - Front-desk check-in/check-out
  - Housekeeping operations
  - Cashier and folio management
  - Payment integration
  - Admin configuration
  - Notifications & communications
  - Manager reporting

## Upgrading to PostgreSQL (Production)

When ready for production, upgrade to PostgreSQL:

### 1. Install PostgreSQL
```bash
# Windows
winget install PostgreSQL

# macOS
brew install postgresql@15

# Linux
sudo apt-get install postgresql postgresql-contrib
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create hotel database
CREATE DATABASE sandbox_hotel_pms OWNER sandbox;
CREATE USER sandbox WITH PASSWORD 'sandbox_password';
ALTER ROLE sandbox SET client_encoding TO 'utf8';
ALTER ROLE sandbox SET default_transaction_isolation TO 'read committed';
ALTER ROLE sandbox SET default_transaction_deferrable TO on;
ALTER ROLE sandbox SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE sandbox_hotel_pms TO sandbox;
```

### 3. Update `.env`
```
DATABASE_URL=postgresql+psycopg://sandbox:sandbox_password@localhost/sandbox_hotel_pms
```

### 4. Run Migrations
```bash
flask db upgrade
```

## Database Migrations

### View Migration Status
```bash
# Activate venv
# Windows
venv\Scripts\activate.bat
# macOS/Linux
source venv/bin/activate

# Check migrations
flask db history
```

### Create New Migration
```bash
flask db migrate -m "Description of changes"
flask db upgrade
```

### Rollback Migration
```bash
flask db downgrade
```

## Backup & Restore

### SQLite Backup
```bash
# Windows
copy packages\pms\sandbox_pms.db packages\pms\sandbox_pms.db.backup

# macOS/Linux
cp packages/pms/sandbox_pms.db packages/pms/sandbox_pms.db.backup
```

### SQLite Restore
```bash
# Windows
copy packages\pms\sandbox_pms.db.backup packages\pms\sandbox_pms.db

# macOS/Linux
cp packages/pms/sandbox_pms.db.backup packages/pms/sandbox_pms.db
```

### PostgreSQL Backup
```bash
pg_dump -U sandbox -h localhost sandbox_hotel_pms > backup.sql
```

### PostgreSQL Restore
```bash
psql -U sandbox -h localhost sandbox_hotel_pms < backup.sql
```

## Testing

Run the test suite:
```bash
pytest tests/
```

Test coverage:
- Phase 2: Data layer (test_phase2_data_layer.py)
- Phase 3: Auth & authorization (test_phase3_auth.py)
- Phase 4: Public booking (test_phase4_public_booking.py)
- Phase 5: Staff reservations (test_phase5_staff_reservations_workspace.py)
- Phase 6: Front desk (test_phase6_front_desk_workspace.py)
- Phase 7: Housekeeping (test_phase7_housekeeping.py)
- Phase 8: Cashier (test_phase8_cashier.py)
- Phase 9: Payments (test_phase9_hosted_payments.py)
- Phase 10: Admin (test_phase10_admin_panel.py)
- Phase 11: Communications (test_phase11_communications.py)
- Phase 12: Reporting (test_phase12_reporting.py)

## Troubleshooting

### Database Lock Error
SQLite can have locking issues with concurrent access.
- Stop the app
- Delete `sandbox_pms.db`
- Run `flask db upgrade` again

### Migration Issues
```bash
# Reset to fresh state
rm sandbox_pms.db
flask db upgrade
```

### Connection Errors
- Check `DATABASE_URL` in `.env`
- Verify database file exists
- Check file permissions

## Environment Variables Reference

```
# Database
DATABASE_URL                    SQLite or PostgreSQL connection string
TEST_DATABASE_URL              Database for running tests

# Application
APP_ENV                         development | production
SECRET_KEY                      Flask secret key (change in production)
ADMIN_EMAIL                     Initial admin email address
ADMIN_PASSWORD                  Initial admin password

# Schema
AUTO_BOOTSTRAP_SCHEMA          Set to 1 to auto-create schema on startup
AUTO_SEED_REFERENCE_DATA       Set to 1 to auto-seed initial data
INVENTORY_BOOTSTRAP_DAYS       Days to bootstrap inventory (default 730)
```

See `.env.example` for all available configuration options.
