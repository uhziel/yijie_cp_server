# 部署指南

这里以腾讯云CVM(CentOS 7.5 64位)为例子做介绍

``` bash
sudo yum install nodejs
sudo yum install mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo mysql_secure_installation
cd ~
git clone https://github.com/uhziel/yijie_cp_server.git
cd yijie_cp_server/
#执行前先修改下其中的userpasswd。app.js内的privateKey、mysqlPassword也要修改下
./init_mysql.sh
npm install
cp yijie_cp_server.service /etc/systemd/system/
sudo systemctl start yijie_cp_server
sudo systemctl enable yijie_cp_server
```