@echo off

echo Pushing to main remote...
git push main master
if %ERRORLEVEL%==0 (
    echo Successfully pushed to main.
) else (
    echo Failed to push to main.
    exit /b 1
)

echo Pushing to clone remote...
git push clone master --force
if %ERRORLEVEL%==0 (
    echo Successfully pushed to clone.
) else (
    echo Failed to push to clone.
    exit /b 1
)

echo All pushes completed successfully!
pause
