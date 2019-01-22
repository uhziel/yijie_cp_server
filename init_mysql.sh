#!/bin/bash
# via https://raw.githubusercontent.com/saadismail/useful-bash-scripts/master/db.sh

set -e

echo "请输入MySQL root用户密码："
read -s rootpasswd

dbname="pay"
username="cp_user"
userpasswd="FRMULy2FBzhcCc";

echo "创建数据库 ${dbname}..."
mysql -uroot -p${rootpasswd} < pay.sql
echo "数据库创建成功!"

echo "创建新用户..."
mysql -uroot -p${rootpasswd} -e "CREATE USER ${username}@'localhost' IDENTIFIED WITH mysql_native_password BY '${userpasswd}';"
echo "用户创建成功!"
echo ""
echo "授予${dbname}的所有权限给用户${username}!" | grep -v "Using a password"
mysql -uroot -p${rootpasswd} -e "GRANT ALL PRIVILEGES ON ${dbname}.* TO '${username}'@'localhost';"
mysql -uroot -p${rootpasswd} -e "FLUSH PRIVILEGES;" | grep -v "Using a password"
echo "执行完毕"