# Tepis Clover Notes API

Express + TypeScript API for the Tepis Clover Notes CMS.

## Included
- Firebase Admin authentication and Firestore access
- CMS roles: owner, admin, editor, viewer
- Content CRUD and archive endpoints
- Audit logging
- Cloudinary signed image uploads
- Health endpoint: `/health`
- Vercel zero-config `src/server.ts`

## Required Vercel environment variables
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- CLOUDINARY_UPLOAD_PRESET
- CMS_ORIGIN (add after the CMS gets its production URL)

## Vercel
Use the Express/Node application preset if shown. Keep Build Command,
Output Directory, and Install Command on their defaults.

This revision removes the Helmet dependency that caused a TypeScript
NodeNext import error during Vercel builds. Equivalent basic security
headers are set directly in `src/server.ts`.

## Workbook migration
Owner-only endpoints:
- `GET /api/migration/definitions`
- `POST /api/migration/import`

The CMS Migration page reads the legacy `.xlsx` workbook in the browser and imports approved sheets to Firestore in batches while preserving legacy IDs. `CMS_USERS` and `CHANGE_LOG` are intentionally not imported.
