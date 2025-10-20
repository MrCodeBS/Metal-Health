# MongoDB Setup Guide for Mental Health Assistant

Your application **requires MongoDB** for full functionality including:
- ✅ User authentication & registration
- ✅ Chat history persistence
- ✅ Mood tracking over time
- ✅ Personality assessment results
- ✅ Clinical notes generation for therapists

## Option 1: MongoDB Atlas (Cloud - FREE & RECOMMENDED)

This is the easiest option and requires no local installation.

### Steps:

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google

2. **Create Free Cluster**
   - Choose "Free Shared Cluster" (M0 Sandbox)
   - Select a cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `mindbot`
   - Password: (generate a strong password, save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string (looks like):
     ```
     mongodb+srv://mindbot:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

6. **Create .env File**
   - In your project root, create a file named `.env`
   - Add this line (with YOUR connection string):
     ```
     MONGODB_URI=mongodb+srv://mindbot:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mindbot?retryWrites=true&w=majority
     GROQ_API_KEY=your_groq_api_key_here
     JWT_SECRET=your-secure-random-secret-key-here
     ```

7. **Restart Server**
   ```powershell
   npm run dev
   ```

---

## Option 2: Install MongoDB Locally (Windows)

If you prefer running MongoDB on your machine:

### Quick Install with Chocolatey:
```powershell
# Install Chocolatey if you don't have it
# Then:
choco install mongodb
```

### Manual Install:
1. Download from: https://www.mongodb.com/try/download/community
2. Choose Windows, MSI installer
3. Run installer, choose "Complete" installation
4. Check "Install MongoDB as a Service"
5. Check "Install MongoDB Compass" (GUI tool)

### Start MongoDB Service:
```powershell
net start MongoDB
```

### Stop MongoDB Service:
```powershell
net stop MongoDB
```

---

## Verify Connection

Once MongoDB is set up, restart your server:
```powershell
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ MindBot server running on http://127.0.0.1:3000
```

---

## Troubleshooting

### "ECONNREFUSED" Error
- MongoDB Atlas: Check network access allows your IP
- MongoDB Atlas: Verify username/password are correct
- Local MongoDB: Make sure service is running (`net start MongoDB`)

### "Authentication failed"
- Check username and password in connection string
- Make sure database user was created with correct permissions

### Still having issues?
Check the connection string format:
```
mongodb+srv://USERNAME:PASSWORD@cluster.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

---

## Why MongoDB is Essential for This App

1. **User Sessions** - Maintains user accounts and secure authentication
2. **Chat History** - Saves conversations for continuity and analysis
3. **Mood Tracking** - Tracks emotional patterns over weeks/months
4. **Clinical Notes** - Generates professional notes for therapists
5. **Personality Data** - Stores Big Five assessment results
6. **Data Analytics** - Enables trend analysis and insights

Without MongoDB, the app would lose all data on restart and couldn't provide personalized, continuous care.

---

**Recommendation:** Use MongoDB Atlas (Option 1) - it's free, reliable, and no local installation needed!
