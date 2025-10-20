# Quick MongoDB Atlas Setup (RECOMMENDED)

## 🚀 Fastest Way to Get Your App Working

1. **Go to MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register

2. **Create FREE account** (takes 2 minutes)

3. **Create FREE cluster** (M0 Sandbox - forever free)

4. **Create database user**:
   - Username: `mindbot`
   - Password: (generate strong password)
   - Save this password!

5. **Allow network access**:
   - Click "Network Access"
   - Add IP: "Allow Access from Anywhere"

6. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password

7. **Create `.env` file** in project root:
   ```
   MONGODB_URI=mongodb+srv://mindbot:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mindbot?retryWrites=true&w=majority
   GROQ_API_KEY=your_groq_api_key_here
   JWT_SECRET=your-secure-random-secret-key
   ```

8. **Restart server**: `npm run dev`

## ✅ Done! Your app will now have:
- User authentication
- Chat history saved
- Mood tracking
- Clinical notes
- All features enabled

---

**Total time: 5-10 minutes** ⏱️
