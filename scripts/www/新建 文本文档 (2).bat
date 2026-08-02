@echo off
chcp 65001 >nul
echo =====================================
echo    Nutrition Workbench 本地服务启动
echo =====================================
echo.
:: 切换到项目目录，修改引号内路径为你本机 nutrition-workbench 文件夹路径
cd /d "D:\你的文件夹\nutrition-workbench"
echo 正在启动静态服务 端口8080
echo 本机访问：http://localhost:8080
echo 手机同WiFi：http://【192.168.1.106】:8080
echo.
echo 关闭此窗口即停止服务
echo.
npx serve . -p 8080
pause