# ISL Connect - Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- MongoDB (local or Atlas)

## Backend Setup

### 1. Install Node Dependencies
```bash
cd isslconnect
npm install
```

### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Variables
Create/Update `.env` file in `isslconnect/` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
PORT=3002
REACT_APP_PORT=5173
ISL_DATASET_PATH=path_to_your_dataset
USE_ONLINE_DATASET=false
```

### 4. Download ISL Dataset
```bash
python download_isl_dataset.py
```
Or manually download from: https://www.kaggle.com/datasets/prathumarikeri/indian-sign-language-isl

Update `ISL_DATASET_PATH` in `.env` with the downloaded path.

## Running the Application

### Start Backend Server (Node.js)
```bash
cd backend
node server.js
```
Backend will run on: http://localhost:3002

### Start Python Flask Server
```bash
python app.py
```
Flask will run on: http://localhost:5000

### Start Frontend (React)
```bash
npm run dev
```
Frontend will run on: http://localhost:5173

## Common Issues & Solutions

### Issue 1: Cannot find module './routes/videos'
**Solution:**
- Make sure you're in the correct directory: `cd backend`
- Check if `routes/videos.js` file exists
- Try: `npm install` again
- On Windows, check file path case sensitivity

### Issue 2: Module not found errors
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: Python packages not found
**Solution:**
```bash
pip install -r requirements.txt
```

### Issue 4: Dataset not found
**Solution:**
- Download dataset using `python download_isl_dataset.py`
- Or update `ISL_DATASET_PATH` in `.env` to correct path
- Make sure path uses forward slashes or escaped backslashes

### Issue 5: Port already in use
**Solution:**
```bash
# Windows - Kill process on port 3002
netstat -ano | findstr :3002
taskkill /PID <PID_NUMBER> /F

# Or change PORT in .env file
```

## Project Structure
```
isslconnect/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
├── src/
│   ├── components/
│   └── App.js
├── public/
├── .env
├── app.py (Flask server)
├── package.json
└── requirements.txt
```

## Important Notes
1. Always run backend server from `backend/` directory
2. Run Python server from `isslconnect/` directory
3. Run frontend from `isslconnect/` directory
4. Make sure all three servers are running simultaneously
5. Check `.env` file paths are correct for your system

## Support
If you face any issues, check:
1. All dependencies are installed
2. `.env` file is configured correctly
3. MongoDB is running
4. Ports 3002, 5000, and 5173 are available
5. Dataset path is correct
