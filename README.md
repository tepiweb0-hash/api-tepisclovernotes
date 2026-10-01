# Tepis Clover Notes API

Express + TypeScript backend for the Tepis Clover Notes CMS.

## Services

- Firebase Admin SDK: authentication token verification + Firestore
- Cloudinary: signed image uploads
- Vercel: API deployment

## Vercel environment variables

Required:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_PRESET`

Also set `CMS_ORIGIN` to the deployed CMS origin. It supports comma-separated origins, for example:

`https://cms-tepisclovernotes.vercel.app,https://cms.tepisclovernotes.com`

Do not commit `.env` files or Firebase service-account JSON files.

## Routes

Public:

- `GET /`
- `GET /health`

Authenticated CMS:

- `GET /api/bootstrap`
- `GET /api/content/:collection`
- `POST /api/content/:collection`
- `PATCH /api/content/:collection/:id`
- `POST /api/content/:collection/:id/archive`
- `POST /api/media/signature`
- `POST /api/media/register`


## Build fix
This version normalizes Express 5 route params before passing them to Firestore helpers, fixing Vercel TypeScript build errors where route params may be typed as `string | string[]`.
