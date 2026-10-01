# Public website bridge

This API revision adds an unauthenticated **read-only** endpoint:

`GET /public/bootstrap`

It returns the legacy public Bootstrap shape expected by the existing Next.js website while reading from Firestore collections migrated from Google Sheets.

CMS routes under `/api/*` remain protected by Firebase Authentication.

The public endpoint filters disabled/archived/draft records and exposes only public content collections. It does not expose `cms_users`, `audit_logs`, or migration/admin data.
