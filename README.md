# 🚀 Flatlogic Node.js Backend - Free but Outdated!

[More Templates](https://flatlogic.com/templates) | [Discord Community](https://discord.gg/flatlogic-community) | [Support Forum](https://flatlogic.com/forum)

**Heads up! 🚨** This backend is a bit old-school now. For a more up-to-date, efficient, and customizable experience, generate a fresh one with our [Flatlogic Generator](https://flatlogic.com/generator). It's way better. 😉

---

## 🚀 Quick Start

#### 1. Install dependencies:
```bash
yarn install
```

---

#### 2. Adjust local database:

**Step 1: Install PostgreSQL**

- **MacOS:**  
  ```bash
  brew install postgres
  ```
- **Ubuntu:**  
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  ```

**Step 2: Create database and user:**

```bash
psql -U postgres
```

Then run the following commands inside PostgreSQL:
```sql
CREATE DATABASE development OWNER postgres;
\q
```

---

#### 3. Setup database tables:
```bash
yarn reset
```

#### 4. Start development server:
```bash
yarn start:dev
```

#### 5. Start production build:
```bash
yarn start
```

> **Pro Tip:** If you run into issues, it might be time to check out the Flatlogic Generator instead. 😉

---

## 📜 API Documentation (Swagger)

Once running, check the API docs here:
- [http://localhost:8080/api-docs](http://localhost:8080/api-docs) (Local)
- [http://host_name/api-docs](http://host_name/api-docs) (Production)

---

## 🐳 Docker Support

If you'd rather run the backend via Docker, follow these steps:

1. Ensure PostgreSQL is installed as described above.
2. Build the Docker image:
   ```bash
   docker build -t um-backend-image .
   ```
3. Run a container:
   ```bash
   docker run -p 8080:8080 -d um-backend-image
   ```
4. Access the API at:
   ```bash
   http://localhost:8080/api
   ```

---

## 🔥 About Flatlogic
[Flatlogic](https://flatlogic.com/ai-software-development-agent) builds modern business software so you don't have to. Our AI Software Development Agent helps you generate, deploy, and maintain enterprise applications with minimal effort.

---

## 📜 License
This backend is free to use, but seriously, consider upgrading with the Flatlogic Generator. 😎

---

> **Questions or feedback?**  
> Join our [Flatlogic Community Discord](https://discord.gg/flatlogic-community) or visit our [support forum](https://flatlogic.com/forum).
