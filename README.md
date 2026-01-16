## Node version
18.20.8

## Start frontend 
cd client
npm i 
npm run dev

## start backend
cd server
npm i 
npm run start:dev


## Backend env file
MONGODB_URI= mongodb url
FRONTEND_URL=frontend url
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SENDGRID_API_KEY=sendgrid api key
SMTP_FROM=sendgrid verified email
STRIPE_SECRET_KEY=stripe secret key for testing


## Frontend env file
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=google client id
GOOGLE_CLIENT_SECRET=goggle client secret key 
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY= stripe publishable key~
NEXT_PUBLIC_BACKEND_URL= backend url