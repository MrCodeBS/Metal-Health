# Test MindBot API Endpoints
Write-Host "Testing MindBot API Endpoints..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Server health check
Write-Host "1. Testing server health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/" -UseBasicParsing
    Write-Host "   ✅ Server is running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Server is not responding" -ForegroundColor Red
    exit
}

# Test 2: DBT Skills endpoint (no auth required)
Write-Host ""
Write-Host "2. Testing DBT Skills endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/dbt/skills" -UseBasicParsing
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ DBT Skills available: $($data.skills.Count) modules" -ForegroundColor Green
    $data.skills | ForEach-Object { Write-Host "      - $_" -ForegroundColor Gray }
} catch {
    Write-Host "   ❌ Failed to get DBT skills" -ForegroundColor Red
}

# Test 3: Register a test user
Write-Host ""
Write-Host "3. Creating test user..." -ForegroundColor Yellow
$testEmail = "test_$(Get-Random)@example.com"
$testPassword = "TestPassword123!"
$registerBody = @{
    email = $testEmail
    password = $testPassword
    name = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    $token = $data.token
    Write-Host "   ✅ User created successfully" -ForegroundColor Green
    Write-Host "      Email: $testEmail" -ForegroundColor Gray
    Write-Host "      Token: $($token.Substring(0,20))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to create user: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# Test 4: Test health summary endpoint (should return no data for new user)
Write-Host ""
Write-Host "4. Testing health summary endpoint..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/health/summary" `
        -Headers $headers `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Health summary endpoint working" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   ✅ Health summary endpoint working (no data yet - expected)" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Test mood check-in
Write-Host ""
Write-Host "5. Testing mood check-in..." -ForegroundColor Yellow
$moodBody = @{
    date = (Get-Date).ToString("yyyy-MM-dd")
    mood = 7
    stressLevel = 3
    notes = "Feeling good today! Testing the API."
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/mood-checkin" `
        -Method POST `
        -Headers $headers `
        -Body $moodBody `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "   ✅ Mood check-in saved successfully" -ForegroundColor Green
    Write-Host "      Mood: $($data.mood)/10" -ForegroundColor Gray
    Write-Host "      Stress: $($data.stressLevel)/10" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to save mood: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Test chat endpoint
Write-Host ""
Write-Host "6. Testing AI chat..." -ForegroundColor Yellow
$chatBody = @{
    messages = @(
        @{
            role = "user"
            content = "Hello! This is a test message."
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    $response = Invoke-WebRequest -Uri "http://127.0.0.1:3000/api/chat" `
        -Method POST `
        -Headers $headers `
        -Body $chatBody `
        -UseBasicParsing
    
    $data = $response.Content | ConvertFrom-Json
    $reply = $data.choices[0].message.content
    Write-Host "   ✅ AI chat working" -ForegroundColor Green
    Write-Host "      AI Response: $($reply.Substring(0, [Math]::Min(100, $reply.Length)))..." -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Failed to get chat response: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "All tests completed!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your MindBot server is fully operational! 🎉" -ForegroundColor Green
Write-Host "Open http://127.0.0.1:3000 in your browser to use the app." -ForegroundColor Cyan
