# Meta Chatting Application

Meta Chatting Application is a real-time messaging platform that allows users to chat, share ideas, and stay connected. It provides a simple and intuitive interface for seamless communication.

🚀 **Live Demo**  
You can try a live version of Meta Chatting Application here: `[Add your live demo link]`

🛠️ **Tech Stack**  
React, Next.js, Node.js, Express, MongoDB/PostgreSQL, Socket.IO/Firebase

✨ **Key Features**  
- Real-time one-to-one chat  
- User authentication 
- Message timestamps 
- Responsive design for desktop and mobile  
- Dark and light theme support  

# Setup — Meta Chatting Application

1. Clone the repository and enter the project folder

```bash
git clone https://github.com/sahitya-chandra/meta.git
cd meta
```

2. Install all project dependencies (single root install)

```bash
npm install
```


3. ENV 

 **Web** 

 Create a `.env` file in the web in app with required environment variables

GITHUB_CLIENT_ID="Your client id"
GITHUB_CLIENT_SECRET="Your secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:4000"

 **DB** -

Create .env in the prisma -
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb"


[ npx auth secret for AUTH_SECRET ]

4. 

```bash
npx prisma migrate dev --name init
```


5. Start the development server

```bash
npm run dev
```

6. Open the application in your browser

```text
http://localhost:3000
```

7. Contributing workflow (quick commands)

```bash
# fork -> clone -> create branch -> make changes -> push -> open PR
git checkout -b feature/your-feature
git add .
git commit -m "feat: short description"
git push origin feature/your-feature
```



👨‍💻 Authors

Sahitya && 
Divyanshu 

📄 License
This project is licensed under the MIT License.
