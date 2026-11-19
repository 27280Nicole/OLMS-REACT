# Online Learning Management System - React version (Part 2)

This version now writes real changes to the JSON files, the same as
the HTML/CSS/JS version, using a small Express API server.

## Running it (two terminals)

Terminal 1 - the API server (reads/writes public/data/*.json):
1. npm.cmd install     (once)
2. npm.cmd run server
3. Leave it running - it prints "API server running at http://localhost:4000"

Terminal 2 - the React app itself:
1. npm.cmd run dev
2. Open the address it prints (usually http://localhost:5173)

Both terminals need to stay open at the same time. Vite automatically
forwards any /api/... request to the server in Terminal 1 (see the
"proxy" setting in vite.config.js), so the browser only ever talks to
port 5173.

## Demo accounts
- Student:    alice@example.com / student123
- Instructor: bob@example.com / teach123

## Proving the JSON files really update
1. Open public/data/users.json in a text editor.
2. Register a new account in the app.
3. Reload the file in your editor - the new account is really there.
Same idea for public/data/enrollments.json after enrolling in a course.
