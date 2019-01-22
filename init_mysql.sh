#!/bin/bash
# via https://raw.githubusercontent.com/saadismail/useful-bash-scripts/master/db.sh

set -e

echo "请输入MySQL root用户密码："
read -s rootpasswd

dbname="pay"
username="cp_user"
userpasswd="FRMULy2FBzhcCc";

echo "创建数据库 ${dbname}..."
mysql -uroot -p${rootpasswd} -e "CREATE DATABASE ${dbname};"
echo "数据库创建成功!"
echo "显示已存在的数据库..."
mysql -uroot -p${rootpasswd} -e "show databases;"
echo ""

echo "创建订单表..."
mysql -uroot -p${rootpasswd} -e "CREATE TABLE IF NOT EXISTS ${dbname}.orders (
    id INT AUTO_INCREMENT,
    app VARCHAR(255) NOT NULL,
    cbi VARCHAR(255) NOT NULL,
    ct TIMESTAMP NOT NULL,
    fee INT NOT NULL,
    pt TIMESTAMP NOT NULL,
    sdk VARCHAR(255) NOT NULL,
    ssid VARCHAR(255) NOT NULL,
    st INT NOT NULL,
    tcd VARCHAR(255) NOT NULL,
    uid VARCHAR(255) NOT NULL,
    ver VARCHAR(32) NOT NULL,
    taked INT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (tcd)
) ENGINE=INNODB;"

echo "创建新用户..."
mysql -uroot -p${rootpasswd} -e "CREATE USER ${username}@'%' IDENTIFIED WITH mysql_native_password BY '${userpasswd}';"
echo "用户创建成功!"
echo ""
echo "授予${dbname}的所有权限给用户${username}!" | grep -v "Using a password"
mysql -uroot -p${rootpasswd} -e "GRANT ALL PRIVILEGES ON ${dbname}.* TO '${username}'@'%';"
mysql -uroot -p${rootpasswd} -e "FLUSH PRIVILEGES;" | grep -v "Using a password"
echo "执行完毕"