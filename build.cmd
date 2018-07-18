@echo off

del build\*.* /Q
xcopy src build /Y /S

copy README.md build /Y
copy package.json build /Y

node .\node_modules\webpack\bin\webpack.js --optimize-minimize --mode production